import { Link, InfoBox } from "../components";
import { FileText } from "lucide-react";

export const TransmissionLineDesc = () => {
  return (
    <div>
      <div className="mb-4">
        <strong>Transmission infrastructure</strong> enables the transport of
        electricity from generation sources to distribution networks across the
        country and facilitates cross-border energy trade with neighboring
        states.
      </div>
      <div className="mb-4">
        The <strong>400 kV network</strong> represents the highest voltage level
        in Slovakia's grid, totaling approximately{" "}
        <strong>2,357 kilometers</strong> and primarily handles bulk power
        transmission, international interconnections with neighboring countries
        including Czech Republic, Hungary, Poland, and Ukraine.
      </div>
      <div className="mb-4">
        The <strong>220 kV network</strong> comprises around{" "}
        <strong>688 kilometers</strong> of lines, This network has seen gradual
        reduction over time as lines have been upgraded to 400 kV.
      </div>
      <div className="mb-8">
        <strong>SEPS</strong> operates approximately{" "}
        <strong>80 kilometers</strong> of{" "}
        <strong>110 kV transmission lines</strong>, The majority of Slovakia's
        110 kV infrastructure is managed by regional distribution companies as
        part of their local networks.
      </div>
      <InfoBox
        title="Important notes"
        variant="note"
        icon={<FileText size={18} />}
      >
        <p>Data excludes 110 kV and 22 kV operated by regional distributors numbered in thousands of kilometers.</p>
      </InfoBox>
    </div>
  );
};
