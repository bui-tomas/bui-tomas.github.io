// src/components/map/utils/utils.ts
import maplibregl from "maplibre-gl";
import { SlovakiaGridData, Tower, TransmissionLine } from "./types"

// Utility function for calculating centroids
export const calculateCentroid = (nodes: Array<{ lat: number; lng: number }>) => ({
  lat: nodes.reduce((sum, n) => sum + n.lat, 0) / nodes.length,
  lng: nodes.reduce((sum, n) => sum + n.lng, 0) / nodes.length,
});

// Process substation data into GeoJSON format
export const processSubstations = (substations: any[]) => {
  const substationPointsGeoJSON = {
    type: "FeatureCollection" as const,
    features: substations
      .map((substation, index) => {
        // Skip substations without relations
        if (!substation.relations || substation.relations.length === 0) {
          console.warn(`Substation ${substation.name} has no relations - skipping`);
          return null;
        }

        // For point representation, use the first relation's centroid
        const firstRelation = substation.relations[0];
        const center = calculateCentroid(firstRelation);

        return {
          type: "Feature" as const,
          id: `substation-${index}`,
          geometry: {
            type: "Point" as const,
            coordinates: [center.lng, center.lat],
          },
          properties: {
            name: substation.name,
            voltage: substation.voltage?.[0] || 0,
            operator: substation.operator,
            type: substation.type,
            category: "substation",
          },
        };
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null),
  };

  // For polygon substations - create multiple polygons if multiple relations
  const substationPolygonsGeoJSON = {
    type: "FeatureCollection" as const,
    features: substations.flatMap((substation, substationIndex) =>
      substation.relations
        .filter((relation: any) => relation.length > 2) // Only relations with enough nodes for polygon
        .map((relation: any, relationIndex: number) => {
          const coordinates = relation.map((n: any) => [n.lng, n.lat]);
          coordinates.push(coordinates[0]); // Close polygon

          return {
            type: "Feature" as const,
            id: `substation-polygon-${substationIndex}-${relationIndex}`,
            geometry: {
              type: "Polygon" as const,
              coordinates: [coordinates],
            },
            properties: {
              name: substation.name,
              voltage: substation.voltage?.[0] || 0,
              operator: substation.operator,
              type: substation.type,
              category: "substation",
            },
          };
        })
    ),
  };

  return { substationPointsGeoJSON, substationPolygonsGeoJSON };
};

// Process transmission line data into GeoJSON format
export const processTransmissionLines = (transmissionLines: TransmissionLine[]) => {
  const allLineSegments: Array<{
    line: TransmissionLine;
    coordinates: number[][];
    segmentId: number;
  }> = [];

  transmissionLines.forEach((transmissionLine) => {
    if (transmissionLine.lines) {
      transmissionLine.lines.forEach((lineSegment, segmentIndex) => {
        if (lineSegment.length >= 2) {
          const coordinates = lineSegment.map((tower) => [tower.lng, tower.lat]);
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
        circuits: segmentData.line.circuits || 1,
        segmentId: segmentData.segmentId,
        lineId: segmentData.line.id,
      },
    })),
  };

  return { linesGeoJSON, allLineSegments };
};

// Process tower data into GeoJSON format
export const processTowers = (transmissionLines: TransmissionLine[], voltage?: number) => {
  const allTowers: Array<Tower & { lineId: string; segmentId: number; voltage?: number }> = [];

  transmissionLines.forEach((transmissionLine, lineIndex) => {
    if (transmissionLine.lines) {
      transmissionLine.lines.forEach((lineSegment, segmentIndex) => {
        lineSegment.forEach((tower) => {
          allTowers.push({
            ...tower,
            lineId: voltage ? `line-${voltage}-${lineIndex}` : `line-${lineIndex}`,
            segmentId: segmentIndex,
            ...(voltage && { voltage }), // Only add voltage if provided
          });
        });
      });
    }
  });

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
        ...(tower.voltage && { voltage: tower.voltage }),
      },
    })),
  };

  return { towersGeoJSON, allTowers };
};

// Process power plant data into GeoJSON format
export const processPowerPlants = (powerPlants: any[]) => {
  const powerPlantsGeoJSON = {
    type: "FeatureCollection" as const,
    features: powerPlants
      .map((plant, index) => {
        if (!plant.relations || plant.relations.length === 0) {
          console.warn(`Power plant ${plant.name} has no relations - skipping`);
          return null;
        }

        // Use first relation's centroid for point representation
        const firstRelation = plant.relations[0];
        const center = calculateCentroid(firstRelation);

        return {
          type: "Feature" as const,
          id: `power-plant-${index}`,
          geometry: {
            type: "Point" as const,
            coordinates: [center.lng, center.lat],
          },
          properties: {
            name: plant.name,
            source: plant.source,
            power: plant.power || 0,
            operator: plant.operator || "",
            generation_method: plant.generation_method || "",
            status: plant.status || "active",
            average_production: plant.avg_production || 0,
            start_year: plant.start_year || 0,
            category: "power_plant",
          },
        };
      })
      .filter((feature): feature is NonNullable<typeof feature> => feature !== null),
  };

  // Power plant polygons - handle multiple relations
  const powerPlantPolygonsGeoJSON = {
    type: "FeatureCollection" as const,
    features: powerPlants.flatMap((plant, plantIndex) =>
      plant.relations
        .filter((relation: any) => relation.length > 2)
        .map((relation: any, relationIndex: number) => {
          const coordinates = relation.map((n: any) => [n.lng, n.lat]);
          coordinates.push(coordinates[0]); // Close polygon

          return {
            type: "Feature" as const,
            id: `power-plant-polygon-${plantIndex}-${relationIndex}`,
            geometry: {
              type: "Polygon" as const,
              coordinates: [coordinates],
            },
            properties: {
              name: plant.name,
              source: plant.source,
              power: plant.power || 0,
              operator: plant.operator || "",
              generation_method: plant.generation_method || "",
              status: plant.status || "active",
              average_production: plant.avg_production || 0,
              start_year: plant.start_year || 0,
              category: "power_plant",
            },
          };
        })
    ),
  };

  return { powerPlantsGeoJSON, powerPlantPolygonsGeoJSON };
};

// Main function to process and update all grid data sources
export const updateGridDataSources = (
  map: maplibregl.Map,
  gridData: SlovakiaGridData,
  onError: (error: string) => void
) => {
  if (!map || !gridData) return;

  // Wait for style to finish loading
  if (!map.isStyleLoaded()) {
    console.log("Style not loaded yet, waiting...");
    map.once("styledata", () => {
      updateGridDataSources(map, gridData, onError);
    });
    return;
  }

  try {
    // 1. Update substation sources (use main substations array for now)
    if (gridData.substations && gridData.substations.length > 0) {
      const { substationPointsGeoJSON, substationPolygonsGeoJSON } = 
        processSubstations(gridData.substations);

      const substationPointsSource = map.getSource("substation-points") as maplibregl.GeoJSONSource;
      if (substationPointsSource) {
        substationPointsSource.setData(substationPointsGeoJSON);
        console.log(`Updated substation points: ${substationPointsGeoJSON.features.length} features`);
      }

      const substationPolygonsSource = map.getSource("substation-polygons") as maplibregl.GeoJSONSource;
      if (substationPolygonsSource) {
        substationPolygonsSource.setData(substationPolygonsGeoJSON);
      }
    }

    // 2. Update voltage-specific transmission lines
    updateVoltageSpecificTransmissionLines(map, gridData, onError);

    // 3. Update power plants source
    if (gridData.power_plants && gridData.power_plants.length > 0) {
      const { powerPlantsGeoJSON, powerPlantPolygonsGeoJSON } = 
        processPowerPlants(gridData.power_plants);

      const powerPlantsSource = map.getSource("power-plants") as maplibregl.GeoJSONSource;
      if (powerPlantsSource) {
        powerPlantsSource.setData(powerPlantsGeoJSON);
        console.log(`Updated power plants: ${powerPlantsGeoJSON.features.length} features`);
      }

      const powerPlantPolygonsSource = map.getSource("power-plant-polygons") as maplibregl.GeoJSONSource;
      if (powerPlantPolygonsSource) {
        powerPlantPolygonsSource.setData(powerPlantPolygonsGeoJSON);
      }
    }

    console.log("Grid data sources updated successfully");
  } catch (error) {
    console.error("Error updating grid data sources:", error);
    onError("Failed to update grid data sources");
  }
};

// Update voltage-specific transmission lines and towers with separate sources
export const updateVoltageSpecificTransmissionLines = (
  map: maplibregl.Map,
  gridData: SlovakiaGridData,
  onError: (error: string) => void
) => {
  const voltages = [400, 220, 110] as const;
  
  // Collect all towers from all voltage levels for the single tower source
  let allTowers: Array<Tower & { lineId: string; segmentId: number; voltage: number }> = [];
  
  voltages.forEach(voltage => {
    const voltageKey = `transmission_lines_${voltage}` as keyof SlovakiaGridData;
    const transmissionLines = gridData[voltageKey] as TransmissionLine[] | undefined;
    
    if (transmissionLines && transmissionLines.length > 0) {
      // Process transmission lines for this voltage
      const { linesGeoJSON } = processTransmissionLines(transmissionLines);
      const linesSourceId = `transmission-lines-${voltage}`;
      const linesSource = map.getSource(linesSourceId) as maplibregl.GeoJSONSource;
      
      if (linesSource) {
        linesSource.setData(linesGeoJSON);
        console.log(`Updated ${voltage}kV transmission lines: ${linesGeoJSON.features.length} segments`);
      } else {
        console.warn(`Source ${linesSourceId} not found in map`);
      }

      // Use the processTowers function instead of duplicate code
      const { allTowers: voltageTowers } = processTowers(transmissionLines, voltage);
      allTowers.push(...voltageTowers as Array<Tower & { lineId: string; segmentId: number; voltage: number }>);
    } else {
      // Clear the transmission line source if no data
      const linesSource = map.getSource(`transmission-lines-${voltage}`) as maplibregl.GeoJSONSource;
      if (linesSource) {
        linesSource.setData({ type: "FeatureCollection", features: [] });
      }
    }
  });

  // Update the single tower source with all towers from all voltage levels
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
          voltage: tower.voltage,
        },
      })),
    };

    const towersSource = map.getSource("towers") as maplibregl.GeoJSONSource;
    if (towersSource) {
      towersSource.setData(towersGeoJSON);
      console.log(`Updated towers: ${allTowers.length} features from all voltage levels`);
    }
  } else {
    // Clear towers if no data
    const towersSource = map.getSource("towers") as maplibregl.GeoJSONSource;
    if (towersSource) {
      towersSource.setData({ type: "FeatureCollection", features: [] });
    }
  }
};

// Toggle specific voltage level (lines + towers)
export const toggleLine = (
  map: maplibregl.Map,
  voltage: number,
  visible: boolean
) => {
  // Toggle transmission lines
  const lineLayerId = `transmission-lines-${voltage}`;
  if (map.getLayer(lineLayerId)) {
    map.setLayoutProperty(lineLayerId, 'visibility', visible ? 'visible' : 'none');
  }

  // Toggle transmission line labels
  const labelLayerId = `transmission-line-labels-${voltage}`;
  if (map.getLayer(labelLayerId)) {
    map.setLayoutProperty(labelLayerId, 'visibility', visible ? 'visible' : 'none');
  }

  // Update tower filter
  updateTowerFilter(map);
  
  console.log(`${voltage}kV system ${visible ? 'shown' : 'hidden'}`);
};

// Toggle all transmission infrastructure
export const toggleAllLines = (
  map: maplibregl.Map,
  visible: boolean
) => {
  const voltages = [400, 220, 110];
  
  voltages.forEach(voltage => {
    const lineLayerId = `transmission-lines-${voltage}`;
    const labelLayerId = `transmission-line-labels-${voltage}`;
    
    if (map.getLayer(lineLayerId)) {
      map.setLayoutProperty(lineLayerId, 'visibility', visible ? 'visible' : 'none');
    }
    if (map.getLayer(labelLayerId)) {
      map.setLayoutProperty(labelLayerId, 'visibility', visible ? 'visible' : 'none');
    }
  });

  // Toggle towers
  const towerLayerId = 'tower-symbols';
  if (map.getLayer(towerLayerId)) {
    map.setLayoutProperty(towerLayerId, 'visibility', visible ? 'visible' : 'none');
    if (visible) {
      map.setFilter(towerLayerId, null); // Clear filter when showing all
    }
  }
  
  console.log(`All transmission infrastructure ${visible ? 'shown' : 'hidden'}`);
};

// Helper to update tower filter based on visible line layers
const updateTowerFilter = (map: maplibregl.Map) => {
  const voltages = [400, 220, 110];
  const visibleVoltages: number[] = [];
  
  // Check which voltage layers are visible
  voltages.forEach(voltage => {
    const layerId = `transmission-lines-${voltage}`;
    if (map.getLayer(layerId)) {
      const visibility = map.getLayoutProperty(layerId, 'visibility');
      if (visibility !== 'none') {
        visibleVoltages.push(voltage);
      }
    }
  });

  const towerLayerId = 'tower-symbols';
  if (map.getLayer(towerLayerId)) {
    if (visibleVoltages.length === 0) {
      map.setLayoutProperty(towerLayerId, 'visibility', 'none');
    } else if (visibleVoltages.length === 3) {
      map.setLayoutProperty(towerLayerId, 'visibility', 'visible');
      map.setFilter(towerLayerId, null);
    } else {
      map.setLayoutProperty(towerLayerId, 'visibility', 'visible');
      map.setFilter(towerLayerId, ['in', ['get', 'voltage'], ['literal', visibleVoltages]]);
    }
  }
};

const OPERATOR_LOGO_MAP: { [key: string]: string } = {
  "ZSE": "logo-zse.png",
  "ZSD": "logo-zse.png",
  "SEPS": "logo-seps.png", 
  "ČEPS": "logo-ceps.png",
  "MAVIR": "logo-mavir.png",
  "Slovenské elektrárne": "logo-seas.png",
  "VSE": "logo-vse.png",
  "Veolia": "logo-veolia.png",
  "SLOVNAFT": "logo-slovnaft.png",
  "Vodohospodárska výstavba": "logo-vodohospodarska.png"
};

// Path to logo directory
const LOGO_BASE_PATH = "/images/";

export function getOperatorLogos(operator?: string): { 
  logo1?: string; 
  logo2?: string; 
} {
  if (!operator) return {};
  
  // Split by "/" separator
  const operators = operator.split("/").map(op => op.trim());
  
  const logo1 = operators[0] ? OPERATOR_LOGO_MAP[operators[0]] : undefined;
  const logo2 = operators[1] ? OPERATOR_LOGO_MAP[operators[1]] : undefined;

  console.log('operator: ', operators, logo1, logo2)
  
  return {
    logo1: logo1 ? `${LOGO_BASE_PATH}${logo1}` : undefined,
    logo2: logo2 ? `${LOGO_BASE_PATH}${logo2}` : undefined
  };
}