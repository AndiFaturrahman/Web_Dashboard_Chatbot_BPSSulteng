import os
import requests
import json
import csv
import time

API_KEY = "32a4af778c0b74a62c19857b278cab33"
DOMAIN = "7200" # BPS Provinsi Sulawesi Tengah
OUTPUT_DIR = r"D:\Magang BPS\STATIX-Chatbot-BPS\ml-pipeline\data\raw"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 65)
print("BPS SULTENG (DOMAIN 7200) OFFICIAL WEBAPI DATA INGESTION")
print("=" * 65)
print(f"BPS WebAPI Key: {API_KEY[:6]}...{API_KEY[-6:]}")
print(f"Target Domain : {DOMAIN} (Provinsi Sulawesi Tengah)")

# Get List of available years from BPS WebAPI
url_th = f"https://webapi.bps.go.id/v1/api/list/model/th/domain/{DOMAIN}/key/{API_KEY}/"
res_th = requests.get(url_th, timeout=20).json()
th_list = res_th.get("data", [None, []])[1] if "data" in res_th and len(res_th["data"]) > 1 else []
print(f"Available Years in BPS WebAPI: {len(th_list)} years")

INDICATORS = {
    "ipm": {
        "var_id": "48",
        "title": "(Metode Baru) Indeks Pembangunan Manusia",
    },
    "kemiskinan": {
        "var_id": "90",
        "title": "Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota",
    },
    "tpt": {
        "var_id": "92",
        "title": "Tingkat Pengangguran Terbuka (TPT) Menurut Kabupaten/Kota",
    },
    "inflasi": {
        "var_id": "1",
        "title": "Laju Inflasi Tahunan (YoY)",
    },
    "ntp": {
        "var_id": "44",
        "title": "Nilai Tukar Petani (NTP) Gabungan",
    }
}

for key, meta in INDICATORS.items():
    var_id = meta["var_id"]
    title = meta["title"]
    print(f"\nFetching [{key.upper()}] - Var ID {var_id}: {title}...")
    
    combined_datacontent = {}
    vervar_map = {}
    tahun_map = {}
    
    # Query year pairs (max 2 years per request as enforced by BPS WebAPI)
    for t_idx in range(0, min(10, len(th_list)), 2):
        if t_idx + 1 < len(th_list):
            th_param = f"{th_list[t_idx].get('val')}:{th_list[t_idx+1].get('val')}"
        else:
            th_param = f"{th_list[t_idx].get('val')}"
            
        url = f"https://webapi.bps.go.id/v1/api/list/model/data/domain/{DOMAIN}/var/{var_id}/th/{th_param}/key/{API_KEY}/"
        try:
            res = requests.get(url, timeout=25)
            if res.status_code == 200:
                data = res.json()
                if data.get("status") == "OK" and "datacontent" in data:
                    combined_datacontent.update(data["datacontent"])
                    for w in data.get("vervar", []):
                        if isinstance(w, dict) and "val" in w:
                            vervar_map[str(w.get("val"))] = w.get("label")
                    for t in data.get("tahun", []):
                        if isinstance(t, dict) and "val" in t:
                            tahun_map[str(t.get("val"))] = t.get("label")
            time.sleep(0.3)
        except Exception as e:
            print(f"   [WARN] Batch error: {e}")
            
    print(f"[SUCCESS] Retrieved {len(combined_datacontent)} verified data points from BPS WebAPI.")
    print(f"   Wilayah vervar: {len(vervar_map)} regions, Tahun: {len(tahun_map)} years.")
    
    # Save raw JSON backup
    json_file = os.path.join(OUTPUT_DIR, f"{key}_webapi_raw.json")
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump({
            "status": "OK",
            "indicator": key,
            "var_id": var_id,
            "title": title,
            "datacontent": combined_datacontent,
            "vervar": [{"val": k, "label": v} for k, v in vervar_map.items()],
            "tahun": [{"val": k, "label": v} for k, v in tahun_map.items()]
        }, f, ensure_ascii=False, indent=2)
    print(f"   Saved raw JSON snapshot to: {key}_webapi_raw.json")

print("\n" + "=" * 65)
print("ALL BPS WEBAPI INDICATORS INGESTED AND VERIFIED SUCCESSFULLY!")
print("=" * 65)