'use client'
import React from 'react'
import Canvas from '../component/Canvas'
import { CanvasData } from '../component/Canvas'
import { useState } from 'react';
import Counter from '../component/Counter';
import MyColorPicker from '../component/MyColorPicker';


export default function page() {

    const [myCanvas, setMyCanvas] = useState<CanvasData>({
        Width: 360,
        Height: 780,
        color: "#1e3a8a", // Tailwind bg-blue-900 hex
      });
  
    return (
        <div className="flex gap-6 items-start">
  {/* Canvas on the left */}
  <Canvas settings={myCanvas} />

  {/* Controls on the right */}
  <div className="flex flex-col gap-4">
    <Counter
      value={myCanvas.Height}
      label={"Height of canvas " + myCanvas.Height + "px"}
      OnChange={(newHeight) =>
        setMyCanvas({ ...myCanvas, Height: newHeight })
      }
    />
    <Counter
      value={myCanvas.Width}
      label={"Width of canvas :" + myCanvas.Width + "px"}
      OnChange={(newWidth) =>
        setMyCanvas({ ...myCanvas, Width: newWidth })
      }
    />
    
  </div>
  <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded">
  <MyColorPicker OnChange={(newColor) => setMyCanvas({...myCanvas, color: newColor})} />
</div>
</div>
  )
}


