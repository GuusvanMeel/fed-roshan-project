'use client'
import React from 'react'
import Canvas from '../component/Canvas'
import { CanvasData } from '../component/Canvas'
import { useState } from 'react';
import Counter from '../component/Counter';
import MyColorPicker from '../component/MyColorPicker';
import { InputSwitch } from "primereact/inputswitch";


export default function page() {

    const [myCanvas, setMyCanvas] = useState<CanvasData>({
        Width: 360,
        Height: 780,
        color: "#1e3a8a", // Tailwind bg-blue-900 hex
        columns: 20,
        rows: 10,
        showgrid: true,
      });
  
    return (
        <div className="flex gap-6 items-start">
  

  {/* Controls on the right */}
  <div className="flex flex-col gap-2">
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
    <Counter
      value={myCanvas.rows}
      label={"Amount of rows :" + myCanvas.rows}
      OnChange={(newRow) =>
        setMyCanvas({ ...myCanvas, rows: newRow })
      }
    />
    <Counter
      value={myCanvas.columns}
      label={"Amount of columns :" + myCanvas.columns}
      OnChange={(newColumns) =>
        setMyCanvas({ ...myCanvas, columns: newColumns })
      }
    />
<div className="flex items-center gap-2">
  <InputSwitch
    checked={myCanvas.showgrid}
    onChange={(e) =>
      setMyCanvas({ ...myCanvas, showgrid: e.value })
    }
  />
  <span className="text-sm text-white">{myCanvas.showgrid ? "Grid ON" : "Grid OFF"}</span>
</div>    
  <MyColorPicker OnChange={(newColor) => setMyCanvas({...myCanvas, color: newColor})} />
    

    
  </div>
  
<Canvas settings={myCanvas} />
</div>
  )
}


