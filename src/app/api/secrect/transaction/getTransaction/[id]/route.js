import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.log("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
