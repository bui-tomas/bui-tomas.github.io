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

// Import types and styles from the new modular structure
import { MapLibreProps, MapLibreRef } from "@/types/map/types";
import { baseStyle, labelStyle } from "@/types/map";
import { SlovakiaGridData, Tower, TransmissionLine } from "@/types/map/slovakia-grid";

// Create base map style without dynamic power sources
const createBaseMapStyle = () => ({
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
  layers: [
    ...baseStyle(),
    ...labelStyle(),
  ].sort((a, b) => {
    const aZOrder = a.zorder || 0;
    const bZOrder = b.zorder || 0;
    return aZOrder - bZOrder;
  }),
});

// Utility function for calculating centroids
const calculateCentroid = (nodes: Array<{lat: number; lng: number}>) => ({
  lat: nodes.reduce((sum, n) => sum + n.lat, 0) / nodes.length,
  lng: nodes.reduce((sum, n) => sum + n.lng, 0) / nodes.length,
});

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
        if (!map.current) return;

        console.log("Changing tile layer to:", layerType);
        // For now, we only have one style, but this structure allows for future expansion
        const newStyle = createBaseMapStyle();
        map.current.setStyle(newStyle);

        // Re-add data layers after style change
        map.current.once("styledata", () => {
          if (gridData) {
            setTimeout(() => {
              addGridDataToMap();
            }, 100);
          }
        });
      },
      isReady: () =>
        mapReady && !!map.current && (map.current?.isStyleLoaded() ?? false),
    }));

    // Function to add grid data to map
    const addGridDataToMap = () => {
      if (!map.current || !gridData) return;
      
      // Wait for style to finish loading
      if (!map.current.isStyleLoaded()) {
        console.log("Style not loaded yet, waiting...");
        map.current.once("styledata", () => {
          addGridDataToMap();
        });
        return;
      }

      try {
        // Remove existing sources and layers if they exist
        const existingLayers = ["substations", "towers", "transmission-lines", "transmission-line-labels"];
        const existingSources = ["substations", "towers", "transmission-lines"];

        existingLayers.forEach(layerId => {
          if (map.current?.getLayer(layerId)) {
            map.current.removeLayer(layerId);
          }
        });

        existingSources.forEach(sourceId => {
          if (map.current?.getSource(sourceId)) {
            map.current.removeSource(sourceId);
          }
        });

        // Add substations
        if (gridData.substations && gridData.substations.length > 0) {
          const substationsGeoJSON = {
            type: "FeatureCollection" as const,
            features: gridData.substations.map((substation) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [substation.lng, substation.lat],
              },
              properties: {
                name: substation.name,
                voltage: substation.voltage,
                operator: substation.operator,
                status: substation.status,
              },
            })),
          };

          map.current.addSource("substations", {
            type: "geojson",
            data: substationsGeoJSON,
          });

          map.current.addLayer({
            id: "substations",
            type: "circle",
            source: "substations",
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, 2,
                10, 4,
                15, 8
              ],
              "circle-color": [
                "case",
                ["==", ["get", "voltage"], "400kV"], "#8B5CF6",
                ["==", ["get", "voltage"], "220kV"], "#EF4444", 
                ["==", ["get", "voltage"], "110kV"], "#F97316",
                "#10B981"
              ],
              "circle-stroke-width": 1,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.8,
            },
          });
        }

        // Add towers
        if (gridData.transmission_lines) {
          const allTowers: Array<Tower & { lineId: string }> = [];
          
          gridData.transmission_lines.forEach((line, lineIndex) => {
            if (line.towers) {
              line.towers.forEach(tower => {
                allTowers.push({
                  ...tower,
                  lineId: `line-${lineIndex}`,
                });
              });
            }
          });

          if (allTowers.length > 0) {
            const towersGeoJSON = {
              type: "FeatureCollection" as const,
              features: allTowers.map((tower) => ({
                type: "Feature" as const,
                geometry: {
                  type: "Point" as const,
                  coordinates: [tower.lng, tower.lat],
                },
                properties: {
                  name: tower.name || `Tower ${tower.id}`,
                  type: tower.type,
                  height: tower.height,
                  lineId: tower.lineId,
                },
              })),
            };

            map.current.addSource("towers", {
              type: "geojson",
              data: towersGeoJSON,
            });

            map.current.addLayer({
              id: "towers",
              type: "circle",
              source: "towers",
              minzoom: 12,
              paint: {
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 1,
                  18, 3
                ],
                "circle-color": "#6B7280",
                "circle-stroke-width": 0.5,
                "circle-stroke-color": "#ffffff",
                "circle-opacity": 0.7,
              },
            });
          }
        }

        // Add transmission lines
        if (gridData.transmission_lines && gridData.transmission_lines.length > 0) {
          const linesWithCoordinates = gridData.transmission_lines
            .map((line) => {
              if (!line.towers || line.towers.length < 2) return null;

              const coordinates = line.towers.map((tower) => [tower.lng, tower.lat]);
              return { line, coordinates };
            })
            .filter((item): item is { line: TransmissionLine; coordinates: number[][] } => 
              item !== null
            );

          const linesGeoJSON = {
            type: "FeatureCollection" as const,
            features: linesWithCoordinates.map((lineData) => ({
              type: "Feature" as const,
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
                ["==", ["get", "voltage"], "400kV"], 1.4,
                ["==", ["get", "voltage"], "220kV"], 1,
                ["==", ["get", "voltage"], "110kV"], 1.5,
                0.6,
              ],
              "line-color": [
                "case",
                ["==", ["get", "voltage"], "400kV"], "#B54EB2",
                ["==", ["get", "voltage"], "220kV"], "#C73030",
                ["==", ["get", "voltage"], "110kV"], "#B55D00",
                ["==", ["get", "voltage"], "22kV"], "#55B555",
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
            minzoom: 10,
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
              "text-offset": [0, 1],
              "text-max-angle": 15,
              "text-padding": 2,
            },
            paint: {
              "text-color": "#374151",
              "text-halo-color": "rgba(255, 255, 255, 0.8)",
              "text-halo-width": 1,
            },
          });
        }

        console.log("Grid data added to map successfully");
      } catch (error) {
        console.error("Error adding grid data to map:", error);
        onError("Failed to add grid data to map");
      }
    };

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current) return;

      try {
        // Create the base style without dynamic power sources
        const baseStyle = createBaseMapStyle();

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: baseStyle as maplibregl.StyleSpecification,
          center: [19.5, 48.7], // Slovakia center
          zoom: 7,
          pitch: 0,
          bearing: 0,
          maxZoom: 18,
          minZoom: 2,
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-right");

        // Handle map load
        map.current.on("load", () => {
          console.log("Map loaded successfully");
          setMapReady(true);
          onMapReady();
          
          // Add grid data if available
          if (gridData) {
            addGridDataToMap();
          }
        });

        // Handle map errors
        map.current.on("error", (e) => {
          console.error("MapLibre error:", e);
          onError(`Map error: ${e.error?.message || "Unknown error"}`);
        });

        // Add click handlers for interactivity
        map.current.on("click", "substations", (e) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${properties?.name || "Substation"}</h3>
                  <p><strong>Voltage:</strong> ${properties?.voltage || "Unknown"}</p>
                  <p><strong>Operator:</strong> ${properties?.operator || "Unknown"}</p>
                  <p><strong>Status:</strong> ${properties?.status || "Unknown"}</p>
                </div>
              `)
              .addTo(map.current!);
          }
        });

        map.current.on("click", "transmission-lines", (e) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${properties?.name || "Transmission Line"}</h3>
                  <p><strong>Voltage:</strong> ${properties?.voltage || "Unknown"}</p>
                  <p><strong>Operator:</strong> ${properties?.operator || "Unknown"}</p>
                  <p><strong>Status:</strong> ${properties?.status || "Unknown"}</p>
                  ${properties?.description ? `<p><strong>Description:</strong> ${properties.description}</p>` : ""}
                </div>
              `)
              .addTo(map.current!);
          }
        });

        // Change cursor to pointer when hovering over interactive layers
        map.current.on("mouseenter", "substations", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "substations", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
        map.current.on("mouseenter", "transmission-lines", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "transmission-lines", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });

      } catch (error) {
        console.error("Error initializing map:", error);
        onError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`);
      }

      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }, [currentTileLayer, onMapReady, onError]);

    // Effect to add grid data when it becomes available
    useEffect(() => {
      if (mapReady && gridData && map.current && map.current.isStyleLoaded()) {
        addGridDataToMap();
      }
    }, [mapReady, gridData]);

    return (
      <div 
        ref={mapContainer} 
        className={`map-container ${className}`}
        style={{ width: "100%", height: "600px" }}
      />
    );
  }
);

MapLibreComponent.displayName = "MapLibreComponent";

export default MapLibreComponent;
export type { MapLibreProps, MapLibreRef };