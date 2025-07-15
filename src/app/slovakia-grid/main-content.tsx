"use client";

import SlovakiaMap from "@/app/slovakia-grid/map/map";
import { SectionTitle, SectionContent, InfoBox, Link } from "./components";
import { FileText } from "lucide-react";

import {
  ElectricityChart,
  CapitalFormationChart,
  FossilFuelElectricityChart,
  EnergyFlowChart,
  TransmissionLineChart,
  CapacityFactorScatter,
  InstalledCapacityChart,
  ElectricityGenerationStackedChart,
  ElectricityShareChart,
  ElectricityBalanceChart,
  SubstationChart,
} from "./charts";

import {
  OverviewDesc,
  ElectricityGenerationDesc,
  ElectricityShareDesc,
  CapitalFormationDesc,
  InstalledCapacityDesc,
  TransmissionLineDesc,
  ElectricityBalanceDesc,
  FossilFuelElectricityDesc,
  SubstationDesc,
} from "./charts";

export default function MainContent() {
  return (
    <div className="w-full">
      {/* Section - Grid Map*/}
      <div
        id="map"
        className="flex items-center justify-center space-x-4 py-8 mx-12 sm:mx-48"
      >
        <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
        <p className="text-2xl font-bold">Grid Map</p>
        <div className="flex-1 h-px bg-[#A27B5C]/20"></div>
      </div>

      <div className="pb-12 mx-4 sm:mx-12">
        <SlovakiaMap className="w-full shadow-lg rounded-lg" />
      </div>

      {/* Section - Overview */}
      <SectionTitle id="overview" title="Overview" />

      {/* Sector Structure */}
      <SectionContent
        id="sector-structure"
        title="Energy sector structure"
        gap="max-2xl:gap-8"
        margin_right="2xl:mr-8"
        left={<EnergyFlowChart />}
        right={<OverviewDesc />}
      />

      {/* Capital Formation */}
      <SectionContent
        id="capital-formation"
        title="Capital formation in the energy sector"
        gap="max-2xl:gap-8"
        padding="pb-12"
        margin_right="2xl:mr-8"
        left={<CapitalFormationChart />}
        right={<CapitalFormationDesc />}
      />

      {/* Section - Generation */}
      <SectionTitle id="generation" title="Generation" />

      {/* Electricity Generation */}
      <div className="">
        <SectionContent
          id="electricity-generation"
          title="Electricity generation"
          gap="max-2xl:gap-8"
          margin_right="2xl:mr-8"
          left={<ElectricityChart />}
          right={<ElectricityGenerationDesc />}
        />
      </div>

      {/* Electricity Share */}
      <div className="mb-12">
        <SectionContent
          id="electricity-share"
          gap="max-2xl:gap-8"
          title="Electricity generation by source"
          equal
          left={<ElectricityShareDesc />}
          right={""}
        />
      </div>

      <SectionContent
        equal
        gap="gap-8"
        padding="pr-8"
        left={<ElectricityGenerationStackedChart />}
        right={<ElectricityShareChart />}
      />

      {/* Installed Capacity */}
      <div className="mb-12">
        <SectionContent
          gap="max-2xl:gap-8"
          id="installed-capacity"
          title="Installed capacity"
          equal
          left={<InstalledCapacityDesc />}
          right={
            <InfoBox
              title="Important notes"
              variant="note"
              icon={<FileText size={18} />}
            >
              <p>
                Data covers multiple countries and was compiled from multiple
                sources including{" "}
                <Link href="https://web.archive.org/web/20130101064328/http://www.energieburgenland.at/oekoenergie/windkraft/windparks/standorte.html">
                  Energie Burgenland (Wind)
                </Link>
                {", "}
                <Link href="https://www.seas.sk/o-nas/nase-elektrarne/">
                  Slovenské elektrárne (Nuclear-Hydro)
                </Link>
                {", "}
                <Link href="https://cs.wikipedia.org/wiki/Seznam_tepeln%C3%BDch_elektr%C3%A1ren_v_%C4%8Cesku">
                  Wikipedia (Solar-Coal-Gas)
                </Link>{" "}
              </p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Installed MW data for solar is based on estimate from{" "}
                    <Link href="https://www.pv-magazine.com/2025/02/20/slovakia-added-274-mw-of-pv-in-2024/">
                      PV Magazine
                    </Link>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Hydropower capacity from plants of less than 5 MW are
                    excluded
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Installed MWe of Gas/Coal/Biomass heating plants are
                    excluded
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Data reflects different time periods due to source
                    availability
                  </span>
                </li>
              </ul>
            </InfoBox>
          }
        />
      </div>

      <SectionContent
        equal
        gap="gap-8"
        padding="pr-8"
        left={<InstalledCapacityChart />}
        right={<CapacityFactorScatter />}
      />

      {/* Fossil Fuel Share */}
      <SectionContent
        id="fossil-fuel-share"
        gap="max-2xl:gap-8"
        title="Share of electricity from fossil fuels"
        padding="pb-12"
        margin_right="2xl:mr-8"
        left={<FossilFuelElectricityChart />}
        right={<FossilFuelElectricityDesc />}
      />

      {/* Section - Transmission */}
      <SectionTitle id="transmission" title="Transmission" />

      {/* Transmission Lines */}
      <SectionContent
        id="transmission-lines"
        title="Transmission lines"
        gap="max-2xl:gap-8"
        margin_right="2xl:mr-8"
        left={<TransmissionLineChart />}
        right={<TransmissionLineDesc />}
      />

      {/* Substatinos */}
      {/* <SectionContent
              id="substations"
              title="Substations"
              margin_right="2xl:mr-8"
              left={<SubstationChart />}
              right={<SubstationDesc />}
            /> */}

      {/* Trade Balance */}
      <SectionContent
        id="import-export"
        title="Electricity trade balance"
        gap="max-2xl:gap-8"
        margin_right="2xl:mr-8"
        left={<ElectricityBalanceChart />}
        right={<ElectricityBalanceDesc />}
      />
    </div>
  );
}
