import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const cookiesStore = cookies()
        const token = (await cookiesStore).get('token')
        
        if(!token){
            return NextResponse.json({status:"fail",msg:"token not found"})
        }

        const payload = await DecodedJwtToken(token?.value)
        if(!payload.id){
            return NextResponse.json({status:"fail",msg:"userId not found"})
        } 

        const findAddress = await prisma.address.findFirst({
            where:{
                userId:payload.id
            }
        })

        return NextResponse.json({status:"success",data:findAddress},{status:201})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}