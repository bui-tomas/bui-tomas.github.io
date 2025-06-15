'use client';

import { useState } from 'react';
import { Map, Layers, Settings, Info } from 'lucide-react';
import KeyPanel from './key-panel';
import LayersPanel from './layers-panel';

interface MapControlsProps {
    onTileLayerChange?: (layerType: string) => void;
    className?: string;
}

const MapControls = ({ onTileLayerChange, className = '' }: MapControlsProps) => {
    const [showKeyPanel, setShowKeyPanel] = useState(true);
    const [showLayersPanel, setShowLayersPanel] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    const togglePanel = (panel: 'key' | 'layers' | 'settings') => {
        switch (panel) {
            case 'key':
                setShowKeyPanel(!showKeyPanel);
                setShowLayersPanel(false);
                setShowSettingsPanel(false);
                break;
            case 'layers':
                setShowLayersPanel(!showLayersPanel);
                setShowKeyPanel(false);
                setShowSettingsPanel(false);
                break;
            case 'settings':
                setShowSettingsPanel(!showSettingsPanel);
                setShowKeyPanel(false);
                setShowLayersPanel(false);
                break;
        }
    };

    const handleTileLayerChange = (layerType: string) => {
        // Map layer types to actual tile layer identifiers
        const layerMap: { [key: string]: string } = {
            'openstreetmap': 'light',
            'nighttime': 'dark',
        };
        
        const mappedLayer = layerMap[layerType] || layerType;
        onTileLayerChange?.(mappedLayer);
    };

    return (
        <div className={`absolute top-4 right-4 space-y-2 z-[1000] ${className}`}>
            {/* Control Buttons */}
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => togglePanel('key')}
                    className={`bg-white rounded-md shadow-lg p-2 hover:bg-gray-50 transition-colors ${
                        showKeyPanel ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    title="Toggle Key Panel"
                >
                    <Map className="w-5 h-5" />
                </button>
                
                <button
                    onClick={() => togglePanel('layers')}
                    className={`bg-white rounded-md shadow-lg p-2 hover:bg-gray-50 transition-colors ${
                        showLayersPanel ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    title="Toggle Layers Panel"
                >
                    <Layers className="w-5 h-5" />
                </button>
                
                <button
                    onClick={() => togglePanel('settings')}
                    className={`bg-white rounded-md shadow-lg p-2 hover:bg-gray-50 transition-colors ${
                        showSettingsPanel ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    title="Toggle Settings Panel"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Control Panels */}
            <div className="space-y-2">
                <KeyPanel 
                    isVisible={showKeyPanel}
                    onClose={() => setShowKeyPanel(false)}
                />
                
                <LayersPanel 
                    isVisible={showLayersPanel}
                    onClose={() => setShowLayersPanel(false)}
                    onTileLayerChange={handleTileLayerChange}
                />

                {/* Settings Panel (placeholder for future features) */}
                {showSettingsPanel && (
                    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800">Settings</h3>
                            <button
                                onClick={() => setShowSettingsPanel(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="block text-gray-700 mb-1">Map Quality</label>
                                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-3 h-3" defaultChecked />
                                    <span className="text-gray-700">Show tooltips</span>
                                </label>
                            </div>
                            
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-3 h-3" />
                                    <span className="text-gray-700">Auto-refresh data</span>
                                </label>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-100">
                                <button className="w-full text-xs text-blue-600 hover:text-blue-800 transition-colors">
                                    Reset to defaults
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Button (separate, always visible) */}
            <div className="pt-2">
                <button
                    className="bg-blue-600 text-white rounded-md shadow-lg p-2 hover:bg-blue-700 transition-colors"
                    title="Map Information"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MapControls;