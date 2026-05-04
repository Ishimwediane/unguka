# 🌾 Unguka — Farmer Price Intelligence System (FPIS)

> *Empowering Rwandan farmers with real-time market price intelligence, AI-driven sell recommendations, and cooperative group selling.*

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Contract](#api-contract)
  - [Auth](#auth)
  - [Conventions](#conventions)
  - [Error Handling](#error-handling)
  - [Pagination](#pagination)
- [User Roles](#user-roles)
- [State Machines](#state-machines)
- [Contributing](#contributing)
- [Change Log](#change-log)

---

## Overview

**Unguka** (Kinyarwanda: *"to rise"*) is a Farmer Price Intelligence System (FPIS) designed for smallholder farmers in Rwanda. The platform helps farmers:

- Track their crop cycles, costs, and harvests
- Access real-time and historical market prices across Rwanda's major markets
- Receive AI-powered recommendations on **when** and **where** to sell
- Join cooperative **group sales** to unlock better bulk prices
- Set price alerts to be notified when target prices are reached

The system serves farmers directly and is also used by cooperatives (`coop_manager`), NGOs (`ngo_user`), and platform administrators (`admin`).

---

## Key Features

| Feature | Description |
|---|---|
| 📊 **Farm & Crop Tracking** | Log planting, expected harvest, and crop cycle status |
| 💰 **Expense Logging** | Track seeds, labor, fertilizer, transport, and other costs per crop cycle |
| 🏪 **Market Prices** | Real-time price feeds sourced from farmer reports, coops, and government data |
| 🤖 **AI Recommendations** | `sell_now`, `wait`, `join_group`, `best_market` cards with confidence scores |
| 🤝 **Group Sales** | Cooperatives create group selling campaigns; farmers pledge and deliver |
| 🔔 **Price Alerts** | Notify farmers when a crop price crosses their set threshold |
| 🌍 **Multilingual** | Full support for Kinyarwanda (`rw`), English (`en`), and French (`fr`) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React / TypeScript)      │
│   Mobile-first PWA · i18n (rw, en, fr) · Offline   │
└────────────────────────┬────────────────────────────┘
                         │ REST/JSON over HTTPS
                         │ Bearer JWT · Idempotency-Key
┌────────────────────────▼────────────────────────────┐
│                      Backend API                     │
│   REST · PostgreSQL · UUIDv7 IDs · RWF amounts      │
└────────┬──────────────────────────┬─────────────────┘
         │                          │
┌────────▼──────────┐   ┌──────────▼──────────────────┐
│   PostgreSQL DB   │   │  AI Recommendation Engine    │
│  (TimescaleDB for │   │  Reads from market_prices    │
│   market_prices)  │   │  & farm_crops; writes to     │
└───────────────────┘   │  recommendations table       │
                        └─────────────────────────────-┘
```

---

## Project Structure

```
unguka/
├── backend/          # API server (REST, PostgreSQL)
├── frontend/         # React TypeScript PWA
├── data/             # Seed data, CSV imports, migrations
├── docs/
│   └── FPIS_Database_ERD.md   # Single source of truth — schema & data contract
└── README.md
```

> **Note:** The `docs/FPIS_Database_ERD.md` file is the **authoritative data contract** between frontend, backend, data analysts, and the AI engine. Any schema change requires PO sign-off and a version bump.

---

## Data Model

The core entity hierarchy is:

```
USERS
 └── FARMS
      └── FARM_CROPS          ← central entity
           ├── EXPENSES
           ├── HARVESTS
           └── SALES ──────── MARKETS
                    └──────── GROUP_SALES
                                   ├── GROUP_PLEDGES (linked to users)
                                   └── GROUP_COLLECTIONS (linked to users)

CROPS ──────────────────────── MARKET_PRICES (linked to markets)
                            └── GROUP_SALES

USERS ──── RECOMMENDATIONS (context: farm_crops)
      └─── PRICE_ALERTS (watching crops)

USERS ──── MEMBERSHIPS ──── ORGANIZATIONS
                             └── GROUP_SALES
```

### Key Entities

| Entity | Purpose |
|---|---|
| `users` | Farmers, coop managers, NGO users, admins |
| `farms` | Physical farm parcels owned by a user |
| `farm_crops` | A crop cycle on a farm — nearly all financial data hangs off this |
| `expenses` | Per-cycle cost entries (seeds, labor, fertilizer, etc.) |
| `harvests` | Harvest weight and quality records per cycle |
| `sales` | Final sale records — closes the feedback loop |
| `markets` | Rwanda market locations (Kimironko, Nyabugogo, etc.) |
| `market_prices` | Time-series price observations per crop per market |
| `group_sales` | Cooperative bulk-selling campaigns |
| `group_pledges` | Farmer commitments to a group sale |
| `group_collections` | Actual delivery & payment records per farmer |
| `price_alerts` | Farmer-defined price thresholds (notify when price ≥ threshold) |
| `recommendations` | AI engine output — one row per recommendation card shown |

For full column-level documentation, nullability, and FK constraints, see [`docs/FPIS_Database_ERD.md`](docs/FPIS_Database_ERD.md).

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 15 (or TimescaleDB for production `market_prices`)
- **pnpm** or **npm**

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, etc.

# Run database migrations
npm run migrate

# Seed reference data (crops, markets)
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: VITE_API_BASE_URL, etc.

# Start development server
npm run dev
```

---

## API Contract

### Auth

All authenticated endpoints require:

```
Authorization: Bearer <jwt>
```

Token refresh:

```
POST /v1/auth/refresh
```

Clients silently refresh on `401` responses.

### Conventions

| Concern | Convention |
|---|---|
| **IDs** | UUIDv7 strings — never expose numeric IDs |
| **Money** | `bigint` RWF, no decimals. Field names end in `_rwf` |
| **Quantities** | `numeric(12,3)` as strings on the wire (e.g. `"12.500"`). Field names end in `_kg` |
| **Dates** | ISO date strings (`"2026-05-04"`) |
| **Timestamps** | ISO 8601 UTC (`"2026-05-04T13:48:00Z"`). Display in `Africa/Kigali` |
| **Geo** | Decimal degrees WGS84, `numeric(9,6)` precision |
| **Table names** | `snake_case`, plural |
| **JSON keys** | `snake_case` (matches DB — no translation layer needed) |
| **TypeScript types** | `PascalCase` interfaces; `snake_case` field names |
| **Enums** | Lowercase string literals — never numeric |
| **Idempotency** | Write endpoints accept `Idempotency-Key` header (UUIDv7 recommended) |

### Error Handling

All errors return JSON:

```json
{
  "code": "FARM_NOT_FOUND",
  "message": "Farm not found.",
  "details": { "farm_id": "01900000-..." }
}
```

| HTTP Status | Code Prefix | Meaning |
|---|---|---|
| 400 | `VALIDATION_*` | Bad request body |
| 401 | `AUTH_*` | Missing or invalid token |
| 403 | `FORBIDDEN_*` | Authenticated but unauthorized |
| 404 | `*_NOT_FOUND` | Resource not found |
| 409 | `STATE_CONFLICT_*` | Invalid state transition |
| 429 | `RATE_LIMITED` | Too many requests |
| 5xx | `INTERNAL` | Server error |

### Pagination

All list endpoints accept:

| Query Param | Default | Max | Description |
|---|---|---|---|
| `limit` | 20 | 100 | Items per page |
| `cursor` | — | — | Opaque cursor from previous response |

Response shape:

```json
{
  "items": [...],
  "next_cursor": "abc123"
}
```

`next_cursor` is `null` when there are no more pages.

---

## User Roles

| Role | Description |
|---|---|
| `farmer` | Default role. Manages their own farms, crop cycles, sales, and alerts. |
| `coop_manager` | Manages cooperative group sales; can advance group sale status. |
| `ngo_user` | Read access for program monitoring and data analysis. |
| `admin` | Full platform access; can manage all resources and transition any state. |

---

## State Machines

### `farm_crops.status`

```
planted → growing → near_harvest → harvested → closed
```

| State | Description |
|---|---|
| `planted` | Initial state after farmer registers a crop cycle |
| `growing` | Auto-advances a few weeks after `planted_at` (or manual) |
| `near_harvest` | Within 14 days of `expected_harvest_at`; AI price prediction card unlocks |
| `harvested` | At least one harvest entry exists |
| `closed` | All sales completed; archived from active dashboards |

### `group_sales.status`

```
open → filled → confirmed → collected → paid
(any state) → cancelled
```

| State | Description |
|---|---|
| `open` | Accepting pledges from farmers |
| `filled` | `sum(pledged_qty_kg) ≥ target_qty_kg`; UI shows "Buyer being secured" |
| `confirmed` | Buyer locked in; farmers receive notification |
| `collected` | Collection-day deliveries logged; coop reconciles pledged vs. delivered |
| `paid` | Buyer has paid; farmer payouts are visible |
| `cancelled` | Terminal failure — deadline missed, no buyer found, etc. |

> **Access control:** Only `coop_manager` or `admin` can transition to `confirmed`, `collected`, `paid`, or `cancelled`. Backend enforces this; frontend disables invalid actions accordingly.

---

## Contributing

1. **Schema changes** require a PR, PO sign-off, and a version bump in `docs/FPIS_Database_ERD.md`.
2. **New API signals for the AI engine** require a schema update PR before implementation.
3. **Frontend TypeScript models** must be a 1:1 reflection of the entity tables in the ERD — do not invent fields.
4. **Money values** must never be rounded in transit; format with thousand separators on display only.
5. Run `npm run migrate` before starting development after pulling schema changes.

---

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | May 2026 | PO + Backend | Initial schema & data contract published |

---

*Unguka — built for Rwandan farmers, grounded in real market data.*
