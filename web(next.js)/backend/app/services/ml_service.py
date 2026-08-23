import os
import json
from typing import Dict, Any, Optional

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

def _load_json(filename: str) -> Dict[str, Any]:
    filepath = os.path.join(MODELS_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def get_forecast(kode: str = "7271", indicator: str = "PDRB_Triliun") -> Dict[str, Any]:
    db = _load_json("forecast_models.json")
    if kode in db:
        reg_data = db[kode]
        if indicator in reg_data["indicators"]:
            return {
                "kode": kode,
                "wilayah": reg_data["wilayah"],
                "tipe": reg_data["tipe"],
                "indicator_key": indicator,
                "data": reg_data["indicators"][indicator]
            }
    # Fallback to Palu PDRB
    if "7271" in db and indicator in db["7271"]["indicators"]:
        return {
            "kode": "7271",
            "wilayah": "Kota Palu",
            "tipe": "Kota",
            "indicator_key": indicator,
            "data": db["7271"]["indicators"][indicator]
        }
    return {"error": "Forecast data not found"}

def get_all_clusters() -> Dict[str, Any]:
    return _load_json("kmeans_clusters.json")

def get_all_anomalies() -> Dict[str, Any]:
    return _load_json("anomaly_results.json")

def simulate_policy(
    edu_invest_miliar: float = 50.0,
    infra_invest_miliar: float = 100.0,
    industry_projects: int = 5,
    umkm_assistance_units: int = 1000
) -> Dict[str, Any]:
    policy_cfg = _load_json("policy_simulator.json")
    baseline = policy_cfg.get("baseline", {
        "ipm": 71.38,
        "kemiskinan": 11.77,
        "pdrb_growth": 11.91,
        "pengangguran": 2.95
    })
    
    # Calculate Deltas based on econometrics sensitivity
    d_ipm_edu = (edu_invest_miliar / 10.0) * 0.12
    d_ipm_infra = (infra_invest_miliar / 20.0) * 0.08
    d_ipm_ind = industry_projects * 0.05
    d_ipm_umkm = (umkm_assistance_units / 500.0) * 0.04
    total_delta_ipm = round(d_ipm_edu + d_ipm_infra + d_ipm_ind + d_ipm_umkm, 2)
    
    d_kem_edu = (edu_invest_miliar / 10.0) * (-0.08)
    d_kem_infra = (infra_invest_miliar / 20.0) * (-0.15)
    d_kem_ind = industry_projects * (-0.06)
    d_kem_umkm = (umkm_assistance_units / 500.0) * (-0.14)
    total_delta_kem = round(d_kem_edu + d_kem_infra + d_kem_ind + d_kem_umkm, 2)
    
    d_pdrb = round(industry_projects * 0.35 + (infra_invest_miliar / 50.0) * 0.25, 2)
    
    simulated_ipm = round(baseline["ipm"] + total_delta_ipm, 2)
    simulated_kem = round(max(4.0, baseline["kemiskinan"] + total_delta_kem), 2)
    simulated_pdrb_growth = round(baseline["pdrb_growth"] + d_pdrb, 2)
    
    # SHAP-inspired Feature Contribution Breakdown
    shap_factors = [
        {"factor": "Investasi Pendidikan & Beasiswa", "contribution": f"+{round((d_ipm_edu / max(0.01, total_delta_ipm)) * 100)}%", "value_raw": f"Rp {edu_invest_miliar} Miliar"},
        {"factor": "Infrastruktur & Konektivitas", "contribution": f"+{round((d_ipm_infra / max(0.01, total_delta_ipm)) * 100)}%", "value_raw": f"Rp {infra_invest_miliar} Miliar"},
        {"factor": "Hilirisasi & Industri Pengolahan", "contribution": f"+{round((d_ipm_ind / max(0.01, total_delta_ipm)) * 100)}%", "value_raw": f"{industry_projects} Proyek"},
        {"factor": "Pemberdayaan UMKM & Bansos", "contribution": f"+{round((d_ipm_umkm / max(0.01, total_delta_ipm)) * 100)}%", "value_raw": f"{umkm_assistance_units} Unit"}
    ]
    
    return {
        "scenario": {
            "edu_invest_miliar": edu_invest_miliar,
            "infra_invest_miliar": infra_invest_miliar,
            "industry_projects": industry_projects,
            "umkm_assistance_units": umkm_assistance_units
        },
        "baseline": baseline,
        "simulated": {
            "ipm": simulated_ipm,
            "delta_ipm": f"+{total_delta_ipm}",
            "kemiskinan": simulated_kem,
            "delta_kemiskinan": f"{total_delta_kem}%",
            "pdrb_growth": simulated_pdrb_growth,
            "delta_pdrb_growth": f"+{d_pdrb}%"
        },
        "shap_breakdown": shap_factors,
        "ai_narrative": f"Skenario kebijakan dengan alokasi pendidikan Rp {edu_invest_miliar}M dan infrastruktur Rp {infra_invest_miliar}M diproyeksikan mampu meningkatkan IPM Sulteng menjadi {simulated_ipm} (naik +{total_delta_ipm} poin) dan menekan angka kemiskinan ke level {simulated_kem}% (turun {abs(total_delta_kem)}%).",
        "disclaimer": "Simulasi berbasis model elastisitas ekonometrik multivariat BPS Sulteng. Status: Estimated Scenario."
    }
