import Link from "next/link";
import React from "react";
interface buttonprop{
    link:string;
    name:string;
}
// home page button component
export default function Button({link , name}:buttonprop){
    return(
    <button className="flex justify-center items-center p-2 text-white text-bold w-full bg-gray-800 rounded-xl "><Link href={link} >{name}</Link></button>
    )
}