# ⚙️ Unguka — Backend API

This directory contains the RESTful API for the **Unguka (Farmer Price Intelligence System)**. It is built using **NestJS** and **MongoDB** to serve as the core logic and data persistence layer for farmers, cooperatives, and NGOs.

## 🚀 Live Environment
- **Production API URL**: `https://unguka-2ygk.onrender.com/v1`
- **Interactive Documentation (Swagger)**: `https://unguka-2ygk.onrender.com/docs`

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Auth**: JWT (JSON Web Tokens) with `bcrypt`
- **Documentation**: Swagger (OpenAPI 3.0)
- **ID System**: UUIDv7 (Sortable & unique)

---

## 💻 Frontend Integration Guide

### 1. Authentication Flow
All requests to protected routes must include the Bearer token in the header:
`Authorization: Bearer <your_jwt_token>`

#### **Sign Up**
`POST /v1/auth/signup`
```json
{
  "phone_e164": "+250780000000",
  "password": "securePassword123",
  "role": "farmer", // farmer, coop_manager, or ngo_user
  "full_name": "John Doe",
  "language": "rw", // rw, en, or fr
  "district": "Gasabo",
  "sector": "Bumbogo",
  "gps_lat": -1.9441, // Optional
  "gps_lng": 30.0619  // Optional
}
```

#### **Log In**
`POST /v1/auth/login`
```json
{
  "phone_e164": "+250780000000",
  "password": "securePassword123"
}
```
**Response:** Returns an `access_token` and the `user` object.

### 2. Farmer Insights & Dashboard
These endpoints provide the "intelligence" for the home screen.

#### **Home Summary (Profit & Expenses)**
`GET /v1/insights/summary`
Returns aggregated financial data for the authenticated farmer.
```json
{
  "active_crops_count": 2,
  "total_estimated_revenue_rwf": 1824000,
  "total_expenses_rwf": 25000,
  "estimated_profit_rwf": 1799000
}
```

#### **Smart Recommendations**
`GET /v1/insights`
Returns actionable cards for the farmer (e.g., "Sell Now" or "Wait").
```json
[
  {
    "farm_crop_id": "uuid",
    "crop_id": "uuid",
    "kind": "sell_now",
    "payload": {
      "market_name": "Kimironko",
      "price_per_kg_rwf": 950,
      "explanation_en": "Best market: Kimironko, +120 RWF/kg above local"
    }
  }
]
```

---

### 3. Market Intelligence
Real-time pricing data with trust layers and historical trends.

#### **Find Best Market**
`GET /v1/prices/best?crop_id={id}&lat={lat}&lng={lng}`
Calculates the best place to sell based on price and transport penalty.

#### **Market Comparison (Deep Dive)**
`GET /v1/insights/market-comparison?farm_crop_id={id}`
Shows profit if sold at *every* available market, including historical trends.
```json
[
  {
    "market_name": "Kimironko Market",
    "estimated_profit_rwf": 1065600,
    "trend": "rising", // rising, falling, or stable
    "distance_km": 25,
    "freshness_hours": 2
  }
]
```

#### **Trending Crops**
`GET /v1/prices/trending`
Returns crops with the highest price increase in the last 7 days.

---

### 4. Logging & Operations

#### **Log an Expense**
`POST /v1/farm-crops/:id/expenses`
```json
{
  "category": "seeds", // seeds, fertilizer, labor, transport, other
  "amount_rwf": 5000,
  "occurred_on": "2026-05-11",
  "note": "Optional note"
}
```

#### **Log a Sale (Feedback Loop)**
`POST /v1/sales`
*Note: Logging a sale automatically reports the price to the system for other farmers.*
```json
{
  "farm_crop_id": "uuid",
  "market_id": "uuid",
  "qty_kg": 100,
  "price_per_kg_rwf": 950,
  "total_amount_rwf": 95000,
  "sold_at": "2026-05-11"
}
```

---

### 5. Farm Management (CRUD)
*(Existing Farm endpoints stay here)*

#### **Create a Farm**
`POST /v1/farms`
```json
{
  "name": "Bumbogo Maize Plot",
  "size_ha": 1.5,
  "district": "Gasabo",
  "sector": "Bumbogo",
  "gps_lat": -1.9441,
  "gps_lng": 30.0619
}
```

---

## 🧪 Testing instructions

### Seed Data
To populate your local DB with the full FPIS dataset (Crops, Markets, 200k Prices, 50 Farmers):
1. `cd api`
2. `npx ts-node src/common/seeds/seed.ts`

### Automated Verification
Run the verification suite to check all user stories:
`npx ts-node verify_phase2.ts`

### Swagger UI
Go to `http://localhost:3000/docs` to test every endpoint.

---

## 📜 API Conventions
- **Prefix**: `/v1`
- **Naming**: `snake_case` for all JSON keys.
- **Errors**: Standard NestJS error format.
