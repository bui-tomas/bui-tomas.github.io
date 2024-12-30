'use client'

import React, { useEffect, useRef, useState } from 'react';
import HandDrawnArrow from './arrow';

// floating images
const floatingImages = [
    {
        id: 'image1',
        src: '/images/coffee.jpg', 
        position: { right: '15%', top: '0rem' },
        animation: 'animate-float-medium',
        rotate: '-rotate-6',
        size: 'w-80 h-80',
        hoverRotate: 'hover:-rotate-6'
    },
    {
        id: 'image2',
        src: '/api/placeholder/200/200',
        position: { right: '18%', top: '16rem' },
        animation: 'animate-float-slow',
        rotate: '-rotate-3',
        size: 'w-40 h-40',
        hoverRotate: 'hover:rotate-6'
    },
    {
        id: 'image3',
        src: '/api/placeholder/200/200',
        position: { left: '20%', top: '28rem' },
        animation: 'animate-float-fast',
        rotate: 'rotate-3',
        size: 'w-36 h-36',
        hoverRotate: 'hover:-rotate-3'
    }
];

// floating cards
const cards = [
    {
        id: 'data-science',
        title: 'Data Science Journey',
        description: 'From statistical analysis to machine learning, exploring the depths of data to uncover meaningful patterns and insights.',
        position: { left: '5%', top: '4rem' },
        animation: 'animate-float-slow',
        size: 'max-w-md',
        titleSize: 'text-2xl',
        color: 'text-indigo-900',
    },
    {
        id: 'ml-engineering',
        title: 'ML Engineering',
        description: 'Building and deploying machine learning models that solve real-world problems.',
        position: { right: '15%', top: '16rem' },
        animation: 'animate-float-medium',
        size: 'max-w-sm',
        titleSize: 'text-xl',
        color: 'text-purple-900',
    },
    {
        id: 'creative-computing',
        title: 'Creative Computing',
        description: 'Merging technical skills with creative problem-solving approaches.',
        position: { left: '10%', top: '30rem' },
        animation: 'animate-float-fast',
        size: 'max-w-sm',
        titleSize: 'text-xl',
        color: 'text-pink-900',
    },
    {
        id: 'innovation',
        title: 'Innovation',
        description: 'Always exploring new technologies and approaches.',
        position: { right: '10%', top: '40em' },
        animation: 'animate-float-medium',
        size: 'max-w-xs',
        titleSize: 'text-lg',
        color: 'text-teal-900'
    }
];

const connections = [
    {
        from: 'data-science',
        to: 'ml-engineering',
        color: '#6366f1',
        curvature: 0.3,
        startSide: 'right',
        endSide: 'top'
    },
    {
        from: 'ml-engineering',
        to: 'creative-computing',
        color: '#8b5cf6',
        curvature: -0.4,
        startSide: 'left',
        endSide: 'top'
    },
    {
        from: 'creative-computing',
        to: 'innovation',
        color: '#ec4899',
        curvature: 0.15,
        startSide: 'right',
        endSide: 'top'
    }
];

const FloatingAboutSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const updateDimensions = () => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    setDimensions({
                        width: rect.width,
                        height: rect.height
                    });
                }
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    const getConnectionPoints = (fromId: string, toId: string, startSide: string, endSide: string) => {
        const fromCard = cardRefs.current[fromId];
        const toCard = cardRefs.current[toId];
        const container = containerRef.current;
        
        if (!fromCard || !toCard || !container) {
            return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
        }

        const fromRect = fromCard.getBoundingClientRect();
        const toRect = toCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        let startX, startY, endX, endY;

        // Calculate start point based on startSide
        if (startSide === 'right') {
            startX = fromRect.right - containerRect.left;
            startY = fromRect.top + fromRect.height / 2 - containerRect.top;
        } else if (startSide === 'left') {
            startX = fromRect.left - containerRect.left;
            startY = fromRect.top + fromRect.height / 2 - containerRect.top;
        }

        // Calculate end point based on endSide
        if (endSide === 'top') {
            endX = toRect.left + toRect.width / 2 - containerRect.left;
            endY = toRect.top - containerRect.top;
        }

        return {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY }
        };
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full max-w-6xl mx-auto p-8 min-h-[800px] overflow-hidden"
        >
            {/* Render floating images */}
            {floatingImages.map((image) => (
                <div
                    key={image.id}
                    style={{
                        ...image.position
                    }}
                    className={`absolute ${image.animation}`}
                >
                    <div className={`
                        overflow-hidden rounded-lg shadow-lg
                        transition-all duration-300 ease-in-out
                        ${image.size} ${image.rotate}
                        hover:shadow-xl hover:scale-105 ${image.hoverRotate}
                    `}>
                        <img 
                            src={image.src} 
                            alt="Floating illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            ))}

            {/* Render cards */}
            {cards.map((card) => (
                <div
                    key={card.id}
                    ref={(el: HTMLDivElement | null): void => {
                        cardRefs.current[card.id] = el;
                    }}
                    style={{
                        ...card.position
                    }}
                    className={`absolute ${card.animation}`}
                >
                    <div className={`
                        bg-white p-6 rounded-lg shadow-lg 
                        transition-all duration-300 ease-in-out
                        ${card.size}
                        hover:shadow-xl hover:scale-105 
                    `}>
                        <h3 className={`${card.titleSize} font-bold mb-3 ${card.color}`}>
                            {card.title}
                        </h3>
                        <p className="text-gray-600">{card.description}</p>
                    </div>
                </div>
            ))}

            {/* Render connections */}
            {dimensions.width > 768 && connections.map((connection, index) => {
                const points = getConnectionPoints(
                    connection.from,
                    connection.to,
                    connection.startSide,
                    connection.endSide
                );
                
                const startX = points.start.x ?? 0;
                const startY = points.start.y ?? 0;
                const endX = points.end.x ?? 0;
                const endY = points.end.y ?? 0;

                // Skip rendering if any coordinate is 0 (indicating missing/invalid position)
                if (startX === 0 || startY === 0 || endX === 0 || endY === 0) {
                    return null;
                }

                return (
                    <HandDrawnArrow 
                        key={index}
                        startX={startX}
                        startY={startY}
                        endX={endX}
                        endY={endY}
                        curvature={connection.curvature}
                        color={connection.color}
                        width={3}
                    />
                );
            })}
        </div>
    );
};

export default FloatingAboutSection;