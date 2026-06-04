"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function KonsultasiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedProduct = searchParams.get("product");

  const [step, setStep] = useState<"select" | "form">(
    selectedProduct ? "form" : "select"
  );
  const [product, setProduct] = useState(selectedProduct || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const products = [
    {
      id: "BigAI",
      name: "BIG AI",
      description: "Solusi AI untuk Keputusan Bisnis yang Lebih Cerdas",
      features: ["Insight Berbasis Data", "Prediksi Pertumbuhan", "Analisis Otomatis"],
      icon: "/bigAssistant_logo.png",
    },
    {
      id: "BigVision",
      name: "BIG VISION",
      description: "Platform Analitik Visual untuk Pemahaman Data Mendalam",
      features: ["Visualisasi Data", "Dashboard Real-time", "Laporan Cerdas"],
      icon: "/bigVision-logo.png",
    },
  ];

  const handleSelectProduct = (productId: string) => {
    setProduct(productId);
    setStep("form");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          product,
        }),
      });

      if (!response.ok) throw new Error("Gagal mengirim konsultasi");

      // Redirect ke halaman sukses
      router.push("/konsultasi/sukses");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim"
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2d1b3d] to-[#1a0f2e] text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 site-header">
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
            <button
              onClick={() => router.push("/")}
              className="text-sm font-semibold text-white hover:text-gray-200"
            >
              Kembali
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-[1237px] px-6 py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Pilih Produk untuk Konsultasi
            </h1>
            <p className="text-lg text-gray-300">
              Dapatkan solusi terbaik dari tim ahli kami
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-lg border-2 border-[#ff6b3d] bg-[#1a0f2e] p-8 transition-all hover:bg-[#2d1b3d]"
              >
                <div className="mb-6 flex justify-center">
                  <Image
                    src={prod.icon}
                    alt={prod.name}
                    width={80}
                    height={80}
                  />
                </div>
                <h2 className="mb-2 text-center text-2xl font-bold">
                  {prod.name}
                </h2>
                <p className="mb-6 text-center text-gray-300">
                  {prod.description}
                </p>
                <ul className="mb-8 space-y-2">
                  {prod.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <span className="mr-3 text-[#ff6b3d]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectProduct(prod.id)}
                  className="w-full rounded-lg bg-[#ff6b3d] py-3 font-semibold text-white transition-colors hover:bg-[#ff5722]"
                >
                  Konsultasi {prod.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b3d] to-[#1a0f2e] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 site-header">
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
          <button
            onClick={() => setStep("select")}
            className="text-sm font-semibold text-white hover:text-gray-200"
          >
            Ganti Produk
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold">
            Konsultasi {product === "BigAI" ? "BIG AI" : "BIG VISION"}
          </h1>
          <p className="text-gray-300">
            Hubungi tim kami untuk mendiskusikan kebutuhan bisnis Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/20 p-4 text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block font-semibold">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-500 bg-[#1a0f2e] px-4 py-3 text-white focus:border-[#ff6b3d] focus:outline-none"
              placeholder="Nama Anda"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-500 bg-[#1a0f2e] px-4 py-3 text-white focus:border-[#ff6b3d] focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold">Nomor Telepon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-500 bg-[#1a0f2e] px-4 py-3 text-white focus:border-[#ff6b3d] focus:outline-none"
                placeholder="+62 8xx xxxx xxxx"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Nama Perusahaan (Opsional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-500 bg-[#1a0f2e] px-4 py-3 text-white focus:border-[#ff6b3d] focus:outline-none"
              placeholder="Nama perusahaan Anda"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Pesan</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full rounded-lg border border-gray-500 bg-[#1a0f2e] px-4 py-3 text-white focus:border-[#ff6b3d] focus:outline-none"
              placeholder="Ceritakan tentang kebutuhan atau pertanyaan Anda..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff6b3d] py-3 font-semibold text-white transition-colors hover:bg-[#ff5722] disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Konsultasi"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function KonsultasiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#2d1b3d] to-[#1a0f2e] text-white flex items-center justify-center">
        <p className="text-sm font-semibold text-[#ff6b3d]">Memuat...</p>
      </div>
    }>
      <KonsultasiContent />
    </Suspense>
  );
}


