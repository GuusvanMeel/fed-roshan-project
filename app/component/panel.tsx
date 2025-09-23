import { useState } from "react";

export type PanelProps = {
  id: string;
  type: "text" | "video" | "image";
  content: string;
};

export function Panel({ panel, onUpdate, onEditingChange }: { panel: PanelProps; onUpdate: (b: PanelProps) => void; onEditingChange: (id: string, isEditing: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(panel);
  
   return( <div className="bg-gray-100 p-2 rounded">
      {/* Content */}
      {panel.type === "text" && (
        <div className="bg-blue-200 p-4 rounded">{panel.content}</div>
      )}
      {panel.type === "video" && (
        <iframe
          width="100%"
          height="100%"
          src={panel.content}
          className="rounded"
        />
      )}
      {panel.type === "image" && (
        <img
          src={panel.content}
          alt=""
          className="rounded w-full h-full object-cover"
        />
      )}

      {/* Edit button */}
      <button
        onClick={() => {
          setIsOpen(true);
          onEditingChange(panel.id, true);
        }}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
      >
        ✏️ Edit
      </button>

      {/* Modal */}
      {isOpen && (
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
                  onEditingChange(panel.id, false);
                }}
                className="mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdate(draft);
                  setIsOpen(false);
                  onEditingChange(panel.id, false);
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