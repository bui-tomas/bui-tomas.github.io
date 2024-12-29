import React from 'react';

interface HandDrawnArrowProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    curvature?: number;
    width?: number;
    color?: string;
    className?: string;
}

const HandDrawnArrow: React.FC<HandDrawnArrowProps> = ({
    startX,
    startY,
    endX,
    endY,
    curvature = 0.3,
    width = 2,
    color = "#374151",
    className = "",
}) => {
    // Calculate the total width and height needed for the SVG
    const padding = 50; // Padding to ensure the entire arrow is visible
    const minX = Math.min(startX, endX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = Math.max(startY, endY) + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    // Adjust coordinates relative to SVG viewbox
    const relStartX = startX - minX;
    const relStartY = startY - minY;
    const relEndX = endX - minX;
    const relEndY = endY - minY;

    // Calculate control points for the curve
    const midX = (relStartX + relEndX) / 2;
    const midY = (relStartY + relEndY) / 2;
    const curveX = midX + (relEndY - relStartY) * curvature;
    const curveY = midY - (relEndX - relStartX) * curvature;

    // Calculate arrow points
    const angle = Math.atan2(relEndY - curveY, relEndX - curveX);
    const arrowLength = 20;

    const arrow1X = relEndX - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrow1Y = relEndY - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrow2X = relEndX - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrow2Y = relEndY - arrowLength * Math.sin(angle + Math.PI / 6);

    // Add slight randomness
    const jitter = (magnitude: number) => (Math.random() - 0.5) * magnitude;

    const mainPath = `
        M ${relStartX + jitter(2)} ${relStartY + jitter(2)}
        Q ${curveX + jitter(4)} ${curveY + jitter(4)}, ${relEndX + jitter(2)} ${relEndY + jitter(2)}
    `;

    const arrowPath = `
        M ${relEndX} ${relEndY}
        L ${arrow1X + jitter(2)} ${arrow1Y + jitter(2)}
        M ${relEndX} ${relEndY}
        L ${arrow2X + jitter(2)} ${arrow2Y + jitter(2)}
    `;

    return (
        <svg 
            className={`absolute ${className}`}
            style={{ 
                left: minX,
                top: minY,
                width: svgWidth,
                height: svgHeight,
            }}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
            <g>
                <path
                    d={mainPath}
                    fill="none"
                    stroke={color}
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        animation: 'draw-line 1.5s ease-out forwards',
                    }}
                />
                <path
                    d={arrowPath}
                    fill="none"
                    stroke={color}
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        animation: 'draw-line 0.5s ease-out 1s forwards',
                    }}
                />
            </g>
            <style>
                {`
                @keyframes draw-line {
                    from {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 1000;
                    }
                    to {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 0;
                    }
                }
                `}
            </style>
        </svg>
    );
};

export default HandDrawnArrow;