import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";
import { FeatureSlider } from "@/components/feature-slider";
import { NotificationBell } from "@/components/notification-bell";
import { getUserNotifications } from "@/lib/notifications";

const features = [
  {
    title: "Optical Character Recognition (OCR)",
    icon: "/OCR.png",
    desc:
      "Mendapatkan dan mengumpulkan informasi dengan mengekstraksi data dari gambar menjadi teks yang dapat diproses dalam sistem.",
  },
  {
    title: "Face Recognition (FR)",
    icon: "/FR.png",
    desc:
      "Analisis visual real-time untuk mendukung pemantauan dan keputusan cepat di lapangan.",
  },
  {
    title: "Object Detection (OD)",
    icon: "/OD.png",
    desc:
      "Deteksi objek otomatis untuk meningkatkan efisiensi pengawasan dan analitik.",
  },
];

const benefits = [
  {
    title: "Efisiensi Operasional",
    icon: "/operasional.png",
    desc:
      "Kelola video, dokumen, hingga data pribadi secara instan untuk kurangi pekerjaan manual.",
  },
  {
    title: "Percepat Digitalisasi",
    icon: "/digitalisasi.png",
    desc:
      "Ubah berbagai dokumen fisik menjadi data digital yang akurat dengan teknologi kamera AI.",
  },
  {
    title: "Integrasi Mudah dan Fleksibel",
    icon: "/fleksibel.png",
    desc:
      "Hubungkan BigVision ke infrastruktur penyimpanan sesuai kebutuhan, baik on-cloud ataupun on-premise.",
  },
];

export default async function BigVisionPage() {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const notifications = userId ? await getUserNotifications(userId) : [];
  const formatPrice = (value: string) =>
    value.startsWith("Rp") ? value : `Rp ${value}`;
  const pricing = (await prisma.product.findMany({ where: { category: { categoryName: "Big Vision" } }, orderBy: { id: "desc" } })).map(
    (item) => ({
    id: item.id,
    name: item.namaProduk,
    price: item.hargaProduk,
    note: item.durasiProduk || "per tahun",
  }),
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 site-header">
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
            <a className="nav-link" href="/">
              Beranda
            </a>
            <a className="nav-link active" href="/produk">
              Produk
            </a>
            <a className="nav-link" href="/cerita-kami">
              Cerita Kami
            </a>
            <a className="nav-link" href="/whats-new">
              Daftar Pembaruan
            </a>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell items={notifications} />
              <ProfileMenu fullName={user.fullName} />
            </div>
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

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(120deg,#0b0d2b_0%,#06061a_55%,#0b0d2b_100%)] py-20 text-white">
          <div className="absolute inset-0 opacity-40">
            <Image src="/big-bg.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="relative mx-auto flex max-w-[1237px] flex-col items-center px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9aa4ff]">
              BigBox
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[0.08em] md:text-5xl">
              BIG VISION
            </h1>
            <div className="mt-4 h-[3px] w-[220px] bg-white" />
            <p className="mt-5 max-w-3xl text-sm font-medium md:text-base">
              Membantu pemerintah dan perusahaan mengoptimalkan pengawasan,
              analisis visual, dan pengambilan keputusan berbasis AI secara
              real-time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                className="rounded-lg bg-[#1f53ff] px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(31,83,255,0.35)]"
                href="#demo"
              >
                Coba Demo
              </a>
              <a
                className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-[#151a5b]"
                href="/hubungi-kami"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1237px] gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-[#1f2355] md:text-3xl">
              Dashboard Terpadu
            </h2>
            <p className="mt-4 text-sm font-medium leading-[170%] text-[#2f2f2f] md:text-base">
              Analisis visual real-time dari kamera dengan visualisasi data yang
              intuitif, mendukung pemantauan dan pengambilan keputusan secara
              efisien.
            </p>
          </div>
          <div className="relative h-[240px] overflow-hidden rounded-[20px] border border-[#d9d9d9] bg-[#f1f1f1] shadow-[0_16px_32px_rgba(0,0,0,0.12)] md:h-[280px]">
            <Image
              src="/big-vision.png"
              alt="Big Vision dashboard preview"
              fill
              className="object-cover"
            />
          </div>
        </section>

        <section className="bg-[#efefef]">
          <div className="mx-auto max-w-[1237px] px-6 pb-12 pt-6 text-center">
            <h3 className="text-xl font-semibold text-[#2c2c2c]">
              Fitur-Fitur
            </h3>
            <div className="mx-auto mt-3 h-[3px] w-[140px] bg-[#2c2c2c]" />
          </div>
          <FeatureSlider features={features} />
        </section>

        <section className="mx-auto max-w-[1237px] px-6 pb-8 text-center">
          <h3 className="text-xl font-semibold text-[#2c2c2c]">
            Keuntungan Menggunakan Big Vision
          </h3>
          <div className="mx-auto mt-3 h-[3px] w-[300px] bg-[#2c2c2c]" />
        </section>

        <section className="mx-auto max-w-[1100px] px-6 pb-12">
          <div className="grid gap-6 md:grid-cols-3 md:justify-items-center">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="w-[280px] min-h-[240px] rounded-[24px] border border-[#4a4a4a] bg-white px-6 py-7 text-center shadow-[0_12px_22px_rgba(0,0,0,0.12)]"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                  {benefit.icon ? (
                    <Image
                      src={benefit.icon}
                      alt=""
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px]"
                    />
                  ) : (
                    <span className="text-sm font-semibold">AI</span>
                  )}
                </div>
                <p className="text-base font-semibold text-[#1f2355]">
                  {benefit.title}
                </p>
                <p className="mt-2 text-sm leading-[165%] text-[#5a5a5a]">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 pb-6 text-center">
          <h3 className="text-xl font-semibold text-[#2c2c2c]">
            BigVision Pricing
          </h3>
          <div className="mx-auto mt-3 h-[3px] w-[200px] bg-[#2c2c2c]" />
        </section>

        <section className="mx-auto max-w-[1237px] px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className="rounded-[20px] border border-[#cfcfcf] bg-white px-6 py-8 text-center shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
              >
                <p className="text-base font-semibold text-[#1f2355]">
                  {plan.name}
                </p>
                <p className="mt-2 text-lg font-bold text-[#1f53ff]">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-xs text-[#6a6a6a]">{plan.note}</p>
                {user ? (
                  <a
                    className="mt-5 inline-flex rounded-md bg-[#1f53ff] px-4 py-2 text-xs font-semibold text-white"
                    href={`/pembayaran?productType=big-vision&productId=${plan.id}`}
                  >
                    Beli Sekarang
                  </a>
                ) : (
                  <a
                    className="mt-5 inline-flex rounded-md bg-[#1f53ff] px-4 py-2 text-xs font-semibold text-white"
                    href={`/login?redirect=/pembayaran?productType=big-vision&productId=${plan.id}`}
                  >
                    Beli Sekarang
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <a
              className="rounded-lg border border-[#1f53ff] px-6 py-2 text-sm font-semibold text-[#1f53ff]"
              href="/produk"
            >
              Lihat Produk BigBox Lainnya
            </a>
          </div>
        </section>

        <section
          id="hubungi"
          className="bg-[linear-gradient(120deg,#0c1140_0%,#0a1c6b_50%,#0c1140_100%)] py-12 text-white"
        >
          <div className="mx-auto flex max-w-[1237px] flex-col items-center gap-4 px-6 text-center">
            <h3 className="text-2xl font-semibold">
              Perlu solusi Computer Vision berbasis AI untuk kebutuhan khusus?
            </h3>
            <p className="text-sm text-white/80">
              Dari deteksi objek hingga analisis citra massal, BigVision bisa
              dikustom untuk memenuhi standar industri dan teknis Anda.
            </p>
            <a
              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#0a1c6b]"
              href="/hubungi-kami"
            >
              Hubungi Tim BigBox
            </a>
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
              Ac 2025 BigBox. All Rights Reserved. Privacy Policy | Terms &
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



