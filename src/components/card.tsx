import React from 'react';

const ProjectCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full lg:w-1/2">
                        <svg viewBox="0 0 800 400" className="w-full h-auto">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#384640" strokeWidth="0.5" strokeOpacity="0.1" />
                                </pattern>
                            </defs>
                            <rect width="800" height="400" fill="#EFF4F0" />
                            <rect width="800" height="400" fill="url(#grid)" />
                            <line x1="100" y1="300" x2="700" y2="300" stroke="#384640" strokeWidth="2" />
                            <line x1="100" y1="50" x2="100" y2="300" stroke="#384640" strokeWidth="2" />
                            <line x1="100" y1="250" x2="650" y2="100" stroke="#A27B5C" strokeWidth="2" />
                            <line x1="100" y1="100" x2="600" y2="250" stroke="#A27B5C" strokeWidth="2" />
                            <path d="M 200 250 L 400 150 L 500 200 L 300 270 Z" fill="#A27B5C" fillOpacity="0.2" />
                            <circle cx="400" cy="150" r="6" fill="#2C3639" />
                            <text x="720" y="320" fill="#384640" fontSize="16">x₁</text>
                            <text x="70" y="60" fill="#384640" fontSize="16">x₂</text>
                            <text x="380" y="130" fill="#2C3639" fontSize="14">Optimal Point</text>
                        </svg>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Linear Programming Optimizer</h2>
                        <p className="text-gray-600 mb-4">
                            A sophisticated optimization engine that solves complex linear programming problems using the simplex algorithm.
                            Handles multiple constraints and variables to find optimal solutions for resource allocation challenges.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Python</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">NumPy</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Operations Research</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;