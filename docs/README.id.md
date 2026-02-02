# FossFLOW - Alat Diagram Isometrik <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a> | <a href="README.es.md">Español</a> | <a href="README.pt.md">Português</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.ru.md">Русский</a> | <a href="README.id.md">Bahasa Indonesia</a> | <a href="README.de.md">Deutsch</a>
</p>

<b>Halo!</b> Saya Stan, jika Anda telah menggunakan FossFLOW dan ini membantu Anda, <b>saya akan sangat menghargai jika Anda bisa menyumbang sesuatu yang kecil :)</b> Saya bekerja penuh waktu, dan menemukan waktu untuk mengerjakan proyek ini sudah cukup menantang.
Jika saya telah mengimplementasikan fitur untuk Anda atau memperbaiki bug, akan sangat bagus jika Anda bisa menyumbang :) jika tidak, tidak masalah, software ini akan selalu tetap gratis!


<b>Juga!</b> Jika Anda belum melakukannya, silakan lihat library dasar yang digunakan untuk membangun ini oleh <a href="https://github.com/markmanx/isoflow">@markmanx</a> Saya benar-benar berdiri di atas bahu raksasa di sini 🫡

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>


Terima kasih,

-Stan

## Coba Secara Online

Kunjungi  <b> --> https://stan-smith.github.io/FossFLOW/ <-- </b>


------------------------------------------------------------------------------------------------------------------------------
FossFLOW adalah aplikasi web progresif (PWA) open-source yang powerful untuk membuat diagram isometrik yang indah. Dibangun dengan React dan library <a href="https://github.com/markmanx/isoflow">Isoflow</a> (Sekarang di-fork dan dipublikasikan ke NPM sebagai fossflow), berjalan sepenuhnya di browser Anda dengan dukungan offline.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - Cara berkontribusi pada proyek.

## Pembaruan Terbaru (Oktober 2025)

### Impor Ikon Kustom
- **Impor Ikon Anda Sendiri** - Unggah ikon kustom (PNG, JPG, SVG) untuk digunakan dalam diagram Anda
- **Penskalaan Otomatis** - Ikon secara otomatis diskalakan ke ukuran yang konsisten untuk tampilan profesional
- **Toggle Isometrik/Datar** - Pilih apakah ikon yang diimpor muncul sebagai 3D isometrik atau 2D datar
- **Persistence Cerdas** - Ikon kustom disimpan dengan diagram dan bekerja di semua metode penyimpanan
- **Sumber Daya Ikon** - Temukan ikon gratis di:
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - Ribuan ikon SVG gratis
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - Paket ikon isometrik berkualitas tinggi

### Dukungan Penyimpanan Server
- **Penyimpanan Persisten** - Diagram disimpan ke filesystem server, bertahan di seluruh sesi browser
- **Akses Multi-perangkat** - Akses diagram Anda dari perangkat apa pun saat menggunakan deployment Docker
- **Deteksi Otomatis** - UI secara otomatis menampilkan penyimpanan server saat tersedia
- **Perlindungan Penimpaan** - Dialog konfirmasi saat menyimpan dengan nama duplikat
- **Integrasi Docker** - Penyimpanan server diaktifkan secara default dalam deployment Docker

### Fitur Interaksi yang Ditingkatkan
- **Hotkey yang Dapat Dikonfigurasi** - Tiga profil (QWERTY, SMNRCT, None) untuk pemilihan alat dengan indikator visual
- **Kontrol Pan Lanjutan** - Beberapa metode pan termasuk seret area kosong, klik tengah/kanan, tombol modifier (Ctrl/Alt), dan navigasi keyboard (Arrow/WASD/IJKL)
- **Toggle Panah Konektor** - Opsi untuk menampilkan/menyembunyikan panah pada konektor individual
- **Pemilihan Alat Persisten** - Alat konektor tetap aktif setelah membuat koneksi
- **Dialog Pengaturan** - Konfigurasi terpusat untuk hotkey dan kontrol pan

### Peningkatan Docker & CI/CD
- **Build Docker Otomatis** - Workflow GitHub Actions untuk deployment Docker Hub otomatis pada commit
- **Dukungan Multi-arsitektur** - Image Docker untuk `linux/amd64` dan `linux/arm64`
- **Image Pra-dibangun** - Tersedia di `stnsmith/fossflow:latest`

### Arsitektur Monorepo
- **Repositori tunggal** untuk library dan aplikasi
- **NPM Workspaces** untuk manajemen dependensi yang efisien
- **Proses build terpadu** dengan `npm run build` di root

### Perbaikan UI
- Memperbaiki masalah tampilan ikon toolbar editor Quill
- Menyelesaikan peringatan key React di menu konteks
- Meningkatkan styling editor markdown

## Fitur

- 🎨 **Diagram Isometrik** - Buat diagram teknis bergaya 3D yang menakjubkan
- 💾 **Auto-Save** - Pekerjaan Anda secara otomatis disimpan setiap 5 detik
- 📱 **Dukungan PWA** - Instal sebagai aplikasi native di Mac dan Linux
- 🔒 **Privasi Pertama** - Semua data disimpan secara lokal di browser Anda
- 📤 **Impor/Ekspor** - Bagikan diagram sebagai file JSON
- 🎯 **Penyimpanan Sesi** - Simpan cepat tanpa dialog
- 🌐 **Dukungan Offline** - Bekerja tanpa koneksi internet
- 🗄️ **Penyimpanan Server** - Penyimpanan persisten opsional saat menggunakan Docker (diaktifkan secara default)
- 🌍 **Multibahasa** - Dukungan lengkap untuk 9 bahasa: English, 简体中文, Español, Português, Français, हिन्दी, বাংলা, Русский, Bahasa Indonesia


## 🐳 Deploy Cepat dengan Docker

```bash
# Menggunakan Docker Compose (disarankan - termasuk penyimpanan persisten)
docker compose up

# Atau jalankan langsung dari Docker Hub dengan penyimpanan persisten
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

Penyimpanan server diaktifkan secara default di Docker. Diagram Anda akan disimpan ke `./diagrams` di host.

Untuk menonaktifkan penyimpanan server, set `ENABLE_SERVER_STORAGE=false`:
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
```

## Mulai Cepat (Pengembangan Lokal)

```bash
# Clone repositori
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# Install dependensi
npm install

# Build library (diperlukan pertama kali)
npm run build:lib

# Mulai development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Monorepo

Ini adalah monorepo yang berisi dua paket:

- `packages/fossflow-lib` - Library komponen React untuk menggambar diagram jaringan (dibangun dengan Webpack)
- `packages/fossflow-app` - Progressive Web App untuk membuat diagram isometrik (dibangun dengan RSBuild)

### Perintah Pengembangan

```bash
# Pengembangan
npm run dev          # Mulai development server aplikasi
npm run dev:lib      # Mode watch untuk pengembangan library

# Build
npm run build        # Build library dan aplikasi
npm run build:lib    # Build library saja
npm run build:app    # Build aplikasi saja

# Testing & Linting
npm test             # Jalankan unit test
npm run lint         # Periksa error linting

# E2E Tests (Selenium)
cd e2e-tests
./run-tests.sh       # Jalankan end-to-end tests (memerlukan Docker & Python)

# Publishing
npm run publish:lib  # Publish library ke npm
```

## Cara Menggunakan

### Membuat Diagram

1. **Tambahkan Item**:
   - Tekan tombol "+" di menu kanan atas, library komponen akan muncul di kiri
   - Seret dan lepas komponen dari library ke kanvas
   - Atau klik kanan pada grid dan pilih "Add node"

2. **Hubungkan Item**: 
   - Pilih alat Konektor (tekan 'C' atau klik ikon konektor)
   - **Mode klik** (default): Klik node pertama, lalu klik node kedua
   - **Mode seret** (opsional): Klik dan seret dari node pertama ke node kedua
   - Beralih mode di Pengaturan → tab Konektor

3. **Simpan Pekerjaan Anda**:
   - **Simpan Cepat** - Menyimpan ke sesi browser
   - **Ekspor** - Unduh sebagai file JSON
   - **Impor** - Muat dari file JSON

### Opsi Penyimpanan

- **Penyimpanan Sesi**: Simpan sementara yang dihapus saat browser ditutup
- **Ekspor/Impor**: Penyimpanan permanen sebagai file JSON
- **Auto-Save**: Secara otomatis menyimpan perubahan setiap 5 detik ke sesi

## Berkontribusi

Kami menyambut kontribusi! Silakan lihat [CONTRIBUTORS.md](../CONTRIBUTORS.md) untuk panduan.

## Dokumentasi

- [FOSSFLOW_ENCYCLOPEDIA.md](../FOSSFLOW_ENCYCLOPEDIA.md) - Panduan lengkap untuk codebase
- [CONTRIBUTORS.md](../CONTRIBUTORS.md) - Panduan kontribusi

## Lisensi

MIT

