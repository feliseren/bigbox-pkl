"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const stories = [
  {
    id: 1,
    client: "KEMENHUB",
    subtitle: "Kementrian Perhubungan",
    image: "/1371542_6424.jpg",
    tags: ["AI BigOne", "AI BigVision"],
    rating: 5,
  },
  {
    id: 2,
    client: "KEMENHUB",
    subtitle: "Kementrian Perhubungan",
    image: "/concentrated-man-using-laptop-computer-home.jpg",
    tags: ["AI BigOne", "AI BigVision"],
    rating: 5,
  },
  {
    id: 3,
    client: "KEMENHUB",
    subtitle: "Kementrian Perhubungan",
    image: "/Screenshot_9-1-2026_9924_www.freepik.com.jpeg",
    tags: ["AI BigOne", "AI BigVision"],
    rating: 5,
  },
];

export function StoriesSection() {
  const router = useRouter();
  const contactLink = "/hubungi-kami";

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden bg-gradient-to-r from-[#2d1b3d] to-[#1a0f2e]">
        <div className="relative mx-auto flex h-full max-w-[1237px] flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-[48px] font-bold leading-tight">
            Kisah Pelanggan
          </h1>
          <div className="mx-auto mt-3 h-[4px] w-[200px] bg-[#ff6b3d]" />
          <p className="mx-auto mt-6 max-w-[800px] text-[18px] font-normal">
            Lihat bagaimana organisasi mencapai kesuksesan dengan solusi AI dan
            Big Data dari BigBox
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="mx-auto max-w-[1237px] px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-[200px] w-full">
                <Image
                  src={story.image}
                  alt={story.client}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[12px] font-semibold uppercase text-gray-500">
                  succes stories
                </p>
                <h3 className="mt-2 text-[20px] font-bold text-black">
                  {story.client}
                </h3>
                <p className="text-[14px] font-normal text-gray-700">
                  {story.subtitle}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-[#2d3561] px-3 py-1 text-[12px] font-semibold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => router.push(`/cerita-kami/${story.id}`)}
                  className="mt-6 flex w-full items-center justify-between rounded-lg bg-[#2d3561] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#ff6b3d]"
                >
                  <span>Baca Selengkapnya</span>
                  <span>></span>
                </button>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Rating
                  </span>
                  <div className="flex gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <span key={i} className="text-[16px] text-amber-500">
                        ƒ~.
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-[#2d1b3d] via-[#1a0f2e] to-[#2d1b3d] py-20">
        <div className="mx-auto max-w-[1237px] px-6">
          <div className="rounded-[20px] bg-gradient-to-r from-[#2d1b3d] to-[#1a0f2e] p-12 text-center">
            <h2 className="text-[36px] font-bold text-white">
              Siap Wujudkan{" "}
              <span className="text-[#ff6b3d]">Keputusan Cerdas</span> Bersama
              BigBox?
            </h2>
            <p className="mx-auto mt-4 max-w-[800px] text-[16px] text-gray-300">
              Konsultasikan kebutuhan bisnis Anda bersama kami untuk temukan
              solusi AI dan big data yang tepat
            </p>

            {/* Product Selection */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <a
                href={contactLink}
                className="group rounded-[20px] border-2 border-[#ff6b3d] bg-transparent p-8 transition-all hover:bg-[#ff6b3d]/10"
              >
                <h3 className="text-[24px] font-bold text-white">BIG AI</h3>
                <p className="mt-2 text-[14px] text-gray-300">
                  Solusi AI untuk keputusan bisnis yang lebih cerdas dengan
                  insight berbasis data real-time
                </p>
              </a>

              <a
                href={contactLink}
                className="group rounded-[20px] border-2 border-[#ff6b3d] bg-transparent p-8 transition-all hover:bg-[#ff6b3d]/10"
              >
                <h3 className="text-[24px] font-bold text-white">BIG VISION</h3>
                <p className="mt-2 text-[14px] text-gray-300">
                  Platform analitik visual dengan dashboard real-time dan
                  laporan cerdas untuk pemahaman mendalam
                </p>
              </a>
            </div>

            {/* Main CTA Button */}
            <a
              href={contactLink}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff6b3d] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#ff5722]"
            >
              <span>Konsultasi Sekarang</span>
              <span>></span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
