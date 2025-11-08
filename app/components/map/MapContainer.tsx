"use client";

import { RandomizeButton } from "./RandomizeButton";
import { ZoomControls } from "./ZoomControls";
import { ResetZoomButton } from "./ResetZoomButton";
import { MapPreview } from "./MapPreview";
import { TravelProgressBar } from "./TravelProgressBar";
import { Compass } from "./Compass";
import { MapDisplay } from "./MapDisplay";
import { useVisitedCountries } from "@/app/hooks/useVisitedCountries";
import { useMapLoader } from "@/app/hooks/useMapLoader";
import { useMapZoom } from "@/app/hooks/useMapZoom";
import { useMapPan } from "@/app/hooks/useMapPan";

const MapContainer = () => {
  const { visitedCountries, randomizeColors } = useVisitedCountries();
  const { mapMarkup, mapError } = useMapLoader();
  const {
    zoomLevel,
    originalViewBox,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    canZoomIn,
    canZoomOut,
    isZoomed,
  } = useMapZoom(mapMarkup);
  const { handleMouseDown, handleTouchStart, setViewBox } = useMapPan({
    zoomLevel,
    originalViewBox,
    enabled: true,
  });

  return (
    <section className="absolute inset-0 flex h-full w-full items-stretch overflow-hidden bg-white">
      <Compass />
      <TravelProgressBar
        visitedCount={visitedCountries.length}
        totalCount={195}
      />
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <RandomizeButton onRandomize={randomizeColors} />
        <ResetZoomButton onReset={handleResetZoom} disabled={!isZoomed} />
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
        />
      </div>
      <MapPreview
        mapMarkup={mapMarkup}
        originalViewBox={originalViewBox}
        zoomLevel={zoomLevel}
        setViewBox={setViewBox}
      />
      <MapDisplay
        mapMarkup={mapMarkup}
        mapError={mapError}
        visitedCountries={visitedCountries}
        zoomLevel={zoomLevel}
        handleMouseDown={handleMouseDown}
        handleTouchStart={handleTouchStart}
      />
    </section>
  );
};

export default MapContainer;
