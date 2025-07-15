import { TooltipProps } from ".";

export const LineTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  unit,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-900">{label}</h4>
        <div className="flex-1 h-px bg-[#A27B5C]/20 my-2"></div>
        <div className="space-y-2">
          {payload
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  {entry.color && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                  )}
                  <span className="text-xs">{entry.name}:</span>
                </div>
                <span className="text-xs font-semibold">
                  {entry.value?.toFixed(2)} {unit}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};
