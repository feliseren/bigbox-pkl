import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";

const aiOrderColors = [
  { name: "Big Vision", color: "bg-[#5456ff]", hex: "#5456ff" },
  { name: "Big Social", color: "bg-[#7d87ff]", hex: "#7d87ff" },
  { name: "Big Assistant", color: "bg-[#b3b8ff]", hex: "#b3b8ff" },
  { name: "Big Legal", color: "bg-[#e0e3ff]", hex: "#e0e3ff" },
];
const TIME_ZONE = "Asia/Jakarta";
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDatePartsInTimeZone(date: Date) {
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
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  };
}

function dateKeyInTimeZone(date: Date) {
  const { year, month, day } = getDatePartsInTimeZone(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function startOfDayInTimeZone(date: Date) {
  const { year, month, day } = getDatePartsInTimeZone(date);
  return new Date(year, month - 1, day);
}

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
  const today = startOfDayInTimeZone(new Date());
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
  const dailyCounts = new Map<string, number>();
  doneOrdersRange.forEach((order) => {
    const key = dateKeyInTimeZone(order.createdAt);
    const amount = parseCurrency(order.totalPesanan);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + amount);
    dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
  });
  const viewLogs = await prisma.newsView.findMany({
    where: {
      createdAt: { gte: startPrevWeek, lt: endOfToday },
    },
    select: { createdAt: true },
  });
  const viewCountsByDay = new Map<string, number>();
  viewLogs.forEach((view) => {
    const key = dateKeyInTimeZone(view.createdAt);
    viewCountsByDay.set(key, (viewCountsByDay.get(key) ?? 0) + 1);
  });
  const currentWeekRaw = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (6 - index),
    );
    const key = dateKeyInTimeZone(date);
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const prevWeekRaw = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (13 - index),
    );
    const key = dateKeyInTimeZone(date);
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const currentWeekViewerTotal = Array.from({ length: 7 }).reduce(
    (sum, _, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (6 - index),
      );
      const key = dateKeyInTimeZone(date);
      return sum + (viewCountsByDay.get(key) ?? 0);
    },
    0,
  );
  const prevWeekViewerTotal = Array.from({ length: 7 }).reduce(
    (sum, _, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (13 - index),
      );
      const key = dateKeyInTimeZone(date);
      return sum + (viewCountsByDay.get(key) ?? 0);
    },
    0,
  );
  const viewerPercentChange =
    prevWeekViewerTotal > 0
      ? ((currentWeekViewerTotal - prevWeekViewerTotal) / prevWeekViewerTotal) * 100
      : 0;
  const viewerPercentLabel = `${viewerPercentChange >= 0 ? "+" : ""}${viewerPercentChange.toFixed(1)}%`;
  const viewerPercentColor =
    viewerPercentChange >= 0 ? "text-[#36a56d]" : "text-[#e32626]";
  const viewerBarScale = Math.max(currentWeekViewerTotal, prevWeekViewerTotal, 1);
  const viewerCurrentHeight = Math.round((currentWeekViewerTotal / viewerBarScale) * 100);
  const viewerPrevHeight = Math.round((prevWeekViewerTotal / viewerBarScale) * 100);
  const maxValue = Math.max(
    1,
    ...currentWeekRaw.map((item) => item.value),
    ...prevWeekRaw.map((item) => item.value),
  );
  const weeklyBars = currentWeekRaw.map((item, index) => {
    const scale = (value: number) => {
      if (value <= 0) return 4;
      return Math.max(8, Math.round((value / maxValue) * 90));
    };
    return {
      day: getDatePartsInTimeZone(item.date).day,
      last6: scale(item.value),
      value: item.value,
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
  const popularNews = await prisma.newsStory.findMany({
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, title: true, viewCount: true },
  });
  const maxPopularViews = Math.max(
    1,
    ...popularNews.map((item) => item.viewCount),
  );
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const yearEnd = new Date(today.getFullYear() + 1, 0, 1);
  const yearViews = await prisma.newsView.findMany({
    where: { createdAt: { gte: yearStart, lt: yearEnd } },
    select: { createdAt: true },
  });
  const monthlyCounts = Array.from({ length: 12 }, () => 0);
  yearViews.forEach((view) => {
    const { month } = getDatePartsInTimeZone(view.createdAt);
    const index = month - 1;
    if (index >= 0 && index < 12) {
      monthlyCounts[index] += 1;
    }
  });
  const maxMonthlyViews = Math.max(1, ...monthlyCounts);
  const reviewCounts = await prisma.review.groupBy({
    by: ["rating"],
    _count: { rating: true },
  });
  const totalReviews = reviewCounts.reduce(
    (sum, item) => sum + item._count.rating,
    0,
  );
  const reviewSummary = [5, 4, 3, 2, 1].map((rating) => {
    const found = reviewCounts.find((item) => item.rating === rating);
    const count = found ? found._count.rating : 0;
    const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return {
      label: `${rating} Star`,
      count,
      percent,
    };
  });
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
    <div className="project-layout">
      <div className="project-shell">
        <EmployeeSidebar active="dashboard" />

        <div className="project-main">
          <header className="project-header">
            <div>
              <h1 className="project-title">Dashboard</h1>
              <p className="project-subtitle">Ringkasan aktivitas utama hari ini.</p>
            </div>
            <EmployeeProfileMenu
              fullName={employee?.fullName ?? "Karyawan"}
              employeeId={employee?.id ?? "-"}
            />
          </header>

          <main className="project-content">
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
                  <a
                    className="rounded-lg border border-[#e6e9f5] px-3 py-1 text-xs text-[#4a4f60]"
                    href="/api/reports/weekly-revenue"
                  >
                    View Report
                  </a>
                </div>
                <div className="relative mt-6 rounded-2xl bg-slate-50/80 px-3 py-4">
                  <div className="absolute inset-0 grid grid-rows-4 gap-6 px-3 py-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="border-b border-dashed border-slate-200"
                      />
                    ))}
                  </div>
                  <div className="relative flex items-end justify-between px-3 py-4">
                    {weeklyBars.map((bar) => (
                      <div
                        key={bar.day}
                        className="flex flex-1 flex-col items-center"
                      >
                        <div className="group relative flex h-32 items-end">
                          <div
                            className="w-3 rounded-full bg-gradient-to-t from-[#4249ff] to-[#7f86ff] shadow-[0_6px_14px_rgba(82,86,255,0.35)]"
                            style={{ height: `${bar.last6}px` }}
                          />
                          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[#1f2430] px-3 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            {formatRupiah(bar.value)}
                          </span>
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
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8092]">Total Viewers Mingguan</p>
                    <p className="mt-2 text-xl font-semibold">
                      {currentWeekViewerTotal}
                    </p>
                    <p className={`mt-1 text-xs ${viewerPercentColor}`}>
                      {viewerPercentLabel} vs minggu lalu
                    </p>
                  </div>
                  <span className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-[#6b7185]">
                    Mingguan
                  </span>
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50/80 px-4 py-6">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-32 items-end">
                        <div
                          className="w-10 rounded-full bg-gradient-to-t from-[#4249ff] to-[#7f86ff] shadow-[0_6px_14px_rgba(82,86,255,0.35)]"
                          style={{ height: `${viewerCurrentHeight}px` }}
                        />
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#4a4f60] shadow-sm">
                        Minggu ini
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-32 items-end">
                        <div
                          className="w-10 rounded-full bg-gradient-to-t from-[#cfd5ff] to-[#eef1ff]"
                          style={{ height: `${viewerPrevHeight}px` }}
                        />
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#7a8092] shadow-sm">
                        Minggu lalu
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
                  <a
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-[#6b7185]"
                    href="/api/reports/ai-orders"
                  >
                    View Report
                  </a>
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
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2a2e3b]">
                        <span>{item.title}</span>
                        <span className="text-[#6b7185]">
                          {item.viewCount} Dilihat
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#ffb049] to-[#ff5d6c]"
                          style={{
                            width: `${Math.round(
                              (item.viewCount / maxPopularViews) * 100,
                            )}%`,
                          }}
                        />
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
                  {monthlyCounts.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-5 rounded-full bg-[#5a3df0]"
                        style={{
                          height: `${Math.round((value / maxMonthlyViews) * 120)}px`,
                        }}
                      />
                      <span className="mt-2 text-[10px] text-[#9aa0b4]">
                        {MONTH_LABELS[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <h3 className="text-base font-semibold">User Feedbacks</h3>
                <p className="text-xs text-[#7a8092]">
                  Total review: {totalReviews}
                </p>
                <div className="mt-4 space-y-3">
                  {reviewSummary.map((item) => (
                    <div key={item.label} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#6b7185]">
                        <span>{item.label}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#ffb049] to-[#ff5d6c]"
                          style={{ width: `${item.percent}%` }}
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

