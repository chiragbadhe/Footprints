"use client";

import { useEffect, useState } from "react";

type TravelProgressBarProps = {
  visitedCount: number;
  totalCount: number;
};

// Standard number of countries in the world (UN member states + observer states)
const TOTAL_COUNTRIES = 195;

export const TravelProgressBar = ({
  visitedCount,
  totalCount = TOTAL_COUNTRIES,
}: TravelProgressBarProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const percentage = Math.round((visitedCount / totalCount) * 100);

  useEffect(() => {
    // Reset and animate the progress bar when percentage changes
    setAnimatedPercentage(0);

    const duration = 1200; // 1.2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const stepValue = percentage / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newValue = Math.min(stepValue * currentStep, percentage);
      setAnimatedPercentage(newValue);

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedPercentage(percentage); // Ensure we end at exact percentage
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className="absolute bottom-4 left-1/2 z-20 flex w-[calc(90%-80px)] max-w-md -translate-x-1/2 transform items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 shadow-md backdrop-blur-sm md:bottom-6 md:gap-2.5 md:px-3 md:py-1.5">
      {/* Progress bar container */}
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 md:h-3">
        {/* Animated progress fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedPercentage}%`,
            background: `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)`,
          }}
        />
      </div>

      {/* Count display */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="text-[10px] font-medium text-slate-600 md:text-xs">
          {visitedCount}/{totalCount}
        </span>
      </div>
    </div>
  );
};
