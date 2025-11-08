"use client";

import { RefreshCw } from "lucide-react";

type RandomizeButtonProps = {
  onRandomize: () => void;
};

export const RandomizeButton = ({ onRandomize }: RandomizeButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Randomise Colours"
      onClick={onRandomize}
      className="flex items-center justify-center rounded-full bg-slate-900 p-2 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <RefreshCw size={22} className="stroke-2" />
    </button>
  );
};
