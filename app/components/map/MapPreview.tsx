"use client";

import { useEffect, useRef, useState } from "react";

type MapPreviewProps = {
  mapMarkup: string;
  originalViewBox: string | null;
  zoomLevel: number;
  setViewBox: (x: number, y: number) => void;
};

export const MapPreview = ({
  mapMarkup,
  originalViewBox,
  zoomLevel,
  setViewBox,
}: MapPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [currentViewBox, setCurrentViewBox] = useState<string | null>(null);

  useEffect(() => {
    if (!mapMarkup || !originalViewBox) return;

    const updatePreview = () => {
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (!svgElement) return;

      const viewBox = svgElement.getAttribute("viewBox");
      if (viewBox) {
        setCurrentViewBox(viewBox);
      }
    };

    // Update on mount and when zoom changes
    updatePreview();

    // Watch for viewBox changes (from panning)
    const observer = new MutationObserver(() => {
      updatePreview();
    });

    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      observer.observe(svgElement, {
        attributes: true,
        attributeFilter: ["viewBox"],
      });
    }

    // Also poll for changes (in case MutationObserver misses some)
    const interval = setInterval(updatePreview, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [mapMarkup, originalViewBox, zoomLevel]);

  if (!mapMarkup || !originalViewBox || !currentViewBox || zoomLevel <= 1) {
    return null;
  }

  // Calculate viewport indicator position and size
  const [origX, origY, origWidth, origHeight] = originalViewBox
    .split(" ")
    .map(Number);
  const [currX, currY, currWidth, currHeight] = currentViewBox
    .split(" ")
    .map(Number);

  // Calculate the position and size of the viewport indicator relative to the full map
  const previewWidth = 200; // Fixed preview width
  const previewHeight = (previewWidth * origHeight) / origWidth; // Maintain aspect ratio

  const indicatorX = ((currX - origX) / origWidth) * previewWidth;
  const indicatorY = ((currY - origY) / origHeight) * previewHeight;
  const indicatorWidth = (currWidth / origWidth) * previewWidth;
  const indicatorHeight = (currHeight / origHeight) * previewHeight;

  // Clone the SVG markup and set it to show the full original viewBox
  const previewSvg = mapMarkup.replace(
    /viewBox="[^"]*"/,
    `viewBox="${originalViewBox}"`
  );

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current || !originalViewBox) return;

    const rect = previewRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click position to viewBox coordinates
    const [origX, origY, origWidth, origHeight] = originalViewBox
      .split(" ")
      .map(Number);

    // Get current viewBox to calculate width and height
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (!svgElement) return;

    const currentViewBox = svgElement.getAttribute("viewBox");
    if (!currentViewBox) return;

    const [, , currWidth, currHeight] = currentViewBox.split(" ").map(Number);

    // Calculate the center point of the clicked area in viewBox coordinates
    const viewBoxX = origX + (clickX / previewWidth) * origWidth;
    const viewBoxY = origY + (clickY / previewHeight) * origHeight;

    // Set the viewBox so the clicked point becomes the center
    const newX = viewBoxX - currWidth / 2;
    const newY = viewBoxY - currHeight / 2;

    setViewBox(newX, newY);
  };

  const handlePreviewDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only if left mouse button is pressed
    handlePreviewClick(e);
  };

  return (
    <div
      ref={previewRef}
      className="absolute top-6 right-6 z-20 overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-lg cursor-pointer"
      style={{
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
      }}
      onClick={handlePreviewClick}
      onMouseMove={handlePreviewDrag}
    >
      {/* Mini map */}
      <div
        className="preview-map pointer-events-none"
        dangerouslySetInnerHTML={{ __html: previewSvg }}
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
        }}
      />
      {/* Viewport indicator */}
      <div
        className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
        style={{
          left: `${Math.max(0, indicatorX)}px`,
          top: `${Math.max(0, indicatorY)}px`,
          width: `${Math.min(indicatorWidth, previewWidth)}px`,
          height: `${Math.min(indicatorHeight, previewHeight)}px`,
        }}
      />
    </div>
  );
};
