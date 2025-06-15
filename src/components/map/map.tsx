"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapControls from "./map-controls";
import {
  Tower,
  TransmissionLine,
  Substation,
  SlovakiaGridData,
  getVoltageColor,
  getVoltageWeight,
  getVoltageOpacity,
} from "@/types/slovakia-grid";

interface SlovakiaMapProps {
  className?: string;
}

// Vector tile style configurations - much sharper than raster!
// Updated TILE_LAYERS configuration without forest and land areas
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

// Official OpenInfraMap colors
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

const landcover_opacity = ["interpolate", ["linear"], ["zoom"], 6, 1, 7, 0];

const TILE_LAYERS = {
  light: {
    style: {
      version: 8,
      // ✅ Add globe projection for 3D Earth effect
      projection: {
        type: "globe",
      },
      // ✅ Add sky/atmosphere effects
      sky: {
        "sky-color": "#87CEEB", // Light blue sky
        "horizon-color": "#ffffff", // White horizon
        "fog-color": "#f0f0f0", // Light fog
        "sky-horizon-blend": 0.5,
        "horizon-fog-blend": 0.5,
        "fog-ground-blend": 0.5,
        "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 2, 0.4, 4, 0],
      },
      // ✅ Add lighting effects
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
        // Background using OpenInfraMap's land color
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": colours.land,
          },
        },
        // Water areas with proper OpenInfraMap water color
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
        // Urban/residential areas with OpenInfraMap urban color
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
        // Green areas (parks) with OpenInfraMap green color
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
        // Forest/wood areas with OpenInfraMap wood color
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
        // Roads - major
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
        // Roads - minor
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
        // Boundaries
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
            "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
            "text-font": ["Noto Sans Regular"], // ✅ Your local font
            "text-size": 14,
          },
          paint: {
            "text-color": "#333",
            "text-halo-color": "rgba(255, 255, 255, 0.8)",
            "text-halo-width": 2,
          },
        },
        // Add these 5 layers to your light theme after label_places_country:

        // 1. Regions/States
        {
          id: "label_places_region",
          type: "symbol",
          source: "openinfra-base",
          "source-layer": "places",
          minzoom: 5,
          maxzoom: 8,
          filter: ["==", "kind", "region"],
          layout: {
            "text-font": ["Noto Sans Regular"],
            "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
            "text-size": ["interpolate", ["linear"], ["zoom"], 5, 10, 8, 16],
            "text-anchor": "center",
          },
          paint: {
            "text-color": "#555",
            "text-halo-color": "rgba(255, 255, 255, 0.8)",
            "text-halo-width": 2,
          },
        },

        // 2. Cities/Towns
        {
          id: "label_places_locality",
          type: "symbol",
          source: "openinfra-base",
          "source-layer": "places",
          minzoom: 6,
          maxzoom: 14,
          filter: ["==", "kind", "locality"],
          layout: {
            "text-font": ["Noto Sans Regular"],
            "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              6,
              8,
              10,
              12,
              14,
              16,
            ],
            "text-padding": 4,
          },
          paint: {
            "text-color": "#333",
            "text-halo-color": "rgba(255, 255, 255, 0.8)",
            "text-halo-width": 1.5,
          },
        },

        // 3. Neighborhoods
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

        // 4. Water features
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

        // 5. Major roads
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

const SlovakiaMap = ({ className = "" }: SlovakiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // State management
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridData, setGridData] = useState<SlovakiaGridData | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState("light");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // ✅ Initialize MapLibre map with high-DPI support and vector tiles
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: TILE_LAYERS.light.style, // ✅ Start with vector tiles
        center: [20.5, 48.7], // Slovakia center coordinates
        zoom: 6.7,
        pixelRatio: Math.min(window.devicePixelRatio, 2), // ✅ High-DPI support
        antialias: true,
        attributionControl: true,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), "top-left");

      // Handle map load
      map.current.on("load", () => {
        console.log("MapLibre map with vector tiles loaded successfully");
        setMapReady(true);
        setIsLoading(false);
      });

      // Handle map errors
      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setError("Failed to load map");
        setIsLoading(false);
      });

      // Add custom styles for tooltips
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
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map");
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setMapReady(false);
    };
  }, []);

  // Fetch grid data
  useEffect(() => {
    const fetchGridData = async () => {
      try {
        setIsLoading(true);

        // Use your existing API endpoint
        const response = await fetch("/data/slovakia-grid.json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Grid data fetched:", data);
        setGridData(data as SlovakiaGridData);
      } catch (err) {
        console.error("Error fetching grid data:", err);

        // Fallback to mock data for development
        const mockData: SlovakiaGridData = {
          transmission_lines: [
            {
              id: "line-1",
              name: "Bratislava - Košice 400kV",
              voltage: "400kV",
              operator: "SEPS",
              status: "active",
              towers: [
                {
                  id: "tower-1",
                  lat: 48.7164,
                  lng: 19.4992,
                  height: 45,
                  type: "suspension",
                },
                {
                  id: "tower-2",
                  lat: 48.8,
                  lng: 19.6,
                  height: 35,
                  type: "tension",
                },
                {
                  id: "tower-3",
                  lat: 48.9,
                  lng: 19.7,
                  height: 50,
                  type: "terminal",
                },
              ],
            },
          ],
          substations: [
            {
              id: "sub-1",
              lat: 48.7164,
              lng: 19.4992,
              name: "Substation A",
              type: "transmission",
              voltage_levels: ["220kV", "110kV"],
              operator: "SEPS",
            },
            {
              id: "sub-2",
              lat: 48.85,
              lng: 19.65,
              name: "Substation B",
              type: "distribution",
              voltage_levels: ["22kV"],
              operator: "ZSD",
            },
          ],
        };

        console.log("Using mock data due to API error");
        setGridData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGridData();
  }, []);

  // Add electrical grid data to map
  useEffect(() => {
    if (!map.current || !mapReady || !gridData) return;

    console.log("Adding electrical grid data to vector map...");

    // Add transmission lines and towers
    if (gridData.transmission_lines && gridData.transmission_lines.length > 0) {
      // Collect all towers from all transmission lines
      const allTowers: Tower[] = [];
      const allLines: {
        line: TransmissionLine;
        coordinates: [number, number][];
      }[] = [];

      gridData.transmission_lines.forEach((line) => {
        if (line.towers && line.towers.length >= 2) {
          // Add towers to collection
          allTowers.push(...line.towers);

          // Prepare line coordinates
          const coordinates: [number, number][] = line.towers.map((tower) => [
            tower.lng,
            tower.lat, // Note: MapLibre uses [lng, lat] format
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

        if (!map.current.getSource("transmission-lines")) {
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
                4,
                ["==", ["get", "voltage"], "220kV"],
                3,
                ["==", ["get", "voltage"], "110kV"],
                2,
                1,
              ],
              "line-color": [
                "case",
                ["==", ["get", "voltage"], "400kV"],
                "#DC2626", // Red
                ["==", ["get", "voltage"], "220kV"],
                "#EA580C", // Orange
                ["==", ["get", "voltage"], "110kV"],
                "#2563EB", // Blue
                "#6B7280", // Gray default
              ],
              "line-opacity": 0.8,
            },
          });

          console.log(
            `Added ${allLines.length} transmission lines to vector map`
          );
        }
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

        if (!map.current.getSource("towers")) {
          map.current.addSource("towers", {
            type: "geojson",
            data: towerGeoJSON,
          });

          map.current.addLayer({
            id: "tower-symbols",
            type: "circle",
            source: "towers",
            minzoom: 12, // Show towers only at zoom 12+
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                4, // Small at zoom 12
                15,
                6, // Medium at zoom 15
                18,
                10, // Large at zoom 18
              ],
              "circle-color": "#ff4444",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": [
                "step",
                ["zoom"],
                0, // Hidden below zoom 12
                12,
                0.9, // Visible from zoom 12+
              ],
              "circle-stroke-opacity": [
                "step",
                ["zoom"],
                0, // Hidden below zoom 12
                12,
                1, // Visible from zoom 12+
              ],
            },
          });

          console.log(`Added ${allTowers.length} towers to vector map`);
        }
      }
    }

    // Add substations
    if (gridData.substations && gridData.substations.length > 0) {
      const substationGeoJSON = {
        type: "FeatureCollection" as const,
        features: gridData.substations.map((substation, index) => ({
          type: "Feature" as const,
          id: `substation-${index}`,
          geometry: {
            type: "Point" as const,
            coordinates: [substation.lng, substation.lat],
          },
          properties: {
            name: substation.name,
            type: substation.type,
            voltage_levels: substation.voltage_levels.join(", "),
            operator: substation.operator,
            category: "substation",
          },
        })),
      };

      if (!map.current.getSource("substations")) {
        map.current.addSource("substations", {
          type: "geojson",
          data: substationGeoJSON,
        });

        map.current.addLayer({
          id: "substation-symbols",
          type: "circle",
          source: "substations",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              8,
              6, // Visible at lower zoom than towers
              12,
              8,
              15,
              12,
              18,
              16,
            ],
            "circle-color": "#2563EB",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#1E40AF",
            "circle-opacity": 0.8,
            "circle-stroke-opacity": 1,
          },
        });

        console.log(
          `Added ${gridData.substations.length} substations to vector map`
        );
      }
    }
  }, [mapReady, gridData]);

  // Add click handlers for popups
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Tower click handler
    const handleTowerClick = (e: maplibregl.MapLayerMouseEvent) => {
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
    const handleSubstationClick = (e: maplibregl.MapLayerMouseEvent) => {
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

    // Add event listeners
    map.current.on("click", "tower-symbols", handleTowerClick);
    map.current.on("click", "substation-symbols", handleSubstationClick);

    // Add transmission line click handler
    const handleLineClick = (e: maplibregl.MapLayerMouseEvent) => {
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

    map.current.on("click", "transmission-lines", handleLineClick);

    // Change cursor on hover
    map.current.on("mouseenter", "tower-symbols", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "tower-symbols", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    map.current.on("mouseenter", "substation-symbols", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "substation-symbols", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    map.current.on("mouseenter", "transmission-lines", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "transmission-lines", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.off("click", "tower-symbols", handleTowerClick);
        map.current.off("click", "substation-symbols", handleSubstationClick);
        map.current.off("click", "transmission-lines", handleLineClick);
      }
    };
  }, [mapReady]);

  // Handle tile layer changes
  const changeTileLayer = (layerType: string) => {
    if (!map.current || !TILE_LAYERS[layerType as keyof typeof TILE_LAYERS])
      return;

    console.log("Changing tile layer to:", layerType);
    setCurrentTileLayer(layerType);

    const newStyle = TILE_LAYERS[layerType as keyof typeof TILE_LAYERS].style;
    map.current.setStyle(newStyle);

    // Re-add data layers after style change
    map.current.once("styledata", () => {
      if (gridData) {
        // Re-add all data sources and layers
        // This is needed because setStyle removes all sources and layers
        setTimeout(() => {
          // Trigger re-adding of data by updating the gridData
          setGridData((prevData) => ({ ...prevData }));
        }, 100);
      }
    });
  };

  // Error state
  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div
          className="w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-700"
          style={{ height: "600px" }}
        >
          <div className="text-center">
            <h3 className="font-semibold mb-2">Error Loading Map</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading vector map...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapContainer}
        className="w-full"
        style={{ height: "600px", borderRadius: "8px" }}
      />

      {/* Map Controls */}
      <MapControls onTileLayerChange={changeTileLayer} />

      {/* Enhanced status indicator */}
      {mapReady && gridData && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded shadow text-sm z-10">
          <div className="text-xs text-gray-600">
            MapLibre GL JS • Vector Tiles •{" "}
            {gridData.transmission_lines?.reduce(
              (acc, line) => acc + (line.towers?.length || 0),
              0
            ) || 0}{" "}
            towers • {gridData.substations?.length || 0} substations •{" "}
            {gridData.transmission_lines?.length || 0} lines
          </div>
        </div>
      )}
    </div>
  );
};

export default SlovakiaMap;
