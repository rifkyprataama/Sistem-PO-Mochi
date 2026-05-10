# 🛒 Sistem Informasi Manajemen Pre-Order (PO) UMKM

Aplikasi *Full-Stack E-Commerce* berbasis Web yang dirancang khusus untuk mengelola sistem penjualan dengan model *Pre-Order* (PO). Sistem ini memisahkan hak akses antara Pelanggan Publik dan Admin Toko, dilengkapi dengan manajemen jadwal PO otomatis, kalkulasi DP (Uang Muka), verifikasi pembayaran melalui unggah struk, hingga moderasi ulasan pelanggan berbasis nomor invoice.

---

## 🛠️ Teknologi yang Digunakan
* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite, Lucide React (Icons), SweetAlert2.
* **Backend:** Node.js, Express.js, TypeScript, Multer (File Upload Handling).
* **Database:** MySQL, Prisma ORM (Sebagai sistem migrasi database otomatis).

---

## ⚙️ Persyaratan Sistem (Prerequisites)
Sebelum menjalankan aplikasi ini, pastikan komputer Anda sudah terinstal:
1.  **Node.js** (Versi 18 atau terbaru).
2.  **XAMPP** (Atau aplikasi database MySQL lainnya).

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi (Mode Development)

Aplikasi ini terdiri dari dua bagian yang harus berjalan bersamaan. Buka dua terminal terpisah di VS Code Anda.

### TAHAP 1: Konfigurasi Database & Backend (Terminal 1)

1.  Nyalakan modul **MySQL** dan **Apache** pada aplikasi XAMPP Anda.
2.  Buka browser, akses `http://localhost/phpmyadmin`, lalu **buat database kosong baru** dengan nama: `sistem_po_umkm`.
3.  Buka Terminal pertama di VS Code, arahkan ke folder backend:
    ```bash
    cd backend-preorder
    ```
4.  Instal semua library yang dibutuhkan:
    ```bash
    npm install
    ```
5.  **PENTING:** Pastikan folder `uploads` sudah ada di dalam folder `backend-preorder` (sejajar dengan folder `src`). Folder ini sudah dilengkapi file `.gitkeep` agar strukturnya terbawa saat di-*clone*, namun isinya diabaikan oleh Git.

6.  **Bangun Struktur Tabel Database:** Jalankan perintah ini agar Prisma membaca skema dan mencetak seluruh tabel ke MySQL Anda secara otomatis (Tanpa perlu import SQL manual):
    ```bash
    npx prisma generate
    npx prisma db push
    ```
7.  Jalankan server Backend:
    ```bash
    npm run dev
    ```

### TAHAP 2: Konfigurasi Frontend (Terminal 2)

1.  Buka Terminal kedua di VS Code, arahkan ke folder frontend:
    ```bash
    cd frontend-preorder
    ```
2.  Instal semua library pendukung:
    ```bash
    npm install
    ```
3.  Jalankan server Frontend:
    ```bash
    npm run dev
    ```
4.  Buka browser dan akses aplikasi pada: **`http://localhost:5173`**

---