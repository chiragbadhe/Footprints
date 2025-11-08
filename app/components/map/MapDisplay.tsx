"use client";

import { useEffect, useCallback, useRef } from "react";
import { fillWithColor, resetMapColoring } from "@/app/utils/utils";
import type { VisitedCountry } from "@/app/types/visitedCountry";

type MapDisplayProps = {
  mapMarkup: string;
  mapError: string | null;
  visitedCountries: VisitedCountry[];
  zoomLevel: number;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
};

const waitForPaths = (
  svgElement: SVGSVGElement,
  maxAttempts = 20
): Promise<void> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkPaths = () => {
      const paths = svgElement.querySelectorAll("path.cls-1");
      if (paths.length > 0 || attempts >= maxAttempts) {
        resolve();
        return;
      }
      attempts++;
      setTimeout(checkPaths, 50);
    };
    checkPaths();
  });
};

export const MapDisplay = ({
  mapMarkup,
  mapError,
  visitedCountries,
  zoomLevel,
  handleMouseDown,
  handleTouchStart,
}: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const colorsAppliedRef = useRef(false);

  const applyVisitedColors = useCallback(async () => {
    if (!mapMarkup || !mapContainerRef.current || visitedCountries.length === 0)
      return;

    const svgElement = mapContainerRef.current.querySelector(
      "svg"
    ) as SVGSVGElement;
    if (!svgElement) return;

    // Wait for paths to be rendered
    await waitForPaths(svgElement);

    // Additional delay to ensure viewBox is set and SVG is stable
    setTimeout(() => {
      resetMapColoring();
      visitedCountries.forEach((country) => {
        if (country.code && country.color) {
          fillWithColor(country.code, country.color);
        }
      });
      colorsAppliedRef.current = true;

      // Store flag in localStorage that colors have been applied
      if (typeof window !== "undefined") {
        window.localStorage.setItem("map-colors-applied", "true");
      }
    }, 200);
  }, [mapMarkup, visitedCountries]);

  useEffect(() => {
    if (!mapMarkup) return;
    colorsAppliedRef.current = false;

    // Always apply colors when map or countries change
    applyVisitedColors();

    // Also set up a retry mechanism in case initial application fails
    const retryTimeout = setTimeout(() => {
      if (!colorsAppliedRef.current && mapContainerRef.current) {
        const svgElement = mapContainerRef.current.querySelector("svg");
        if (svgElement) {
          applyVisitedColors();
        }
      }
    }, 500);

    return () => {
      clearTimeout(retryTimeout);
    };
  }, [mapMarkup, visitedCountries, applyVisitedColors]);

  // Re-apply colors when zoom level changes
  useEffect(() => {
    if (
      !colorsAppliedRef.current ||
      !mapMarkup ||
      visitedCountries.length === 0
    )
      return;

    // Small delay to ensure viewBox has been updated
    const timeoutId = setTimeout(() => {
      visitedCountries.forEach((country) => {
        if (country.code && country.color) {
          fillWithColor(country.code, country.color);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [zoomLevel, mapMarkup, visitedCountries]);

  // Re-apply colors when viewBox changes (e.g., after zoom or pan)
  useEffect(() => {
    if (!mapMarkup || !mapContainerRef.current || !colorsAppliedRef.current)
      return;

    const svgElement = mapContainerRef.current.querySelector("svg");
    if (!svgElement) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const reapplyColors = () => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounce color re-application to avoid excessive calls
      timeoutId = setTimeout(() => {
        // Don't reset colors, just re-apply visited country colors
        visitedCountries.forEach((country) => {
          if (country.code && country.color) {
            fillWithColor(country.code, country.color);
          }
        });
      }, 100);
    };

    // Watch for viewBox attribute changes
    const observer = new MutationObserver((mutations) => {
      const hasViewBoxChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "viewBox"
      );
      if (hasViewBoxChange) {
        reapplyColors();
      }
    });

    observer.observe(svgElement, {
      attributes: true,
      attributeFilter: ["viewBox"],
      subtree: false,
    });

    const pollInterval = setInterval(() => {
      if (svgElement.getAttribute("viewBox")) {
        visitedCountries.forEach((country) => {
          if (country.code && country.color) {
            fillWithColor(country.code, country.color);
          }
        });
      }
    }, 2000);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearInterval(pollInterval);
    };
  }, [mapMarkup, visitedCountries]);

  if (mapError) {
    return (
      <p className="m-auto max-w-sm rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-center text-sm text-rose-600 shadow">
        {mapError}
      </p>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="world-map fixed inset-0 h-full w-full overflow-hidden"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        userSelect: zoomLevel > 1 ? "none" : "auto",
        touchAction: zoomLevel > 1 ? "none" : "auto",
      }}
    >
      <div
        className="h-full w-full"
        dangerouslySetInnerHTML={{ __html: mapMarkup }}
      />
    </div>
  );
};
