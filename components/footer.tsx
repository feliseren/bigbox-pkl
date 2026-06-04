import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer py-12 text-sm text-white">
      <div className="mx-auto grid max-w-[1237px] gap-8 px-6 md:grid-cols-[1.5fr_1fr]">
        {/* Left Column: Brand & Details */}
        <div className="space-y-6">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <Image
              src="/bigbox_logo-removebg-preview.png"
              alt="BigBox logo"
              width={215}
              height={68}
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-[14px] font-medium leading-[164%] text-white/95 max-w-md">
            Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
            Baru, Jakarta Selatan.
          </p>
          <p className="text-[13px] font-medium text-white/80">
            © 2025 BigBox. All Rights Reserved.{" "}
            <span className="mx-1">|</span>{" "}
            <Link href="/syarat-ketentuan" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Privacy Policy
            </Link>{" "}
            <span className="mx-1">|</span>{" "}
            <Link href="/syarat-ketentuan" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>

        {/* Right Column: Socials & Navigation */}
        <div className="flex flex-col gap-6 md:items-end justify-between md:text-right">
          {/* Social Media Links */}
          <div className="flex gap-4 md:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#ff6b3d] hover:text-white hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#ff6b3d] hover:text-white hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0a1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#ff6b3d] hover:text-white hover:scale-110"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#ff6b3d] hover:text-white hover:scale-110"
              aria-label="YouTube"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Site Navigation */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end text-[13px] font-semibold uppercase tracking-[0.08em] text-white/90">
            <Link href="/cerita-kami" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Tentang Kami
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/hubungi-kami" className="hover:text-[#ff6b3d] transition-colors duration-200">
              Hubungi Kami
            </Link>
          </div>

          {/* Details (Additional) */}
          <p className="text-[13px] font-medium leading-[118%] text-white/70 max-w-sm">
            Telkom Kebayoran, 4th Floor, Jl. Sisingamangaraja No.4, Kebayoran
            Baru, Jakarta Selatan.
          </p>
        </div>
      </div>
    </footer>
  );
}
