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
  ReferenceLine,
  Cell,
} from "recharts";
import { LineTooltip, useChartAnimation } from "./utils";
import { Link } from "../components";

const BalanceData = [
  { year: 1994, import: NaN, export: NaN, Balance: -442 },
  { year: 1995, import: NaN, export: NaN, Balance: -1419 },
  { year: 1996, import: NaN, export: NaN, Balance: -3585 },
  { year: 1997, import: NaN, export: NaN, Balance: -4082 },
  { year: 1998, import: NaN, export: NaN, Balance: -2251 },
  { year: 1999, import: NaN, export: NaN, Balance: 43 },
  { year: 2000, import: NaN, export: NaN, Balance: 2673 },
  { year: 2001, import: NaN, export: NaN, Balance: 3678 },
  { year: 2002, import: NaN, export: NaN, Balance: 4156 },
  { year: 2003, import: NaN, export: NaN, Balance: 2255 },
  { year: 2004, import: NaN, export: NaN, Balance: 1861 },
  { year: 2005, import: NaN, export: NaN, Balance: 2722 },
  { year: 2006, import: NaN, export: NaN, Balance: 1603 },
  { year: 2007, import: 13580, export: 11855, Balance: -1725 },
  { year: 2008, import: 9412, export: 8891, Balance: -521 },
  { year: 2009, import: 8994, export: 7682, Balance: -1312 },
  { year: 2010, import: 7334, export: 6293, Balance: -1041 },
  { year: 2011, import: NaN, export: NaN, Balance: -727 },
  { year: 2012, import: NaN, export: NaN, Balance: -393 },
  { year: 2013, import: NaN, export: NaN, Balance: -91 },
  { year: 2014, import: 12963, export: 11862, Balance: -1101 },
  { year: 2015, import: 14968, export: 12611, Balance: -2357 },
  { year: 2016, import: 13249, export: 10598, Balance: -2651 },
  { year: 2017, import: 15565, export: 12535, Balance: -3030 },
  { year: 2018, import: 12544, export: 8747, Balance: -3797 },
  { year: 2019, import: 13539, export: 11839, Balance: -1700 },
  { year: 2020, import: 13288, export: 12970, Balance: -318 },
  { year: 2021, import: 13884, export: 13110, Balance: -774 },
  { year: 2022, import: 16743, export: 15331, Balance: -1412 },
  { year: 2023, import: 10649, export: 14071, Balance: 3422 },
];

export function ElectricityBalanceChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("import-export-chart", 1500, 400);

  return (
    <div id="import-export-chart" className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Electricity trade balance
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Net electricity balance showing imports and exports, measured in{" "}
        <span className="underline">gigawatt-hours (GWh)</span>.
      </p>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        debounce={50}
        className="outline-none [&_*]:outline-none"
      >
        <BarChart
          data={BalanceData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#666" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#666"
            label={{
              value: "GWh",
              angle: -90,
              position: "outsideLeft",
              dx: -25,
            }}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit="GWh" />}
          />

          <ReferenceLine y={0} stroke="#666" strokeWidth={1.5} />
          {showAnimation && (
            <Bar dataKey="Balance">
              {BalanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.Balance < 0 ? "#dc2626" : "#3b82f6"}
                />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4">
        <Link href="https://www.sepsas.sk/o-nas/vyrocne-spravy/">
          Various SEPS annual reports
        </Link> | additional processing by Tomáš Bui <br /> SEPS a. s.
      </p>
    </div>
  );
}
