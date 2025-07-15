"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { LineTooltip, useChartAnimation } from "./utils";
import { Link } from "../components";

const electricityData = [
  { year: 1985, Slovakia: 22.506 },
  { year: 1986, Slovakia: 24.168 },
  { year: 1987, Slovakia: 23.629 },
  { year: 1988, Slovakia: 23.039 },
  { year: 1989, Slovakia: 24.07 },
  { year: 1990, Slovakia: 25.49 },
  { year: 1991, Slovakia: 24.26 },
  { year: 1992, Slovakia: 23.24 },
  { year: 1993, Slovakia: 24.05 },
  { year: 1994, Slovakia: 25.47 },
  { year: 1995, Slovakia: 26.43 },
  { year: 1996, Slovakia: 25.46 },
  { year: 1997, Slovakia: 25.04 },
  { year: 1998, Slovakia: 25.73 },
  { year: 1999, Slovakia: 28.11 },
  { year: 2000, Slovakia: 30.78 },
  { year: 2001, Slovakia: 31.82 },
  { year: 2002, Slovakia: 32.18 },
  { year: 2003, Slovakia: 30.98 },
  { year: 2004, Slovakia: 30.46 },
  { year: 2005, Slovakia: 31.34 },
  { year: 2006, Slovakia: 31.25 },
  { year: 2007, Slovakia: 27.85 },
  { year: 2008, Slovakia: 28.7 },
  { year: 2009, Slovakia: 25.93 },
  { year: 2010, Slovakia: 27.46 },
  { year: 2011, Slovakia: 28.28 },
  { year: 2012, Slovakia: 28.3 },
  { year: 2013, Slovakia: 28.5 },
  { year: 2014, Slovakia: 27.13 },
  { year: 2015, Slovakia: 26.62 },
  { year: 2016, Slovakia: 26.8 },
  { year: 2017, Slovakia: 27.42 },
  { year: 2018, Slovakia: 26.66 },
  { year: 2019, Slovakia: 28.21 },
  { year: 2020, Slovakia: 28.51 },
  { year: 2021, Slovakia: 29.7 },
  { year: 2022, Slovakia: 26.54 },
  { year: 2023, Slovakia: 29.53 },
  { year: 2024, Slovakia: 29.33 },
];

export function ElectricityChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("electricity-generation-chart");

  return (
    <div
      id="electricity-generation-chart"
      className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Electricity generation
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Total electricity generated in Slovakia, measured in{" "}
        <span className="underline">terawatt-hours</span>.
      </p>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <LineChart
          data={electricityData}
          margin={{
            top: 20,
            right: 60,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" stroke="#666" fontSize={12} />
          <YAxis
            stroke="#666"
            fontSize={12}
            label={{
              value: "TWh",
              angle: -90,
              position: "outsideLeft",
              dx: -20,
            }}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit=" TWh" />}
          />
          {showAnimation && (
            <Line
              type="linear"
              dataKey="Slovakia"
              stroke="#2563eb"
              strokeWidth={2}
              dot={showDots ? { fill: "#2563eb", strokeWidth: 2, r: 1 } : false}
              activeDot={{ r: 2.5, stroke: "#2563eb", strokeWidth: 2 }}
              label={
                showLabels
                  ? {
                      position: "right",
                      content: (props) => {
                        if (
                          props.index === electricityData.length - 1 &&
                          props.x !== undefined &&
                          props.y !== undefined
                        ) {
                          return (
                            <text
                              x={Number(props.x) + 10}
                              y={Number(props.y)}
                              fill="#2563eb"
                              fontSize="12"
                              textAnchor="start"
                            >
                              Slovakia
                            </text>
                          );
                        }
                        return null;
                      },
                    }
                  : false
              }
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        Data source:{" "}
        <Link href="https://ember-energy.org/data/yearly-electricity-data/">
          Ember (2025)
        </Link>{" "}
        |{" "}
        <Link href="https://www.energyinst.org/statistical-review">
          Energy Institute – Statistical Review of World Energy (2024)
        </Link>{" "}
        |{" "}
        <Link href="https://ourworldindata.org/energy/country/slovakia">
          Our World in Data
        </Link> <br /> Licensed under CC BY 4.0.
      </p>
    </div>
  );
}
