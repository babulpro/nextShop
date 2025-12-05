import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


const dynamic = 'force-dynamic';

export async function GET(req,res){
    try{
        const categories = await prisma.item.findMany({
            include:{
                category:true
            }
        });


        return NextResponse.json({status:"success",categories:categories}, {status:200});

    }
    catch(e){
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}
