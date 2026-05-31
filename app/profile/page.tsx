import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId, readSessionUserId } from "@/lib/auth";

type ProfileSearchParams = {
  error?: string | string[];
  success?: string | string[];
};

const TIME_ZONE = "Asia/Jakarta";

function normalizeParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseDuration(value?: string) {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("per bulan") || normalized.includes("perbulan")) {
    return { amount: 1, unit: "month" as const };
  }
  if (normalized.includes("per tahun") || normalized.includes("pertahun")) {
    return { amount: 1, unit: "year" as const };
  }
  const match = normalized.match(/(\d+)\s*(bulan|month|tahun|year)/);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2];
  if (!amount || Number.isNaN(amount)) return null;
  if (unit === "bulan" || unit === "month") {
    return { amount, unit: "month" as const };
  }
  return { amount, unit: "year" as const };
}

function addDuration(date: Date, duration: { amount: number; unit: "month" | "year" }) {
  if (duration.unit === "month") {
    return new Date(date.getFullYear(), date.getMonth() + duration.amount, date.getDate());
  }
  return new Date(date.getFullYear() + duration.amount, date.getMonth(), date.getDate());
}

function formatDate(value: Date) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(value);
  const lookup: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });
  return `${lookup.day}-${lookup.month}-${lookup.year}`;
}

function startOfDayInTimeZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const lookup: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });
  const year = Number(lookup.year);
  const month = Number(lookup.month);
  const day = Number(lookup.day);
  return new Date(year, month - 1, day);
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<ProfileSearchParams>;
}) {
  const userId = await readSessionUserId();
  if (!userId) {
    const employeeId = await readEmployeeSessionId();
    if (employeeId) {
      redirect("/dashboard_karyawan/profile");
    }
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/login");
  }
  const resolvedSearchParams = await searchParams;
  const error = normalizeParam(resolvedSearchParams?.error);
  const success = normalizeParam(resolvedSearchParams?.success);
  const message =
    success === "2"
      ? "Password berhasil dibuat."
      : success === "1"
        ? "Password berhasil diubah."
      : error === "1"
        ? "Lengkapi semua field password."
        : error === "2"
          ? "Konfirmasi password tidak sama."
        : error === "3"
            ? "Password lama salah."
            : null;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { category: true } } },
  });
  const productLinks: Record<string, string> = {
    "Big Assistant": "/produk/big-assistant",
    "Big Legal": "/produk/big-legal",
    "Big Social": "/produk/big-social",
    "Big Vision": "/produk/big-vision",
  };
  const today = startOfDayInTimeZone(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7ff] to-[#f6f7fb] px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-[#d7e1ff] bg-gradient-to-r from-[#1e3a8a] via-[#2a46e6] to-[#3b82f6] px-5 py-4 text-white shadow-[0_14px_34px_rgba(30,58,138,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#dbe7ff]">
                Akun Pengguna
              </p>
              <h2 className="text-lg font-semibold">Pusat Profil & Keamanan</h2>
            </div>
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {user.fullName}
            </div>
          </div>
        </header>

        <div className="rounded-3xl border border-[#dbe3ff] bg-white p-6 shadow-[0_16px_36px_rgba(23,37,84,0.08)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-[#172554]">
                Detail Profil
              </h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Kelola data akun dan keamanan profil Anda.
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center rounded-xl border border-[#ccd7ff] bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#2a3ad7] transition hover:bg-[#dfe7ff]"
            >
              {"< Kembali"}
            </a>
          </div>
          {message ? (
            <p
              className={`profile-message ${
                success === "1" ? "success" : "error"
              }`}
            >
              {message}
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e2e8ff] bg-[#f8faff] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a8a]">
                Nama Lengkap
              </p>
              <p className="mt-1 text-base font-semibold text-[#0f172a]">
                {user.fullName}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e2e8ff] bg-[#f8faff] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a8a]">
                Email
              </p>
              <p className="mt-1 text-base font-semibold text-[#0f172a]">
                {user.email}
              </p>
            </div>
          </div>
          <form
            className="profile-password-form mt-6 rounded-2xl border border-[#e2e8ff] bg-white p-4 md:p-5"
            method="post"
            action="/api/profile/password"
          >
            <h2 className="text-sm font-semibold text-[#1f1f1f]">
              {user.hasLocalPassword ? "Ubah Password" : "Set Password"}
            </h2>
            {user.hasLocalPassword ? (
              <label>
                Password Lama
                <input name="currentPassword" type="password" required />
              </label>
            ) : (
              <p className="text-xs text-[#6b6b6b]">
                Akun Google belum memiliki password lokal. Silakan set password
                baru di bawah ini.
              </p>
            )}
            <label>
              Password Baru
              <input name="newPassword" type="password" required />
            </label>
            <label>
              Konfirmasi Password Baru
              <input name="confirmPassword" type="password" required />
            </label>
            <div className="profile-password-actions">
              <button type="submit">{user.hasLocalPassword ? "Simpan Perubahan" : "Simpan Password"}</button>
            </div>
          </form>
        </div>
        <div className="rounded-3xl border border-[#dbe3ff] bg-white p-6 shadow-[0_16px_36px_rgba(23,37,84,0.08)] md:p-8">
          <h2 className="text-lg font-semibold text-[#172554]">Daftar Pesanan</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-[#6b6b6b]">
              Belum ada pesanan.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#d9e1fb]">
              <div className="grid grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr] gap-3 bg-[#f3f6ff] px-4 py-3 text-xs font-semibold text-[#5b6885]">
                <span>ORDER ID</span>
                <span>PRODUK</span>
                <span>STATUS</span>
                <span>MASA AKTIF</span>
                <span>AKSI</span>
              </div>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr] gap-3 border-t border-[#e4e9fa] px-4 py-3 text-sm text-[#2b2f3b]"
                >
                  <span>{order.id}</span>
                  <span>
                    {order.product?.namaProduk ?? order.productId}
                  </span>
                  <span className="inline-flex h-fit w-fit rounded-full bg-[#eef2ff] px-2 py-1 text-xs font-semibold text-[#2a3ad7]">
                    {order.statusPesanan}
                  </span>
                  <span>
                    {(() => {
                      const durationRaw = order.product?.durasiProduk;
                      const duration = parseDuration(durationRaw);
                      if (!duration) return "-";
                      const endDate = addDuration(order.createdAt, duration);
                      return formatDate(endDate);
                    })()}
                  </span>
                  <span>
                    {(() => {
                      const durationRaw = order.product?.durasiProduk;
                      const duration = parseDuration(durationRaw);
                      if (!duration || order.statusPesanan !== "Done") return "-";
                      const endDate = addDuration(order.createdAt, duration);
                      if (endDate >= today) return "-";
                      return (
                        <a
                          className="inline-flex items-center rounded-md border border-[#2a3ad7] px-3 py-1 text-xs font-semibold text-[#2a3ad7]"
                          href={productLinks[order.product?.category.categoryName ?? ""] ?? "/produk"}
                        >
                          Pesan Lagi
                        </a>
                      );
                    })()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

