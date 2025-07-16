// src/components/map/maplibre.tsx
"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { renderToString } from "react-dom/server";
import {
  SubstationPopup,
  TransmissionLinePopup,
  PowerPlantPopup,
} from "./popups";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import types and styles from the new modular structure
import { MapLibreProps, MapLibreRef } from "./utils";
import { createMapStyle } from "./utils";
import { getOperatorLogos } from "./utils";
import {
  updateGridDataSources,
  toggleLine,
  toggleAllLines,
  togglePowerPlantType,
} from "./utils";

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
              updateGridDataSources(map.current!, gridData, onError);
            }, 100);
          }
        });
      },
      isReady: () =>
        mapReady && !!map.current && (map.current?.isStyleLoaded() ?? false),

      // Expose toggle functions
      toggleLine: (voltage: number, visible: boolean) => {
        if (map.current) {
          toggleLine(map.current, voltage, visible);
        }
      },
      toggleAllLines: (visible: boolean) => {
        if (map.current) {
          toggleAllLines(map.current, visible);
        }
      },
      togglePowerPlantType: (plantType: string, visible: boolean) => {
        if (!map.current) return;
        togglePowerPlantType(map.current, plantType, visible);
      },
    }));

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current) return;

      try {
        // Initialize the map
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: createMapStyle() as maplibregl.StyleSpecification,
          center: [20.5, 48.7], // Slovakia center
          zoom: 7,
          maxZoom: 18,
          minZoom: 6,
        });

        // Add tower icons
        map.current
          .loadImage("/icons/tower.png")
          .then((image) => {
            if (map.current && !map.current.hasImage("tower-icon")) {
              map.current.addImage("tower-icon", image.data);
              console.log("Tower icon loaded successfully");
            }
          })
          .catch((error) => {
            console.error("Error loading tower image:", error);
          });

        // Load all power plant icons
        const loadPowerPlantIcons = async () => {
          const powerPlantIcons = [
            "power_plant_oilgas",
            "power_plant_nuclear",
            "power_plant_hydro",
          ];

          const iconPromises = powerPlantIcons.map(async (iconName) => {
            const image = await map.current!.loadImage(
              `/icons/${iconName}.png`
            );
            if (!map.current!.hasImage(iconName)) {
              map.current!.addImage(iconName, image.data);
            }
          });

          await Promise.allSettled(iconPromises);
          console.log("Loaded map icons");
        };

        // Call this after your tower icon loading
        loadPowerPlantIcons();

        // Add navigation controls
        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

        // Add navigation control with compass disabled (since rotation is disabled)
        map.current.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-left"
        );

        // Add geolocation control
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "top-left"
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
            updateGridDataSources(map.current!, gridData, onError);
          }
        });

        // Handle map errors
        map.current.on("error", (e) => {
          console.error("MapLibre error:", e);
          onError(`Map error: ${e.error?.message || "Unknown error"}`);
        });

        // Click handlers for substations
        map.current.on("click", (e) => {
          // Query all clickable features at the click point
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: [
              "substation-circles",
              "substation-areas",
              "power-plant-nuclear-icons",
              "power-plant-gas-icons",
              "power-plant-hydro-icons",
              "power-plant-wind-icons",
              "power-plant-areas",
              "transmission-lines-400",
              "transmission-lines-220",
              "transmission-lines-110",
            ],
          });

          if (features.length === 0) return;

          // Priority 1: Check for substations first
          const substationFeature = features.find((f) =>
            ["substation-circles", "substation-areas"].includes(f.layer.id)
          );

          if (substationFeature) {
            const properties = substationFeature.properties;
            const { logo1, logo2 } = getOperatorLogos(properties?.operator);

            const popupHTML = renderToString(
              <SubstationPopup
                name={properties?.name}
                voltage={properties?.voltage}
                operator={properties?.operator}
                type={properties?.type}
                operatorLogo={logo1}
                operatorLogo2={logo2}
              />
            );

            new maplibregl.Popup({
              maxWidth: "400px",
            })
              .setLngLat(e.lngLat)
              .setHTML(popupHTML)
              .addTo(map.current!);
            return; // Exit early, don't check other features
          }

          // Priority 2: Check for power plants
          const powerPlantFeature = features.find((f) =>
            [
              "power-plant-nuclear-icons",
              "power-plant-gas-icons",
              "power-plant-hydro-icons",
              "power-plant-wind-icons",
              "power-plant-areas",
            ].includes(f.layer.id)
          );

          if (powerPlantFeature) {
            const properties = powerPlantFeature.properties;
            const { logo1, logo2 } = getOperatorLogos(properties?.operator);

            const popupHTML = renderToString(
              <PowerPlantPopup
                name={properties?.name}
                operator={properties?.operator}
                source={properties.source}
                generation_method={properties?.generation_method}
                power={properties?.power}
                average_production={properties?.average_production}
                start_year={properties.start_year}
                operatorLogo={logo1}
                operatorLogo2={logo2}
              />
            );

            new maplibregl.Popup({
              maxWidth: "600px",
            })
              .setLngLat(e.lngLat)
              .setHTML(popupHTML)
              .addTo(map.current!);
            return; // Exit early, don't check transmission lines
          }

          // Priority 3: Check for transmission lines (only if no substation or power plant)
          const transmissionLineFeature = features.find((f) =>
            [
              "transmission-lines-400",
              "transmission-lines-220",
              "transmission-lines-110",
              "transmission-lines",
            ].includes(f.layer.id)
          );

          if (transmissionLineFeature) {
            const properties = transmissionLineFeature.properties;

            const popupHTML = renderToString(
              <TransmissionLinePopup
                name={properties?.name}
                voltage={properties?.voltage}
                operator={properties?.operator}
                status={properties?.status}
                description={properties?.description}
              />
            );

            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(popupHTML)
              .addTo(map.current!);
          }
        });

        // Add cursor hover effects
        const interactiveLayers = [
          "substation-circles",
          "substation-areas",
          "tower-symbols",
          "transmission-lines-400",
          "transmission-lines-220",
          "transmission-lines-110",
          "transmission-lines", // legacy layer
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
        updateGridDataSources(map.current, gridData, onError);
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
