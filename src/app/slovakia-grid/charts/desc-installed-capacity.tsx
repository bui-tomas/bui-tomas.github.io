import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Link } from "../components";

export const InstalledCapacityDesc = () => {
  return (
    <div>
      <div className="mb-4">
        <strong>Installed capacity</strong> represents the theoretical maximum
        electrical output that power infrastructure can deliver under optimal
        conditions, measured in <strong>megawatts (MW)</strong>. The
        relationship between installed capacity and actual output varies
        dramatically across energy sources due to capacity factors.
      </div>
      <div className="mb-4">
        <strong>Capacity factor</strong> measures the percentage of theoretical
        maximum output that a power source actually delivers over time,
        accounting for maintenance, fuel availability, and operational
        constraints.
      </div>

      <div className="my-8 text-center">
        <BlockMath math="CF = \frac{E_{\text{actual}}}{P_{\text{rated}} \times T} \times 100\%" />
      </div>

      <div className="mb-4">
        For example,{" "}
        <Link href="https://www.eia.gov/energyexplained/nuclear/us-nuclear-industry.php">
          nuclear plants typically demonstrate the highest capacity factors
          (80-90%)
        </Link>{" "}
        due to their role as baseload power, operating continuously except
        during scheduled maintenance.
      </div>

      <div>
        In contrast, renewable sources like{" "}
        <Link href="https://www.eia.gov/todayinenergy/detail.php?id=39832">
          solar and wind exhibit significantly lower capacity factors (15-35%)
        </Link>{" "}
        due to weather dependency and intermittency.
      </div>
    </div>
  );
};
