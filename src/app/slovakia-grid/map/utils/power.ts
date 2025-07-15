// types/map/power.ts - Power infrastructure styles

import { LayerSpecificationWithZIndex } from "./types";
import { power_colors, font, text_halo } from "./common";
import type { FilterSpecification } from "maplibre-gl";

// Power infrastructure visibility expressions (based on OpenInfraMap)
const substation_label_visible: FilterSpecification = [
  "all",
  [
    "any",
    [">", ["at", 0, ["get", "voltage"]], 399], // First voltage > 399kV
    ["all", [">", ["at", 0, ["get", "voltage"]], 200], [">", ["zoom"], 8]], // First voltage > 200kV at zoom 8+
    ["all", [">", ["at", 0, ["get", "voltage"]], 100], [">", ["zoom"], 10]], // First voltage > 100kV at zoom 10+
    ["all", [">", ["at", 0, ["get", "voltage"]], 50], [">", ["zoom"], 12]], // First voltage > 50kV at zoom 12+
    [">", ["zoom"], 13], // Everything at zoom 13+
  ],
  ["!=", ["get", "substation"], "transition"], // Exclude transition substations
];

const plant_label_visible: FilterSpecification = [
  "any",
  [">", ["to-number", ["coalesce", ["get", "power"], 0]], 10000], // Always show 1000MW+
  [
    "all",
    [">", ["to-number", ["coalesce", ["get", "power"], 0]], 750],
    [">", ["zoom"], 5],
  ], // 750MW+ at zoom 5+
  [
    "all",
    [">", ["to-number", ["coalesce", ["get", "power"], 0]], 250],
    [">", ["zoom"], 6],
  ], // 250MW+ at zoom 6+
  [
    "all",
    [">", ["to-number", ["coalesce", ["get", "power"], 0]], 100],
    [">", ["zoom"], 7],
  ], // 100MW+ at zoom 7+
  [
    "all",
    [">", ["to-number", ["coalesce", ["get", "power"], 0]], 10],
    [">", ["zoom"], 9],
  ], // 10MW+ at zoom 9+
  [">", ["zoom"], 11], // Everything at zoom 11+
];

export default function powerStyle(): LayerSpecificationWithZIndex[] {
  return [
    // 400kV Transmission lines
    {
      zorder: 264,
      id: "transmission-lines-400",
      type: "line",
      source: "transmission-lines-400",
      filter: ["==", ["get", "voltage"], 400],
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          3, 0.8,
          18, ["case", ["==", ["get", "usage"], "transmission"], 10, 8]
        ],
        "line-color": power_colors[400],
        "line-opacity": 0.8,
      }
    },

    //400 kV Transmission line labels
    {
      zorder: 561,
      id: "transmission-line-labels-400",
      type: "symbol",
      source: "transmission-lines-400",
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
        "text-size": 10,
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

    // 220kV Transmission Lines
    {
      zorder: 263,
      id: "transmission-lines-220",
      type: "line",
      source: "transmission-lines-220", // assuming same source
      filter: ["==", ["get", "voltage"], 220],
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          3, 0.6,
          18, ["case", ["==", ["get", "usage"], "transmission"], 8, 6]
        ],
        "line-color": power_colors[220],
        "line-opacity": 0.8,
      }
    },

    //220 kV Transmission line labels
    {
      zorder: 561,
      id: "transmission-line-labels-220",
      type: "symbol",
      source: "transmission-lines-220",
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
        "text-size": 10,
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

    // 110kV Transmission Lines
    {
      zorder: 262,
      id: "transmission-lines-110",
      type: "line",
      source: "transmission-lines-110",
      filter: ["==", ["get", "voltage"], 110],
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          3, 0.5,
          18, ["case", ["==", ["get", "usage"], "transmission"], 6, 5]
        ],
        "line-color": power_colors[110],
        "line-opacity": 0.8,
      }
    },

    // 22kV Transmission Lines
    {
      zorder: 261,
      id: "transmission-lines-22",
      type: "line",
      source: "transmission-lines-400",
      filter: ["==", ["get", "voltage"], 22],
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          3, 0.3,
          18, ["case", ["==", ["get", "usage"], "transmission"], 4, 3]
        ],
        "line-color": power_colors[22],
        "line-opacity": 0.8,
      }
    },

    // Tower symbols
    {
      zorder: 268,
      id: "tower-symbols",
      type: "symbol",
      source: "towers",
      minzoom: 13,
      filter: ["!=", ["get", "type"], "connection"],
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
      zorder: 266,
      id: "substation-circles",
      type: "circle",
      source: "substation-points",
      maxzoom: 13,
      minzoom: 8,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 2, 12, 6],
        "circle-color": [
          "case",
          ["==", ["get", "voltage"], 400],
          power_colors[400],
          ["==", ["get", "voltage"], 220],
          power_colors[220],
          ["==", ["get", "voltage"], 110],
          power_colors[110],
          ["==", ["get", "voltage"], 22],
          power_colors[22],
          power_colors.default,
        ],
        "circle-stroke-width": 0.5,
        "circle-stroke-color": power_colors.substation_stroke,
        "circle-opacity": 0.8,
      },
    },

    // Substation areas (high zoom)
    {
      zorder: 270,
      id: "substation-areas",
      type: "fill",
      source: "substation-polygons",
      minzoom: 13,
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "voltage"], 400],
          power_colors[400],
          ["==", ["get", "voltage"], 220],
          power_colors[220],
          ["==", ["get", "voltage"], 110],
          power_colors[110],
          ["==", ["get", "voltage"], 22],
          power_colors[22],
          power_colors.default,
        ],
        "fill-opacity": 0.3,
      },
    },

    // Substation outlines (high zoom)
    {
      zorder: 271,
      id: "substation-outlines",
      type: "line",
      source: "substation-polygons",
      minzoom: 13,
      paint: {
        "line-color": "#1E1E1E",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0,
          6,
          0.1,
          12,
          1,
          18,
          3,
        ],
      },
    },

    // Main substation labels
    {
      zorder: 562,
      id: "power_substation_label",
      type: "symbol",
      source: "substation-points",
      // filter: substation_label_visible,
      minzoom: 8,
      layout: {
        "symbol-sort-key": [
          "-",
          10000,
          ["to-number", ["coalesce", ["get", "voltage"], 0]],
        ],
        "symbol-z-order": "source",
        "text-field": [
          "step",
          ["zoom"],
          ["coalesce", ["get", "name"], ""], // Just name at low zoom
          12, // At zoom 12+, show detailed info
          [
            "case",
            [
              "all",
              ["!=", ["coalesce", ["get", "name"], ""], ""],
              ["has", "voltage"],
            ],
            [
              "concat",
              ["coalesce", ["get", "name"], ""],
              " ",
              ["to-string", ["get", "voltage"]],
              " kV",
            ],
            [
              "all",
              ["==", ["coalesce", ["get", "name"], ""], ""],
              ["has", "voltage"],
            ],
            ["concat", "Substation ", ["to-string", ["get", "voltage"]], " kV"],
            ["coalesce", ["get", "name"], ""],
          ],
        ],
        "text-font": font,
        "text-variable-anchor": ["top", "bottom"],
        "text-radial-offset": 0.8,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          10,
          18,
          [
            "interpolate",
            ["linear"],
            ["to-number", ["coalesce", ["get", "voltage"], 0]],
            0,
            10,
            400,
            16,
          ],
        ],
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5,
      },
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
          [
            "all",
            [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 200],
            [">", ["zoom"], 8],
          ],
          [
            "all",
            [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 100],
            [">", ["zoom"], 10],
          ],
          [
            "all",
            [">", ["to-number", ["coalesce", ["get", "voltage"], 0]], 50],
            [">", ["zoom"], 12],
          ],
          [">", ["zoom"], 13],
        ],
        ["!=", ["get", "substation"], "transition"],
        ["!=", ["coalesce", ["get", "ref"], ""], ""],
      ],
      minzoom: 14.5,
      layout: {
        "symbol-z-order": "source",
        "text-field": ["get", "ref"],
        "text-font": font,
        "text-anchor": "bottom",
        "text-offset": [0, -0.5],
        "text-size": ["interpolate", ["linear"], ["zoom"], 14, 9, 21, 14],
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5,
      },
    },

    // Power plant labels
    {
      zorder: 270,
      id: "power_plant_label",
      type: "symbol",
      source: "power-plants",
      filter: plant_label_visible,
      minzoom: 6,
      maxzoom: 24,
      layout: {
        "symbol-sort-key": [
          "-",
          10000,
          ["to-number", ["coalesce", ["get", "output"], 0]],
        ],
        "symbol-z-order": "source",
        "icon-allow-overlap": true,
        "icon-image": "power_plant",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          0.5,
          13,
          [
            "interpolate",
            ["linear"],
            ["to-number", ["coalesce", ["get", "output"], 0]],
            0,
            0.6,
            1000,
            1,
          ],
        ],
        "text-field": [
          "step",
          ["zoom"],
          ["coalesce", ["get", "name"], ""],
          9,
          [
            "case",
            [
              "all",
              ["!=", ["coalesce", ["get", "name"], ""], ""],
              ["has", "output"],
            ],
            [
              "concat",
              ["coalesce", ["get", "name"], ""],
              "\n(",
              ["to-string", ["get", "output"]],
              " MW)",
            ],
            ["coalesce", ["get", "name"], ""],
          ],
        ],
        "text-font": font,
        "text-variable-anchor": ["top", "bottom"],
        "text-radial-offset": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7,
          1,
          13,
          [
            "interpolate",
            ["linear"],
            ["to-number", ["coalesce", ["get", "output"], 0]],
            0,
            1,
            1000,
            1.6,
          ],
          14,
          0,
        ],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7,
          10,
          18,
          [
            "interpolate",
            ["linear"],
            ["to-number", ["coalesce", ["get", "output"], 0]],
            0,
            10,
            2000,
            16,
          ],
        ],
        "text-optional": true,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5,
        "icon-opacity": ["step", ["zoom"], 1, 13, 0],
      },
    },

    // Power plant areas (high zoom)
    {
      zorder: 266,
      id: "power-plant-areas",
      type: "fill",
      source: "power-plant-polygons",
      minzoom: 10,
      paint: {
        "fill-color": "#999999",
        "fill-opacity": 0.5
      },
    },

    // Power plant icons (low zoom)
    {
      zorder: 267,
      id: "power-plant-symbols",
      type: "symbol",
      source: "power-plants",
      maxzoom: 16,
      filter: plant_label_visible,
      layout: {
        "symbol-sort-key": [
          "-",
          10000,
          ["to-number", ["coalesce", ["get", "output"], 0]],
        ],
        "symbol-z-order": "source",
        "icon-allow-overlap": true,
        "icon-image": [
          "case",
          ["==", ["get", "source"], "solar"],
          "power_plant_solar",
          ["==", ["get", "source"], "wind"],
          "power_plant_wind",
          ["==", ["get", "source"], "biomass"],
          "power_plant_biomass",
          ["==", ["get", "source"], "gas"],
          "power_plant_oilgas",
          ["==", ["get", "source"], "oil"],
          "power_plant_oilgas",
          ["==", ["get", "source"], "geothermal"],
          "power_plant_geothermal",
          ["==", ["get", "source"], "hydro"],
          "power_plant_hydro",
          ["==", ["get", "source"], "nuclear"],
          "power_plant_nuclear",
          ["==", ["get", "source"], "coal"],
          "power_plant_coal",
          "power_plant", // fallback for unknown types
        ],
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          0.5,
          13,
          [
            "interpolate",
            ["linear"],
            ["to-number", ["coalesce", ["get", "output"], 0]],
            0,
            0.6,
            1000,
            1,
          ],
        ]
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": text_halo,
        "text-halo-width": 1.5,
        "icon-opacity": ["step", ["zoom"], 1, 13, 0],
      },
    },

    // Power plant outlines (polygon borders)
    {
      zorder: 264,
      id: "power-plant-outlines",
      type: "line",
      source: "power-plant-polygons",
      minzoom: 10,
      paint: {
        "line-color": "#333333",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          1,
          15,
          2,
          18,
          3,
        ],
        "line-opacity": 0.8,
      },
    },
  ];
}

export { substation_label_visible, plant_label_visible };
