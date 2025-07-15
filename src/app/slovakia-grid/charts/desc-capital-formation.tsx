import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Link, InfoBox } from "../components";
import { FileText, ChevronRight } from "lucide-react";

export const CapitalFormationDesc = () => {
  return (
    <div>
      <div className="mb-4">
        <strong>Capital formation</strong> measures investment in energy sector
        infrastructure. These indicators reveal the sector's capacity for growth
        and modernization.
      </div>
      <div className="mb-4">
        <strong>Gross Fixed Capital Formation (GFCF)</strong> refers to amount
        of investment in a sector including maintenance, replacement. When{" "}
        <strong>Consumption of Fixed Capital</strong> is subtracted, we get an
        approximate <strong>Net Fixed Capital Formation (NFCF)</strong>:
      </div>
      <div className="my-2 text-center overflow-x-auto">
        <div className="text-xs sm:text-sm md:text-md min-w-max px-2">
          <BlockMath math="\text{Net Capital Formation} = \text{Gross Capital Formation} - \text{Consumption}" />
        </div>
      </div>

      <div className="mb-4">
        Slovakia's energy sector experienced significant investment peaks in
        2006-2007, followed by varying cycles of capital deployment and asset
        depreciation through economic transitions.
      </div>
      <div className="mb-8">
        As EU-wide Green New Deal climate action is rolled out, investment in{" "}
        <Link>nuclear energy</Link> and <Link>renewables</Link>{" "}
        accelerated, it is expected to see significant increases in both gross
        and net fixed capital formations.
      </div>

      <InfoBox
        title="Read more - TBA"
        variant="warning"
        icon={<FileText size={18} />}
      >
        <p className="mb-4">
          Analysis of ÚHP financial report on theoretical new nuclear power
          plant.
        </p>
        <button className="w-full bg-amber-500/50 hover:bg-amber-400/70 text-amber-600 p-3 rounded-lg border border-amber-300 transition-colors group flex items-center justify-center gap-2">
          <span className="font-medium text-sm">Read Full Analysis</span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </InfoBox>
    </div>
  );
};
