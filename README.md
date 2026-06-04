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
