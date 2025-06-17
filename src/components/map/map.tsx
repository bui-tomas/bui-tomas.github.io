"use client";

import { useState, useEffect, useRef } from "react";
import MapControls from "./map-controls";
import MapLibreComponent, { MapLibreRef } from "./maplibre";
import { SlovakiaGridData } from "@/types/map/slovakia-grid";

interface SlovakiaMapProps {
  className?: string;
}

const SlovakiaMap = ({ className = "" }: SlovakiaMapProps) => {
  const mapRef = useRef<MapLibreRef>(null);

  // State management
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridData, setGridData] = useState<SlovakiaGridData | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState("light");

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
        setError("Failed to load grid data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGridData();
  }, []);

  // Handle map ready callback
  const handleMapReady = () => {
    console.log("Map is ready");
    setMapReady(true);
    setIsLoading(false);
  };

  // Handle map error callback
  const handleMapError = (errorMessage: string) => {
    console.error("Map error:", errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  // Handle tile layer changes
  const changeTileLayer = (layerType: string) => {
    console.log("Changing tile layer to:", layerType);
    setCurrentTileLayer(layerType);
    
    // Call the map component's changeStyle method
    if (mapRef.current) {
      mapRef.current.changeStyle(layerType);
    }
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

      {/* Map component */}
      <MapLibreComponent
        ref={mapRef}
        gridData={gridData}
        currentTileLayer={currentTileLayer}
        onMapReady={handleMapReady}
        onError={handleMapError}
        className="w-full"
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