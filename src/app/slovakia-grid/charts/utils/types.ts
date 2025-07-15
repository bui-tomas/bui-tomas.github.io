export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    dataKey: string;
    payload: any;
  }>;
  label?: string | number;
  unit?: string;
}
