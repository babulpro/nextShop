import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req,res) {
  try {
    const body = await req.json();
    const {
      amount,
      paymentMethod,
      paymentId,
      orderId,
      currency
    } = body;

    if (!amount || !paymentMethod || !paymentId || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        paymentMethod,
        paymentId,
        orderId,
        currency: currency || "USD",
      },
    });

    return NextResponse.json({
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    console.log("Transaction Create Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
