"use client";

import { ZoomIn, ZoomOut } from "lucide-react";

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
};

export const ZoomControls = ({
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
}: ZoomControlsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="Zoom In"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="flex items-center justify-center rounded-full bg-slate-900 p-2 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ZoomIn size={20} className="stroke-2" />
      </button>
      <button
        type="button"
        aria-label="Zoom Out"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="flex items-center justify-center rounded-full bg-slate-900 p-2 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ZoomOut size={20} className="stroke-2" />
      </button>
    </div>
  );
};
