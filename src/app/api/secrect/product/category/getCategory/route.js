import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const categories = await prisma.category.findMany({})
        return NextResponse.json({status:"success",categories:categories}, {status:200});

    }
    catch(e){
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}