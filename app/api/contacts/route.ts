import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const userId = await readSessionUserId();
  if (!userId) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent("/hubungi-kami")}`, request.url),
    );
  }

  const formData = await request.formData();
  const fullName = readValue(formData, "fullName");
  const phoneCode = readValue(formData, "phoneCode");
  const phoneNumber = readValue(formData, "phoneNumber");
  const companyName = readValue(formData, "companyName");
  const industry = readValue(formData, "industry");
  const industryOther = readValue(formData, "industryOther");
  const companyEmail = readValue(formData, "companyEmail");
  const companyScale = readValue(formData, "companyScale");
  const message = readValue(formData, "message");
  const agreement = formData.get("agreement") !== null;

  if (
    !fullName ||
    !phoneCode ||
    !phoneNumber ||
    !companyName ||
    !industry ||
    !companyEmail ||
    !companyScale ||
    !message ||
    !agreement
  ) {
    return NextResponse.redirect(new URL("/hubungi-kami?error=1", request.url));
  }

  await prisma.customerContact.create({
    data: {
      userId,
      fullName,
      phoneCode,
      phoneNumber,
      companyName,
      industry,
      industryOther: industryOther || null,
      companyEmail,
      companyScale,
      message,
    },
  });

  return NextResponse.redirect(new URL("/hubungi-kami?success=1", request.url));
}
