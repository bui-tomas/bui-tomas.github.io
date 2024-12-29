'use client'

import React, { useState, useEffect } from 'react';
import { Database, FileSearch, Microscope, Brain, Rocket, LucideIcon } from 'lucide-react';

interface Stage {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface StageIconProps {
  stage: Stage;
  index: number;
  activeStage: number;
  setActiveStage: (index: number) => void;
}

const StageIcon: React.FC<StageIconProps> = ({ stage, index, activeStage, setActiveStage }) => (
  <div
    className="relative z-10 flex flex-col items-center"
    onMouseEnter={() => setActiveStage(index)}
  >
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 
      ${index === activeStage ? 'bg-gradient-to-r ' + stage.color : 'bg-gray-100'}`}
    >
      <stage.icon
        size={24}
        className={index === activeStage ? 'text-white' : 'text-gray-400'}
      />
    </div>
    <div className="mt-2 text-sm font-medium text-gray-600 text-center">
      {stage.title}
    </div>
  </div>
);

const DataJourney: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  
  const stages: Stage[] = [
    {
      icon: Database,
      title: "Data Collection",
      description: "My journey began with a curiosity about patterns in data. From studying mathematics and statistics, I learned that every dataset tells a story waiting to be discovered.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: FileSearch,
      title: "Preprocessing",
      description: "Through academic projects and personal exploration, I developed a meticulous approach to data cleaning and preparation. Every detail matters in building reliable analyses.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Microscope,
      title: "Analysis",
      description: "My background in mathematics equipped me with the tools to dive deep into data. I love uncovering hidden insights and finding connections others might miss.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Brain,
      title: "Modeling",
      description: "Combining statistical knowledge with programming skills, I learned to build models that not only predict but help understand the underlying patterns.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Rocket,
      title: "Deployment",
      description: "Now, I'm focused on turning insights into impact. Every project is an opportunity to create solutions that make a real difference.",
      color: "from-amber-500 to-orange-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg my-24">
      <div className="flex flex-col gap-8">
        {/* Timeline visualization */}
        <div className="relative">
          {/* Mobile Layout (3-2 grid) */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stages.slice(0, 3).map((stage, index) => (
                <StageIcon
                  key={index}
                  stage={stage}
                  index={index}
                  activeStage={activeStage}
                  setActiveStage={setActiveStage}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {stages.slice(3).map((stage, index) => (
                <StageIcon
                  key={index + 3}
                  stage={stage}
                  index={index + 3}
                  activeStage={activeStage}
                  setActiveStage={setActiveStage}
                />
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center mb-8">
            {stages.map((stage, index) => (
              <StageIcon
                key={index}
                stage={stage}
                index={index}
                activeStage={activeStage}
                setActiveStage={setActiveStage}
              />
            ))}
            {/* Connecting line for desktop */}
            <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-100 -z-10" />
            <div
              className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 -z-10"
              style={{
                width: `${((activeStage + 1) * 100) / stages.length}%`,
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 text-center transition-all duration-500">
          <div className="min-h-[100px] pt-2 pb-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              {stages[activeStage].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataJourney;