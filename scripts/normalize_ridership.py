"""
normalize_ridership.py

Reads a monthly route ridership .xlsx file, normalizes it into a clean
DataFrame, and exports a JSON file matching the shared contract.

Usage:
    python normalize_ridership.py <path_to_xlsx> [output.json]

Defaults:
    output path: same directory as input, with .json extension
"""

import sys
import json
import pandas as pd
from pathlib import Path


# ---------------------------------------------------------------------------
# Day-type normalisation map
# ---------------------------------------------------------------------------
DAY_TYPE_MAP = {
    "1-weekday":  "weekday",
    "weekday":    "weekday",
    "wkd":        "weekday",
    "wk":         "weekday",
    "2-saturday": "saturday",
    "saturday":   "saturday",
    "sat":        "saturday",
    "3-sunday":   "sunday",
    "sunday":     "sunday",
    "sun":        "sunday",
}

EXPECTED_COLUMNS = [
    "route_number",
    "route_name",
    "day_type",
    "schedule_id",
    "monthly_ridership_upt",
    "monthly_pass_miles_pmt",
    "avg_trip_length_ptl",
    "monthly_revenue_miles",
    "monthly_revenue_hours",
]


def _normalize_day_type(raw: str) -> str:
    """Map raw day-type label to a canonical value."""
    key = str(raw).strip().lower()
    if key in DAY_TYPE_MAP:
        return DAY_TYPE_MAP[key]
    raise ValueError(f"Unknown day_type value: {raw!r}")


def _to_numeric_or_none(value):
    """Convert a cell value to float, returning None for nulls / 'Null' strings."""
    if pd.isna(value):
        return None
    if isinstance(value, str) and value.strip().lower() == "null":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def load_and_normalize(xlsx_path: str) -> pd.DataFrame:
    """
    Load the detailed route/day-type sheet from *xlsx_path* and return a
    normalised DataFrame with EXPECTED_COLUMNS.

    The function reads the first sheet (index 0), which contains per-route,
    per-day-type rows.  It skips:
      - The header row (row 0)
      - Blank / separator rows (where Route is NaN or non-numeric)
      - The trailing summary/total rows
    """
    raw = pd.read_excel(xlsx_path, sheet_name=0, header=None)

    # Row 0 is the header; assign it and drop it from data
    raw.columns = raw.iloc[0]
    raw = raw.iloc[1:].reset_index(drop=True)

    # Keep only rows where Route is a real route number (numeric)
    mask_valid = pd.to_numeric(raw["Route"], errors="coerce").notna()
    data = raw[mask_valid].copy()

    records = []
    for _, row in data.iterrows():
        route_raw = row["Route"]
        try:
            route_number = int(float(route_raw))
        except (ValueError, TypeError):
            continue  # skip if still not numeric after filter

        route_name_full = str(row["Route Name"]).strip()
        # Strip the leading "N " prefix that duplicates the route number
        route_name = route_name_full.removeprefix(f"{route_number} ").strip()

        day_type = _normalize_day_type(row["Day Type"])
        schedule_id = str(int(float(row["Schedule"])))

        monthly_ridership  = _to_numeric_or_none(row["Monthly Ridership (UPT)"])
        monthly_pmt        = _to_numeric_or_none(row["Monthly Pass-Miles (PMT)"])
        avg_ptl            = _to_numeric_or_none(row["Avg Trip Length (PTL)"])
        monthly_rev_miles  = _to_numeric_or_none(row["Monthly Revenue Miles"])
        monthly_rev_hours  = _to_numeric_or_none(row["Monthly Revenue Hours"])

        records.append({
            "route_number":           route_number,
            "route_name":             route_name,
            "day_type":               day_type,
            "schedule_id":            schedule_id,
            "monthly_ridership_upt":  monthly_ridership,
            "monthly_pass_miles_pmt": monthly_pmt,
            "avg_trip_length_ptl":    avg_ptl,
            "monthly_revenue_miles":  monthly_rev_miles,
            "monthly_revenue_hours":  monthly_rev_hours,
        })

    df = pd.DataFrame(records, columns=EXPECTED_COLUMNS)
    df = df.sort_values(["route_number", "day_type"]).reset_index(drop=True)
    return df


def export_json(df: pd.DataFrame, output_path: str) -> None:
    """Serialise the DataFrame to a JSON file matching the shared contract."""
    records = df.where(df.notna(), other=None).to_dict(orient="records")
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(records, fh, indent=2)


def main():
    if len(sys.argv) < 2:
        print("Usage: python normalize_ridership.py <path_to_xlsx> [output.json]")
        sys.exit(1)

    xlsx_path = sys.argv[1]
    output_path = (
        sys.argv[2]
        if len(sys.argv) >= 3
        else str(Path(xlsx_path).with_suffix(".json"))
    )

    df = load_and_normalize(xlsx_path)

    print(f"Loaded {len(df)} rows across {df['day_type'].nunique()} day type(s) "
          f"and {df['route_number'].nunique()} route(s).")
    print(f"Columns: {list(df.columns)}")
    print(f"\nDay-type value counts:\n{df['day_type'].value_counts().to_string()}")
    print(f"\nSample (first 5 rows):\n{df.head().to_string(index=False)}")

    export_json(df, output_path)
    print(f"\nJSON exported → {output_path}")


if __name__ == "__main__":
    main()