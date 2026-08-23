import streamlit as st
import pandas as pd
import plotly.express as px
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset, get_pdrb_structure
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="PDRB & Ekonomi — STATIX BPS", page_icon="📈", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">📈 Produk Domestik Regional Bruto (PDRB) & Pertumbuhan</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Analisis kontribusi sektor industri hilirisasi, pertambangan nikel, pertanian, dan struktur ekonomi daerah.</p>', unsafe_allow_html=True)
st.divider()

df_reg = get_all_regencies_dataset()
df_sec = get_pdrb_structure()

c1, c2 = st.columns(2)
with c1:
    fig_bar = px.bar(df_reg.sort_values("Pertumbuhan_PDRB", ascending=False), x="Wilayah", y="Pertumbuhan_PDRB",
                     color="Pertumbuhan_PDRB", color_continuous_scale="Oranges", text_auto=".1f",
                     title="Laju Pertumbuhan PDRB per Kabupaten/Kota 2024 (%)")
    fig_bar.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig_bar, use_container_width=True)

with c2:
    fig_tree = px.treemap(df_sec, path=["Sektor"], values="Porsi", color="Pertumbuhan",
                          color_continuous_scale="Oranges", title="Struktur Sektor Ekonomi & Laju Pertumbuhan Tiap Sektor (%)")
    st.plotly_chart(fig_tree, use_container_width=True)

render_ai_insight_card("Pertumbuhan PDRB dan Transformasi Industri", "PDRB & Ekonomi", "Sulawesi Tengah", df_sec.to_dict())

render_floating_chatbot("Analisis PDRB dan Ekonomi Sulawesi Tengah")
