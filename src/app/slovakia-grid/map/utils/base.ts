// types/map/base.ts - Base map layers (terrain, water, roads, boundaries)

import { LayerSpecificationWithZIndex } from './types';
import { colours } from './common';

export default function baseStyle(): LayerSpecificationWithZIndex[] {
  return [
    {
      zorder: 2,
      id: "background",
      type: "background", 
      paint: {
        "background-color": colours.land,
      },
    },
    {
      zorder: 20,
      id: "landuse-residential",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landuse",
      filter: ["in", "kind", "residential", "urban"],
      paint: {
        "fill-color": colours.urban,
      },
    },
    {
      zorder: 21,
      id: "landuse-green",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landuse",
      filter: [
        "in",
        "kind",
        "park",
        "cemetery",
        "protected_area",
        "nature_reserve",
        "golf_course",
        "allotments",
        "village_green",
        "playground",
        "farmland",
        "orchard",
      ],
      paint: {
        "fill-color": colours.green,
      },
    },
    {
      zorder: 23,
      id: "landuse-green-expanded",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landuse",
      filter: [
        "in",
        "kind",
        "scrub",
        "grassland", 
        "grass",
        "park",
        "cemetery",
        "protected_area",
        "nature_reserve",
        "golf_course",
        "allotments",
        "village_green",
        "playground",
        "farmland",
        "orchard"
      ],
      paint: {
        "fill-color": colours.green
      }
    },
    {
      zorder: 24,
      id: "landcover-green",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landcover",
      filter: ["in", "kind", "scrub", "grassland", "grass", "farmland"],
      paint: {
        "fill-color": colours.green,
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          1,
          7,
          0
        ]
      }
    },
    {
      zorder: 25,
      id: "landuse-wood-expanded", 
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landuse",
      filter: ["in", "kind", "wood", "forest"],
      paint: {
        "fill-color": colours.wood
      }
    },
    {
      zorder: 26,
      id: "landcover-wood",
      type: "fill",
      source: "openinfra-base", 
      "source-layer": "landcover",
      filter: ["in", "kind", "forest"],
      paint: {
        "fill-color": colours.wood,
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          1,
          7,
          0
        ]
      }
    },
    {
      zorder: 30,
      id: "osm_water",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "water",
      filter: ["==", "$type", "Polygon"],
      paint: { "fill-color": colours.water }
    },
    {
      zorder: 30,
      id: "osm_water_stream",
      type: "line",
      source: "openinfra-base",
      "source-layer": "water",
      minzoom: 14,
      filter: ["in", "kind", "stream"],
      paint: { 
        "line-color": colours.water, 
        "line-width": 0.5 
      }
    },
    {
      zorder: 30,
      id: "osm_water_river",
      type: "line",
      source: "openinfra-base",
      "source-layer": "water",
      minzoom: 9,
      filter: ["in", "kind", "river"],
      paint: {
        "line-color": colours.water,
        "line-width": [
          "interpolate", 
          ["exponential", 1.6], 
          ["zoom"], 
          9, 0, 
          9.5, 1, 
          18, 12
        ]
      }
    },
    {
      zorder: 18,
      id: "water_pressurised",
      type: "line",
      source: "openinfra-base",
      "source-layer": "pressurised_waterway",
      minzoom: 3,
      paint: {
        "line-color": colours.water,
        "line-width": [
          "interpolate", 
          ["linear"], 
          ["zoom"], 
          3, 0.3, 
          16, 4
        ]
      }
    },
    {
      zorder: 100,
      id: "roads-major",
      type: "line",
      source: "openinfra-base",
      "source-layer": "roads",
      filter: ["in", "kind", "highway", "major_road"],
      paint: {
        "line-color": colours.road_major,
        "line-width": [
          "interpolate",
          ["exponential", 1.6],
          ["zoom"],
          6,
          0.5,
          10,
          1,
          18,
          8,
        ],
      },
    },
    {
      zorder: 101,
      id: "roads-minor",
      type: "line",
      source: "openinfra-base",
      "source-layer": "roads",
      filter: ["in", "kind", "minor_road", "path"],
      minzoom: 12,
      paint: {
        "line-color": colours.road_minor,
        "line-width": [
          "interpolate",
          ["exponential", 1.6],
          ["zoom"],
          12,
          0.5,
          18,
          3,
        ],
      },
    },
    {
      zorder: 102,
      id: 'boundaries',
      type: 'line',
      source: 'openinfra-base',
      'source-layer': 'boundaries',
      filter: ['<=', 'kind_detail', 2],  // This is the key filter
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': colours['border'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 20, 9],
        'line-dasharray': [2, 1]
      }
    },
    {
      zorder: 15,
      id: "landcover-ice",
      type: "fill",
      source: "openinfra-base",
      "source-layer": "landcover",
      filter: ["==", "kind", "glacier"],
      paint: {
        "fill-color": colours.ice,
      },
    },
    {
      zorder: 16, 
      id: "landcover-sand",
      type: "fill",
      source: "openinfra-base", 
      "source-layer": "landcover",
      filter: ["==", "kind", "sand"],
      paint: {
        "fill-color": colours.sand,
      },
    }
  ];
}