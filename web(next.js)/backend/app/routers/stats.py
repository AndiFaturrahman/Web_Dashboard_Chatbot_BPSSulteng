from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.bps_service import get_dashboard_summary, get_regencies
from app.ai.gpt_insight import generate_ai_insight
from app.models.schemas import AiInsightRequest, AiInsightResponse

router = APIRouter(prefix="/api", tags=["BPS Statistics"])

@router.get("/dashboard")
async def get_dashboard():
    return get_dashboard_summary()

@router.get("/regencies")
async def get_all_regencies():
    return get_regencies()

@router.get("/pdrb")
async def get_pdrb_data():
    regencies = get_regencies()
    sectors = [
        {"Sektor": "Industri Pengolahan (Smelter Nikel)", "Porsi": 41.2, "Pertumbuhan": 26.5},
        {"Sektor": "Pertanian, Kehutanan & Perikanan", "Porsi": 18.6, "Pertumbuhan": 4.8},
        {"Sektor": "Pertambangan & Penggalian", "Porsi": 13.4, "Pertumbuhan": 14.2},
        {"Sektor": "Konstruksi & Infrastruktur", "Porsi": 8.9, "Pertumbuhan": 6.1},
        {"Sektor": "Perdagangan Besar & Eceran", "Porsi": 6.5, "Pertumbuhan": 5.4},
        {"Sektor": "Lainnya", "Porsi": 11.4, "Pertumbuhan": 5.0},
    ]
    return {"regencies": regencies, "sectors": sectors}

@router.get("/ipm")
async def get_ipm_data():
    return {
        "regencies": get_regencies(),
        "trends": [
            {"Tahun": 2018, "Sulteng": 68.88, "Nasional": 71.39, "Palu": 80.50},
            {"Tahun": 2019, "Sulteng": 69.50, "Nasional": 71.92, "Palu": 81.12},
            {"Tahun": 2020, "Sulteng": 69.55, "Nasional": 71.94, "Palu": 81.47},
            {"Tahun": 2021, "Sulteng": 69.79, "Nasional": 72.29, "Palu": 81.70},
            {"Tahun": 2022, "Sulteng": 70.28, "Nasional": 72.91, "Palu": 82.02},
            {"Tahun": 2023, "Sulteng": 70.80, "Nasional": 73.55, "Palu": 82.35},
            {"Tahun": 2024, "Sulteng": 71.38, "Nasional": 74.39, "Palu": 82.52},
        ]
    }

@router.get("/population")
async def get_population_data():
    return {
        "regencies": get_regencies(),
        "pyramid": [
            {"Umur": "0-4", "Pria": 128, "Wanita": 121},
            {"Umur": "5-9", "Pria": 135, "Wanita": 128},
            {"Umur": "10-14", "Pria": 142, "Wanita": 134},
            {"Umur": "15-19", "Pria": 148, "Wanita": 140},
            {"Umur": "20-24", "Pria": 155, "Wanita": 147},
            {"Umur": "25-29", "Pria": 149, "Wanita": 142},
            {"Umur": "30-34", "Pria": 138, "Wanita": 131},
            {"Umur": "35-39", "Pria": 125, "Wanita": 119},
            {"Umur": "40-44", "Pria": 112, "Wanita": 107},
            {"Umur": "45-49", "Pria": 98, "Wanita": 94},
            {"Umur": "50+", "Pria": 274, "Wanita": 260},
        ]
    }

@router.get("/poverty")
async def get_poverty_data():
    return {"regencies": get_regencies()}

@router.post("/ai-insight", response_model=AiInsightResponse)
async def post_ai_insight(req: AiInsightRequest):
    return generate_ai_insight(req.indicator, req.region, req.data_summary)
