import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const items = await req.json()
        
        // Basic validation
        if (!items || !items.productId || !items.quantity || items.quantity <= 0) {
            return NextResponse.json({
                status: "fail",
                msg: "Invalid order data"
            }, { status: 400 })
        }

        // Authenticate user
        const cookiesStore = await cookies()
        const token = cookiesStore.get('token')
        if (!token?.value) {
            return NextResponse.json({
                status: "fail",
                msg: "Authentication required"
            }, { status: 401 })
        }

        const payload = await DecodedJwtToken(token.value)
        if (!payload?.id) {
            return NextResponse.json({
                status: "fail",
                msg: "Invalid token"
            }, { status: 401 })
        }

        const userId = payload.id

        // Get user's address
        const address = await prisma.address.findFirst({
            where: { userId: userId }
        })
        
        if (!address) {
            return NextResponse.json({
                status: "fail",
                msg: "Please add a shipping address first"
            }, { status: 400 })
        }

        const addressId = address.id
        const totalAmount = items.price * items.quantity

        // Process order in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Check product and inventory FIRST
            const product = await tx.product.findUnique({
                where: { id: items.productId }
            })

            if (!product) {
                throw new Error(`Product ${items.productId} not found`)
            }

            if (product.inventory < items.quantity) {
                throw new Error(`Not enough inventory for ${product.name}. Available: ${product.inventory}, Requested: ${items.quantity}`)
            }

            // Create Order (includes order item in nested create)
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    addressId,
                    status: "PENDING",
                    items: {
                        create: {
                            quantity: items.quantity,
                            price: items.price,
                            color: items.color,
                            size: items.size,
                            productId: items.productId
                        }
                    }
                },
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
                }
            })

            // Decrease inventory
            await tx.product.update({
                where: { id: items.productId },
                data: { 
                    inventory: { 
                        decrement: items.quantity 
                    } 
                }
            })

            return order
        })

        return NextResponse.json({
            status: "success",
            msg: "Order created successfully",
            order: result
        }, { status: 201 })

    } catch (e) {
        console.error("Order creation error:", e)
        
        let status = 500
        let msg = "Failed to create order"
        
        if (e.message.includes("not found") || e.message.includes("Product")) {
            status = 404
            msg = e.message
        } else if (e.message.includes("inventory") || e.message.includes("Not enough")) {
            status = 400
            msg = e.message
        } else if (e.message.includes("token") || e.message.includes("Authentication")) {
            status = 401
            msg = "Authentication failed"
        }

        return NextResponse.json({
            status: "fail",
            msg: msg
        }, { status: status })
    }
}