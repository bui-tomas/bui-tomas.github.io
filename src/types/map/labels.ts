// types/map/labels.ts - Place labels (countries, regions, localities)

import { LayerSpecificationWithZIndex } from './types';
import { label_colors, text_halo, font } from './common';

export default function labelStyle(): LayerSpecificationWithZIndex[] {
  return [
    {
      zorder: 1000,
      id: "label_places_country",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "places",
      minzoom: 2,
      maxzoom: 8,
      filter: ["==", "kind", "country"],
      layout: {
        "symbol-sort-key": ["get", "min_zoom"],
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": font,
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          2, [
            "case", 
            ["<", ["get", "population_rank"], 10], 7, 
            [">=", ["get", "population_rank"], 10], 10, 
            0
          ],
          6, [
            "case", 
            ["<", ["get", "population_rank"], 8], 8, 
            [">=", ["get", "population_rank"], 8], 18, 
            0
          ],
          8, [
            "case", 
            ["<", ["get", "population_rank"], 7], 11, 
            [">=", ["get", "population_rank"], 7], 20, 
            0
          ]
        ],
        "icon-padding": [
          "interpolate", ["linear"], ["zoom"], 
          0, 2, 14, 2, 16, 20, 17, 2, 22, 2
        ]
      },
      paint: {
        "text-color": label_colors.country,
        "text-halo-color": text_halo,
        "text-halo-width": 2
      }
    },
    {
      zorder: 1001,
      id: "label_places_region",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "places",
      minzoom: 5,
      maxzoom: 8,
      filter: ["==", "kind", "region"],
      layout: {
        "symbol-sort-key": ["get", "min_zoom"],
        "text-font": font,
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 7, 7, 14],
        "text-radial-offset": 0.2,
        "text-anchor": "center"
      },
      paint: {
        "text-color": label_colors.region,
        "text-halo-color": text_halo,
        "text-halo-width": 2
      }
    },
    {
      zorder: 1002,
      id: "label_places_locality",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "places",
      minzoom: 5.5,
      maxzoom: 12,
      filter: ["==", "kind", "locality"],
      layout: {
        "icon-size": 0.7,
        "text-font": font,
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-padding": [
          "interpolate", ["linear"], ["zoom"], 
          5, 3, 8, 7, 12, 11
        ],
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          2, [
            "case", 
            ["<", ["get", "population_rank"], 13], 8, 
            [">=", ["get", "population_rank"], 13], 13, 
            0
          ],
          4, [
            "case", 
            ["<", ["get", "population_rank"], 13], 10, 
            [">=", ["get", "population_rank"], 13], 15, 
            0
          ],
          6, [
            "case", 
            ["<", ["get", "population_rank"], 12], 11, 
            [">=", ["get", "population_rank"], 12], 17, 
            0
          ],
          8, [
            "case", 
            ["<", ["get", "population_rank"], 11], 11, 
            [">=", ["get", "population_rank"], 11], 18, 
            0
          ],
          10, [
            "case", 
            ["<", ["get", "population_rank"], 9], 12, 
            [">=", ["get", "population_rank"], 9], 20, 
            0
          ],
          15, [
            "case", 
            ["<", ["get", "population_rank"], 8], 12, 
            [">=", ["get", "population_rank"], 8], 22, 
            0
          ]
        ],
        "icon-padding": [
          "interpolate", ["linear"], ["zoom"], 
          0, 0, 8, 4, 10, 8, 12, 6, 22, 2
        ],
        "text-justify": "auto"
      },
      paint: {
        "text-color": label_colors.locality,
        "text-halo-color": text_halo,
        "text-halo-width": 1.5
      }
    },
    {
      zorder: 1003,
      id: "label_places_subplace",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "places",
      minzoom: 13,
      maxzoom: 14,
      filter: ["==", "kind", "neighbourhood"],
      layout: {
        "symbol-sort-key": ["get", "min_zoom"],
        "text-font": font,
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-max-width": 7,
        "text-letter-spacing": 0.1,
        "text-padding": [
          "interpolate", ["linear"], ["zoom"], 
          5, 2, 8, 4, 12, 18, 15, 20
        ],
        "text-size": [
          "interpolate", ["exponential", 1.2], ["zoom"], 
          11, 8, 14, 14, 18, 24
        ]
      },
      paint: {
        "text-color": label_colors.locality,
        "text-halo-color": text_halo,
        "text-halo-width": 1
      }
    },
    {
      zorder: 1004,
      id: "label_water_waterway",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "water",
      minzoom: 10,
      filter: ["in", "kind", "river", "stream"],
      layout: {
        "symbol-placement": "line",
        "text-font": font,
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-size": 11,
      },
      paint: {
        "text-color": "#4682b4",
        "text-halo-color": "rgba(255, 255, 255, 0.9)",
        "text-halo-width": 1.5,
      },
    },
    {
      zorder: 1005,
      id: "label_roads_major",
      type: "symbol",
      source: "openinfra-base",
      "source-layer": "roads",
      minzoom: 12,
      filter: ["in", "kind", "highway", "major_road"],
      layout: {
        "symbol-placement": "line",
        "text-font": font,
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-size": 10,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": "rgba(255, 255, 255, 0.8)",
        "text-halo-width": 1.5,
      },
    },
  ];
}