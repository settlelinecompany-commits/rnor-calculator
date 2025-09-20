export type BlockChoice = 'rarely' | 'sometimes' | 'frequently' | 'mostly';

export interface BlockInput {
  choice: BlockChoice;
  years: number; // Number of years this block represents
}

export interface Inputs {
  landingDate: string;
  region: 'US' | 'UK' | 'Australia' | 'Singapore' | 'UAE';
  blocks: {
    A: BlockInput; // Last 3 FYs before landing
    B: BlockInput; // Previous 4 FYs
    C: BlockInput; // Previous 3 FYs
  };
}

export type Residency = 'NR' | 'Resident' | 'RNOR' | 'ROR';

export interface FYRow {
  fyLabel: string;
  daysInIndia: number;
  residentTest: 'NR' | 'Resident'; // Whether they passed the basic resident test
  last7Sum: number; // Sum of days in India in last 7 FYs
  residentYearsInLast10: number; // Count of resident years in last 10 FYs
  finalStatus: Residency;
}

export interface PlanResult {
  arrivalFY: string;
  rnorYears: string[];
  rorYears: string[];
  note: string;
  window: { startFY: string; endFY: string } | null;
  timeline: FYRow[];
  bestTimeToRealizeRSUs: 'During RNOR' | 'Not Ideal';
  guardrail: { text: string; capDays: 59 };
  alerts: {
    id: string;
    level: 'info' | 'warn' | 'danger';
    text: string;
    cta: string;
  }[];
}
