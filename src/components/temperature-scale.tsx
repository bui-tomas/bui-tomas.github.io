import React from 'react';
import { Thermometer } from 'lucide-react';

interface TemperatureScaleProps {
    temperature: number;
    setTemperature: (temp: number) => void;
    min?: number;
    max?: number;
}

const TemperatureScale = ({
    temperature,
    setTemperature,
    min = 0.5,
    max = 5
}: TemperatureScaleProps) => {
    const percentage = ((temperature - min) / (max - min)) * 100;

    return (
        <div className="fixed top-24 right-8 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg z-50 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
                <Thermometer 
                    size={24} 
                    className="text-gray-700"
                />
                <span className="text-sm font-medium">
                    Temperature: {temperature.toFixed(1)}
                </span>
            </div>

            <div className="relative w-48 h-6">
                {/* Black body radiation gradient */}
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `linear-gradient(to right, 
                            hsla(0, 100%, 20%, 0.8),   /* Deep red */
                            hsla(0, 100%, 40%, 0.8),   /* Bright red */
                            hsla(30, 100%, 45%, 0.8),  /* Orange */
                            hsla(60, 100%, 50%, 0.8),  /* Yellow */
                            hsla(60, 20%, 80%, 0.8),   /* Yellow-white */
                            hsla(200, 30%, 85%, 0.8),  /* Blue-white */
                            hsla(220, 60%, 90%, 0.8)   /* Bright blue-white */
                        )`
                    }}
                />
                
                <input
                    type="range"
                    min={min * 100}
                    max={max * 100}
                    value={temperature * 100}
                    onChange={(e) => setTemperature(Number(e.target.value) / 100)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-gray-200 transition-transform duration-150 hover:scale-110"
                    style={{ 
                        left: `${percentage}%`,
                        transform: `translateX(-50%) translateY(-50%)`,
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }}
                />
            </div>

            <div className="flex justify-between w-full text-xs font-medium">
                <span className="text-red-900">Cool</span>
                <span className="text-yellow-500">↔</span>
                <span className="text-blue-400">Hot</span>
            </div>
        </div>
    );
};

export default TemperatureScale;