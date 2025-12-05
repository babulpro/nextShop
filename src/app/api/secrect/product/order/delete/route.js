
import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE(req,res) {
    try {
        const {searchParams}=new URL(req.url);
        const id = searchParams.get('id')

       

        // Get user from token
        const cookiesStore = cookies()
        const token = (await cookiesStore).get('token')

        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" },
                { status: 401 }
            );
        }


        const payload = await DecodedJwtToken(token.value); 
        const userId = payload.id;

        // Use transaction to delete order and related items
        console.log(id,userId)
        const result = await prisma.$transaction(async (tx) => {
            // First, check if order exists and belongs to user
            const order = await tx.order.findFirst({
                where: { 
                    id,
                    userId 
                },
                include: {
                    items: true
                }
            });

            if (!order) {
                throw new Error("Order not found");
            }

            // Check if order can be deleted (only PENDING orders can be deleted)
            if (order.status !== "PENDING") {
                throw new Error(`Cannot delete order with status: ${order.status}. Only PENDING orders can be deleted.`);
            }

            // Restore product inventory before deleting order items
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { 
                        inventory: { 
                            increment: item.quantity 
                        } 
                    }
                });
            }

            // Delete order items first (due to foreign key constraints)
            await tx.orderItem.deleteMany({
                where: { orderId: id }
            });

            // Delete the order
            const deletedOrder = await tx.order.delete({
                where: { id }
            });

            return deletedOrder;
        });

        return NextResponse.json({
            status: "success",
            msg: "Order deleted successfully",
            data: {
                deletedOrderId: result.id
            }
        });

    } catch (error) {
        console.error("Delete order error:", error);
        
        if (error.message === "Order not found") {
            return NextResponse.json(
                { status: "fail", msg: "Order not found" },
                { status: 404 }
            );
        }

        if (error.message.includes("Cannot delete order with status")) {
            return NextResponse.json(
                { status: "fail", msg: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: "fail", msg: "Internal server error" },
            { status: 500 }
        );
    }
}