import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";

const tujuanItems = [
  {
    title: "Buat Keputusan Lebih Cerdas",
    points: ["Insight Berbasis Data", "Prediksi Pertumbuhan Bisnis", "Analisis Sentimen"],
  },
  {
    title: "Optimalkan Produktivitas Bisnis",
    points: ["Task Automation", "Alur Kerja Efektif", "Efisiensi Biaya"],
  },
  {
    title: "Utamakan Kepuasan Pelanggan",
    points: ["Layanan Pelanggan Setiap Saat", "Jaga Loyalitas Pelanggan", "Alur Kerja Efektif"],
  },
  {
    title: "Ungguli Persaingan di Industri Anda",
    points: ["Inovasi Tanpa Hambatan", "Layanan Unik & Kompetitif", "Bisnis yang Adaptif"],
  },
];

const kolaborasiItems = [
  {
    stat: "> 90 Pemerintahan Pusat & Daerah",
    desc:
      "Meningkatkan efisiensi layanan publik, transparansi, dan pengambilan keputusan berbasis data melalui digitalisasi di berbagai sektor.",
  },
  {
    stat: "> 20 BUMN & Swasta",
    desc:
      "Meningkatkan efisiensi operasional, analisis pasar, dan keputusan real-time melalui data driven insights di berbagai aspek bisnis.",
  },
  {
    stat: "> 80 UMKM & > 1K Active User",
    desc:
      "Meningkatkan efisiensi operasional, memahami pasar, dan mengoptimalkan strategi dengan data-driven insights untuk daya saing yang lebih kuat.",
  },
];

const awards = [
  {
    title: "ASEAN Federation of Engineering Organisations (AFEO) Awards 2018",
    desc: "ASEAN Outstanding Engineering Achievement Award",
  },
  {
    title: "TOP 10 Big Data Solution Provider 2019",
    desc: "Top 10 Big Data Solution Provider 2019 in APAC versi CIO Outlook",
  },
  {
    title: "Cloudera Data Impact Awards Finalist 2019",
    desc: "Edge-to-AI Category (The Biggest data-in-motion implementator in APAC)",
  },
  {
    title: "TOP 3 Technology Breakthrough BUMN Summit 2020",
    desc: "TOP 3 Technology Breakthrough Innovation BUMN Summit 2020",
  },
  {
    title: "The Most Innovate in Analytics 2021",
    desc: "Most Innovative Analytics in Big Data Category",
  },
];

export default async function Home() {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 bg-[#93898f]">
        <div className="mx-auto flex h-[60px] max-w-[1237px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={179}
              height={56}
              className="h-10 w-auto"
              priority
            />
          </div>
          <nav className="hidden items-center gap-10 text-sm font-semibold text-[var(--accent)] md:flex">
            <a className="nav-link active" href="/">
              Beranda
            </a>
            <a className="nav-link" href="/produk">
              Produk
            </a>
            <a className="nav-link" href="#">
              Cerita Kami
            </a>
          </nav>
          {user ? (
            <ProfileMenu fullName={user.fullName} />
          ) : (
            <a
              className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#524a4e]"
              href="/login"
            >
              <span className="inline-block h-4 w-4 rounded-full border border-[#524a4e]" />
              Login
            </a>
          )}
        </div>
      </header>

      <main className="pb-24">
        <section className="pt-0">
          <div className="hero-beranda relative h-[calc(100vh-60px)] w-full">
            <div className="absolute left-[69px] top-[256px] max-w-[520px] text-white">
              <h1 className="text-[48px] font-semibold italic leading-[55px]">
                Wujudkan Strategi Bisnis Akurat Bersama Solusi AI dan Big Data
                yang Tepat
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-10 text-center">
          <p className="mx-auto max-w-[1000px] text-[20px] font-bold text-[var(--ink)]">
            Solusi Artificial Intelligence (AI) & Big Data Analytics Platform
            yang komprehensif untuk membantu pengambilan keputusan dalam
            memberikan insights sehingga memberikan value bagi bisnis dan
            organisasi.
          </p>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-6">
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-bold text-[var(--ink)]">TUJUAN</h2>
            <div className="mx-auto mt-2 h-[4px] w-[147px] bg-[var(--ink)]" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tujuanItems.map((item) => (
              <div
                key={item.title}
                className="min-h-[420px] rounded-[40px] bg-[var(--panel)] p-5 text-center shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              >
                <h3 className="mb-5 text-[16px] font-bold text-[var(--ink)]">
                  {item.title}
                </h3>
                <ul className="space-y-5 text-[14px] text-black">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center justify-center">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-14">
          <div className="mb-10 text-center">
            <h2 className="text-[36px] font-bold text-[var(--ink)]">
              Berkolaborasi & Membantu Banyak Pihak
            </h2>
            <div className="mx-auto mt-3 h-[4px] w-[760px] max-w-full bg-[var(--ink)]" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {kolaborasiItems.map((item) => (
              <div
                key={item.stat}
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              >
                <div className="relative h-[275px] bg-gradient-to-br from-slate-200 via-slate-100 to-white">
                  <div className="absolute inset-x-0 top-6 text-center text-[24px] font-bold text-white drop-shadow">
                    {item.stat}
                  </div>
                </div>
                <div className="px-5 py-6 text-center">
                  <p className="text-[20px] font-bold text-black">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-8">
          <div className="mb-10 text-center">
            <h2 className="text-[36px] font-bold text-[var(--ink)]">AWARD</h2>
            <div className="mx-auto mt-3 h-[4px] w-[147px] bg-[var(--ink)]" />
          </div>
          <div className="rounded-[40px] bg-gradient-to-br from-[#251f6d] to-[#282626] px-10 py-12">
            <div className="grid gap-6 md:grid-cols-2">
              {awards.slice(0, 4).map((award) => (
                <div
                  key={award.title}
                  className="min-h-[328px] rounded-[20px] bg-[#d9d9d9] p-6 text-center"
                >
                  <p className="text-[24px] font-bold text-black">
                    {award.title}
                  </p>
                  <p className="mt-3 text-[20px] font-normal text-black">
                    {award.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="min-h-[328px] w-full max-w-[392px] rounded-[20px] bg-[#d9d9d9] p-6 text-center">
                <p className="text-[24px] font-bold text-black">
                  {awards[4].title}
                </p>
                <p className="mt-3 text-[20px] font-normal text-black">
                  {awards[4].desc}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#93898f] py-10 text-sm text-white">
        <div className="mx-auto grid max-w-[1237px] gap-6 px-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={215}
              height={68}
              className="h-12 w-auto"
            />
            <p className="text-[14px] font-medium leading-[164%] text-white">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
            <p className="text-[14px] font-medium text-white">
              © 2025 BigBox. All Rights Reserved. Privacy Policy | Terms &
              Conditions
            </p>
          </div>
          <div className="space-y-2 text-right md:justify-self-end">
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
              Tentang Kami
            </p>
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
              Kebijakan Privasi
            </p>
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
              Syarat & Ketentuan
            </p>
            <p className="text-[14px] font-medium leading-[118%] text-white">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
