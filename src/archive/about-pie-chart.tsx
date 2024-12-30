'use client'

import React from 'react';

const SkillsPieChart = () => {
  const skills = [
    { name: 'AI/ML', percentage: 35, color: '#FF6B6B' },
    { name: 'Web Dev', percentage: 15, color: '#4ECDC4' },
    { name: 'Data Science', percentage: 30, color: '#45B7D1' },
    { name: 'Other', percentage: 20, color: '#ffcc00ea' }
  ];

  const size = 250;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;

  // Calculate pie segments
  let currentAngle = 0;
  const segments = skills.map(skill => {
    const angle = (skill.percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
    const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
    const endX = centerX + radius * Math.cos((startAngle + angle - 90) * Math.PI / 180);
    const endY = centerY + radius * Math.sin((startAngle + angle - 90) * Math.PI / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return {
      ...skill,
      d: `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
    };
  });

  return (
    <div id="skills-chart" className="flex flex-col items-center gap-2">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#ddd"
          strokeWidth="4"
        />

        {/* Pie segments */}
        {segments.map((segment) => (
          <path
            key={segment.name}
            d={segment.d}
            fill={segment.color}
          >
            <title>{`${segment.name}: ${segment.percentage}%`}</title>
          </path>
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center gap-2"
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-slate-700">
              {skill.name} ({skill.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPieChart;