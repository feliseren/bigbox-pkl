import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

const weeklyBars = [
  { day: 1, last6: 52, lastWeek: 30 },
  { day: 2, last6: 40, lastWeek: 54 },
  { day: 3, last6: 48, lastWeek: 28 },
  { day: 4, last6: 36, lastWeek: 46 },
  { day: 5, last6: 58, lastWeek: 40 },
  { day: 6, last6: 64, lastWeek: 32 },
  { day: 7, last6: 52, lastWeek: 34 },
  { day: 8, last6: 44, lastWeek: 54 },
  { day: 9, last6: 48, lastWeek: 30 },
  { day: 10, last6: 36, lastWeek: 46 },
  { day: 11, last6: 58, lastWeek: 40 },
  { day: 12, last6: 66, lastWeek: 32 },
];

const topProducts = [
  { name: "Enterprise ERP", price: "800K", sold: "100", revenue: "16M" },
  { name: "Enterprise ERP", price: "700K", sold: "75", revenue: "35M" },
  { name: "Web devt", price: "500K", sold: "50", revenue: "500K" },
  { name: "App devt", price: "800K", sold: "45", revenue: "16M" },
  { name: "Enterprise ERP", price: "2M", sold: "40", revenue: "4M" },
];

const aiOrders = [
  { name: "Big Vision", value: 40, color: "bg-[#5456ff]" },
  { name: "Big Social", value: 32, color: "bg-[#7d87ff]" },
  { name: "Big Assistant", value: 18, color: "bg-[#b3b8ff]" },
  { name: "Big Legal", value: 10, color: "bg-[#e0e3ff]" },
];

const popularNews = [
  { name: "Kementrian Perhubungan", views: "1.200k" },
  { name: "Kementrian Perhubungan", views: "800k" },
  { name: "Company Networking", views: "500k" },
];

const viewerBars = [20, 28, 35, 22, 18, 30, 26, 40, 32, 36, 38, 44];

export default async function DashboardKaryawanPage() {
  const employeeId = await readEmployeeSessionId();
  const employee = employeeId
    ? await prisma.employee.findUnique({ where: { id: employeeId } })
    : null;
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
            <a className="flex items-center gap-2 rounded-lg px-3 py-2" href="#">
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
            <a className="flex items-center gap-2 rounded-lg px-3 py-2" href="#">
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
                    <p className="mt-2 text-xl font-semibold">IDR 7.852.000</p>
                    <p className="mt-1 text-xs text-[#36a56d]">
                      + 2.1% vs last week
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
                    Last 6 days
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
                    <p className="text-xs text-[#7a8092]">From 1-6 Dec, 2020</p>
                  </div>
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-[#6b7185]">
                    View Report
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 rounded-full border-[14px] border-[#eef0ff]" />
                    <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-[#5456ff] border-r-[#7d87ff] border-b-[#b3b8ff] border-l-[#e0e3ff]" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-xs font-semibold text-[#2a2e3b]">
                      Big Vision
                      <br />
                      1.890 orders
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
                      {item.name} {item.value}%
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

