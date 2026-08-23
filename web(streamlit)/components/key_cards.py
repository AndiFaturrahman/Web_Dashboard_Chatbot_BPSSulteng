"""
Animated Key Metric Cards Component for BPS Sulteng Insight
Renders 6 Animated Sulawesi Tengah Metric Cards + 1 National Benchmark Card (BPS Pusat).
"""

import streamlit as st
import sys
import os

# Add parent directory to path if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.bps_api import get_sulteng_key_metrics

def render_key_cards():
    """Renders the top key metric cards with animated design"""
    metrics_data = get_sulteng_key_metrics()
    s = metrics_data["sulteng"]
    n = metrics_data["nasional"]

    # 1. National Benchmark Card (BPS Pusat Indonesia)
    national_html = f"""
    <div class="stat-card-national">
      <div class="stat-card-national-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.6rem;">🇮🇩</span>
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #F8FAFC;">BPS Pusat (Nasional RI) — Tolok Ukur Indonesia</div>
            <div style="font-size: 0.8rem; color: #94A3B8;">Data Pembanding Resmi Badan Pusat Statistik Nasional 2024</div>
          </div>
        </div>
        <div class="stat-card-national-badge">PEMBANDING NASIONAL</div>
      </div>
      <div class="national-grid">
        <div class="national-metric-item">
          <div class="national-metric-label">👥 Penduduk RI</div>
          <div class="national-metric-val">{n['penduduk']}</div>
        </div>
        <div class="national-metric-item">
          <div class="national-metric-label">❤️ IPM Nasional</div>
          <div class="national-metric-val">{n['ipm']}</div>
        </div>
        <div class="national-metric-item">
          <div class="national-metric-label">💰 Kemiskinan RI</div>
          <div class="national-metric-val">{n['kemiskinan']}</div>
        </div>
        <div class="national-metric-item">
          <div class="national-metric-label">💼 TPT Pengangguran</div>
          <div class="national-metric-val">{n['pengangguran']}</div>
        </div>
        <div class="national-metric-item">
          <div class="national-metric-label">📈 Pertumbuhan PDB</div>
          <div class="national-metric-val">{n['pertumbuhan_ekonomi']}</div>
        </div>
        <div class="national-metric-item">
          <div class="national-metric-label">🏷️ Inflasi Nasional</div>
          <div class="national-metric-val">{n['inflasi']}</div>
        </div>
      </div>
    </div>
    """
    st.markdown(national_html, unsafe_allow_html=True)

    # 2. 6 Sulawesi Tengah Key Metrics Cards
    col1, col2, col3 = st.columns(3)
    col4, col5, col6 = st.columns(3)

    # Card 1: Penduduk
    with col1:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Penduduk Sulteng</div>
            <div class="stat-card-icon">👥</div>
          </div>
          <div class="stat-card-value">{s['penduduk']['val']}</div>
          <div>
            <span class="stat-card-badge {s['penduduk']['status']}">▲ {s['penduduk']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['penduduk']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)

    # Card 2: IPM
    with col2:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Indeks Pembangunan Manusia</div>
            <div class="stat-card-icon">❤️</div>
          </div>
          <div class="stat-card-value">{s['ipm']['val']}</div>
          <div>
            <span class="stat-card-badge {s['ipm']['status']}">▲ {s['ipm']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['ipm']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)

    # Card 3: Kemiskinan
    with col3:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Tingkat Kemiskinan</div>
            <div class="stat-card-icon">💰</div>
          </div>
          <div class="stat-card-value">{s['kemiskinan']['val']}</div>
          <div>
            <span class="stat-card-badge {s['kemiskinan']['status']}">▼ {s['kemiskinan']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['kemiskinan']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)

    # Card 4: Pengangguran
    with col4:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Tingkat Pengangguran (TPT)</div>
            <div class="stat-card-icon">💼</div>
          </div>
          <div class="stat-card-value">{s['pengangguran']['val']}</div>
          <div>
            <span class="stat-card-badge {s['pengangguran']['status']}">▼ {s['pengangguran']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['pengangguran']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)

    # Card 5: Pertumbuhan Ekonomi
    with col5:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Pertumbuhan Ekonomi (PDRB)</div>
            <div class="stat-card-icon">📈</div>
          </div>
          <div class="stat-card-value">{s['pertumbuhan_ekonomi']['val']}</div>
          <div>
            <span class="stat-card-badge {s['pertumbuhan_ekonomi']['status']}">▲ {s['pertumbuhan_ekonomi']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['pertumbuhan_ekonomi']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)

    # Card 6: Inflasi
    with col6:
        st.markdown(f"""
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-title">Inflasi Tahunan (YoY)</div>
            <div class="stat-card-icon">🏷️</div>
          </div>
          <div class="stat-card-value">{s['inflasi']['val']}</div>
          <div>
            <span class="stat-card-badge {s['inflasi']['status']}">● {s['inflasi']['delta']}</span>
          </div>
          <div class="stat-card-subtext">{s['inflasi']['subtext']}</div>
        </div>
        """, unsafe_allow_html=True)
