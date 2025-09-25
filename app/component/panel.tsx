import { useState } from "react";

export type PanelProps = {
  id: string;
  type: "text" | "video" | "image" | "carousel";
  content: string | string[];
  currentIndex?: number;
};



export function Panel({ panel, onUpdate, onEditingChange, readonly }: { panel: PanelProps; onUpdate?: (b: PanelProps) => void; onEditingChange?: (id: string, isEditing: boolean) => void; readonly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(panel);

  // Carousel rotation is handled in the parent page now
  
   return( <div className="bg-gray-100 p-2 rounded">
      {/* Content */}
      {panel.type === "text" && (
        <div className="bg-blue-200 p-4 rounded">{panel.content}</div>
      )}
      {panel.type === "video" && !Array.isArray(panel.content) && (
        readonly ? (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-100 rounded">
            <div className="text-center">
              <div className="text-sm font-semibold">Video block</div>
              <div className="text-xs opacity-70">Preview disabled</div>
            </div>
          </div>
        ) : (
          <iframe width="100%" height="100%" src={panel.content} className="rounded" />
        )
      )}
      {panel.type === "image" && !Array.isArray(panel.content) && (
        <img
          src={panel.content}
          alt=""
          className="rounded w-full h-full object-cover"
        />
      )}
      {panel.type === "carousel" && Array.isArray(panel.content) && (
        <img
          src={panel.content[(panel.currentIndex ?? 0) % Math.max(panel.content.length, 1)]}
          alt=""
          className="rounded w-full h-full object-cover"
        />
      )}
      

     

      {/* Modal */}
      {isOpen && !readonly && (
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
                  setIsOpen(false);
                  onEditingChange && onEditingChange(panel.id, false);
                }}
                className="mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdate && onUpdate(draft);
                  setIsOpen(false);
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