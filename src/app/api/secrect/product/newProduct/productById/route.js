import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const {searchParams} = new URL(req.url)
        const id = searchParams.get('id')
        const allProducts = await prisma.product.findMany({
            where:{
                id:id
            }
        })
        
        return NextResponse.json({status:"success",data:allProducts}, {status:200});

    }
    catch(e){
        return NextResponse.json({
            status:"fail",msg:e
        })
    }
}