import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function PUT(req,res){
    try{
        const data =await req.json()
        const cookiesStore = cookies()
        const token = (await cookiesStore).get('token')
        const tokenValue = token?.value
        if(!tokenValue){
            return NextResponse.json({status:"fail",msg:"token not found"},{status:404})
        }
        const payload = await DecodedJwtToken(tokenValue)
        if(!payload.id){
            return NextResponse.json({status:"fail",msg:"User id not found"},{status:404})
        }

        const findAddress = await prisma.address.findFirst({
            where:{
                id:data.id,
                userId:payload.id
            }
        })

        if(!findAddress){
            return NextResponse.json({status:"fail",msg:"Address not found"},{status:404})
        }

        const { id, ...updateData}= data

        const updateAddress = await prisma.address.update({
            where:{
                id:data.id
            },
            data:{
                ...updateData
            }
        })
        return NextResponse.json({status:"success",msg:"address update successfully", data:updateAddress},{status:201})


    }
    catch(e){
        return NextResponse.json({
            status:"fail",msg:e
        })
    }
}