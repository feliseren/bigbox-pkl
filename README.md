# BigBox PKL

## Menjalankan Ulang Project

Setelah `git pull`, jalankan:

```bash
npm install
npm run setup-local
npm run dev
```

## Keterangan

- `npm run setup-local` menjalankan:
  - `prisma db push`
  - `prisma generate`
- `.env.local` wajib tetap ada di mesin lokal dan tidak ikut ke Git
- Pastikan `DATABASE_URL` mengarah ke database yang sama dengan yang dipakai di DBeaver

## Jika `next dev` terkunci

Kalau muncul error lock:

```powershell
Remove-Item .next\dev\lock -Force
```

lalu jalankan lagi:

```bash
npm run dev
```

## Deploy

Project ini memakai `Next.js + Prisma + MySQL` dan saat ini upload file masih disimpan ke folder lokal server di `public/uploads`.

Pilihan deploy yang paling aman saat ini:

- `Railway`: cocok kalau ingin deploy cepat tanpa ubah mekanisme upload.
- `VPS + PM2/Nginx`: cocok kalau ingin kontrol penuh atas server dan file upload.

Kalau ingin memakai `Vercel`, sebaiknya pindahkan upload file dari filesystem lokal ke object storage seperti:

- `Cloudinary`
- `Amazon S3`
- `Supabase Storage`
- `Vercel Blob`

Checklist minimum sebelum deploy:

```bash
npm install
npm run build
```

Environment yang wajib tersedia di server:

- `DATABASE_URL`
- semua secret/email/oauth yang dipakai di `.env.local`

Untuk server yang mengakses database baru, jalankan juga:

```bash
npx prisma generate
npx prisma migrate deploy
```
