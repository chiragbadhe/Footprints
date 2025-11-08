"use client";

import { useRef, useCallback, useEffect } from "react";

type UseMapPanProps = {
  zoomLevel: number;
  originalViewBox: string | null;
  enabled: boolean;
};

export const useMapPan = ({
  zoomLevel,
  originalViewBox,
  enabled,
}: UseMapPanProps) => {
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentViewBoxRef = useRef<string | null>(null);

  // Update current viewBox when zoom changes
  useEffect(() => {
    if (!originalViewBox) return;

    // Small delay to ensure zoom hook has updated the viewBox
    const timeoutId = setTimeout(() => {
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (svgElement) {
        const viewBox = svgElement.getAttribute("viewBox");
        if (viewBox) {
          currentViewBoxRef.current = viewBox;
        }
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [zoomLevel, originalViewBox]);

  const updateViewBox = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!originalViewBox) return;

      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (!svgElement) return;

      // Get current viewBox from DOM (most up-to-date)
      const currentViewBox = svgElement.getAttribute("viewBox");
      if (!currentViewBox) return;

      const [x, y, width, height] = currentViewBox.split(" ").map(Number);

      // Calculate the movement in viewBox coordinates
      // We need to scale the pixel movement to viewBox coordinates
      const svgRect = svgElement.getBoundingClientRect();
      const scaleX = width / svgRect.width;
      const scaleY = height / svgRect.height;

      const newX = x - deltaX * scaleX;
      const newY = y - deltaY * scaleY;

      // Get original viewBox bounds to constrain panning
      const [origX, origY, origWidth, origHeight] = originalViewBox
        .split(" ")
        .map(Number);

      // Constrain panning to keep map within bounds
      const minX = origX;
      const maxX = origX + origWidth - width;
      const minY = origY;
      const maxY = origY + origHeight - height;

      const constrainedX = Math.max(minX, Math.min(maxX, newX));
      const constrainedY = Math.max(minY, Math.min(maxY, newY));

      const newViewBox = `${constrainedX} ${constrainedY} ${width} ${height}`;
      svgElement.setAttribute("viewBox", newViewBox);
      currentViewBoxRef.current = newViewBox;
    },
    [originalViewBox]
  );

  const setViewBox = useCallback(
    (x: number, y: number) => {
      if (!originalViewBox) return;

      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (!svgElement) return;

      // Get current viewBox to get width and height
      const currentViewBox = svgElement.getAttribute("viewBox");
      if (!currentViewBox) return;

      const [, , width, height] = currentViewBox.split(" ").map(Number);

      // Get original viewBox bounds to constrain panning
      const [origX, origY, origWidth, origHeight] = originalViewBox
        .split(" ")
        .map(Number);

      // Constrain to keep map within bounds
      const minX = origX;
      const maxX = origX + origWidth - width;
      const minY = origY;
      const maxY = origY + origHeight - height;

      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));

      const newViewBox = `${constrainedX} ${constrainedY} ${width} ${height}`;
      svgElement.setAttribute("viewBox", newViewBox);
      currentViewBoxRef.current = newViewBox;
    },
    [originalViewBox]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || zoomLevel <= 1) return;

      e.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;

      // Update cursor
      const svgElement = document.querySelector(
        ".world-map svg"
      ) as SVGSVGElement;
      if (svgElement) {
        svgElement.style.cursor = "grabbing";
      }
    },
    [enabled, zoomLevel]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !enabled) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      updateViewBox(deltaX, deltaY);

      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
    },
    [enabled, updateViewBox]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;

    // Reset cursor
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      svgElement.style.cursor = enabled && zoomLevel > 1 ? "grab" : "default";
    }
  }, [enabled, zoomLevel]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || zoomLevel <= 1) return;

      if (e.touches.length === 1) {
        e.preventDefault();
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].clientX;
        startYRef.current = e.touches[0].clientY;
      }
    },
    [enabled, zoomLevel]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current || !enabled || e.touches.length !== 1) return;

      e.preventDefault();
      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;

      updateViewBox(deltaX, deltaY);

      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    },
    [enabled, updateViewBox]
  );

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Set up global mouse event listeners
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    enabled,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Update cursor style when zoom changes
  useEffect(() => {
    const svgElement = document.querySelector(
      ".world-map svg"
    ) as SVGSVGElement;
    if (svgElement) {
      svgElement.style.cursor = enabled && zoomLevel > 1 ? "grab" : "default";
    }
  }, [enabled, zoomLevel]);

  return {
    handleMouseDown,
    handleTouchStart,
    setViewBox,
  };
};
