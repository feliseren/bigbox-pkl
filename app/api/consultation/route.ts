import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const userId = await readSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

    const data = await request.json();

    const { name, email, phone, company, product, message } = data;

    if (!name || !email || !phone || !product || !message) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Simpan ke database
    const consultation = await prisma.consultation.create({
      data: {
        userId,
        name,
        email,
        phone,
        company: company || null,
        product,
        message,
      },
    });

    // TODO: Kirim email notifikasi ke admin
    // TODO: Kirim email konfirmasi ke user

    return NextResponse.json(
      { success: true, id: consultation.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation API Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan konsultasi" },
      { status: 500 }
    );
  }
}
