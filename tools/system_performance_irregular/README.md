## Irregular System Performance extractor (pandas)

Goal: load a locally saved "October/system-performance" workbook (or exported CSVs / HTML exports) into pandas, explore it, and produce **usable** transformed DataFrames + normalized JSON snapshots. This is intentionally heuristic and **not** a generic parser.

### Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r tools/system_performance_irregular/requirements.txt
```

### Run

#### Excel workbook

```bash
python tools/system_performance_irregular/extract_irregular_system_performance.py \
  --input "/absolute/path/to/October_system-performance.xlsx" \
  --out-dir "tools/system_performance_irregular/out"
```

#### HTML export (like PhpSpreadsheet export)

```bash
python tools/system_performance_irregular/extract_irregular_system_performance.py \
  --input "/absolute/path/to/October_system-performance.html" \
  --out-dir "tools/system_performance_irregular/out"
```

#### Folder of CSV exports

```bash
python tools/system_performance_irregular/extract_irregular_system_performance.py \
  --input "/absolute/path/to/csv_exports_folder" \
  --out-dir "tools/system_performance_irregular/out"
```

### Output

- `out/diagnostics.txt`: per-sheet / per-CSV quick inspection output (columns, head, non-null counts).
- `out/transformed.json`: normalized JSON snapshot with `warnings` and extracted tables.
- `out/*.csv`: optional snapshots of each extracted table.

