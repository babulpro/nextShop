import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req,res){

    try{
        const {searchParams} = new URL(req.url)
        const id = searchParams.get('id')

        const data = await prisma.item.findMany({
            where:{
                categoryId:id
            }
        })
        return NextResponse.json({status:"success",data:data})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}