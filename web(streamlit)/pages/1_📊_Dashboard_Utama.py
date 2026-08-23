import streamlit as st
import pandas as pd
import plotly.express as px
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset, get_ipm_trend_comparison, get_pdrb_structure
from ai.insight import render_ai_insight_card
from components.key_cards import render_key_cards
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="Dashboard Utama — STATIX BPS", page_icon="📊", layout="wide")

# CSS
css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">📊 Dashboard Utama Eksekutif BPS Sulteng</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Ringkasan metrik strategis, performa makroekonomi, dan evaluasi kesejahteraan masyarakat Sulawesi Tengah.</p>', unsafe_allow_html=True)
st.divider()

render_key_cards()

df = get_all_regencies_dataset()

c1, c2 = st.columns(2)
with c1:
    fig1 = px.bar(df.sort_values("PDRB_Triliun", ascending=False), x="Wilayah", y="PDRB_Triliun", 
                  title="Total PDRB atas Dasar Harga Berlaku (Triliun Rp)", color="PDRB_Triliun", color_continuous_scale="Oranges", text_auto=".1f")
    fig1.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig1, use_container_width=True)
    
with c2:
    fig2 = px.bar(df.sort_values("IPM", ascending=False), x="Wilayah", y="IPM", 
                  title="Peringkat Indeks Pembangunan Manusia (IPM) 13 Kab/Kota", color="IPM", color_continuous_scale="Oranges", text_auto=".2f")
    fig2.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig2, use_container_width=True)

render_ai_insight_card("Ringkasan Eksekutif PDRB dan IPM", "Makroekonomi", "Sulawesi Tengah", {
    "Total_Wilayah": 13,
    "PDRB_Tertinggi": "Morowali (64.2T)",
    "IPM_Tertinggi": "Kota Palu (82.52)"
})

render_floating_chatbot("Dashboard Utama Eksekutif BPS Sulteng")
