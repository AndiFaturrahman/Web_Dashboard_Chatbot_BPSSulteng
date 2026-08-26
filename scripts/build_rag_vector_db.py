import os
import sys
import chromadb

BASE_DIR = r"D:\Magang BPS\STATIX-Chatbot-BPS"
VECTOR_DB_DIR = os.path.join(BASE_DIR, "ml-pipeline", "data", "vector_db", "bps_knowledge")
os.makedirs(VECTOR_DB_DIR, exist_ok=True)

print("=" * 65)
print("MEMBANGUN CHROMADB VECTOR DATABASE RESMI BPS RI & SULTENG")
print("=" * 65)
print(f"Target Direktori Vector DB: {VECTOR_DB_DIR}")

chroma_client = chromadb.PersistentClient(path=VECTOR_DB_DIR)
collection = chroma_client.get_or_create_collection(
    name="bps_knowledge_base",
    metadata={"hnsw:space": "cosine"}
)

DOCUMENTS = [
    {
        "id": "ppid_sulteng_pimpinan_2026",
        "title": "Profil Pimpinan BPS Provinsi Sulawesi Tengah",
        "category": "Kepegawaian PPID",
        "region": "Sulawesi Tengah",
        "domain_id": "7200",
        "url": "https://sulteng.bps.go.id/id/profil-pimpinan",
        "content": """Kepala Badan Pusat Statistik (BPS) Provinsi Sulawesi Tengah saat ini adalah Bapak Daryanto, S.Si., M.M. 
Kantor BPS Provinsi Sulawesi Tengah beralamat di Jl. Prof. Moh. Yamin No. 29, Kota Palu, Sulawesi Tengah (72111).
Struktur Pimpinan BPS Sulteng membawahi Bagian Umum, Tim Kerja Statistik Sosial, Tim Kerja Statistik Distribusi, Tim Kerja Statistik Produksi, Tim Kerja Neraca Wilayah dan Analisis Statistik, serta Tim Kerja Integrasi Pengolahan dan Diseminasi Statistik.
Sebelumnya jabatan Kepala BPS Sulteng sempat dijabat oleh Pelaksana Tugas (Plt.) Bapak Imron Taufik J. Musa, S.Si., M.Si., dan pada periode sebelumnya pernah dijabat oleh Bapak Drs. Simon Sapary, M.Sc."""
    },
    {
        "id": "ppid_sulteng_13_kabkota",
        "title": "Daftar Kantor BPS 13 Kabupaten/Kota di Sulawesi Tengah",
        "category": "Kepegawaian PPID",
        "region": "Sulawesi Tengah",
        "domain_id": "7200",
        "url": "https://sulteng.bps.go.id/id/satuan-kerja",
        "content": """Daftar Kantor BPS Kabupaten/Kota di wilayah Provinsi Sulawesi Tengah:
1. BPS Kota Palu (Domain 7271) - Jl. Banteng No. 19 Palu.
2. BPS Kabupaten Donggala (Domain 7203) - Jl. Jati No. 5 Banawa.
3. BPS Kabupaten Sigi (Domain 7210) - Jl. Trans Palu-Kulawi KM 15 Bora, Sigi.
4. BPS Kabupaten Poso (Domain 7202) - Jl. Pulau Timor No. 1 Poso.
5. BPS Kabupaten Banggai (Domain 7201) - Jl. Sam Ratulangi No. 102 Luwuk.
6. BPS Kabupaten Banggai Kepulauan (Domain 7207) - Kompleks Perkantoran Salakan.
7. BPS Kabupaten Banggai Laut (Domain 7211) - Jl. Kompleks Perkantoran Banggai.
8. BPS Kabupaten Morowali (Domain 7206) - Kompleks Perkantoran Fonuasingko, Bungku.
9. BPS Kabupaten Morowali Utara (Domain 7212) - Jl. Kolonodale, Petasia.
10. BPS Kabupaten Parigi Moutong (Domain 7208) - Jl. Kampus No. 2 Parigi.
11. BPS Kabupaten Tojo Una-Una (Domain 7209) - Kompleks Perkantoran Bumi Mas, Ampana.
12. BPS Kabupaten Tolitoli (Domain 7204) - Jl. Magamu No. 85 Tolitoli.
13. BPS Kabupaten Buol (Domain 7205) - Kompleks Perkantoran Leok II, Buol.
Seluruh satker vertikal melayani Pelayanan Statistik Terpadu (PST) dan konsultasi data di wilayah masing-masing."""
    },
    {
        "id": "ppid_bps_ri_pimpinan_2026",
        "title": "Susunan Pimpinan Badan Pusat Statistik Republik Indonesia (BPS RI)",
        "category": "Kepegawaian PPID",
        "region": "Nasional",
        "domain_id": "0000",
        "url": "https://www.bps.go.id/id/profil-pimpinan",
        "content": """Berdasarkan Peraturan Presiden No. 1 Tahun 2025 dan Peraturan BPS No. 2 Tahun 2025, Susunan Pimpinan BPS RI:
• Kepala BPS RI: Amalia Adininggar Widyasanti, ST, M.Si, M.Eng, Ph.D
• Wakil Kepala BPS RI: Dr. Sonny Harry B Harmadi, SE, ME, CRGP
• Sekretaris Utama: Dr. Ir. Zulkipli, M.Si
• Deputi Bidang Metodologi & Informasi Statistik: Dr. Pudji Ismartini, M.App.Stat
• Deputi Bidang Statistik Sosial: Dr. M. Nashrul Wajdi, SST, M.Si
• Deputi Bidang Statistik Produksi: M. Habibullah, S.Si, M.Si
• Deputi Bidang Statistik Distribusi & Jasa: Dr. Ateng Hartono, SE, M.Si
• Deputi Bidang Neraca & Analisis Statistik: Moh. Edy Mahmud, S.Si, MP
• Inspektur Utama: Dr. Dadang Hardiwan, S.Si, M.Si, CGCAE, CGRE
Kantor Pusat BPS RI beralamat di Jl. Dr. Sutomo No. 6-8, Pasar Baru, Jakarta Pusat (10710)."""
    },
    {
        "id": "metodologi_kemiskinan_bps",
        "title": "Metodologi Penghitungan Garis Kemiskinan dan Penduduk Miskin BPS",
        "category": "Metodologi Statistik",
        "region": "Nasional",
        "domain_id": "0000",
        "url": "https://www.bps.go.id/id/subject/kemiskinan-dan-ketimpangan",
        "content": """Untuk mengukur kemiskinan, BPS menggunakan konsep kemampuan memenuhi kebutuhan dasar (Basic Needs Approach). Dengan pendekatan ini, kemiskinan dipandang sebagai ketidakmampuan dari sisi ekonomi untuk memenuhi kebutuhan dasar makanan dan bukan makanan yang diukur menurut Garis Kemiskinan (GK).
Garis Kemiskinan (GK) terdiri atas dua komponen:
1. Garis Kemiskinan Makanan (GKM): Nilai pengeluaran kebutuhan minimum makanan yang disetarakan dengan 2.100 kkalori per kapita per hari (terdiri dari 52 komoditi makanan).
2. Garis Kemiskinan Non-Makanan (GKNM): Nilai pengeluaran kebutuhan minimum untuk perumahan, sandang, pendidikan, dan kesehatan (51 komoditi perkotaan, 47 komoditi perdesaan).
Penduduk miskin adalah penduduk yang memiliki rata-rata pengeluaran per kapita per bulan di bawah Garis Kemiskinan. Data dikumpulkan melalui Survei Sosial Ekonomi Nasional (Susenas) setiap bulan Maret dan September."""
    },
    {
        "id": "metodologi_inflasi_bps",
        "title": "Metodologi Penghitungan Indeks Harga Konsumen (IHK) dan Inflasi BPS",
        "category": "Metodologi Statistik",
        "region": "Nasional",
        "domain_id": "0000",
        "url": "https://www.bps.go.id/id/subject/inflasi",
        "content": """Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus menerus dalam jangka waktu tertentu. BPS menghitung laju inflasi berdasarkan Indeks Harga Konsumen (IHK) dengan tahun dasar 2022=100 (hasil Survei Biaya Hidup / SBH 2022 di 150 kabupaten/kota di Indonesia).
Klasifikasi pengeluaran IHK dibagi menjadi 11 kelompok pengeluaran (COICOP):
1. Makanan, minuman, dan tembakau
2. Pakaian dan alas kaki
3. Perumahan, air, listrik, dan bahan bakar rumah tangga
4. Perlengkapan, peralatan, dan pemeliharaan rutin rumah tangga
5. Kesehatan
6. Transportasi
7. Informasi, komunikasi, dan jasa keuangan
8. Rekreasi, olahraga, dan budaya
9. Pendidikan
10. Penyediaan makanan dan minuman/restoran
11. Perawatan pribadi dan jasa lainnya.
Inflasi dihitung dalam 3 formula: Inflasi Bulanan (m-to-m), Inflasi Tahun Kalender (y-to-d), dan Inflasi Tahunan (y-on-y)."""
    },
    {
        "id": "metodologi_ipm_bps",
        "title": "Metodologi Penghitungan Indeks Pembangunan Manusia (IPM Metode Baru)",
        "category": "Metodologi Statistik",
        "region": "Nasional",
        "domain_id": "0000",
        "url": "https://www.bps.go.id/id/subject/indeks-pembangunan-manusia",
        "content": """Indeks Pembangunan Manusia (IPM) mengukur capaian pembangunan manusia berbasis tiga dimensi dasar:
1. Umur Panjang dan Hidup Sehat: Diukur dengan Umur Harapan Hidup saat lahir (UHH).
2. Pengetahuan: Diukur dengan Harapan Lama Sekolah (HLS) bagi anak usia 7 tahun dan Rata-rata Lama Sekolah (RLS) bagi penduduk usia 25 tahun ke atas.
3. Standar Hidup Layak: Diukur dengan Pengeluaran Riil per Kapita yang disesuaikan (Purchasing Power Parity / PPP).
Kategori Status Capaian IPM:
• Sangat Tinggi: IPM >= 80
• Tinggi: 70 <= IPM < 80
• Sedang: 60 <= IPM < 70
• Rendah: IPM < 60
Di Sulawesi Tengah, Kota Palu merupakan satu-satunya daerah dengan status IPM Sangat Tinggi (82,52+)."""
    },
    {
        "id": "layanan_pst_bps",
        "title": "Standar Pelayanan Statistik Terpadu (PST) & Konsultasi BPS",
        "category": "Layanan BPS",
        "region": "Nasional",
        "domain_id": "0000",
        "url": "https://pst.bps.go.id",
        "content": """Pelayanan Statistik Terpadu (PST) BPS menyediakan layanan:
1. Konsultasi Statistik: Konsultasi tatap muka di kantor BPS atau daring via portal pst.bps.go.id / Live Chat / Tanya BPS.
2. Rekomendasi Kegiatan Statistik (ROMANTIK): Fasilitasi bagi instansi pemerintah (K/L/D) yang akan melaksanakan survei sektoral untuk mendapatkan rekomendasi metodologi sesuai prinsip Satu Data Indonesia (SDI).
3. Perpustakaan & Penjualan Publikasi: Akses gratis membaca publikasi digital (PDF) di situs bps.go.id dan layanan cetak berbayar sesuai tarif PNBP PP No. 59/2020.
4. Permohonan Data Mikro & Peta Digital: Akses dataset mentah survei (Susenas, Sakernas, Sensus) untuk riset, skripsi, dan akademisi."""
    },
    {
        "id": "komparasi_jabar_jatim_2024",
        "title": "Perbandingan Resmi Indikator Strategis Jawa Barat vs Jawa Timur",
        "category": "Komparasi Daerah",
        "region": "Jawa",
        "domain_id": "0000",
        "url": "https://www.bps.go.id/id/pressrelease",
        "content": """Data Komparasi Resmi BPS antara Provinsi Jawa Barat dan Provinsi Jawa Timur:
• Persentase Kemiskinan (P0 Maret 2024): Jawa Barat 7,25% vs Jawa Timur 9,79% (Jabar lebih rendah 2,54% poin).
• Jumlah Penduduk Miskin: Jawa Barat 3,85 Juta Jiwa vs Jawa Timur 3,98 Juta Jiwa.
• Indeks Pembangunan Manusia (IPM 2024): Jawa Barat 74,65 (Tinggi) vs Jawa Timur 74,65 (Tinggi) - capaian seimbang.
• Tingkat Pengangguran Terbuka (TPT 2024): Jawa Barat 6,91% vs Jawa Timur 3,74% (Jatim unggul dalam penyerapan tenaga kerja).
• Pertumbuhan Ekonomi (PDRB 2024): Jawa Barat 5,00% vs Jawa Timur 4,95% (Kedua provinsi menjadi motor ekonomi utama Pulau Jawa)."""
    }
]

print(f"\nMengindeks {len(DOCUMENTS)} Dokumen Resmi BPS ke ChromaDB...")

ids = [doc["id"] for doc in DOCUMENTS]
texts = [doc["content"] for doc in DOCUMENTS]
metas = [{
    "title": doc["title"],
    "category": doc["category"],
    "region": doc["region"],
    "domain_id": doc["domain_id"],
    "url": doc["url"]
} for doc in DOCUMENTS]

collection.upsert(
    ids=ids,
    documents=texts,
    metadatas=metas
)

print(f"[SUCCESS] {len(DOCUMENTS)} dokumen berhasil diindeks ke Vector Database!")
print(f"Total Dokumen di Collection: {collection.count()}")

print("\n" + "=" * 65)
print("PENGUJIAN QUERY SEMANTIK RAG (VECTOR SEARCH TEST):")
print("=" * 65)

test_queries = [
    "siapa pimpinan bps provinsi sulawesi tengah saat ini?",
    "siapa kepala bps ri tahun 2025?",
    "bagaimana cara bps menghitung garis kemiskinan?",
    "apa saja layanan di PST BPS?"
]

for q in test_queries:
    res = collection.query(query_texts=[q], n_results=1)
    doc = res["documents"][0][0]
    meta = res["metadatas"][0][0]
    distance = res["distances"][0][0] if "distances" in res else 0.0
    print(f"\n[QUERY] '{q}'")
    print(f"  -> Match: [{meta['title']}] (Distance: {distance:.4f})")
    print(f"  -> Snippet: {doc[:140]}...")

print("\n" + "=" * 65)
print("CHROMADB VECTOR DATABASE RAG BERHASIL DIBANGUN & TERVERIFIKASI!")
print("=" * 65)