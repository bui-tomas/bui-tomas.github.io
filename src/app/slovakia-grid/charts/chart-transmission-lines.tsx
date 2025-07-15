"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineTooltip, useChartAnimation } from "./utils";
import { Link } from "../components";

const LineData = [
  { year: 2007, "400kV": 1752, "220kV": 962, "110kV": 42 },
  { year: 2008, "400kV": 1752, "220kV": 962, "110kV": 42 },
  { year: 2009, "400kV": 1776, "220kV": 962, "110kV": 42 },
  { year: 2010, "400kV": 1776, "220kV": 902, "110kV": 42 },
  { year: 2011, "400kV": 1835, "220kV": 902, "110kV": 80 },
  { year: 2012, "400kV": 1870, "220kV": 867, "110kV": 80 },
  { year: 2013, "400kV": 1951, "220kV": 832, "110kV": 80 },
  { year: 2014, "400kV": 1953, "220kV": 826, "110kV": 80 },
  { year: 2015, "400kV": 1953, "220kV": 826, "110kV": 80 },
  { year: 2016, "400kV": 2138, "220kV": 826, "110kV": 80 },
  { year: 2017, "400kV": 2138, "220kV": 826, "110kV": 80 },
  { year: 2018, "400kV": 2138, "220kV": 790, "110kV": 80 },
  { year: 2019, "400kV": 2138, "220kV": 790, "110kV": 80 },
  { year: 2020, "400kV": 2138, "220kV": 772, "110kV": 80 },
  { year: 2021, "400kV": 2357, "220kV": 690, "110kV": 80 },
  { year: 2022, "400kV": 2357, "220kV": 688, "110kV": 80 },
  { year: 2023, "400kV": 2357, "220kV": 688, "110kV": 80 },
  { year: 2024, "400kV": 2357, "220kV": 688, "110kV": 80 },
];

export function TransmissionLineChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("transmission-lines-chart", 1500, 400);

  return (
    <div id="transmission-lines-chart" className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Transmission lines by voltage level
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Length of transmission lines by voltage level, measured in{" "}
        <span className="underline">kilometers</span>.
      </p>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <BarChart
          data={LineData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" stroke="#666" fontSize={12} interval={1} />
          <YAxis
            stroke="#666"
            fontSize={12}
            label={{
              value: "km",
              angle: -90,
              position: "outsideLeft",
              dx: -25,
            }}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit=" km" />}
          />
          {showAnimation && (
            <>
              <Bar
                dataKey="400kV"
                stackId="voltage"
                fill="#dc2626"
                fillOpacity={0.75}
              />
              <Bar
                dataKey="220kV"
                stackId="voltage"
                fill="#2563eb"
                fillOpacity={0.75}
              />
              <Bar
                dataKey="110kV"
                stackId="voltage"
                fill="#16a34a"
                fillOpacity={0.75}
              />{" "}
            </>
          )}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        Data source:{" "}
        <Link href="https://www.sepsas.sk/o-nas/vyrocne-spravy/">
          Various SEPS annual reports
        </Link> | additional processing by Tomáš Bui <br /> SEPS a. s.
        </p>
    </div>
  );
}
