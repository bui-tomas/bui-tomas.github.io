// /src/data/slovakia-grid.ts

export interface Tower {
  id: string;
  lat: number;
  lng: number;
  height?: number;
  type?: 'suspension' | 'tension' | 'terminal';
}

export interface TransmissionLine {
  id: string;
  name: string;
  voltage: string;
  operator: string;
  status: 'active' | 'maintenance' | 'planned';
  country_from?: string;
  country_to?: string;
  description?: string;
  towers: Tower[];
}

export interface Substation {
  id: string;
  name: string;
  voltage?: string;
  lat: number;
  lng: number;
  nodes: Array<{lat: number; lng: number}>;  // ← Polygon coordinates
  voltage_levels: string[];
  operator: string;
  type: 'distribution' | 'transmission' | 'interconnection';
}

export interface SlovakiaGridData {
  transmission_lines: TransmissionLine[];
  substations: Substation[];
}

// Utility functions for styling
export const getVoltageColor = (voltage: string): string => {
  switch (voltage) {
    case '400kV':
      return '#DC2626'; // Red
    case '220kV':
      return '#EA580C'; // Orange
    case '110kV':
      return '#2563EB'; // Blue
    case '22kV':
      return '#059669'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

export const getVoltageWeight = (voltage: string): number => {
  switch (voltage) {
    case '400kV':
      return 1.5;
    case '220kV':
      return 3;
    case '110kV':
      return 2;
    case '22kV':
      return 1;
    default:
      return 1;
  }
};

export const getVoltageOpacity = (voltage: string): number => {
  switch (voltage) {
    case '400kV':
      return 0.8;
    case '220kV':
      return 0.8;
    case '110kV':
      return 0.7;
    case '22kV':
      return 0.6;
    default:
      return 0.5;
  }
};

// Data loader function
export async function loadSlovakiaGrid(): Promise<SlovakiaGridData> {
  const response = await fetch('data/slovakia-grid.json');
  if (!response.ok) {
    throw new Error(`Failed to load grid data: ${response.statusText}`);
  }
  const data = await response.json();
  return data as SlovakiaGridData;
}