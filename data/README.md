# 📂 Unguka — Data & Assets

This directory serves as the repository for all data-related assets, including initial seeds, CSV imports, and database maintenance scripts.

## 📁 Contents

- `seeds/` — JSON or SQL files for initial system data (Crops, Markets, Districts).
- `raw/` — Historical market price data (CSV/Excel) used for initial training or analysis.
- `scripts/` — Python or Node.js scripts for data cleaning and migration.

## 🛠 Data Standards

When contributing data:
- **Crops**: Must include both `name_rw` and `name_en`.
- **Markets**: Must include GPS coordinates (`lat`, `lng`).
- **Currencies**: All price data must be converted to RWF.

## 🚦 Usage

Scripts in this folder are typically used during the initial setup of the production environment or for periodic updates to reference data (e.g., adding new crops or cooperatives).
