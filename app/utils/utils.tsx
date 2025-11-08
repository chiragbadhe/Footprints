const defaultColor = "rgba(158,158,158,0.63)";

export const fillWithColor = (countryCode: string, color = defaultColor) => {
  if (!countryCode) return;

  // Query within the world-map container to ensure we're targeting the correct SVG
  const worldMapContainer = document.querySelector(".world-map");
  if (!worldMapContainer) return;

  const pathCountrySVG: NodeListOf<SVGPathElement> =
    worldMapContainer.querySelectorAll("path.cls-1");

  // Color all matching paths (some countries might have multiple paths)
  let colored = false;
  for (const el of pathCountrySVG) {
    if (el.dataset.id === countryCode) {
      el.style.fill = color;
      colored = true;
    }
  }

  // If no match found, try without the container constraint as fallback
  if (!colored) {
    const allPaths: NodeListOf<SVGPathElement> =
      document.querySelectorAll("path.cls-1");
    for (const el of allPaths) {
      if (el.dataset.id === countryCode) {
        el.style.fill = color;
        break;
      }
    }
  }
};

export const resetMapColoring = () => {
  // Query within the world-map container to ensure we're targeting the correct SVG
  const worldMapContainer = document.querySelector(".world-map");
  if (!worldMapContainer) return;

  const pathCountrySVG: NodeListOf<SVGPathElement> =
    worldMapContainer.querySelectorAll("path.cls-1");

  for (const el of pathCountrySVG) {
    el.style.fill = defaultColor;
  }
};
