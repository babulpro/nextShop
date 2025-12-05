import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const { productId, quantity = 1, size = "M", color = "BLACK" } = await req.json();

        // Validate input
        if (!productId) {
            return NextResponse.json(
                { status: "fail", msg: "Product ID is required" },
                { status: 400 }
            );
        }

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

     

        // Check if product exists and has inventory
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                inventory: true,
                name: true,
                size: true,
                color: true
            }
        });

        if (!product) {
            return NextResponse.json(
                { status: "fail", msg: "Product not found" },
                { status: 404 }
            );
        }
        

        // Validate size and color against product options (case-insensitive)
        const isValidSize = product.size.some(s => s.toLowerCase() === size.toLowerCase());
        const isValidColor = product.color.some(c => c.toLowerCase() === color.toLowerCase());

        if (!isValidSize) {
            return NextResponse.json(
                { status: "fail", msg: `Invalid size. Available sizes: ${product.size.join(', ')}` },
                { status: 400 }
            );
        }

        if (!isValidColor) {
            return NextResponse.json(
                { status: "fail", msg: `Invalid color. Available colors: ${product.color.join(', ')}` },
                { status: 400 }
            );
        }

        if (product.inventory < quantity) {
            return NextResponse.json(
                { status: "fail", msg: `Not enough inventory. Available: ${product.inventory}` },
                { status: 400 }
            );
        }

        // Use transaction for cart operations
        const result = await prisma.$transaction(async (tx) => {
            // Get or create user's cart
            let cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });

            if (!cart) {
                cart = await tx.cart.create({
                    data: { userId },
                    include: { items: true }
                });
            }

            // Convert color to uppercase to match enum (if using enum)
            // If your enum values are uppercase like "RED", "BLACK", etc.
            const normalizedColor = color.toUpperCase();
            const normalizedSize = size.toUpperCase();

            // Check if item already exists in cart with same size and color
            const existingCartItem = await tx.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId: productId,
                    size: normalizedSize,
                    color: normalizedColor
                }
            });

            let cartItem;
            
            if (existingCartItem) {
                // Update quantity if item exists
                cartItem = await tx.cartItem.update({
                    where: {
                        id: existingCartItem.id
                    },
                    data: {
                        quantity: existingCartItem.quantity + quantity
                    },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                                inventory: true
                            }
                        }
                    }
                });
            } else {
                // Create new cart item
                cartItem = await tx.cartItem.create({
                    data: {
                        quantity,
                        size: normalizedSize,
                        color: normalizedColor,
                        productId,
                        cartId: cart.id
                    },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                                inventory: true
                            }
                        }
                    }
                });
            }

            // Get updated cart with all items
            const updatedCart = await tx.cart.findUnique({
                where: { id: cart.id },
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
                        }
                    }
                }
            });

            return updatedCart;
        });

        // Calculate totals
        const totalItems = result.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = result.items.reduce((sum, item) => {
            const productPrice = item.product.compareAtPrice && item.product.discountPercent > 0 
                ? item.product.compareAtPrice * (1 - item.product.discountPercent / 100)
                : item.product.price;
            return sum + (productPrice * item.quantity);
        }, 0);

        return NextResponse.json({
            status: "success",
            msg: "Item added to cart successfully",
            data: {
                cart: result,
                totalItems,
                totalAmount: parseFloat(totalAmount.toFixed(2))
            }
        });

    } catch (error) {
        
        
        if (error.code === 'P2002') {
            return NextResponse.json(
                { status: "fail", msg: "Item already in cart" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: "fail", msg: "Internal server error" },
            { status: 500 }
        );
    }
}