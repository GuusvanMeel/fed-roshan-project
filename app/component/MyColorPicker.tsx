"use client";

import { useState } from "react";
import { ColorPicker } from "primereact/colorpicker";

export default function MyColorPicker({OnChange}:{OnChange: (val: string) => void}) {
  const [color, setColor] = useState("1e3a8a"); // hex without #

  return (
    <div className="p-2 bg-white border rounded">
      <ColorPicker value={color}  onChange={(e) => {
          if (typeof e.value === "string") {
            setColor(e.value);
            OnChange(`#${e.value}`); // forward change to parent
          }
        }} inline />
      <div
        className="mt-3 w-16 h-16 border rounded"
        style={{ backgroundColor: `#${color}` }}
      ></div>
       <span className="font-mono text-sm text-gray-700">#{color}</span>
    </div>
  );
}
