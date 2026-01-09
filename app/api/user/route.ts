import { connectDataBase } from "@/lib/db";
import User from "@/models/user"

import { NextRequest, NextResponse } from "next/server";

// adding new user to the db
export async function POST(req:NextRequest){
    await connectDataBase();
    
     const {name,email,phone,role,password,address} = await req.json();
     const exsistingUser = await User.findOne({email})
    
     
     if(exsistingUser){
      return NextResponse.json({message:"already exist"})
      
     }
     const user = await User.create({name,email,phone,role,password,address})
      return NextResponse.json({message:"created",data:user})
}
export async  function GET(){
  await connectDataBase();
  const user = await User.find();
  if(user){
    return NextResponse.json({message:"User found",status:200, data:user})
  }
  else{
    return NextResponse.json({message:"user does not exist",status:400})
  }
}
// export async function getbyEmail(req:NextRequest){
//   await connectDataBase();
//   const email = await req.json();
//   const data = await User.findOne({email})
//   if(data){
//     NextResponse.json({id:data._id})
//   }
//   else{
//     NextResponse.json({message:"not available" })
//   }

// }
// export async function GETBYID(req:NextRequest,id:string){
//   await connectDataBase();
//    const user = await User.find({_id:id}).select("name")
//   if(user){
//     return NextResponse.json({message:"User found",status:200, data:user})
//   }
//   else{
//     return NextResponse.json({message:"user not exist",status:400})
//   }
// }   
//     // return NextResponse.json({message:"route is working",status:200})



// export async  function DELETE(request:any){
//    const id = request.nextUrl.searchParams.get("id")
//    await connectDataBase()
//    await user.findByIdAndDelete(id)
//    NextResponse.json({message:"deleted", status:200})

// }
// export  async function PUT(request:any){
//     await connectDataBase()
//     const {newData} = request.json()
//     await user.findByIdAndUpdate(newData)
//     NextResponse.json({message:"updated",status:200})
// }