"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export const useMapZoom = (mapMarkup: string) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [originalViewBox, setOriginalViewBox] = useState<string | null>(null);
  const currentViewBoxRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mapMarkup) return;

    // Store original viewBox on first load
    setTimeout(() => {
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (svgElement && !originalViewBox) {
        const viewBox = svgElement.getAttribute("viewBox");
        if (viewBox) {
          setOriginalViewBox(viewBox);
          currentViewBoxRef.current = viewBox;
        }
      }
    }, 100);
  }, [mapMarkup, originalViewBox]);

  // Track current viewBox changes (from panning or other operations)
  useEffect(() => {
    if (!mapMarkup) return;

    const updateCurrentViewBox = () => {
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (svgElement) {
        const viewBox = svgElement.getAttribute("viewBox");
        if (viewBox) {
          currentViewBoxRef.current = viewBox;
        }
      }
    };

    // Update on mount
    updateCurrentViewBox();

    // Watch for viewBox changes
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      const observer = new MutationObserver(() => {
        updateCurrentViewBox();
      });

      observer.observe(svgElement, {
        attributes: true,
        attributeFilter: ["viewBox"],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [mapMarkup]);

  useEffect(() => {
    if (!mapMarkup || !originalViewBox) return;

    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (!svgElement) return;

    if (zoomLevel === 1) {
      // Reset to original viewBox when zoom is 1
      svgElement.setAttribute("viewBox", originalViewBox);
      currentViewBoxRef.current = originalViewBox;
      return;
    }

    // Use the ref value if available (captured right before zoom), otherwise read from DOM
    // This ensures we zoom from the viewport center at the moment zoom was triggered
    const currentViewBox =
      currentViewBoxRef.current || svgElement.getAttribute("viewBox");
    if (!currentViewBox) return;

    const [currX, currY, currWidth, currHeight] = currentViewBox
      .split(" ")
      .map(Number);

    // Calculate center of current viewBox (center of what user is viewing)
    const centerX = currX + currWidth / 2;
    const centerY = currY + currHeight / 2;

    // Get original dimensions to calculate new width/height based on zoom
    const [origX, origY, origWidth, origHeight] = originalViewBox
      .split(" ")
      .map(Number);

    const newWidth = origWidth / zoomLevel;
    const newHeight = origHeight / zoomLevel;

    // Calculate new viewBox centered on current viewport center
    let newX = centerX - newWidth / 2;
    let newY = centerY - newHeight / 2;

    // Constrain to original bounds
    const minX = origX;
    const maxX = origX + origWidth - newWidth;
    const minY = origY;
    const maxY = origY + origHeight - newHeight;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    const newViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
    svgElement.setAttribute("viewBox", newViewBox);
    currentViewBoxRef.current = newViewBox;
  }, [zoomLevel, mapMarkup, originalViewBox]);

  const handleZoomIn = useCallback(() => {
    // Capture current viewBox right before zooming
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      const currentViewBox = svgElement.getAttribute("viewBox");
      if (currentViewBox) {
        currentViewBoxRef.current = currentViewBox;
      }
    }
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    // Capture current viewBox right before zooming
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      const currentViewBox = svgElement.getAttribute("viewBox");
      if (currentViewBox) {
        currentViewBoxRef.current = currentViewBox;
      }
    }
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    if (!mapMarkup || !originalViewBox) return;

    // Reset viewBox to original
    setTimeout(() => {
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (svgElement && originalViewBox) {
        svgElement.setAttribute("viewBox", originalViewBox);
      }
    }, 10);
  }, [mapMarkup, originalViewBox]);

  return {
    zoomLevel,
    originalViewBox,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    canZoomIn: zoomLevel < MAX_ZOOM,
    canZoomOut: zoomLevel > MIN_ZOOM,
    isZoomed: zoomLevel > MIN_ZOOM,
  };
};
