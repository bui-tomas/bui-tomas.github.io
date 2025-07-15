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
export * from './utils'

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
    projection: { type: "globe" },
    sky: {
      "sky-color": "#87CEEB",
      "horizon-color": "#ffffff",
      // ... rest of sky config
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
        tiles: ["https://openinframap.org/20250311/{z}/{x}/{y}.pbf"],
        maxzoom: 15,
        
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> | <a href="https://openinframap.org/">Open Infrastructure Map</a>',
      },
      "blackmarble": {
        type: "raster",
        tiles: ["https://openinframap.org/black-marble-2023/{z}/{x}/{y}.webp"],
        maxzoom: 8,
        attribution: 'NASA Black Marble 2023'
      },
      "transmission-lines": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "transmission-lines-400": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "transmission-lines-220": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "transmission-lines-110": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "towers": {
        type: "geojson", 
        data: { type: "FeatureCollection", features: [] }
      },
      "substation-points": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "substation-polygons": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "power-plants": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      },
      "power-plant-polygons": {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      }
    },
    layers: sortLayers(allLayers),
  };
}

export const TILE_LAYERS = {
  light: {
    style: createMapStyle(),
  },
};

export { baseStyle, labelStyle, powerStyle };