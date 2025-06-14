// /src/components/LeafletMapComponent.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    getVoltageColor, 
    getVoltageWeight, 
    getVoltageOpacity,
    SlovakiaGridData 
} from '@/types/slovakia-grid';

// Slovakia bounds
const slovakiaBounds = {
    north: 49.6,
    south: 47.7,
    east: 22.6,
    west: 16.8
};

interface LeafletMapComponentProps {
    gridData: SlovakiaGridData | null;
}

const LeafletMapComponent = ({ gridData }: LeafletMapComponentProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const gridLayerRef = useRef<L.LayerGroup | null>(null);

    const createElectricalGrid = () => {
        if (!mapInstanceRef.current || !gridData) return;

        // Clear existing grid layer
        if (gridLayerRef.current) {
            mapInstanceRef.current.removeLayer(gridLayerRef.current);
        }

        gridLayerRef.current = L.layerGroup();

        // Create transmission lines from data
        gridData.transmission_lines.forEach(line => {
            // Convert towers to coordinate array
            const coordinates: [number, number][] = line.towers.map(tower => [tower.lat, tower.lng]);

            // Create the transmission line
            const powerLine = L.polyline(coordinates, {
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
        });

        // Create substations from data
        gridData.substations.forEach(substation => {
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

        mapInstanceRef.current.addLayer(gridLayerRef.current);
    };

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        });

        // Add clean tile layer (CartoDB Positron - minimal style)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 12,
            minZoom: 6
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

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Create grid when data is loaded
    useEffect(() => {
        if (gridData && mapInstanceRef.current) {
            createElectricalGrid();
        }
    }, [gridData]);

    return (
        <div 
            ref={mapRef} 
            className="w-full" 
            style={{ height: '600px', borderRadius: '8px' }} 
        />
    );
};

export default LeafletMapComponent;