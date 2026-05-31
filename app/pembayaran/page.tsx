import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { PaymentForm } from "@/components/payment-form";
import { BackButton } from "@/components/back-button";

export const dynamic = "force-dynamic";

type PaymentProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

type PaymentSearchParams = {
  productType?: string | string[];
  productId?: string | string[];
};

type PaymentProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
};

const PRODUCT_TITLE: Record<PaymentProductType, string> = {
  "big-assistant": "Big Assistant",
  "big-legal": "Big Legal",
  "big-social": "Big Social",
  "big-vision": "Big Vision",
};

function normalizeParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

async function loadProduct(
  productType: PaymentProductType,
  productId: string,
): Promise<PaymentProduct | null> {
  const categoryName = PRODUCT_TITLE[productType];
  const item = await prisma.product.findFirst({
    where: { id: productId, category: { categoryName } },
  });
  if (!item) return null;
  return {
    id: item.id,
    name: item.namaProduk,
    description: item.deskripsiProduk,
    price: item.hargaProduk,
  };
}

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams?: Promise<PaymentSearchParams>;
}) {
  const userId = await readSessionUserId();
  if (!userId) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const resolvedSearchParams = await searchParams;
  const productType = normalizeParam(resolvedSearchParams?.productType) as
    | PaymentProductType
    | undefined;
  const productId = normalizeParam(resolvedSearchParams?.productId);
  const product =
    productType && productId ? await loadProduct(productType, productId) : null;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#f3f6ff] via-[#f8faff] to-white px-6 py-4 text-[#1f2430]">
      <div className="mx-auto flex h-full max-w-[980px] flex-col gap-4">
        <div className="shrink-0 rounded-2xl border border-[#dbe3ff] bg-white/90 px-5 py-4 shadow-[0_10px_30px_rgba(42,58,215,0.08)] backdrop-blur">
          <BackButton
            className="mb-2 inline-flex items-center rounded-lg border border-[#cfd9fb] bg-[#f6f8ff] px-3 py-1.5 text-xs font-semibold text-[#2a46e6] transition hover:bg-[#e8eeff]"
            label="< Kembali"
          />
          <h1 className="text-xl font-semibold text-[#172554]">Halaman Pembayaran</h1>
          <p className="text-xs text-[#6b7185]">
            Lengkapi detail pembayaran untuk melanjutkan pesanan.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-[#dbe3ff] bg-white p-4 shadow-[0_8px_24px_rgba(24,46,122,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7185]">Nama</p>
          <p className="text-sm font-medium text-[#1f2430]">{user?.fullName ?? "-"}</p>
        </div>

        {product ? (
          <div className="min-h-0 flex-1 rounded-2xl border border-[#dbe3ff] bg-white p-4 shadow-[0_12px_32px_rgba(24,46,122,0.09)]">
            <div className="mb-3 inline-flex rounded-full bg-[#e8edff] px-3 py-1 text-xs font-semibold text-[#1f3fd6]">
              {PRODUCT_TITLE[productType ?? "big-assistant"]}
            </div>
            <PaymentForm
              productType={productType ?? "big-assistant"}
              productId={product.id}
              productName={product.name}
              productDescription={product.description}
              productPrice={product.price}
              paymentMethods={[
                {
                  value: "Transfer BRI: 123456 a.n. Felis",
                  label: "Transfer BRI: 123456 a.n. Felis",
                },
                {
                  value: "Transfer BCA: 098754 a.n. Eren",
                  label: "Transfer BCA: 098754 a.n. Eren",
                },
                {
                  value: "Transfer Mandiri: 32423543 a.n. Cristi",
                  label: "Transfer Mandiri: 32423543 a.n. Cristi",
                },
                {
                  value: "ShopeePay: 088263822374",
                  label: "ShopeePay: 088263822374",
                },
                {
                  value: "GoPay: 088263822374",
                  label: "GoPay: 088263822374",
                },
                { value: "DANA: 088263822374", label: "DANA: 088263822374" },
                { value: "OVO: 088263822374", label: "OVO: 088263822374" },
              ]}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-[#dbe3ff] bg-white p-4 text-sm text-[#6b7185]">
            Produk belum dipilih. Silakan kembali ke halaman produk dan pilih paket.
          </div>
        )}
      </div>
    </div>
  );
}
