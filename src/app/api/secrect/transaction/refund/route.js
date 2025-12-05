import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.update({
      where: { paymentId },
      data: { status: "REFUNDED" },
    });

    return NextResponse.json({
      message: "Transaction refunded",
      transaction,
    });
  } catch (error) {
    console.log("Refund Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
