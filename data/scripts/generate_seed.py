"""
generate_seed.py
────────────────
CropGain / FPIS — Data Analyst seed pipeline
Source: e-SOKO Rwanda (esoko.rw) sample export

Run:
    python3 scripts/generate_seed.py

Outputs (written to data/seed/):
    crops.csv          — 8 smallholder crops
    markets.csv        — 10 Rwandan markets with GPS
    market_prices.csv  — 30 days × 8 crops × markets (1 620 rows)
    farmers.csv        — 50 demo farmer profiles

Note:
    Base prices come from real e-SOKO farmgate figures (May 2026).
    Daily variation is ±5% with a slight upward trend (realistic seasonality).
    When FPIS goes live, this pipeline will be replaced by the e-SOKO API feed.
"""

import csv, uuid, random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

ROOT = Path(__file__).resolve().parents[1]
SEED_DIR = ROOT / "seed"
RAW_FILE = ROOT / "raw" / "esoko_sample_2026_05_05.csv"

SEED_DIR.mkdir(parents=True, exist_ok=True)

# ── Crop definitions ──────────────────────────────────────────────────────────
CROPS = {
    "Ibishyimbo Ibinyarwanda": {"name_rw": "Ibishyimbo", "name_en": "Beans (Local)",    "cycle_days": 90},
    "Ibirayi- Kinigi Grade 1": {"name_rw": "Ibirayi",    "name_en": "Potato (Grade 1)", "cycle_days": 100},
    "Ibigori":                 {"name_rw": "Ibigori",    "name_en": "Maize",             "cycle_days": 120},
    "Inyanya":                 {"name_rw": "Inyanya",    "name_en": "Tomato",            "cycle_days": 75},
    "Imyumbati":               {"name_rw": "Imyumbati",  "name_en": "Sweet Potato",      "cycle_days": 110},
    "Ingano":                  {"name_rw": "Ingano",     "name_en": "Wheat",             "cycle_days": 130},
    "Karoti":                  {"name_rw": "Karoti",     "name_en": "Carrot",            "cycle_days": 80},
    "Amasaka":                 {"name_rw": "Amasaka",    "name_en": "Sorghum",           "cycle_days": 150},
}

# ── Market definitions ────────────────────────────────────────────────────────
MARKETS = {
    "nyabugogo":  {"name": "Nyabugogo Market",  "district": "Nyarugenge", "sector": "Nyabugogo",  "lat": -1.9441, "lng": 30.0619},
    "Kimironko":  {"name": "Kimironko Market",  "district": "Gasabo",     "sector": "Kimironko",  "lat": -1.9355, "lng": 30.1127},
    "kimisagara": {"name": "Kimisagara Market", "district": "Nyarugenge", "sector": "Kimisagara", "lat": -1.9600, "lng": 30.0500},
    "kibuye":     {"name": "Kibuye Market",     "district": "Karongi",    "sector": "Kibuye",     "lat": -2.0600, "lng": 29.3489},
    "byumba":     {"name": "Byumba Market",     "district": "Gicumbi",    "sector": "Byumba",     "lat": -1.5764, "lng": 30.0672},
    "kibungo":    {"name": "Kibungo Market",    "district": "Ngoma",      "sector": "Kibungo",    "lat": -2.1604, "lng": 30.5422},
    "mulindi":    {"name": "Mulindi Market",    "district": "Rulindo",    "sector": "Mulindi",    "lat": -1.7200, "lng": 30.0300},
    "karenge":    {"name": "Karenge Market",    "district": "Rwamagana",  "sector": "Karenge",    "lat": -1.9500, "lng": 30.4300},
    "mahoko":     {"name": "Mahoko Market",     "district": "Huye",       "sector": "Mahoko",     "lat": -2.5967, "lng": 29.7394},
    "gahoromani": {"name": "Gahoromani Market", "district": "Kicukiro",   "sector": "Gahoromani", "lat": -1.9800, "lng": 30.1200},
}

# ── Farmer names pool ─────────────────────────────────────────────────────────
FIRST_NAMES = [
    "Claudine","Jean","Aline","Patrick","Marie","Eric","Grace","Joseph","Alice","Emmanuel",
    "Diane","Pierre","Esperance","Bosco","Solange","Innocent","Chantal","Faustin","Vestine","Gervais",
    "Odette","Alexis","Francine","Celestin","Immaculee","Fidele","Beatrice","Valens","Jeannette","Prosper",
    "Annonciata","Theogene","Monique","Augustin","Yvonne","Damascene","Speciose","Ildephonse","Seraphine","Claver",
    "Felicite","Phocas","Generose","Leonidas","Ancilla","Evariste","Providencia","Zacharie","Illuminee","Noel",
]
LAST_NAMES = [
    "Mukamana","Habimana","Uwimana","Nzeyimana","Gasana","Bizimana","Kamana","Ndayisaba","Uwera","Hakizimana",
    "Nsabimana","Irakoze","Uwase","Ndagijimana","Kayitesi","Niyonzima","Mugisha","Uzamukunda","Mukamusoni","Ntirenganya",
    "Kabayiza","Rurangwa","Mukarubibi","Nkurunziza","Uwamariya","Tuyishime","Mugiraneza","Ntawukuliryayo","Murekatete","Nyiransabimana",
    "Uwamahoro","Havugimana","Mukagasana","Nshimiyimana","Kanyange","Murekezi","Mukamazimpaka","Nzabonimpa","Mukeshimana","Ntawuzanamungu",
    "Mujawamariya","Gashugi","Mukamuganga","Rwagasore","Mukankusi","Niyibizi","Nyiraneza","Ntakirutimana","Kayiranga","Iradukunda",
]


def write_csv(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print(f"  ✓ {path.name:30s} {len(rows)-1} data rows")


def load_raw_prices():
    """Read e-SOKO CSV and return dict: (product_name_en, market_key) → farmgate_price"""
    prices = {}
    with open(RAW_FILE, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            prod = row["Product Name En"]
            mkt  = row["Markets"]
            fp   = row["Farmgate Price"].replace("-", "").strip()
            if prod in CROPS and mkt in MARKETS and fp.isdigit():
                prices[(prod, mkt)] = int(fp)
    return prices


def generate_crops(crop_ids):
    rows = [["id", "name_rw", "name_en", "unit", "typical_cycle_days"]]
    for prod, info in CROPS.items():
        rows.append([crop_ids[prod], info["name_rw"], info["name_en"], "kg", info["cycle_days"]])
    write_csv(SEED_DIR / "crops.csv", rows)


def generate_markets(market_ids):
    rows = [["id", "name", "district", "sector", "gps_lat", "gps_lng"]]
    for key, m in MARKETS.items():
        rows.append([market_ids[key], m["name"], m["district"], m["sector"], m["lat"], m["lng"]])
    write_csv(SEED_DIR / "markets.csv", rows)


def generate_market_prices(crop_ids, market_ids, base_prices):
    today = datetime(2026, 5, 5)
    rows = [["id", "market_id", "crop_id", "price_per_kg_rwf", "source", "source_count", "reported_at"]]
    for (prod, mkt_key), base in base_prices.items():
        for day_offset in range(30):
            date      = today - timedelta(days=29 - day_offset)
            variation = random.uniform(0.95, 1.05)
            trend     = 1 + (day_offset * 0.001)          # ~3% drift over 30 days
            price     = int(base * variation * trend)
            rows.append([
                str(uuid.uuid4()),
                market_ids[mkt_key],
                crop_ids[prod],
                price,
                "esoko_feed",
                random.randint(2, 12),
                date.strftime("%Y-%m-%dT08:00:00Z"),
            ])
    write_csv(SEED_DIR / "market_prices.csv", rows)


def generate_farmers(market_ids):
    market_keys = list(MARKETS.keys())
    rows = [["id", "full_name", "phone_e164", "district", "sector", "role"]]
    for i in range(50):
        mkt_key = market_keys[i % len(market_keys)]
        m       = MARKETS[mkt_key]
        rows.append([
            str(uuid.uuid4()),
            f"{FIRST_NAMES[i]} {LAST_NAMES[i]}",
            f"+25078{random.randint(1000000, 9999999)}",
            m["district"],
            m["sector"],
            "farmer",
        ])
    write_csv(SEED_DIR / "farmers.csv", rows)


def main():
    print("\n🌱 CropGain — Seed Data Generator")
    print("=" * 45)

    crop_ids   = {prod: str(uuid.uuid4()) for prod in CROPS}
    market_ids = {key: str(uuid.uuid4())  for key  in MARKETS}

    print("\nGenerating seed files...")
    base_prices = load_raw_prices()
    generate_crops(crop_ids)
    generate_markets(market_ids)
    generate_market_prices(crop_ids, market_ids, base_prices)
    generate_farmers(market_ids)

    print(f"\n✅ Done — files written to data/seed/")
    print(f"   Base prices sourced from: {RAW_FILE.name}")
    print(f"   Market price rows: {len(base_prices)} combos × 30 days\n")


if __name__ == "__main__":
    main()
