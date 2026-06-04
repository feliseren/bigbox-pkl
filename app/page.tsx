import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";
import { NotificationBell } from "@/components/notification-bell";
import { getUserNotifications } from "@/lib/notifications";

const tujuanItems = [
  {
    title: "Buat Keputusan Lebih Cerdas",
    points: [
      { text: "Insight Berbasis Data", icon: "/insightberbasisdata.png" },
      { text: "Prediksi Pertumbuhan Bisnis", icon: "/prediksipertumbuhan.png" },
      { text: "Analisis Sentimen", icon: "/analisissentimen.png" },
    ],
  },
  {
    title: "Optimalkan Produktivitas Bisnis",
    points: [
      { text: "Task Automation", icon: "/taskautomation.png" },
      { text: "Alur Kerja Efektif", icon: "/alurkerjaefektif.png" },
      { text: "Efisiensi Biaya", icon: "/efisiensibiaya.png" },
    ],
  },
  {
    title: "Utamakan Kepuasan Pelanggan",
    points: [
      { text: "Layanan Pelanggan Setiap Saat", icon: "/layananpelanggan.png" },
      { text: "Jaga Loyalitas Pelanggan", icon: "/jagaloyalitas.png" },
      { text: "Alur Kerja Efektif", icon: "/alurkerjaefektif.png" },
    ],
  },
  {
    title: "Ungguli Persaingan di Industri Anda",
    points: [
      { text: "Inovasi Tanpa Hambatan", icon: "/inovasitambahan.png" },
      { text: "Layanan Unik & Kompetitif", icon: "/layananunik.png" },
      { text: "Bisnis yang Adaptif", icon: "/bisnisyangadaptif.png" },
    ],
  },
];

const kolaborasiItems = [
  {
    stat: "> 90 Pemerintahan Pusat & Daerah",
    desc:
      "Meningkatkan efisiensi layanan publik, transparansi, dan pengambilan keputusan berbasis data melalui digitalisasi di berbagai sektor.",
    image: "/modern-urban-buildings-view.jpg",
  },
  {
    stat: "> 20 BUMN & Swasta",
    desc:
      "Meningkatkan efisiensi operasional, analisis pasar, dan keputusan real-time melalui data driven insights di berbagai aspek bisnis.",
    image: "/bgbumn.jpg",
  },
  {
    stat: "> 80 UMKM & > 1K Active User",
    desc:
      "Meningkatkan efisiensi operasional, memahami pasar, dan mengoptimalkan strategi dengan data-driven insights untuk daya saing yang lebih kuat.",
    image: "/bgumkm.jpg",
  },
];

const awards = [
  {
    title: "ASEAN Federation of Engineering Organisations (AFEO) Awards 2018",
    desc: "ASEAN Outstanding Engineering Achievement Award",
    image: "/AFEO.png",
    logo: "/AFEO.png",
  },
  {
    title: "TOP 10 Big Data Solution Provider 2019",
    desc: "Top 10 Big Data Solution Provider 2019 in APAC versi CIO Outlook",
    logo: "/outlook.png",
  },
  {
    title: "Cloudera Data Impact Awards Finalist 2019",
    desc: "Edge-to-AI Category (The Biggest data-in-motion implementator in APAC)",
    logo: "/Cloudera.png",
  },
  {
    title: "TOP 3 Technology Breakthrough BUMN Summit 2020",
    desc: "TOP 3 Technology Breakthrough Innovation BUMN Summit 2020",
    logo: "/bumn.png",
  },
  {
    title: "The Most Innovate in Analytics 2021",
    desc: "Most Innovative Analytics in Big Data Category",
    logo: "/abdi.png",
  },
];

const partnerLogos = [
  { src: "/kementriansekre.png", alt: "Kementerian Sekretariat Negara" },
  { src: "/sinjai.png", alt: "Kabupaten Sinjai" },
  { src: "/telkomidn.png", alt: "Telkom Indonesia" },
  { src: "/ugm.png", alt: "UGM" },
  { src: "/kimiafarma.png", alt: "Kimia Farma" },
  { src: "/kominfo.jpg", alt: "Kominfo" },
  { src: "/ntb.png", alt: "NTB" },
  { src: "/papuabarat.png", alt: "Papua Barat" },
  { src: "/pegadaian.jpg", alt: "Pegadaian" },
  { src: "/pemkot.png", alt: "Pemerintah Kota" },
  { src: "/perhubungan.png", alt: "Kementerian Perhubungan" },
  { src: "/pertamina.png", alt: "Pertamina" },
  { src: "/g20.jpg", alt: "G20" },
  { src: "/jasamarga.png", alt: "Jasa Marga" },
  { src: "/kaur.JPG", alt: "Kabupaten Kaur" },
  { src: "/kelautan.png", alt: "Kementerian Kelautan" },
  { src: "/luwutimur.jpg", alt: "Kabupaten Luwu Timur" },
  { src: "/bimasakti.jpg", alt: "Bimasakti" },
  { src: "/bpjs.png", alt: "BPJS" },
  { src: "/bri.png", alt: "BRI" },
];

export default async function Home() {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const notifications = userId ? await getUserNotifications(userId) : [];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 site-header">
        <div className="mx-auto flex h-[60px] max-w-[1237px] items-center justify-between px-6">
          <Link className="flex items-center gap-3" href="/">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={179}
              height={56}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-10 text-sm font-semibold text-[var(--accent)] md:flex">
            <Link className="nav-link active" href="/">
              Beranda
            </Link>
            <Link className="nav-link" href="/produk">
              Produk
            </Link>
            <Link className="nav-link" href="/cerita-kami">
              Cerita Kami
            </Link>
            <Link className="nav-link" href="/whats-new">
              Daftar Pembaruan
            </Link>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell items={notifications} />
              <ProfileMenu fullName={user.fullName} />
            </div>
          ) : (
            <Link
              className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#524a4e]"
              href="/login"
            >
              Masuk
            </Link>
          )}
        </div>
      </header>

      <main className="pb-24">
        <section className="pt-0">
          <div className="relative flex h-[clamp(260px,56vw,760px)] w-full items-center overflow-hidden">
            <Image
              src="/background-beranda.gif"
              alt="Hero background"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="mx-auto w-full max-w-[1237px] px-6">
              <h1 className="relative z-10 max-w-[520px] text-[30px] font-semibold italic leading-[1.2] text-white sm:text-[38px] md:text-[48px] md:leading-[55px]">
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

        <section className="mx-auto max-w-[1237px] px-6 py-10">
          <div className="mb-12 text-center">
            <h2 className="tujuan-title">TUJUAN</h2>
            <div className="tujuan-divider" />
          </div>
          <div className="tujuan-grid">
            {tujuanItems.map((item) => (
              <div
                key={item.title}
                className="tujuan-card"
              >
                <h3 className="tujuan-card-title">{item.title}</h3>
                <ul className="tujuan-list">
                  {item.points.map((point) => (
                    <li key={point.text} className="tujuan-item">
                      <span className="tujuan-icon">
                        <Image
                          src={point.icon}
                          alt=""
                          width={28}
                          height={28}
                          className="tujuan-icon-image"
                        />
                      </span>
                      <span className="tujuan-text">{point.text}</span>
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
                <div className="zoom-card relative h-[275px] bg-gradient-to-br from-slate-200 via-slate-100 to-white overflow-hidden group">
                  <Image
                    src={item.image}
                    alt={item.stat}
                    fill
                    className="zoom-image object-cover group-hover:scale-110 transition-transform duration-300"
                  />
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
            <h2 className="text-[36px] font-bold text-[var(--ink)]">PENGHARGAAN</h2>
            <div className="mx-auto mt-3 h-[4px] w-[147px] bg-[var(--ink)]" />
          </div>
          <div className="award-surface">
            <div className="award-grid md:grid-cols-2">
              {awards.slice(0, 4).map((award) => (
                <div key={award.title} className="award-card">
                  <div className="award-card-header">
                    {award.logo ? (
                      <div className="award-logo">
                        <Image
                          src={award.logo}
                          alt={`${award.title} logo`}
                          width={52}
                          height={52}
                          className="award-logo-image"
                        />
                      </div>
                    ) : null}
                    <p className="award-title">{award.title}</p>
                  </div>
                  <p className="award-desc">{award.desc}</p>
                </div>
              ))}
            </div>
            <div className="award-single">
              <div className="award-card award-card-single">
                <div className="award-card-header">
                  {awards[4].logo ? (
                    <div className="award-logo">
                      <Image
                        src={awards[4].logo}
                        alt={`${awards[4].title} logo`}
                        width={52}
                        height={52}
                        className="award-logo-image"
                      />
                    </div>
                  ) : null}
                  <p className="award-title">{awards[4].title}</p>
                </div>
                <p className="award-desc">{awards[4].desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="partnership-section">
          <div className="mx-auto max-w-[1237px] px-6 py-12 text-center text-[var(--ink)]">
            <h2 className="text-[28px] font-bold md:text-[32px]">
              Lebih dari <span className="text-[#f59e0b]">100 Perusahaan</span>{" "}
              Telah Mempercayakan Kami
            </h2>
            <p className="mx-auto mt-2 max-w-[720px] text-[14px] text-[#4a4f60]">
              Hadirkan solusi inovatif berbasis AI dan big data untuk dorong
              pertumbuhan bisnis.
            </p>
          </div>
          <div className="partnership-marquee">
            <div className="partnership-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div className="partnership-logo" key={`${logo.src}-${index}`}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={140}
                    height={48}
                    className="partnership-logo-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer py-10 text-sm text-white">
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
            <a
              className="text-[14px] font-semibold uppercase tracking-[0.06em] text-white"
              href="/syarat-ketentuan"
            >
              Syarat & Ketentuan
            </a>
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


