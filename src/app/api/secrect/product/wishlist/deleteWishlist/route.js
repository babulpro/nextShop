
 import { NextResponse } from 'next/server'
 import prisma from "@/lib/prisma"
 import {cookies} from "next/headers"
 import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"

 export async function DELETE(req,res){
    try{
        const {searchParams}=new URL(req.url)
        const id = searchParams.get('id')
        const cookiesStore = cookies()
        const token =(await cookiesStore).get('token')
        if(!token){
            return NextResponse.json({
                status:"fail",msg:"token not found"
            })
        }
        const payload = await DecodedJwtToken(token?.value)

        const newWishlist = await prisma.wishlist.delete({
            where:{ 
                userId_productId:{
                    userId:payload.id,
                    productId:id
                }
             
            }
        })

        return NextResponse.json({status:"success",data:newWishlist})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
 }