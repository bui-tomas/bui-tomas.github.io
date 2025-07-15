import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Link } from "../components";

export const ElectricityBalanceDesc = () => {
  return (
    <div>
      <div className="mb-4">
        <strong>Electricity trade balance</strong> refers to balance between net
        exports and imports of electricity. Due to the nature of electricity,
        countries may export or import depending on seasonal and structural
        needs.
      </div>
      <div className="my-10 text-center">
        <BlockMath math="\text{Net Electricity Balance} = \text{Exports} - \text{Imports}" />{" "}
      </div>
      <div className="mb-4">
        Slovakia transitioned from being a <strong>net importer</strong> in the
        mid-1990s to becoming a <strong>net exporter</strong> from 1999-2006.
        Following the closure of Bohunice units 1 and 2, the country reversed to
        being a net importer of <strong>1,000-4,000 GWh annually</strong>.
      </div>
      <div className="mb-4">
        <Link href="https://www.reuters.com/business/energy/slovaks-fuel-up-new-nuclear-plant-europe-grapples-with-energy-crisis-2022-09-13/">
          Slovakia is poised to being a net exporter after Mochove unit 3 and 4
          are built and fully functioning
        </Link>
        . In 2023, Slovakia achieved a positive trade balance of{" "}
        <strong>3,422 GWh</strong>, marking its return to net exporter status
        after 17 years.
      </div>
    </div>
  );
};
