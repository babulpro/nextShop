import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(req,re){
    try{
        const allProducts = await prisma.product.findMany({})
        return NextResponse.json({status:"success",data:allProducts}, {status:200});

    }
    catch(e){
        return NextResponse.json({
            status:"fail",msg:e
        })
    }
}