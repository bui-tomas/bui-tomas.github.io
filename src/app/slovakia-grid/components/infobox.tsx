import React from 'react';
import { ChevronRight, Info, AlertTriangle, Lightbulb, FileText } from 'lucide-react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'info' | 'note' | 'tip' | 'warning';
  className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ 
  title, 
  children, 
  icon,
  variant = 'info',
  className = ''
}) => {
  const variantStyles = {
    info: 'border-blue-200 bg-blue-50/50',
    note: 'border-gray-400 bg-gray-50/50', 
    tip: 'border-green-200 bg-green-50/50',
    warning: 'border-gray-400 bg-gray-50/50'
  };

  const iconColors = {
    info: 'text-blue-600',
    note: '',
    tip: 'text-green-600', 
    warning: 'text-amber-600'
  };

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${iconColors[variant]}`}>
          {icon || <Info size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm mb-3 ${iconColors[variant]}`}>
            {title}
          </h3>
          <div className="text-sm space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};