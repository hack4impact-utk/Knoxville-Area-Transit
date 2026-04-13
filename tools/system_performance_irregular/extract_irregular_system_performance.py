from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Optional

import pandas as pd


@dataclass
class ExtractResult:
    system_performance_summary: pd.DataFrame
    current_period: pd.DataFrame
    prior_year: pd.DataFrame
    fytd: pd.DataFrame
    warnings: list[str]
    notes: dict[str, Any]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _is_truthy_cell(v: Any) -> bool:
    if v is None:
        return False
    if isinstance(v, float) and pd.isna(v):
        return False
    if isinstance(v, str) and not v.strip():
        return False
    return True


def _normalize_label(v: Any) -> str:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return ""
    return str(v).strip()


def _best_effort_numeric(v: Any) -> Any:
    if isinstance(v, float) and pd.isna(v):
        return None
    if isinstance(v, (int, float)):
        return v
    if isinstance(v, str):
        s0 = v.strip()
        if s0 in {"", "-", "—", "–", "n/a", "N/A"}:
            return None
        # Handle common accounting formats:
        # - "$ 1,234.56"
        # - "($ 1,234.56)" or "(1,234.56)" for negatives
        s = s0.replace("\u00a0", " ")  # nbsp
        s = re.sub(r"\s+", " ", s).strip()
        neg = False
        if s.startswith("(") and s.endswith(")"):
            neg = True
            s = s[1:-1].strip()
        s = s.replace("$", "").strip()
        s = s.replace(",", "")
        try:
            x = float(s)
            return -x if neg else x
        except ValueError:
            return s0
    return v


def _html_to_raw_dfs(path: Path) -> list[pd.DataFrame]:
    """
    Parse HTML exported from spreadsheets (PhpSpreadsheet, Excel, Google Sheets, etc.)
    into one or more raw grid DataFrames.
    """
    tables = pd.read_html(path, header=None, flavor="lxml", keep_default_na=False)
    raw_dfs: list[pd.DataFrame] = []
    for t in tables:
        # Ensure object dtype and normalize whitespace-y blanks.
        df = t.astype(object)
        df = df.replace({"\u00a0": "", "&nbsp;": ""})
        raw_dfs.append(df)
    return raw_dfs


def _find_header_row(
    df: pd.DataFrame, required_tokens: Iterable[str], max_scan_rows: int = 80
) -> Optional[int]:
    tokens = [t.lower() for t in required_tokens]
    scan_n = min(len(df), max_scan_rows)
    for r in range(scan_n):
        row_vals = [str(x).lower() for x in df.iloc[r].tolist() if _is_truthy_cell(x)]
        hay = " ".join(row_vals)
        if all(t in hay for t in tokens):
            return r
    return None


def _sheet_to_raw_df(xls: pd.ExcelFile, sheet_name: str) -> pd.DataFrame:
    # Read as "raw grid" with no inferred header.
    return pd.read_excel(xls, sheet_name=sheet_name, header=None, dtype=object)


def _csv_to_raw_df(path: Path) -> pd.DataFrame:
    # CSV exports are often already rectangular; still treat as raw.
    return pd.read_csv(path, header=None, dtype=object, engine="python")


def _diagnostics_for_raw_df(name: str, raw: pd.DataFrame) -> str:
    out: list[str] = []
    out.append(f"== {name} ==")
    out.append(f"shape: {raw.shape[0]} x {raw.shape[1]}")
    out.append("non-null counts (first 40 cols):")
    nn = raw.notna().sum(axis=0).iloc[:40].tolist()
    out.append("  " + ", ".join(str(x) for x in nn))
    out.append("head(10):")
    head = raw.head(10).fillna("").astype(str)
    for _, row in head.iterrows():
        vals = [v for v in row.tolist()]
        out.append("  " + " | ".join(vals[:40]))
    out.append("")
    return "\n".join(out)


def _extract_tables_from_raw(
    raw: pd.DataFrame, source_name: str, warnings: list[str]
) -> dict[str, pd.DataFrame]:
    """
    Heuristic extraction approach:
    - Treat first column as metric label when it looks like text.
    - Identify a header row containing tokens like "Current" / "Prior" / "FYTD" if present.
    - If no header row found, fall back to scanning for known section labels and extracting nearby numeric columns.

    Output tables are returned in a *wide-ish* format and later normalized.
    """

    # Special-case: Summary-style grids often have "This Year" / "Last Year" / "Variance" headers.
    # Your October workbook uses this instead of "Current/Prior/FYTD" as column headers.
    header_this_last = _find_header_row(raw, required_tokens=["this year", "last year"])
    if header_this_last is not None:
        return {"summary_grid": raw}

    # Try to find a tabular region with period columns.
    header_idx = _find_header_row(raw, required_tokens=["current"])
    if header_idx is None:
        # Some sheets label periods as "Current Period" or month names.
        header_idx = _find_header_row(raw, required_tokens=["prior"]) or _find_header_row(
            raw, required_tokens=["fytd"]
        )

    if header_idx is not None:
        header = raw.iloc[header_idx].tolist()
        data = raw.iloc[header_idx + 1 :].copy()
        data.columns = [str(_normalize_label(h)) for h in header]
        # Drop completely empty columns.
        data = data.loc[:, data.notna().any(axis=0)]
        # Drop completely empty rows.
        data = data.loc[data.notna().any(axis=1)]
        return {"tabular": data}

    warnings.append(
        f"[{source_name}] Could not find a header row containing period tokens; using fallback extraction."
    )

    # Fallback: Build a very simple 2+ column table: metric label + up to 6 numeric-ish columns.
    metric_col = raw.iloc[:, 0].map(_normalize_label)
    numeric_like_cols: list[int] = []
    for c in range(1, min(raw.shape[1], 12)):
        col = raw.iloc[:, c]
        nn = col.dropna()
        if len(nn) == 0:
            continue
        # Consider column numeric-like if at least 50% of non-nulls parse as numbers.
        parsed = nn.map(_best_effort_numeric)
        num_count = sum(isinstance(x, (int, float)) for x in parsed.tolist())
        if num_count / max(1, len(parsed)) >= 0.5:
            numeric_like_cols.append(c)

    if not numeric_like_cols:
        warnings.append(f"[{source_name}] No numeric-like columns detected in first 12 columns.")
        empty = pd.DataFrame()
        return {"fallback": empty}

    take_cols = [0] + numeric_like_cols[:6]
    df = raw.iloc[:, take_cols].copy()
    df.columns = ["Metric"] + [f"Value_{i}" for i in range(1, df.shape[1])]
    df = df.loc[df.notna().any(axis=1)]
    df["Metric"] = metric_col
    df = df[df["Metric"].astype(str).str.len() > 0]
    return {"fallback": df}


def _normalize_extracted(
    extracted: dict[str, pd.DataFrame], source_name: str, warnings: list[str]
) -> ExtractResult:
    """
    Convert extracted raw tables into the 4 requested outputs.
    This is deliberately heuristic: we try to detect columns for:
    - current-period
    - prior-year
    - FYTD

    If we cannot detect them, we still produce DataFrames but add warnings.
    """
    notes: dict[str, Any] = {"source": source_name, "strategy": list(extracted.keys())}

    if "summary_grid" in extracted and not extracted["summary_grid"].empty:
        raw = extracted["summary_grid"].copy()
        # Locate the header row containing "This Year" and "Last Year".
        hdr = _find_header_row(raw, required_tokens=["this year", "last year"])
        if hdr is None:
            warnings.append(f"[{source_name}] Expected 'This Year/Last Year' header row not found.")
        else:
            header_row = raw.iloc[hdr].map(_normalize_label).tolist()
            header_lc = [h.lower() for h in header_row]

            def find_col(token: str) -> Optional[int]:
                for i, h in enumerate(header_lc):
                    if token in h:
                        return i
                return None

            col_this = find_col("this year")
            col_last = find_col("last year")

            # Variance header may appear elsewhere (e.g., in a later section header row),
            # so we detect it by scanning nearby rows too.
            col_var: Optional[int] = None
            for r in range(hdr, min(hdr + 6, len(raw))):
                row_lc = [str(_normalize_label(x)).lower() for x in raw.iloc[r].tolist()]
                for i, h in enumerate(row_lc):
                    if "variance" in h:
                        col_var = i
                        break
                if col_var is not None:
                    break

            if col_this is None or col_last is None:
                warnings.append(
                    f"[{source_name}] Could not locate 'This Year'/'Last Year' columns in header row."
                )
                empty = pd.DataFrame(columns=["metric", "value", "source"])
                return ExtractResult(
                    system_performance_summary=empty.copy(),
                    current_period=empty.copy(),
                    prior_year=empty.copy(),
                    fytd=empty.copy(),
                    warnings=warnings,
                    notes={**notes, "mode": "summary_grid_failed"},
                )

            # Data region starts after the header row.
            data = raw.iloc[hdr + 1 :].copy()

            account_code_re = re.compile(r"^\d{6}-\d{4}$")
            all_caps_re = re.compile(r"^[A-Z0-9][A-Z0-9\s&/\-]+$")

            def find_account_code(row: list[Any]) -> str:
                for cell in row:
                    s = _normalize_label(cell)
                    if account_code_re.match(s):
                        return s
                return ""

            def pick_metric(row: list[Any]) -> str:
                # Prefer a descriptive label (contains letters) over numeric/account-code cells.
                candidates = []
                for idx in [1, 3, 0]:
                    if idx >= len(row):
                        continue
                    s = _normalize_label(row[idx])
                    if not s:
                        continue
                    candidates.append(s)
                for s in candidates:
                    if any(ch.isalpha() for ch in s) and s.lower() not in {"account code"}:
                        return s
                # Fall back to first non-empty that isn't an account code.
                for s in candidates:
                    if not account_code_re.match(s):
                        return s
                return candidates[0] if candidates else ""

            def is_section_header(label: str, numeric_values: list[float]) -> bool:
                if not label or numeric_values:
                    return False
                # Example: "FIXED ROUTE SERVICE", "DEMAND RESPONSE"
                return bool(all_caps_re.match(label)) and len(label) >= 6

            current_section = ""
            out_rows: list[dict[str, Any]] = []
            for i in range(len(data)):
                row = data.iloc[i].tolist()
                m = pick_metric(row)
                acct_code = find_account_code(row)

                # Parse numeric candidates on the row (excluding variance col which is handled separately).
                numeric_cells: list[tuple[int, float]] = []
                for c_idx, cell in enumerate(row):
                    if col_var is not None and c_idx == col_var:
                        continue
                    x = _best_effort_numeric(cell)
                    if isinstance(x, (int, float)) and not (isinstance(x, float) and pd.isna(x)):
                        numeric_cells.append((c_idx, float(x)))
                numeric_cells.sort(key=lambda t: t[0])

                # Detect and keep section headers.
                if is_section_header(m, [v for _, v in numeric_cells]):
                    current_section = m
                    out_rows.append(
                        {
                            "metric": m,
                            "section": current_section,
                            "account_code": "",
                            "this_year": None,
                            "last_year": None,
                            "variance": None,
                            "row_type": "section",
                            "source": source_name,
                        }
                    )
                    continue

                # If metric is empty but we have numbers near the bottom, label as grand total.
                if not m and numeric_cells and i > max(0, len(data) - 8):
                    m = "Grand Total"

                if not m:
                    continue
                if account_code_re.match(m) or m.lower() in {"account code"}:
                    continue

                # Variance from the variance column if available.
                vv = None
                if col_var is not None and col_var < len(row):
                    v_raw = _best_effort_numeric(row[col_var])
                    if isinstance(v_raw, (int, float)):
                        vv = float(v_raw)
                    else:
                        # Drop rows where variance cell is a label like "Variance"
                        v_cell = _normalize_label(row[col_var]).lower()
                        if v_cell in {"variance", "var"}:
                            continue

                # This Year / Last Year:
                # The sheet mixes layouts, so detect per-row by position of numeric cells.
                tv = numeric_cells[0][1] if numeric_cells else None
                lv = numeric_cells[1][1] if len(numeric_cells) >= 2 else None

                # Prefer explicit header-column values when present on the row.
                if col_this is not None and col_this < len(row):
                    x = _best_effort_numeric(row[col_this])
                    if isinstance(x, (int, float)):
                        tv = float(x)
                if col_last is not None and col_last < len(row):
                    x = _best_effort_numeric(row[col_last])
                    if isinstance(x, (int, float)):
                        lv = float(x)

                # Keep rows where at least one numeric value exists.
                if not any(isinstance(x, (int, float)) for x in [tv, lv, vv] if x is not None):
                    continue
                out_rows.append(
                    {
                        "metric": m,
                        "section": current_section,
                        "account_code": acct_code,
                        "this_year": tv,
                        "last_year": lv,
                        "variance": vv,
                        "row_type": "data",
                        "source": source_name,
                    }
                )

            summary_df = pd.DataFrame(out_rows)
            # Requested outputs:
            # - fytd: treat "This Year" as FYTD this year
            # - prior_year: treat "Last Year" as FYTD last year
            # - current_period: not present in this sheet; keep empty but warn
            data_only = summary_df[summary_df.get("row_type", "data") == "data"].copy()

            fytd = data_only[["metric", "this_year", "source"]].rename(columns={"this_year": "value"})
            fytd["kind"] = "fytd"
            prior = data_only[["metric", "last_year", "source"]].rename(columns={"last_year": "value"})
            prior["kind"] = "prior_year"

            warnings.append(
                f"[{source_name}] Summary sheet provides FYTD (This Year/Last Year); current-period values not detected here."
            )
            current = pd.DataFrame(columns=["metric", "value", "source", "kind"])

            return ExtractResult(
                system_performance_summary=summary_df.reset_index(drop=True),
                current_period=current.reset_index(drop=True),
                prior_year=prior.reset_index(drop=True),
                fytd=fytd.reset_index(drop=True),
                warnings=warnings,
                notes={**notes, "mode": "summary_grid", "columns": {"this_year": col_this, "last_year": col_last, "variance": col_var}},
            )

    if "tabular" in extracted and not extracted["tabular"].empty:
        tab = extracted["tabular"].copy()
        cols = [c.strip() for c in tab.columns.astype(str).tolist()]
        lc = [c.lower() for c in cols]

        # Pick label column: first non-empty header, prefer ones that look like metric/description.
        label_idx = 0
        for i, c in enumerate(lc):
            if any(tok in c for tok in ["metric", "measure", "description", "kpi", "item"]):
                label_idx = i
                break

        label_col = cols[label_idx]
        tab = tab.rename(columns={label_col: "Metric"})
        tab["Metric"] = tab["Metric"].map(_normalize_label)
        tab = tab[tab["Metric"].astype(str).str.len() > 0]

        def pick_col(tokens: list[str], *, exclude_substrings: list[str] | None = None) -> Optional[str]:
            for i, c in enumerate(lc):
                if exclude_substrings and any(x in c for x in exclude_substrings):
                    continue
                # Prefer whole-word-ish matches to avoid false positives like "Current Budget".
                if any(re.search(rf"\b{re.escape(t)}\b", c) for t in tokens):
                    return cols[i]
            return None

        current_col = pick_col(
            ["current", "current period", "this period", "month"],
            exclude_substrings=["budget", "encumbr", "actual"],
        )
        prior_col = pick_col(["prior", "last year", "previous year", "py"])
        fytd_col = pick_col(["fytd", "fiscal ytd", "ytd"], exclude_substrings=["calendar"])

        if current_col is None:
            warnings.append(f"[{source_name}] Could not detect current-period column from headers: {cols}")
        if prior_col is None:
            warnings.append(f"[{source_name}] Could not detect prior-year column from headers: {cols}")
        if fytd_col is None:
            warnings.append(f"[{source_name}] Could not detect FYTD column from headers: {cols}")

        def build_one(col: Optional[str], kind: str) -> pd.DataFrame:
            if col is None or col not in tab.columns:
                return pd.DataFrame(columns=["metric", "value", "source"])
            out = tab[["Metric", col]].copy()
            out = out.rename(columns={"Metric": "metric", col: "value"})
            out["value"] = out["value"].map(_best_effort_numeric)
            out["source"] = source_name
            out["kind"] = kind
            return out

        current = build_one(current_col, "current_period")
        prior = build_one(prior_col, "prior_year")
        fytd = build_one(fytd_col, "fytd")

        # Summary rows: try to capture anything that looks like totals/summary.
        summary = tab[tab["Metric"].str.contains("total|summary|overall", case=False, na=False)].copy()
        if summary.empty:
            # Keep a minimal summary derived from the three tables.
            summary = pd.DataFrame(
                {
                    "metric": ["row_count"],
                    "value": [int(len(tab))],
                    "source": [source_name],
                }
            )
        else:
            # Keep metric + any detected period columns (if present).
            keep = ["Metric"]
            for c in [current_col, prior_col, fytd_col]:
                if c and c in summary.columns:
                    keep.append(c)
            summary = summary[keep].rename(columns={"Metric": "metric"})
            summary["source"] = source_name

        return ExtractResult(
            system_performance_summary=summary.reset_index(drop=True),
            current_period=current.reset_index(drop=True),
            prior_year=prior.reset_index(drop=True),
            fytd=fytd.reset_index(drop=True),
            warnings=warnings,
            notes=notes,
        )

    # Fallback path
    fb = extracted.get("fallback", pd.DataFrame()).copy()
    if fb.empty:
        warnings.append(f"[{source_name}] Extraction produced no rows.")
        empty = pd.DataFrame(columns=["metric", "value", "source"])
        return ExtractResult(
            system_performance_summary=empty.copy(),
            current_period=empty.copy(),
            prior_year=empty.copy(),
            fytd=empty.copy(),
            warnings=warnings,
            notes=notes,
        )

    # Interpret fallback as: Metric + multiple numeric columns (unknown semantics).
    value_cols = [c for c in fb.columns if c != "Metric"]
    notes["fallback_value_columns"] = value_cols
    warnings.append(
        f"[{source_name}] Using fallback columns {value_cols}; semantics (current/prior/FYTD) not detected."
    )

    # Provide the raw fallback as "summary" and leave others empty so warnings are explicit.
    summary = fb.rename(columns={"Metric": "metric"}).copy()
    summary["source"] = source_name
    empty = pd.DataFrame(columns=["metric", "value", "source"])
    return ExtractResult(
        system_performance_summary=summary.reset_index(drop=True),
        current_period=empty.copy(),
        prior_year=empty.copy(),
        fytd=empty.copy(),
        warnings=warnings,
        notes=notes,
    )


def _result_to_normalized_json_dict(
    result: ExtractResult, input_path: str, meta: dict[str, Any]
) -> dict[str, Any]:
    def df_records(df: pd.DataFrame) -> list[dict[str, Any]]:
        if df is None or df.empty:
            return []
        # Ensure JSON-serializable.
        cleaned = df.copy()
        for c in cleaned.columns:
            cleaned[c] = cleaned[c].map(lambda x: None if (isinstance(x, float) and pd.isna(x)) else x)
        return cleaned.to_dict(orient="records")

    return {
        "meta": {
            **meta,
            "generated_at": _now_iso(),
            "input_path": input_path,
        },
        "warnings": result.warnings,
        "notes": result.notes,
        "tables": {
            "system_performance_summary": df_records(result.system_performance_summary),
            "current_period": df_records(result.current_period),
            "prior_year": df_records(result.prior_year),
            "fytd": df_records(result.fytd),
        },
    }


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _write_json(path: Path, obj: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")


def _write_optional_csvs(out_dir: Path, result: ExtractResult) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    result.system_performance_summary.to_csv(out_dir / "system_performance_summary.csv", index=False)
    result.current_period.to_csv(out_dir / "current_period.csv", index=False)
    result.prior_year.to_csv(out_dir / "prior_year.csv", index=False)
    result.fytd.to_csv(out_dir / "fytd.csv", index=False)


def _load_and_extract_from_excel(path: Path, out_dir: Path) -> ExtractResult:
    warnings: list[str] = []
    xls = pd.ExcelFile(path)

    diagnostics_parts: list[str] = []
    extracted_candidates: list[ExtractResult] = []

    for sheet in xls.sheet_names:
        raw = _sheet_to_raw_df(xls, sheet)
        diagnostics_parts.append(_diagnostics_for_raw_df(f"sheet:{sheet}", raw))

        extracted = _extract_tables_from_raw(raw, source_name=f"{path.name}::{sheet}", warnings=warnings)
        extracted_candidates.append(
            _normalize_extracted(extracted, source_name=f"{path.name}::{sheet}", warnings=warnings)
        )

    _write_text(out_dir / "diagnostics.txt", "\n".join(diagnostics_parts))

    # Prefer summary-like sheets; otherwise choose by row counts in current/prior/fytd.
    preferred_idxs = [
        i
        for i, r in enumerate(extracted_candidates)
        if "summary" in str(r.notes.get("source", "")).lower()
    ]

    def score(r: ExtractResult) -> int:
        return int(len(r.current_period) + len(r.prior_year) + len(r.fytd))

    if preferred_idxs:
        preferred = [extracted_candidates[i] for i in preferred_idxs]
        best = max(preferred, key=score, default=None)
    else:
        best = max(extracted_candidates, key=score, default=None)
    if best is None:
        warnings.append(f"[{path.name}] No sheets processed.")
        empty = pd.DataFrame(columns=["metric", "value", "source"])
        best = ExtractResult(
            system_performance_summary=empty.copy(),
            current_period=empty.copy(),
            prior_year=empty.copy(),
            fytd=empty.copy(),
            warnings=warnings,
            notes={"source": path.name},
        )
    else:
        best.warnings = warnings
        best.notes["selected_by"] = "max(current+prior+fytd row count)"
        best.notes["all_sheets"] = xls.sheet_names

    return best


def _load_and_extract_from_csv_folder(folder: Path, out_dir: Path) -> ExtractResult:
    warnings: list[str] = []
    diagnostics_parts: list[str] = []
    extracted_candidates: list[ExtractResult] = []

    csvs = sorted([p for p in folder.iterdir() if p.is_file() and p.suffix.lower() == ".csv"])
    if not csvs:
        warnings.append(f"[{folder}] No CSV files found.")

    for p in csvs:
        raw = _csv_to_raw_df(p)
        diagnostics_parts.append(_diagnostics_for_raw_df(f"csv:{p.name}", raw))
        extracted = _extract_tables_from_raw(raw, source_name=p.name, warnings=warnings)
        extracted_candidates.append(_normalize_extracted(extracted, source_name=p.name, warnings=warnings))

    _write_text(out_dir / "diagnostics.txt", "\n".join(diagnostics_parts))

    def score(r: ExtractResult) -> int:
        return int(len(r.current_period) + len(r.prior_year) + len(r.fytd))

    best = max(extracted_candidates, key=score, default=None)
    if best is None:
        empty = pd.DataFrame(columns=["metric", "value", "source"])
        best = ExtractResult(
            system_performance_summary=empty.copy(),
            current_period=empty.copy(),
            prior_year=empty.copy(),
            fytd=empty.copy(),
            warnings=warnings,
            notes={"source": str(folder)},
        )
    else:
        best.warnings = warnings
        best.notes["selected_by"] = "max(current+prior+fytd row count)"
        best.notes["all_csvs"] = [p.name for p in csvs]

    return best


def _load_and_extract_from_html(path: Path, out_dir: Path) -> ExtractResult:
    warnings: list[str] = []
    diagnostics_parts: list[str] = []
    extracted_candidates: list[ExtractResult] = []

    raw_tables = _html_to_raw_dfs(path)
    if not raw_tables:
        warnings.append(f"[{path.name}] No <table> elements parsed from HTML.")

    for i, raw in enumerate(raw_tables):
        diagnostics_parts.append(_diagnostics_for_raw_df(f"html:{path.name}#table{i}", raw))
        source = f"{path.name}#table{i}"
        extracted = _extract_tables_from_raw(raw, source_name=source, warnings=warnings)
        extracted_candidates.append(_normalize_extracted(extracted, source_name=source, warnings=warnings))

    _write_text(out_dir / "diagnostics.txt", "\n".join(diagnostics_parts))

    def score(r: ExtractResult) -> int:
        return int(len(r.current_period) + len(r.prior_year) + len(r.fytd))

    best = max(extracted_candidates, key=score, default=None)
    if best is None:
        empty = pd.DataFrame(columns=["metric", "value", "source"])
        best = ExtractResult(
            system_performance_summary=empty.copy(),
            current_period=empty.copy(),
            prior_year=empty.copy(),
            fytd=empty.copy(),
            warnings=warnings,
            notes={"source": path.name},
        )
    else:
        best.warnings = warnings
        best.notes["selected_by"] = "max(current+prior+fytd row count)"
        best.notes["all_tables"] = list(range(len(raw_tables)))

    return best


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input",
        required=True,
        help="Path to irregular xlsx/xlsm/html workbook export OR a folder of CSV exports.",
    )
    parser.add_argument(
        "--out-dir",
        default="tools/system_performance_irregular/out",
        help="Output directory for diagnostics + snapshots.",
    )
    parser.add_argument(
        "--write-csv",
        action="store_true",
        help="Also write table snapshots as CSV.",
    )

    args = parser.parse_args()
    input_path = Path(args.input).expanduser()
    out_dir = Path(args.out_dir)

    meta = {
        "tool": "extract_irregular_system_performance.py",
        "cwd": os.getcwd(),
    }

    if input_path.is_file() and input_path.suffix.lower() in {".xlsx", ".xlsm", ".xltx", ".xltm"}:
        result = _load_and_extract_from_excel(input_path, out_dir)
    elif input_path.is_file() and input_path.suffix.lower() in {".html", ".htm"}:
        result = _load_and_extract_from_html(input_path, out_dir)
    elif input_path.is_dir():
        result = _load_and_extract_from_csv_folder(input_path, out_dir)
    else:
        raise SystemExit(f"Unsupported input: {input_path}")

    normalized = _result_to_normalized_json_dict(result, str(input_path), meta=meta)
    _write_json(out_dir / "transformed.json", normalized)
    if args.write_csv:
        _write_optional_csvs(out_dir, result)

    # Also print a minimal summary to stdout for quick iteration.
    print("Warnings:", len(result.warnings))
    for w in result.warnings[:25]:
        print("-", w)
    if len(result.warnings) > 25:
        print(f"- ... ({len(result.warnings) - 25} more)")

    print("Shapes:")
    print("  summary:", tuple(result.system_performance_summary.shape))
    print("  current:", tuple(result.current_period.shape))
    print("  prior:", tuple(result.prior_year.shape))
    print("  fytd:", tuple(result.fytd.shape))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

