import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
         const {searchParams} =new URL(req.url)
         const id = searchParams.get('id')
         

        // Get user from token
        const cookiesStore = cookies();
        const token = (await cookiesStore).get('token');
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await DecodedJwtToken(token?.value);
        const userId = payload.id;
         

        // Delete the specific cart item
        const deletedItem = await prisma.cartItem.delete({
            where: {
                id: id,
                cart: {
                    userId: userId // Ensure user owns this cart item
                }
            },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                }
            }
        });

        return NextResponse.json({
            status: "success",
            msg: "Item removed from cart successfully",
            data: {
                deletedItem: {
                    id: deletedItem.id,
                    productName: deletedItem.product.name,
                    quantity: deletedItem.quantity,
                    size: deletedItem.size,
                    color: deletedItem.color
                }
            }
        });

    } catch (error) {
        console.error("Delete cart item error:", error);
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { status: "fail", msg: "Cart item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "fail", msg: "Internal server error" },
            { status: 500 }
        );
    }
}