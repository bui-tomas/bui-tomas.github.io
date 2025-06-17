// Updated maplibre.tsx - using powerStyle() instead of manual layers

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
import { baseStyle, labelStyle, powerStyle } from "@/types/map"; // ← Add powerStyle
import {
  SlovakiaGridData,
  Tower,
  TransmissionLine,
} from "@/types/map/slovakia-grid";

// Create base map style INCLUDING power layers
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
    // Empty sources for power data - will be populated later
    "transmission-lines": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    },
    "towers": {
      type: "geojson", 
      data: {
        type: "FeatureCollection",
        features: []
      }
    },
    "substation-points": {
      type: "geojson",
      data: {
        type: "FeatureCollection", 
        features: []
      }
    },
    "substation-polygons": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    },
    "power-plants": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    }
  },
  layers: [
    ...baseStyle(),    // Geographic features
    ...powerStyle(),   // Power infrastructure layers
    ...labelStyle(),   // Text labels on top
  ].sort((a, b) => {
    const aZOrder = a.zorder || 0;
    const bZOrder = b.zorder || 0;
    return aZOrder - bZOrder;
  }),
});

// Utility function for calculating centroids
const calculateCentroid = (nodes: Array<{ lat: number; lng: number }>) => ({
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
        const newStyle = createBaseMapStyle() as unknown as maplibregl.StyleSpecification;;
        map.current.setStyle(newStyle);

        // Re-add data sources after style change
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

    // Simplified function - just add data sources, layers are already defined in powerStyle()

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
        // DON'T remove sources - just update them!
        // The sources already exist from createBaseMapStyle()

        // 1. Update substation sources
        if (gridData.substations && gridData.substations.length > 0) {
          // Point source for circles
          const substationPointsGeoJSON = {
            type: "FeatureCollection" as const,
            features: gridData.substations.map((substation, index) => {
              const center =
                substation.nodes && substation.nodes.length > 0
                  ? calculateCentroid(substation.nodes)
                  : { lat: substation.lat, lng: substation.lng };

              return {
                type: "Feature" as const,
                id: `substation-point-${index}`,
                geometry: {
                  type: "Point" as const,
                  coordinates: [center.lng, center.lat],
                },
                properties: {
                  name: substation.name,
                  type: substation.type,
                  voltage: substation.voltage,
                  operator: substation.operator,
                  category: "substation",
                },
              };
            }),
          };

          // Polygon source for areas
          const substationPolygonsGeoJSON = {
            type: "FeatureCollection" as const,
            features: gridData.substations
              .filter(
                (substation) => substation.nodes && substation.nodes.length > 0
              )
              .map((substation, index) => {
                return {
                  type: "Feature" as const,
                  id: `substation-polygon-${index}`,
                  geometry: {
                    type: "Polygon" as const,
                    coordinates: [substation.nodes.map((n) => [n.lng, n.lat])],
                  },
                  properties: {
                    name: substation.name,
                    type: substation.type,
                    voltage: substation.voltage,
                    operator: substation.operator,
                    category: "substation",
                  },
                };
              }),
          };

          // Update existing sources instead of adding new ones
          const substationPointsSource = map.current.getSource(
            "substation-points"
          ) as maplibregl.GeoJSONSource;
          if (substationPointsSource) {
            substationPointsSource.setData(substationPointsGeoJSON);
            console.log(
              `Updated substation points: ${substationPointsGeoJSON.features.length} features`
            );
          }

          const substationPolygonsSource = map.current.getSource(
            "substation-polygons"
          ) as maplibregl.GeoJSONSource;
          if (substationPolygonsSource) {
            substationPolygonsSource.setData(substationPolygonsGeoJSON);
            console.log(
              `Updated substation polygons: ${substationPolygonsGeoJSON.features.length} features`
            );
          }
        }

        // 2. Update tower source
        if (gridData.transmission_lines) {
          const allTowers: Array<Tower & { lineId: string }> = [];

          gridData.transmission_lines.forEach((line, lineIndex) => {
            if (line.towers) {
              line.towers.forEach((tower) => {
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
                  name: `Tower ${tower.id}`,
                  type: tower.type,
                  height: tower.height,
                  lineId: tower.lineId,
                },
              })),
            };

            const towersSource = map.current.getSource(
              "towers"
            ) as maplibregl.GeoJSONSource;
            if (towersSource) {
              towersSource.setData(towersGeoJSON);
              console.log(`Updated towers: ${allTowers.length} features`);
            }
          }
        }

        // 3. Update transmission line source
        if (
          gridData.transmission_lines &&
          gridData.transmission_lines.length > 0
        ) {
          const linesWithCoordinates = gridData.transmission_lines
            .map((line) => {
              if (!line.towers || line.towers.length < 2) return null;

              const coordinates = line.towers.map((tower) => [
                tower.lng,
                tower.lat,
              ]);
              return { line, coordinates };
            })
            .filter(
              (
                item
              ): item is { line: TransmissionLine; coordinates: number[][] } =>
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

          const linesSource = map.current.getSource(
            "transmission-lines"
          ) as maplibregl.GeoJSONSource;
          if (linesSource) {
            linesSource.setData(linesGeoJSON);
            console.log(
              `Updated transmission lines: ${linesWithCoordinates.length} features`
            );
          }
        }

        console.log("Grid data sources updated successfully");
      } catch (error) {
        console.error("Error updating grid data sources:", error);
        onError("Failed to update grid data sources");
      }
    };

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current) return;

      try {
        // Create the base style including power layers
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

        // Load tower icon
        map.current
          .loadImage("/images/icons/tower.png")
          .then((image) => {
            if (map.current && !map.current.hasImage("tower-icon")) {
              map.current.addImage("tower-icon", image.data);
              console.log("Tower icon loaded successfully");
            }
          })
          .catch((error) => {
            console.error("Error loading tower image:", error);
          });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-right");

        // Handle map load
        map.current.on("load", () => {
          console.log("Map loaded successfully");
          setMapReady(true);
          onMapReady();

          // Add grid data sources if available
          if (gridData) {
            addGridDataToMap();
          }
        });

        // Handle map errors
        map.current.on("error", (e) => {
          console.error("MapLibre error:", e);
          onError(`Map error: ${e.error?.message || "Unknown error"}`);
        });

        // Add click handlers - these will work with the predefined layers
        map.current.on("click", "substation-circles", (e) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div class="p-2">
                  <h3 class="font-semibold">${
                    properties?.name || "Substation"
                  }</h3>
                  <p><strong>Voltage:</strong> ${
                    properties?.voltage || "Unknown"
                  }</p>
                  <p><strong>Operator:</strong> ${
                    properties?.operator || "Unknown"
                  }</p>
                  <p><strong>Type:</strong> ${properties?.type || "Unknown"}</p>
                </div>
              `
              )
              .addTo(map.current!);
          }
        });

        map.current.on("click", "substation-areas", (e) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div class="p-2">
                  <h3 class="font-semibold">${
                    properties?.name || "Substation"
                  }</h3>
                  <p><strong>Voltage:</strong> ${
                    properties?.voltage || "Unknown"
                  }</p>
                  <p><strong>Operator:</strong> ${
                    properties?.operator || "Unknown"
                  }</p>
                  <p><strong>Type:</strong> ${properties?.type || "Unknown"}</p>
                </div>
              `
              )
              .addTo(map.current!);
          }
        });

        map.current.on("click", "transmission-lines", (e) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div class="p-2">
                  <h3 class="font-semibold">${
                    properties?.name || "Transmission Line"
                  }</h3>
                  <p><strong>Voltage:</strong> ${
                    properties?.voltage || "Unknown"
                  }</p>
                  <p><strong>Operator:</strong> ${
                    properties?.operator || "Unknown"
                  }</p>
                  <p><strong>Status:</strong> ${
                    properties?.status || "Unknown"
                  }</p>
                  ${
                    properties?.description
                      ? `<p><strong>Description:</strong> ${properties.description}</p>`
                      : ""
                  }
                </div>
              `
              )
              .addTo(map.current!);
          }
        });

        // Add cursor hover effects
        const interactiveLayers = [
          "substation-circles",
          "substation-areas",
          "tower-symbols",
          "transmission-lines",
        ];

        interactiveLayers.forEach((layerId) => {
          map.current!.on("mouseenter", layerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = "pointer";
          });
          map.current!.on("mouseleave", layerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = "";
          });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        onError(
          `Failed to initialize map: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
