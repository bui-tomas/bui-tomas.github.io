// types/map/types.ts - Map-specific type definitions

import { LayerSpecification } from 'maplibre-gl';

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

// Map control interfaces (moved from maplibre.tsx)
export interface MapLibreProps {
  gridData: any | null; // You can import SlovakiaGridData from '../slovakia-grid'
  currentTileLayer: string;
  onMapReady: () => void;
  onError: (error: string) => void;
  className?: string;
}

export interface MapLibreRef {
  changeStyle: (layerType: string) => void;
  isReady: () => boolean;
}