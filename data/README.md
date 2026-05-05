# 📊 CropGain — Data & Analytics

**Owner:** Data Analyst
**Stack:** Python · CSV · Next.js (NGO Dashboard)

---

## Folder Structure

```
data/
├── raw/                          # Original source data (do not edit)
│   └── esoko_sample_2026_05_05.csv   # e-SOKO Rwanda export (May 2026)
│
├── seed/                         # Ready-to-import CSVs for backend
│   ├── crops.csv                 # 8 smallholder crops (rw + en names)
│   ├── markets.csv               # 10 Rwandan markets with GPS coords
│   ├── market_prices.csv         # 30-day price history (1 620 rows)
│   └── farmers.csv               # 50 demo farmer profiles
│
├── scripts/
│   └── generate_seed.py          # Re-generates all seed files from raw data
│
├── notebooks/                    # Exploratory analysis (optional)
│
└── README.md                     # This file
```

---

## Seed Data Overview

| File | Rows | Description |
|------|------|-------------|
| `crops.csv` | 8 | Beans, Potato, Maize, Tomato, Sweet Potato, Wheat, Carrot, Sorghum |
| `markets.csv` | 10 | Nyabugogo, Kimironko, Kimisagara, Kibuye, Byumba, Kibungo, Mulindi, Karenge, Mahoko, Gahoromani |
| `market_prices.csv` | 1 620 | 30 days × 8 crops × markets. Base prices from real e-SOKO data. Daily ±5% variation. |
| `farmers.csv` | 50 | Realistic Rwandan names, phone numbers, districts |

---

## Data Source

**e-SOKO** (esoko.rw) — Rwanda Ministry of Agriculture (MINAGRI) market price information system.

- Current data: CSV export from May 4–5, 2026
- Future: Replace CSV with live e-SOKO API feed once access is granted
- Prices are in **RWF per kg** (farmgate prices used as base)

---

## How to Re-generate Seed Files

```bash
cd data/
python3 scripts/generate_seed.py
```

This reads `raw/esoko_sample_2026_05_05.csv` and outputs fresh CSVs to `seed/`.

---

## How Backend Imports Seed Data

Backend developer imports in this order (FK dependencies):

```
1. crops.csv        → crops table
2. markets.csv      → markets table
3. farmers.csv      → users table (role = farmer)
4. market_prices.csv → market_prices table
```

---

## Analytics Responsibilities (by Phase)

| Phase | Task |
|-------|------|
| 1 | ✅ Seed CSVs ready |
| 2 | Validate price realism · Compute trending crops (top 7-day risers) · Define cost-per-kg rollup logic |
| 3 | Seed 4 demo group sales · Compute group uplift % · Build total RWF metric |
| 4 | Full demo dataset (200 sales) · Income-lift baseline vs current · Regional price snapshot · NGO Dashboard UI · 1-page investor metrics |
