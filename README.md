# Wangiin - E-Commerce Parfum (Project Ujikom)
Ini adalah project web E-Commerce jualan parfum yang aku buat untuk tugas Uji Kompetensi. Web ini udah terintegrasi langsung sama payment gateway Xendit untuk proses pembayarannya.

---

## 1. User Guide (Cara Pakai Aplikasinya)

### Cara Daftar & Login
* **Buat akun baru:** Tinggal ke halaman Register, terus masukin Username, Email, sama Password.
* **Buat jadi Admin:** Buka database di phpMyAdmin (tabel `users`), cari akun yang baru dibuat, terus ganti `role`-nya dari 'customer' jadi 'admin'. Setelah itu tinggal login aja.

### Cara Belanja
1. Pilih parfum yang mau dibeli dari halaman Home atau halaman kategori.
2. Klik tombol Add to Cart.
3. Buka keranjang (Cart), isi form alamat pengiriman yang lengkap.
4. Klik tombol Payment. Nanti bakal langsung diarahkan ke halaman invoice Xendit buat bayar.
5. Kalau udah dibayar, otomatis status di Riwayat Pesanan bakal berubah jadi "PAID".

### Buat Admin
Kalau login pakai akun Admin, otomatis masuk ke Admin Panel. Di sini bisa nambahin produk baru, edit/hapus produk, sama ngecek riwayat pesanan dari customer yang udah masuk.
    
---

## 2. Technical Documentation

### Cara Jalanin Project di Lokal
1. Buka terminal di folder backend (`/parfum-shop/server`), ketik: `npm install` lalu jalankan server `nodemon server.js`.
2. Buka terminal satu lagi di folder frontend (`/frontend`), ketik: `npm install` lalu jalankan `npm run dev`.

### Setting Database & Environment (.env)
1. Bikin database di phpMyAdmin (contoh: `parfum_db`).
2. Di folder backend, duplikat file `.env.example` dan ubah namanya jadi `.env` aja.
3. Buka file `.env` itu, terus isi password database kalian sama `XENDIT_SECRET_KEY` dari dashboard Xendit masing-masing.

### Alur Webhook Xendit
* Webhook udah disetting di backend dengan endpoint `/api/payment/webhook`.
* Endpoint ini dipakai biar Xendit ngasih tau ke database kita kalau pembeli udah beneran transfer, jadi status orderannya bisa otomatis update.

### Flow Sistem Checkout
User masukin barang ke Cart -> Isi Alamat & Checkout -> Backend nge-hit API Xendit buat bikin Invoice -> User bayar pake VA Xendit -> Xendit ngirim Webhook ke Backend -> Status di database update jadi PAID.

### Struktur Database (Tabel yang dipakai)
* `users` (nyimpen data admin/customer)
* `categories` (kategori parfum)
* `products` (data parfum)
* `orders` (data transaksi/checkout)
* `order_items` (detail barang apa aja yang dibeli)