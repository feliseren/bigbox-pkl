import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

const popularNews = [
  { name: "Kementrian Perhubungan", views: "1.200k" },
  { name: "Kementrian Perhubungan", views: "800k" },
  { name: "Company Networking", views: "500k" },
];

const viewerBars = [20, 28, 35, 22, 18, 30, 26, 40, 32, 36, 38, 44];

const aiOrderColors = [
  { name: "Big Vision", color: "bg-[#5456ff]", hex: "#5456ff" },
  { name: "Big Social", color: "bg-[#7d87ff]", hex: "#7d87ff" },
  { name: "Big Assistant", color: "bg-[#b3b8ff]", hex: "#b3b8ff" },
  { name: "Big Legal", color: "bg-[#e0e3ff]", hex: "#e0e3ff" },
];

function parseCurrency(value: string) {
  const numeric = value.replace(/[^0-9]/g, "");
  const parsed = Number(numeric);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatRupiah(value: number) {
  if (!value) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatPrice(value: string) {
  return value.startsWith("Rp") ? value : `Rp ${value}`;
}

export default async function DashboardKaryawanPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
  const today = new Date();
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const startPrevWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 13,
  );
  const doneOrdersRange = await prisma.order.findMany({
    where: {
      statusPesanan: "Done",
      createdAt: { gte: startPrevWeek, lt: endOfToday },
    },
  });
  const doneOrdersAll = await prisma.order.findMany({
    where: { statusPesanan: "Done" },
  });
  const dailyTotals = new Map<string, number>();
  doneOrdersRange.forEach((order) => {
    const dateKey = new Date(order.createdAt);
    const key = `${dateKey.getFullYear()}-${String(
      dateKey.getMonth() + 1,
    ).padStart(2, "0")}-${String(dateKey.getDate()).padStart(2, "0")}`;
    const amount = parseCurrency(order.totalPesanan);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + amount);
  });
  const currentWeekRaw = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (6 - index),
    );
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const prevWeekRaw = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (13 - index),
    );
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const maxValue = Math.max(
    1,
    ...currentWeekRaw.map((item) => item.value),
    ...prevWeekRaw.map((item) => item.value),
  );
  const weeklyBars = currentWeekRaw.map((item, index) => {
    const prevItem = prevWeekRaw[index];
    const scale = (value: number) => Math.round((value / maxValue) * 70);
    return {
      day: item.date.getDate(),
      last6: scale(item.value),
      lastWeek: scale(prevItem?.value ?? 0),
    };
  });
  const currentWeekTotal = currentWeekRaw.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const prevWeekTotal = prevWeekRaw.reduce((sum, item) => sum + item.value, 0);
  const percentChange =
    prevWeekTotal > 0 ? ((currentWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0;
  const percentLabel = `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}%`;
  const percentColor = percentChange >= 0 ? "text-[#36a56d]" : "text-[#e32626]";
  const [bigAssistant, bigLegal, bigSocial, bigVision] = await Promise.all([
    prisma.bigAssistant.findMany(),
    prisma.bigLegal.findMany(),
    prisma.bigSocial.findMany(),
    prisma.bigVision.findMany(),
  ]);
  const productByKey = new Map<string, { name: string; price: string }>();
  bigAssistant.forEach((item) => {
    productByKey.set(`BIG_ASSISTANT:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
    });
  });
  bigLegal.forEach((item) => {
    productByKey.set(`BIG_LEGAL:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
    });
  });
  bigSocial.forEach((item) => {
    productByKey.set(`BIG_SOCIAL:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
    });
  });
  bigVision.forEach((item) => {
    productByKey.set(`BIG_VISION:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
    });
  });
  const productStats = new Map<
    string,
    { count: number; revenue: number; price: string; name: string }
  >();
  doneOrdersAll.forEach((order) => {
    const key = `${order.productType}:${order.productId}`;
    const product = productByKey.get(key);
    if (!product) return;
    const entry = productStats.get(key) ?? {
      count: 0,
      revenue: 0,
      price: product.price,
      name: product.name,
    };
    const unitPrice = parseCurrency(product.price);
    entry.count += 1;
    entry.revenue += unitPrice;
    productStats.set(key, entry);
  });
  const topProducts = Array.from(productStats.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => ({
      name: item.name,
      price: formatPrice(item.price),
      sold: String(item.count),
      revenue: formatRupiah(item.revenue),
    }));
  const totalOrders = doneOrdersAll.length;
  const aiOrderCounts = doneOrdersAll.reduce(
    (acc, order) => {
      acc[order.productType] += 1;
      return acc;
    },
    {
      BIG_ASSISTANT: 0,
      BIG_LEGAL: 0,
      BIG_SOCIAL: 0,
      BIG_VISION: 0,
    },
  );
  const aiOrders = aiOrderColors.map((item) => {
    const key =
      item.name === "Big Vision"
        ? "BIG_VISION"
        : item.name === "Big Social"
          ? "BIG_SOCIAL"
          : item.name === "Big Assistant"
            ? "BIG_ASSISTANT"
            : "BIG_LEGAL";
    const value = aiOrderCounts[key];
    return { ...item, value };
  });
  const aiDonutGradient = (() => {
    if (!totalOrders) {
      return "conic-gradient(#eef0ff 0 100%)";
    }
    let start = 0;
    const slices = aiOrderColors.map((item) => {
      const key =
        item.name === "Big Vision"
          ? "BIG_VISION"
          : item.name === "Big Social"
            ? "BIG_SOCIAL"
            : item.name === "Big Assistant"
              ? "BIG_ASSISTANT"
              : "BIG_LEGAL";
      const value = aiOrderCounts[key];
      const pct = (value / totalOrders) * 100;
      const from = start;
      const to = start + pct;
      start = to;
      return `${item.hex} ${from}% ${to}%`;
    });
    return `conic-gradient(${slices.join(", ")})`;
  })();
  return (
    <div className="min-h-screen bg-slate-100 text-[#24262d]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] flex-col bg-slate-100 px-6 py-6 md:flex">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={150}
              height={48}
              className="h-8 w-auto"
            />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#9aa0b4]">
            Menu
          </p>
          <nav className="space-y-2 text-sm font-medium text-[#6b7185]">
            <a
              className="flex items-center gap-2 rounded-lg bg-[#e6e9fb] px-3 py-2 text-[#2a3ad7]"
              href="/dashboard_karyawan"
            >
              <span className="h-2 w-2 rounded-full bg-[#2a3ad7]" />
              Dashboard
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              href="/dashboard_karyawan/daftar-produk"
            >
              <span className="h-2 w-2 rounded-full bg-[#cbd0e5]" />
              Daftar Produk
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              href="/dashboard_karyawan/daftar-projek"
            >
              <span className="h-2 w-2 rounded-full bg-[#cbd0e5]" />
              Daftar Projek
            </a>
            <a className="flex items-center gap-2 rounded-lg px-3 py-2" href="#">
              <span className="h-2 w-2 rounded-full bg-[#cbd0e5]" />
              Success History
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              href="/dashboard_karyawan/daftar-pemesanan"
            >
              <span className="h-2 w-2 rounded-full bg-[#cbd0e5]" />
              Daftar Pemesanan
            </a>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div className="text-lg font-semibold text-[#1f2430]">
              Dashboard
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4a4f60]">
              <span className="rounded-full bg-indigo-100 px-3 py-1">
                {employee?.fullName ?? "Karyawan"}
              </span>
              <span className="h-8 w-8 rounded-full bg-[#ffd9b3]" />
            </div>
          </header>

          <main className="px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8092]">Pendapatan Mingguan</p>
                    <p className="mt-2 text-xl font-semibold">
                      {formatRupiah(currentWeekTotal)}
                    </p>
                    <p className={`mt-1 text-xs ${percentColor}`}>
                      {percentLabel} vs last week
                    </p>
                  </div>
                  <button className="rounded-lg border border-[#e6e9f5] px-3 py-1 text-xs text-[#4a4f60]">
                    View Report
                  </button>
                </div>
                <div className="relative mt-6">
                  <div className="absolute inset-0 grid grid-rows-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="border-b border-dashed border-slate-200"
                      />
                    ))}
                  </div>
                  <div className="relative flex items-end gap-4">
                    {weeklyBars.map((bar) => (
                      <div key={bar.day} className="flex flex-col items-center">
                        <div className="flex items-end gap-2">
                          <div
                            className="w-2 rounded-full bg-[#5256ff]"
                            style={{ height: `${bar.last6}px` }}
                          />
                          <div
                            className="w-2 rounded-full bg-slate-200"
                            style={{ height: `${bar.lastWeek}px` }}
                          />
                        </div>
                        <span className="mt-2 text-[10px] text-[#9aa0b4]">
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-[#8f95a8]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#5256ff]" />
                    Last 7 days
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    Last Week
                  </span>
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8092]">Total Viewers</p>
                    <p className="mt-2 text-xl font-semibold">65%</p>
                    <p className="mt-1 text-xs text-[#7a8092]">
                      Monthly Earning
                    </p>
                  </div>
                  <span className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-[#6b7185]">
                    Quarterly
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-36 w-36">
                    <div className="absolute inset-0 rounded-full border-[12px] border-[#eef0ff]" />
                    <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-[#ff4fa2] border-r-[#6f55ff]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-semibold text-[#2a2e3b]">
                        65%
                      </span>
                      <span className="text-xs text-[#7a8092]">
                        Total Viewers
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-[20px] bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Top 5 Products</h3>
                <div className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-[#6b7185]">
                  Last 5 weeks
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[40px_1.4fr_1fr_1fr_1fr] gap-3 bg-slate-50 px-4 py-2 text-[11px] font-semibold text-[#7a8092]">
                  <span>#</span>
                  <span>Nama Produk</span>
                  <span>Harga Produk</span>
                  <span>Jumlah Terjual</span>
                  <span>Total Pendapatan</span>
                </div>
                {topProducts.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="grid grid-cols-[40px_1.4fr_1fr_1fr_1fr] gap-3 border-t border-slate-200 px-4 py-3 text-xs text-[#2b2f3b]"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                    <span>{item.sold}</span>
                    <span>{item.revenue}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold">
                      Jenis AI Yang Dibeli
                    </h3>
                    <p className="text-xs text-[#7a8092]">
                      Total pesanan selesai: {totalOrders}
                    </p>
                  </div>
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-[#6b7185]">
                    View Report
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-40 w-40">
                    <div
                      className="ai-donut"
                      style={{ background: aiDonutGradient }}
                    />
                    <div className="ai-donut-center">
                      Total Order
                      <br />
                      {totalOrders}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#6b7185]">
                  {aiOrders.map((item) => (
                    <span
                      key={item.name}
                      className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
                    >
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.name} {item.value}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <h3 className="text-base font-semibold">Berita Terpopuler</h3>
                <div className="mt-4 space-y-4">
                  {popularNews.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2a2e3b]">
                        <span>{item.name}</span>
                        <span className="text-[#6b7185]">
                          {item.views} Dilihat
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div className="h-2 w-[70%] rounded-full bg-gradient-to-r from-[#ffb049] to-[#ff5d6c]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Grafik Viewers</h3>
                    <p className="text-xs text-[#7a8092]">Monthly Earning</p>
                  </div>
                  <span className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-[#6b7185]">
                    Quarterly
                  </span>
                </div>
                <div className="mt-6 flex items-end gap-2">
                  {viewerBars.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-5 rounded-full bg-[#5a3df0]"
                        style={{ height: `${value * 3}px` }}
                      />
                      <span className="mt-2 text-[10px] text-[#9aa0b4]">
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <h3 className="text-base font-semibold">User Feedbacks</h3>
                <p className="text-xs text-[#7a8092]">All Rating 5</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "5 Star", value: 80 },
                    { label: "4 Star", value: 60 },
                    { label: "3 Star", value: 40 },
                    { label: "2 Star", value: 25 },
                    { label: "1 Star", value: 10 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#6b7185]">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#ffb049] to-[#ff5d6c]"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

