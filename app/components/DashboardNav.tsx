"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Signout from "./SignOut";

// dashboard navigation bar
export default function DashboardNav() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
   const DeleteUser = async()=>{
       try{
      const data = await fetch(`/api/user/delete`,{
        method:"DELETE"
      });
      if(data.ok){
          alert("Account deleted")
          signOut({callbackUrl :"/"})
          
      }
      if(!data.ok){
          alert("Unable to delete your Account")
          
      }
    }
      catch(e){
        alert(`failed to delete Account ${e}`)
      }
     }
     

  return (
    <div className="flex flex-col md:flex-row md:h-screen  text-white overflow-hidden">
      
      {/* <div className="w-full md:w-1/4 p-6 flex flex-col">
        <h1 className="text-2xl font-extrabold">
          <Link href="/">Welcome {session?.user.name}</Link>
        </h1>
        <div className="mt-5">
          <Signout />
        </div>
      </div> */}

      
      <nav className="w-full md:w-1/2 bg-gray-900 p-6 flex flex-col   md:rounded-b-none ">
      <h1 className="text-2xl font-extrabold">
          <Link href="/">Welcome {session?.user.name}</Link>
        </h1>
        <div className="mt-5">
          <Signout />
          <button onClick={()=>DeleteUser()}> Delete Account</button>
        </div>
        <ul className="flex flex-col gap-4 text-white">
          {session?.user.role === "provider" && (
            <li>
              <Link href="#receive" className="hover:underline">
                Bookings Received
              </Link>
            </li>
          )}

          <li>
            <Link href="#bookings" className="hover:underline">
              Your Bookings
            </Link>
          </li>

          {session?.user.role === "provider" && (
            <li>
              <Link href="#vehicle" className="hover:underline">
                Your Vehicles
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
