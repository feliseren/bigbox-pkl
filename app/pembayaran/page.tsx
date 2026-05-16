import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { PaymentForm } from "@/components/payment-form";

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
    <div className="min-h-screen bg-white px-6 py-10 text-[#1f2430]">
      <div className="mx-auto max-w-[880px] space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Halaman Pembayaran</h1>
          <p className="text-sm text-[#6b7185]">
            Lengkapi detail pembayaran untuk melanjutkan pesanan.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold">Nama</p>
          <p className="text-sm text-[#6b7185]">{user?.fullName ?? "-"}</p>
        </div>

        {product ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-semibold">
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-[#6b7185]">
            Produk belum dipilih. Silakan kembali ke halaman produk dan pilih paket.
          </div>
        )}
      </div>
    </div>
  );
}
