# BPS Sulteng Insight AI — STATIX Repository

Repositori monorepo resmi untuk ekosistem **STATIX — BPS Provinsi Sulawesi Tengah**.

## 📁 Struktur Monorepo

- web(streamlit)/ — Dashboard Statistik Eksekutif berbasis **Streamlit** dengan AI Graph Insight otomatis & embedded Chatbot.
- web(next.js)/ — Fullstack Dashboard Production-ready berbasis **Next.js 15 (App Router)** + **FastAPI** + **Tailwind CSS** + **Framer Motion**.
- mobile/ — Aplikasi Mobile Chatbot berbasis **Flutter** (Android/iOS).
- ackend/ — Gateway Service AI Gateway berbasis **FastAPI** (Live di Vercel: https://bps-ai-backend.vercel.app).
- docs/ — Dokumentasi teknis, arsitektur sistem, dan laporan magang resmi BPS.
- scripts/ — Skrip otomatisasi & pemrosesan laporan.

## 🚀 Cara Menjalankan

### 1. Dashboard Streamlit
`ash
cd web(streamlit)
streamlit run app.py
`

### 2. Fullstack Next.js 15 + FastAPI
`ash
# Frontend
cd web(next.js)/frontend5
npm install
npm run dev

# Backend
cd web(next.js)/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`
