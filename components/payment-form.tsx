"use client";

import { useState } from "react";

type PaymentMethodOption = {
  value: string;
  label: string;
};

type PaymentFormProps = {
  productType: string;
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  paymentMethods: PaymentMethodOption[];
};

export function PaymentForm({
  productType,
  productId,
  productName,
  productDescription,
  productPrice,
  paymentMethods,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      window.location.href = "/profile";
    } catch (error) {
      setIsSubmitting(false);
      window.alert("Gagal mengirim pembayaran. Coba lagi.");
    }
  }

  return (
    <form
      className="grid gap-3 lg:grid-cols-2"
      method="post"
      action="/api/payments"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="productType" value={productType} />
      <input type="hidden" name="productId" value={productId} />
      <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
        Nama Produk
        <input
          className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
          name="productName"
          defaultValue={productName}
          readOnly
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
        Deskripsi
        <textarea
          className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
          name="description"
          rows={2}
          defaultValue={productDescription}
          readOnly
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2 lg:col-span-2">
        <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
          Harga Produk
          <input
            className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
            name="price"
            defaultValue={productPrice}
            readOnly
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
          Total Pembayaran
          <input
            className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
            name="total"
            defaultValue={productPrice}
            readOnly
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:col-span-2">
        <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
          Jenis Pembayaran
          <select
            className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
            name="paymentMethod"
            required
          >
            <option value="">Pilih metode</option>
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[#1e2a49]">
          Bukti Pembayaran
          <input
            className="rounded-xl border border-[#cfd9fb] bg-[#fafcff] px-3 py-2 text-sm font-normal shadow-sm outline-none transition focus:border-[#4b6bff] focus:ring-2 focus:ring-[#dce5ff]"
            name="paymentProof"
            type="file"
            accept="image/*,.pdf"
            required
          />
        </label>
      </div>
      <div className="mt-1 flex justify-end border-t border-[#e5eaff] pt-3 lg:col-span-2">
        <button
          className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl bg-gradient-to-r from-[#2a46e6] to-[#3f6bff] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,70,230,0.35)] transition hover:from-[#2039c9] hover:to-[#3358de] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Selesai"}
        </button>
      </div>
    </form>
  );
}
