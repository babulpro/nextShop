import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req,res){
    try{
        const data = await req.json()
       

        const cookiesStore = cookies()
        const token = (await cookiesStore).get('token')
        const tokenValue = token?.value 

        if(!tokenValue){
            return NextResponse.json({status:"fail",msg:"no token found"},{status:404})
        }

        const payload = await DecodedJwtToken(tokenValue) 

        if(!payload){
            return NextResponse.json({status:"fail",msg:"invalid token"},{status:404})
        }
        data.userId = payload.id
         
        const newAddress = await prisma.address.create({
            data:{
                ...data
            }
        })

        return NextResponse.json({status:"success",msg:"address update successfull",data:newAddress},{status:200})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}