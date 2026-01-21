import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = String(formData.get("orderId") || "").trim();

  if (!orderId) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-pemesanan?error=1", request.url),
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { statusPesanan: "Done" },
  });

  return NextResponse.redirect(
    new URL("/dashboard_karyawan/daftar-pemesanan", request.url),
  );
}
