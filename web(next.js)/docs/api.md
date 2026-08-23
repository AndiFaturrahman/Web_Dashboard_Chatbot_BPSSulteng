# 📡 BPS Sulteng Insight AI — Backend API Documentation

API service terpusat berbasis **FastAPI** untuk mengambil, menormalisasi, dan menyajikan data resmi Badan Pusat Statistik (BPS) Provinsi Sulawesi Tengah (Domain 7200) serta 13 Kabupaten/Kota.

---

## Base URL
- Production: https://bps-sulteng-api.railway.app (atau gateway Vercel)
- Local: http://localhost:8000

## Endpoints

### 1. Health Check
GET / / GET /health
- **Response**: {"status": "online", "service": "BPS Sulteng Insight AI Gateway", "version": "3.1.0"}

### 2. Dashboard Executive Summary
GET /api/dashboard
- **Description**: Mengembalikan 6 KPI utama Sulawesi Tengah dan 1 KPI tolok ukur Nasional BPS Pusat.
- **Cache**: 24 Jam (Redis)

### 3. PDRB & Struktur Ekonomi
GET /api/pdrb?region_code={code}
- **Parameters**: 
egion_code (opsional, default: 7200)
- **Response**: Laju pertumbuhan ekonomi, total nominal PDRB ADHB/ADHK, dan kontribusi 17 lapangan usaha.

### 4. Indeks Pembangunan Manusia (IPM)
GET /api/ipm
- **Response**: IPM 13 Kab/Kota periode 2018-2024, Angka Harapan Hidup (AHH), Harapan Lama Sekolah (HLS), Rata-rata Lama Sekolah (RLS), dan Pengeluaran Riil per Kapita.

### 5. Demografi & Kependudukan
GET /api/population
- **Response**: Jumlah penduduk, piramida usia (gender & umur), laju pertumbuhan penduduk, dan rasio ketergantungan (Bonus Demografi).

### 6. Kemiskinan & Ketenagakerjaan
GET /api/poverty
- **Response**: Persentase kemiskinan (P0), garis kemiskinan (Rp/kapita/bulan), Indeks Kedalaman (P1), Indeks Keparahan (P2), dan TPT Pengangguran.

### 7. AI Statistical Insight Generator
POST /api/ai-insight
- **Request Body**:
  `json
  {
    "indicator": "PDRB",
    "region": "Kab. Morowali",
    "data_summary": {"Pertumbuhan": 24.85, "Sektor_Utama": "Industri Pengolahan"}
  }
  `
- **Response**:
  `json
  {
    "summary": "...",
    "trend": "...",
    "best_region": "...",
    "lowest_region": "...",
    "recommendation": "..."
  }
  `
