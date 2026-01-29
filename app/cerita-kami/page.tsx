import Image from "next/image";
import Link from "next/link";
import { fetchNews } from "@/lib/news-db";
import { readSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileMenu } from "@/components/profile-menu";
import { NotificationBell } from "@/components/notification-bell";
import { getUserNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const categories = [
  "Show All",
  "Big Vision",
  "Big Assistant",
  "Big Social",
  "Big Legal",
];

const formatTags = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
const resolveImageUrl = (value?: string | null) => {
  if (!value) return "/bg-karyawan.jpeg";
  if (value.toLowerCase().endsWith(".bin")) return "/bg-karyawan.jpeg";
  return value;
};

export default async function CeritaKamiPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const notifications = userId ? await getUserNotifications(userId) : [];
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams?.q;
  const rawCategory = resolvedSearchParams?.category;
  const searchQuery =
    (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const categoryParam =
    (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory)?.trim() ?? "Show All";
  const selectedCategory = categories.includes(categoryParam)
    ? categoryParam
    : "Show All";
  const stories = await fetchNews({
    query: searchQuery || undefined,
    category: selectedCategory === "Show All" ? undefined : selectedCategory,
  });
  const filteredStories = stories.map((story) => ({
    id: story.id,
    client: (story.customerName || story.title).toUpperCase(),
    subtitle: story.title,
    image: resolveImageUrl(story.imageUrl),
    tags: formatTags(story.customerProducts),
    category: story.category,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
          <nav className="hidden items-center gap-10 text-sm font-semibold text-white md:flex">
            <a className="nav-link hover:text-gray-200" href="/">
              Beranda
            </a>
            <a className="nav-link hover:text-gray-200" href="/produk">
              Produk
            </a>
            <a className="nav-link active hover:text-gray-200" href="/cerita-kami">
              Cerita Kami
            </a>
            <a className="nav-link hover:text-gray-200" href="/whats-new">
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
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#524a4e] hover:bg-gray-100 transition-colors"
              href="/login"
            >
              <span className="inline-block h-4 w-4 rounded-full border border-[#524a4e]" />
              Login
            </a>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section with Search */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f2e] via-[#2d1b3d] to-[#4a2d5d] py-12">
          <div className="mx-auto max-w-[1237px] px-6">
            <div className="text-center text-white">
              <h1 className="mb-2 text-5xl font-bold">
                CERITA <span className="text-[#ff6b3d]">BIGBOX</span>.AI
              </h1>
              <div className="mx-auto mb-4 h-1 w-36 bg-white" />
              <p className="mb-4 text-lg">
                Pelajari cara organisasi mencapai lebih banyak hal dengan BigBox
              </p>
              <p className="mb-5 text-sm text-gray-300">
                Berinovasi lebih cepat dan buat keputusan lebih cerdas bersama
                teknologi AI dan big data milik BigBox.
              </p>

              {/* Search Bar */}
              <form className="mx-auto max-w-xl" method="get">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="PELUANG BISNIS. Cari kisah pelanggan berdasarkan kata kunci, nama perusahaan, nama produk, atau solusi."
                    className="w-full rounded-full border-2 border-white bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b3d]"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    type="submit"
                  >
                    <svg
                      className="h-4 w-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b bg-gray-50 py-3">
          <div className="mx-auto max-w-[1237px] px-6">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const params = new URLSearchParams();
                if (searchQuery) {
                  params.set("q", searchQuery);
                }
                if (category !== "Show All") {
                  params.set("category", category);
                }
                const href = `/cerita-kami${params.toString() ? `?${params}` : ""}`;
                return (
                  <Link
                    key={category}
                    href={href}
                    className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all ${
                      selectedCategory === category
                        ? "bg-[#2d1b3d] text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stories Count */}
        <section className="mx-auto max-w-[1237px] px-6 py-8">
          <p className="text-center text-sm text-gray-600">
            Menampilkan {filteredStories.length} Artikel
          </p>
        </section>

        {/* Stories Grid */}
        <section className="mx-auto max-w-[1237px] px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-3">
            {filteredStories.map((story) => (
              <Link
                key={story.id}
                href={`/cerita-kami/${story.id}`}
                className="zoom-parent group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-2xl"
              >
                {/* Image with Zoom Effect */}
                <div className="zoom-card relative h-[220px] w-full overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.client}
                    className="zoom-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    succes stories
                  </p>

                  <h3 className="mt-2 text-sm font-bold uppercase text-[#ff6b3d]">
                    {story.client}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {story.subtitle}
                  </p>

                  {/* Tags - Clickable */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(story.tags.length ? story.tags : [story.category]).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-[#3a3a4a] px-3 py-1 text-xs font-semibold text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-[#ff6b3d] transition-colors group-hover:text-[#ff5722]">
                    Baca Selengkapnya
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>

                  {/* Rating */}
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-xs font-semibold text-gray-600">
                      Rating
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results Message */}
          {filteredStories.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">
                Tidak ada cerita yang sesuai dengan pencarian Anda.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#2d1b3d] via-[#3d2a4d] to-[#2d1b3d] py-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-24 top-10 h-28 w-28 rounded-full bg-[#ff6b3d] blur-2xl opacity-60" />
            <div className="absolute right-20 top-6 h-32 w-32 rounded-full bg-[#ff8a5b] blur-3xl opacity-55" />
          </div>
          <div className="mx-auto max-w-[1237px] px-6">
            <div className="rounded-[18px] bg-gradient-to-r from-[#2a1740] via-[#3f2451] to-[#6a2f4b] px-6 py-7 text-center text-white md:px-10">
              <h2 className="text-xl font-bold md:text-2xl">
                Siap Wujudkan{" "}
                <span className="text-[#ff6b3d]">Keputusan Cerdas</span> Bersama
                BigBox?
              </h2>
              <p className="mt-2 text-sm text-gray-200">
                Konsultasikan kebutuhan bisnis Anda bersama kami untuk temukan
                solusi AI dan big data yang tepat.
              </p>

              <a
                href="/hubungi-kami"
                className="mt-4 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1f1f1f] shadow-md transition-transform hover:scale-[1.02]"
              >
                Konsultasi Sekarang
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f1f1f] text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

            {/* Footer */}
      <footer className="bg-[#9a9a9a] py-10 text-sm text-white">
        <div className="mx-auto grid max-w-[1237px] gap-6 px-6 md:grid-cols-[1.6fr_1fr]">
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
            <p className="text-[13px] font-medium text-white/80">
              (c) 2025 BigBox, All Rights Reserved. Privacy Policy | Terms &
              Conditions
            </p>
          </div>
          <div className="space-y-4 text-right md:justify-self-end">
            <div className="flex justify-end gap-4">
              <a href="#" className="hover:text-[#ff6b3d]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#ff6b3d]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#ff6b3d]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#ff6b3d]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="space-y-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/90">
              <p>TENTANG KAMI</p>
              <p>KEBIJAKAN PRIVASI</p>
              <p>SYARAT & KETENTUAN</p>
            </div>
            <p className="text-[12px] font-medium leading-[118%] text-white/80">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
