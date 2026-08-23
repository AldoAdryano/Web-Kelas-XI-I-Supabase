# Web Kelas XI-I (Supabase Edition)

Web Kelas adalah platform yang bertujuan untuk menyediakan informasi tentang kelas kami. Proyek ini merupakan hasil *fork* dan modifikasi dari versi aslinya, di mana sistem *backend* telah dimigrasikan sepenuhnya dari Firebase ke **Supabase**, serta menambahkan fitur Admin Dashboard dinamis.

## 🚀 Fitur Utama
- **Text Anonim:** Pengunjung dapat mengirim pesan ke *live chat* kelas tanpa mengungkapkan identitas mereka. Dilengkapi perlindungan dari *spam*.
- **Gallery:** Menampilkan gambar-gambar menarik kegiatan kelas. Mendukung sistem *request* upload gambar yang harus disetujui admin.
- **Structure & Schedule Dinamis:** Menampilkan struktur organisasi dan jadwal pelajaran yang datanya diambil dari *database* secara *realtime*.
- **Admin Dashboard:** Halaman khusus (`/admin`) untuk mengelola chat (hapus pesan), menyetujui/menolak foto galeri, serta mengubah jadwal dan struktur kelas tanpa perlu membongkar kode.

## 🛠️ Teknologi yang Digunakan
- **Frontend:** React JS, Vite, Tailwind CSS, Material-UI (MUI), AOS (Animasi), Slick JS.
- **Backend & Database:** [Supabase](https://supabase.com) (PostgreSQL, Storage, Auth).

---

## 📖 Cara Menjalankan di Komputer Anda (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan *website* ini di komputer Anda:

### 1. Kloning Repositori
```bash
git clone https://github.com/UsernameAnda/Web-Kelas-XI-I-Supabase.git
cd Web-Kelas-XI-I-Supabase
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Supabase
Karena *website* ini menggunakan Supabase, Anda memerlukan proyek Supabase baru.
1. Buat proyek baru di [Supabase Dashboard](https://database.new).
2. Dapatkan **Project URL** dan **Anon/Public Key** dari menu *Project Settings* -> *API*.
3. Salin file `.env.example` menjadi `.env.local` di *folder* proyek Anda:
```bash
cp .env.example .env.local
```
4. Buka `.env.local` dan masukkan kunci API Anda:
```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

### 4. Menyiapkan Database (Migrasi SQL)
Buka menu **SQL Editor** di Dashboard Supabase Anda, lalu *copy-paste* dan jalankan semua file SQL yang ada di dalam *folder* `supabase/migrations/` secara berurutan:
1. `001_initial_schema.sql` (Membuat tabel awal)
2. `002_rls_policies.sql` (Aturan keamanan dasar)
3. `003_storage_policies.sql` (Membuat *bucket* galeri)
4. `004_schedule_admin.sql` (Tabel jadwal dan struktur)
5. `005_admin_storage_policies.sql` (Akses admin ke galeri)
6. `006_class_structure.sql` (Tabel struktur organisasi)

### 5. Menyiapkan Akun Admin
1. Buka menu **Authentication** -> **Users** di Supabase.
2. Tambahkan user baru (Email & Password). Akun ini akan digunakan untuk login di halaman `/admin`.

### 6. Jalankan Server
```bash
npm run dev
```
Buka `http://localhost:5173` di *browser* Anda! Halaman admin dapat diakses di `http://localhost:5173/admin`.

---

## 🙏 Kredit & Penghargaan

Proyek ini pada asalnya (*template* awal, desain antarmuka, dan ide) dibuat oleh:
- **Eki**
- **Dafy**

*Website* versi asli (menggunakan Firebase) dapat dikunjungi di [https://xitkj3.vercel.app/](https://xitkj3.vercel.app/). 

Versi modifikasi (*Supabase Edition* dengan penambahan Admin Dashboard & Struktur Dinamis) dikembangkan dan dikelola oleh **Aldo Adryano**. 
*Website* versi modifikasi ini dapat dikunjungi di: [https://xi-i.vercel.app/](https://xi-i.vercel.app/)

Sangat dihargai apabila Anda ingin menggunakan proyek ini untuk kelas Anda, harap tetap menyertakan kredit kepada pencipta aslinya maupun kontributor versi ini dalam penggunaan Anda. Terima kasih! 🙏
