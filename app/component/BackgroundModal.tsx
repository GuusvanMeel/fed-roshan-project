"use client";
import { useMemo } from "react";

export type BackgroundConfig = {
    mode: "solid" | "gradient";
    color: string;
    gradientType: "linear";
    direction: "to-top" | "to-bottom" | "to-left" | "to-right" | "to-top-right" | "to-bottom-right";
    colorStart: string;
    colorEnd: string;
};

export function computeGradientString(bg: BackgroundConfig): string {
    const dirMap: Record<BackgroundConfig["direction"], string> = {
        "to-top": "to top",
        "to-bottom": "to bottom",
        "to-left": "to left",
        "to-right": "to right",
        "to-top-right": "to top right",
        "to-bottom-right": "to bottom right",
    };
    const cssDir = dirMap[bg.direction];
    return `linear-gradient(${cssDir}, ${bg.colorStart} 0%, ${bg.colorEnd} 100%)`;
}

export default function BackgroundModal({ isOpen, device, background, onChange, onClose }: {
    isOpen: boolean;
    device: "desktop" | "mobile";
    background: BackgroundConfig;
    onChange: (next: BackgroundConfig) => void;
    onClose: () => void;
}) {
    const gradientPreview = useMemo(() => computeGradientString(background), [background]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white text-black rounded-lg p-6 w-[32rem]">
                <div className="text-lg font-semibold mb-4">Edit background ({device})</div>
                <div className="mb-4 flex gap-3 items-center">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="bgMode" checked={background.mode === "solid"} onChange={() => onChange({ ...background, mode: "solid" })} /> Solid
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="bgMode" checked={background.mode === "gradient"} onChange={() => onChange({ ...background, mode: "gradient" })} /> Gradient
                    </label>
                </div>
                {background.mode === "solid" && (
                    <div className="flex items-center gap-3">
                        <input type="color" value={background.color} onChange={e => onChange({ ...background, color: e.target.value })} />
                        <input className="flex-1 border p-2 rounded" value={background.color} onChange={e => onChange({ ...background, color: e.target.value })} />
                    </div>
                )}
                {background.mode === "gradient" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-6 gap-2">
                            {["to-top","to-bottom","to-left","to-right","to-top-right","to-bottom-right"].map(d => (
                                <button key={d} className={`border rounded py-2 text-xs ${background.direction === d ? "border-black" : "border-neutral-300"}`} onClick={() => onChange({ ...background, direction: d as any })}>
                                    {d.replace("to-", "").replace("-", " ")}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm w-16">Start</span>
                                <input type="color" value={background.colorStart} onChange={e => onChange({ ...background, colorStart: e.target.value })} />
                                <input className="flex-1 border p-2 rounded" value={background.colorStart} onChange={e => onChange({ ...background, colorStart: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm w-16">End</span>
                                <input type="color" value={background.colorEnd} onChange={e => onChange({ ...background, colorEnd: e.target.value })} />
                                <input className="flex-1 border p-2 rounded" value={background.colorEnd} onChange={e => onChange({ ...background, colorEnd: e.target.value })} />
                            </div>
                        </div>
                        <div className="h-16 rounded" style={{ backgroundImage: gradientPreview }} />
                    </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                    <button className="bg-neutral-200 rounded px-3 py-2" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}


