import React from "react";
import { Link } from "../components";

export const OverviewDesc = () => {
  return (
    <div className="py-8">
      <div className="mb-4">
        Slovakia's energy sector is characterized by a mixed ownership structure
        established following market liberalization in 2005. The wholesale
        electricity market operates under deregulated pricing mechanisms, with
        cross-border trading volumes unrestricted since January 2005.
      </div>
      <div className="mb-4">
        To comply with{" "}
        <Link href="https://energy.ec.europa.eu/topics/markets-and-consumers/governance-internal-energy-market_en">
          EU unbundling regulations
        </Link>
        , Slovakia separated the supply, transmission and distribution
        activities within the industry.
      </div>
      <div className="mb-4">
        <strong>Slovenské elektrárne (SEAS)</strong> maintains the majority
        position in electricity generation with a 66% market share, supplying
        electricity to three major regional distribution companies:{" "}
        <strong>Západoslovenská energetika (ZSE)</strong>,{" "}
        <strong>Stredoslovenská energetika (SSE)</strong>, and{" "}
        <strong>Východoslovenská energetika (VSE)</strong>.
      </div>
      <div className="mb-4">
        The transmission of the electricity is under the responsibility of{" "}
        <strong>Slovenská elektrizačná prenosová sústava (SEPS)</strong>
        which operates the high voltage 400 kV and 220 kV lines, as well as
        selected 110 kV lines. Regional distributors control the rest of 110 kV,
        22 kV and other minor lines.
      </div>
      <div className="mb-4">
        <strong>SEPS</strong> is a wholly state-controlled company. The state
        also retains a minority 34% stake in <strong>SEAS</strong>. The
        distribution companies operate under a hybrid ownership model, with 51%
        state control and 49% private ownership held by international energy
        groups including <strong>E.ON</strong>, <strong>RWE Group</strong>, and{" "}
        <strong>EPH</strong>.
      </div>
    </div>
  );
};
