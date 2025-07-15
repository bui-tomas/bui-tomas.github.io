"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { power_colors } from "./utils";
import type { MapLibreRef } from "./utils";
import Image from "next/image";

interface KeyPanelProps {
  isVisible: boolean;
  onClose: () => void;
  mapRef?: React.RefObject<MapLibreRef>;
}

interface VoltageVisibility {
  [key: string]: boolean;
}

interface PowerPlantType {
  name: string;
  symbol: string;
  enabled: boolean;
}

const KeyPanel = ({ isVisible, onClose, mapRef }: KeyPanelProps) => {
  // Voltage level visibility
  const [voltageVisibility, setVoltageVisibility] = useState<VoltageVisibility>(
    {
      22: false,
      110: true,
      220: true,
      400: true,
    }
  );

  // Power plant types
    const [powerPlantTypes, setPowerPlantTypes] = useState<PowerPlantType[]>([
        // { name: 'Coal', symbol: '/icons/power_plant_coal.png', enabled: true },
        { name: 'Hydroelectric', symbol: '/icons/power_plant_hydro.png', enabled: true },
        { name: 'Nuclear', symbol: '/icons/power_plant_nuclear.png', enabled: true },
        { name: 'Oil/Gas', symbol: '/icons/power_plant_oilgas.png', enabled: true },
        // { name: 'Solar', symbol: '/icons/power_plant_solar.png', enabled: true },
        { name: 'Wind', symbol: '/icons/power_plant_wind.png', enabled: true },
    ]);

  const toggleVoltageLevel = (voltage: string) => {
    const newVisibility = !voltageVisibility[voltage];

    setVoltageVisibility((prev) => ({
      ...prev,
      [voltage]: newVisibility,
    }));

    // Call the map toggle function
    if (mapRef?.current) {
      mapRef.current.toggleLine(parseInt(voltage), newVisibility);
    }
  };

  const togglePowerPlant = (index: number) => {
    setPowerPlantTypes((prev) =>
      prev.map((plant, i) =>
        i === index ? { ...plant, enabled: !plant.enabled } : plant
      )
    );
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Key</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Power Lines Section */}
      <div className="mb-4">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Power Lines</h4>
        <div className="space-y-1">
          {Object.entries(voltageVisibility).map(([voltage, visible]) => (
            <div
              key={voltage}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-gray-600">{voltage} kV</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-0.5 rounded transition-opacity"
                  style={{
                    backgroundColor:
                      power_colors[voltage as keyof typeof power_colors],
                    opacity: visible ? 1 : 0.3,
                  }}
                />
                <button
                  onClick={() => toggleVoltageLevel(voltage)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title={`Toggle ${voltage} visibility`}
                >
                  {visible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Special line types */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Line reference</span>
            <div className="w-6 h-0.5 border border-gray-400 border-dashed" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Underground</span>
            <div className="w-6 h-0.5 border-b-2 border-dotted border-gray-600" />
          </div>
        </div>
      </div>

      {/* Power Plants Section */}
      <div className="mb-4">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Power Plants</h4>
        <div className="space-y-1">
          {powerPlantTypes.map((plant, index) => (
            <div
              key={plant.name}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-gray-600">{plant.name}</span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm transition-opacity ${
                    plant.enabled ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <Image 
                    src={plant.symbol} 
                    alt={plant.name} 
                    width={20} 
                    height={20} 
                    className="mr-2"
                    />
                </span>
                <button
                  onClick={() => togglePowerPlant(index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title={`Toggle ${plant.name} visibility`}
                >
                  {plant.enabled ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyPanel;
