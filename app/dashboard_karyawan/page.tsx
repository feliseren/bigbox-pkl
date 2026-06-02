import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { EmployeeProfileMenu } from "@/components/employee-profile-menu";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { DashboardPeriodFilter } from "@/components/dashboard-period-filter";

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

function buildDashboardRangeState(
  selected: "weekly" | "monthly" | "yearly" | "range",
  fromValue: string | undefined,
  toValue: string | undefined,
  today: Date,
  endOfToday: Date,
  monthLabels: string[],
) {
  const parseDateInput = (value?: string) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map((part) => Number(part));
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };
  const rangeStart = (() => {
    if (selected === "monthly") {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    if (selected === "yearly") {
      return new Date(today.getFullYear(), 0, 1);
    }
    if (selected === "range") {
      const parsed = parseDateInput(fromValue);
      return parsed ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    }
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  })();
  const rangeEnd = (() => {
    if (selected === "monthly") {
      return new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }
    if (selected === "yearly") {
      return new Date(today.getFullYear() + 1, 0, 1);
    }
    if (selected === "range") {
      const parsed = parseDateInput(toValue);
      if (parsed) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + 1);
      }
    }
    return endOfToday;
  })();
  const hasCustomRange = selected === "range" && fromValue && toValue;
  const noDataRange =
    Boolean(hasCustomRange) &&
    (rangeStart >= rangeEnd || rangeStart >= endOfToday || rangeEnd > endOfToday);
  const safeRangeEnd = noDataRange ? rangeStart : rangeEnd;
  const rangeLengthDays = Math.max(
    1,
    Math.round((safeRangeEnd.getTime() - rangeStart.getTime()) / 86400000),
  );
  const prevRangeEnd = new Date(rangeStart);
  const prevRangeStart = new Date(
    prevRangeEnd.getFullYear(),
    prevRangeEnd.getMonth(),
    prevRangeEnd.getDate() - rangeLengthDays,
  );
  const periodLabel =
    selected === "monthly"
      ? "Bulanan"
      : selected === "yearly"
        ? "Tahunan"
        : selected === "range"
          ? "Range"
          : "Mingguan";
  const rangeLabel =
    selected === "range" && fromValue && toValue
      ? `${fromValue} - ${toValue}`
      : selected === "range"
        ? "Pilih rentang tanggal"
        : selected === "monthly"
          ? `Bulan ${monthLabels[today.getMonth()]} ${today.getFullYear()}`
          : selected === "yearly"
            ? `Tahun ${today.getFullYear()}`
            : "7 hari terakhir";
  return {
    rangeStart,
    safeRangeEnd,
    prevRangeStart,
    periodLabel,
    rangeLabelDisplay: noDataRange ? "Data tidak tersedia" : rangeLabel,
    noDataRange,
    rangeLengthDays,
  };
}

export default async function DashboardKaryawanPage({
  searchParams,
}: {
  searchParams?: Promise<{
    period?: string | string[];
    from?: string | string[];
    to?: string | string[];
    viewerPeriod?: string | string[];
    viewerFrom?: string | string[];
    viewerTo?: string | string[];
  }>;
}) {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId }, include: { role: true } })
    : null;
  const resolvedSearchParams = await searchParams;
  const rawPeriod = resolvedSearchParams?.period;
  const rawFrom = resolvedSearchParams?.from;
  const rawTo = resolvedSearchParams?.to;
  const rawViewerPeriod = resolvedSearchParams?.viewerPeriod;
  const rawViewerFrom = resolvedSearchParams?.viewerFrom;
  const rawViewerTo = resolvedSearchParams?.viewerTo;
  const selectedPeriod = Array.isArray(rawPeriod) ? rawPeriod[0] : rawPeriod;
  const fromParam = Array.isArray(rawFrom) ? rawFrom[0] : rawFrom;
  const toParam = Array.isArray(rawTo) ? rawTo[0] : rawTo;
  const selectedViewerPeriod = Array.isArray(rawViewerPeriod)
    ? rawViewerPeriod[0]
    : rawViewerPeriod;
  const viewerFromParam = Array.isArray(rawViewerFrom)
    ? rawViewerFrom[0]
    : rawViewerFrom;
  const viewerToParam = Array.isArray(rawViewerTo) ? rawViewerTo[0] : rawViewerTo;
  const period = ["weekly", "monthly", "yearly", "range"].includes(
    selectedPeriod || "",
  )
    ? (selectedPeriod as "weekly" | "monthly" | "yearly" | "range")
    : "weekly";
  const viewerPeriod = ["weekly", "monthly", "yearly", "range"].includes(
    selectedViewerPeriod || "",
  )
    ? (selectedViewerPeriod as "weekly" | "monthly" | "yearly" | "range")
    : "weekly";
  const today = startOfDayInTimeZone(new Date());
  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  const revenueRange = buildDashboardRangeState(
    period,
    fromParam,
    toParam,
    today,
    endOfToday,
    MONTH_LABELS,
  );
  const viewerRange = buildDashboardRangeState(
    viewerPeriod,
    viewerFromParam,
    viewerToParam,
    today,
    endOfToday,
    MONTH_LABELS,
  );
  const reportParams = new URLSearchParams();
  if (period) {
    reportParams.set("period", period);
  }
  if (period === "range" && fromParam && toParam) {
    reportParams.set("from", fromParam);
    reportParams.set("to", toParam);
  }
  const reportHref = `/api/reports/weekly-revenue${reportParams.toString() ? `?${reportParams}` : ""}`;
  const doneOrdersRange = await prisma.order.findMany({
    where: {
      statusPesanan: "Done",
      createdAt: { gte: revenueRange.prevRangeStart, lt: revenueRange.safeRangeEnd },
    },
  });
  const doneOrdersAll = await prisma.order.findMany({
    where: {
      statusPesanan: "Done",
      createdAt: {
        gte: revenueRange.rangeStart,
        lt: revenueRange.safeRangeEnd,
      },
    },
    include: { product: { include: { category: true } } },
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
      createdAt: {
        gte: viewerRange.rangeStart,
        lt: viewerRange.safeRangeEnd,
      },
      newsStory: { deletedAt: null },
    },
    select: { createdAt: true },
  });
  const viewCountsByDay = new Map<string, number>();
  viewLogs.forEach((view) => {
    const key = dateKeyInTimeZone(view.createdAt);
    viewCountsByDay.set(key, (viewCountsByDay.get(key) ?? 0) + 1);
  });
  const currentViewerRangeRaw = Array.from({ length: viewerRange.rangeLengthDays }).map(
    (_, index) => {
      const date = new Date(
        viewerRange.rangeStart.getFullYear(),
        viewerRange.rangeStart.getMonth(),
        viewerRange.rangeStart.getDate() + index,
      );
      const key = dateKeyInTimeZone(date);
      return { date, value: viewCountsByDay.get(key) ?? 0 };
    },
  );
  const currentRangeRaw = Array.from({ length: revenueRange.rangeLengthDays }).map((_, index) => {
    const date = new Date(
      revenueRange.rangeStart.getFullYear(),
      revenueRange.rangeStart.getMonth(),
      revenueRange.rangeStart.getDate() + index,
    );
    const key = dateKeyInTimeZone(date);
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const prevRangeRaw = Array.from({ length: revenueRange.rangeLengthDays }).map((_, index) => {
    const date = new Date(
      revenueRange.prevRangeStart.getFullYear(),
      revenueRange.prevRangeStart.getMonth(),
      revenueRange.prevRangeStart.getDate() + index,
    );
    const key = dateKeyInTimeZone(date);
    return { date, value: dailyTotals.get(key) ?? 0 };
  });
  const monthlyRevenueTotals = Array.from({ length: 12 }, () => 0);
  if (period === "yearly") {
    currentRangeRaw.forEach((item) => {
      const { month } = getDatePartsInTimeZone(item.date);
      const index = month - 1;
      if (index >= 0 && index < 12) {
        monthlyRevenueTotals[index] += item.value;
      }
    });
  }
  const revenueSeries =
    period === "yearly"
      ? monthlyRevenueTotals.map((value, index) => ({
          label: MONTH_LABELS[index],
          value,
        }))
      : currentRangeRaw.map((item) => ({
          label: String(getDatePartsInTimeZone(item.date).day),
          value: item.value,
        }));
  const maxValue = Math.max(1, ...revenueSeries.map((item) => item.value));
  const weeklyBars = revenueSeries.map((item) => {
    const scale = (value: number) => {
      if (value <= 0) return 4;
      return Math.max(8, Math.round((value / maxValue) * 90));
    };
    return {
      label: item.label,
      last6: scale(item.value),
      value: item.value,
    };
  });
  const currentWeekTotal = currentRangeRaw.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const prevWeekTotal = prevRangeRaw.reduce((sum, item) => sum + item.value, 0);
  const percentChange =
    prevWeekTotal > 0 ? ((currentWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0;
  const percentLabel = `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}%`;
  const percentColor = percentChange >= 0 ? "text-[#36a56d]" : "text-[#e32626]";
  const popularNews = await prisma.newsStory.findMany({
    where: { deletedAt: null },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, title: true, viewCount: true },
  });
  const maxPopularViews = Math.max(
    1,
    ...popularNews.map((item) => item.viewCount),
  );
  const monthlyViewerTotals = Array.from({ length: 12 }, () => 0);
  if (viewerPeriod === "yearly") {
    currentViewerRangeRaw.forEach((item) => {
      const { month } = getDatePartsInTimeZone(item.date);
      const index = month - 1;
      if (index >= 0 && index < 12) {
        monthlyViewerTotals[index] += item.value;
      }
    });
  }
  const viewerSeries =
    viewerPeriod === "yearly"
      ? monthlyViewerTotals.map((value, index) => ({
          label: MONTH_LABELS[index],
          value,
        }))
      : currentViewerRangeRaw.map((item) => ({
          label: String(getDatePartsInTimeZone(item.date).day),
          value: item.value,
        }));
  const maxViewerValue = Math.max(1, ...viewerSeries.map((item) => item.value));
  const reviewCounts = await prisma.newsReview.groupBy({
    by: ["rating"],
    _count: { rating: true },
    where: {
      createdAt: { gte: revenueRange.rangeStart, lt: revenueRange.safeRangeEnd },
      deletedAt: null,
      newsStory: { deletedAt: null },
    },
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
      label: `${rating} Bintang`,
      count,
      percent,
    };
  });
  const productStats = new Map<
    string,
    { count: number; revenue: number; price: string; name: string }
  >();
  doneOrdersAll.forEach((order) => {
    const key = order.productId;
    const product = order.product
      ? { name: order.product.namaProduk, price: order.product.hargaProduk }
      : null;
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
      const categoryName = order.product?.category.categoryName;
      if (categoryName && categoryName in acc) {
        acc[categoryName as keyof typeof acc] += 1;
      }
      return acc;
    },
    {
      "Big Assistant": 0,
      "Big Legal": 0,
      "Big Social": 0,
      "Big Vision": 0,
    },
  );
  const aiOrders = aiOrderColors.map((item) => {
    const value = aiOrderCounts[item.name as keyof typeof aiOrderCounts];
    return { ...item, value };
  });
  const aiDonutGradient = (() => {
    if (!totalOrders) {
      return "conic-gradient(#eef0ff 0 100%)";
    }
    let start = 0;
    const slices = aiOrderColors.map((item) => {
      const value = aiOrderCounts[item.name as keyof typeof aiOrderCounts];
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
            <div className="grid gap-6">
              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <DashboardPeriodFilter
                  period={period}
                  from={fromParam}
                  to={toParam}
                  rangeLabel={revenueRange.rangeLabelDisplay}
                  variant="inline"
                  maxDate={dateKeyInTimeZone(today)}
                  hiddenFields={{
                    viewerPeriod,
                    viewerFrom: viewerFromParam,
                    viewerTo: viewerToParam,
                  }}
                />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#7a8092]">
                      Pendapatan {revenueRange.periodLabel}
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {formatRupiah(currentWeekTotal)}
                    </p>
                  <p className={`mt-1 text-xs ${percentColor}`}>
                    {percentLabel} vs periode sebelumnya
                  </p>
                  {revenueRange.noDataRange ? (
                    <p className="mt-2 text-xs text-[#e32626]">
                      Data tidak tersedia untuk tanggal tersebut.
                    </p>
                  ) : null}
                </div>
                  <a
                    className="rounded-lg border border-[#e6e9f5] px-3 py-1 text-xs text-[#4a4f60]"
                    href={reportHref}
                  >
                    Lihat Laporan
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
                        key={bar.label}
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
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-[#8f95a8]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#5256ff]" />
                    {revenueRange.rangeLabelDisplay}
                  </span>
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Grafik Pembaca</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <DashboardPeriodFilter
                    period={viewerPeriod}
                    from={viewerFromParam}
                    to={viewerToParam}
                    rangeLabel={viewerRange.rangeLabelDisplay}
                    variant="inline"
                    maxDate={dateKeyInTimeZone(today)}
                    periodFieldName="viewerPeriod"
                    fromFieldName="viewerFrom"
                    toFieldName="viewerTo"
                    hiddenFields={{
                      period,
                      from: fromParam,
                      to: toParam,
                    }}
                  />
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
                      {viewerSeries.map((item) => {
                        const height = Math.round((item.value / maxViewerValue) * 90);
                        return (
                          <div
                            key={item.label}
                            className="flex flex-1 flex-col items-center"
                          >
                            <div className="group relative flex h-32 items-end">
                              <div
                                className="w-3 rounded-full bg-gradient-to-t from-[#4249ff] to-[#7f86ff] shadow-[0_6px_14px_rgba(82,86,255,0.35)]"
                                style={{ height: `${height}px` }}
                              />
                              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[#1f2430] px-3 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                {item.value} views
                              </span>
                            </div>
                            <span className="mt-2 text-[10px] text-[#9aa0b4]">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-[#8f95a8]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#5256ff]" />
                    {viewerRange.rangeLabelDisplay}
                  </span>
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-[20px] bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">5 Produk Populer</h3>
                <div className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-[#6b7185]">
                  {revenueRange.rangeLabelDisplay}
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
                    Lihat Laporan
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

            <div className="mt-6 grid gap-6">
              <section className="rounded-[20px] bg-white p-6 shadow-lg">
                <h3 className="text-base font-semibold">Penilaian Pengguna</h3>
                <p className="text-xs text-[#7a8092]">
                  Total penilaian : {totalReviews}
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
