import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req,res){
    try{
        const data = await req.json(); 
        const name = data?.name?.toLowerCase().trim();
        console.log("Data received in Add Category API:", name);
        if(!name){
            return NextResponse.json({error:"Category name is required"}, {status:400});
        }

        const findCategory = await prisma.category.findUnique({
            where:{
                name:name
            }
        })

        if(findCategory){
            return NextResponse.json({error:"Category already exists"}, {status:400});
        }
        const category = await prisma.category.create({
            data:{
                name:name

            }
        })
        return NextResponse.json({status:"success",category:category}, {status:201});

    }
    catch(e){
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}


export async function GET(req,res){
return NextResponse.json({message:"Hello from category GET API"});
}       