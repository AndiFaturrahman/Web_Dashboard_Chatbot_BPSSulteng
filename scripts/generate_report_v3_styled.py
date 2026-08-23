import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class PDF(FPDF):
    def header(self):
        # We only want the big banner on the first page
        if self.page_no() == 1:
            self.set_fill_color(31, 73, 125) # Dark blue
            self.rect(10, 15, 190, 40, 'F')
            
            self.set_font('helvetica', 'B', 24)
            self.set_text_color(255, 255, 255)
            self.set_xy(15, 20)
            self.cell(0, 10, 'BPS AI ASSISTANT MOBILE', border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
            
            self.set_font('helvetica', 'B', 16)
            self.set_xy(15, 32)
            self.cell(0, 10, 'Laporan Final Project Fix - Versi 3', border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
            
            self.set_font('helvetica', '', 11)
            self.set_xy(15, 42)
            self.cell(0, 10, 'Dokumen Penjelasan Teknis & Ringkasan Fitur', border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
            
            self.set_y(65)
        else:
            # Simple header for other pages
            self.set_font('helvetica', 'B', 10)
            self.set_text_color(31, 73, 125)
            self.cell(0, 10, 'BPS AI Assistant Mobile | Laporan Versi 3', border=0, new_x=XPos.RIGHT, new_y=YPos.TOP, align='L')
            self.set_text_color(0, 0, 0)
            self.set_y(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f'Halaman {self.page_no()}', border=0, new_x=XPos.RIGHT, new_y=YPos.TOP, align='R')

    def chapter_title(self, title):
        self.set_font('helvetica', 'B', 14)
        self.set_text_color(31, 73, 125) # Dark blue text
        self.cell(0, 10, title, border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        self.ln(2)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 6, body)
        self.ln(4)
        
    def draw_message_box(self, title, message):
        self.ln(2)
        self.set_fill_color(230, 245, 230) # Light green background
        self.set_draw_color(100, 180, 100) # Green border
        self.set_line_width(0.5)
        
        # Calculate height needed
        self.set_font('helvetica', 'B', 11)
        # Just drawing a rect and putting text
        self.rect(10, self.get_y(), 190, 25, 'DF')
        
        self.set_xy(15, self.get_y() + 3)
        self.set_text_color(0, 0, 0)
        self.cell(0, 6, title, border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        self.set_font('helvetica', '', 11)
        self.set_x(15)
        self.multi_cell(180, 6, message)
        self.ln(8)
        self.set_line_width(0.2)

def create_table(pdf, headers, rows, col_widths):
    # Header
    pdf.set_fill_color(31, 73, 125)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('helvetica', 'B', 11)
    for i, header in enumerate(headers):
        pdf.cell(col_widths[i], 10, header, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
    pdf.ln()

    # Rows
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('helvetica', '', 10)
    fill = False
    for row in rows:
        if fill:
            pdf.set_fill_color(245, 245, 250)
        else:
            pdf.set_fill_color(255, 255, 255)
            
        # To handle multiline we need a special approach, but for simplicity we assume single line 
        # or use a small trick. Let's just use simple cells assuming text fits.
        for i, text in enumerate(row):
            pdf.cell(col_widths[i], 10, text, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='L', fill=fill)
        pdf.ln()
        fill = not fill
    pdf.ln(5)


def create_report():
    pdf = PDF()
    pdf.add_page()
    
    # Tujuan Dokumen
    pdf.chapter_title('Tujuan dokumen')
    pdf.chapter_body(
        "Menjelaskan hasil finalisasi (Project Fix) dari BPS AI Assistant Mobile Versi 3. "
        "Dokumen ini menjabarkan perbaikan arsitektur kinerja, penyesuaian instruksi visualisasi data, "
        "serta peningkatan keandalan untuk presentasi kepada pemangku kepentingan."
    )
    
    # Ringkasan Eksekutif (Table)
    headers1 = ['Item', 'Keterangan']
    rows1 = [
        ['Target pengguna', 'Masyarakat luas, pencari data statistik BPS'],
        ['Platform / Kanal', 'Aplikasi Android (Flutter) + Backend Python (FastAPI)'],
        ['Prinsip Output', 'Grounded Answer, Angka Absolut (Riil), Rujukan Referensi Akurat'],
        ['Arsitektur RAG', 'Parallel Fetching (BPS API) + LLM Prompting + Fallback Strategy'],
        ['Status Dokumen', 'Finalisasi Versi 3 (Project Fix)']
    ]
    create_table(pdf, headers1, rows1, [50, 140])
    
    pdf.draw_message_box(
        "Pesan utama untuk Tim:",
        "Versi 3 secara khusus mengatasi masalah krusial di Versi 2: (1) Visualisasi grafik sekarang tegas menggunakan angka riil (bukan persentase). (2) Waktu tunggu (latency) turun drastis di bawah 7 detik berkat pemrosesan paralel. (3) Sistem tangguh terhadap limit API lewat strategi model fallback."
    )
    
    # 1. Keputusan Arsitektur
    pdf.chapter_title('1. Ringkasan Eksekutif & Keputusan Arsitektur')
    pdf.chapter_body(
        "Pada iterasi Versi 3, perbaikan tidak hanya pada antarmuka, namun merombak "
        "inti pemrosesan data (backend). Berikut adalah keputusan arsitektur paling penting:"
    )
    
    headers2 = ['No', 'Keputusan / Perbaikan', 'Makna & Dampak']
    rows2 = [
        ['1', 'Strict Prompting untuk Grafik', 'Bar & Line Chart dipaksa menggunakan angka absolut.'],
        ['2', 'Parallel API Fetching (asyncio)', 'Mencegah timeout Vercel (10s), respons turun < 7s.'],
        ['3', 'Model Fallback Strategy', 'Otomatis pindah ke model backup jika kena Rate Limit.'],
        ['4', 'Pemetaan Keyword (Populasi)', 'Data daerah lebih akurat ditemukan tanpa blank result.'],
        ['5', 'Splash Screen 5 Detik', 'Transisi awal aplikasi Android lebih halus dan profesional.']
    ]
    create_table(pdf, headers2, rows2, [15, 75, 100])
    
    # 2. Apa yang terjadi ketika masyarakat bertanya?
    pdf.chapter_title('2. Alur Proses Pertanyaan (Runtime Logic)')
    pdf.chapter_body(
        "1. Request Masuk: Pengguna bertanya melalui aplikasi Android.\n"
        "2. Identifikasi Entitas & Keyword: Sistem memperbaiki keyword (misal: 'populasi' -> 'penduduk').\n"
        "3. Parallel Fetching: Backend secara bersamaan memanggil API BRS dan API Publikasi BPS.\n"
        "4. Sintesis & Visualisasi: Model Gemini mengolah data. Jika ada perintah grafik, model menyusun data dengan angka absolut.\n"
        "5. Citation Validation: Jawaban dikembalikan ke pengguna beserta daftar rujukan (sumber)."
    )
    
    pdf.add_page()
    
    # 3. FAQ / Pertanyaan yang Kemungkinan Muncul
    pdf.chapter_title('3. Pertanyaan yang Kemungkinan Muncul dan Jawaban Singkat')
    
    # Since we need multiline in table, we will use multi_cell manually for the table to make it look good.
    pdf.set_fill_color(31, 73, 125)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('helvetica', 'B', 11)
    pdf.cell(70, 10, 'Pertanyaan', border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
    pdf.cell(120, 10, 'Jawaban yang disarankan', border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C', fill=True)
    
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('helvetica', '', 10)
    
    faq_data = [
        ("Kenapa sebelumnya grafik sering pakai persentase?", "Model bawaan LLM cenderung menormalisasi data menjadi skala 100%. Di Versi 3, instruksi (prompt) telah dikunci ketat agar selalu menggunakan nilai riil dari BPS."),
        ("Bagaimana cara mengatasi limit waktu (Timeout) Vercel?", "Dengan menggunakan fungsi asyncio.gather di Python, pengambilan data BRS dan Publikasi dilakukan serentak (paralel), memangkas waktu tunggu dari 15 detik menjadi di bawah 7 detik."),
        ("Apa yang terjadi jika server AI penuh (Rate Limit)?", "Backend dilengkapi fitur 'Fallback'. Jika model utama gagal (HTTP 429), sistem otomatis mencoba model kedua (Flash-lite / Pro) agar pengguna tetap mendapat jawaban."),
        ("Apakah aplikasi Android sudah final?", "Aplikasi sudah di-compile ke dalam bentuk rilis (statix-bps.apk) dan animasi awal (splash screen) telah diperpanjang menjadi 5 detik untuk User Experience yang lebih baik.")
    ]
    
    for q, a in faq_data:
        x_start = pdf.get_x()
        y_start = pdf.get_y()
        
        # Calculate heights
        pdf.set_font('helvetica', 'B', 10)
        # Just use a fixed height of 20 for these specific FAQs
        row_height = 25
        
        pdf.rect(x_start, y_start, 70, row_height)
        pdf.rect(x_start + 70, y_start, 120, row_height)
        
        pdf.set_xy(x_start + 2, y_start + 2)
        pdf.multi_cell(66, 5, q, border=0, align='L')
        
        pdf.set_xy(x_start + 72, y_start + 2)
        pdf.set_font('helvetica', '', 10)
        pdf.multi_cell(116, 5, a, border=0, align='L')
        
        pdf.set_y(y_start + row_height)
    
    pdf.ln(10)
    
    # 4. Glosarium Singkat
    pdf.chapter_title('4. Glosarium Singkat')
    headers3 = ['Istilah', 'Arti dalam Proyek']
    rows3 = [
        ['RAG', 'Retrieval-Augmented Generation: mencari sumber BPS sebelum AI menjawab.'],
        ['Parallel Fetching', 'Mengambil beberapa data API sekaligus untuk mempercepat proses.'],
        ['Fallback Strategy', 'Trik berpindah model AI secara otomatis saat terjadi gangguan server.'],
        ['Angka Absolut', 'Nilai riil / sebenarnya (contoh: 2.000 jiwa), kebalikan dari persentase (2%).']
    ]
    create_table(pdf, headers3, rows3, [50, 140])
    
    pdf.draw_message_box(
        "Kesimpulan Akhir:",
        "Arsitektur Versi 3 dirancang agar BPS AI Assistant Mobile merespons lebih cepat, menyajikan visualisasi data yang akurat (angka absolut), dan tahan terhadap gangguan koneksi eksternal. Sistem ini siap untuk dieksplorasi menuju pengembangan multi-agent (saling sanggah) di masa depan."
    )

    output_path = r"d:\Magang BPS\Project\bps_ai_mobile\Laporan_Versi_3_Professional.pdf"
    pdf.output(output_path)
    print(f"Laporan berhasil dibuat di: {output_path}")

if __name__ == '__main__':
    create_report()
