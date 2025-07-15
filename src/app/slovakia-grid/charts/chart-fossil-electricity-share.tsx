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

const fossilFuelData = [
  {
    year: 1990,
    Austria: 33.75,
    Czechia: 77.92,
    Hungary: 51.02,
    Poland: 98.89,
    Slovakia: 45.39,
  },
  {
    year: 1991,
    Austria: 34.91,
    Czechia: 78.08,
    Hungary: 53.47,
    Poland: 98.87,
    Slovakia: 46,
  },
  {
    year: 1992,
    Austria: 27.52,
    Czechia: 76.88,
    Hungary: 55.27,
    Poland: 98.76,
    Slovakia: 44.1,
  },
  {
    year: 1993,
    Austria: 25.84,
    Czechia: 75.87,
    Hungary: 57.43,
    Poland: 98.82,
    Slovakia: 37.8,
  },
  {
    year: 1994,
    Austria: 28.97,
    Czechia: 74.73,
    Hungary: 57.46,
    Poland: 98.66,
    Slovakia: 33.41,
  },
  {
    year: 1995,
    Austria: 29.32,
    Czechia: 75.83,
    Hungary: 58.11,
    Poland: 98.57,
    Slovakia: 38.25,
  },
  {
    year: 1996,
    Austria: 33.04,
    Czechia: 76.33,
    Hungary: 58.85,
    Poland: 98.54,
    Slovakia: 39.2,
  },
  {
    year: 1997,
    Austria: 31.97,
    Czechia: 77.14,
    Hungary: 59.77,
    Poland: 98.49,
    Slovakia: 39.58,
  },
  {
    year: 1998,
    Austria: 30.08,
    Czechia: 76.52,
    Hungary: 61.91,
    Poland: 98.2,
    Slovakia: 39.14,
  },
  {
    year: 1999,
    Austria: 29.09,
    Czechia: 75.5,
    Hungary: 62.09,
    Poland: 98.33,
    Slovakia: 37.42,
  },
  {
    year: 2000,
    Austria: 27.16,
    Czechia: 78.23,
    Hungary: 59.02,
    Poland: 98.37,
    Slovakia: 31.45,
  },
  {
    year: 2001,
    Austria: 30.73,
    Czechia: 76.66,
    Hungary: 60.49,
    Poland: 98.07,
    Slovakia: 30.3,
  },
  {
    year: 2002,
    Austria: 30.89,
    Czechia: 71.41,
    Hungary: 60.77,
    Poland: 98.06,
    Slovakia: 27.38,
  },
  {
    year: 2003,
    Austria: 39.21,
    Czechia: 66.49,
    Hungary: 66.77,
    Poland: 98.5,
    Slovakia: 30.79,
  },
  {
    year: 2004,
    Austria: 35.94,
    Czechia: 65.31,
    Hungary: 61.88,
    Poland: 97.9,
    Slovakia: 30.53,
  },
  {
    year: 2005,
    Austria: 36.49,
    Czechia: 66,
    Hungary: 56.08,
    Poland: 97.52,
    Slovakia: 28.49,
  },
  {
    year: 2006,
    Austria: 34.64,
    Czechia: 64.65,
    Hungary: 58.3,
    Poland: 97.33,
    Slovakia: 26.98,
  },
  {
    year: 2007,
    Austria: 31.29,
    Czechia: 66.29,
    Hungary: 58.56,
    Poland: 96.57,
    Slovakia: 27.25,
  },
  {
    year: 2008,
    Austria: 30.83,
    Czechia: 63.65,
    Hungary: 57.1,
    Poland: 95.72,
    Slovakia: 25.89,
  },
  {
    year: 2009,
    Austria: 28.74,
    Czechia: 60.96,
    Hungary: 48.98,
    Poland: 94.24,
    Slovakia: 26.73,
  },
  {
    year: 2010,
    Austria: 33.66,
    Czechia: 60.21,
    Hungary: 49.73,
    Poland: 93.06,
    Slovakia: 25.27,
  },
  {
    year: 2011,
    Austria: 34.23,
    Czechia: 59,
    Hungary: 48.92,
    Poland: 91.94,
    Slovakia: 27.83,
  },
  {
    year: 2012,
    Austria: 25.23,
    Czechia: 55.66,
    Hungary: 46.76,
    Poland: 89.55,
    Slovakia: 25.94,
  },
  {
    year: 2013,
    Austria: 21.77,
    Czechia: 53.38,
    Hungary: 40.04,
    Poland: 89.58,
    Slovakia: 22.53,
  },
  {
    year: 2014,
    Austria: 18.44,
    Czechia: 53.52,
    Hungary: 36,
    Poland: 87.46,
    Slovakia: 19.87,
  },
  {
    year: 2015,
    Austria: 22.97,
    Czechia: 56.06,
    Hungary: 37.19,
    Poland: 86.19,
    Slovakia: 20.36,
  },
  {
    year: 2016,
    Austria: 21.26,
    Czechia: 59.16,
    Hungary: 39.46,
    Poland: 86.26,
    Slovakia: 20.15,
  },
  {
    year: 2017,
    Austria: 23.91,
    Czechia: 55.73,
    Hungary: 40.52,
    Poland: 85.8,
    Slovakia: 21.15,
  },
  {
    year: 2018,
    Austria: 22.59,
    Czechia: 54.69,
    Hungary: 39.16,
    Poland: 87.24,
    Slovakia: 22.54,
  },
  {
    year: 2019,
    Austria: 22.7,
    Czechia: 52.97,
    Hungary: 38.77,
    Poland: 84.4,
    Slovakia: 22.26,
  },
  {
    year: 2020,
    Austria: 19.73,
    Czechia: 49.59,
    Hungary: 38.2,
    Poland: 82.04,
    Slovakia: 21.82,
  },
  {
    year: 2021,
    Austria: 20.85,
    Czechia: 50.55,
    Hungary: 36.57,
    Poland: 82.91,
    Slovakia: 24.24,
  },
  {
    year: 2022,
    Austria: 21.84,
    Czechia: 50.09,
    Hungary: 34.4,
    Poland: 78.9,
    Slovakia: 18.09,
  },
  {
    year: 2023,
    Austria: 15.29,
    Czechia: 45.18,
    Hungary: 28.83,
    Poland: 72.76,
    Slovakia: 15.2,
  },
  {
    year: 2024,
    Austria: 13.28,
    Czechia: 42.15,
    Hungary: 26.22,
    Poland: 70.15,
    Slovakia: 13.98,
  },
];

const countryColors = {
  Austria: "#e11d48",
  Czechia: "#7c3aed",
  Hungary: "#16a34a",
  Poland: "#dc2626",
  Slovakia: "#2563eb",
};

export function FossilFuelElectricityChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("fossil-fuel-chart", 1500, 400);

  return (
    <div
      id="fossil-fuel-chart"
      className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Fossil fuel share in electricity generation
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Share of electricity generation from fossil fuels including coal, oil,
        and gas, measured as a{" "}
        <span className="underline">
          percentage of total electricity generation
        </span>
        .
      </p>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <LineChart
          data={fossilFuelData}
          margin={{
            top: 20,
            right: 60,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="year" stroke="#666" fontSize={12} interval={2} />
          <YAxis
            stroke="#666"
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit="%" />}
          />

          {showAnimation && (
            <>
              {Object.entries(countryColors).map(([country, color]) => (
                <Line
                  key={country}
                  type="linear"
                  dataKey={country}
                  stroke={color}
                  strokeWidth={2}
                  dot={showDots ? { fill: color, strokeWidth: 2, r: 1 } : false}
                  activeDot={{ r: 2.5, stroke: color, strokeWidth: 2 }}
                  fillOpacity={0.8}
                  label={
                    showLabels
                      ? {
                          position: "right",
                          content: (props) => {
                            if (
                              props.index === fossilFuelData.length - 1 &&
                              props.x !== undefined &&
                              props.y !== undefined
                            ) {
                              const yOffset = country === "Slovakia" ? 15 : 0;
                              return (
                                <text
                                  x={Number(props.x) + 10}
                                  y={Number(props.y) + yOffset}
                                  fill={color}
                                  fontSize="12"
                                  textAnchor="start"
                                >
                                  {country}
                                </text>
                              );
                            }
                            return null;
                          },
                        }
                      : false
                  }
                />
              ))}
            </>
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
