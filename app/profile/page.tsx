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
  const [orders, bigAssistant, bigLegal, bigSocial, bigVision] = await Promise.all(
    [
      prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.bigAssistant.findMany(),
      prisma.bigLegal.findMany(),
      prisma.bigSocial.findMany(),
      prisma.bigVision.findMany(),
    ],
  );
  const productMaps: Record<
    "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION",
    Map<string, string>
  > = {
    BIG_ASSISTANT: new Map(bigAssistant.map((item) => [item.id, item.namaProduk])),
    BIG_LEGAL: new Map(bigLegal.map((item) => [item.id, item.namaProduk])),
    BIG_SOCIAL: new Map(bigSocial.map((item) => [item.id, item.namaProduk])),
    BIG_VISION: new Map(bigVision.map((item) => [item.id, item.namaProduk])),
  };
  const productDurations: Record<
    "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION",
    Map<string, string>
  > = {
    BIG_ASSISTANT: new Map(bigAssistant.map((item) => [item.id, item.durasiProduk])),
    BIG_LEGAL: new Map(bigLegal.map((item) => [item.id, item.durasiProduk])),
    BIG_SOCIAL: new Map(bigSocial.map((item) => [item.id, item.durasiProduk])),
    BIG_VISION: new Map(bigVision.map((item) => [item.id, item.durasiProduk])),
  };
  const productLinks: Record<
    "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION",
    string
  > = {
    BIG_ASSISTANT: "/produk/big-assistant",
    BIG_LEGAL: "/produk/big-legal",
    BIG_SOCIAL: "/produk/big-social",
    BIG_VISION: "/produk/big-vision",
  };
  const today = startOfDayInTimeZone(new Date());

  return (
    <div className="min-h-screen bg-[#f4f3f6] px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(18,16,29,0.12)]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#1f1f1f]">
              Detail Profil
            </h1>
            <a className="profile-back" href="/">
              Back
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
          <div className="mt-6 space-y-4 text-sm text-[#4a4a4a]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
                Nama Lengkap
              </p>
              <p className="text-base font-semibold text-[#1f1f1f]">
                {user.fullName}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
                Email
              </p>
              <p className="text-base font-semibold text-[#1f1f1f]">
                {user.email}
              </p>
            </div>
          </div>
          <form
            className="profile-password-form"
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
              <button type="submit">Ubah Password</button>
            </div>
          </form>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(18,16,29,0.12)]">
          <h2 className="text-lg font-semibold text-[#1f1f1f]">Daftar Pesanan</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-[#6b6b6b]">
              Belum ada pesanan.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr] gap-3 bg-slate-50 px-4 py-2 text-xs font-semibold text-[#7a8092]">
                <span>ORDER ID</span>
                <span>PRODUK</span>
                <span>STATUS</span>
                <span>MASA AKTIF</span>
                <span>AKSI</span>
              </div>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr] gap-3 border-t border-slate-200 px-4 py-3 text-sm text-[#2b2f3b]"
                >
                  <span>{order.id}</span>
                  <span>
                    {productMaps[order.productType].get(order.productId) ??
                      order.productId}
                  </span>
                  <span>{order.statusPesanan}</span>
                  <span>
                    {(() => {
                      const durationRaw =
                        productDurations[order.productType].get(order.productId);
                      const duration = parseDuration(durationRaw);
                      if (!duration) return "-";
                      const endDate = addDuration(order.createdAt, duration);
                      return formatDate(endDate);
                    })()}
                  </span>
                  <span>
                    {(() => {
                      const durationRaw =
                        productDurations[order.productType].get(order.productId);
                      const duration = parseDuration(durationRaw);
                      if (!duration || order.statusPesanan !== "Done") return "-";
                      const endDate = addDuration(order.createdAt, duration);
                      if (endDate >= today) return "-";
                      return (
                        <a
                          className="inline-flex items-center rounded-md border border-[#2a3ad7] px-3 py-1 text-xs font-semibold text-[#2a3ad7]"
                          href={productLinks[order.productType]}
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
