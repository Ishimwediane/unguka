# 🌾 Unguka — Project Structure

> **Farmer Price Intelligence System (FPIS)** — Empowering Rwandan farmers with real-time market price intelligence, AI-driven sell recommendations, and cooperative group selling.

---

## 📂 Project Directory Layout

```
unguka/
├── backend/                    # ⚙️ Node.js RESTful API
│   └── README.md              # Backend setup and documentation
│
├── frontend/                   # 📱 React TypeScript Web App
│   └── README.md              # Frontend setup and documentation
│
├── data/                       # 📊 Data & Analytics
│   └── README.md              # Data management documentation
│
├── docs/                       # 📖 Project Documentation
│   ├── FPIS_Database_ERD.md   # Entity Relationship Diagram
│   └── README.md              # Documentation index
│
├── README.md                   # Project overview and quick start
├── STRUCTURE.md               # This file — project structure reference
└── .git/                       # Git version control
```

---

## 🏗️ Component Overview

### **Backend** (`/backend`)
**Node.js RESTful API** — Core logic and data persistence layer

**Tech Stack:**
- Runtime: Node.js
- Database: PostgreSQL + TimescaleDB (for price time-series data)
- ID System: UUIDv7 (sortable, unique identifiers)
- Architecture: RESTful JSON API

**Key Directories:**
- `src/api/` — Route handlers and controllers
- `src/models/` — Database schemas and ORM logic
- `src/services/` — Business logic (AI recommendations, SMS alerts)
- `migrations/` — Database schema versioning
- `seeds/` — Reference data (crops, markets, initial roles)

**Responsibility:**
- User authentication and authorization
- Farm and crop cycle management
- Expense and harvest logging
- Real-time and historical market price APIs
- AI-driven sell recommendations
- Cooperative group sales coordination
- Price alerts and notifications

---

### **Frontend** (`/frontend`)
**React TypeScript Web Application** — Mobile-first user interface

**Tech Stack:**
- Framework: React with TypeScript
- State Management: React Query / Context API
- Styling: Vanilla CSS (responsive, premium design)
- i18n: Multilingual (Kinyarwanda, English, French)
- PWA: Offline-capable with service worker

**Key Directories:**
- `src/components/` — Reusable UI components (cards, inputs, charts)
- `src/pages/` — Full-page views (Dashboard, Farm Profile, Group Sales)
- `src/hooks/` — Custom React hooks (data fetching, business logic)
- `src/types/` — TypeScript interfaces (mirrors backend schema)
- `public/` — Static assets and service worker

**Responsibility:**
- User dashboard and navigation
- Farm profile and crop tracking UI
- Market price browsing and alerts
- Group sales coordination interface
- Multi-language support (i18n)
- Offline-capable PWA experience

---

### **Data** (`/data`)
**Data Management & Analytics**

**Contents:**
- Reference datasets (crops, markets, price history)
- Data import/export utilities
- Backup and archival procedures

---

### **Documentation** (`/docs`)
**Project Documentation**

**Contents:**
- `FPIS_Database_ERD.md` — Entity Relationship Diagram (database schema)
- `README.md` — Documentation index and guides

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Frontend (React + TypeScript)                              │
│  ├─ User Dashboard                                          │
│  ├─ Farm Tracking UI                                        │
│  ├─ Market Price Browsing                                   │
│  └─ Group Sales Interface                                   │
│                                                               │
└──────────────────┬──────────────────────────────────────────┘
                   │ JSON API (HTTP/REST)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Backend API (Node.js)                                      │
│  ├─ Authentication & Authorization                          │
│  ├─ Farm & Crop Management                                  │
│  ├─ Expense & Harvest Logging                               │
│  ├─ Market Price Intelligence                               │
│  ├─ AI Recommendations                                      │
│  └─ Group Sales Coordination                                │
│                                                               │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL Queries
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Database (PostgreSQL + TimescaleDB)                        │
│  ├─ Users & Roles                                           │
│  ├─ Farms & Crop Cycles                                     │
│  ├─ Expenses & Harvests                                     │
│  ├─ Market Prices (Time-Series)                             │
│  ├─ Price Alerts                                            │
│  └─ Group Sales & Transactions                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles

| Role | Description |
|---|---|
| **farmer** | Smallholder farmer — primary end user |
| **coop_manager** | Cooperative manager — coordinates group sales |
| **ngo_user** | NGO staff — monitoring and support |
| **admin** | Platform administrator — system configuration |

---

## 🚀 Getting Started

### **Backend Setup**
See `/backend/README.md` for:
- Node.js and PostgreSQL installation
- Environment configuration (.env)
- Database migrations and seeding
- API server startup

### **Frontend Setup**
See `/frontend/README.md` for:
- Node.js and npm installation
- Environment configuration (.env)
- Development server startup (Vite or equivalent)

### **Data & Documentation**
See `/data/README.md` and `/docs/README.md` for:
- Data management procedures
- Database schema reference
- API contract documentation

---

## 📋 Key Features

| Feature | Component | Responsibility |
|---|---|---|
| **Farm Tracking** | Frontend UI + Backend API | Track planting, expected harvest, crop cycles |
| **Expense Logging** | Frontend UI + Backend API | Log seeds, labor, fertilizer, transport costs |
| **Market Prices** | Backend API + Database | Real-time and historical price feeds |
| **AI Recommendations** | Backend Services | Suggest optimal selling time and location |
| **Group Sales** | Frontend UI + Backend API | Coordinate bulk selling with cooperatives |
| **Price Alerts** | Frontend UI + Backend Services | Notify farmers when target prices are reached |
| **Multi-Language** | Frontend i18n | Support Kinyarwanda, English, French |
| **Offline Mode** | Frontend PWA | Service worker for offline capability |

---

## 🔗 Inter-Component Communication

- **Frontend ↔ Backend**: JSON REST API over HTTP/HTTPS
- **Backend ↔ Database**: SQL via PostgreSQL client library
- **Data Layer**: Centralized in backend; frontend uses API

---

## 📚 Reference Documentation

- **Database Schema**: See `/docs/FPIS_Database_ERD.md`
- **Backend API**: See `/backend/README.md`
- **Frontend Guide**: See `/frontend/README.md`
- **Data Management**: See `/data/README.md`

---

## ✅ Development Workflow

1. **Understand** the feature requirement (user role, data flow)
2. **Backend**: Implement API endpoints, database schema updates
3. **Frontend**: Build UI components, connect to backend API
4. **Test**: Unit tests, integration tests, user acceptance
5. **Deploy**: Backend → Frontend → Monitor

---

**Last Updated:** May 2026  
**Project**: Unguka (Farmer Price Intelligence System)
