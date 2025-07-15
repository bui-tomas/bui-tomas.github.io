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
  ReferenceLine,
} from "recharts";
import { LineTooltip, useChartAnimation } from "./utils";
import { Link } from "../components";

const capitalFormationData = [
  {
    year: 1995,
    GFCF: 1067.3,
    NFCF: -1676.2,
  },
  {
    year: 1996,
    GFCF: 1287.5,
    NFCF: -1280.2,
  },
  {
    year: 1997,
    GFCF: 1462.8,
    NFCF: -1113.7,
  },
  {
    year: 1998,
    GFCF: 1626.7,
    NFCF: -939.2,
  },
  {
    year: 1999,
    GFCF: 1265.9,
    NFCF: -1338.2,
  },
  {
    year: 2000,
    GFCF: 1149.9,
    NFCF: -1178.6,
  },
  {
    year: 2001,
    GFCF: 1041.2,
    NFCF: -1078.2,
  },
  {
    year: 2002,
    GFCF: 756.2,
    NFCF: -1269.9,
  },
  {
    year: 2003,
    GFCF: 730.2,
    NFCF: -1111.5,
  },
  {
    year: 2004,
    GFCF: 627.3,
    NFCF: -1256.2,
  },
  {
    year: 2005,
    GFCF: 768.3,
    NFCF: -1000.3,
  },
  {
    year: 2006,
    GFCF: 1695.3,
    NFCF: 198.5,
  },
  {
    year: 2007,
    GFCF: 3341.4,
    NFCF: 1800.6,
  },
  {
    year: 2008,
    GFCF: 1328.7,
    NFCF: -176.4,
  },
  {
    year: 2009,
    GFCF: 1471.4,
    NFCF: -161.2,
  },
  {
    year: 2010,
    GFCF: 1625.7,
    NFCF: -130.0,
  },
  {
    year: 2011,
    GFCF: 2077.4,
    NFCF: 316.9,
  },
  {
    year: 2012,
    GFCF: 1871.4,
    NFCF: 189.0,
  },
  {
    year: 2013,
    GFCF: 1132.2,
    NFCF: -566.0,
  },
  {
    year: 2014,
    GFCF: 1511.8,
    NFCF: -368.6,
  },
  {
    year: 2015,
    GFCF: 1420.0,
    NFCF: -607.3,
  },
  {
    year: 2016,
    GFCF: 1186.3,
    NFCF: -989.5,
  },
  {
    year: 2017,
    GFCF: 1029.8,
    NFCF: -1141.4,
  },
  {
    year: 2018,
    GFCF: 887.8,
    NFCF: -1153.0,
  },
  {
    year: 2019,
    GFCF: 1186.4,
    NFCF: -740.3,
  },
  {
    year: 2020,
    GFCF: 998.0,
    NFCF: -848.9,
  },
  {
    year: 2021,
    GFCF: 1013.2,
    NFCF: -580.8,
  },
  {
    year: 2022,
    GFCF: 957.8,
    NFCF: 77.3,
  },
  {
    year: 2023,
    GFCF: 1108.4,
    NFCF: 450.6,
  },
  //   { year: 2024, 'GFCF': 1272.1, 'NFCF': 1272.1 }
];

export function CapitalFormationChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("capital-formation-chart");

  return (
    <div
      id="capital-formation-chart"
      className="w-full  max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Fixed Capital Formation
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Gross Fixed Capital Formation (GFCF) and Net Fixed Capital Formation
        (NFCF) for electricity, gas, steam and air conditioning supply sector,
        measured in{" "}
        <span className="underline">
          million euros (2020 chain linked volumes)
        </span>
        .
      </p>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <LineChart
          data={capitalFormationData}
          margin={{
            top: 20,
            right: 50,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          {/* Zero reference line */}
          <ReferenceLine
            y={0}
            stroke="#666"
            strokeWidth={1}
            strokeDasharray="5 5"
          />

          <XAxis dataKey="year" stroke="#666" fontSize={12} />
          <YAxis
            stroke="#666"
            fontSize={12}
            label={{
              value: "Million EUR",
              angle: -90,
              position: "outsideLeft",
              dx: -25,
            }}
            domain={[-2000, 4000]}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit="M EUR" />}
          />

          {showAnimation && (
            <>
              <Line
                type="linear"
                dataKey="GFCF"
                stroke="#2563eb"
                strokeWidth={2}
                dot={
                  showDots ? { fill: "#2563eb", strokeWidth: 2, r: 1 } : false
                }
                activeDot={{ r: 2.5, stroke: "#2563eb", strokeWidth: 2 }}
                fillOpacity={0.8}
                label={
                  showLabels
                    ? {
                        position: "right",
                        content: (props) => {
                          if (
                            props.index === capitalFormationData.length - 1 &&
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
                                GFCF
                              </text>
                            );
                          }
                          return null;
                        },
                      }
                    : false
                }
              />
              <Line
                type="linear"
                dataKey="NFCF"
                stroke="#dc2626"
                strokeWidth={2}
                dot={
                  showDots ? { fill: "#dc2626", strokeWidth: 2, r: 1 } : false
                }
                activeDot={{ r: 2.5, stroke: "#dc2626", strokeWidth: 2 }}
                fillOpacity={0.8}
                label={
                  showLabels
                    ? {
                        position: "right",
                        content: (props) => {
                          if (
                            props.index === capitalFormationData.length - 1 &&
                            props.x !== undefined &&
                            props.y !== undefined
                          ) {
                            return (
                              <text
                                x={Number(props.x) + 10}
                                y={Number(props.y)}
                                fill="#dc2626"
                                fontSize="12"
                                textAnchor="start"
                              >
                                NFCF
                              </text>
                            );
                          }
                          return null;
                        },
                      }
                    : false
                }
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        Data source:{" "}
        <Link href="https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes">
          Eurostat (NAMA_10_A64 and NAMA_10_A64_P5)
        </Link>{" "}
        | additional processing by Tomáš Bui <br />
        NFCF = GFCF - Consumption of Fixed Capital | Chain linked volumes (2020){" "}
        <br /> Licensed under CC BY 4.0.{" "}
      </p>
    </div>
  );
}
