'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { getVoltageColor, getVoltageWeight, getVoltageOpacity, SlovakiaGridData } from '@/types/slovakia-grid';

// Dynamically import Leaflet to avoid SSR issues
const L = dynamic(() => import('leaflet'), { ssr: false });

// Slovakia bounds
const slovakiaBounds = {
    north: 49.6,
    south: 47.7,
    east: 22.6,
    west: 16.8
};

interface MapProps {
    className?: string;
}

const SlovakiaMap = ({ className = '' }: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const gridLayerRef = useRef<L.LayerGroup | null>(null);
    const [gridData, setGridData] = useState<SlovakiaGridData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Load grid data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                console.log('Attempting to fetch grid data...');
                // Fix the fetch URL to point to the correct path
                const response = await fetch('/data/slovakia-grid.json');
                if (!response.ok) {
                    throw new Error(`Failed to load grid data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Grid data loaded:', {
                    transmission_lines: data.transmission_lines?.length || 0,
                    substations: data.substations?.length || 0,
                    sample_data: data
                });
                setGridData(data as SlovakiaGridData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load grid data');
                console.error('Error loading grid data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const createElectricalGrid = async () => {
        if (!mapInstanceRef.current || !gridData) {
            console.log('Cannot create grid - missing map or data:', {
                hasMap: !!mapInstanceRef.current,
                hasData: !!gridData
            });
            return;
        }

        console.log('Creating electrical grid with data:', {
            transmission_lines: gridData.transmission_lines?.length || 0,
            substations: gridData.substations?.length || 0
        });

        // Dynamically import Leaflet to avoid SSR issues
        const L = await import('leaflet');

        // Clear existing grid layer
        if (gridLayerRef.current) {
            mapInstanceRef.current.removeLayer(gridLayerRef.current);
        }

        gridLayerRef.current = L.layerGroup();

        // Create transmission lines from data
        if (gridData.transmission_lines) {
            gridData.transmission_lines.forEach((line, index) => {
                console.log(`Processing transmission line ${index + 1}:`, line.name, line.towers?.length || 0, 'towers');
                
                if (!line.towers || line.towers.length < 2) {
                    console.warn(`Skipping line ${line.name} - insufficient towers`);
                    return;
                }

                // Log first and last tower coordinates to check if they're in Slovakia
                const firstTower = line.towers[0];
                const lastTower = line.towers[line.towers.length - 1];
                console.log('First tower:', firstTower);
                console.log('Last tower:', lastTower);
                
                // Check if coordinates are within Slovakia bounds
                const isInSlovakia = line.towers.some(tower => 
                    tower.lat >= slovakiaBounds.south && 
                    tower.lat <= slovakiaBounds.north &&
                    tower.lng >= slovakiaBounds.west && 
                    tower.lng <= slovakiaBounds.east
                );
                console.log('Line has towers in Slovakia bounds:', isInSlovakia);

                // Convert towers to coordinate array
                const coordinates: [number, number][] = line.towers.map(tower => [tower.lat, tower.lng]);
                console.log('Coordinates array length:', coordinates.length);
                console.log('Sample coordinates:', coordinates.slice(0, 3));

                // Create the transmission line
                const powerLine = L.polyline(coordinates, {
                    color: getVoltageColor(line.voltage),
                    weight: getVoltageWeight(line.voltage),
                    opacity: getVoltageOpacity(line.voltage)
                });

                console.log('Created polyline with style:', {
                    color: getVoltageColor(line.voltage),
                    weight: getVoltageWeight(line.voltage),
                    opacity: getVoltageOpacity(line.voltage)
                });

                // Add tooltip with line information
                const tooltipContent = `
                    <strong>${line.name}</strong><br/>
                    ${line.voltage}<br/>
                    Operator: ${line.operator}<br/>
                    Status: ${line.status}
                    ${line.description ? `<br/>${line.description}` : ''}
                `;

                powerLine.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'center',
                    className: 'power-tooltip'
                });

                gridLayerRef.current!.addLayer(powerLine);
                console.log('Added power line to grid layer');
            });
        }

        // Create substations from data
        if (gridData.substations) {
            gridData.substations.forEach((substation, index) => {
                console.log(`Processing substation ${index + 1}:`, substation.name);
                
                const marker = L.circleMarker([substation.lat, substation.lng], {
                    radius: 8,
                    fillColor: '#2563EB',
                    color: '#1E40AF',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                const tooltipContent = `
                    <strong>${substation.name}</strong><br/>
                    Type: ${substation.type}<br/>
                    Voltages: ${substation.voltage_levels.join(', ')}<br/>
                    Operator: ${substation.operator}
                `;

                marker.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'top',
                    className: 'power-tooltip'
                });

                gridLayerRef.current!.addLayer(marker);
            });
        }

        console.log('Adding grid layer to map...');
        mapInstanceRef.current.addLayer(gridLayerRef.current);
        console.log('Grid creation completed');
    };

    useEffect(() => {
        if (!mapRef.current || typeof window === 'undefined') return;

        const initMap = async () => {
            // Dynamically import Leaflet and CSS
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            // Initialize map
            mapInstanceRef.current = L.map(mapRef.current!, {
                zoomControl: false,
                attributionControl: false,
                zoomSnap: 0.50
            });

            // Add clean tile layer (CartoDB Positron - minimal style)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors © CARTO',
                subdomains: 'abcd',
                maxZoom: 20,
                minZoom: 8
            }).addTo(mapInstanceRef.current);

            // Set initial view to Slovakia with restricted bounds
            const bounds: L.LatLngBoundsExpression = [
                [slovakiaBounds.south, slovakiaBounds.west],
                [slovakiaBounds.north, slovakiaBounds.east]
            ];
            
            // Set maximum bounds to prevent panning outside Slovakia
            mapInstanceRef.current.setMaxBounds([
                [47.0, 16.0], // Extended southwest for some buffer
                [50.2, 23.0]  // Extended northeast for some buffer
            ]);
            
            mapInstanceRef.current.fitBounds(bounds, {
                padding: [20, 20]
            });

            // Add custom CSS for tooltips
            const style = document.createElement('style');
            style.textContent = `
                .power-tooltip {
                    background: rgba(0, 0, 0, 0.9) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 4px !important;
                    font-size: 12px !important;
                    padding: 6px 10px !important;
                    font-family: monospace !important;
                }
                
                .power-tooltip::before {
                    border-top-color: rgba(0, 0, 0, 0.9) !important;
                }
            `;
            document.head.appendChild(style);

            // Mark map as ready
            console.log('Map initialization completed, setting mapReady to true');
            setMapReady(true);
        };

        initMap();

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            setMapReady(false);
        };
    }, []);

    // Create grid when both data and map are ready
    useEffect(() => {
        if (gridData && mapReady && mapInstanceRef.current) {
            console.log('Both grid data and map are ready, creating grid...');
            createElectricalGrid();
        } else {
            console.log('Grid creation waiting for:', {
                hasGridData: !!gridData,
                mapReady: mapReady,
                hasMapInstance: !!mapInstanceRef.current
            });
        }
    }, [gridData, mapReady]);

    if (error) {
        return (
            <div className={`w-full ${className}`}>
                <div 
                    className="w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-700" 
                    style={{ height: '600px' }}
                >
                    <div className="text-center">
                        <h3 className="font-semibold mb-2">Error Loading Map</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading grid data...</p>
                    </div>
                </div>
            )}
            <div 
                ref={mapRef} 
                className="w-full" 
                style={{ height: '600px', borderRadius: '8px' }} 
            />
        </div>
    );
};

export default SlovakiaMap;