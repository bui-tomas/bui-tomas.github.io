"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Tower,
  TransmissionLine,
  SlovakiaGridData,
} from "@/types/map/slovakia-grid";

// Vector tile style configurations
function landcover_colour(hue: number, sat: string, initial_lum = "85%") {
  return [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    `hsl(${hue}, ${sat}, ${initial_lum})`,
    6,
    `hsl(${hue}, ${sat}, 93%)`,
  ];
}

const calculateCentroid = (nodes: Array<{lat: number; lng: number}>) => ({
  lat: nodes.reduce((sum, n) => sum + n.lat, 0) / nodes.length,
  lng: nodes.reduce((sum, n) => sum + n.lng, 0) / nodes.length  // ← FIX: Add sum +
});

const colours = {
  land: landcover_colour(42, "10%"),
  ice: landcover_colour(180, "14%"),
  urban: landcover_colour(245, "6%", "82%"),
  water: [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    "hsl(207, 25%, 75%)",
    12,
    "hsl(207, 14%, 86%)",
  ],
  green: landcover_colour(90, "20%", "86%"),
  wood: landcover_colour(100, "20%", "81%"),
  sand: landcover_colour(57, "20%"),
  road_casing: "hsl(0, 0%, 96%)",
  road_minor: "hsl(0, 0%, 89%)",
  road_minor_low: "hsl(0, 0%, 91%)",
  road_major: "hsl(0, 0%, 84%)",
  rail_2: "hsl(0, 0%, 92%)",
  rail: "hsl(0, 0%, 80%)",
  border: [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    "hsl(0, 30%, 60%)",
    12,
    "hsl(0, 10%, 80%)",
  ],
};

export const TILE_LAYERS = {
  light: {
    style: {
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
          attribution:
            '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": colours.land,
          },
        },
        {
          id: "water",
          type: "fill",
          source: "openinfra-base",
          "source-layer": "water",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "fill-color": colours.water,
          },
        },
        {
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
          id: "landuse-wood",
          type: "fill",
          source: "openinfra-base",
          "source-layer": "landuse",
          filter: ["in", "kind", "forest", "wood"],
          paint: {
            "fill-color": colours.wood,
          },
        },
        {
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
          id: "boundaries",
          type: "line",
          source: "openinfra-base",
          "source-layer": "boundaries",
          paint: {
            "line-color": colours.border,
            "line-width": 1,
            "line-dasharray": [3, 3],
          },
        },
{
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
    "text-font": ["Noto Sans Regular"],
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
    "text-color": "hsl(0, 0%, 20%)",
    "text-halo-color": "rgb(242,243,240)",
    "text-halo-width": 2
  }
},
{
  id: "label_places_region",
  type: "symbol",
  source: "openinfra-base",
  "source-layer": "places",
  minzoom: 5,
  maxzoom: 8,
  filter: ["==", "kind", "region"],
  layout: {
    "symbol-sort-key": ["get", "min_zoom"],
    "text-font": ["Noto Sans Regular"],
    "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
    "text-size": ["interpolate", ["linear"], ["zoom"], 3, 7, 7, 14],
    "text-radial-offset": 0.2,
    "text-anchor": "center"
  },
  paint: {
    "text-color": "hsl(0, 0%, 30%)",
    "text-halo-color": "rgb(242,243,240)",
    "text-halo-width": 2
  }
},
{
  id: "label_places_locality",
  type: "symbol",
  source: "openinfra-base",
  "source-layer": "places",
  minzoom: 5.5,
  maxzoom: 12,
  filter: ["==", "kind", "locality"],
  layout: {
    "icon-size": 0.7,
    "text-font": ["Noto Sans Regular"],
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
    "text-color": "hsl(0, 0%, 40%)",
    "text-halo-color": "rgb(242,243,240)",
    "text-halo-width": 1.5
  }
},
        {
          id: "label_places_subplace",
          type: "symbol",
          source: "openinfra-base",
          "source-layer": "places",
          minzoom: 13,
          filter: ["==", "kind", "neighbourhood"],
          layout: {
            "text-font": ["Noto Sans Regular"],
            "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
            "text-size": 10,
            "text-padding": 8,
          },
          paint: {
            "text-color": "#666",
            "text-halo-color": "rgba(255, 255, 255, 0.8)",
            "text-halo-width": 1,
          },
        },
        {
          id: "label_water_waterway",
          type: "symbol",
          source: "openinfra-base",
          "source-layer": "water",
          minzoom: 10,
          filter: ["in", "kind", "river", "stream"],
          layout: {
            "symbol-placement": "line",
            "text-font": ["Noto Sans Regular"],
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
          id: "label_roads_major",
          type: "symbol",
          source: "openinfra-base",
          "source-layer": "roads",
          minzoom: 12,
          filter: ["in", "kind", "highway", "major_road"],
          layout: {
            "symbol-placement": "line",
            "text-font": ["Noto Sans Regular"],
            "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
            "text-size": 10,
          },
          paint: {
            "text-color": "#333",
            "text-halo-color": "rgba(255, 255, 255, 0.8)",
            "text-halo-width": 1.5,
          },
        },
      ],
    },
  },
};

export interface MapLibreProps {
  gridData: SlovakiaGridData | null;
  currentTileLayer: string;
  onMapReady: () => void;
  onError: (error: string) => void;
  className?: string;
}

export interface MapLibreRef {
  changeStyle: (layerType: string) => void;
  isReady: () => boolean;
}

const MapLibreComponent = forwardRef<MapLibreRef, MapLibreProps>(
  (
    { gridData, currentTileLayer, onMapReady, onError, className = "" },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      changeStyle: (layerType: string) => {
        if (!map.current || !TILE_LAYERS[layerType as keyof typeof TILE_LAYERS])
          return;

        console.log("Changing tile layer to:", layerType);
        const newStyle = TILE_LAYERS[layerType as keyof typeof TILE_LAYERS]
          .style as unknown as maplibregl.StyleSpecification;
        map.current.setStyle(newStyle);

        // Re-add data layers after style change
        map.current.once("styledata", () => {
          if (gridData) {
            setTimeout(() => {
              // This will trigger the grid data effect to re-run
              addGridDataToMap();
            }, 100);
          }
        });
      },
      isReady: () =>
        mapReady && !!map.current && (map.current?.isStyleLoaded() ?? false),
    }));

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      try {
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: TILE_LAYERS.light
            .style as unknown as maplibregl.StyleSpecification,
          center: [20.5, 48.7],
          zoom: 6.7,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        });

        // Load tower icon
        map.current
          .loadImage("images/icons/tower.png")
          .then((image) => {
            if (map.current && !map.current.hasImage("tower-icon")) {
              map.current.addImage("tower-icon", image.data);
            }
          })
          .catch((error) => {
            console.error("Error loading tower image:", error);
          });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-left");

        // Handle map load
        map.current.on("load", () => {
          console.log("MapLibre map loaded successfully");
          setMapReady(true);
          onMapReady();
          addCustomStyles();
        });

        // Handle map errors
        map.current.on("error", (e) => {
          console.error("Map error:", e);
          onError("Failed to load map");
        });
      } catch (err) {
        console.error("Error initializing map:", err);
        onError("Failed to initialize map");
      }

      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }, [onMapReady, onError]);

    // Add custom popup styles
    const addCustomStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .maplibregl-popup-content {
          background: rgba(0, 0, 0, 0.9) !important;
          color: white !important;
          border-radius: 6px !important;
          padding: 12px !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .maplibregl-popup-tip {
          border-top-color: rgba(0, 0, 0, 0.9) !important;
        }
        
        .maplibregl-popup-close-button {
          color: white !important;
          font-size: 16px !important;
          padding: 4px !important;
        }
        
        .power-tooltip strong {
          color: #60a5fa !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Add grid data to map
    const addGridDataToMap = () => {
      if (!map.current || !gridData) {
        console.log("Map or grid data not available, skipping");
        return;
      }

      console.log("Adding electrical grid data to map...");

      // Remove existing sources if they exist
      if (map.current.getSource("transmission-lines")) {
  map.current.removeLayer("transmission-lines");
  map.current.removeSource("transmission-lines");
}
if (map.current.getSource("towers")) {
  map.current.removeLayer("tower-symbols");
  map.current.removeSource("towers");
}
// Remove both substation sources
if (map.current.getSource("substation-points")) {
  map.current.removeLayer("substation-circles");
  map.current.removeSource("substation-points");
}
if (map.current.getSource("substation-polygons")) {
  map.current.removeLayer("substation-areas");
  map.current.removeLayer("substation-outlines");
  map.current.removeSource("substation-polygons");
}

      // Add transmission lines and towers
      if (
        gridData.transmission_lines &&
        gridData.transmission_lines.length > 0
      ) {
        const allTowers: Tower[] = [];
        const allLines: {
          line: TransmissionLine;
          coordinates: [number, number][];
        }[] = [];

        gridData.transmission_lines.forEach((line) => {
          if (line.towers && line.towers.length >= 2) {
            allTowers.push(...line.towers);
            const coordinates: [number, number][] = line.towers.map((tower) => [
              tower.lng,
              tower.lat,
            ]);
            allLines.push({ line, coordinates });
          }
        });

        // Add transmission lines
        if (allLines.length > 0) {
          const linesGeoJSON = {
            type: "FeatureCollection" as const,
            features: allLines.map((lineData, index) => ({
              type: "Feature" as const,
              id: `line-${index}`,
              geometry: {
                type: "LineString" as const,
                coordinates: lineData.coordinates,
              },
              properties: {
                name: lineData.line.name,
                voltage: lineData.line.voltage,
                operator: lineData.line.operator,
                status: lineData.line.status,
                description: lineData.line.description || "",
              },
            })),
          };

          map.current.addSource("transmission-lines", {
            type: "geojson",
            data: linesGeoJSON,
          });

          map.current.addLayer({
            id: "transmission-lines",
            type: "line",
            source: "transmission-lines",
            paint: {
              "line-width": [
                "case",
                ["==", ["get", "voltage"], "400kV"],
                1.4,
                ["==", ["get", "voltage"], "220kV"],
                1,
                ["==", ["get", "voltage"], "110kV"],
                1.5,
                0.6,
              ],
              "line-color": [
                "case",
                ["==", ["get", "voltage"], "400kV"],
                "#B54EB2",
                ["==", ["get", "voltage"], "220kV"],
                "#C73030",
                ["==", ["get", "voltage"], "110kV"],
                "#B55D00",
                ["==", ["get", "voltage"], "22kV"],
                "#55B555",
                "#7A7A85",
              ],
              "line-opacity": 0.8,
            },
          });

          // Add line labels layer
          map.current.addLayer({
            id: "transmission-line-labels",
            type: "symbol",
            source: "transmission-lines",
            minzoom: 10, // Start showing labels at zoom 10
            layout: {
              "text-field": [
                "case",
                ["has", "name"],
                ["concat", ["get", "name"], " (", ["get", "voltage"], ")"],
                ["get", "voltage"],
              ],
              "text-font": ["Noto Sans Regular"],
              "symbol-placement": "line",
              "symbol-spacing": 400,
              "text-size": 12,
              "text-offset": [0, 1], // Offset above the line
              "text-max-angle": 15,
              "text-padding": 2,
            },
            paint: {
              "text-color": "#333",
              "text-halo-color": "#fff",
              "text-halo-width": 1,
            },
          });

          console.log(`Added ${allLines.length} transmission lines`);
        }

        // Add towers
        if (allTowers.length > 0) {
          const towerGeoJSON = {
            type: "FeatureCollection" as const,
            features: allTowers.map((tower, index) => ({
              type: "Feature" as const,
              id: `tower-${tower.id || index}`,
              geometry: {
                type: "Point" as const,
                coordinates: [tower.lng, tower.lat],
              },
              properties: {
                id: tower.id,
                height: tower.height || "",
                type: tower.type || "",
                category: "tower",
              },
            })),
          };

          map.current.addSource("towers", {
            type: "geojson",
            data: towerGeoJSON,
          });

          map.current.addLayer({
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
          });

          console.log(`Added ${allTowers.length} towers`);
        }
      }


// Add substations
if (gridData.substations && gridData.substations.length > 0) {
  // Create point GeoJSON for low zoom levels (circles)
  const substationPointsGeoJSON = {
    type: "FeatureCollection" as const,
    features: gridData.substations.map((substation, index) => {
      const center = calculateCentroid(substation.nodes);
      
      return {
        type: "Feature" as const,
        id: `substation-point-${index}`,
        geometry: {
          type: "Point" as const,
          coordinates: [center.lng, center.lat]
        },
        properties: {
          name: substation.name,
          type: substation.type,
          voltage: substation.voltage,
          operator: substation.operator,
          category: "substation",
        }
      };
    })
  };

  // Create polygon GeoJSON for high zoom levels (areas)
  const substationPolygonsGeoJSON = {
    type: "FeatureCollection" as const,
    features: gridData.substations.map((substation, index) => {
      return {
        type: "Feature" as const,
        id: `substation-polygon-${index}`,
        geometry: {
          type: "Polygon" as const,
          coordinates: [substation.nodes.map(n => [n.lng, n.lat])]
        },
        properties: {
          name: substation.name,
          type: substation.type,
          voltage: substation.voltage,
          operator: substation.operator,
          category: "substation",
        }
      };
    })
  };

  // Add point source and layer (for low zoom)
  map.current.addSource("substation-points", {
    type: "geojson",
    data: substationPointsGeoJSON,
  });

  map.current.addLayer({
    id: "substation-circles",
    type: "circle",
    source: "substation-points",
    maxzoom: 11.99,
    paint: {
      "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        8, 6, 12, 12
      ],
      "circle-color": "#B54EB2",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#1E40AF",
      "circle-opacity": 0.8
    }
  });

  // Add polygon source and layers (for high zoom)
  map.current.addSource("substation-polygons", {
    type: "geojson",
    data: substationPolygonsGeoJSON,
  });

  // Add polygon fill layer (high zoom)
  map.current.addLayer({
    id: "substation-areas",
    type: "fill",
    source: "substation-polygons",
    minzoom: 12,
    paint: {
      "fill-color": "#B54EB2",
      "fill-opacity": 0.3
    }
  });

  // Add polygon outline layer (high zoom)
  map.current.addLayer({
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
  });

  console.log(`Added ${gridData.substations.length} substations`);
}

      addClickHandlers();
    };

    // Store handler references for cleanup
    const handlersRef = useRef<{
      towerClick?: (e: maplibregl.MapLayerMouseEvent) => void;
      substationClick?: (e: maplibregl.MapLayerMouseEvent) => void;
      lineClick?: (e: maplibregl.MapLayerMouseEvent) => void;
    }>({});

    // Add click handlers for popups
    const addClickHandlers = () => {
      if (!map.current) return;

      // Remove existing handlers if they exist
      if (handlersRef.current.towerClick) {
        map.current.off(
          "click",
          "tower-symbols",
          handlersRef.current.towerClick
        );
      }
      if (handlersRef.current.substationClick) {
        map.current.off(
          "click",
          "substation-symbols",
          handlersRef.current.substationClick
        );
      }
      if (handlersRef.current.lineClick) {
        map.current.off(
          "click",
          "transmission-lines",
          handlersRef.current.lineClick
        );
      }

      // Tower click handler
      handlersRef.current.towerClick = (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features?.[0]) return;
        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const { id, height, type } = feature.properties!;

        new maplibregl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(
            `
            <div class="power-tooltip">
              <strong>Tower ${id}</strong><br/>
              ${height ? `Height: ${height}m<br/>` : ""}
              ${type ? `Type: ${type}` : ""}
            </div>
          `
          )
          .addTo(map.current!);
      };

      // Substation click handler
      handlersRef.current.substationClick = (
        e: maplibregl.MapLayerMouseEvent
      ) => {
        if (!e.features?.[0]) return;
        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const { name, type, voltage_levels, operator } = feature.properties!;

        new maplibregl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(
            `
            <div class="power-tooltip">
              <strong>${name}</strong><br/>
              Type: ${type}<br/>
              Voltages: ${voltage_levels}<br/>
              Operator: ${operator}
            </div>
          `
          )
          .addTo(map.current!);
      };

      // Line click handler
      handlersRef.current.lineClick = (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features?.[0]) return;
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const { name, voltage, operator, status, description } =
          feature.properties!;

        new maplibregl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setHTML(
            `
            <div class="power-tooltip">
              <strong>${name}</strong><br/>
              Voltage: ${voltage}<br/>
              Operator: ${operator}<br/>
              Status: ${status}
              ${description ? `<br/>${description}` : ""}
            </div>
          `
          )
          .addTo(map.current!);
      };

      handlersRef.current.substationClick = (e: maplibregl.MapLayerMouseEvent) => {
  if (!e.features?.[0]) return;
  const feature = e.features[0];
  const coordinates = e.lngLat; // Use click coordinates instead of geometry coordinates
  const { name, type, voltage, operator } = feature.properties!;

  new maplibregl.Popup({ closeOnClick: true })
    .setLngLat(coordinates)
    .setHTML(
      `
      <div class="power-tooltip">
        <strong>${name}</strong><br/>
        Type: ${type}<br/>
        Voltage: ${voltage}<br/>
        Operator: ${operator}
      </div>
    `
    )
    .addTo(map.current!);
};


      // Add event listeners
map.current.on("click", "tower-symbols", handlersRef.current.towerClick);
map.current.on("click", "substation-circles", handlersRef.current.substationClick);
map.current.on("click", "substation-areas", handlersRef.current.substationClick);
map.current.on("click", "transmission-lines", handlersRef.current.lineClick);

      // Cursor handlers
      const layers = [
         "tower-symbols",
  "substation-circles", 
  "substation-areas",
  "transmission-lines",
      ];
      layers.forEach((layer) => {
        map.current!.on("mouseenter", layer, () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });
        map.current!.on("mouseleave", layer, () => {
          map.current!.getCanvas().style.cursor = "";
        });
      });
    };

    // Effect to update grid data when it changes
    useEffect(() => {
      console.log("Grid data effect triggered:", {
        hasMap: !!map.current,
        hasGridData: !!gridData,
        mapReady,
        isStyleLoaded: map.current?.isStyleLoaded(),
      });

      if (map.current && gridData && mapReady) {
        // Always wait for styledata to ensure the style is completely ready
        console.log("Waiting for style to be ready...");

        const tryAddData = () => {
          console.log("Attempting to add grid data");
          addGridDataToMap();
        };

        if (map.current.isStyleLoaded()) {
          console.log("Style already loaded, adding data immediately");
          tryAddData();
        } else {
          console.log("Waiting for styledata event");
          map.current.once("styledata", () => {
            console.log("Styledata event fired, adding grid data");
            tryAddData();
          });
        }
      }
    }, [gridData, mapReady]);

    return (
      <div
        ref={mapContainer}
        className={`w-full ${className}`}
        style={{ height: "600px", borderRadius: "8px" }}
      />
    );
  }
);

MapLibreComponent.displayName = "MapLibreComponent";

export default MapLibreComponent;
