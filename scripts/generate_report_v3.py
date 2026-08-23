import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'Laporan Final: BPS AI Assistant Mobile', 0, 1, 'C')
        self.set_font('helvetica', 'I', 12)
        self.cell(0, 10, 'Project Fix - Versi 3', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Halaman {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('helvetica', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 11)
        self.multi_cell(0, 7, body)
        self.ln(6)

def create_report():
    pdf = PDF()
    pdf.add_page()
    
    # 1. Pendahuluan
    pdf.chapter_title('1. Pendahuluan')
    body1 = (
        "BPS AI Assistant Mobile adalah aplikasi pintar berbasis Android yang dirancang "
        "untuk memudahkan pengguna dalam mencari, memahami, dan memvisualisasikan data dari "
        "Badan Pusat Statistik (BPS). Laporan ini mendokumentasikan rilis final Versi 3 "
        "(Project Fix) yang memuat arsitektur sistem, fitur, serta optimalisasi yang telah dicapai."
    )
    pdf.chapter_body(body1)

    # 2. Fitur Utama
    pdf.chapter_title('2. Fitur Utama Aplikasi')
    body2 = (
        "- Pencarian Data Real-Time (RAG): Aplikasi menggunakan teknologi Retrieval-Augmented "
        "Generation yang secara langsung mengambil data Berita Resmi Statistik (BRS) dan Publikasi "
        "dari Web API BPS. Hal ini memastikan jawaban AI selalu valid dan terbaru.\n"
        "- Visualisasi Dinamis: Chatbot mampu mengenali instruksi pembuatan grafik dan menampilkan "
        "Bar Chart, Line Chart, maupun Pie Chart langsung di dalam ruang obrolan.\n"
        "- Penyertaan Referensi: Jawaban AI selalu disertai dengan nama dokumen sumber (BRS/Publikasi) "
        "dan tautan resmi BPS untuk memastikan akurasi dan kredibilitas data.\n"
        "- Desain Modern: Antarmuka dibangun dengan framework Flutter, dilengkapi splash screen animasi "
        "berdurasi 5 detik dan nuansa desain yang mulus."
    )
    pdf.chapter_body(body2)

    # 3. Peningkatan di Versi 3 (Project Fix)
    pdf.chapter_title('3. Peningkatan di Versi 3 (Project Fix)')
    body3 = (
        "Versi 3 merupakan tahap finalisasi sistem (Project Fix) yang berfokus pada keandalan, "
        "performa, dan akurasi logika chatbot. Pencapaian pada versi ini meliputi:\n\n"
        "- Akurasi Data Grafik: Logika prompt AI diperketat secara tegas sehingga Bar Chart dan "
        "Line Chart menggunakan angka absolut (riil) dengan benar, tidak lagi menampilkan format "
        "persentase kecuali pengguna memintanya.\n"
        "- Kecepatan Respons (Parallel Fetching): Backend dirombak untuk menggunakan asyncio.gather. "
        "Dengan mengambil data API secara paralel, latensi berhasil ditekan menjadi di bawah 7 detik, "
        "sekaligus menyelesaikan isu 'timeout' pada lingkungan deployment Vercel.\n"
        "- Strategi Model Cerdas (Fallback): Diimplementasikan sistem peralihan model AI "
        "(Gemini Flash-lite ke Gemini Pro). Jika model ringan terkena batas akses (Rate Limit/HTTP 429), "
        "sistem otomatis mengalihkan ke model utama agar tidak terjadi kegagalan sistem.\n"
        "- Keandalan Pencarian Data Daerah: Menambahkan pemetaan kata kunci (misal: 'populasi' -> "
        "'penduduk') serta memperbaiki query domain agar data untuk wilayah kabupaten/kota "
        "(contoh: Kota Palu) dapat ditarik dengan presisi.\n"
        "- Deployment & Rilis APK: Backend (API Python) berhasil dirilis di Vercel, sementara front-end "
        "berhasil dikompilasi menjadi berkas instalasi statix-bps.apk yang telah teruji di emulator Android."
    )
    pdf.chapter_body(body3)

    # 4. Kesimpulan
    pdf.chapter_title('4. Kesimpulan')
    body4 = (
        "Versi 3 mengukuhkan stabilitas BPS AI Assistant Mobile. Keseluruhan alur dari sisi "
        "penarikan data, pemrosesan bahasa oleh AI, hingga rendering antarmuka pengguna pada perangkat "
        "mobile telah berjalan sangat efisien dan akurat, menjadikan aplikasi ini siap digunakan "
        "sebagai asisten data cerdas berbasis statistik BPS."
    )
    pdf.chapter_body(body4)

    # Output to the project folder
    output_path = r"d:\Magang BPS\Project\bps_ai_mobile\Laporan_Versi_3_Project_Fix.pdf"
    pdf.output(output_path)
    print(f"Laporan berhasil dibuat di: {output_path}")

if __name__ == '__main__':
    create_report()
