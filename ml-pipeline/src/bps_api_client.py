"""
BPS WebAPI Official Client Module
Digunakan untuk menarik data statistik resmi langsung dari server BPS RI & BPS Sulteng.
"""

import os
import requests
import json
import time

# ==============================================================================
# KONFIGURASI BPS WEBAPI
# ==============================================================================
BPS_API_KEY = os.getenv("BPS_API_KEY", "32a4af778c0b74a62c19857b278cab33")
BPS_DOMAIN = "7200"  # 7200 = BPS Provinsi Sulawesi Tengah
BASE_URL = "https://webapi.bps.go.id/v1/api/list/model"

class BpsWebApiClient:
    def __init__(self, api_key: str = BPS_API_KEY, domain: str = BPS_DOMAIN):
        self.api_key = api_key
        self.domain = domain

    def get_variables(self, page: int = 1):
        """Mengambil daftar variabel statistik yang tersedia di BPS Sulteng"""
        url = f"{BASE_URL}/var/domain/{self.domain}/page/{page}/key/{self.api_key}/"
        res = requests.get(url, timeout=20)
        return res.json()

    def get_years(self):
        """Mengambil daftar ID tahun yang tersedia di BPS Sulteng"""
        url = f"{BASE_URL}/th/domain/{self.domain}/key/{self.api_key}/"
        res = requests.get(url, timeout=20)
        return res.json()

    def fetch_data(self, var_id: str, th_param: str):
        """
        Menarik data spesifik berdasarkan var_id dan rentang tahun (maksimal 2 tahun per request sesuai aturan BPS)
        Contoh: fetch_data(var_id="48", th_param="123:124")
        """
        url = f"{BASE_URL}/data/domain/{self.domain}/var/{var_id}/th/{th_param}/key/{self.api_key}/"
        res = requests.get(url, timeout=25)
        return res.json()

if __name__ == "__main__":
    client = BpsWebApiClient()
    print("Testing connection to BPS WebAPI with Key:", BPS_API_KEY[:6] + "..." + BPS_API_KEY[-6:])
    years = client.get_years()
    print("Years status:", years.get("status"))
