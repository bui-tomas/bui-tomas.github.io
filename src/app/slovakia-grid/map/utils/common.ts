// types/map/common.ts - Shared constants, colors, and utility functions
import type { ExpressionSpecification } from 'maplibre-gl';

// Color interpolation helper function
export function landcover_colour(hue: number, sat: string, initial_lum = "85%"): ExpressionSpecification {
  return [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    `hsl(${hue}, ${sat}, ${initial_lum})`,
    6,
    `hsl(${hue}, ${sat}, 93%)`,
  ] as ExpressionSpecification;
}

// Base color definitions
export const colours = {
  land: landcover_colour(42, "10%"),
  ice: landcover_colour(180, "14%"),
  urban: landcover_colour(245, "6%", "82%"),
  water: [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    "hsl(207, 25%, 75%)",
    12,
    "hsl(207, 14%, 86%)",
  ] as ExpressionSpecification,
  green: landcover_colour(90, "20%", "86%"),
  wood: landcover_colour(100, "20%", "81%"),
  sand: landcover_colour(57, "20%"),
  road_casing: "hsl(0, 0%, 96%)",
  road_minor: "hsl(0, 0%, 89%)",
  road_minor_low: "hsl(0, 0%, 91%)",
  road_major: "hsl(0, 0%, 84%)",
  rail_2: "hsl(0, 0%, 92%)",
  rail: "hsl(0, 0%, 80%)",
  border: [
    "interpolate-lab",
    ["linear"],
    ["zoom"],
    2,
    "hsl(0, 30%, 60%)",
    12,
    "hsl(0, 10%, 80%)",
  ] as ExpressionSpecification,
};

// Label color definitions (following OpenInfraMap pattern)
export const label_colors = {
  country: "hsl(0, 0%, 20%)",
  region: "hsl(0, 0%, 30%)", 
  locality: "hsl(0, 0%, 40%)",
} as const;

// Text halo color
export const text_halo = "rgb(242,243,240)";

// Power infrastructure colors
export const power_colors = {
  400: "#B54EB2",
  220: "#C73030",
  110: "#B59F10", 
  22: "#55B555",
  default: "#7A7A85",
  substation: "#B54EB2",
  substation_stroke: "#1E40AF",
} as const;

// Font definition
export const font = ["Noto Sans Regular"];