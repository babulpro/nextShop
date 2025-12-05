import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req,res){
    try{
        const data= await req.json() 
        const newProduct = await prisma.product.create({
            data:{
                ...data
            }
        })
        return NextResponse.json({status:"success",data:newProduct})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}