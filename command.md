# Perintah Claude Code — Prototipe Espresso Italia (siap deploy ke Vercel)

Panduan langkah demi langkah memerintah Claude Code (CLI) membangun prototipe yang bisa
di-hosting di **Vercel**, memakai **Prisma Postgres** sebagai database dan **Vercel Blob**
untuk gambar. `CLAUDE.md` menjadi konteks proyek. Anda boleh mengetik perintah dalam Bahasa
Indonesia — semuanya dimengerti.

---

## A. Persiapan (sekali saja)

Prasyarat: **Node.js 18+**, **npm**, akun **Vercel** (gratis), dan akun **Prisma** (untuk
Prisma Postgres — gratis). Tidak perlu Docker.

```bash
# 1) Pasang Claude Code (detail terbaru: docs.claude.com/en/docs/claude-code)
npm install -g @anthropic-ai/claude-code

# 2) Buat folder proyek & masuk
mkdir espresso-italia && cd espresso-italia

# 3) Salin file CLAUDE.md (yang saya buatkan) ke dalam folder ini

# 4) Siapkan database Prisma Postgres (gratis), salah satu cara:
#    - Lewat Vercel: Dashboard > Storage > Create > Prisma Postgres (integrasi 1-klik), atau
#    - Lewat Prisma Console (console.prisma.io) > buat Prisma Postgres > salin connection string
#    Simpan connection string untuk DATABASE_URL nanti.

# 5) Jalankan Claude Code di folder proyek
claude
```

Claude Code membaca `CLAUDE.md` otomatis tiap sesi. Tips: tekan **Tab** untuk *plan mode* pada
langkah besar, tinjau rencananya, lalu setujui.

---

## B. Rangkaian perintah (tempel satu per satu)

Kerjakan berurutan. Setelah tiap langkah, biarkan Claude menjalankan aplikasinya, perbaiki error,
lalu minta *commit*.

### 1 — Scaffold & fondasi (Vercel-ready)
```
Baca CLAUDE.md, lalu buat fondasi proyek sesuai spesifikasi di sana: inisialisasi Nuxt 3 +
TypeScript, pasang Tailwind dan daftarkan design tokens (warna & font) di config. Siapkan
Prisma dengan provider postgresql untuk Prisma Postgres, buat Prisma client singleton di
server/utils/prisma.ts, tambahkan "postinstall": "prisma generate" dan build "prisma generate
&& nuxt build". Buat .env.example berisi DATABASE_URL, BLOB_READ_WRITE_TOKEN, dan
NUXT_SESSION_PASSWORD. Pastikan proyek siap di-deploy ke Vercel (preset Nitro vercel otomatis).
Belum perlu halaman — cukup pastikan `pnpm dev` jalan & Tailwind aktif. Tunjukkan rencana dulu.
```

### 2 — Skema database & seed
```
Buat prisma/schema.prisma untuk semua model di Bagian 4 CLAUDE.md (Postgres), jalankan migrate,
lalu buat prisma/seed.ts berisi data contoh: ~8 produk di 4 kategori (Coffee, Gelato, Kitchen,
Other), 3 artikel, 1 kelas gelato beserta sesinya, home sections, settings, dan satu akun OWNER.
Jalankan seed dan tampilkan ringkasannya. Pakai DATABASE_URL dari Prisma Postgres.
```

### 3 — Situs publik
```
Bangun halaman publik (SSR, responsif, dengan useSeoMeta): Beranda (hero + produk unggulan +
artikel terbaru), Katalog Produk dengan filter kategori & pencarian, Detail Produk, daftar Blog,
dan detail Artikel. Ambil data lewat server/api dari database. Ikuti design tokens & tema kopi.
```

### 4 — Dashboard admin & login
```
Bangun area /admin: halaman login (akun dari tabel User, sesi cookie via nuxt-auth-utils dengan
NUXT_SESSION_PASSWORD, bcrypt), penjaga rute agar hanya yang login bisa masuk, dan layout
dashboard dengan sidebar gelap berisi modul: Produk, Artikel, Promo & Event, Section Beranda,
Kelas Gelato, Media, Pengaturan, Pengguna. Dashboard menampilkan ringkasan (jumlah produk, dll).
```

### 5 — Modul Produk (CRUD penuh, upload ke Vercel Blob)
```
Lengkapi modul Produk di admin: tampilan DAFTAR (pencarian, filter kategori, status tayang/draf,
tombol tambah/edit/hapus) dan FORM EDIT (nama, kategori, brand, deskripsi singkat, deskripsi
lengkap dengan editor WYSIWYG Tiptap, spesifikasi, unggah galeri gambar memakai @vercel/blob
(simpan URL hasilnya ke tabel Media — jangan tulis ke filesystem), kolom SEO meta, dan tombol
Simpan Draf / Terbitkan). Setelah Terbitkan, produk langsung tampil di katalog & detail publik.
```

### 6 — Modul Artikel (CRUD penuh)
```
Bangun modul Artikel seperti Produk: daftar + form dengan editor WYSIWYG, gambar sampul (unggah
via @vercel/blob), kategori, dan status draf/terbit. Artikel terbit muncul di Blog publik dan di
"artikel terbaru" pada Beranda.
```

### 7 — Rapikan, deploy-ready & dokumentasi
```
Modul lain (Promo & Event, Section Beranda, Kelas Gelato, Media, Pengaturan, Pengguna) cukup
tampilkan placeholder "Segera hadir" di dashboard. Pastikan responsif di mobile, perbaiki sisa
error. Pastikan proyek deploy-ready untuk Vercel: build menjalankan prisma generate, skema
diterapkan via `prisma migrate deploy`, dan upload memakai Vercel Blob. Tulis README.md: cara
setup lokal, langkah deploy ke Vercel, akun login hasil seed, dan apa yang sudah/belum dibangun.
```

---

## C. Deploy ke Vercel (setelah prototipe jalan lokal)

```
1) Push kode ke GitHub (minta Claude: "buat repo git & commit, lalu beri instruksi push").
2) Di Vercel: New Project > import repo GitHub tadi.
3) Storage > Create > Prisma Postgres (integrasi 1-klik) — ini mengisi DATABASE_URL otomatis.
   Buat juga Blob Store (Storage > Blob) — ini mengisi BLOB_READ_WRITE_TOKEN.
   Tambahkan Environment Variable NUXT_SESSION_PASSWORD (string acak >= 32 karakter).
4) Pastikan Build Command menjalankan `prisma generate` (& `prisma migrate deploy`).
5) Deploy. Setelah live, jalankan seed sekali (lewat skrip/endpoint seed) agar demo berisi konten.
6) Bagikan URL Vercel-nya ke klien sebagai lampiran proposal.
```

Minta bantuan Claude bila perlu: `Tuliskan langkah deploy ke Vercel + cara set environment
variables (DATABASE_URL, BLOB_READ_WRITE_TOKEN, NUXT_SESSION_PASSWORD) ke dalam README.`

---

## D. Tips memerintah Claude Code

- **Plan dulu untuk langkah besar:** tekan Tab (plan mode), tinjau, baru setujui.
- **Tinjau perubahan:** Claude menampilkan diff & minta izin sebelum mengubah file / menjalankan
  perintah — baca sekilas sebelum menyetujui.
- **Perbaikan kecil cukup kalimat biasa:** mis. "tombol Terbitkan harusnya caramel, bukan coklat".
- **Jika menyimpang dari spesifikasi:** ingatkan "ikuti CLAUDE.md bagian X".
- **Simpan progres:** "commit perubahan ini dengan pesan conventional commit".
- **Aturan permanen baru:** ketik diawali `#` lalu kalimatnya — Claude menawarkan menyimpan ke CLAUDE.md.

---

## E. (Opsional) Perintah kustom yang bisa dipakai ulang

Buat file `.claude/commands/build-module.md` agar bisa memanggil `/build-module <nama>`:

```markdown
Bangun modul admin "$ARGUMENTS" mengikuti pola modul Produk yang sudah ada: tampilan daftar
(pencarian, filter, status, aksi tambah/edit/hapus) dan form edit (field sesuai model terkait di
prisma/schema.prisma, editor WYSIWYG bila ada konten panjang, unggah gambar via @vercel/blob bila
perlu, kolom SEO, status draf/terbit). Konsisten dengan design tokens & konvensi di CLAUDE.md.
Tampilkan rencana dulu.
```

Lalu di Claude Code cukup ketik, misalnya: `/build-module Promo & Event`.