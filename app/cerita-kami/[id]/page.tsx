import Image from "next/image";
import Link from "next/link";
import { allStories } from "@/lib/stories-data";

export async function generateStaticParams() {
  return allStories.map((story) => ({
    id: story.id.toString(),
  }));
}

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = allStories.find((s) => s.id === parseInt(params.id));

  if (!story) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Cerita tidak ditemukan
          </h1>
          <Link
            href="/cerita-kami"
            className="text-[#ff6b3d] font-semibold hover:underline"
          >
            Kembali ke Cerita Kami
          </Link>
        </div>
      </div>
    );
  }

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
            <a className="nav-link hover:text-gray-200" href="/cerita-kami">
              Cerita Kami
            </a>
          </nav>
          <a
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#524a4e] hover:bg-gray-100 transition-colors"
            href="/login"
          >
            <span className="inline-block h-4 w-4 rounded-full border border-[#524a4e]" />
            Login
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f2e] via-[#2d1b3d] to-[#4a2d5d] py-20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-orange-500 blur-3xl" />
          </div>
          <div className="mx-auto max-w-[1237px] px-6 relative z-10">
            <div className="text-white">
              <div className="mb-4">
                <Link
                  href="/cerita-kami"
                  className="text-sm font-semibold hover:text-gray-300 transition-colors flex items-center gap-2 mb-8"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Kembali ke Cerita Kami
                </Link>
              </div>
              <h1 className="mb-6 text-4xl md:text-5xl font-bold max-w-3xl">
                {story.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-[#3a3a4a] px-4 py-2 text-sm font-semibold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="mx-auto max-w-[1237px] px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Study Case Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {story.studyCase}
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {story.studyCaseDescription}
                </p>
              </div>

              {/* Background Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {story.backgroundTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {story.backgroundDescription}
                </p>
              </div>

              {/* Solutions Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {story.solutionTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify mb-6">
                  Sistem Informasi Hukum yang dikembangkan untuk Kemenhub
                  menggunakan produk BIGONE dan BIGVISION untuk mengotomatiskan
                  berbagai aspek pengelolaan dokumen hukum. Berikut adalah fitur
                  utama dari solusi ini:
                </p>

                <ul className="space-y-4">
                  {story.solutions.map((solution, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b3d] text-white font-semibold text-sm">
                          •
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {solution.title}:
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-justify">
                          {solution.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar - Organization Info */}
            <div className="lg:sticky lg:top-[80px] h-fit">
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    INFORMASI PELANGGGAN
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Pelangggan
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {story.organization.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Jenis Industri
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {story.organization.industry}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Ukuran Organisasi
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {story.organization.size}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Lokasi
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {story.organization.location}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Produk
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {story.organization.products.map((product) => (
                        <span
                          key={product}
                          className="inline-block rounded-full bg-[#3a3a4a] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#2d1b3d] via-[#3d2a4d] to-[#2d1b3d] py-16">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-0 top-1/2 h-96 w-96 rounded-full bg-orange-500 blur-3xl" />
          </div>
          <div className="mx-auto max-w-[1237px] px-6 relative z-10">
            <div className="rounded-xl bg-gradient-to-r from-[#3d2a4d] to-[#1a0f2e] p-12 text-center text-white">
              <h2 className="text-3xl font-bold">
                Siap Wujudkan{" "}
                <span className="text-[#ff6b3d]">Keputusan Cerdas</span> Bersama
                BigBox?
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Konsultasikan kebutuhan bisnis Anda bersama kami untuk temukan
                solusi AI dan big data yang tepat.
              </p>

              <Link
                href="/konsultasi"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-3 font-semibold text-[#2d1b3d] transition-all hover:scale-105 hover:shadow-lg"
              >
                Konsultasi Sekarang
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
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2d1b3d] py-10 text-sm text-white">
        <div className="mx-auto grid max-w-[1237px] gap-6 px-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={215}
              height={68}
              className="h-12 w-auto"
            />
            <p className="text-[14px] font-medium leading-[164%] text-gray-300">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
            <p className="text-[14px] font-medium text-gray-400">
              © 2025 BigBox. All Rights Reserved.
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
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="hover:text-[#ff6b3d]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-300">
                TENTANG KAMI
              </p>
              <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-300">
                KEBIJAKAN PRIVASI
              </p>
              <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-gray-300">
                SYARAT & KETENTUAN
              </p>
            </div>
            <p className="text-[12px] font-medium leading-[118%] text-gray-400">
              Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
              Baru, Jakarta Selatan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
