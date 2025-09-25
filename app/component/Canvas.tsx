'use client';

import React from 'react'
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export type CanvasData = {
    Width: number;
    Height: number;
    color: string;
}

export default function Canvas({settings} : {settings : CanvasData}) {
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const layout = [
        { i: "1", x: 0, y: 0, w: 2, h: 2 },
        { i: "2", x: 2, y: 0, w: 2, h: 4 },
        { i: "3", x: 4, y: 0, w: 2, h: 5 },
      ];
 
    return (

    
    <div className='bg-blue-900 rounded-2xl'
    style={{backgroundColor: settings.color, height: settings.Height, width: settings.Width }}>
            <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 120, md: 100, sm: 60, xs: 40, xxs: 20 }}
        rowHeight={10}
      >
        <div key="1" className="bg-red-500 rounded">Item 1</div>
        <div key="2" className="bg-green-500 rounded">Item 2</div>
        <div key="3" className="bg-yellow-500 rounded">Item 3</div>
      </ResponsiveGridLayout>





    </div>
  )
}
