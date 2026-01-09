import React from "react";

interface Props {
  booking_id: string;
  image: [];
 
}
// showing slip component
interface SlipProp {
  car: Props;
}

export default function Slipview({ car }: SlipProp) {
 if(car.image){
  return(
   <>
   <div className="flex flex-col ">
     {car.image.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Thumb ${i}`}
              className={` w-48 h-48 object-cover rounded-md border-2 cursor-pointer `}
              
            />
          ))}
   </div>
   </>
  )
}
else{
  return(
    <h1 className="text-black font-extrabold text-2xl">NO SLIP AVAILABLE FOR PREVIEW</h1>
  )
}
 
}
