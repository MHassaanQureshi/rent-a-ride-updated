"use client"
import React from "react"
import { signOut } from "next-auth/react"
// signout button
export default function Signout(){
    return(
        <>
        <button onClick={()=>signOut({callbackUrl :"/"})} className="  bg-red-600 text-white border-2 border-black rounded-2xl p-4"> Sign Out</button></>
    )
}