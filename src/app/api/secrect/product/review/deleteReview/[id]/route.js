export async function DELETE(req,res,{params}){
    try{
        const id = params.id
        return NextResponse.json({status:"success",data:id})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}