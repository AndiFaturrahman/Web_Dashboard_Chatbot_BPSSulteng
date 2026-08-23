import streamlit as st
import pandas as pd
import plotly.express as px
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset, get_ipm_trend_comparison
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="IPM & Sosial — STATIX BPS", page_icon="❤️", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">❤️ Indeks Pembangunan Manusia (IPM) & Dimensi Sosial</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Peningkatan kualitas hidup, umur panjang, akses pendidikan, dan pengeluaran per kapita disesuaikan.</p>', unsafe_allow_html=True)
st.divider()

df_reg = get_all_regencies_dataset()
df_ipm_trend = get_ipm_trend_comparison()

c1, c2 = st.columns(2)
with c1:
    fig_trend = px.line(df_ipm_trend, x="Tahun", y=["Sulawesi Tengah", "Kota Palu (Tertinggi)", "Nasional (Indonesia)"],
                        markers=True, title="Trajektori IPM Sulawesi Tengah vs Tolok Ukur Nasional (2018-2024)",
                        color_discrete_sequence=["#F58220", "#059669", "#1E293B"])
    st.plotly_chart(fig_trend, use_container_width=True)

with c2:
    fig_bar = px.bar(df_reg.sort_values("IPM", ascending=True), y="Wilayah", x="IPM", orientation="h",
                     color="IPM", color_continuous_scale="Oranges", text_auto=".2f",
                     title="Peringkat IPM Seluruh Kabupaten/Kota")
    st.plotly_chart(fig_bar, use_container_width=True)

render_ai_insight_card("Evaluasi Kemajuan Indeks Pembangunan Manusia", "Sosial & IPM", "Sulawesi Tengah", {
    "IPM_Sulteng_2024": 71.38,
    "Status": "Kategori Tinggi",
    "Akselerasi_Tercepat": "Kab. Morowali & Sigi"
})

render_floating_chatbot("Analisis IPM dan Pembangunan Manusia BPS")
