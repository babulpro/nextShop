 import prisma from "@/lib/prisma";
 import { NextResponse } from "next/server";
 export const dynamic = 'force-dynamic';
 
 export async function POST(req,res){
     try{
 
         const data= await req.json()                
          
         const findCategory=await prisma.category.findUnique({
             where:{
                 name:data.categoryName
             }
         })
 
         if(!findCategory){
             return NextResponse.json({status:"fail",msg:"Category not found"}, {status:404});
         }
         if(!data.name || !data.categoryName){
             return NextResponse.json({status:"fail",msg:"Name and Category Name are required"}, {status:400});
         }
 
 
 
         data.categoryId= findCategory.id
 
          const findItem = await prisma.item.findFirst({
             where:{
                 name:data.name
             }
         })
 
 
         if(findItem){
             return NextResponse.json({status:"fail",msg:"Item already exists"}, {status:400});
         }
         
 
         const createItem= await prisma.item.create({
             data:{
                 name:data.name,
                 categoryId:data.categoryId,
             }}
         )
         return NextResponse.json({status:"success",data:createItem}, {status:200});
 
     }
     catch(e){
         return NextResponse.json({status:"fail",msg:e})
     }
 }
 