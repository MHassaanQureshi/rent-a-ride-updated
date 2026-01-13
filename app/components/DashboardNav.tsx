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
    <nav className="w-full md:w-64 bg-white border-r border-gray-200 p-6 h-full shadow-sm">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900 truncate">
          Welcome, {session?.user.name}
        </h1>
        <span className="text-xs text-gray-500 capitalize">{session?.user.role}</span>
      </div>

      <ul className="space-y-1 mb-8">
        {session?.user.role === "provider" && (
          <li>
            <a
              href="#receive"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 group transition-colors"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Bookings Received
            </a>
          </li>
        )}

        <li>
          <a
            href="#bookings"
            className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 group transition-colors"
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Your Bookings
          </a>
        </li>

        {session?.user.role === "provider" && (
          <li>
            <a
              href="#vehicle"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 group transition-colors"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Your Vehicles
            </a>
          </li>
        )}
      </ul>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => DeleteUser()}
          className="w-full text-left text-red-600 hover:text-red-700 flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Delete Account
        </button>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Signout />
        </div>
      </div>
    </nav>
  );
}
