import streamlit as st
import pandas as pd
import json
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_all_regencies_dataset
from ai.insight import generate_ai_graph_insight
from components.chatbot import render_floating_chatbot

st.set_page_config(page_title="AI Insight Studio — STATIX BPS", page_icon="🤖", layout="wide")

css_path = os.path.join(os.path.dirname(__file__), "..", "assets", "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown('<h1 style="color: #0F172A; font-weight: 800;">🤖 AI Statistical Insight Studio</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #64748B;">Pilih indikator data statistik dan wilayah untuk men-generate laporan penafsiran AI komprehensif.</p>', unsafe_allow_html=True)
st.divider()

df_reg = get_all_regencies_dataset()

c1, c2, c3 = st.columns([2, 2, 1])
with c1:
    sel_indicator = st.selectbox("Pilih Topik Analisis:", [
        "PDRB & Pertumbuhan Ekonomi",
        "Indeks Pembangunan Manusia (IPM)",
        "Kemiskinan & Garis Kemiskinan",
        "Ketenagakerjaan & Pengangguran (TPT)",
        "Nilai Tukar Petani & Sektor Pertanian",
        "Demografi & Piramida Penduduk"
    ])

with c2:
    sel_wilayah = st.selectbox("Pilih Wilayah Fokus:", ["Provinsi Sulawesi Tengah (Keseluruhan)"] + df_reg["Wilayah"].tolist())

with c3:
    st.write("")
    st.write("")
    btn_generate = st.button("🚀 Jalankan Analisis AI", type="primary", use_container_width=True)

if btn_generate or True:
    with st.spinner("AI sedang membaca statistik dan memproses narasi kebijakan..."):
        insight = generate_ai_graph_insight(sel_indicator, sel_indicator, sel_wilayah, {
            "Wilayah": sel_wilayah,
            "Topik": sel_indicator
        })
        
        st.markdown(f"""
        <div class="ai-insight-container" style="margin-top: 1rem;">
          <div class="ai-insight-header">
            <div class="ai-insight-title">
              <span style="font-size: 1.6rem;">🤖</span>
              <span>Laporan Analisis Cerdas AI — {sel_indicator} ({sel_wilayah})</span>
            </div>
            <div class="ai-badge-live">
              <span class="ai-live-dot"></span>
              <span>AI POLICY READY</span>
            </div>
          </div>
          <div class="ai-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="ai-item" style="padding: 1.4rem;">
              <div class="ai-item-title" style="font-size: 1rem;">🎯 1. Temuan Utama (Key Findings)</div>
              <div class="ai-item-desc" style="font-size: 0.95rem; line-height: 1.6;">{insight['temuan_utama']}</div>
            </div>
            <div class="ai-item" style="padding: 1.4rem;">
              <div class="ai-item-title" style="font-size: 1rem;">📈 2. Analisis Tren & Dinamika Data</div>
              <div class="ai-item-desc" style="font-size: 0.95rem; line-height: 1.6;">{insight['analisis_tren']}</div>
            </div>
            <div class="ai-item" style="padding: 1.4rem;">
              <div class="ai-item-title" style="font-size: 1rem;">⚠️ 3. Titik Kritis & Early Warning</div>
              <div class="ai-item-desc" style="font-size: 0.95rem; line-height: 1.6;">{insight['peringatan']}</div>
            </div>
            <div class="ai-item" style="padding: 1.4rem;">
              <div class="ai-item-title" style="font-size: 1rem;">💡 4. Rekomendasi Kebijakan Konkret</div>
              <div class="ai-item-desc" style="font-size: 0.95rem; line-height: 1.6;">{insight['rekomendasi']}</div>
            </div>
          </div>
        </div>
        """, unsafe_allow_html=True)

render_floating_chatbot("AI Insight Studio - Penafsiran Statistik")
