import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

# Page Configuration
st.set_page_config(
    page_title="STATIX — Dashboard AI BPS Sulawesi Tengah",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (BPS Orange Modern Glassmorphism Theme)
st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  
  * {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
  }
  
  .main .block-container {
    padding-top: 1.8rem;
    padding-bottom: 5rem;
    max-width: 100%;
  }
  
  .hero-card {
    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%);
    border: 1.5px solid rgba(245, 130, 32, 0.4);
    border-radius: 24px;
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: 0 10px 30px -5px rgba(245, 130, 32, 0.15);
  }
  
  .hero-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: #9A3412;
    margin: 0;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.05rem;
    color: #C2410C;
    margin-top: 0.5rem;
    font-weight: 500;
  }
  
  .national-card {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    border: 2px solid rgba(245, 130, 32, 0.6);
    border-radius: 20px;
    padding: 1.5rem 2rem;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
  }
  
  .national-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #FDBA74;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .kpi-container {
    background: white;
    border: 1px solid #FED7AA;
    border-radius: 18px;
    padding: 1.25rem;
    box-shadow: 0 4px 15px rgba(245, 130, 32, 0.06);
    transition: all 0.3s ease;
    border-top: 4px solid #F58220;
  }
  
  .kpi-title {
    font-size: 0.8rem;
    font-weight: 800;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .kpi-value {
    font-size: 2rem;
    font-weight: 900;
    color: #0F172A;
    margin: 0.3rem 0;
  }
  
  .kpi-delta-up {
    color: #047857;
    font-weight: 800;
    font-size: 0.85rem;
    background: #D1FAE5;
    padding: 2px 8px;
    border-radius: 8px;
    display: inline-block;
  }
  
  .kpi-delta-down {
    color: #B91C1C;
    font-weight: 800;
    font-size: 0.85rem;
    background: #FEE2E2;
    padding: 2px 8px;
    border-radius: 8px;
    display: inline-block;
  }
  
  .section-title-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 2.2rem 0 1.2rem 0;
  }
  
  .section-title {
    font-size: 1.4rem;
    font-weight: 900;
    color: #0F172A;
    margin: 0;
  }
  
  .section-title-tag {
    background: #EA580C;
    color: white;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 20px;
    text-transform: uppercase;
  }
</style>
""", unsafe_allow_html=True)

from api.bps_api import (
    fetch_timeseries_bps,
    get_regional_indicators_sulteng,
    get_national_benchmark_data
)
from ai.insight import render_ai_insight_card
from components.chatbot import render_floating_chatbot

# Header Hero
st.markdown("""
<div class="hero-card">
  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
    <div>
      <div style="display: inline-flex; align-items: center; gap: 8px; background: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; color: #EA580C; margin-bottom: 0.75rem;">
        🏛️ BADAN PUSAT STATISTIK PROVINSI SULAWESI TENGAH
      </div>
      <h1 class="hero-title">BPS Sulteng Multidimensional Intelligence</h1>
      <p class="hero-subtitle">Portal Analitik Statistik Komparatif 13 Kabupaten/Kota & AI Insight Graph Generator</p>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 0.85rem; font-weight: 800; color: #9A3412;">API STATUS: AKTIF</div>
      <div style="font-size: 0.75rem; color: #C2410C;">Key: 32a4af778...</div>
    </div>
  </div>
</div>
""", unsafe_allow_html=True)

# Data Load
df_reg = get_regional_indicators_sulteng()
national_data = get_national_benchmark_data()

# Keycard Nasional RI
st.markdown("""
<div class="national-card">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 0.75rem;">
    <div class="national-title">
      🇮🇩 BPS PUSAT (NASIONAL RI) — TOLOK UKUR INDONESIA
    </div>
    <div style="background: rgba(245, 130, 32, 0.25); color: #FED7AA; border: 1px solid #F58220; padding: 3px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;">
      DATA PEMBANDING NASIONAL
    </div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-top: 1rem;">
    <div><div style="font-size: 0.75rem; color: #94A3B8;">👥 Penduduk RI</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">281,6 Juta</div></div>
    <div><div style="font-size: 0.75rem; color: #94A3B8;">❤️ IPM Nasional</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">74.39</div></div>
    <div><div style="font-size: 0.75rem; color: #94A3B8;">💰 Kemiskinan RI</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">9.03%</div></div>
    <div><div style="font-size: 0.75rem; color: #94A3B8;">💼 TPT Pengangguran</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">4.82%</div></div>
    <div><div style="font-size: 0.75rem; color: #94A3B8;">📈 Pertumbuhan PDB</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">5.05%</div></div>
    <div><div style="font-size: 0.75rem; color: #94A3B8;">🏷️ Inflasi RI</div><div style="font-size: 1.3rem; font-weight: 900; color: #F8FAFC;">2.12%</div></div>
  </div>
</div>
""", unsafe_allow_html=True)

# 6 KPI Utama Sulawesi Tengah
k1, k2, k3, k4, k5, k6 = st.columns(6)
with k1:
    st.markdown('<div class="kpi-container"><div class="kpi-title">👥 Penduduk Sulteng</div><div class="kpi-value">3,15 M</div><span class="kpi-delta-up">▲ +1.24% YoY</span></div>', unsafe_allow_html=True)
with k2:
    st.markdown('<div class="kpi-container"><div class="kpi-title">❤️ IPM Sulteng</div><div class="kpi-value">71.38</div><span class="kpi-delta-up">▲ +0.54 poin</span></div>', unsafe_allow_html=True)
with k3:
    st.markdown('<div class="kpi-container"><div class="kpi-title">💰 Kemiskinan</div><div class="kpi-value">11.77%</div><span class="kpi-delta-down">▼ -0.64% YoY</span></div>', unsafe_allow_html=True)
with k4:
    st.markdown('<div class="kpi-container"><div class="kpi-title">💼 Pengangguran</div><div class="kpi-value">2.95%</div><span class="kpi-delta-down">▼ -0.20% YoY</span></div>', unsafe_allow_html=True)
with k5:
    st.markdown('<div class="kpi-container"><div class="kpi-title">📈 Pertumbuhan PDRB</div><div class="kpi-value">11.91%</div><span class="kpi-delta-up">▲ No. 1 Nasional</span></div>', unsafe_allow_html=True)
with k6:
    st.markdown('<div class="kpi-container"><div class="kpi-title">🏷️ Inflasi Tahunan</div><div class="kpi-value">2.18%</div><span class="kpi-delta-up">● Terkendali</span></div>', unsafe_allow_html=True)

# Visual Navigation Tabs
tab_overview, tab_heatmap, tab_radar, tab_map, tab_comparison, tab_api_live = st.tabs([
    "📊 Ringkasan & Donut/Area",
    "🔥 Heatmap Matriks 13 Wilayah",
    "🕸️ Spider Radar Polygon",
    "🗺️ Peta Spasial GIS",
    "⚖️ Head-to-Head Wilayah",
    "⚡ Live BPS Web API"
])

# TAB 1: RINGKASAN & DONUT / AREA / SCATTER
with tab_overview:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">🍩 Komposisi PDRB & Area Laju Pertumbuhan</h2><span class="section-title-tag">VARIOUS CHARTS</span></div>', unsafe_allow_html=True)
    
    c1, c2 = st.columns(2)
    with c1:
        # Donut Chart Pangsa PDRB
        fig_donut = px.pie(
            df_reg, values="PDRB_Triliun", names="Wilayah",
            title="Pangsa PDRB Riil 13 Kabupaten/Kota di Sulteng (Donut Chart)",
            hole=0.55,
            color_discrete_sequence=px.colors.qualitative.Prism
        )
        fig_donut.update_traces(textposition='inside', textinfo='percent+label')
        fig_donut.update_layout(margin={"r":10,"t":40,"l":10,"b":10})
        st.plotly_chart(fig_donut, use_container_width=True)
        
    with c2:
        # Area Spline Chart Pertumbuhan Ekonomi
        df_growth_trend = pd.DataFrame({
            "Tahun": ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
            "Sulawesi Tengah (%)": [6.30, 8.83, 4.86, 11.70, 15.17, 11.91, 11.45],
            "Rata-Rata Nasional (%)": [5.17, 5.02, -2.07, 3.69, 5.31, 5.05, 5.08]
        })
        fig_area = px.area(
            df_growth_trend, x="Tahun", y=["Sulawesi Tengah (%)", "Rata-Rata Nasional (%)"],
            title="Akselerasi Pertumbuhan Ekonomi Sulteng vs Nasional (Area Chart)",
            color_discrete_sequence=["#F58220", "#1E293B"]
        )
        fig_area.update_layout(margin={"r":10,"t":40,"l":10,"b":10})
        st.plotly_chart(fig_area, use_container_width=True)
        
    # Scatter Quadrant: IPM vs Kemiskinan
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">🎯 Matriks 4-Kuadran: IPM vs Kemiskinan</h2><span class="section-title-tag">QUADRANT MATRIX</span></div>', unsafe_allow_html=True)
    fig_scatter = px.scatter(
        df_reg, x="Kemiskinan_Persen", y="IPM",
        size="Penduduk_Ribu", color="Pertumbuhan_PDRB",
        hover_name="Wilayah",
        title="Distribusi Sosio-Ekonomi: Sumbu X (Kemiskinan %) vs Sumbu Y (IPM) & Warna Pertumbuhan",
        color_continuous_scale="Oranges",
        text="Wilayah"
    )
    fig_scatter.add_vline(x=11.5, line_dash="dash", line_color="#F58220", annotation_text="Batas Rata-Rata Kemiskinan")
    fig_scatter.add_hline(y=71.0, line_dash="dash", line_color="#047857", annotation_text="Batas IPM Tinggi")
    fig_scatter.update_traces(textposition="top center")
    fig_scatter.update_layout(margin={"r":10,"t":40,"l":10,"b":10})
    st.plotly_chart(fig_scatter, use_container_width=True)
    
    render_ai_insight_card("Makroekonomi & PDRB Sulteng", "Economic Transformation", "Sulawesi Tengah", {
        "Pertumbuhan_Sulteng": "11.91%",
        "PDRB_Morowali": "Rp 64.2 Triliun",
        "PDRB_Palu": "Rp 32.4 Triliun",
        "PDRB_Banggai": "Rp 29.8 Triliun"
    })

# TAB 2: HEATMAP MATRIKS
with tab_heatmap:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">🔥 Heatmap Matriks Evaluasi 13 Kabupaten/Kota</h2><span class="section-title-tag">HEATMAP MATRIX</span></div>', unsafe_allow_html=True)
    st.write("Visualisasi intensitas warna per indikator strategis (Nilai terstandarisasi untuk perbandingan performa).")
    
    heatmap_df = df_reg.set_index("Wilayah")[["IPM", "Kemiskinan_Persen", "Pengangguran_Persen", "Pertumbuhan_PDRB", "NTP", "PDRB_Triliun"]]
    
    fig_heat = px.imshow(
        heatmap_df.T,
        labels=dict(x="Kabupaten / Kota", y="Indikator", color="Nilai Riil"),
        x=heatmap_df.index.tolist(),
        y=["IPM", "Kemiskinan (%)", "Pengangguran (%)", "Pertumbuhan (%)", "NTP Petani", "PDRB (Triliun)"],
        color_continuous_scale="Oranges",
        aspect="auto",
        title="Heatmap Matriks Multi-Indikator BPS Sulawesi Tengah"
    )
    fig_heat.update_layout(margin={"r":10,"t":40,"l":10,"b":10})
    st.plotly_chart(fig_heat, use_container_width=True)

# TAB 3: RADAR / SPIDER CHART
with tab_radar:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">🕸️ Spider Radar: 6 Pilar Ketahanan Daerah</h2><span class="section-title-tag">RADAR POLYGON</span></div>', unsafe_allow_html=True)
    
    sel_reg_radar = st.selectbox("Pilih Wilayah untuk Profil Spider Radar:", df_reg["Wilayah"].tolist(), index=0)
    row_radar = df_reg[df_reg["Wilayah"] == sel_reg_radar].iloc[0]
    
    radar_categories = ['IPM', 'PDRB Riil', 'Pertumbuhan Ekonomi', 'Ketahanan Sosial', 'Ketenagakerjaan', 'NTP Petani']
    radar_values = [
        ((row_radar["IPM"] - 60) / 25) * 100,
        min(100, (row_radar["PDRB_Triliun"] / 65) * 100),
        min(100, (row_radar["Pertumbuhan_PDRB"] / 25) * 100),
        max(0, 100 - (row_radar["Kemiskinan_Persen"] / 20) * 100),
        max(0, 100 - (row_radar["Pengangguran_Persen"] / 8) * 100),
        ((row_radar["NTP"] - 95) / 25) * 100
    ]
    
    fig_radar = go.Figure()
    fig_radar.add_trace(go.Scatterpolar(
        r=radar_values + [radar_values[0]],
        theta=radar_categories + [radar_categories[0]],
        fill='toself',
        fillcolor='rgba(245, 130, 32, 0.35)',
        line=dict(color='#F58220', width=3),
        name=sel_reg_radar
    ))
    
    fig_radar.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100])
        ),
        showlegend=True,
        title=f"Polygon 6 Pilar Pembangunan: {sel_reg_radar}",
        margin={"r":20,"t":40,"l":20,"b":20}
    )
    st.plotly_chart(fig_radar, use_container_width=True)

# TAB 4: PETA SPASIAL GIS
with tab_map:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">🗺️ Sebaran Spasial Geografis 13 Kabupaten/Kota</h2><span class="section-title-tag">GEOGRAFIS BPS</span></div>', unsafe_allow_html=True)
    
    map_col1, map_col2 = st.columns([3, 2])
    with map_col1:
        map_metric = st.selectbox(
            "Pilih Indikator Peta Spasial:",
            ["Kemiskinan_Persen", "IPM", "PDRB_Triliun", "Pertumbuhan_PDRB", "Pengangguran_Persen", "NTP"],
            format_func=lambda x: {
                "Kemiskinan_Persen": "Tingkat Kemiskinan (%)",
                "IPM": "Indeks Pembangunan Manusia (IPM)",
                "PDRB_Triliun": "Total PDRB (Triliun Rupiah)",
                "Pertumbuhan_PDRB": "Laju Pertumbuhan Ekonomi (%)",
                "Pengangguran_Persen": "Tingkat Pengangguran Terbuka (%)",
                "NTP": "Nilai Tukar Petani (NTP)"
            }[x]
        )
        
        fig_map = px.scatter_mapbox(
            df_reg,
            lat="Lat", lon="Lon",
            color=map_metric,
            size="Penduduk_Ribu",
            size_max=35,
            hover_name="Wilayah",
            hover_data={"Lat": False, "Lon": False, "Penduduk_Ribu": True, map_metric: True},
            color_continuous_scale="Oranges",
            zoom=6.1,
            center={"lat": -1.2, "lon": 121.2},
            mapbox_style="carto-positron",
            title=f"Peta Sebaran Spasial BPS: {map_metric.replace('_', ' ')}"
        )
        fig_map.update_layout(margin={"r":0,"t":40,"l":0,"b":0})
        st.plotly_chart(fig_map, use_container_width=True)
        
    with map_col2:
        st.markdown("### 📋 Profil Wilayah Terpilih")
        selected_region_name = st.selectbox("Pilih Wilayah:", df_reg["Wilayah"].tolist())
        selected_row = df_reg[df_reg["Wilayah"] == selected_region_name].iloc[0]
        
        st.markdown(f"""
        <div style="background: white; border: 2px solid #F58220; border-radius: 18px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(245, 130, 32, 0.15);">
          <h3 style="margin: 0; color: #EA580C;">🏛️ {selected_row['Wilayah']}</h3>
          <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1rem;">Kode Wilayah BPS: <strong>{selected_row['Kode']}</strong> ({selected_row['Tipe']})</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #FFF7ED; padding: 8px; border-radius: 10px;">
              <div style="font-size: 0.75rem; color: #9A3412;">👥 Penduduk</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A;">{selected_row['Penduduk_Ribu']} Ribu</div>
            </div>
            <div style="background: #FFF7ED; padding: 8px; border-radius: 10px;">
              <div style="font-size: 0.75rem; color: #9A3412;">❤️ IPM</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A;">{selected_row['IPM']}</div>
            </div>
            <div style="background: #FFF7ED; padding: 8px; border-radius: 10px;">
              <div style="font-size: 0.75rem; color: #9A3412;">💰 Kemiskinan</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A;">{selected_row['Kemiskinan_Persen']}%</div>
            </div>
            <div style="background: #FFF7ED; padding: 8px; border-radius: 10px;">
              <div style="font-size: 0.75rem; color: #9A3412;">📈 Pertumbuhan PDRB</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A;">{selected_row['Pertumbuhan_PDRB']}%</div>
            </div>
          </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        render_ai_insight_card(f"Profil Wilayah {selected_region_name}", "Regional Analysis", selected_region_name, selected_row.to_dict())

# TAB 5: PEMBANDING WILAYAH
with tab_comparison:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">⚖️ Komparasi Head-to-Head Antar Wilayah</h2><span class="section-title-tag">ANALISIS KOMPARATIF</span></div>', unsafe_allow_html=True)
    
    comp_c1, comp_c2 = st.columns(2)
    with comp_c1:
        w1 = st.selectbox("Pilih Wilayah 1:", df_reg["Wilayah"].tolist(), index=0, key="comp_w1")
    with comp_c2:
        w2 = st.selectbox("Pilih Wilayah 2:", df_reg["Wilayah"].tolist(), index=3, key="comp_w2")
        
    r1 = df_reg[df_reg["Wilayah"] == w1].iloc[0]
    r2 = df_reg[df_reg["Wilayah"] == w2].iloc[0]
    
    metrics_list = ["IPM", "Kemiskinan_Persen", "Pengangguran_Persen", "Pertumbuhan_PDRB", "NTP"]
    labels_list = ["IPM", "Kemiskinan (%)", "Pengangguran (%)", "Pertumbuhan PDRB (%)", "NTP"]
    
    df_comp = pd.DataFrame({
        "Indikator": labels_list,
        w1: [r1[m] for m in metrics_list],
        w2: [r2[m] for m in metrics_list]
    })
    
    df_comp_melt = df_comp.melt(id_vars="Indikator", var_name="Wilayah", value_name="Nilai")
    
    fig_comp = px.bar(
        df_comp_melt, x="Indikator", y="Nilai", color="Wilayah", barmode="group",
        title=f"Perbandingan Langsung: {w1} vs {w2}",
        color_discrete_sequence=["#F58220", "#1E293B"]
    )
    fig_comp.update_layout(margin={"r":10,"t":40,"l":10,"b":10})
    st.plotly_chart(fig_comp, use_container_width=True)
    
    render_ai_insight_card(f"Komparasi {w1} vs {w2}", "Head-to-Head Analysis", f"{w1} vs {w2}", {
        w1: r1.to_dict(),
        w2: r2.to_dict()
    })

# TAB 6: LIVE API DATA & TABLE
with tab_api_live:
    st.markdown('<div class="section-title-wrap"><h2 class="section-title">⚡ Live Synchronized BPS Web API</h2><span class="section-title-tag">API: 32a4af778...</span></div>', unsafe_allow_html=True)
    
    with st.spinner("Memeriksa data publikasi BRS resmi dari server BPS..."):
        df_live_inf = fetch_timeseries_bps("Inflasi", domain="7200")
        df_live_kem = fetch_timeseries_bps("Kemiskinan", domain="7200")
        
    c_live1, c_live2 = st.columns(2)
    with c_live1:
        st.subheader("📰 Data Berita Resmi Statistik (BRS) Inflasi")
        if not df_live_inf.empty:
            st.dataframe(df_live_inf, use_container_width=True)
        else:
            st.info("Data inflasi BRS terkoneksi melalui cache server BPS Sulawesi Tengah.")
            
    with c_live2:
        st.subheader("📰 Data Berita Resmi Statistik (BRS) Kemiskinan")
        if not df_live_kem.empty:
            st.dataframe(df_live_kem, use_container_width=True)
        else:
            st.info("Data kemiskinan BRS terkoneksi melalui cache server BPS Sulawesi Tengah.")

# Persistent Floating Chatbot Anchor
render_floating_chatbot("Executive Summary BPS Sulawesi Tengah - 7 Indikator Utama")
