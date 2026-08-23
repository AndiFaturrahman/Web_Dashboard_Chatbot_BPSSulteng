import os
import requests
import re
from typing import Dict, List, Any
from app.cache.redis_cache import get_cache, set_cache

BPS_API_KEY = os.environ.get("BPS_API_KEY", "32a4af778c0b74a62c19857b278cab33")
BPS_API_BASE = "https://webapi.bps.go.id/v1/api"

REGENCY_DATABASE: List[Dict[str, Any]] = [
    {"Kode": "7271", "Wilayah": "Kota Palu", "Tipe": "Kota", "Lat": -0.8917, "Lon": 119.8707, "Penduduk_Ribu": 381.2, "PDRB_Triliun": 32.4, "Pertumbuhan_PDRB": 6.82, "IPM": 82.52, "Kemiskinan_Persen": 6.54, "Pengangguran_Persen": 5.48, "NTP": 102.1},
    {"Kode": "7201", "Wilayah": "Kab. Banggai", "Tipe": "Kabupaten", "Lat": -0.9247, "Lon": 122.3789, "Penduduk_Ribu": 369.8, "PDRB_Triliun": 29.8, "Pertumbuhan_PDRB": 7.45, "IPM": 71.85, "Kemiskinan_Persen": 7.32, "Pengangguran_Persen": 3.12, "NTP": 108.4},
    {"Kode": "7202", "Wilayah": "Kab. Banggai Kepulauan", "Tipe": "Kabupaten", "Lat": -1.3333, "Lon": 123.1667, "Penduduk_Ribu": 123.4, "PDRB_Triliun": 5.8, "Pertumbuhan_PDRB": 4.62, "IPM": 66.84, "Kemiskinan_Persen": 13.25, "Pengangguran_Persen": 2.85, "NTP": 104.2},
    {"Kode": "7203", "Wilayah": "Kab. Morowali", "Tipe": "Kabupaten", "Lat": -2.6288, "Lon": 121.9042, "Penduduk_Ribu": 178.6, "PDRB_Triliun": 64.2, "Pertumbuhan_PDRB": 24.85, "IPM": 73.80, "Kemiskinan_Persen": 12.18, "Pengangguran_Persen": 3.42, "NTP": 112.5},
    {"Kode": "7204", "Wilayah": "Kab. Poso", "Tipe": "Kabupaten", "Lat": -1.3965, "Lon": 120.7511, "Penduduk_Ribu": 251.8, "PDRB_Triliun": 13.9, "Pertumbuhan_PDRB": 5.34, "IPM": 72.48, "Kemiskinan_Persen": 15.12, "Pengangguran_Persen": 2.68, "NTP": 109.1},
    {"Kode": "7205", "Wilayah": "Kab. Donggala", "Tipe": "Kabupaten", "Lat": -0.6865, "Lon": 119.7420, "Penduduk_Ribu": 308.5, "PDRB_Triliun": 11.2, "Pertumbuhan_PDRB": 4.95, "IPM": 67.12, "Kemiskinan_Persen": 16.48, "Pengangguran_Persen": 3.20, "NTP": 105.7},
    {"Kode": "7206", "Wilayah": "Kab. Tolitoli", "Tipe": "Kabupaten", "Lat": 1.0427, "Lon": 120.8143, "Penduduk_Ribu": 230.1, "PDRB_Triliun": 10.4, "Pertumbuhan_PDRB": 5.10, "IPM": 67.35, "Kemiskinan_Persen": 12.82, "Pengangguran_Persen": 2.94, "NTP": 107.3},
    {"Kode": "7207", "Wilayah": "Kab. Buol", "Tipe": "Kabupaten", "Lat": 1.0000, "Lon": 121.3333, "Penduduk_Ribu": 151.4, "PDRB_Triliun": 6.2, "Pertumbuhan_PDRB": 4.78, "IPM": 69.45, "Kemiskinan_Persen": 13.62, "Pengangguran_Persen": 3.15, "NTP": 106.8},
    {"Kode": "7208", "Wilayah": "Kab. Parigi Moutong", "Tipe": "Kabupaten", "Lat": -0.8333, "Lon": 120.1667, "Penduduk_Ribu": 451.2, "PDRB_Triliun": 18.5, "Pertumbuhan_PDRB": 5.62, "IPM": 67.24, "Kemiskinan_Persen": 14.28, "Pengangguran_Persen": 2.45, "NTP": 110.2},
    {"Kode": "7209", "Wilayah": "Kab. Tojo Una-Una", "Tipe": "Kabupaten", "Lat": -1.1667, "Lon": 121.5000, "Penduduk_Ribu": 167.3, "PDRB_Triliun": 7.6, "Pertumbuhan_PDRB": 4.88, "IPM": 66.21, "Kemiskinan_Persen": 15.85, "Pengangguran_Persen": 2.65, "NTP": 105.9},
    {"Kode": "7210", "Wilayah": "Kab. Sigi", "Tipe": "Kabupaten", "Lat": -1.3853, "Lon": 119.9806, "Penduduk_Ribu": 264.7, "PDRB_Triliun": 9.8, "Pertumbuhan_PDRB": 6.12, "IPM": 69.85, "Kemiskinan_Persen": 11.95, "Pengangguran_Persen": 2.50, "NTP": 111.4},
    {"Kode": "7211", "Wilayah": "Kab. Banggai Laut", "Tipe": "Kabupaten", "Lat": -1.6167, "Lon": 123.5000, "Penduduk_Ribu": 72.8, "PDRB_Triliun": 3.2, "Pertumbuhan_PDRB": 4.50, "IPM": 66.52, "Kemiskinan_Persen": 13.90, "Pengangguran_Persen": 2.30, "NTP": 104.8},
    {"Kode": "7212", "Wilayah": "Kab. Morowali Utara", "Tipe": "Kabupaten", "Lat": -1.9167, "Lon": 121.3333, "Penduduk_Ribu": 148.9, "PDRB_Triliun": 36.1, "Pertumbuhan_PDRB": 21.40, "IPM": 70.42, "Kemiskinan_Persen": 12.75, "Pengangguran_Persen": 2.75, "NTP": 113.8},
]

def get_dashboard_summary() -> Dict[str, Any]:
    cached = get_cache("dashboard_summary")
    if cached:
        return cached
        
    data = {
        "sulteng": {
            "penduduk": {"val": "3,15 Juta", "delta": "+1.24% YoY", "status": "up", "subtext": "Sensus BPS 2024"},
            "ipm": {"val": "71.38", "delta": "+0.54 poin", "status": "up", "subtext": "Kategori Tinggi"},
            "kemiskinan": {"val": "11.77%", "delta": "-0.64% YoY", "status": "down", "subtext": "379,76 Ribu Jiwa"},
            "pengangguran": {"val": "2.95%", "delta": "-0.20% YoY", "status": "down", "subtext": "Terendah di Sulawesi"},
            "pertumbuhan_ekonomi": {"val": "11.91%", "delta": "+2.14% YoY", "status": "up", "subtext": "Tertinggi Nasional"},
            "inflasi": {"val": "2.18%", "delta": "Terkendali", "status": "neutral", "subtext": "Target BI 2.5±1%"}
        },
        "nasional": {
            "penduduk": "281,6 Juta",
            "ipm": "74.39",
            "kemiskinan": "9.03%",
            "pengangguran": "4.82%",
            "pertumbuhan_ekonomi": "5.05%",
            "inflasi": "2.12%"
        }
    }
    set_cache("dashboard_summary", data, ttl_seconds=86400)
    return data

def get_regencies() -> List[Dict[str, Any]]:
    return REGENCY_DATABASE
