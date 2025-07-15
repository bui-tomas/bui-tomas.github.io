import { Link } from "../components";

export const FossilFuelElectricityDesc = () => {
  return (
    <div>
      <div className="mb-4">
        Slovakia maintains{" "}
        <Link href="https://lowcarbonpower.org/region/Slovakia">
          one of the cleanest and reliable energy sectors
        </Link>
        in Europe alongside France, Finland, and Sweden. This is accomplished
        through combination of nuclear baseload and hydroelectric plants.
      </div>
      <div className="mb-4">
        Slovakia reduced its fossil fuel dependency from <strong>45.4%</strong>{" "}
        in 1990 to <strong>14%</strong> in 2024, representing a{" "}
        <strong>69% reduction</strong> over three decades.
      </div>
      <div className="mb-4">
        This interactive chart shows evolution in electricity production by year
        of various countries, tracks energy trends and compares generation
        capacity across different time periods.
      </div>
    </div>
  );
};
