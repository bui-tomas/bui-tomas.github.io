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
import { createMapStyle } from "@/types/map"; // ← Add powerStyle
import {
  SlovakiaGridData,
  Tower,
  TransmissionLine,
} from "@/types/map/slovakia-grid";

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
        const newStyle =
          createMapStyle() as unknown as maplibregl.StyleSpecification;
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
        // 1. Update substation sources
        if (gridData.substations && gridData.substations.length > 0) {
          // Point source for circles
          const substationPointsGeoJSON = {
            type: "FeatureCollection" as const,
            features: gridData.substations
              .map((substation, index) => {
                // Only use nodes for positioning - no fallback to lat/lng
                if (!substation.nodes || substation.nodes.length === 0) {
                  console.warn(
                    `Substation ${substation.name} has no nodes - skipping`
                  );
                  return null; // Skip substations without nodes
                }

                const center = calculateCentroid(substation.nodes);

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
              })
              .filter(Boolean), // Remove null entries
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
          const allTowers: Array<
            Tower & { lineId: string; segmentId: number }
          > = [];

          gridData.transmission_lines.forEach((transmissionLine, lineIndex) => {
            if (transmissionLine.lines) {
              transmissionLine.lines.forEach((lineSegment, segmentIndex) => {
                lineSegment.forEach((tower) => {
                  allTowers.push({
                    ...tower,
                    lineId: `line-${lineIndex}`,
                    segmentId: segmentIndex,
                  });
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
                  segmentId: tower.segmentId,
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
          const allLineSegments: Array<{
            line: TransmissionLine;
            coordinates: number[][];
            segmentId: number;
          }> = [];

          gridData.transmission_lines.forEach((transmissionLine) => {
            if (transmissionLine.lines) {
              transmissionLine.lines.forEach((lineSegment, segmentIndex) => {
                if (lineSegment.length >= 2) {
                  const coordinates = lineSegment.map((tower) => [
                    tower.lng,
                    tower.lat,
                  ]);
                  allLineSegments.push({
                    line: transmissionLine,
                    coordinates,
                    segmentId: segmentIndex,
                  });
                }
              });
            }
          });

          const linesGeoJSON = {
            type: "FeatureCollection" as const,
            features: allLineSegments.map((segmentData) => ({
              type: "Feature" as const,
              geometry: {
                type: "LineString" as const,
                coordinates: segmentData.coordinates,
              },
              properties: {
                name: segmentData.line.name,
                voltage: segmentData.line.voltage,
                operator: segmentData.line.operator,
                status: segmentData.line.status,
                description: segmentData.line.description || "",
                segmentId: segmentData.segmentId,
                lineId: segmentData.line.id,
              },
            })),
          };

          const linesSource = map.current.getSource(
            "transmission-lines"
          ) as maplibregl.GeoJSONSource;
          if (linesSource) {
            linesSource.setData(linesGeoJSON);
            console.log(
              `Updated transmission lines: ${allLineSegments.length} segments`
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
        const baseStyle = createMapStyle();

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: baseStyle as unknown as maplibregl.StyleSpecification,
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
        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

        // Add navigation control with compass disabled (since rotation is disabled)
        map.current.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right"
        );

        // Add geolocation control
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "top-right"
        );

        // Add scale control
        map.current.addControl(new maplibregl.ScaleControl({}), "bottom-left");

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
