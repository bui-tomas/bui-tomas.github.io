"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "../components";

const electricityGenerationData = [
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 1.88,
    nuclear: 12.04,
    oil: 2.25,
    gas: 1.82,
    coal: 7.5,
    Year: 1990,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 1.41,
    nuclear: 11.69,
    oil: 3.09,
    gas: 2.12,
    coal: 5.95,
    Year: 1991,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 1.94,
    nuclear: 11.05,
    oil: 2.15,
    gas: 0.87,
    coal: 7.23,
    Year: 1992,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 3.47,
    nuclear: 11.49,
    oil: 2.16,
    gas: 1.18,
    coal: 5.75,
    Year: 1993,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.36,
    nuclear: 12.6,
    oil: 1.46,
    gas: 2.19,
    coal: 4.86,
    Year: 1994,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.88,
    nuclear: 11.44,
    oil: 1.28,
    gas: 2.38,
    coal: 6.45,
    Year: 1995,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.23,
    nuclear: 11.25,
    oil: 1.75,
    gas: 2.34,
    coal: 5.89,
    Year: 1996,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.06,
    nuclear: 11.07,
    oil: 1.29,
    gas: 2.33,
    coal: 6.29,
    Year: 1997,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.27,
    nuclear: 11.39,
    oil: 1.86,
    gas: 2.35,
    coal: 5.86,
    Year: 1998,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.47,
    nuclear: 13.12,
    oil: 1.09,
    gas: 3.05,
    coal: 6.38,
    Year: 1999,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.61,
    nuclear: 16.49,
    oil: 0.76,
    gas: 3.34,
    coal: 5.58,
    Year: 2000,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.15,
    solar: 0.0,
    wind: 0.0,
    hydro: 4.93,
    nuclear: 17.1,
    oil: 1.12,
    gas: 2.7,
    coal: 5.82,
    Year: 2001,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.15,
    solar: 0.0,
    wind: 0.0,
    hydro: 5.27,
    nuclear: 17.95,
    oil: 1.15,
    gas: 2.51,
    coal: 5.15,
    Year: 2002,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.1,
    solar: 0.0,
    wind: 0.0,
    hydro: 3.48,
    nuclear: 17.86,
    oil: 1.18,
    gas: 2.4,
    coal: 5.96,
    Year: 2003,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.02,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.1,
    nuclear: 17.03,
    oil: 1.2,
    gas: 2.42,
    coal: 5.68,
    Year: 2004,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.03,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.64,
    nuclear: 17.73,
    oil: 1.21,
    gas: 2.18,
    coal: 5.54,
    Year: 2005,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.4,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.4,
    nuclear: 18.01,
    oil: 1.21,
    gas: 1.91,
    coal: 5.31,
    Year: 2006,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.47,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.45,
    nuclear: 15.33,
    oil: 1.17,
    gas: 1.62,
    coal: 4.8,
    Year: 2007,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.52,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.04,
    nuclear: 16.7,
    oil: 1.15,
    gas: 1.61,
    coal: 4.67,
    Year: 2008,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.54,
    solar: 0.0,
    wind: 0.01,
    hydro: 4.37,
    nuclear: 14.08,
    oil: 1.1,
    gas: 1.97,
    coal: 3.86,
    Year: 2009,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.66,
    solar: 0.02,
    wind: 0.01,
    hydro: 5.26,
    nuclear: 14.57,
    oil: 1.17,
    gas: 2.21,
    coal: 3.56,
    Year: 2010,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.82,
    solar: 0.4,
    wind: 0.0,
    hydro: 3.78,
    nuclear: 15.41,
    oil: 1.17,
    gas: 3.15,
    coal: 3.55,
    Year: 2011,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.94,
    solar: 0.42,
    wind: 0.01,
    hydro: 4.1,
    nuclear: 15.49,
    oil: 1.08,
    gas: 2.85,
    coal: 3.41,
    Year: 2012,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.91,
    solar: 0.59,
    wind: 0.01,
    hydro: 4.85,
    nuclear: 15.72,
    oil: 0.96,
    gas: 2.39,
    coal: 3.07,
    Year: 2013,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.42,
    solar: 0.6,
    wind: 0.01,
    hydro: 4.21,
    nuclear: 15.5,
    oil: 0.9,
    gas: 1.62,
    coal: 2.87,
    Year: 2014,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.66,
    solar: 0.51,
    wind: 0.01,
    hydro: 3.87,
    nuclear: 15.15,
    oil: 0.99,
    gas: 1.6,
    coal: 2.83,
    Year: 2015,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.73,
    solar: 0.53,
    wind: 0.01,
    hydro: 4.36,
    nuclear: 14.77,
    oil: 1.08,
    gas: 1.52,
    coal: 2.8,
    Year: 2016,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.7,
    solar: 0.51,
    wind: 0.01,
    hydro: 4.32,
    nuclear: 15.08,
    oil: 1.14,
    gas: 1.67,
    coal: 2.99,
    Year: 2017,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.63,
    solar: 0.58,
    wind: 0.01,
    hydro: 3.59,
    nuclear: 14.84,
    oil: 1.14,
    gas: 1.86,
    coal: 3.01,
    Year: 2018,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.69,
    solar: 0.59,
    wind: 0.01,
    hydro: 4.36,
    nuclear: 15.28,
    oil: 0.87,
    gas: 3.07,
    coal: 2.34,
    Year: 2019,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.67,
    solar: 0.66,
    wind: 0.0,
    hydro: 4.52,
    nuclear: 15.44,
    oil: 0.79,
    gas: 3.57,
    coal: 1.86,
    Year: 2020,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.84,
    solar: 0.67,
    wind: 0.0,
    hydro: 4.26,
    nuclear: 15.73,
    oil: 1.13,
    gas: 4.37,
    coal: 1.7,
    Year: 2021,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.49,
    solar: 0.65,
    wind: 0.0,
    hydro: 3.68,
    nuclear: 15.92,
    oil: 1.08,
    gas: 2.1,
    coal: 1.62,
    Year: 2022,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.41,
    solar: 0.61,
    wind: 0.0,
    hydro: 4.69,
    nuclear: 18.33,
    oil: 0.99,
    gas: 2.28,
    coal: 1.22,
    Year: 2023,
  },
  {
    other_renewables: 0.05,
    bioenergy: 1.49,
    solar: 0.68,
    wind: 0.0,
    hydro: 4.81,
    nuclear: 18.2,
    oil: 0.88,
    gas: 2.69,
    coal: 0.53,
    Year: 2024,
  },
];

const colors = {
  nuclear: "#800080",
  hydro: "#3b82f6",
  gas: "#f59e0b",
  coal: "#800000",
  oil: "#dc2626",
  wind: "#10b981",
  solar: "#e6e600",
  bioenergy: "#00cc88",
  other_renewables: "#e68a00",
};

const StackedAreaTooltip = ({
  active,
  payload,
  label,
  hoveredArea,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  hoveredArea?: string | null;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(
      (sum: number, entry: any) => sum + (entry.value || 0),
      0
    );

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-900">{label}</h4>
        <div className="flex-1 h-px bg-[#A27B5C]/20 my-2"></div>
        <div className="space-y-2">
          {payload
            .sort((a: any, b: any) => a.value - b.value)
            .map((entry: any, index: number) => {
              const textOpacity = !hoveredArea
                ? 1
                : hoveredArea === entry.dataKey
                ? 1
                : 0.3;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                  style={{ opacity: textOpacity }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs">{entry.name}:</span>
                  </div>
                  <span className="text-xs font-semibold">
                    {entry.value?.toFixed(2)} TWh
                  </span>
                </div>
              );
            })}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs">
                <strong>Total</strong>:
              </span>
            </div>
            <span className="text-xs font-semibold">
              {total.toFixed(2)} TWh
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ElectricityGenerationStackedChart() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const [chartHeight, setChartHeight] = useState(350);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setChartHeight(300);
    }
  }, []);

  const getAreaOpacity = (areaKey: string) => {
    if (!hoveredArea) return 0.7;
    return hoveredArea === areaKey ? 0.9 : 0.3;
  };

  return (
    <div className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Electricity generation by source
      </h2>

      <ResponsiveContainer
        width="95%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <AreaChart
          data={electricityGenerationData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="Year" stroke="#666" fontSize={12} interval={2} />
          <YAxis
            stroke="#666"
            fontSize={12}
            label={{
              value: "TWh",
              angle: -90,
              position: "outsideLeft",
              dx: -20,
            }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={<StackedAreaTooltip hoveredArea={hoveredArea} />}
            animationDuration={0}
          />

          <Area
            type="monotone"
            dataKey="nuclear"
            stackId="1"
            stroke={colors.nuclear}
            fill={colors.nuclear}
            fillOpacity={getAreaOpacity("nuclear")}
            name="Nuclear"
            onMouseEnter={() => setHoveredArea("nuclear")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.nuclear,
              strokeWidth: 2,
              fill: colors.nuclear,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="coal"
            stackId="1"
            stroke={colors.coal}
            fill={colors.coal}
            fillOpacity={getAreaOpacity("coal")}
            name="Coal"
            onMouseEnter={() => setHoveredArea("coal")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.nuclear,
              strokeWidth: 2,
              fill: colors.nuclear,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="hydro"
            stackId="1"
            stroke={colors.hydro}
            fill={colors.hydro}
            fillOpacity={getAreaOpacity("hydro")}
            name="Hydro"
            onMouseEnter={() => setHoveredArea("hydro")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.nuclear,
              strokeWidth: 2,
              fill: colors.nuclear,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="gas"
            stackId="1"
            stroke={colors.gas}
            fill={colors.gas}
            fillOpacity={getAreaOpacity("gas")}
            name="Natural Gas"
            onMouseEnter={() => setHoveredArea("gas")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.gas,
              strokeWidth: 2,
              fill: colors.gas,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="oil"
            stackId="1"
            stroke={colors.oil}
            fill={colors.oil}
            fillOpacity={getAreaOpacity("oil")}
            name="Oil"
            onMouseEnter={() => setHoveredArea("oil")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.oil,
              strokeWidth: 2,
              fill: colors.oil,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="solar"
            stackId="1"
            stroke={colors.solar}
            fill={colors.solar}
            fillOpacity={getAreaOpacity("solar")}
            name="Solar"
            onMouseEnter={() => setHoveredArea("solar")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.solar,
              strokeWidth: 2,
              fill: colors.solar,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="wind"
            stackId="1"
            stroke={colors.wind}
            fill={colors.wind}
            fillOpacity={getAreaOpacity("wind")}
            name="Wind"
            onMouseEnter={() => setHoveredArea("wind")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.wind,
              strokeWidth: 2,
              fill: colors.wind,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="other_renewables"
            stackId="1"
            stroke={colors.other_renewables}
            fill={colors.other_renewables}
            fillOpacity={getAreaOpacity("other_renewables")}
            name="Other renewables"
            onMouseEnter={() => setHoveredArea("other_renewables")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.other_renewables,
              strokeWidth: 2,
              fill: colors.other_renewables,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
          <Area
            type="monotone"
            dataKey="bioenergy"
            stackId="1"
            stroke={colors.bioenergy}
            fill={colors.bioenergy}
            fillOpacity={getAreaOpacity("bioenergy")}
            name="Bioenergy"
            onMouseEnter={() => setHoveredArea("bioenergy")}
            onMouseLeave={() => setHoveredArea(null)}
            activeDot={{
              r: 1.5,
              stroke: colors.bioenergy,
              strokeWidth: 2,
              fill: colors.bioenergy,
            }}
            animationDuration={showAnimation ? 1500 : 0}
          />
        </AreaChart>
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
