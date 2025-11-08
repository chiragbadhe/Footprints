"use client";

import { useState, useEffect } from "react";

export const useMapLoader = () => {
  const [mapMarkup, setMapMarkup] = useState<string>("");
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const response = await fetch("/world.svg");
        if (!response.ok) {
          throw new Error("Failed to load map.");
        }
        const svg = await response.text();
        setMapMarkup(svg);
      } catch (error) {
        console.error(error);
        setMapError("Unable to load the world map.");
      }
    };

    loadMap();
  }, []);

  return { mapMarkup, mapError };
};
