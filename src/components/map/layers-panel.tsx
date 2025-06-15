'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface LayersPanelProps {
    isVisible: boolean;
    onClose: () => void;
    onTileLayerChange?: (layerType: string) => void;
}

interface LayerControl {
    id: string;
    name: string;
    enabled: boolean;
    category: 'background' | 'overlays' | 'heatmaps' | 'infrastructure' | 'validation';
}

const LayersPanel = ({ isVisible, onClose, onTileLayerChange }: LayersPanelProps) => {
    const [currentTileLayer, setCurrentTileLayer] = useState('openstreetmap');
    
    // Layer controls state
    const [layerControls, setLayerControls] = useState<LayerControl[]>([
        // Overlays
        { id: 'labels', name: 'Labels', enabled: true, category: 'overlays' },
        { id: 'borders', name: 'Borders', enabled: true, category: 'overlays' },
        
        // Heatmaps
        { id: 'solar_generation', name: 'Solar Generation', enabled: false, category: 'heatmaps' },
        
        // Infrastructure
        { id: 'power', name: 'Power', enabled: true, category: 'infrastructure' },
        { id: 'telecoms', name: 'Telecoms', enabled: false, category: 'infrastructure' },
        { id: 'oil_gas', name: 'Oil & Natural Gas', enabled: false, category: 'infrastructure' },
        { id: 'other_pipelines', name: 'Other Pipelines', enabled: false, category: 'infrastructure' },
        { id: 'water', name: 'Water', enabled: false, category: 'infrastructure' },
        
        // Validation
        { id: 'power_validation', name: 'Power', enabled: false, category: 'validation' },
    ]);

    const backgroundOptions = [
        { id: 'openstreetmap', name: 'OpenStreetMap', description: 'Standard map view' },
        { id: 'nighttime', name: 'Nighttime Lights', description: 'Satellite nighttime imagery' },
    ];

    const toggleLayer = (layerId: string) => {
        setLayerControls(prev => 
            prev.map(layer => 
                layer.id === layerId 
                    ? { ...layer, enabled: !layer.enabled }
                    : layer
            )
        );
    };

    const handleTileLayerChange = (layerType: string) => {
        setCurrentTileLayer(layerType);
        onTileLayerChange?.(layerType);
    };

    const renderLayerSection = (category: LayerControl['category'], title: string) => {
        const categoryLayers = layerControls.filter(layer => layer.category === category);
        
        if (categoryLayers.length === 0) return null;

        return (
            <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">{title}</h4>
                <div className="space-y-1">
                    {categoryLayers.map(layer => (
                        <label key={layer.id} className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                                type="checkbox"
                                checked={layer.enabled}
                                onChange={() => toggleLayer(layer.id)}
                                className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{layer.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    if (!isVisible) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Layers</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Background Section */}
            <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Background</h4>
                <div className="space-y-1">
                    {backgroundOptions.map(option => (
                        <label key={option.id} className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                                type="radio"
                                name="tileLayer"
                                checked={currentTileLayer === option.id}
                                onChange={() => handleTileLayerChange(option.id)}
                                className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <div className="text-gray-700">{option.name}</div>
                                {option.description && (
                                    <div className="text-gray-500 text-xs">{option.description}</div>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Render all layer sections */}
            {renderLayerSection('overlays', 'Overlays')}
            {renderLayerSection('heatmaps', 'Heatmaps')}
            {renderLayerSection('infrastructure', 'Infrastructure')}
            {renderLayerSection('validation', 'Validation')}

            {/* Layer Statistics */}
            <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    <div className="flex justify-between">
                        <span>Active layers:</span>
                        <span className="font-medium">
                            {layerControls.filter(layer => layer.enabled).length}
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Total layers:</span>
                        <span className="font-medium">{layerControls.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayersPanel;