import { useState } from "react";

export default function Counter({label, value, OnChange}:{label:string, value:number, OnChange: (val: number) => void }) {
 

  return (
    <div className="bg-white border rounded-lg p-4 flex items-center gap-3 w-96">
    <span className="text-black w-48">{label}</span>
    <input className='
         w-24
         px-2 py-1
         border rounded-md
         text-center text-black
         shadow
         focus:outline-none focus:ring-2 focus:ring-blue-500
       ' type='number' value={value}  onChange={(e) => OnChange(Number(e.target.value))} />
       </div>
  );
}