"""
Floating Persistent Chatbot Component for BPS Sulteng Insight
100% Alignment with Mobile App & Vercel Backend v3.1 Intelligence
"""

import streamlit as st
import requests
import json
import plotly.express as px
import pandas as pd

VERCEL_BACKEND_URL = "https://bps-ai-backend.vercel.app/api/v1/chat"
LOCAL_BACKEND_URL = "http://localhost:8000/api/v1/chat"

def render_chart_payload(chart_payload):
    if not chart_payload or "data" not in chart_payload:
        return
        
    ctype = chart_payload.get("type", "bar")
    title = chart_payload.get("title", "")
    unit = chart_payload.get("unit", "")
    data = chart_payload.get("data", [])
    
    if not data:
        return
        
    df = pd.DataFrame(data)
    if "label" not in df.columns or "value" not in df.columns:
        return
        
    if ctype == "line":
        fig = px.line(df, x="label", y="value", title=title, markers=True, color_discrete_sequence=['#F58220'])
    elif ctype == "pie":
        fig = px.pie(df, names="label", values="value", title=title, color_discrete_sequence=px.colors.sequential.Oranges_r)
    else:
        fig = px.bar(df, x="label", y="value", title=title, color_discrete_sequence=['#F58220'])
        
    fig.update_layout(yaxis_title=unit, xaxis_title="", margin={"r":0,"t":40,"l":0,"b":0})
    st.plotly_chart(fig, use_container_width=True)

def render_citations_payload(citations):
    if not citations:
        return
    st.markdown("**Sumber Data Resmi BPS:**")
    for cit in citations:
        title = cit.get("title", "Tautan Resmi BPS")
        url = cit.get("url", "#")
        url_parent = cit.get("url_parent", "")
        if url and url != "#":
            st.info(f"📄 [{title}]({url})")
        elif url_parent:
            st.info(f"📄 [{title}]({url_parent})")
        else:
            st.info(f"📄 {title}")

@st.dialog("💬 STATIX BPS AI Assistant — Sulawesi Tengah", width="large")
def show_chatbot_modal():
    st.markdown("Asisten cerdas resmi BPS Sulawesi Tengah — Didukung AI & Data Resmi BPS Web API.")
    
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = [
            {
                "role": "assistant",
                "content": "Halo! Saya **STATIX**, asisten kecerdasan buatan resmi BPS Sulawesi Tengah. Ada data atau statistik yang ingin Anda tanyakan hari ini?"
            }
        ]
        
    chat_container = st.container(height=420)
    with chat_container:
        for message in st.session_state.chat_messages:
            if message["role"] != "system":
                with st.chat_message(message["role"], avatar="🤖" if message["role"] == "assistant" else "👤"):
                    st.markdown(message["content"])
                    if message.get("chart"):
                        render_chart_payload(message["chart"])
                    if message.get("citations"):
                        render_citations_payload(message["citations"])
                        
    if prompt := st.chat_input("Ketik pertanyaan Anda seputar data BPS... (contoh: Berapa angka kemiskinan di Sulteng?)"):
        st.session_state.chat_messages.append({"role": "user", "content": prompt})
        with chat_container:
            with st.chat_message("user", avatar="👤"):
                st.markdown(prompt)
                
            with st.chat_message("assistant", avatar="🤖"):
                with st.spinner("STATIX sedang mengambil data dari BPS API..."):
                    # Exact parity with mobile Flutter app:
                    history_for_api = [
                        {"role": "user" if m["role"] == "user" else "model", "content": m["content"]}
                        for m in st.session_state.chat_messages[:-1]
                        if m.get("content") and m["role"] in ["user", "assistant"]
                    ][-10:] # last 10 messages
                    
                    payload = {
                        "query": prompt.strip(),
                        "history": history_for_api
                    }
                    
                    response_text = ""
                    chart_data = None
                    citations_data = None
                    
                    try:
                        res = requests.post(VERCEL_BACKEND_URL, json=payload, timeout=30)
                        if res.status_code == 200:
                            data = res.json()
                            response_text = data.get("response_text", "")
                            chart_data = data.get("chart_payload")
                            citations_data = data.get("citations")
                        else:
                            raise Exception(f"HTTP {res.status_code}")
                    except Exception:
                        try:
                            res = requests.post(LOCAL_BACKEND_URL, json=payload, timeout=10)
                            if res.status_code == 200:
                                data = res.json()
                                response_text = data.get("response_text", "")
                                chart_data = data.get("chart_payload")
                                citations_data = data.get("citations")
                        except Exception as err:
                            response_text = f"Maaf, saat ini koneksi ke gateway backend sedang mengalami kendala. Silakan coba kembali sesaat lagi. (Error: {err})"
                            citations_data = [{"title": "Portal BPS Sulawesi Tengah", "url": "https://sulteng.bps.go.id"}]

                    st.markdown(response_text)
                    if chart_data:
                        render_chart_payload(chart_data)
                    if citations_data:
                        render_citations_payload(citations_data)
                        
                    st.session_state.chat_messages.append({
                        "role": "assistant",
                        "content": response_text,
                        "chart": chart_data,
                        "citations": citations_data
                    })

def render_floating_chatbot(context_data=""):
    """
    Renders an interactive floating button pinned at bottom-right of viewport that directly triggers the Chatbot Dialog.
    """
    # 1. Custom CSS to position the button strictly at bottom-right
    floating_btn_css = """
    <style>
    div[data-testid="stVerticalBlock"] > div.element-container:has(#floating-chat-trigger) {
        position: fixed !important;
        bottom: 28px !important;
        right: 28px !important;
        z-index: 999999 !important;
        width: auto !important;
    }
    div[data-testid="stVerticalBlock"] > div.element-container:has(#floating-chat-trigger) button {
        width: 66px !important;
        height: 66px !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, #F58220 0%, #EA580C 100%) !important;
        color: white !important;
        font-size: 1.85rem !important;
        box-shadow: 0 14px 35px rgba(245, 130, 32, 0.55), 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        border: 3px solid rgba(255, 255, 255, 0.95) !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
    }
    div[data-testid="stVerticalBlock"] > div.element-container:has(#floating-chat-trigger) button:hover {
        transform: scale(1.12) rotate(6deg) !important;
        box-shadow: 0 18px 45px rgba(245, 130, 32, 0.75) !important;
    }
    </style>
    """
    st.markdown(floating_btn_css, unsafe_allow_html=True)
    
    # Hidden marker for CSS targeting
    st.markdown('<div id="floating-chat-trigger"></div>', unsafe_allow_html=True)
    
    # Real interactive Streamlit button that triggers modal dialog
    if st.button("💬", key="btn_floating_chat_main", help="Tanya Asisten AI BPS Sulawesi Tengah"):
        show_chatbot_modal()
        
    # Also provide sidebar button
    with st.sidebar:
        st.markdown("---")
        st.markdown("### 🤖 Asisten BPS AI")
        if st.button("💬 Buka STATIX Chatbot", use_container_width=True, type="primary", key="btn_open_chat_sidebar"):
            show_chatbot_modal()
