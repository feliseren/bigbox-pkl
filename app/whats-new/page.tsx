import Image from "next/image";
import Link from "next/link";
import { readSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationBell } from "@/components/notification-bell";
import { ProfileMenu } from "@/components/profile-menu";
import { getUserNotifications } from "@/lib/notifications";
import { fetchWhatsNew, fetchWhatsNewHighlight } from "@/lib/whats-new-db";

const categories = ["Semua", "Produk", "Fitur", "Update Sistem"];

const badgeStyles: Record<string, string> = {
  Produk: "bg-[#e4ecff] text-[#1f3fbf]",
  Fitur: "bg-[#dff3ec] text-[#1b7c55]",
  "Update Sistem": "bg-[#efe6ff] text-[#5a3df0]",
  Event: "bg-[#ffe9d6] text-[#c6621f]",
};

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export default async function WhatsNewPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const notifications = userId ? await getUserNotifications(userId) : [];
  const resolvedSearchParams = await searchParams;
  const rawCategory = resolvedSearchParams?.category;
  const selectedCategory =
    (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory)?.trim() ?? "Semua";
  const normalizedCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "Semua";
  const updates = await fetchWhatsNew({
    category: normalizedCategory === "Semua" ? undefined : normalizedCategory,
  });
  const highlight = (await fetchWhatsNewHighlight()) ?? updates[0] ?? null;
  const highlightId = highlight?.id ?? null;
  const updatesList = highlightId
    ? updates.filter((item) => item.id !== highlightId)
    : updates;
  const highlightData = highlight
    ? {
        title: highlight.title,
        category: highlight.category,
        date: highlight.publishDate,
        description: highlight.summary,
        imageUrl: highlight.imageUrl,
      }
    : null;
  const highlightHasImage = Boolean(highlightData?.imageUrl);

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#1f2430]">
      <header className="sticky top-0 z-30 site-header">
        <div className="mx-auto flex h-[60px] max-w-[1237px] items-center justify-between px-6">
          <Image
            src="/bigbox_logo-removebg-preview.png"
            alt="BigBox logo"
            width={179}
            height={56}
            className="h-10 w-auto"
            priority
          />
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
            <a className="nav-link active hover:text-gray-200" href="/whats-new">
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
        <section className="relative overflow-hidden bg-[#0b1437] py-16">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_50%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          <div className="relative mx-auto max-w-[1237px] px-6 text-center text-white">
            <h1 className="text-4xl font-bold md:text-5xl">
              DAFTAR PEMBARUAN
            </h1>
            <p className="mt-3 text-sm text-slate-200 md:text-base">
              Update terbaru produk & inovasi BigBox
            </p>
            <span className="mt-5 inline-flex items-center justify-center rounded-full bg-[#2563eb] px-6 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
              Updated Weekly
            </span>
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-6">
          <div className="mx-auto w-full max-w-[760px] rounded-full bg-white/90 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-2">
              {categories.map((category) => {
                const params = new URLSearchParams();
                if (category !== "Semua") {
                  params.set("category", category);
                }
                const href = `/whats-new${
                  params.toString() ? `?${params}` : ""
                }`;
                const isActive = normalizedCategory === category;
                return (
                  <Link
                    key={category}
                    href={href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all sm:px-5 ${
                      isActive
                        ? "bg-[#2563eb] text-white shadow"
                        : "text-[#1f2430] hover:bg-[#eef2ff]"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 pb-12">
          {highlightData ? (
            highlightHasImage ? (
              <div className="overflow-hidden rounded-[26px] bg-white shadow-[0_22px_50px_rgba(15,23,42,0.12)]">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[260px] bg-gradient-to-br from-[#101a43] via-[#1a2560] to-[#2b1f5e] p-8 text-white">
                    <span className="inline-flex rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-[#1f3fbf]">
                      {highlightData.category}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                      {highlightData.title}
                    </h2>
                    <p className="mt-3 text-sm text-slate-200 md:text-base">
                      {highlightData.description}
                    </p>
                    <p className="mt-6 text-xs text-slate-200">
                      {formatDate(highlightData.date)} | {highlightData.category}
                    </p>
                  </div>
                  <div className="relative flex items-center justify-center p-6">
                    <div className="relative h-[230px] w-full overflow-hidden rounded-2xl bg-[#eef2ff] shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
                      <Image
                        src={highlightData.imageUrl || "/bg-karyawan.jpeg"}
                        alt={highlightData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <article className="rounded-[20px] border border-[#e6e9f5] bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      badgeStyles[highlightData.category] ||
                      "bg-[#eef2ff] text-[#1f2430]"
                    }`}
                  >
                    {highlightData.category}
                  </span>
                  <h2 className="mt-3 text-lg font-bold text-[#1f2430]">
                    {highlightData.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#4a4f60]">
                    {highlightData.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#6b7185]">
                    <span>
                      {formatDate(highlightData.date)} | {highlightData.category}
                    </span>
                  </div>
                </article>
              </div>
            )
          ) : (
            <div className="rounded-[24px] bg-white p-8 text-center text-sm text-[#6b7185] shadow-[0_22px_50px_rgba(15,23,42,0.12)]">
              Belum ada update untuk ditampilkan.
            </div>
          )}

          <div
            className="mt-8 whats-new-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}
          >
            {updatesList.length ? (
              updatesList.map((item) => (
                <article
                  key={item.id}
                  className="whats-new-card rounded-[16px] border border-[#e6e9f5] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                >
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      badgeStyles[item.category] ||
                      "bg-[#eef2ff] text-[#1f2430]"
                    }`}
                  >
                    {item.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-[#1f2430]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#4a4f60]">{item.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#6b7185]">
                    <span>
                      {formatDate(item.publishDate)} | {item.category}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[20px] border border-[#e6e9f5] bg-white p-6 text-sm text-[#6b7185]">
                Belum ada update untuk ditampilkan.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


