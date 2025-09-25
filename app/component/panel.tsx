import { useState } from "react";

import ImagePanel from "./panels/ImagePanel";
import VideoPanel from "./panels/VideoPanel";
import TextPanel from "./panels/TextPanel";

export type PanelProps = {
  id: string;
  type: "text" | "video" | "image" | "carousel";
  content: string | string[];
  currentIndex?: number;
};



export function Panel({ panel, onUpdate, onEditingChange, readonly }: { panel: PanelProps; onUpdate?: (b: PanelProps) => void; onEditingChange?: (id: string, isEditing: boolean) => void; readonly?: boolean }) {
  const [isEditing, setisEditing] = useState(false);
  const [draft, setDraft] = useState(panel);

  // Carousel rotation is handled in the parent page now

  return (<div className="bg-gray-100 p-2 rounded">
    {/* Content */}

    

    {!Array.isArray(panel.content) ? (
    <>
      {panel.type === "text" ? (
        <TextPanel Text={panel.content} />
      ) : panel.type === "video" ? (
        readonly ? (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-100 rounded">
            <div className="text-center">
              <div className="text-sm font-semibold">Video block</div>
              <div className="text-xs opacity-70">Preview disabled</div>
            </div>
          </div>
        ) : (
          <VideoPanel source={panel.content} />
        )
      ) : panel.type === "image" ? (
        <ImagePanel source={panel.content} />
      ) : (
        <div className="text-neutral-500 text-sm">Unsupported panel type</div>
      )}
    </>
  ):
  <>
      {panel.type === "carousel" && (
          <TextPanel Text="Not Yet Implemented"></TextPanel>
          // <img
          //   src={panel.content[(panel.currentIndex ?? 0) % Math.max(panel.content.length, 1)]}
          //   alt=""
          //   className="rounded w-full h-full object-cover"
          // />
        )}
      </>
  }

    

    {/* Modal */}
    {isEditing && !readonly && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded w-96">
          <h2>Edit Panel</h2>
          <input
            type="text"
            value={draft.content}
            onChange={(e) =>
              setDraft({ ...draft, content: e.target.value })
            }
            className="border w-full p-2"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                setisEditing(false);
                onEditingChange && onEditingChange(panel.id, false);
              }}
              className="mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onUpdate && onUpdate(draft);
                setisEditing(false);
                onEditingChange && onEditingChange(panel.id, false);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}