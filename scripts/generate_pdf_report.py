import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_PATH = r"D:\Magang BPS\Project\bps_ai_mobile\LAPORAN_BPS_AI_ASSISTANT_MOBILE.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "BPS Provinsi Sulawesi Tengah — Laporan Proyek BPS AI Assistant Mobile")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(40, 802, 555, 802)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 45, 555, 45)
        
        footer_text = "Tim Asisten Pranata Komputer BPS Provinsi Sulawesi Tengah"
        self.drawString(40, 32, footer_text)
        page_str = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(555, 32, page_str)
        self.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#002D62")  # Deep BPS Navy
    accent_blue = colors.HexColor("#00ADEF")    # BPS Cyan Blue
    accent_orange = colors.HexColor("#F7941D")  # BPS Orange
    dark_text = colors.HexColor("#1e293b")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=colors.white,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#bae6fd"),
        spaceAfter=10
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=dark_text,
        spaceAfter=5,
        alignment=4  # Justify
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#0f172a")
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=dark_text
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=primary_color
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # ── HEADER BANNER ────────────────────────────────────────────────
    banner_content = [
        [Paragraph("BPS AI ASSISTANT MOBILE", title_style)],
        [Paragraph("Laporan Komprehensif Inovasi Sistem Asisten Statistik Cerdas Berbasis Generative AI & Integrasi BPS Web API", subtitle_style)],
        [
            Table([
                [
                    Paragraph("<b>Pengembang:</b> Tim Asisten Pranata Komputer", callout_style),
                    Paragraph("<b>Status Proyek:</b> <font color='#16a34a'><b>Fase 1 Selesai (Live Production)</b></font>", callout_style),
                ],
                [
                    Paragraph("<b>Unit Kerja:</b> BPS Provinsi Sulawesi Tengah", callout_style),
                    Paragraph("<b>Server Cloud:</b> https://bps-ai-backend.vercel.app", callout_style),
                ],
                [
                    Paragraph("<b>Versi Aplikasi:</b> v1.0.0 (Release APK Build)", callout_style),
                    Paragraph("<b>Target Pengguna:</b> Pimpinan, Peneliti, & Publik", callout_style),
                ]
            ], colWidths=[245, 245], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ])
        ]
    ]
    
    banner_table = Table(banner_content, colWidths=[515])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), primary_color),
        ('BOX', (0,0), (-1,-1), 1.5, accent_blue),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # ── SECTION 1: RINGKASAN EKSEKUTIF ──────────────────────────────
    story.append(Paragraph("1. Ringkasan Eksekutif (Executive Summary)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    
    story.append(Paragraph(
        "Aplikasi <b>BPS AI Assistant Mobile</b> adalah inovasi diseminasi data statistik berbasis kecerdasan buatan (<i>Artificial Intelligence</i>) "
        "yang diinisiasi dan dikembangkan oleh <b>Tim Asisten Pranata Komputer BPS Provinsi Sulawesi Tengah</b>. Aplikasi ini dirancang khusus untuk mempermudah pimpinan, "
        "peneliti, pemerintah daerah, dan masyarakat luas dalam mengakses, memahami, serta memanfaatkan data resmi Badan Pusat Statistik secara instan, interaktif, dan akurat.",
        body_style
    ))
    story.append(Paragraph(
        "Berbeda dengan chatbot AI konvensional yang kerap mengalami <i>hallucination</i> (memberikan data karangan atau usang), sistem ini menerapkan metode "
        "<b>Retrieval-Augmented Generation (RAG) 2-Step Workflow</b> yang terhubung secara <i>real-time</i> ke <b>BPS Web API resmi (<code>webapi.bps.go.id</code>)</b>.",
        body_style
    ))

    # Highlight Card
    highlight_data = [[
        Paragraph(
            "<b>Pencapaian Utama Tim Pengembang pada Fase 1:</b><br/>"
            "• <b>Backend Gateway Cloud:</b> Berhasil dideploy dan aktif 24/7 di Vercel Serverless dengan sistem <i>Multi-Model Automatic Fallback</i> (Gemini 3.7 / 3.6 / 3.5 Flash).<br/>"
            "• <b>Integrasi Data Riil:</b> Terhubung langsung ke BPS Web API menggunakan API Key resmi.<br/>"
            "• <b>Aplikasi Mobile Siap Pakai:</b> Berhasil dikompilasi menjadi <b>Release APK (<code>app-release.apk</code>)</b> dengan izin internet penuh, siap dipasang di HP Android pimpinan/mentor tanpa hambatan jaringan.",
            callout_style
        )
    ]]
    highlight_table = Table(highlight_data, colWidths=[515])
    highlight_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(highlight_table)
    story.append(Spacer(1, 8))

    # ── SECTION 2: LATAR BELAKANG & TUJUAN ───────────────────────────
    story.append(Paragraph("2. Latar Belakang & Tujuan Strategis", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    
    story.append(Paragraph("<b>2.1 Latar Belakang Masalah</b>", h2_style))
    story.append(Paragraph(
        "1. <b>Kompleksitas Akses Data:</b> Publik sering mengalami kesulitan menemukan data statistik spesifik di portal web yang memiliki ribuan tabel dan Berita Resmi Statistik (BRS).<br/>"
        "2. <b>Kebutuhan Narasi Cepat:</b> Pengguna memerlukan penjelasan naratif singkat yang mudah dimengerti mengenai makna indikator makro, bukan sekadar tabel angka mentah.<br/>"
        "3. <b>Mitigasi Misinformasi:</b> Menjamin bahwa seluruh rujukan angka yang diberikan kepada publik bersumber 100% dari rilis resmi BPS RI.",
        body_style
    ))

    story.append(Paragraph("<b>2.2 Tujuan Strategis</b>", h2_style))
    story.append(Paragraph(
        "• <b>Meningkatkan Literasi Statistik:</b> Menyediakan sarana konsultasi cerdas mengenai definisi indikator (seperti Inflasi, PDRB, IPM, Kemiskinan, NTP, TPT).<br/>"
        "• <b>Otomatisasi Diseminasi:</b> Menghubungkan masyarakat secara langsung ke dokumen rilis resmi (PDF BRS) hanya dalam 1 klik.<br/>"
        "• <b>Mendukung Pengambilan Kebijakan (Data-Driven Policy):</b> Memberikan akses data indikator makro secara cepat bagi pimpinan saat rapat maupun dinas lapangan.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: ARSITEKTUR SISTEM & TECH STACK ───────────────────
    story.append(Paragraph("3. Arsitektur Sistem & Spesifikasi Teknologi", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    
    tech_data = [
        [Paragraph("Komponen", table_header), Paragraph("Teknologi", table_header), Paragraph("Peran & Fungsi", table_header)],
        [Paragraph("Frontend Mobile", table_cell_bold), Paragraph("Flutter 3.38.7 / Dart 3.10.7", table_cell), Paragraph("Antarmuka obrolan responsif, tema resmi BPS, dan kartu UI terstruktur.", table_cell)],
        [Paragraph("Backend Gateway", table_cell_bold), Paragraph("FastAPI (Python 3.13) + Uvicorn", table_cell), Paragraph("Pengontrol logika RAG, parser intent, dan middleware CORS.", table_cell)],
        [Paragraph("AI Engine", table_cell_bold), Paragraph("Google Gemini 3.7 / 3.6 / 3.5 Flash", table_cell), Paragraph("Pemrosesan bahasa alami Indonesia, ekstraksi entitas, dan narasi data.", table_cell)],
        [Paragraph("Data Provider", table_cell_bold), Paragraph("BPS Web API (webapi.bps.go.id)", table_cell), Paragraph("Sumber data statistik resmi (BRS, tabel statis, subjek, publikasi).", table_cell)],
        [Paragraph("Cloud Hosting", table_cell_bold), Paragraph("Vercel Serverless Edge Cloud", table_cell), Paragraph("Infrastruktur cloud aktif 24/7 dengan enkripsi HTTPS global.", table_cell)],
        [Paragraph("Packaging", table_cell_bold), Paragraph("Android Release APK (45.3 MB)", table_cell), Paragraph("Paket installer aplikasi mandiri dengan izin internet penuh.", table_cell)],
    ]
    
    tech_table = Table(tech_data, colWidths=[95, 140, 280])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    # ── SECTION 4: FITUR YANG TELAH SELESAI ─────────────────────────
    story.append(Paragraph("4. Fitur-Fitur yang Telah Selesai Diimplementasikan", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    
    features = [
        ("1. Gateway Data Riil BPS Terintegrasi (Live RAG)", "Menjawab pertanyaan indikator makro ekonomi, ketenagakerjaan, pertanian, sensus, dan kemiskinan dengan data aktual yang diambil langsung dari server BPS."),
        ("2. Kartu Statistik Terstruktur & Sitasi PDF Resmi", "Menampilkan kartu ringkasan visual berisi nama indikator, angka capaian, wilayah, periode, serta tombol pembuka dokumen rilis resmi (PDF BRS)."),
        ("3. Multi-Model Resilience (Anti-503 Error System)", "Mekanisme failover otomatis berantai antar-model (Gemini 3.7 ➡️ 3.5 ➡️ 3.6 ➡️ Flash Latest) untuk memastikan ketersediaan layanan 100% tanpa gangguan server overloaded saat demo."),
        ("4. Desain UI/UX Standar Resmi BPS & Zero Overflow", "Mengadopsi palet warna resmi BPS (BPS Blue #00ADEF, Orange #F7941D, Green #8CC63E) dengan antarmuka yang dioptimasi bebas garis kuning-hitam pada seluruh resolusi layar."),
        ("5. Cloud Deployment & Kesiapan Ekspor APK", "Backend aktif online di Vercel (https://bps-ai-backend.vercel.app) dan installer Android APK rilis (app-release.apk) siap dibagikan ke HP pimpinan.")
    ]
    
    for title, desc in features:
        feature_box = Table([[
            Paragraph(f"<b>{title}</b><br/><font color='#334155'>{desc}</font>", callout_style)
        ]], colWidths=[515])
        feature_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 0.75, accent_blue),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(feature_box)
        story.append(Spacer(1, 3.5))
        
    story.append(Spacer(1, 8))

    # ── SECTION 5: HASIL PENGUJIAN SISTEM ───────────────────────────
    story.append(Paragraph("5. Hasil Pengujian Sistem (Testing & Validation Results)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    
    tests = [
        ("🧪 Uji Coba 1: Permintaan Data Angka Indikator Terkini BPS", "Berapa inflasi Indonesia pada Juli 2026?", 
         "• <b>Status:</b> Success (200 OK)<br/>"
         "• <b>Indikator:</b> Inflasi Year-on-Year (y-on-y)<br/>"
         "• <b>Nilai Data:</b> 2,88 persen (IHK: 111,73) | <b>Periode:</b> Juli 2026<br/>"
         "• <b>Sumber:</b> Berita Resmi Statistik No. BRS/08/2026 - BPS RI (Disertai link unduh PDF resmi)."),
        
        ("🧪 Uji Coba 2: Permintaan Data Proyeksi Sensus Penduduk", "Berapa jumlah penduduk indonesia tahun 2025",
         "• <b>Status:</b> Success (200 OK)<br/>"
         "• <b>Nilai Proyeksi:</b> 284,43 juta jiwa<br/>"
         "• <b>Metode Rujukan:</b> Proyeksi Penduduk Indonesia 2020-2050 Hasil Sensus Penduduk 2020 (SP2020) Skenario Tren.<br/>"
         "• <b>Penerbit:</b> Badan Pusat Statistik & Kementerian PPN/Bappenas."),
         
        ("🧪 Uji Coba 3: Pertanyaan Konsep & Metodologi Statistik", "Apa itu inflasi?",
         "• <b>Status:</b> Success (200 OK) | <b>Intent:</b> Knowledge<br/>"
         "• <b>Hasil Narasi:</b> Penjelasan konsep kenaikan harga barang/jasa secara umum yang dipantau melalui Indeks Harga Konsumen (IHK) di kota-kota pantauan BPS di seluruh Indonesia.")
    ]
    
    for t_title, t_q, t_ans in tests:
        test_content = [
            [Paragraph(f"<b>{t_title}</b>", ParagraphStyle('TestTitle', parent=callout_style, fontName='Helvetica-Bold', textColor=primary_color))],
            [Paragraph(f"<b>Pertanyaan Pengguna:</b> <i>\"{t_q}\"</i>", callout_style)],
            [Paragraph(t_ans, ParagraphStyle('TestAns', parent=callout_style, backColor=colors.HexColor("#f0f9ff"), borderPadding=4))]
        ]
        test_box = Table(test_content, colWidths=[515])
        test_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.white),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#cbd5e1")),
            ('TOPPADDING', (0,0), (-1,-1), 3.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(test_box)
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 8))

    # ── SECTION 6: ROADMAP PENGEMBANGAN LANJUTAN ────────────────────
    story.append(Paragraph("6. Rencana & Roadmap Pengembangan Lanjutan", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    story.append(Paragraph("Rekomendasi inisiatif strategis Tim Asisten Pranata Komputer BPS Sulteng untuk mentransformasikan aplikasi menjadi Flagship App resmi BPS RI:", body_style))
    
    roadmap_data = [
        [Paragraph("Fitur Baru", table_header), Paragraph("Deskripsi Pengembangan", table_header), Paragraph("Dampak bagi Pimpinan / User", table_header)],
        [Paragraph("📊 Grafik Interaktif", table_cell_bold), Paragraph("Rendering grafik garis (Line Chart) & batang (Bar Chart) interaktif otomatis untuk tren time-series.", table_cell), Paragraph("Pimpinan dapat memahami pola tren data dalam hitungan detik.", table_cell)],
        [Paragraph("⚖️ Komparasi Wilayah", table_cell_bold), Paragraph("Tabel perbandingan berdampingan antar-provinsi / kab/kota lengkap dengan kalkulasi selisih.", table_cell), Paragraph("Evaluasi disparitas pembangunan daerah secara instan.", table_cell)],
        [Paragraph("🛡️ Smart Policy Bridging", table_cell_bold), Paragraph("Menghubungkan pertanyaan program pemerintah (MBG, IKN, Bansos) ke dataset BPS terkait.", table_cell), Paragraph("Memposisikan BPS sebagai pusat rujukan data kebijakan nasional.", table_cell)],
        [Paragraph("🎙️ Voice Assistant", table_cell_bold), Paragraph("Fitur tanya lewat suara (Speech-to-Text) dan pembaca audio ringkasan data (Text-to-Speech).", table_cell), Paragraph("Aksesibilitas tinggi saat mobile dan bagi penyandang disabilitas netra.", table_cell)],
        [Paragraph("📤 Ekspor PDF & WA", table_cell_bold), Paragraph("Ekspor dokumen Ringkasan Eksekutif resmi BPS format PDF dan share kartu data ke WhatsApp.", table_cell), Paragraph("Mempercepat penyebaran bahan paparan rapat pimpinan.", table_cell)],
        [Paragraph("🔔 Live BRS Feed", table_cell_bold), Paragraph("Tab dashboard pemantauan indikator makro dan feed rilis BRS harian dari server BPS.", table_cell), Paragraph("Menjadi portal monitoring indikator strategis harian.", table_cell)],
    ]
    
    roadmap_table = Table(roadmap_data, colWidths=[105, 230, 180])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(roadmap_table)
    story.append(Spacer(1, 8))

    # ── SECTION 7: KESIMPULAN ───────────────────────────────────────
    story.append(Paragraph("7. Kesimpulan & Penutup", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceAfter=6))
    story.append(Paragraph(
        "Pengembangan <b>BPS AI Assistant Mobile (Fase 1)</b> oleh <b>Tim Asisten Pranata Komputer BPS Provinsi Sulawesi Tengah</b> telah berhasil diselesaikan dengan sukses, "
        "memenuhi seluruh standar fungsional, performa, serta keandalan integrasi data resmi BPS.<br/><br/>"
        "Aplikasi ini siap dipresentasikan di hadapan pimpinan sebagai bukti nyata inovasi digitalisasi dan modernisasi diseminasi data statistik "
        "Badan Pusat Statistik menuju era keterbukaan data yang inklusif, modern, dan akurat.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("Comprehensive PDF generated successfully at:", PDF_PATH)

if __name__ == "__main__":
    build_pdf()
