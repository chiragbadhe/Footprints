"use client";

import { useState, useEffect, useCallback } from "react";
import visitedCountriesSource from "@/app/data/visitedCountries";
import { UNIQUE_COLOR_PALETTE } from "@/app/constants/colors";
import type { VisitedCountry } from "@/app/types/visitedCountry";

const STORAGE_KEY = "travelled-countries";

const assignColors = (countries: VisitedCountry[]): VisitedCountry[] => {
  const usedColors = new Set<string>();
  countries.forEach((country) => {
    if (country.color) {
      usedColors.add(country.color);
    }
  });

  // Find available colors (not already used)
  const availableColors = UNIQUE_COLOR_PALETTE.filter(
    (color) => !usedColors.has(color)
  );

  // Assign colors ensuring uniqueness
  let colorIndex = 0;
  return countries.map((country) => {
    // If country already has a color and it's unique, keep it
    if (country.color && !usedColors.has(country.color)) {
      usedColors.add(country.color);
      return country;
    }

    // Assign next available color
    if (colorIndex < availableColors.length) {
      const newColor = availableColors[colorIndex];
      colorIndex++;
      usedColors.add(newColor);
      return { ...country, color: newColor };
    }

    // If we run out of unique colors, cycle through palette
    const fallbackColor =
      UNIQUE_COLOR_PALETTE[colorIndex % UNIQUE_COLOR_PALETTE.length];
    colorIndex++;
    return { ...country, color: fallbackColor };
  });
};

const loadFromStorage = (): VisitedCountry[] => {
  if (typeof window === "undefined") {
    return assignColors(visitedCountriesSource);
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // First time - assign colors to source data
      const initial = assignColors(visitedCountriesSource);
      // Save immediately so colors persist
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: VisitedCountry[] = JSON.parse(stored);
    // Ensure all countries have colors (fill in missing ones)
    return assignColors(parsed);
  } catch (error) {
    console.error("Failed to parse stored travelled countries", error);
    return assignColors(visitedCountriesSource);
  }
};

const saveToStorage = (countries: VisitedCountry[]) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(countries));
  } catch (error) {
    console.error("Failed to save travelled countries", error);
  }
};

export const useVisitedCountries = () => {
  const [visitedCountries, setVisitedCountries] = useState<VisitedCountry[]>(
    () => {
      if (typeof window === "undefined") {
        return assignColors(visitedCountriesSource);
      }
      return loadFromStorage();
    }
  );

  useEffect(() => {
    saveToStorage(visitedCountries);
  }, [visitedCountries]);

  const randomizeColors = useCallback(() => {
    setVisitedCountries((prev) => {
      // Shuffle available colors
      const shuffledColors = [...UNIQUE_COLOR_PALETTE].sort(
        () => Math.random() - 0.5
      );

      // Assign unique colors to each country
      const usedColors = new Set<string>();
      return prev.map((country, index) => {
        // Find next available color that hasn't been used
        let colorIndex = index % shuffledColors.length;
        let assignedColor = shuffledColors[colorIndex];

        // If color already used, find next available
        while (usedColors.has(assignedColor)) {
          colorIndex = (colorIndex + 1) % shuffledColors.length;
          assignedColor = shuffledColors[colorIndex];
        }

        usedColors.add(assignedColor);
        return {
          ...country,
          color: assignedColor,
        };
      });
    });
  }, []);

  return {
    visitedCountries,
    setVisitedCountries,
    randomizeColors,
  };
};
