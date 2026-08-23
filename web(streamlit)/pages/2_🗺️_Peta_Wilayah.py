import streamlit as st
import pandas as pd
import plotly.express as px
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="Peta Wilayah 13 Kab/Kota — STATIX BPS", page_icon="🗺️", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">🗺️ Peta Interaktif Spasial 13 Kabupaten & Kota</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Visualisasi geospasial pemetaan indikator pembangunan, kemiskinan, dan demografi di Sulawesi Tengah.</p>', unsafe_allow_html=True)
st.divider()

df = get_all_regencies_dataset()

metric = st.radio("Pilih Layer Data Peta:", ["Kemiskinan_Persen", "IPM", "PDRB_Triliun", "Pertumbuhan_PDRB", "Pengangguran_Persen", "Penduduk_Ribu"], 
                  horizontal=True, format_func=lambda x: {
                      "Kemiskinan_Persen": "Kemiskinan (%)",
                      "IPM": "Indeks Pembangunan Manusia (IPM)",
                      "PDRB_Triliun": "PDRB (Triliun Rp)",
                      "Pertumbuhan_PDRB": "Pertumbuhan PDRB (%)",
                      "Pengangguran_Persen": "Pengangguran TPT (%)",
                      "Penduduk_Ribu": "Jumlah Penduduk (Ribu Jiwa)"
                  }[x])

fig_map = px.scatter_mapbox(
    df, lat="Lat", lon="Lon", color=metric, size="Penduduk_Ribu", size_max=40,
    hover_name="Wilayah", hover_data={"Lat": False, "Lon": False, metric: True, "Penduduk_Ribu": True},
    color_continuous_scale="Oranges", zoom=6.2, center={"lat": -1.2, "lon": 121.2}, mapbox_style="carto-positron",
    height=550, title=f"Distribusi Spasial: {metric.replace('_', ' ')}"
)
st.plotly_chart(fig_map, use_container_width=True)

render_ai_insight_card("Distribusi Spasial Geospasial", "Geospasial & Wilayah", "Sulawesi Tengah", {
    "Indikator_Terpilih": metric,
    "Nilai_Maksimal": f"{df[metric].max()} ({df.loc[df[metric].idxmax()]['Wilayah']})",
    "Nilai_Minimal": f"{df[metric].min()} ({df.loc[df[metric].idxmin()]['Wilayah']})"
})

render_floating_chatbot("Peta Spasial Geografis Sulawesi Tengah")
