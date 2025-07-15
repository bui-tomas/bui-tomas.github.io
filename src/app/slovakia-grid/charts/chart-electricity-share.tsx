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
  Legend,
} from "recharts";
import { LineTooltip, useChartAnimation } from "./utils";
import { Link } from "../components";

const electricityShareData = [
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 7.3754416,
    nuclear: 47.23421,
    oil: 8.826991,
    gas: 7.140055,
    coal: 29.423304,
    Year: 1990,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 5.812036,
    nuclear: 48.186314,
    oil: 12.737015,
    gas: 8.738664,
    coal: 24.525969,
    Year: 1991,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 8.347676,
    nuclear: 47.547333,
    oil: 9.251291,
    gas: 3.7435458,
    coal: 31.110155,
    Year: 1992,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 14.428275,
    nuclear: 47.775467,
    oil: 8.98129,
    gas: 4.906445,
    coal: 23.908525,
    Year: 1993,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 17.11818,
    nuclear: 49.469967,
    oil: 5.7322345,
    gas: 8.5983515,
    coal: 19.081274,
    Year: 1994,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 18.463867,
    nuclear: 43.284145,
    oil: 4.8429813,
    gas: 9.004919,
    coal: 24.404085,
    Year: 1995,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 16.614298,
    nuclear: 44.186962,
    oil: 6.8735275,
    gas: 9.190887,
    coal: 23.134329,
    Year: 1996,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 16.214056,
    nuclear: 44.209263,
    oil: 5.151757,
    gas: 9.305111,
    coal: 25.119806,
    Year: 1997,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 16.595413,
    nuclear: 44.267395,
    oil: 7.2289157,
    gas: 9.133307,
    coal: 22.774971,
    Year: 1998,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 15.9018135,
    nuclear: 46.67378,
    oil: 3.8776236,
    gas: 10.850231,
    coal: 22.696548,
    Year: 1999,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.0,
    solar: 0.0,
    wind: 0.0,
    hydro: 14.977258,
    nuclear: 53.573746,
    oil: 2.4691358,
    gas: 10.851202,
    coal: 18.128654,
    Year: 2000,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.47140166,
    solar: 0.0,
    wind: 0.0,
    hydro: 15.4934,
    nuclear: 53.739788,
    oil: 3.519799,
    gas: 8.4852295,
    coal: 18.290384,
    Year: 2001,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.46612805,
    solar: 0.0,
    wind: 0.0,
    hydro: 16.37663,
    nuclear: 55.77999,
    oil: 3.5736482,
    gas: 7.7998757,
    coal: 16.003729,
    Year: 2002,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.3227889,
    solar: 0.0,
    wind: 0.0,
    hydro: 11.233054,
    nuclear: 57.6501,
    oil: 3.808909,
    gas: 7.746934,
    coal: 19.238218,
    Year: 2003,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.06565988,
    solar: 0.0,
    wind: 0.03282994,
    hydro: 13.460276,
    nuclear: 55.909393,
    oil: 3.939593,
    gas: 7.944846,
    coal: 18.647406,
    Year: 2004,
  },
  {
    other_renewables: 0.0,
    bioenergy: 0.095724314,
    solar: 0.0,
    wind: 0.031908102,
    hydro: 14.80536,
    nuclear: 56.573067,
    oil: 3.8608809,
    gas: 6.955967,
    coal: 17.67709,
    Year: 2005,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.28,
    solar: 0.0,
    wind: 0.031999998,
    hydro: 14.08,
    nuclear: 57.632,
    oil: 3.8720002,
    gas: 6.112,
    coal: 16.992,
    Year: 2006,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.6876122,
    solar: 0.0,
    wind: 0.035906643,
    hydro: 15.978456,
    nuclear: 55.044884,
    oil: 4.201077,
    gas: 5.816876,
    coal: 17.23519,
    Year: 2007,
  },
  {
    other_renewables: 0.0,
    bioenergy: 1.8118466,
    solar: 0.0,
    wind: 0.034843203,
    hydro: 14.076654,
    nuclear: 58.188156,
    oil: 4.0069685,
    gas: 5.609756,
    coal: 16.271776,
    Year: 2008,
  },
  {
    other_renewables: 0.0,
    bioenergy: 2.08253,
    solar: 0.0,
    wind: 0.038565367,
    hydro: 16.853065,
    nuclear: 54.300037,
    oil: 4.2421904,
    gas: 7.597378,
    coal: 14.886231,
    Year: 2009,
  },
  {
    other_renewables: 0.0,
    bioenergy: 2.4034963,
    solar: 0.07283321,
    wind: 0.036416605,
    hydro: 19.155136,
    nuclear: 53.058994,
    oil: 4.2607427,
    gas: 8.04807,
    coal: 12.964312,
    Year: 2010,
  },
  {
    other_renewables: 0.0,
    bioenergy: 2.8995755,
    solar: 1.4144272,
    wind: 0.0,
    hydro: 13.366336,
    nuclear: 54.490803,
    oil: 4.1371994,
    gas: 11.138614,
    coal: 12.5530405,
    Year: 2011,
  },
  {
    other_renewables: 0.0,
    bioenergy: 3.321555,
    solar: 1.4840989,
    wind: 0.03533569,
    hydro: 14.487633,
    nuclear: 54.73498,
    oil: 3.8162546,
    gas: 10.070671,
    coal: 12.049471,
    Year: 2012,
  },
  {
    other_renewables: 0.0,
    bioenergy: 3.1929824,
    solar: 2.0701754,
    wind: 0.03508772,
    hydro: 17.017544,
    nuclear: 55.157894,
    oil: 3.368421,
    gas: 8.385965,
    coal: 10.77193,
    Year: 2013,
  },
  {
    other_renewables: 0.0,
    bioenergy: 5.2340584,
    solar: 2.211574,
    wind: 0.036859564,
    hydro: 15.517878,
    nuclear: 57.132328,
    oil: 3.3173609,
    gas: 5.9712496,
    coal: 10.578695,
    Year: 2014,
  },
  {
    other_renewables: 0.0,
    bioenergy: 6.2359123,
    solar: 1.9158527,
    wind: 0.037565738,
    hydro: 14.537941,
    nuclear: 56.912094,
    oil: 3.7190082,
    gas: 6.010518,
    coal: 10.6311035,
    Year: 2015,
  },
  {
    other_renewables: 0.0,
    bioenergy: 6.455224,
    solar: 1.9776119,
    wind: 0.03731343,
    hydro: 16.268658,
    nuclear: 55.111942,
    oil: 4.029851,
    gas: 5.671642,
    coal: 10.447762,
    Year: 2016,
  },
  {
    other_renewables: 0.0,
    bioenergy: 6.1998544,
    solar: 1.8599561,
    wind: 0.036469728,
    hydro: 15.754924,
    nuclear: 54.996353,
    oil: 4.1575494,
    gas: 6.0904446,
    coal: 10.904449,
    Year: 2017,
  },
  {
    other_renewables: 0.0,
    bioenergy: 6.1140285,
    solar: 2.1755438,
    wind: 0.037509378,
    hydro: 13.465866,
    nuclear: 55.663918,
    oil: 4.276069,
    gas: 6.976744,
    coal: 11.290322,
    Year: 2018,
  },
  {
    other_renewables: 0.0,
    bioenergy: 5.9907837,
    solar: 2.091457,
    wind: 0.035448425,
    hydro: 15.455513,
    nuclear: 54.16519,
    oil: 3.084013,
    gas: 10.882666,
    coal: 8.29493,
    Year: 2019,
  },
  {
    other_renewables: 0.0,
    bioenergy: 5.8575935,
    solar: 2.3149772,
    wind: 0.0,
    hydro: 15.854086,
    nuclear: 54.156433,
    oil: 2.7709577,
    gas: 12.521922,
    coal: 6.524027,
    Year: 2020,
  },
  {
    other_renewables: 0.0,
    bioenergy: 6.1952863,
    solar: 2.2558923,
    wind: 0.0,
    hydro: 14.343434,
    nuclear: 52.96296,
    oil: 3.8047137,
    gas: 14.713804,
    coal: 5.7239056,
    Year: 2021,
  },
  {
    other_renewables: 0.0,
    bioenergy: 5.614167,
    solar: 2.4491332,
    wind: 0.0,
    hydro: 13.865863,
    nuclear: 59.98493,
    oil: 4.0693293,
    gas: 7.9125843,
    coal: 6.103994,
    Year: 2022,
  },
  {
    other_renewables: 0.0,
    bioenergy: 4.774805,
    solar: 2.065696,
    wind: 0.0,
    hydro: 15.8821535,
    nuclear: 62.072468,
    oil: 3.3525229,
    gas: 7.7209616,
    coal: 4.131392,
    Year: 2023,
  },
  {
    other_renewables: 0.17047392,
    bioenergy: 5.080123,
    solar: 2.3184452,
    wind: 0.0,
    hydro: 16.399591,
    nuclear: 62.05251,
    oil: 3.000341,
    gas: 9.171497,
    coal: 1.8070234,
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

export function ElectricityShareChart() {
  const { showAnimation, showDots, showLabels, chartHeight } =
    useChartAnimation("electricity-share-chart", 1500, 350);

  return (
    <div id="electricity-share-chart" className="w-full max-w-3xl h-auto p-6 bg-white border border-gray-200 rounded-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        Electricity generation share by source
      </h2>

      <ResponsiveContainer
        width="100%"
        height={chartHeight}
        className="outline-none [&_*]:outline-none"
      >
        <LineChart
          data={electricityShareData}
          margin={{
            top: 20,
            right: 50,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="Year" stroke="#666" fontSize={12} interval={2} />
          <YAxis
            stroke="#666"
            fontSize={12}
            domain={[0, 65]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            animationDuration={0}
            content={(props) => <LineTooltip {...props} unit="%" />}
          />

          {/* Major energy sources */}
          {showAnimation && (
            <>
              <Line
                type="monotone"
                dataKey="nuclear"
                stroke={colors.nuclear}
                dot={
                  showDots
                    ? { fill: colors.nuclear, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.nuclear, strokeWidth: 2 }}
                name="Nuclear"
              />

              <Line
                type="monotone"
                dataKey="coal"
                stroke={colors.coal}
                dot={
                  showDots
                    ? { fill: colors.coal, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.coal, strokeWidth: 2 }}
                name="Coal"
              />

              <Line
                type="monotone"
                dataKey="hydro"
                stroke={colors.hydro}
                dot={
                  showDots
                    ? { fill: colors.hydro, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.hydro, strokeWidth: 2 }}
                name="Hydro"
              />

              <Line
                type="monotone"
                dataKey="gas"
                stroke={colors.gas}
                dot={
                  showDots
                    ? { fill: colors.gas, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.gas, strokeWidth: 2 }}
                name="Natural Gas"
              />

              <Line
                type="monotone"
                dataKey="oil"
                stroke={colors.oil}
                dot={
                  showDots
                    ? { fill: colors.oil, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.oil, strokeWidth: 2 }}
                name="Oil"
              />

              {/* Renewable sources */}
              <Line
                type="monotone"
                dataKey="solar"
                stroke={colors.solar}
                dot={
                  showDots
                    ? { fill: colors.solar, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.solar, strokeWidth: 2 }}
                name="Solar"
              />

              <Line
                type="monotone"
                dataKey="wind"
                stroke={colors.wind}
                dot={
                  showDots
                    ? { fill: colors.wind, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.wind, strokeWidth: 2 }}
                name="Wind"
              />

              <Line
                type="monotone"
                dataKey="bioenergy"
                stroke={colors.bioenergy}
                dot={
                  showDots
                    ? { fill: colors.bioenergy, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{ r: 2, stroke: colors.bioenergy, strokeWidth: 2 }}
                name="Bioenergy"
              />

              <Line
                type="monotone"
                dataKey="other_renewables"
                stroke={colors.other_renewables}
                dot={
                  showDots
                    ? { fill: colors.other_renewables, strokeWidth: 1, r: 1.5 }
                    : false
                }
                activeDot={{
                  r: 2,
                  stroke: colors.other_renewables,
                  strokeWidth: 2,
                }}
                name="Other Renewables"
              />
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
