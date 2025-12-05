// Create this file: app/api/orders/test/route.js
import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const cookiesStore = cookies();
        const token = (await cookiesStore).get('token');
        const payload = await DecodedJwtToken(token?.value);
        const userId = payload.id;

        // Get your latest order
        const latestOrder = await prisma.order.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });


        if (!latestOrder) {
            return NextResponse.json({ error: "No orders found" });
        }
 
 

        return NextResponse.json({latestOrder
        });

    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}