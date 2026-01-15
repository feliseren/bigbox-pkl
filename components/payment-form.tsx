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
      window.location.href = "/";
    } catch (error) {
      setIsSubmitting(false);
      window.alert("Gagal mengirim pembayaran. Coba lagi.");
    }
  }

  return (
    <form
      className="grid gap-4"
      method="post"
      action="/api/payments"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="productType" value={productType} />
      <input type="hidden" name="productId" value={productId} />
      <label className="grid gap-2 text-sm font-semibold">
        Nama Produk
        <input
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
          name="productName"
          defaultValue={productName}
          readOnly
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Deskripsi
        <textarea
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
          name="description"
          rows={3}
          defaultValue={productDescription}
          readOnly
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Harga Produk
          <input
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
            name="price"
            defaultValue={productPrice}
            readOnly
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Total Pembayaran
          <input
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
            name="total"
            defaultValue={productPrice}
            readOnly
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Jenis Pembayaran
          <select
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
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
        <label className="grid gap-2 text-sm font-semibold">
          Bukti Pembayaran
          <input
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal"
            name="paymentProof"
            type="file"
            accept="image/*,.pdf"
            required
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-lg bg-[#1f53ff] px-5 py-2 text-sm font-semibold text-white"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
