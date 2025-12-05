import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req,res){
    try{
        const data = await req.json()
        const {searchParams} = new URL(req.url)
        const productId = searchParams.get('id')
        const storesCookies = cookies()
        const token = (await storesCookies).get('token') 
        if(!token){
            return NextResponse.json({status:"fail",msg:"token not found"})
        } 
        const payload = await DecodedJwtToken(token?.value)

        const userId = payload.id
        data.userId=userId
        data.productId = productId 
        
        const review = await prisma.review.create({
            data:{
                ...data
            }
        })
         
        return NextResponse.json({status:"success",data:review})
    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}