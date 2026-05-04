# ⚙️ Unguka — Backend API

This directory contains the RESTful API for the **Unguka (Farmer Price Intelligence System)**. It is built to serve as the core logic and data persistence layer for farmers, cooperatives, and NGOs.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Database**: PostgreSQL (with TimescaleDB for price time-series)
- **Architecture**: RESTful JSON API
- **ID System**: UUIDv7 (for sortable, unique identifiers)

## 📁 Directory Structure

- `src/api/` — Route handlers and controllers
- `src/models/` — Database schemas and logic
- `src/services/` — Business logic (AI recommendation integration, SMS alerts)
- `migrations/` — Database schema versioning
- `seeds/` — Reference data for crops, markets, and initial roles

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on `.env.example`:
   - `DATABASE_URL`: Connection string for PostgreSQL
   - `JWT_SECRET`: Secret key for authentication
   - `PORT`: Default is 3000

3. **Database Setup**:
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 API Conventions

- **Auth**: All protected routes require `Authorization: Bearer <token>`.
- **Naming**: Use `snake_case` for all JSON keys in requests and responses.
- **Money**: Handled as `bigint` RWF (no decimals).
- **Quantities**: Handled as `numeric` (kilograms).

For the full data contract and schema details, refer to the [Main Documentation](../docs/FPIS_Database_ERD.md).
