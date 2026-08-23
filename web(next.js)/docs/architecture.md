# 🏛️ System Architecture — BPS Sulteng Insight AI

`
[ Frontend: Next.js 15 App Router + Tailwind + Framer Motion ]
                          │
         HTTPS / REST API │ Web Sockets
                          ▼
[ Backend Gateway: FastAPI + Pydantic + Uvicorn ]
         │                               │
         ▼                               ▼
[ Redis Cache Layer (24h TTL) ]     [ AI Insight Engine (Gemini / GPT) ]
         │
         ▼
[ Official BPS Web API ]
(https://webapi.bps.go.id/v1/api)
Key: 32a4af778c0b74a62c19857b278cab33
- Domain 7200 (Sulawesi Tengah)
- 13 Sub-Domain Kabupaten & Kota
- Domain 0000 (BPS Pusat Nasional)
`

## Security & Reliability
1. **Server-Side API Key**: BPS API Key dan Google AI Key tersimpan di environment backend (.env), tidak pernah terekspos ke browser client.
2. **24-Hour Smart Cache**: Data publikasi BPS bersifat bulanan/tahunan, sehingga di-cache untuk latency < 15ms.
3. **Resilience Strategy**: Dilengkapi local historical baseline dataset 13 Kabupaten/Kota jika server BPS Web API sedang mengalami antrean/pemeliharaan.
