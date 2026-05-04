# 📱 Unguka — Frontend Application

This directory contains the mobile-first web application for **Unguka**. It is designed to provide farmers with a smooth, offline-capable experience for tracking crops and accessing market intelligence.

## 🛠 Tech Stack

- **Framework**: React with TypeScript
- **State Management**: (e.g., React Query / Context API)
- **Styling**: Vanilla CSS (Tailored for modern, premium aesthetics)
- **i18n**: Multilingual support (Kinyarwanda, English, French)

## 📁 Directory Structure

- `src/components/` — Reusable UI components (cards, inputs, charts)
- `src/pages/` — Full-page views (Dashboard, Farm Profile, Group Sales)
- `src/hooks/` — Custom React hooks for data fetching and logic
- `src/types/` — TypeScript interfaces (mirrors the backend schema)
- `public/` — Static assets and service worker for PWA

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on `.env.example`:
   - `VITE_API_BASE_URL`: URL of the running backend API

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🎨 UI Guidelines

- **Mobile First**: All components must be optimized for small screens first.
- **Aesthetics**: Use premium, high-contrast designs with soft shadows and clear typography.
- **Micro-animations**: Use subtle transitions to enhance the user experience.

## 🌍 Language Support

The app uses `react-i18next` (or similar) to support:
- `rw`: Kinyarwanda (Primary)
- `en`: English
- `fr`: French
