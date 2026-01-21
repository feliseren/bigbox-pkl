import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";

const products = [
  {
    name: "BIG ASSISTANT",
    front: "/f-bigassistant.jpg",
    logo: "/bigAssistant_logo.png",
    href: "/produk/big-assistant",
  },
  {
    name: "BIG LEGAL",
    front: "/f_biglegal.jpg",
    logo: "/bigLegal-logo.png",
  },
  {
    name: "BIG SOCIAL",
    front: "/f_bigSocial.jpg",
    logo: "/bigSocial_logo.png",
  },
  {
    name: "BIG VISION",
    front: "/f-bigVision.jpg",
    logo: "/bigVision-logo.png",
  },
];

export default async function ProdukPage() {
  const userId = await readSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  return (
    <div className="min-h-screen bg-white">
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
            <a className="nav-link" href="/">
              Beranda
            </a>
            <a className="nav-link active" href="/produk">
              Produk
            </a>
            <a className="nav-link" href="/cerita-kami">
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

      <main>
        <section className="relative h-[360px] w-full bg-[url('/bg-karyawan.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative mx-auto flex h-full max-w-[1237px] flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="text-3xl font-semibold tracking-wide md:text-4xl">
              PRODUK KAMI
            </h1>
            <div className="mt-3 h-[3px] w-[140px] bg-white" />
            <p className="mt-4 max-w-3xl text-sm font-medium md:text-base">
              Kami menyediakan platform Artificial Intelligence dan Big Data
              Analytics yang komprehensif untuk membantu organisasi mengubah
              data menjadi insight bernilai dalam pengambilan keputusan bisnis.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1237px] px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const card = (
                <div className="flip-card h-[363px] overflow-hidden rounded-[18px] border border-[#1f1f1f] bg-black shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
                  <div className="flip-card-inner">
                    <div className="flip-face">
                      <div className="relative h-full">
                        <Image
                          src={product.front}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xl font-semibold uppercase text-white drop-shadow-md">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-face flip-back">
                      <div className="flex h-full items-center justify-center bg-[#b9b9b9]">
                        <Image
                          src={product.logo}
                          alt={`${product.name} logo`}
                          width={220}
                          height={90}
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (!product.href) {
                return <div key={product.name}>{card}</div>;
              }

              return (
                <a key={product.name} href={product.href}>
                  {card}
                </a>
              );
            })}
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
