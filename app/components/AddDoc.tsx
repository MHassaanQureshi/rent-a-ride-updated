"use client";
import React from "react";
import {useState,useEffect} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import vehicle from "@/models/vehicle";

interface props{
    Vehicle_id : string,
    booking_id : string,
}
export default function AddSlip({booking_id,Vehicle_id}:props){
   const [images,setimages] = useState<File[]>([])
    const [uploaded,setuploaded] = useState(false)
    
    const toBase64 = (file: File): Promise<string> =>{
    return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)})}
  
    
      
        const handleSubmit = async(e:React.FormEvent)=>{
         
                      e.preventDefault();
                      const base64Images :string[] =[]
                      for(const File of images){
                          const Converted = await toBase64(File)
                          base64Images.push(Converted)
                      }
          
        
          try{
            const data = await fetch("/api/slip",{
              method:"POST",
              body: JSON.stringify({booking_id,Vehicle_id,image:base64Images})
            })
            if(data.ok){
              alert("slip uploaded")
              setuploaded(true)
            }
            if(!data.ok){
              alert("slip not uploaded")
            }
          }catch(e){
            alert(`unable to upload slip ${e}`)
          }
             
                
    
        }
      
      
      
    
    return(
         <Popover>
            <PopoverTrigger className="bg-green-500 p-2 rounded" >Upload Documents</PopoverTrigger>
             <PopoverContent >
                <form onSubmit={handleSubmit}>
                  <h1 className="bg-gray-600 text-white p-2 rounded">Please upload the 50% paid slip, driving License and Identity card Image Front and back</h1>
                  <input type="file" multiple accept="image/*"  name="image" className="text-black border-b-2 border-black w-[80%]"  onChange={(e)=> setimages(Array.from(e.target.files ||[]))} required  />
                    <button type="submit">Submit</button></form> </PopoverContent>
        </Popover>
    )
  }