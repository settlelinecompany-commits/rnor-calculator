export type BlockChoice = 'rarely' | 'sometimes' | 'frequently' | 'mostly';

export interface BlockInput {
  choice: BlockChoice;
  hasSpike: boolean;
  years: number;
}

export interface Inputs {
  landingDate: string;
  region: 'US' | 'UK' | 'Australia' | 'Singapore' | 'UAE';
  blocks: {
    A: BlockInput;
    B: BlockInput;
    C: BlockInput;
  };
}

export type Residency = 'NR' | 'Resident' | 'RNOR' | 'ROR';

export interface FYRow {
  fyLabel: string;
  daysInIndia: number;
  residentTest: 'NR' | 'Resident';
  last7Sum: number;
  residentYearsInLast10: number;
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
