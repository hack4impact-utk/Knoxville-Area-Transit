"""
Manual exploration for: data/4. October 25 System Performance Reports.xlsx

Run from repo root:
  source .venv/bin/activate
  python3 tools/system_performance_irregular/manual_explore.py

Prints per sheet: shape, column indices, non-null counts, first 10 rows.
Then: Summary Oct rows with numbers (used for dashboard-style extraction).
Optional: compare to tools/system_performance_irregular/out_oct25/system_performance_summary.csv
  if that file exists (run the extractor first).
"""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

# October 25 System Performance Reports — single source of truth for this script
WORKBOOK = Path(__file__).resolve().parents[2] / "data" / "4. October 25 System Performance Reports.xlsx"
SUMMARY_SHEET = "Summary Oct"
TRANSFORMED_CSV = (
    Path(__file__).resolve().parent / "out_oct25" / "system_performance_summary.csv"
)


def _looks_numeric(x) -> bool:
    if pd.isna(x):
        return False
    s = str(x).strip().replace(",", "").replace("$", "").replace("(", "").replace(")", "")
    if s in {"", "-", "—", "–"}:
        return False
    try:
        float(s)
        return True
    except ValueError:
        return False


def main() -> int:
    path = WORKBOOK
    if not path.exists():
        print(f"ERROR: workbook not found: {path}", file=sys.stderr)
        return 1

    print("Workbook:", path)
    xls = pd.ExcelFile(path)
    print("Sheet names:", xls.sheet_names)
    print()

    # --- Every sheet: column names (as row0 if header-like), first 10 rows, non-null counts ---
    for sheet in xls.sheet_names:
        print("\n" + "=" * 72)
        print("SHEET:", sheet)
        df = pd.read_excel(xls, sheet_name=sheet, header=None, dtype=object)
        print("shape (rows x cols):", df.shape)
        print("column indices:", list(range(df.shape[1])))
        nn = df.notna().sum(axis=0)
        print("non-null counts (all columns):", nn.tolist())
        print("first 10 rows (raw grid, header=None):")
        print(df.head(10).fillna("").to_string())

    # --- Summary Oct: rows that participate in money / dashboard extraction ---
    if SUMMARY_SHEET not in xls.sheet_names:
        print("\nWARNING: sheet %r not found." % SUMMARY_SHEET)
        return 0

    print("\n" + "#" * 72)
    print("SUMMARY OCT — rows with at least one numeric cell (typical calculation rows)")
    print("#" * 72)
    s = pd.read_excel(xls, sheet_name=SUMMARY_SHEET, header=None, dtype=object)
    mask = s.apply(lambda row: any(_looks_numeric(v) for v in row), axis=1)
    calc = s[mask]
    print("shape:", s.shape, "| rows with any numeric:", len(calc))
    print(calc.to_string())

    # --- Optional: load transformed CSV if present ---
    if TRANSFORMED_CSV.exists():
        print("\n" + "#" * 72)
        print("TRANSFORMED OUTPUT (for manual compare):", TRANSFORMED_CSV)
        print("#" * 72)
        out = pd.read_csv(TRANSFORMED_CSV)
        print("columns:", list(out.columns))
        print("non-null counts:")
        print(out.notna().sum().to_string())
        print("\nall rows (data + section + grand totals):")
        print(out.to_string())
        print(
            "\nTip: compare `this_year` / `last_year` / `variance` / `account_code` "
            "to the same metric row in Excel sheet %r." % SUMMARY_SHEET
        )
    else:
        print(
            "\n(No transformed CSV yet. Run:)\n"
            "  python3 tools/system_performance_irregular/extract_irregular_system_performance.py \\\n"
            f'    --input "{path}" \\\n'
            "    --out-dir tools/system_performance_irregular/out_oct25 --write-csv"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
