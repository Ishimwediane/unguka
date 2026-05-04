# 📚 Unguka — Project Documentation

This directory contains the official technical documentation and design specifications for the **Unguka (Farmer Price Intelligence System)**.

## 📁 Key Documents

- [**FPIS_Database_ERD.md**](FPIS_Database_ERD.md) — **Single Source of Truth**. Contains the full database schema, ERD diagram (Mermaid), and the data contract between Frontend and Backend.
- `architecture/` — Detailed diagrams of the system architecture.
- `api-spec/` — (Optional) OpenApi/Swagger documentation.

## 🖋 Documentation Standards

- All technical specs should be written in **Markdown**.
- Use **Mermaid.js** for all diagrams to ensure they are versionable and easy to edit.
- Any change to the database schema **must** be updated in the `FPIS_Database_ERD.md` file first and approved by the PO.

## 🔄 Versioning

Documentation versions should follow the project's development cycle. Major architectural changes require a version bump in the `Change Log` section of the relevant document.
