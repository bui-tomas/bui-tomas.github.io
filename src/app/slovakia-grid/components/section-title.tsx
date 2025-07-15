import React from "react";
import { Zap, MapPin, BarChart3 } from "lucide-react";

interface SectionTitleProps {
  id?: string;
  title: string;
}

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'overview': return <BarChart3 className="w-8 h-8" />;
    case 'generation': return <Zap className="w-8 h-8" />;
    case 'transmission': return <MapPin className="w-8 h-8" />;
    default: return <BarChart3 className="w-8 h-8" />;
  }
};

export function SectionTitle({ id, title }: SectionTitleProps) {
  const icon = getIcon(title);
  
  return (
    <div id={id} className={`w-full min-h-32 my-6 bg-gradient-to-r from-amber-500/40 to-orange-500/10 flex items-center justify-start py-8 relative overflow-hidden`}>
      <div className="flex items-center gap-4 mx-12">
        <div className={`text-amber-600`}>
          {icon}
        </div>
        <p className="text-2xl font-bold">{title}</p>
      </div>
    </div>
  );
}