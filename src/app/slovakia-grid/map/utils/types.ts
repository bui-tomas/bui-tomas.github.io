// src/components/map/utils/types.ts - Updated with toggle functions

import { LayerSpecification } from 'maplibre-gl';

export interface Tower {
  id: string;
  lat: number;
  lng: number;
  height?: number;
  type?: 'tower' | 'connection' | 'terminal';
}

export interface TransmissionLine {
  id: string;
  name: string;
  voltage: number;
  operator: string;
  status: 'active' | 'maintenance' | 'planned';
  country_from?: string;
  country_to?: string;
  circuits?: string;
  lines: Tower[][];
}

export interface Substation {
  id: string;
  name: string;
  voltage?: number[];
  relations: Array<Array<{lat: number; lng: number}>>;
  operator: string;
  type: 'distribution' | 'transmission' | 'interconnection';
}

export interface PowerPlant {
  id: string;
  name: string;
  relations: Array<Array<{lat: number; lng: number}>>;
  power?: number; // MW
  source: string; // 'solar', 'wind', 'nuclear', 'coal', etc.
  operator?: string;
  start_year?: number;
  avg_production: number; 
  generation_method?: string;
  status?: 'active' | 'construction' | 'planned';
}

export interface SlovakiaGridData {
  transmission_lines_400?: TransmissionLine[];
  transmission_lines_220?: TransmissionLine[];
  transmission_lines_110?: TransmissionLine[];
  substations: Substation[];
  power_plants: PowerPlant[];
}

// Data loader function
export async function loadSlovakiaGrid(): Promise<SlovakiaGridData> {
  const response = await fetch('data/slovakia-grid.json');
  if (!response.ok) {
    throw new Error(`Failed to load grid data: ${response.statusText}`);
  }
  const data = await response.json();
  return data as SlovakiaGridData;
}

// Extended layer specification with z-order for proper layering
export type LayerSpecificationWithZIndex = LayerSpecification & {
  zorder?: number;
}

// Style configuration interface
export interface StyleConfig {
  name: string;
  sources: { [key: string]: any };
  layers: LayerSpecificationWithZIndex[];
}

// Map control interfaces
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
  toggleLine: (voltage: number, visible: boolean) => void;
  toggleAllLines: (visible: boolean) => void;
  togglePowerPlantType: (plantType: string, visible: boolean) => void;
}