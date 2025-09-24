"use client";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

type PanelType = "text" | "video" | "image";

type PanelData = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	type: PanelType;
	content: string;
	isDraggable: boolean;
	backgroundColor: string;
	textColor: string;
	fontFamily: string;
    isPlaying?: boolean;
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const PAGE_KEYS = [
	{ key: "front", label: "Front page" },
	{ key: "error", label: "Error Page" },
	{ key: "tournament", label: "Tournament page" },
	{ key: "custom", label: "page" }
];

export default function BuilderPage() {
    const emptyPanels: PanelData[] = [];
    type Device = "desktop" | "mobile";
    const [device, setDevice] = useState<Device>("desktop");
    const [pages, setPages] = useState<Record<string, { desktop: PanelData[]; mobile: PanelData[] }>>({
        front: { desktop: emptyPanels, mobile: emptyPanels },
        error: { desktop: emptyPanels, mobile: emptyPanels },
        tournament: { desktop: emptyPanels, mobile: emptyPanels },
        custom: { desktop: emptyPanels, mobile: emptyPanels }
    });
    const [currentPage, setCurrentPage] = useState<string>(PAGE_KEYS[0].key);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const currentSet = pages[currentPage] ?? { desktop: emptyPanels, mobile: emptyPanels };
    const panels = (device === "desktop" ? currentSet.desktop : currentSet.mobile) ?? [];

    const setPanels = (next: PanelData[] | ((p: PanelData[]) => PanelData[])) => {
        setPages(prev => {
            const page = prev[currentPage] ?? { desktop: emptyPanels, mobile: emptyPanels };
            const nextPanels = typeof next === "function" ? (next as (p: PanelData[]) => PanelData[])(device === "desktop" ? page.desktop : page.mobile) : next;
            return {
                ...prev,
                [currentPage]: {
                    desktop: device === "desktop" ? nextPanels : page.desktop,
                    mobile: device === "mobile" ? nextPanels : page.mobile
                }
            };
        });
    };

    const addPanel = (type: PanelType) => {
		const newPanel: PanelData = {
			i: Date.now().toString(),
			x: 0,
			y: Infinity,
			w: type === "text" ? 4 : 3,
			h: type === "text" ? 2 : 3,
			type,
			content:
				type === "text"
					? "New text"
					: type === "video"
					? "https://www.youtube.com/embed/dQw4w9WgXcQ"
					: "/globe.svg",
			isDraggable: true,
			backgroundColor: "#ffffff",
			textColor: "#000000",
			fontFamily: "Inter, system-ui, sans-serif",
            isPlaying: false
		};
		setPanels(prev => [...prev, newPanel]);
		setIsPickerOpen(false);
	};

    // When switching device, if target layout is empty but the other device has content,
    // auto-clone positions in a stacked layout so users don't lose work.
    const ensureDeviceLayout = (nextDevice: Device) => {
        const page = pages[currentPage] ?? { desktop: emptyPanels, mobile: emptyPanels };
        const from = nextDevice === "desktop" ? page.mobile : page.desktop;
        const to = nextDevice === "desktop" ? page.desktop : page.mobile;
        if (to.length === 0 && from.length > 0) {
            const cloned = from.map((p, idx) => ({ ...p, y: idx * (p.h + 1), x: 0 }));
            setPages(prev => ({
                ...prev,
                [currentPage]: {
                    desktop: nextDevice === "desktop" ? cloned : page.desktop,
                    mobile: nextDevice === "mobile" ? cloned : page.mobile
                }
            }));
        }
    };

	const updatePanelContent = (id: string, content: string) => {
		setPanels(prev => prev.map(p => (p.i === id ? { ...p, content } : p)));
	};

	const updatePanelStyle = (id: string, next: Partial<Pick<PanelData, "backgroundColor" | "textColor" | "fontFamily">>) => {
		setPanels(prev => prev.map(p => (p.i === id ? { ...p, ...next } : p)));
	};

	const deletePanel = (id: string) => {
		setPanels(prev => prev.filter(p => p.i !== id));
		if (selectedId === id) setSelectedId(null);
	};

	const onSelectPanel = (id: string) => {
		// stop any previous selection playback
		if (selectedId) {
			setPanels(prev => prev.map(p => (p.i === selectedId && p.type === "video" ? { ...p, isPlaying: false } : p)));
		}
		setSelectedId(id);
	};

	const doneEditing = () => {
		if (!selectedId) return;
		// stop playback on exit
		setPanels(prev => prev.map(p => (p.i === selectedId && p.type === "video" ? { ...p, isPlaying: false } : p)));
		setSelectedId(null);
	};

	const setVideoPlaying = (id: string, playing: boolean) => {
		setPanels(prev => prev.map(p => (p.i === id ? { ...p, isPlaying: playing } : p)));
	};

	const selectedPanel = useMemo(() => panels.find(p => p.i === selectedId) ?? null, [panels, selectedId]);

	return (
		<div className="min-h-screen bg-neutral-800 text-white">
			{/* Top bar */}
			<div className="flex flex-col items-center gap-4 py-6">
				{/* Device switch */}
				<div className="flex items-center gap-3">
					<span className={`text-sm ${device === "mobile" ? "opacity-60" : ""}`}>Desktop</span>
					<label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={device === "mobile"} onChange={e => { const nextDevice = e.target.checked ? "mobile" : "desktop"; ensureDeviceLayout(nextDevice); setDevice(nextDevice); }} />
						<div className="w-12 h-6 bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
					</label>
					<span className={`text-sm ${device === "desktop" ? "opacity-60" : ""}`}>Mobile</span>
				</div>
  {/* Row of page keys */}
  <div className="flex gap-6">
    {PAGE_KEYS.map(p => (
      <button
        key={p.key}
        onClick={() => setCurrentPage(p.key)}
        className={`px-5 py-2 rounded-full ${
          currentPage === p.key
            ? "bg-green-500 text-black"
            : "bg-neutral-600"
        }`}
      >
        {p.label}
      </button>
    ))}
  </div>

  {/* Plus button below */}
  <button
    onClick={() => setIsPickerOpen(true)}
    className="bg-neutral-600 px-4 py-3 rounded-xl text-2xl leading-none"
  >    +
  </button>
</div>


			<div className="flex gap-6 px-10 pb-10">
				{/* Sidebar: properties */}
				<div className="w-56 shrink-0 flex flex-col gap-4">
					<button onClick={() => selectedPanel && deletePanel(selectedPanel.i)} className="bg-neutral-600 rounded px-3 py-2 disabled:opacity-40" disabled={!selectedPanel}>Delete</button>
					<div className="bg-neutral-700 rounded p-3">
						<div className="text-sm mb-2">Gradient</div>
						<input
							type="color"
							className="w-full h-8 p-0 bg-transparent"
							value={selectedPanel?.backgroundColor ?? "#ffffff"}
							onChange={e => selectedPanel && updatePanelStyle(selectedPanel.i, { backgroundColor: e.target.value })}
							disabled={!selectedPanel}
						/>
					</div>
					<div className="bg-neutral-700 rounded p-3">
						<div className="text-sm mb-2">Font</div>
						<select
							className="w-full bg-neutral-800 p-2 rounded"
							value={selectedPanel?.fontFamily ?? "Inter, system-ui, sans-serif"}
							onChange={e => selectedPanel && updatePanelStyle(selectedPanel.i, { fontFamily: e.target.value })}
							disabled={!selectedPanel}
						>
							<option value="Inter, system-ui, sans-serif">Inter</option>
							<option value="Georgia, serif">Georgia</option>
							<option value="Courier New, monospace">Courier New</option>
						</select>
						<input
							placeholder="Text color"
							type="color"
							className="w-full h-8 mt-2"
							value={selectedPanel?.textColor ?? "#000000"}
							onChange={e => selectedPanel && updatePanelStyle(selectedPanel.i, { textColor: e.target.value })}
							disabled={!selectedPanel}
						/>
					</div>
					{selectedPanel && (
						<div className="bg-neutral-700 rounded p-3">
							<div className="text-sm mb-2">Content</div>
							{selectedPanel.type === "text" && (
								<textarea className="w-full p-2 rounded text-black" value={selectedPanel.content} onChange={e => updatePanelContent(selectedPanel.i, e.target.value)} />
							)}
							{selectedPanel.type !== "text" && (
								<input className="w-full p-2 rounded text-black" value={selectedPanel.content} onChange={e => updatePanelContent(selectedPanel.i, e.target.value)} />
							)}
                            {selectedPanel.type === "video" && (
                                <div className="mt-3 text-xs text-neutral-300">Video playback is disabled in editor preview.</div>
                            )}
							<button onClick={doneEditing} className="mt-3 w-full bg-green-500 text-black rounded px-3 py-2">Done</button>
						</div>
					)}
				</div>

				{/* Canvas / Live preview */}
				<div className="flex-1 bg-neutral-300 rounded-xl p-8">
					<div className="bg-neutral-200 rounded-xl mx-auto" style={{ 
	    width: device === "mobile" ? 360 : 1024,
	    height: device === "mobile" ? 360 * 2.22 : 700
	  }}>
                    <ResponsiveGridLayout
  className="layout p-6"
  layouts={{ lg: panels, md: panels, sm: panels, xs: panels, xxs: panels }}
  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
  cols={{ lg: device === "mobile" ? 6 : 12, md: device === "mobile" ? 6 : 10, sm: device === "mobile" ? 6 : 8, xs: 6, xxs: 4 }}
  rowHeight={device === "mobile" ? 70 : 80}
  draggableCancel=".edit-handle"
  compactType={null}
  // ✅ keep panel sizes/positions in sync with state
  onLayoutChange={(layout) => {
    setPanels(prev =>
      prev.map(p => {
        const l = layout.find(item => item.i === p.i);
        return l ? { ...p, x: l.x, y: l.y, w: l.w, h: l.h } : p;
      })
    );
  }}
>
  {panels.map(p => (
    <div key={p.i}>
      <div
        className={`w-full h-full rounded relative group ${
          selectedId === p.i ? "ring-4 ring-pink-400" : ""
        }`}
        style={{
          backgroundColor: p.backgroundColor,
          color: p.textColor,
          fontFamily: p.fontFamily
        }}
      >
        {/* Hover edit handle */}
        <button
          className="edit-handle absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-neutral-900 text-white text-sm px-3 py-2 rounded-full shadow z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPanel(p.i);
          }}
        >
          Edit
        </button>

        {p.type === "text" && <div className="p-4">{p.content}</div>}

        {p.type === "image" && (
          <img
            src={p.content}
            alt=""
            className="w-full h-full object-cover rounded"
          />
        )}

        {p.type === "video" && (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-100 rounded">
            <div className="text-center">
              <div className="text-sm font-semibold">Video block</div>
              <div className="text-xs opacity-70">Preview disabled</div>
            </div>
          </div>
        )}
      </div>
    </div>
  ))}
</ResponsiveGridLayout>

					</div>
				</div>
			</div>

			{/* Picker modal */}
			{isPickerOpen && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
					<div className="bg-white text-black rounded-lg p-6 w-96">
						<div className="text-lg font-semibold mb-4">Add panel</div>
						<div className="grid grid-cols-3 gap-3">
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("text")}>Text</button>
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("video")}>Video</button>
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("image")}>Image</button>
						</div>
						<button className="mt-4 w-full bg-neutral-800 text-white rounded py-2" onClick={() => setIsPickerOpen(false)}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
}


 