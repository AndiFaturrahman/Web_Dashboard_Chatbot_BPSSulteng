import streamlit as st
import pandas as pd
import plotly.express as px
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="Kemiskinan & NTP — STATIX BPS", page_icon="💰", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">💰 Kemiskinan, Pengangguran & Nilai Tukar Petani</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Monitoring persentase kemiskinan makro, garis kemiskinan, pengangguran terbuka, dan kesejahteraan petani.</p>', unsafe_allow_html=True)
st.divider()

df_reg = get_all_regencies_dataset()

c1, c2 = st.columns(2)
with c1:
    fig_pov = px.bar(df_reg.sort_values("Kemiskinan_Persen", ascending=False), x="Wilayah", y="Kemiskinan_Persen",
                     color="Kemiskinan_Persen", color_continuous_scale="Oranges_r", text_auto=".2f",
                     title="Persentase Penduduk Miskin per Kabupaten/Kota (%)")
    fig_pov.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig_pov, use_container_width=True)

with c2:
    fig_ntp = px.bar(df_reg.sort_values("NTP", ascending=False), x="Wilayah", y="NTP",
                     color="NTP", color_continuous_scale="Oranges", text_auto=".1f",
                     title="Indeks Nilai Tukar Petani (NTP > 100 = Surplus Kesejahteraan)")
    fig_ntp.add_hline(y=100, line_dash="dash", line_color="red", annotation_text="Batas Impas (100)")
    fig_ntp.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig_ntp, use_container_width=True)

render_ai_insight_card("Analisis Kemiskinan dan Daya Beli Petani", "Kemiskinan & NTP", "Sulawesi Tengah", {
    "Kemiskinan_Rata2": "11.77%",
    "Wilayah_Tantangan_Kemiskinan": "Donggala & Tojo Una-Una",
    "NTP_Tertinggi": "Morowali Utara (113.8)"
})

render_floating_chatbot("Analisis Kemiskinan dan Pertanian")
