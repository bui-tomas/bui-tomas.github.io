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

function sunDeclinationAngle(date: Date): number {
  const dayOfYear =
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000

  return 23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180))
}

function sunPolarAngle(date: Date): number {
  const angle = ((date.getUTCHours() + date.getUTCMinutes() / 60) / 24) * 360
  return angle
}

function sunPosition(date: Date): [number, number, number] {
  return [1.5, 90 + sunDeclinationAngle(date), sunPolarAngle(date)]
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
      'sky-color': '#1A6566',
      'horizon-color': '#863BED',
      'fog-color': '#4B575E',
      'sky-horizon-blend': 0.5,
      'horizon-fog-blend': 0.5,
      'fog-ground-blend': 0.5,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 2, 0.4, 4, 0]
    },
    light: {
      anchor: 'map',
      color: '#F5F02E',
      intensity: 0.8,
      position: sunPosition(new Date())
    },
    glyphs: "/fonts/{fontstack}/{range}.pbf",
    sources: {
      "openinfra-base": {
        type: "vector",
        tiles: ["https://openinframap.org/20250311/{z}/{x}/{y}.pbf"],
        maxzoom: 15,
        
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> | <a href="https://openinframap.org/">Open Infrastructure Map</a>',
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