"use client";

import { RotateCcw } from "lucide-react";

type ResetZoomButtonProps = {
  onReset: () => void;
  disabled?: boolean;
};

export const ResetZoomButton = ({
  onReset,
  disabled = false,
}: ResetZoomButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Reset Zoom"
      onClick={onReset}
      disabled={disabled}
      className="flex items-center justify-center rounded-full bg-slate-900 p-2 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RotateCcw size={20} className="stroke-2" />
    </button>
  );
};
