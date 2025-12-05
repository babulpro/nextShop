import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.update({
      where: { paymentId },
      data: { status },
    });

    return NextResponse.json({
      message: "Transaction status updated",
      transaction,
    });
  } catch (error) {
    console.log("Update Status Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
