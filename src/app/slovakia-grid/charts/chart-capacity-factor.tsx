"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { TooltipProps, useChartAnimation } from "./utils";
import { Link } from "../components";

const PowerPlantData = [
  // Wind farms
  {
    name: "Andau/Halbturn",
    capacityFactor: 0.2663,
    capacity: 237,
    type: "wind",
  },
  {
    name: "Neusiedl/See",
    capacityFactor: 0.1384,
    capacity: 79.2,
    type: "wind",
  },
  {
    name: "Weiden am See",
    capacityFactor: 0.1707,
    capacity: 46.8,
    type: "wind",
  },
  {
    name: "Parndorf III",
    capacityFactor: 0.2344,
    capacity: 41.4,
    type: "wind",
  },
  { name: "Kittsee", capacityFactor: 0.1419, capacity: 35.4, type: "wind" },
  {
    name: "Tauernwindpark",
    capacityFactor: 0.2671,
    capacity: 32.05,
    type: "wind",
  },
  {
    name: "Poysdorf-Wilfersdorf",
    capacityFactor: 0.2202,
    capacity: 28,
    type: "wind",
  },
  { name: "Kreuzstetten", capacityFactor: 0.2283, capacity: 26, type: "wind" },
  { name: "Gols I", capacityFactor: 0.2378, capacity: 24, type: "wind" },
  { name: "Neudorf I", capacityFactor: 0.2491, capacity: 22, type: "wind" },
  { name: "Neudorf II", capacityFactor: 0.2491, capacity: 22, type: "wind" },
  { name: "Scharndorf", capacityFactor: 0.2387, capacity: 22, type: "wind" },
  { name: "Petronell", capacityFactor: 0.2526, capacity: 21.6, type: "wind" },
  {
    name: "Trautmannsdorf",
    capacityFactor: 0.2727,
    capacity: 18,
    type: "wind",
  },
  { name: "Berg", capacityFactor: 0.2664, capacity: 18, type: "wind" },
  {
    name: "Prinzendorf-Steinberg",
    capacityFactor: 0.2664,
    capacity: 18,
    type: "wind",
  },
  { name: "Munderfing", capacityFactor: 0.2452, capacity: 14.9, type: "wind" },
  {
    name: "Prellenkirchen III",
    capacityFactor: 0.214,
    capacity: 14.4,
    type: "wind",
  },
  {
    name: "Haindorf Inning",
    capacityFactor: 0.2029,
    capacity: 12.6,
    type: "wind",
  },
  { name: "Sternwald II", capacityFactor: 0.2854, capacity: 12, type: "wind" },

  // Hydro plants
  { name: "Gabcikovo", capacityFactor: 0.3488, capacity: 720, type: "hydro" },
  { name: "Cierny Vah", capacityFactor: 0.0311, capacity: 735, type: "hydro" },
  {
    name: "Liptovska Mara",
    capacityFactor: 0.0775,
    capacity: 198,
    type: "hydro",
  },
  {
    name: "Miksova/Bytca",
    capacityFactor: 0.2275,
    capacity: 93.6,
    type: "hydro",
  },
  { name: "Nosice", capacityFactor: 0.2662, capacity: 67.5, type: "hydro" },
  { name: "Ruzin", capacityFactor: 0.1031, capacity: 60, type: "hydro" },
  {
    name: "Povazska Bystrica",
    capacityFactor: 0.2384,
    capacity: 55.2,
    type: "hydro",
  },
  {
    name: "Kralova nad Vahom",
    capacityFactor: 0.2972,
    capacity: 45.06,
    type: "hydro",
  },
  { name: "Madunice", capacityFactor: 0.3906, capacity: 43.2, type: "hydro" },
  { name: "Sucany", capacityFactor: 0.2833, capacity: 38.4, type: "hydro" },
  { name: "Lipovec", capacityFactor: 0.2568, capacity: 38.4, type: "hydro" },
  {
    name: "Horny Hricov",
    capacityFactor: 0.2142,
    capacity: 31.5,
    type: "hydro",
  },
  {
    name: "Nove Mesto nad Vahom",
    capacityFactor: 0.5094,
    capacity: 25.5,
    type: "hydro",
  },
  {
    name: "Horna Streda",
    capacityFactor: 0.5466,
    capacity: 25.5,
    type: "hydro",
  },
  { name: "Kostolna", capacityFactor: 0.513, capacity: 25.5, type: "hydro" },
  { name: "Krpelany", capacityFactor: 0.274, capacity: 24.75, type: "hydro" },
  { name: "Cunovo", capacityFactor: 0.6911, capacity: 24.28, type: "hydro" },
  { name: "Dobsina", capacityFactor: 0.295, capacity: 24, type: "hydro" },
  { name: "Orava", capacityFactor: 0.1627, capacity: 21.75, type: "hydro" },
  { name: "Ladce", capacityFactor: 0.459, capacity: 18.9, type: "hydro" },
  {
    name: "Dubnica nad Vahom",
    capacityFactor: 0.5957,
    capacity: 16.5,
    type: "hydro",
  },
  { name: "Trencin", capacityFactor: 0.5913, capacity: 16.1, type: "hydro" },
  { name: "Ilava", capacityFactor: 0.6043, capacity: 15, type: "hydro" },
  { name: "Domasa", capacityFactor: 0.1058, capacity: 12.4, type: "hydro" },
  { name: "Zilina", capacityFactor: 0.2743, capacity: 72, type: "hydro" },
  { name: "Tvrdosin", capacityFactor: 0.3372, capacity: 6.1, type: "hydro" },
  {
    name: "Velke Kozmalovce",
    capacityFactor: 0.3433,
    capacity: 5.32,
    type: "hydro",
  },

  // nuclear
  {
    name: "Bohunice unit 3/4",
    capacityFactor: 0.8792,
    capacity: 1010,
    type: "nuclear",
  },
  {
    name: "Mochovce unit 1/2",
    capacityFactor: 0.8406,
    capacity: 1000,
    type: "nuclear",
  },
  {
    name: "Mochovce unit 3",
    capacityFactor: 0.34,
    capacity: 471,
    type: "nuclear",
  },

  // gas
  {
    name: "Malzenice",
    capacityFactor: 0.58,
    capacity: 430,
    type: "gas",
  },
  {
    name: "PPC Energy",
    capacityFactor: 0.40509999999999996,
    capacity: 58,
    type: "gas",
  },
  {
    name: "Gas- und Dampfkraftwerk Mellach",
    capacityFactor: 0.6833,
    capacity: 832,
    type: "gas",
  },
  {
    name: "Gas- und Dampfkraftwerk Timelkam",
    capacityFactor: 0.5637,
    capacity: 405,
    type: "gas",
  },
  {
    name: "Kraftwerk voestalpine Linz",
    capacityFactor: 0.7482,
    capacity: 267,
    type: "gas",
  },
  {
    name: "Fernheizkraftwerk Linz-Süd",
    capacityFactor: 0.42719999999999997,
    capacity: 171,
    type: "gas",
  },

  // solar

  {
    name: "Energiepark Witznitz",
    capacityFactor: 0.1054,
    capacity: 650.0,
    type: "solar",
  },
  {
    name: "FVE Ralsko",
    capacityFactor: 0.1565,
    capacity: 38.3,
    type: "solar",
  },
  {
    name: "Grafenwörth",
    capacityFactor: 0.1244,
    capacity: 24.5,
    type: "solar",
  },
  {
    name: "Schönkirchen",
    capacityFactor: 0.1202,
    capacity: 15.0,
    type: "solar",
  },

  // coal

  {
    name: "Počerady I",
    capacityFactor: 0.6849315068,
    capacity: 1000.0,
    type: "coal",
  },
  {
    name: "Chvaletice",
    capacityFactor: 0.441446709,
    capacity: 820.0,
    type: "coal",
  },
  {
    name: "Dětmarovice",
    capacityFactor: 0.3848458904,
    capacity: 800.0,
    type: "coal",
  },
  {
    name: "Tušimice II",
    capacityFactor: 0.2718321918,
    capacity: 800.0,
    type: "coal",
  },
  {
    name: "Prunéřov II",
    capacityFactor: 0.6917808219,
    capacity: 1050.0,
    type: "coal",
  },
  {
    name: "Kladno - Dubská",
    capacityFactor: 0.3833391378,
    capacity: 472.0,
    type: "coal",
  },
  {
    name: "Opatovice",
    capacityFactor: 0.6158295282,
    capacity: 375.0,
    type: "coal",
  },
  {
    name: "Mělník II",
    capacityFactor: 0.350249066,
    capacity: 440.0,
    type: "coal",
  },
];

const colors = {
  nuclear: "#b300b3",
  hydro: "#3b82f6",
  gas: "#f59e0b",
  coal: "#800000",
  oil: "#dc2626",
  wind: "#10b981",
  solar: "#e6e600",
  bioenergy: "#00cc88",
  other_renewables: "#e68a00",
};

const getColor = (type: string): string => {
  return colors[type as keyof typeof colors] || "#8884d8";
};

export const ScatterTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  unit,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-900">{data.name}</h4>
        <div className="flex-1 h-px bg-[#A27B5C]/20 my-2"></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs">Capacity Factor:</span>
            <span className="text-xs font-semibold">
              {parseFloat(data.capacityFactor).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs">Installed Capacity:</span>
            <span className="text-xs font-semibold">
              {data.capacity.toLocaleString()} MW
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function CapacityFactorScatter() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("capacity-factor-chart", 1500, 350);

  return (
    <div id="capacity-factor-chart" className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Installed capacity vs. Capacity factor
      </h2>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <ScatterChart
          margin={{
            top: 20,
            right: 40,
            bottom: 20,
            left: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="capacity"
            type="number"
            domain={[0, 250]}
            stroke="#666"
            fontSize={12}
            label={{
              value: "Installed Capacity (MW)",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis
            dataKey="capacityFactor"
            type="number"
            domain={[0, 1]}
            stroke="#666"
            fontSize={12}
            label={{
              value: "Capacity Factor",
              angle: -90,
              position: "outsideLeft",
              dx: -20,
            }}
          />
          <Tooltip animationDuration={0} content={<ScatterTooltip />} />
          {showAnimation && (
            <Scatter data={PowerPlantData} fill="#22c55e">
              {PowerPlantData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.type as string)}
                  fillOpacity={0.9}
                  r={showDots ? 6 : 0}
                />
              ))}
            </Scatter>
          )}
        </ScatterChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        Data source:{" "}
        Various sources | additional processing by Tomáš Bui <br /> Licensed under CC BY 4.0.
      </p>
    </div>
  );
}
