export type RiskLevel = 'Safe' | 'Moderate' | 'Contaminated' | 'Critical';

export type WaterSource =
  | 'River'
  | 'Groundwater'
  | 'Municipal Supply'
  | 'Mixed';

export interface CityWaterData {
  name: string;
  district: string;
  lat: number;
  lng: number;
  source: WaterSource;
  tds: number; // mg/L
  ph: number;
  turbidity: number; // NTU
  fluoride: number; // mg/L
  nitrate: number; // mg/L
  arsenic: number; // mg/L
  risk: RiskLevel;
  reason: string;
  contaminants: string[];
  updated: string; // ISO date
}

export interface StateData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  overallRisk: RiskLevel;
  cities: CityWaterData[];
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  Safe: '#16a34a',
  Moderate: '#eab308',
  Contaminated: '#dc2626',
  Critical: '#7f1d1d',
};

export const RISK_BG: Record<RiskLevel, string> = {
  Safe: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Contaminated: 'bg-red-100 text-red-800 border-red-300',
  Critical: 'bg-red-900 text-red-100 border-red-700',
};

export const SOURCE_LABEL: Record<WaterSource, string> = {
  River: 'River',
  Groundwater: 'Groundwater',
  'Municipal Supply': 'Municipal Supply',
  Mixed: 'Mixed',
};
