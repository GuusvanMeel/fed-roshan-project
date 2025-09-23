"use client";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Panel, PanelProps } from "./component/panel";

const ResponsiveGridLayout = WidthProvider(Responsive);

type PanelData = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "text" | "video" | "image";
  content: string;
  isDraggable: boolean;
};

export default function Home() {
  const [Panels, setPanel] = useState<PanelData[]>([]);

  // method to add a new block
  const addPanel = (type: "text" | "video" | "image") => {
    const newPanel: PanelData = {
      i: Date.now().toString(), // unique id
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      type,
        content: type === "text" ? "New text" : type === "video" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "/globe.svg",
       isDraggable: true
      };
    setPanel((prev) => [...prev, newPanel]);
  };
  const updatePanel = (updated: PanelProps) => {
  setPanel(prev =>
    prev.map(p =>
      p.i === updated.id
        ? { ...p, type: updated.type, content: updated.content } // replace just that one
        : p
    )
  );
};
  
  // toggle dragging during edit sessions
  const setPanelEditing = (id: string, isEditing: boolean) => {
    setPanel(prev =>
      prev.map(p =>
        p.i === id
          ? { ...p, isDraggable: !isEditing }
          : p
      )
    );
  };
  

  return (
    <div className="p-6">
      <button
        onClick={() => addPanel("text")}
        className="px-4 py-2 bg-indigo-600 text-white rounded mr-2"
      >
        ➕ Add Text Block
      </button>
      <button
        onClick={() => addPanel("video")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        🎬 Add Video Block
      </button>
      <button
        onClick={() => addPanel("image")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        🎬 Add image Block
      </button>

      <ResponsiveGridLayout
        className="layout mt-4"
        layouts={{ lg: Panels }}
        cols={{ lg: 12 }}
        rowHeight={100}
      >
        {Panels.map((P) => (
          <div key={P.i}>
            <Panel panel={{ 
              id: P.i, 
              type: P.type, 
              content: P.content 
            }} 
            onEditingChange={setPanelEditing}
            onUpdate={updatePanel}  />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}