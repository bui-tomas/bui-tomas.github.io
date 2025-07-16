// components/map/popups.tsx
import React from "react";

export const SubstationPopup: React.FC<{
  name?: string;
  voltage?: string;
  operator?: string;
  type?: string;
  operatorLogo?: string;
  operatorLogo2?: string;
}> = ({
  name = "Substation",
  voltage = "Unknown",
  operator = "Unknown",
  type = "Unknown",
  operatorLogo,
  operatorLogo2,
}) => {
  return (
    <div className="p-2">
      <div className="text-center mb-4">
        <h3 className="text-md font-semibold">{name || "Substation"}</h3>
      </div>
      <div className="flex-1 h-px bg-[#A27B5C]/20 mb-4"></div>

      <div className="grid grid-cols-2 gap-4">
        {/* First column - Information */}
        <div className="space-y-1">
          <p>
            <strong>Voltage: </strong>
            {voltage || "Unknown"}
          </p>
          <p>
            <strong>Operator: </strong>
            {operator || "Unknown"}
          </p>
          <p>
            <strong>Type: </strong>
            {type || "Unknown"}
          </p>
        </div>

        {/* Second column - Operator Logo(s) */}
        <div className="flex items-center justify-center">
          {operatorLogo && operatorLogo2 ? (
            // Dual logo with diagonal split
            <div className="relative w-20 h-20 overflow-hidden">
              {/* Top-left logo */}
              <div className="absolute top-1 left-1 w-10 h-10">
                <img
                  src={operatorLogo}
                  alt={`${operator || "Operator"} logo 1`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bottom-right logo */}
              <div className="absolute bottom-1 right-1 w-10 h-10">
                <img
                  src={operatorLogo2}
                  alt={`${operator || "Operator"} logo 2`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Optional: Diagonal line separator */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 49%,rgb(0, 0, 0) 49%, #d1d5db 51%, transparent 51%)",
                }}
              />
            </div>
          ) : operatorLogo ? (
            // Single logo
            <img
              src={operatorLogo}
              alt={`${operator || "Operator"} logo`}
              className="max-w-full max-h-16 object-contain"
            />
          ) : (
            // No logo placeholder
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
              No Logo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TransmissionLinePopup: React.FC<{
  name?: string;
  voltage?: string;
  operator?: string;
  status?: string;
  description?: string;
}> = ({
  name = "Transmission Line",
  voltage,
  operator,
  status,
  description,
}) => {
  return (
    <div className="p-2">
      <h3 className="text-md font-semibold">{name || "Power Line"}</h3>
      <div className="flex-1 h-px bg-[#A27B5C]/20 my-2"></div>
      <p>
        <strong>Voltage: </strong>
        {voltage || "Unknown"}
      </p>
      <p>
        <strong>Operator: </strong>
        {operator || "Unknown"}
      </p>
      <p>
        <strong>Status: </strong>
        {status || "Unknown"}
      </p>
    </div>
  );
};

// Transformation dictionaries
const GENERATION_METHOD_TRANSFORM: Record<string, string> = {
  'fission': 'Fission',
  'run-of-river': 'Run-of-river',
  'pumped-storage': 'Pumped storage',
  'water-storage': 'Water storage',
  'combustion': 'Combustion',
  'geothermal': 'Geothermal',
};

const SOURCE_TRANSFORM: Record<string, string> = {
  'renewable': 'Renewable Energy',
  'gas': 'Gas',
  'nuclear': 'Nuclear',
  'hydro': 'Hydroelectric',
  'wind': 'Wind',
  'solar': 'Solar',
};

export const PowerPlantPopup: React.FC<{
  name?: string;
  operator?: string;
  source?: string;
  generation_method?: string;
  power?: string;
  average_production?: string;
  start_year?: string;
  operatorLogo?: string;
  operatorLogo2?: string;
}> = ({
  name = "Power Plant",
  operator,
  source,
  generation_method,
  power,
  average_production,
  start_year,
  operatorLogo,
  operatorLogo2,
}) => {
  // Transform values using dictionaries
  const transformedSource = source ? (SOURCE_TRANSFORM[source] || source) : "Unknown";
  const transformedGenerationMethod = generation_method 
    ? (GENERATION_METHOD_TRANSFORM[generation_method] || generation_method) 
    : "Unknown";

  // Helper function to check if a value should be displayed
  const shouldShowField = (value?: string) => value && value !== "unknown";

  return (
    <div className="p-2">
      <div className="text-center mb-4">
        <h3 className="text-md font-semibold">{name || "Power Plant"}</h3>
      </div>
      <div className="flex-1 h-px bg-[#A27B5C]/20 mb-4"></div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* First column - Information */}
        <div className="space-y-1">
          {shouldShowField(operator) && (
            <p>
              <strong>Operator: </strong>
              {operator}
            </p>
          )}
          {shouldShowField(source) && (
            <p>
              <strong>Source: </strong>
              {transformedSource}
            </p>
          )}
          {shouldShowField(generation_method) && (
            <p>
              <strong>Generation method: </strong>
              {transformedGenerationMethod}
            </p>
          )}
          {shouldShowField(power) && (
            <p>
              <strong>Installed power: </strong>
              {power} MW
            </p>
          )}
          {shouldShowField(average_production) && (
            <p>
              <strong>Average production: </strong>
              {average_production} GWh
            </p>
          )}
          {shouldShowField(start_year) && (
            <p>
              <strong>Start year: </strong>
              {start_year}
            </p>
          )}
        </div>

        {/* Second column - Operator Logo(s) */}
        <div className="flex items-center justify-center">
          {operatorLogo && operatorLogo2 ? (
            // Dual logo with diagonal split
            <div className="relative w-32 h-32 overflow-hidden rounded-lg bg-gray-100">
              {/* Top-left logo */}
              <div className="absolute top-1 left-1 w-14 h-14">
                <img
                  src={operatorLogo}
                  alt={`${operator || "Operator"} logo 1`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Bottom-right logo */}
              <div className="absolute bottom-1 right-1 w-14 h-14">
                <img
                  src={operatorLogo2}
                  alt={`${operator || "Operator"} logo 2`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Optional: Diagonal line separator */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 49%, #d1d5db 49%, #d1d5db 51%, transparent 51%)",
                }}
              />
            </div>
          ) : operatorLogo ? (
            // Single logo
            <img
              src={operatorLogo}
              alt={`${operator || "Operator"} logo`}
              className="max-w-full max-h-24 object-contain"
            />
          ) : (
            // No logo placeholder
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
              No Logo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};