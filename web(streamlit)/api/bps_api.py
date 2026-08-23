"""
BPS Web API Connector & Sulawesi Tengah Comprehensive Datasets
Official API Key: 32a4af778c0b74a62c19857b278cab33
Domain: 7200 (Sulawesi Tengah) + 13 Regency/City Sub-domains + 0000 (Nasional)
"""

import requests
import re
import pandas as pd
import numpy as np
import streamlit as st

BPS_API_KEY = "32a4af778c0b74a62c19857b278cab33"
BPS_API_BASE = "https://webapi.bps.go.id/v1/api"

# 13 Kabupaten / Kota di Sulawesi Tengah Beserta Koordinat & Profil Resmi
SULTENG_REGIONS = {
    "7271": {"name": "Kota Palu", "type": "Kota", "lat": -0.8917, "lon": 119.8707, "capital": "Palu"},
    "7201": {"name": "Kab. Banggai", "type": "Kabupaten", "lat": -0.9247, "lon": 122.3789, "capital": "Luwuk"},
    "7202": {"name": "Kab. Banggai Kepulauan", "type": "Kabupaten", "lat": -1.3333, "lon": 123.1667, "capital": "Salakan"},
    "7203": {"name": "Kab. Morowali", "type": "Kabupaten", "lat": -2.6288, "lon": 121.9042, "capital": "Bungku"},
    "7204": {"name": "Kab. Poso", "type": "Kabupaten", "lat": -1.3965, "lon": 120.7511, "capital": "Poso"},
    "7205": {"name": "Kab. Donggala", "type": "Kabupaten", "lat": -0.6865, "lon": 119.7420, "capital": "Banawa"},
    "7206": {"name": "Kab. Tolitoli", "type": "Kabupaten", "lat": 1.0427, "lon": 120.8143, "capital": "Baolan"},
    "7207": {"name": "Kab. Buol", "type": "Kabupaten", "lat": 1.0000, "lon": 121.3333, "capital": "Biau"},
    "7208": {"name": "Kab. Parigi Moutong", "type": "Kabupaten", "lat": -0.8333, "lon": 120.1667, "capital": "Parigi"},
    "7209": {"name": "Kab. Tojo Una-Una", "type": "Kabupaten", "lat": -1.1667, "lon": 121.5000, "capital": "Ampana"},
    "7210": {"name": "Kab. Sigi", "type": "Kabupaten", "lat": -1.3853, "lon": 119.9806, "capital": "Sigi Biromaru"},
    "7211": {"name": "Kab. Banggai Laut", "type": "Kabupaten", "lat": -1.6167, "lon": 123.5000, "capital": "Banggai"},
    "7212": {"name": "Kab. Morowali Utara", "type": "Kabupaten", "lat": -1.9167, "lon": 121.3333, "capital": "Kolonodale"},
}

@st.cache_data(ttl=3600)
def fetch_timeseries_bps(keyword, domain="7200", limit=8):
    """Fetch live time-series data from BPS Press Release (BRS) API"""
    url = f"{BPS_API_BASE}/list/model/pressrelease/domain/{domain}/key/{BPS_API_KEY}/keyword/{keyword}/lang/ind/"
    try:
        resp = requests.get(url, timeout=8).json()
        if resp.get("status") == "OK":
            items = resp.get("data", [])
            if len(items) > 1:
                results = []
                for item in items[1][:limit]:
                    date_str = item.get("rl_date")
                    abstract = item.get("abstract", "")
                    
                    match = re.search(r'sebesar\s+(Rp\s*)?([\d,\.]+)\s*(persen|miliar|juta|US\$)?', abstract, re.IGNORECASE)
                    if not match:
                        match = re.search(r'([\d,\.]+)\s*(persen|miliar|juta)', abstract, re.IGNORECASE)
                        
                    if match:
                        val_str = match.group(2).replace(',', '.')
                        try:
                            val = float(val_str)
                            results.append({"Tanggal": date_str, "Nilai": val})
                        except:
                            pass
                
                if results:
                    df = pd.DataFrame(results)
                    df['Tanggal'] = pd.to_datetime(df['Tanggal'])
                    df = df.sort_values('Tanggal')
                    return df
        return pd.DataFrame(columns=["Tanggal", "Nilai"])
    except Exception:
        return pd.DataFrame(columns=["Tanggal", "Nilai"])

@st.cache_data(ttl=3600)
def get_sulteng_key_metrics():
    """Returns the latest key statistics for Sulawesi Tengah & National Benchmark"""
    return {
        "sulteng": {
            "penduduk": {"val": "3,15 Juta", "delta": "+1.24% YoY", "status": "up", "subtext": "Sensus & Proyeksi BPS 2024"},
            "ipm": {"val": "71.38", "delta": "+0.54 poin", "status": "up", "subtext": "Kategori Tinggi (Target 72.5)"},
            "kemiskinan": {"val": "11.77%", "delta": "-0.64% YoY", "status": "down", "subtext": "379,76 Ribu Jiwa (Tren Menurun)"},
            "pengangguran": {"val": "2.95%", "delta": "-0.20% YoY", "status": "down", "subtext": "TPT Terendah di Sulawesi"},
            "pertumbuhan_ekonomi": {"val": "11.91%", "delta": "+2.14% YoY", "status": "up", "subtext": "Tertinggi Nasional (Hilirisasi)"},
            "inflasi": {"val": "2.18%", "delta": "Terkendali", "status": "neutral", "subtext": "Rentang Target BI 2.5±1%"}
        },
        "nasional": {
            "title": "BPS Pusat (Nasional RI)",
            "penduduk": "281,6 Juta",
            "ipm": "74.39",
            "kemiskinan": "9.03%",
            "pengangguran": "4.82%",
            "pertumbuhan_ekonomi": "5.05%",
            "inflasi": "2.12%"
        }
    }

@st.cache_data(ttl=3600)
def get_all_regencies_dataset():
    """Complete multi-indicator dataset for all 13 regencies in Sulawesi Tengah (2020-2024)"""
    data = [
        {"Kode": "7271", "Wilayah": "Kota Palu", "Tipe": "Kota", "Lat": -0.8917, "Lon": 119.8707, 
         "Penduduk_Ribu": 381.2, "PDRB_Triliun": 32.4, "Pertumbuhan_PDRB": 6.82, "IPM": 82.52, "Kemiskinan_Persen": 6.54, "Pengangguran_Persen": 5.48, "NTP": 102.1},
        {"Kode": "7201", "Wilayah": "Kab. Banggai", "Tipe": "Kabupaten", "Lat": -0.9247, "Lon": 122.3789, 
         "Penduduk_Ribu": 369.8, "PDRB_Triliun": 29.8, "Pertumbuhan_PDRB": 7.45, "IPM": 71.85, "Kemiskinan_Persen": 7.32, "Pengangguran_Persen": 3.12, "NTP": 108.4},
        {"Kode": "7202", "Wilayah": "Kab. Banggai Kepulauan", "Tipe": "Kabupaten", "Lat": -1.3333, "Lon": 123.1667, 
         "Penduduk_Ribu": 123.4, "PDRB_Triliun": 5.8, "Pertumbuhan_PDRB": 4.62, "IPM": 66.84, "Kemiskinan_Persen": 13.25, "Pengangguran_Persen": 2.85, "NTP": 104.2},
        {"Kode": "7203", "Wilayah": "Kab. Morowali", "Tipe": "Kabupaten", "Lat": -2.6288, "Lon": 121.9042, 
         "Penduduk_Ribu": 178.6, "PDRB_Triliun": 64.2, "Pertumbuhan_PDRB": 24.85, "IPM": 73.80, "Kemiskinan_Persen": 12.18, "Pengangguran_Persen": 3.42, "NTP": 112.5},
        {"Kode": "7204", "Wilayah": "Kab. Poso", "Tipe": "Kabupaten", "Lat": -1.3965, "Lon": 120.7511, 
         "Penduduk_Ribu": 251.8, "PDRB_Triliun": 13.9, "Pertumbuhan_PDRB": 5.34, "IPM": 72.48, "Kemiskinan_Persen": 15.12, "Pengangguran_Persen": 2.68, "NTP": 109.1},
        {"Kode": "7205", "Wilayah": "Kab. Donggala", "Tipe": "Kabupaten", "Lat": -0.6865, "Lon": 119.7420, 
         "Penduduk_Ribu": 308.5, "PDRB_Triliun": 11.2, "Pertumbuhan_PDRB": 4.95, "IPM": 67.12, "Kemiskinan_Persen": 16.48, "Pengangguran_Persen": 3.20, "NTP": 105.7},
        {"Kode": "7206", "Wilayah": "Kab. Tolitoli", "Tipe": "Kabupaten", "Lat": 1.0427, "Lon": 120.8143, 
         "Penduduk_Ribu": 230.1, "PDRB_Triliun": 10.4, "Pertumbuhan_PDRB": 5.10, "IPM": 67.35, "Kemiskinan_Persen": 12.82, "Pengangguran_Persen": 2.94, "NTP": 107.3},
        {"Kode": "7207", "Wilayah": "Kab. Buol", "Tipe": "Kabupaten", "Lat": 1.0000, "Lon": 121.3333, 
         "Penduduk_Ribu": 151.4, "PDRB_Triliun": 6.2, "Pertumbuhan_PDRB": 4.78, "IPM": 69.45, "Kemiskinan_Persen": 13.62, "Pengangguran_Persen": 3.15, "NTP": 106.8},
        {"Kode": "7208", "Wilayah": "Kab. Parigi Moutong", "Tipe": "Kabupaten", "Lat": -0.8333, "Lon": 120.1667, 
         "Penduduk_Ribu": 451.2, "PDRB_Triliun": 18.5, "Pertumbuhan_PDRB": 5.62, "IPM": 67.24, "Kemiskinan_Persen": 14.28, "Pengangguran_Persen": 2.45, "NTP": 110.2},
        {"Kode": "7209", "Wilayah": "Kab. Tojo Una-Una", "Tipe": "Kabupaten", "Lat": -1.1667, "Lon": 121.5000, 
         "Penduduk_Ribu": 167.3, "PDRB_Triliun": 7.6, "Pertumbuhan_PDRB": 4.88, "IPM": 66.21, "Kemiskinan_Persen": 15.85, "Pengangguran_Persen": 2.65, "NTP": 105.9},
        {"Kode": "7210", "Wilayah": "Kab. Sigi", "Tipe": "Kabupaten", "Lat": -1.3853, "Lon": 119.9806, 
         "Penduduk_Ribu": 264.7, "PDRB_Triliun": 9.8, "Pertumbuhan_PDRB": 6.12, "IPM": 69.85, "Kemiskinan_Persen": 11.95, "Pengangguran_Persen": 2.50, "NTP": 111.4},
        {"Kode": "7211", "Wilayah": "Kab. Banggai Laut", "Tipe": "Kabupaten", "Lat": -1.6167, "Lon": 123.5000, 
         "Penduduk_Ribu": 72.8, "PDRB_Triliun": 3.2, "Pertumbuhan_PDRB": 4.50, "IPM": 66.52, "Kemiskinan_Persen": 13.90, "Pengangguran_Persen": 2.30, "NTP": 104.8},
        {"Kode": "7212", "Wilayah": "Kab. Morowali Utara", "Tipe": "Kabupaten", "Lat": -1.9167, "Lon": 121.3333, 
         "Penduduk_Ribu": 148.9, "PDRB_Triliun": 36.1, "Pertumbuhan_PDRB": 21.40, "IPM": 70.42, "Kemiskinan_Persen": 12.75, "Pengangguran_Persen": 2.75, "NTP": 113.8},
    ]
    return pd.DataFrame(data)

@st.cache_data(ttl=3600)
def get_ipm_trend_comparison():
    """Historical IPM Trends (2018-2024)"""
    years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
    df = pd.DataFrame({
        "Tahun": years,
        "Sulawesi Tengah": [68.88, 69.50, 69.55, 69.79, 70.28, 70.80, 71.38],
        "Kota Palu (Tertinggi)": [80.50, 81.12, 81.47, 81.70, 82.02, 82.35, 82.52],
        "Kab. Morowali (Akselerasi)": [70.10, 70.80, 71.20, 71.95, 72.60, 73.20, 73.80],
        "Nasional (Indonesia)": [71.39, 71.92, 71.94, 72.29, 72.91, 73.55, 74.39]
    })
    return df

@st.cache_data(ttl=3600)
def get_pdrb_structure():
    """PDRB sector distribution for Central Sulawesi (Lap. Usaha)"""
    sectors = [
        {"Sektor": "Industri Pengolahan (Smelter Nikel)", "Porsi": 41.2, "Pertumbuhan": 26.5},
        {"Sektor": "Pertanian, Kehutanan & Perikanan", "Porsi": 18.6, "Pertumbuhan": 4.8},
        {"Sektor": "Pertambangan & Penggalian", "Porsi": 13.4, "Pertumbuhan": 14.2},
        {"Sektor": "Konstruksi & Infrastruktur", "Porsi": 8.9, "Pertumbuhan": 6.1},
        {"Sektor": "Perdagangan Besar & Eceran", "Porsi": 6.5, "Pertumbuhan": 5.4},
        {"Sektor": "Transportasi & Pergudangan", "Porsi": 3.8, "Pertumbuhan": 7.2},
        {"Sektor": "Jasa Pendidikan & Kesehatan", "Porsi": 4.1, "Pertumbuhan": 5.8},
        {"Sektor": "Lainnya", "Porsi": 3.5, "Pertumbuhan": 4.1},
    ]
    return pd.DataFrame(sectors)

@st.cache_data(ttl=3600)
def get_population_pyramid():
    """Age structure for Central Sulawesi (Sensus BPS)"""
    age_groups = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70+"]
    pria = [-128, -135, -142, -148, -155, -149, -138, -125, -112, -98, -82, -67, -51, -36, -38]
    wanita = [121, 128, 134, 140, 147, 142, 131, 119, 107, 94, 79, 64, 49, 35, 41]
    
    return pd.DataFrame({
        "Kelompok_Umur": age_groups,
        "Laki-laki (Ribu)": pria,
        "Perempuan (Ribu)": wanita
    })
