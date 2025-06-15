"use client";

import { useEffect, useRef, useState } from "react";
import {
  getVoltageColor,
  getVoltageWeight,
  getVoltageOpacity,
  SlovakiaGridData,
} from "@/types/slovakia-grid";
import MapControls from "./map-controls";
import "leaflet/dist/leaflet.css";

// Slovakia bounds
const v4Bounds = {
  north: 56.0, // Expanded north (was 54.8)
  south: 44.0, // Expanded south (was 45.7)
  east: 30.0, // Expanded east (reasonable limit)
  west: 10.0, // Expanded west (was 12.1)
};

interface MapProps {
  className?: string;
}

const SlovakiaMap = ({ className = "" }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const gridLayerRef = useRef<L.LayerGroup | null>(null);
  const towerLayerRef = useRef<L.LayerGroup | null>(null); // Add this line
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [gridData, setGridData] = useState<SlovakiaGridData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Tile layer options
  const tileLayerOptions = {
    light: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "© OpenStreetMap contributors © CARTO",
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "© OpenStreetMap contributors © CARTO",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri",
    },
  };

  const changeTileLayer = async (layerType: string) => {
    if (!mapInstanceRef.current) return;

    // Dynamically import Leaflet
    const L = await import("leaflet");

    // Remove existing tile layer
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer
    const newLayerConfig =
      tileLayerOptions[layerType as keyof typeof tileLayerOptions];
    if (newLayerConfig) {
      tileLayerRef.current = L.tileLayer(newLayerConfig.url, {
        attribution: newLayerConfig.attribution,
        subdomains: "abcd",
        maxZoom: 20,
        minZoom: 7,
      });

      tileLayerRef.current.addTo(mapInstanceRef.current);
    }
  };

  // Load grid data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("Attempting to fetch grid data...");
        const response = await fetch("/data/slovakia-grid.json");
        if (!response.ok) {
          throw new Error(
            `Failed to load grid data: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        setGridData(data as SlovakiaGridData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load grid data"
        );
        console.error("Error loading grid data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const createElectricalGrid = async () => {
    if (!mapInstanceRef.current || !gridData) {
      return;
    }

    const L = await import("leaflet");

    // Clean up existing layers
    if (gridLayerRef.current) {
      mapInstanceRef.current.removeLayer(gridLayerRef.current);
    }
    if (towerLayerRef.current) {
      mapInstanceRef.current.removeLayer(towerLayerRef.current);
    }

    // Create separate layer groups
    gridLayerRef.current = L.layerGroup();
    towerLayerRef.current = L.layerGroup(); // Create tower layer group

    // Create custom tower icon
    const towerIcon = L.icon({
      iconUrl: "/images/tower.png",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
    });

    if (gridData.transmission_lines) {
      gridData.transmission_lines.forEach((line, index) => {
        if (!line.towers || line.towers.length < 2) {
          return;
        }

        const coordinates: [number, number][] = line.towers.map((tower) => [
          tower.lat,
          tower.lng,
        ]);

        // Create the transmission line (add to grid layer)
        const powerLine = L.polyline(coordinates, {
          color: getVoltageColor(line.voltage),
          weight: getVoltageWeight(line.voltage),
          opacity: getVoltageOpacity(line.voltage),
        });

        const tooltipContent = `
                <strong>${line.name}</strong><br/>
                ${line.voltage}<br/>
                Operator: ${line.operator}<br/>
                Status: ${line.status}
                ${line.description ? `<br/>${line.description}` : ""}
            `;

        powerLine.bindTooltip(tooltipContent, {
          permanent: false,
          direction: "center",
          className: "power-tooltip",
        });

        gridLayerRef.current!.addLayer(powerLine); // Add to grid layer

        // Add tower markers to TOWER layer (not grid layer)
        line.towers.forEach((tower) => {
          const towerMarker = L.marker([tower.lat, tower.lng], {
            icon: towerIcon,
          });

          const towerTooltipContent = `
                    <strong>Tower ${tower.id}</strong><br/>
                    Line: ${line.name}<br/>
                    ${tower.height ? `Height: ${tower.height}m<br/>` : ""}
                    ${tower.type ? `Type: ${tower.type}` : ""}
                `;

          towerMarker.bindTooltip(towerTooltipContent, {
            permanent: false,
            direction: "top",
            className: "power-tooltip",
          });

          towerLayerRef.current!.addLayer(towerMarker); // Add to TOWER layer
        });
      });
    }

    // Substations go to grid layer
    if (gridData.substations) {
      gridData.substations.forEach((substation, index) => {
        const marker = L.circleMarker([substation.lat, substation.lng], {
          radius: 8,
          fillColor: "#2563EB",
          color: "#1E40AF",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });

        const tooltipContent = `
                <strong>${substation.name}</strong><br/>
                Type: ${substation.type}<br/>
                Voltages: ${substation.voltage_levels.join(", ")}<br/>
                Operator: ${substation.operator}
            `;

        marker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: "top",
          className: "power-tooltip",
        });

        gridLayerRef.current!.addLayer(marker); // Add to grid layer
      });
    }

    console.log("Adding grid layer to map...");
    mapInstanceRef.current.addLayer(gridLayerRef.current);

    // Only add tower layer if zoom level is appropriate
    const currentZoom = mapInstanceRef.current.getZoom();
    if (currentZoom >= 12) {
      mapInstanceRef.current.addLayer(towerLayerRef.current);
    }

    console.log("Grid creation completed");
  };

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    const initMap = async () => {
      const L = await import("leaflet");

      mapInstanceRef.current = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.5,
      });

      // Initialize with light tile layer
      tileLayerRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          subdomains: "abcd",
          maxZoom: 20,
          minZoom: 7,
        }
      );

      tileLayerRef.current.addTo(mapInstanceRef.current);

      const bounds: L.LatLngBoundsExpression = [
        [v4Bounds.south, v4Bounds.west],
        [v4Bounds.north, v4Bounds.east],
      ];

      mapInstanceRef.current.setView([48.7, 20.6], 7.3); // Slovakia center with appropriate zoom

      mapInstanceRef.current.setMaxBounds([
        [v4Bounds.south, v4Bounds.west], // [44.0, 10.0]
        [v4Bounds.north, v4Bounds.east], // [56.0, 26.0]
      ]);

      const style = document.createElement("style");
      style.textContent = `
                .power-tooltip {
                    background: rgba(0, 0, 0, 0.9) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 4px !important;
                    font-size: 12px !important;
                    padding: 6px 10px !important;
                    font-family: monospace !important;
                }
                
                .power-tooltip::before {
                    border-top-color: rgba(0, 0, 0, 0.9) !important;
                }
            `;
      document.head.appendChild(style);

      console.log("Map initialization completed, setting mapReady to true");
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (gridData && mapReady && mapInstanceRef.current) {
      console.log("Both grid data and map are ready, creating grid...");
      createElectricalGrid();

      // Add zoom listener AFTER grid is created
      const handleZoom = () => {
        if (!mapInstanceRef.current || !towerLayerRef.current) return;

        // Add a small delay to let the zoom animation finish
        setTimeout(() => {
          if (!mapInstanceRef.current || !towerLayerRef.current) return;

          const currentZoom = mapInstanceRef.current.getZoom();

          if (
            currentZoom >= 14 &&
            !mapInstanceRef.current.hasLayer(towerLayerRef.current)
          ) {
            mapInstanceRef.current.addLayer(towerLayerRef.current);
            console.log("Towers shown at zoom:", currentZoom);
          } else if (
            currentZoom < 14 &&
            mapInstanceRef.current.hasLayer(towerLayerRef.current)
          ) {
            mapInstanceRef.current.removeLayer(towerLayerRef.current);
            console.log("Towers hidden at zoom:", currentZoom);
          }
        }, 100); // 100ms delay
      };

      mapInstanceRef.current.on("zoomend", handleZoom);

      // Clean up listener
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off("zoomend", handleZoom);
        }
      };
    }
  }, [gridData, mapReady]);

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
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading grid data...</p>
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full"
        style={{ height: "600px", borderRadius: "8px" }}
      />

      {/* Map Controls Component */}
      <MapControls onTileLayerChange={changeTileLayer} />
    </div>
  );
};

export default SlovakiaMap;
