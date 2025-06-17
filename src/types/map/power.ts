// types/map/power.ts - Power infrastructure styles

import { LayerSpecificationWithZIndex } from './types';
import { power_colors, font, text_halo } from './common';
import type { FilterSpecification } from 'maplibre-gl';

// Power infrastructure visibility expressions (based on OpenInfraMap)
const substation_label_visible: FilterSpecification = [
  "all",
  [
    "any",
    [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 399],                    // Always show 400kV+
    ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 200], [">", ["zoom"], 8]],  // 200kV+ at zoom 8+
    ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 100], [">", ["zoom"], 10]], // 100kV+ at zoom 10+
    ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 50], [">", ["zoom"], 12]],  // 50kV+ at zoom 12+
    [">", ["zoom"], 13]  // Everything at zoom 13+
  ],
  ["!=", ["get", "substation"], "transition"]  // Exclude transition substations
];

const plant_label_visible: FilterSpecification = [
  "any",
  [">", ["to-number", ["coalesce", ["get", "output"], 0]], 1000],                      // Always show 1000MW+
  ["all", [">", ["to-number", ["coalesce", ["get", "output"], 0]], 750], [">", ["zoom"], 5]],   // 750MW+ at zoom 5+
  ["all", [">", ["to-number", ["coalesce", ["get", "output"], 0]], 250], [">", ["zoom"], 6]],   // 250MW+ at zoom 6+
  ["all", [">", ["to-number", ["coalesce", ["get", "output"], 0]], 100], [">", ["zoom"], 7]],   // 100MW+ at zoom 7+
  ["all", [">", ["to-number", ["coalesce", ["get", "output"], 0]], 10], [">", ["zoom"], 9]],    // 10MW+ at zoom 9+
  [">", ["zoom"], 11]  // Everything at zoom 11+
];

export default function powerStyle(): LayerSpecificationWithZIndex[] {
  return [
    // Transmission lines
    {
      zorder: 260,
      id: "transmission-lines",
      type: "line",
      source: "transmission-lines",
      paint: {
        "line-width": [
          "case",
          ["==", ["get", "voltage"], "400kV"], 1.4,
          ["==", ["get", "voltage"], "220kV"], 1,
          ["==", ["get", "voltage"], "110kV"], 1.5,
          0.6,
        ],
        "line-color": [
          "case",
          ["==", ["get", "voltage"], "400kV"], power_colors["400kV"],
          ["==", ["get", "voltage"], "220kV"], power_colors["220kV"],
          ["==", ["get", "voltage"], "110kV"], power_colors["110kV"],
          ["==", ["get", "voltage"], "22kV"], power_colors["22kV"],
          power_colors.default,
        ],
        "line-opacity": 0.8,
      },
    },
    
    // Transmission line labels
    {
      zorder: 561,
      id: "transmission-line-labels",
      type: "symbol",
      source: "transmission-lines",
      minzoom: 10,
      layout: {
        "text-field": [
          "case",
          ["has", "name"],
          ["concat", ["get", "name"], " (", ["get", "voltage"], ")"],
          ["get", "voltage"],
        ],
        "text-font": font,
        "symbol-placement": "line",
        "symbol-spacing": 400,
        "text-size": 12,
        "text-offset": [0, 1],
        "text-max-angle": 15,
        "text-padding": 2,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },

    // Tower symbols
    {
      zorder: 268,
      id: "tower-symbols",
      type: "symbol",
      source: "towers",
      minzoom: 12,
      layout: {
        "icon-image": "tower-icon",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12,
          0.5,
          15,
          1,
          18,
          1,
        ],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-opacity": ["step", ["zoom"], 0, 12, 0.9],
      },
    },

    // Substation circles (low zoom)
    {
      zorder: 269,
      id: "substation-circles",
      type: "circle",
      source: "substation-points",
      maxzoom: 11.99,
      paint: {
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          8, 6, 12, 12
        ],
        "circle-color": power_colors.substation,
        "circle-stroke-width": 2,
        "circle-stroke-color": power_colors.substation_stroke,
        "circle-opacity": 0.8
      }
    },

    // Substation areas (high zoom)
    {
      zorder: 270,
      id: "substation-areas",
      type: "fill",
      source: "substation-polygons",
      minzoom: 12,
      paint: {
        "fill-color": power_colors.substation,
        "fill-opacity": 0.3
      }
    },

    // Substation outlines (high zoom)
    {
      zorder: 271,
      id: "substation-outlines", 
      type: "line",
      source: "substation-polygons",
      minzoom: 12,
      paint: {
        "line-color": "#1E1E1E",
        "line-width": [
          "interpolate", ["linear"], ["zoom"],
          12, 1, 18, 3
        ]
      }
    },

    // Main substation labels
    {
      zorder: 562,
      id: "power_substation_label",
      type: "symbol",
      source: "substation-points",
      filter: substation_label_visible,
      minzoom: 8,
      layout: {
        "symbol-sort-key": ["-", 10000, ["to-number", ["coalesce", ["get", "voltage"], 0]]],
        "symbol-z-order": "source",
        "text-field": [
          "step", ["zoom"], 
          ["coalesce", ["get", "name"], ""], // Just name at low zoom
          12, // At zoom 12+, show detailed info
          [
            "case",
            ["all", ["!=", ["coalesce", ["get", "name"], ""], ""], ["has", "voltage"]],
            ["concat", 
              ["coalesce", ["get", "name"], ""], " ", 
              ["to-string", ["get", "voltage"]], " kV"
            ],
            ["all", ["==", ["coalesce", ["get", "name"], ""], ""], ["has", "voltage"]],
            ["concat", "Substation ", ["to-string", ["get", "voltage"]], " kV"],
            ["coalesce", ["get", "name"], ""]
          ]
        ],
        "text-font": font,
        "text-variable-anchor": ["top", "bottom"],
        "text-radial-offset": 0.8,
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          8, 10,
          18, [
            "interpolate", ["linear"], ["to-number", ["coalesce", ["get", "voltage"], 0]],
            0, 10,
            400, 16
          ]
        ],
        "text-max-width": 8
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5
      }
    },

    // Substation reference labels (high zoom)
    {
      zorder: 563,
      id: "power_substation_ref_label",
      type: "symbol",
      source: "substation-points",
      filter: [
        "all",
        [
          "any",
          [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 399],
          ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 200], [">", ["zoom"], 8]],
          ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 100], [">", ["zoom"], 10]],
          ["all", [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 50], [">", ["zoom"], 12]],
          [">", ["zoom"], 13]
        ],
        ["!=", ["get", "substation"], "transition"],
        ["!=", ["coalesce", ["get", "ref"], ""], ""]
      ],
      minzoom: 14.5,
      layout: {
        "symbol-z-order": "source",
        "text-field": ["get", "ref"],
        "text-font": font,
        "text-anchor": "bottom",
        "text-offset": [0, -0.5],
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          14, 9,
          21, 14
        ],
        "text-max-width": 8
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5
      }
    },

    // Power plant labels (if you have plants data)
    {
      zorder: 564,
      id: "power_plant_label",
      type: "symbol",
      source: "power-plants",
      filter: plant_label_visible,
      minzoom: 6,
      maxzoom: 24,
      layout: {
        "symbol-sort-key": ["-", 10000, ["to-number", ["coalesce", ["get", "output"], 0]]],
        "symbol-z-order": "source",
        "icon-allow-overlap": true,
        "icon-image": "power_plant",
        "icon-size": [
          "interpolate", ["linear"], ["zoom"],
          6, 0.5,
          13, [
            "interpolate", ["linear"], ["to-number", ["coalesce", ["get", "output"], 0]],
            0, 0.6,
            1000, 1
          ]
        ],
        "text-field": [
          "step", ["zoom"],
          ["coalesce", ["get", "name"], ""],
          9,
          [
            "case",
            ["all", ["!=", ["coalesce", ["get", "name"], ""], ""], ["has", "output"]],
            ["concat", 
              ["coalesce", ["get", "name"], ""], 
              "\n(", ["to-string", ["get", "output"]], " MW)"
            ],
            ["coalesce", ["get", "name"], ""]
          ]
        ],
        "text-font": font,
        "text-variable-anchor": ["top", "bottom"],
        "text-radial-offset": [
          "interpolate", ["linear"], ["zoom"],
          7, 1,
          13, [
            "interpolate", ["linear"], ["to-number", ["coalesce", ["get", "output"], 0]],
            0, 1,
            1000, 1.6
          ],
          14, 0
        ],
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          7, 10,
          18, [
            "interpolate", ["linear"], ["to-number", ["coalesce", ["get", "output"], 0]],
            0, 10,
            2000, 16
          ]
        ],
        "text-optional": true
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5,
        "icon-opacity": ["step", ["zoom"], 1, 13, 0]
      }
    }
  ];
}

// Export visibility expressions for reuse
export { substation_label_visible, plant_label_visible };