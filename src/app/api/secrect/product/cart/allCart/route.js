import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        // Get user from token
         // Get user from token
        const cookiesStore = cookies()
        const token = (await cookiesStore).get('token') 
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await DecodedJwtToken(token?.value);
        const userId = payload.id;

        // Get user's cart with items and product details
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                                inventory: true,
                                discountPercent: true,
                                compareAtPrice: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        // If no cart exists, return empty cart
        if (!cart) {
            return NextResponse.json({
                status: "success",
                data: {
                    cart: null,
                    items: [],
                    totalItems: 0,
                    totalAmount: 0
                }
            });
        }

        // Calculate totals
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cart.items.reduce((sum, item) => {
            const productPrice = item.product.compareAtPrice && item.product.discountPercent > 0 
                ? item.product.compareAtPrice * (1 - item.product.discountPercent / 100)
                : item.product.price;
            return sum + (productPrice * item.quantity);
        }, 0);

        return NextResponse.json({
            status: "success",
            data: {
                cart,
                items: cart.items,
                totalItems,
                totalAmount: parseFloat(totalAmount.toFixed(2))
            }
        });

    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Internal server error" },
            { status: 500 }
        );
    }
}

