// types/map/index.ts - Main style composition file

import { StyleSpecification } from 'maplibre-gl';
import { LayerSpecificationWithZIndex } from './types';

// Import style modules
import baseStyle from './base';
import labelStyle from './labels'; 
import powerStyle from './power';

// Re-export common utilities
export * from './common';
export * from './types';

// Sort layers by z-order
function sortLayers(layers: LayerSpecificationWithZIndex[]): LayerSpecificationWithZIndex[] {
  return layers.sort((a, b) => {
    const aZOrder = a.zorder || 0;
    const bZOrder = b.zorder || 0;
    return aZOrder - bZOrder;
  });
}

// Main style composition function
export function createMapStyle(): StyleSpecification {
  const allLayers = [
    ...baseStyle(),
    ...powerStyle(),
    ...labelStyle(),
  ];

  return {
    version: 8,
    projection: {
      type: "globe",
    },
    sky: {
      "sky-color": "#87CEEB",
      "horizon-color": "#ffffff",
      "fog-color": "#f0f0f0",
      "sky-horizon-blend": 0.5,
      "horizon-fog-blend": 0.5,
      "fog-ground-blend": 0.5,
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 2, 0.4, 4, 0],
    },
    light: {
      anchor: "map",
      color: "#ffffff",
      intensity: 0.5,
    },
    glyphs: "/fonts/{fontstack}/{range}.pbf",
    sources: {
      "openinfra-base": {
        type: "vector",
        tiles: ["https://openinframap.org/20250311/{z}/{x}/{y}.mvt"],
        maxzoom: 15,
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: sortLayers(allLayers),
  };
}

// Export tile layers structure for compatibility with existing code
export const TILE_LAYERS = {
  light: {
    style: createMapStyle(),
  },
};

// Export individual style functions for modularity
export { baseStyle, labelStyle, powerStyle };