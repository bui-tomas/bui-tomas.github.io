"use client";
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Text,
} from "recharts";
import { useChartAnimation } from "./utils";

const capacityData = [
  { type: "Nuclear", capacity: 2481 },
  { type: "Hydro", capacity: 2459 },
  { type: "Solar", capacity: 1100 },
  { type: "Gas", capacity: 951 },
  { type: "Wind", capacity: 10 },
  { type: "Coal", capacity: 0 },
];

const colors = {
  Nuclear: "#b300b3",
  Hydro: "#3b82f6",
  Gas: "#f59e0b",
  Coal: "#800000",
  Oil: "#dc2626",
  Wind: "#10b981",
  Solar: "#e6e600",
  Bioenergy: "#00cc88",
  Other_renewables: "#e68a00",
};

const getColor = (type: string) => {
  return colors[type as keyof typeof colors] || "#8884d8";
};

const YAxisLeftTick = ({
  y,
  payload: { value },
}: {
  y: number;
  payload: { value: string };
}) => {
  return (
    <Text x={0} y={y} textAnchor="start" verticalAnchor="middle" fontSize={14}>
      {value}
    </Text>
  );
};

const YAxisRightTick = ({
  x,
  y,
  payload: { value },
}: {
  x: number;
  y: number;
  payload: { value: number };
}) => {
  return (
    <Text x={x} y={y} textAnchor="start" verticalAnchor="middle" fontSize={14}>
      {`${value.toLocaleString()} MW`}
    </Text>
  );
};



export function InstalledCapacityChart() {
  const { showAnimation, showDots, showLabels, chartHeight } = useChartAnimation(
  "installed-capacity-chart", 1500, 350
);

  return (
    <div
      id="installed-capacity-chart"
      className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Installed Capacity by Source
      </h2>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        debounce={50}
        className="outline-none [&_*]:outline-none"
      >
        <BarChart
          data={capacityData}
          layout="vertical"
          margin={{
            left: 0,
            right: 70,
            top: 20,
            bottom: 20,
          }}
        >
          <XAxis type="number" domain={[0, 2800]} fontSize={12} />
          <YAxis
            yAxisId={0}
            dataKey="type"
            type="category"
            stroke="#666"
            tickLine={false}
            tick={YAxisLeftTick}
            width={60}
          />
          <YAxis
            orientation="right"
            yAxisId={1}
            dataKey="capacity"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={YAxisRightTick}
            mirror
          />
          {showAnimation && (
            <Bar
              dataKey="capacity"
              minPointSize={2}
              barSize={32}
              radius={[0, 4, 4, 0]}
            >
              {capacityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        Data source:{" "}
        Various sources | additional processing by Tomáš Bui <br /> Licensed under CC BY 4.0.
      </p>
    </div>
  );
}
