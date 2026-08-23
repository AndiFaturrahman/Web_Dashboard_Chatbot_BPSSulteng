import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset, get_population_pyramid
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="Kependudukan & Demografi — STATIX BPS", page_icon="👥", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">👥 Demografi & Struktur Kependudukan</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Piramida penduduk, bonus demografi, persebaran populasi, dan komposisi gender di Sulawesi Tengah.</p>', unsafe_allow_html=True)
st.divider()

df_reg = get_all_regencies_dataset()
df_pyr = get_population_pyramid()

c1, c2 = st.columns(2)

with c1:
    fig_pyr = go.Figure()
    fig_pyr.add_trace(go.Bar(
        y=df_pyr['Kelompok_Umur'], x=df_pyr['Laki-laki (Ribu)'],
        name='Laki-laki', orientation='h', marker=dict(color='#F58220')
    ))
    fig_pyr.add_trace(go.Bar(
        y=df_pyr['Kelompok_Umur'], x=df_pyr['Perempuan (Ribu)'],
        name='Perempuan', orientation='h', marker=dict(color='#FFA64D')
    ))
    fig_pyr.update_layout(
        title="Piramida Penduduk Sulawesi Tengah (Ribu Jiwa)",
        barmode='relative',
        bargap=0.1,
        xaxis=dict(tickvals=[-150, -100, -50, 0, 50, 100, 150], ticktext=['150k', '100k', '50k', '0', '50k', '100k', '150k'])
    )
    st.plotly_chart(fig_pyr, use_container_width=True)

with c2:
    fig_pie = px.pie(df_reg, names="Wilayah", values="Penduduk_Ribu", title="Distribusi Jumlah Penduduk Antar Kab/Kota",
                     color_discrete_sequence=px.colors.sequential.Oranges_r)
    st.plotly_chart(fig_pie, use_container_width=True)

render_ai_insight_card("Struktur Demografi dan Bonus Kependudukan", "Demografi", "Sulawesi Tengah", {
    "Total_Penduduk": "3.15 Juta",
    "Kabupaten_Terpadat": "Parigi Moutong (451.2 Ribu)",
    "Usia_Produktif_Dominan": "Kelompok 15-34 Tahun"
})

render_floating_chatbot("Analisis Kependudukan BPS Sulawesi Tengah")
