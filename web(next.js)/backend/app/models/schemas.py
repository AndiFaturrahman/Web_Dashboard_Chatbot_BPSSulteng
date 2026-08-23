from pydantic import BaseModel
from typing import Dict, List, Optional, Any

class MetricItem(BaseModel):
    val: str
    delta: str
    status: str
    subtext: str

class DashboardSummaryResponse(BaseModel):
    sulteng: Dict[str, MetricItem]
    nasional: Dict[str, str]

class RegencyItem(BaseModel):
    Kode: str
    Wilayah: str
    Tipe: str
    Lat: float
    Lon: float
    Penduduk_Ribu: float
    PDRB_Triliun: float
    Pertumbuhan_PDRB: float
    IPM: float
    Kemiskinan_Persen: float
    Pengangguran_Persen: float
    NTP: float

class AiInsightRequest(BaseModel):
    indicator: str
    region: Optional[str] = "Sulawesi Tengah"
    data_summary: Optional[Dict[str, Any]] = None

class AiInsightResponse(BaseModel):
    summary: str
    trend: str
    best_region: str
    lowest_region: str
    recommendation: str
