import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Brand colors (from CropGain logo) ────────────────────────────────────────
const C = {
  green:      "#2D6A1F",
  greenLight: "#4A8C35",
  greenPale:  "#EAF3DE",
  gold:       "#C49A1A",
  goldLight:  "#E8B84B",
  goldPale:   "#FDF6DC",
  text:       "#1A1A1A",
  muted:      "#6B7280",
  border:     "rgba(0,0,0,0.08)",
  surface:    "#FAFAF8",
  white:      "#FFFFFF",
};

// ── Real data from analytics_summary.json ────────────────────────────────────
const KPI = {
  farmers: 50,
  markets: 10,
  crops: 8,
  sales: 200,
  followRate: 68,
  incomeLiftPct: 18.6,
  incomeLiftRwf: 9865956,
  baselineRwf: 53183964,
  fpisRwf: 63049920,
  groupSalesRwf: 9514040,
};

const TRENDING = [
  { crop: "Beans",        crop_rw: "Ibishyimbo", trend: 1.75 },
  { crop: "Carrot",       crop_rw: "Karoti",     trend: 1.39 },
  { crop: "Maize",        crop_rw: "Ibigori",    trend: 1.25 },
  { crop: "Sorghum",      crop_rw: "Amasaka",    trend: 1.24 },
  { crop: "Potato",       crop_rw: "Ibirayi",    trend: 1.20 },
  { crop: "Wheat",        crop_rw: "Ingano",      trend: 1.09 },
  { crop: "Tomato",       crop_rw: "Inyanya",    trend: 1.00 },
  { crop: "Sweet Potato", crop_rw: "Imyumbati",  trend: 0.16 },
];

const BEST_MARKETS = [
  { crop: "Beans",        market: "Mahoko",     price: 1029, uplift: 28.1 },
  { crop: "Tomato",       market: "Kimironko",  price: 917,  uplift: 77.4 },
  { crop: "Wheat",        market: "Mahoko",     price: 1124, uplift: 36.2 },
  { crop: "Carrot",       market: "Karenge",    price: 833,  uplift: 102.6 },
  { crop: "Sorghum",      market: "Karenge",    price: 833,  uplift: 35.5 },
  { crop: "Sweet Potato", market: "Mahoko",     price: 409,  uplift: 35.0 },
  { crop: "Maize",        market: "Kimironko",  price: 568,  uplift: 39.5 },
  { crop: "Potato",       market: "Kibuye",     price: 722,  uplift: 18.3 },
];

const GROUP_SALES = [
  { crop: "Beans",  target: 2000, price: 1016, uplift: 13.1, status: "open",      fill: 0.72, buyer: "Inyange Industries"  },
  { crop: "Potato", target: 3000, price: 776,  uplift: 14.8, status: "filled",    fill: 1.00, buyer: "Rwanda Trading Co." },
  { crop: "Maize",  target: 5000, price: 531,  uplift: 11.8, status: "confirmed", fill: 1.00, buyer: "Minimex Ltd"         },
  { crop: "Tomato", target: 4000, price: 767,  uplift: 12.0, status: "collected", fill: 1.00, buyer: "EAX Rwanda"          },
];

const REGIONAL = [
  { district: "Gasabo",     beans: 924,  tomato: 917,  wheat: 830,  maize: 568 },
  { district: "Huye",       beans: 1029, tomato: 817,  wheat: 1124, maize: 539 },
  { district: "Rulindo",    beans: 836,  tomato: 834,  wheat: 1038, maize: 462 },
  { district: "Karongi",    beans: 947,  tomato: 517,  wheat: 924,  maize: 474 },
  { district: "Nyarugenge", beans: 804,  tomato: 637,  wheat: 839,  maize: 407 },
  { district: "Rwamagana",  beans: 1028, tomato: 606,  wheat: 927,  maize: 418 },
  { district: "Gicumbi",    beans: null, tomato: 609,  wheat: 825,  maize: 510 },
  { district: "Ngoma",      beans: 818,  tomato: null, wheat: 911,  maize: null },
];

// Simulated 30-day revenue trend
const REVENUE_TREND = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `Apr ${i + 6 > 30 ? `May ${i - 24}` : i + 6}`,
    baseline: Math.round(53183964 / 30 * (0.9 + Math.random() * 0.2)),
    fpis:     Math.round(63049920 / 30 * (0.9 + Math.random() * 0.2)),
  };
}).map((r, i, arr) => ({
  ...r,
  day: i < 25 ? `Apr ${i + 6}` : `May ${i - 24}`,
}));

const PRICE_RANGES = [
  { crop: "Wheat",  min: 791,  avg: 912,  max: 1155 },
  { crop: "Beans",  min: 781,  avg: 898,  max: 1072 },
  { crop: "Tomato", min: 489,  avg: 685,  max: 951  },
  { crop: "Carrot", min: 390,  avg: 654,  max: 849  },
  { crop: "Potato", min: 583,  avg: 676,  max: 752  },
  { crop: "Maize",  min: 393,  avg: 475,  max: 596  },
  { crop: "Sorghum",min: 586,  avg: 728,  max: 862  },
  { crop: "S.Potato",min: 293, avg: 347,  max: 429  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString();
const fmtM = (n: number) => `${(n / 1_000_000).toFixed(1)}M`;

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  open:      { bg: C.goldPale,  text: C.gold,        label: "Open"      },
  filled:    { bg: "#E0F0FF",   text: "#1A6DB5",     label: "Filled"    },
  confirmed: { bg: C.greenPale, text: C.green,        label: "Confirmed" },
  collected: { bg: "#F0E8FF",   text: "#6A3DB5",     label: "Collected" },
};

const DISTRICTS = ["All Districts", ...REGIONAL.map(r => r.district)];
const NAV_ITEMS = ["Impact", "Markets", "Profit", "Farmers", "Groups"];

// ── Sub-components ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent = false }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div style={{
      background: accent ? C.green : C.white,
      border: `1px solid ${accent ? C.green : C.border}`,
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.7)" : C.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, color: accent ? C.white : C.text, lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.65)" : C.muted }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 16, background: C.gold, borderRadius: 2, display: "inline-block" }} />
      {children}
    </h2>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "20px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────
function ImpactSection({ district }: { district: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Income Lift" value={`+${KPI.incomeLiftPct}%`} sub="vs baseline selling" accent />
        <KpiCard label="Lift (RWF)" value={fmtM(KPI.incomeLiftRwf)} sub="earned above baseline" />
        <KpiCard label="Farmers" value={String(KPI.farmers)} sub="active this month" />
        <KpiCard label="Rec. Follow Rate" value={`${KPI.followRate}%`} sub="farmers using advice" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Revenue: baseline vs CropGain (30 days)</SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.muted }} interval={6} />
                <YAxis tick={{ fontSize: 10, fill: C.muted }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`${fmt(v)} RWF`, ""]} />
                <Line type="monotone" dataKey="baseline" stroke="#C4C0B8" strokeWidth={1.5} dot={false} name="Baseline" />
                <Line type="monotone" dataKey="fpis"     stroke={C.green}  strokeWidth={2}   dot={false} name="With CropGain" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: C.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 16, height: 2, background: "#C4C0B8", display: "inline-block" }} /> Baseline
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 16, height: 2, background: C.green, display: "inline-block" }} /> With CropGain
            </span>
          </div>
        </Card>

        <Card>
          <SectionTitle>Total revenue comparison</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
            {[
              { label: "Baseline (no FPIS)", value: KPI.baselineRwf, color: "#C4C0B8", pct: 100 },
              { label: "With CropGain",      value: KPI.fpisRwf,     color: C.green,   pct: 118.6 },
            ].map(r => (
              <div key={r.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: C.muted }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: C.text }}>{fmtM(r.value)} RWF</span>
                </div>
                <div style={{ background: C.surface, borderRadius: 4, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(r.pct, 100)}%`, height: "100%", background: r.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{
              background: C.greenPale, borderRadius: 8, padding: "12px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>Net income lift</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.green }}>+{fmtM(KPI.incomeLiftRwf)} RWF</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <KpiCard label="Sales recorded" value={fmt(KPI.sales)} sub="last 30 days" />
        <KpiCard label="Markets monitored" value={String(KPI.markets)} sub="across Rwanda" />
        <KpiCard label="Group sales flow" value={fmtM(KPI.groupSalesRwf)} sub="RWF via cooperatives" />
      </div>
    </div>
  );
}

function MarketsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>7-day price trend by crop</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRENDING} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={C.border} />
                <XAxis type="number" tick={{ fontSize: 10, fill: C.muted }} tickFormatter={v => `+${v}%`} domain={[0, 2]} />
                <YAxis type="category" dataKey="crop" tick={{ fontSize: 11, fill: C.text }} width={60} />
                <Tooltip formatter={(v: number) => [`+${v}%`, "7-day trend"]} />
                <Bar dataKey="trend" fill={C.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle>Price spread by crop (RWF/kg)</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRICE_RANGES} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="crop" tick={{ fontSize: 10, fill: C.muted }} />
                <YAxis tick={{ fontSize: 10, fill: C.muted }} />
                <Tooltip />
                <Bar dataKey="min" stackId="a" fill={C.greenPale} name="Min" />
                <Bar dataKey="avg" stackId="b" fill={C.green}     name="Avg" radius={[2, 2, 0, 0]} />
                <Bar dataKey="max" stackId="c" fill={C.gold}      name="Max" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>Best market per crop</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Crop", "Best Market", "Avg Price (RWF/kg)", "Uplift vs Worst"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BEST_MARKETS.map((r, i) => (
              <tr key={r.crop} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.surface }}>
                <td style={{ padding: "10px 12px", fontWeight: 500, color: C.text }}>{r.crop}</td>
                <td style={{ padding: "10px 12px", color: C.muted }}>{r.market}</td>
                <td style={{ padding: "10px 12px", color: C.text }}>{fmt(r.price)}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    background: r.uplift > 50 ? C.goldPale : C.greenPale,
                    color:      r.uplift > 50 ? C.gold      : C.green,
                    borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600,
                  }}>
                    +{r.uplift}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ProfitSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <SectionTitle>Average crop price by district (RWF/kg)</SectionTitle>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REGIONAL} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="district" tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="beans"  name="Beans"  fill={C.green}      radius={[2, 2, 0, 0]} />
              <Bar dataKey="tomato" name="Tomato" fill={C.gold}       radius={[2, 2, 0, 0]} />
              <Bar dataKey="wheat"  name="Wheat"  fill={C.greenLight} radius={[2, 2, 0, 0]} />
              <Bar dataKey="maize"  name="Maize"  fill={C.goldLight}  radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <KpiCard label="Highest-earning crop" value="Wheat" sub="avg 912 RWF/kg" />
        <KpiCard label="Highest-paying district" value="Huye" sub="avg 1,124 RWF/kg wheat" />
        <KpiCard label="Biggest price gap" value="Carrot" sub="+102.6% Karenge vs worst" accent />
      </div>
    </div>
  );
}

function FarmersSection() {
  const topFarmers = [
    { name: "Claudine Mukamana", district: "Nyarugenge", crop: "Tomato",  revenue: "612,000", lift: "+22%" },
    { name: "Bosco Ndagijimana", district: "Gasabo",     crop: "Wheat",   revenue: "584,000", lift: "+19%" },
    { name: "Aline Uwimana",     district: "Huye",       crop: "Beans",   revenue: "571,000", lift: "+21%" },
    { name: "Jean Habimana",     district: "Rwamagana",  crop: "Carrot",  revenue: "549,000", lift: "+17%" },
    { name: "Marie Gasana",      district: "Rulindo",    crop: "Potato",  revenue: "522,000", lift: "+15%" },
  ];
  const atRisk = [
    { name: "Patrick Nzeyimana", district: "Gicumbi",   issue: "No sale in 14 days"   },
    { name: "Vestine Mukamusoni",district: "Ngoma",     issue: "Cost spike +38%"       },
    { name: "Gervais Ntirenganya",district: "Karongi",  issue: "Missed harvest window" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Top performers</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {topFarmers.map((f, i) => (
              <div key={f.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: C.greenPale,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: C.green, flexShrink: 0,
                }}>
                  {f.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.district} · {f.crop}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.revenue}</div>
                  <div style={{ fontSize: 11, color: C.green }}>{f.lift}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>At-risk farmers</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {atRisk.map(f => (
              <div key={f.name} style={{
                background: "#FFF8F0",
                border: `1px solid ${C.goldPale}`,
                borderLeft: `3px solid ${C.gold}`,
                borderRadius: 8, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{f.district}</div>
                <div style={{ fontSize: 12, color: C.gold, marginTop: 4, fontWeight: 500 }}>{f.issue}</div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              3 farmers flagged this week · 47 on track
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Active farmers" value="50"  sub="registered this month" />
        <KpiCard label="Avg income lift" value="+18.6%" sub="per farmer" />
        <KpiCard label="On track" value="94%" sub="no alerts" />
        <KpiCard label="At risk" value="3" sub="need intervention" accent />
      </div>
    </div>
  );
}

function GroupsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {GROUP_SALES.map(g => {
          const sc = STATUS_COLORS[g.status];
          return (
            <Card key={g.crop}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{g.crop}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{g.buyer}</div>
                </div>
                <span style={{ background: sc.bg, color: sc.text, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                  {sc.label}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Target</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{fmt(g.target)} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Group price</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{fmt(g.price)} RWF/kg</div>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
                  <span>Fill rate</span>
                  <span style={{ fontWeight: 500, color: C.text }}>{Math.round(g.fill * 100)}%</span>
                </div>
                <div style={{ background: C.surface, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${g.fill * 100}%`, height: "100%", background: g.fill === 1 ? C.green : C.gold, borderRadius: 4 }} />
                </div>
              </div>

              <div style={{
                background: C.greenPale, borderRadius: 6,
                padding: "6px 12px", display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 12, color: C.green }}>Uplift vs market avg</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>+{g.uplift}%</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <KpiCard label="Active groups" value="4" sub="this season" />
        <KpiCard label="Total group RWF" value={fmtM(KPI.groupSalesRwf)} sub="flowing through coops" />
        <KpiCard label="Avg group uplift" value="+12.9%" sub="above market price" accent />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function NGODashboard() {
  const [activeNav, setActiveNav]   = useState("Impact");
  const [district, setDistrict]     = useState("All Districts");

  const renderSection = () => {
    switch (activeNav) {
      case "Impact":  return <ImpactSection district={district} />;
      case "Markets": return <MarketsSection />;
      case "Profit":  return <ProfitSection />;
      case "Farmers": return <FarmersSection />;
      case "Groups":  return <GroupsSection />;
      default:        return <ImpactSection district={district} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.surface }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, background: C.white,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.green,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C10 2 5 6 5 11a5 5 0 0010 0C15 6 10 2 10 2z" fill={C.gold} />
                <path d="M10 11 L10 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1 }}>CropGain</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>NGO Dashboard</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                width: "100%", textAlign: "left",
                padding: "10px 12px", borderRadius: 8,
                border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: activeNav === item ? 600 : 400,
                color:      activeNav === item ? C.green : C.muted,
                background: activeNav === item ? C.greenPale : "transparent",
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Data source */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
            Source: e-SOKO Rwanda<br />
            Updated: May 5, 2026
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, padding: "28px 32px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>{activeNav}</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
              {activeNav === "Impact" && "Program income lift and farmer revenue — May 2026"}
              {activeNav === "Markets" && "Price trends, spreads, and best markets by crop"}
              {activeNav === "Profit" && "Profit analytics by crop and district"}
              {activeNav === "Farmers" && "Farmer performance and at-risk flagging"}
              {activeNav === "Groups" && "Cooperative group sale performance"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: 8,
                border: `1px solid ${C.border}`,
                fontSize: 13, color: C.text, background: C.white,
                cursor: "pointer",
              }}
            >
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <button style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1px solid ${C.border}`,
              fontSize: 13, color: C.text, background: C.white,
              cursor: "pointer",
            }}>
              Export CSV
            </button>
            <button style={{
              padding: "8px 16px", borderRadius: 8,
              border: "none",
              fontSize: 13, color: C.white, background: C.green,
              cursor: "pointer", fontWeight: 600,
            }}>
              Export PDF
            </button>
          </div>
        </div>

        {renderSection()}
      </main>
    </div>
  );
}
