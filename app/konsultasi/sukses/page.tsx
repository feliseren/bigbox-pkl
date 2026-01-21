"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SuksesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b3d] to-[#1a0f2e] text-white">
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
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500 p-4">
              <svg
                className="h-16 w-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold">Terima Kasih!</h1>
          <p className="mb-8 text-lg text-gray-300">
            Konsultasi Anda telah berhasil dikirim. Tim kami akan segera
            menghubungi Anda dalam waktu 24 jam.
          </p>

          <div className="rounded-lg border-2 border-[#ff6b3d] bg-[#1a0f2e] p-6">
            <p className="mb-4 text-sm text-gray-400">
              Email konfirmasi akan dikirim ke alamat email Anda. Jika Anda
              tidak menerima email dalam beberapa menit, silakan periksa folder
              spam.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-8 rounded-lg bg-[#ff6b3d] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#ff5722]"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
