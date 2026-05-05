"""
analytics.py
────────────
CropGain / FPIS — Analytics Engine
Computes all metrics needed by the NGO Dashboard and investor deck.

Run:
    python3 scripts/analytics.py

Outputs (written to data/seed/):
    group_sales.csv         — 4 demo group sales with uplift %
    sales.csv               — 200 demo farmer sales (30-day history)
    analytics_summary.json  — All KPIs, trends, uplift, income-lift baseline
"""

import csv, json, uuid, random
from datetime import datetime, timedelta
from collections import defaultdict
from pathlib import Path

random.seed(99)

ROOT     = Path(__file__).resolve().parents[1]
SEED_DIR = ROOT / "seed"

# ── Helpers ───────────────────────────────────────────────────────────────────

def load_csv(filename):
    with open(SEED_DIR / filename) as f:
        return list(csv.DictReader(f))

def write_csv(filename, rows):
    with open(SEED_DIR / filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print(f"  ✓ {filename:35s} {len(rows)-1} data rows")

# ── Load seed data ────────────────────────────────────────────────────────────

crops_rows   = load_csv("crops.csv")
markets_rows = load_csv("markets.csv")
farmers_rows = load_csv("farmers.csv")
prices_rows  = load_csv("market_prices.csv")

crops   = {r["id"]: r for r in crops_rows}
markets = {r["id"]: r for r in markets_rows}
crop_ids   = list(crops.keys())
market_ids = list(markets.keys())
farmer_ids = [r["id"] for r in farmers_rows]

TODAY = datetime(2026, 5, 5)

# ── Price analytics ───────────────────────────────────────────────────────────

# Group prices by (crop_id, market_id) sorted by date
by_crop_market = defaultdict(list)
for r in prices_rows:
    by_crop_market[(r["crop_id"], r["market_id"])].append({
        "price": int(r["price_per_kg_rwf"]),
        "date":  datetime.fromisoformat(r["reported_at"].replace("Z", "")),
        "source_count": int(r["source_count"]),
    })
for key in by_crop_market:
    by_crop_market[key].sort(key=lambda x: x["date"])

# Average price per crop across all markets
avg_price_by_crop = {}
for cid in crop_ids:
    all_p = [r["price"] for (c, m), rows in by_crop_market.items()
             if c == cid for r in rows]
    avg_price_by_crop[cid] = int(sum(all_p) / len(all_p)) if all_p else 0

# 7-day trend per crop
def crop_7d_trend(cid):
    pcts = []
    for (c, m), rows in by_crop_market.items():
        if c != cid: continue
        last7 = [r["price"] for r in rows[-7:]]
        prev7 = [r["price"] for r in rows[-14:-7]]
        if last7 and prev7:
            pcts.append((sum(last7)/len(last7) - sum(prev7)/len(prev7)) / (sum(prev7)/len(prev7)) * 100)
    return round(sum(pcts)/len(pcts), 2) if pcts else 0.0

trending = sorted(
    [{"crop_id": cid, "crop_en": crops[cid]["name_en"],
      "crop_rw": crops[cid]["name_rw"],
      "trend_7d_pct": crop_7d_trend(cid)} for cid in crop_ids],
    key=lambda x: -x["trend_7d_pct"]
)

# Best market per crop (last 7 days average)
def best_market_for_crop(cid):
    best, worst = None, None
    best_p, worst_p = 0, 9_999_999
    for (c, m), rows in by_crop_market.items():
        if c != cid: continue
        avg = sum(r["price"] for r in rows[-7:]) / 7
        if avg > best_p:  best_p  = avg; best  = m
        if avg < worst_p: worst_p = avg; worst = m
    return {
        "market_id":    best,
        "market_name":  markets[best]["name"]  if best  else "",
        "avg_price_rwf": int(best_p),
        "uplift_vs_worst_rwf": int(best_p - worst_p),
        "uplift_pct": round((best_p - worst_p) / worst_p * 100, 1) if worst_p else 0,
    }

best_markets = {cid: best_market_for_crop(cid) for cid in crop_ids}

# Regional price snapshot: avg price per crop per district (last 7 days)
regional = defaultdict(lambda: defaultdict(list))
for (cid, mid), rows in by_crop_market.items():
    district = markets[mid]["district"]
    for r in rows[-7:]:
        regional[district][cid].append(r["price"])

regional_snapshot = {}
for district, crop_data in regional.items():
    regional_snapshot[district] = {
        crops[cid]["name_en"]: int(sum(p)/len(p))
        for cid, p in crop_data.items()
    }

# ── Phase 3: Group sales ──────────────────────────────────────────────────────

group_crops   = crop_ids[:4]
group_mkt_ids = market_ids[:4]
org_ids       = [str(uuid.uuid4()) for _ in range(4)]
group_ids     = []

BUYERS   = ["Inyange Industries", "Rwanda Trading Co.", "Minimex Ltd", "EAX Rwanda"]
STATUSES = ["open", "filled", "confirmed", "collected"]
FILL_PCTS = [0.72, 1.0, 1.0, 1.0]
TARGETS   = [2000, 3000, 5000, 4000]

group_rows = [["id","organization_id","crop_id","target_qty_kg","target_price_per_kg_rwf",
               "collection_center","collection_lat","collection_lng",
               "deadline_at","buyer_name","status"]]
group_summary = []

for i in range(4):
    gid    = str(uuid.uuid4()); group_ids.append(gid)
    cid    = group_crops[i];    mid = group_mkt_ids[i];  m = markets[mid]
    base   = avg_price_by_crop[cid]
    uplift = random.uniform(0.10, 0.18)
    gprice = int(base * (1 + uplift))
    dead   = TODAY + timedelta(days=random.randint(3, 14))

    group_rows.append([gid, org_ids[i], cid, TARGETS[i], gprice,
                       m["name"], m["gps_lat"], m["gps_lng"],
                       dead.strftime("%Y-%m-%dT10:00:00Z"), BUYERS[i], STATUSES[i]])
    group_summary.append({
        "group_id": gid, "crop": crops[cid]["name_en"],
        "target_qty_kg": TARGETS[i], "group_price_rwf": gprice,
        "avg_market_price_rwf": base,
        "uplift_pct": round((gprice - base) / base * 100, 1),
        "status": STATUSES[i], "fill_pct": FILL_PCTS[i],
        "buyer": BUYERS[i],
    })

write_csv("group_sales.csv", group_rows)

total_rwf_group = sum(
    g["group_price_rwf"] * int(g["target_qty_kg"] * g["fill_pct"])
    for g in group_summary
)

# ── Phase 4: 200 demo sales ───────────────────────────────────────────────────

REC_FOLLOW_RATE = 0.68
sales_rows = [["id","farm_crop_id","market_id","group_sale_id",
               "qty_kg","price_per_kg_rwf","sold_on","used_recommendation"]]

baseline_total = 0
fpis_total     = 0
farm_crop_ids  = [str(uuid.uuid4()) for _ in range(200)]

for i in range(200):
    cid      = random.choice(crop_ids)
    qty      = random.randint(50, 800)
    base     = avg_price_by_crop[cid]
    used_rec = random.random() < REC_FOLLOW_RATE
    price    = int(base * random.uniform(1.10, 1.22)) if used_rec \
               else int(base * random.uniform(0.88, 0.98))
    sold_on  = (TODAY - timedelta(days=random.randint(0, 29))).strftime("%Y-%m-%d")
    mid      = random.choice(market_ids)

    sales_rows.append([str(uuid.uuid4()), farm_crop_ids[i], mid, "",
                       qty, price, sold_on, str(used_rec).lower()])

    baseline_total += qty * int(base * 0.92)
    fpis_total     += qty * price

write_csv("sales.csv", sales_rows)

income_lift_rwf = fpis_total - baseline_total
income_lift_pct = round(income_lift_rwf / baseline_total * 100, 1)

# ── Build analytics_summary.json ─────────────────────────────────────────────

summary = {
    "generated_at": TODAY.isoformat(),
    "data_source": "e-SOKO Rwanda (esoko.rw) — May 2026 sample",

    # Headline KPIs
    "headline_kpis": {
        "total_farmers": len(farmers_rows),
        "total_markets": len(markets_rows),
        "total_crops_tracked": len(crops_rows),
        "total_sales_recorded": 200,
        "recommendation_follow_rate_pct": int(REC_FOLLOW_RATE * 100),
        "income_lift_pct": income_lift_pct,
        "income_lift_rwf": income_lift_rwf,
        "baseline_revenue_rwf": baseline_total,
        "fpis_revenue_rwf": fpis_total,
        "total_rwf_through_group_sales": total_rwf_group,
    },

    # Trending crops (top 7-day risers)
    "trending_crops": trending,

    # Best market per crop
    "best_markets": {
        crops[cid]["name_en"]: {**v, "crop_rw": crops[cid]["name_rw"]}
        for cid, v in best_markets.items()
    },

    # Group sale performance
    "group_sales": group_summary,

    # Regional price snapshot
    "regional_price_snapshot": regional_snapshot,

    # Price range per crop across all markets (last 7 days)
    "crop_price_ranges": {
        crops[cid]["name_en"]: {
            "min_rwf": min(r["price"] for (c, m), rows in by_crop_market.items()
                          if c == cid for r in rows[-7:]),
            "max_rwf": max(r["price"] for (c, m), rows in by_crop_market.items()
                          if c == cid for r in rows[-7:]),
            "avg_rwf": avg_price_by_crop[cid],
        }
        for cid in crop_ids
    },
}

out_path = SEED_DIR / "analytics_summary.json"
with open(out_path, "w") as f:
    json.dump(summary, f, indent=2)
print(f"  ✓ {'analytics_summary.json':35s} all KPIs")

# ── Console summary ───────────────────────────────────────────────────────────
print("\n" + "="*55)
print("  CROPGAIN — ANALYTICS SUMMARY")
print("="*55)
print(f"\n  📊 Farmers tracked      : {len(farmers_rows)}")
print(f"  🌍 Markets monitored    : {len(markets_rows)}")
print(f"  🌱 Crops tracked        : {len(crops_rows)}")
print(f"  💰 Income lift          : +{income_lift_pct}%  ({income_lift_rwf:,} RWF)")
print(f"  📈 Rec. follow rate     : {int(REC_FOLLOW_RATE*100)}%")
print(f"  🤝 Group sales RWF flow : {total_rwf_group:,} RWF")

print("\n  TOP TRENDING CROPS (7-day):")
for t in trending:
    print(f"    {t['crop_en']:20s}  {t['trend_7d_pct']:+.2f}%")

print("\n  BEST MARKETS:")
for cid, bm in best_markets.items():
    print(f"    {crops[cid]['name_en']:20s}  {bm['market_name']:22s}  +{bm['uplift_pct']}% vs worst")

print("\n  GROUP SALES UPLIFT:")
for g in group_summary:
    print(f"    {g['crop']:20s}  +{g['uplift_pct']}%  ({g['status']})")

print(f"\n  ✅ All files written to data/seed/\n")
