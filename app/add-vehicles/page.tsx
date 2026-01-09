
import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddVehicle from "../components/AddVehicle";
import Button from "../components/Button";
import Link from "next/link";

export default async function AddVehicles(){
    const session  = await getServerSession(authOptions);
  
    if(session?.user.role === "provider"){
        return(
            <AddVehicle />
        )
    }
    if(session?.user.role === "user"){
       return(
        (
            <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
               <div className="w-[40%] flex items-center justify-center flex-col gap-4">
                 <h1 className="text-xl font-bold">You need to register yourself as a provider to list you vehicle</h1>
                <button className="bg-gray-800 rounded-2xl text-white p-4 hover:bg-gray-700"><Link href="/auth/register">Register Yourself</Link></button>
               </div>
            </div>
        )
       )
    }
    if(!session?.user.role){
        return(
             <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
               <div className="w-[40%] flex items-center justify-center flex-col gap-4">
                 <h1 className="text-xl font-bold">You need to register yourself as a provider to list you vehicle</h1>
                <button className="bg-gray-800 rounded-2xl text-white p-4 hover:bg-gray-700"><Link href="/auth/register">Register Yourself</Link></button>
               </div>
            </div>
        )
    }
   
}