import { Inputs, PlanResult, FYRow, BlockChoice } from '@/types/rnor';

// Map choices to day midpoints
const CHOICE_TO_DAYS: Record<BlockChoice, number> = {
  rarely: 30,
  sometimes: 90,
  frequently: 150,
  mostly: 240,
};

// Get financial year for a date
function getFinancialYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
}

// Get next financial year
function getNextFinancialYear(fy: string): string {
  const [startYear, endYear] = fy.split('-');
  const nextStartYear = parseInt(startYear) + 1;
  const nextEndYear = parseInt(endYear) + 1;
  return `${nextStartYear}-${nextEndYear.toString().slice(-2)}`;
}

// Get previous financial year
function getPreviousFinancialYear(fy: string): string {
  const [startYear, endYear] = fy.split('-');
  const prevStartYear = parseInt(startYear) - 1;
  const prevEndYear = parseInt(endYear) - 1;
  return `${prevStartYear}-${prevEndYear.toString().slice(-2)}`;
}

// Calculate days from landing date to end of financial year
function getDaysFromLandingToFYEnd(landingDate: Date): number {
  const landingFY = getFinancialYear(landingDate);
  const fyEndDate = new Date(parseInt(landingFY.split('-')[1]), 2, 31); // March 31
  const diffTime = fyEndDate.getTime() - landingDate.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

// Build timeline of 10 prior FYs + landing FY + forward
function buildTimeline(inputs: Inputs): FYRow[] {
  const landingDate = new Date(inputs.landingDate);
  const arrivalFY = getFinancialYear(landingDate);
  const timeline: FYRow[] = [];
  
  // Build 10 prior FYs
  const priorFYs: string[] = [];
  let currentFY = arrivalFY;
  
  for (let i = 0; i < 10; i++) {
    currentFY = getPreviousFinancialYear(currentFY);
    priorFYs.unshift(currentFY);
  }
  
  // Map block choices to FYs
  const blockAFYs = priorFYs.slice(7, 10); // Last 3 FYs before landing
  const blockBFYs = priorFYs.slice(3, 7);  // Previous 4 FYs
  const blockCFYs = priorFYs.slice(0, 3);  // Previous 3 FYs
  
  // Calculate days for each FY
  priorFYs.forEach(fy => {
    let days = 0;
    
    // Determine which block this FY belongs to
    if (blockAFYs.includes(fy)) {
      days = CHOICE_TO_DAYS[inputs.blocks.A.choice];
      if (inputs.blocks.A.hasSpike) {
        days += 210; // Add spike
      }
    } else if (blockBFYs.includes(fy)) {
      days = CHOICE_TO_DAYS[inputs.blocks.B.choice];
      if (inputs.blocks.B.hasSpike) {
        days += 210; // Add spike
      }
    } else if (blockCFYs.includes(fy)) {
      days = CHOICE_TO_DAYS[inputs.blocks.C.choice];
      if (inputs.blocks.C.hasSpike) {
        days += 210; // Add spike
      }
    }
    
    // Cap at 365 days
    days = Math.min(days, 365);
    
    timeline.push({
      fyLabel: fy,
      daysInIndia: days,
      residentTest: 'NR', // Will be calculated later
      last7Sum: 0, // Will be calculated later
      residentYearsInLast10: 0, // Will be calculated later
      finalStatus: 'NR', // Will be calculated later
    });
  });
  
  // Add landing FY
  const landingDays = getDaysFromLandingToFYEnd(landingDate);
  timeline.push({
    fyLabel: arrivalFY,
    daysInIndia: landingDays,
    residentTest: 'NR', // Will be calculated later
    last7Sum: 0, // Will be calculated later
    residentYearsInLast10: 0, // Will be calculated later
    finalStatus: 'NR', // Will be calculated later
  });
  
  // Add next FY (assume resident)
  const nextFY = getNextFinancialYear(arrivalFY);
  timeline.push({
    fyLabel: nextFY,
    daysInIndia: 300, // Assume resident
    residentTest: 'NR', // Will be calculated later
    last7Sum: 0, // Will be calculated later
    residentYearsInLast10: 0, // Will be calculated later
    finalStatus: 'NR', // Will be calculated later
  });
  
  return timeline;
}

// Calculate resident test for each FY
function calculateResidentTests(timeline: FYRow[]): void {
  timeline.forEach((row, index) => {
    // Resident if days >= 182 OR (days >= 60 AND preceding 4 FYs total >= 365)
    const days = row.daysInIndia;
    let isResident = days >= 182;
    
    if (!isResident && days >= 60) {
      // Check preceding 4 FYs
      const preceding4Sum = timeline
        .slice(Math.max(0, index - 4), index)
        .reduce((sum, r) => sum + r.daysInIndia, 0);
      
      isResident = preceding4Sum >= 365;
    }
    
    row.residentTest = isResident ? 'Resident' : 'NR';
  });
}

// Calculate last 7 sum and resident years in last 10
function calculateSums(timeline: FYRow[]): void {
  timeline.forEach((row, index) => {
    // Last 7 sum (including current FY)
    const last7Sum = timeline
      .slice(Math.max(0, index - 6), index + 1)
      .reduce((sum, r) => sum + r.daysInIndia, 0);
    row.last7Sum = last7Sum;
    
    // Resident years in last 10 (including current FY)
    const last10ResidentYears = timeline
      .slice(Math.max(0, index - 9), index + 1)
      .filter(r => r.residentTest === 'Resident').length;
    row.residentYearsInLast10 = last10ResidentYears;
  });
}

// Calculate final status (RNOR vs ROR)
function calculateFinalStatus(timeline: FYRow[]): void {
  timeline.forEach((row) => {
    if (row.residentTest === 'NR') {
      row.finalStatus = 'NR';
    } else {
      // ROR only if BOTH:
      // 1. Resident in >=2 of last 10 FYs, AND
      // 2. Sum of last 7 FYs days >= 730
      const isROR = row.residentYearsInLast10 >= 2 && row.last7Sum >= 730;
      row.finalStatus = isROR ? 'ROR' : 'RNOR';
    }
  });
}

// Find RNOR window
function findRNORWindow(timeline: FYRow[]): { startFY: string; endFY: string } | null {
  const rnorFYs = timeline.filter(row => row.finalStatus === 'RNOR');
  
  if (rnorFYs.length === 0) return null;
  
  return {
    startFY: rnorFYs[0].fyLabel,
    endFY: rnorFYs[rnorFYs.length - 1].fyLabel,
  };
}

// Generate alerts
function generateAlerts(timeline: FYRow[]): PlanResult['alerts'] {
  const alerts: PlanResult['alerts'] = [];
  const latestRow = timeline[timeline.length - 1];
  
  // Last-7 sum >= 650 warning
  if (latestRow.last7Sum >= 650) {
    alerts.push({
      id: 'near-730',
      level: 'warn',
      text: 'You&apos;re approaching the 730-day threshold for ROR status.',
      cta: 'Verify my residency history',
    });
  }
  
  // Resident-years-in-last-10 >= 2 warning
  if (latestRow.residentYearsInLast10 >= 2) {
    alerts.push({
      id: 'risk-2-of-10',
      level: 'warn',
      text: 'You have 2+ resident years in the last 10, increasing ROR risk.',
      cta: 'Run a residency audit',
    });
  }
  
  // No clean US overlap info
  const rnorFYs = timeline.filter(row => row.finalStatus === 'RNOR');
  if (rnorFYs.length === 0) {
    alerts.push({
      id: 'no-overlap',
      level: 'info',
      text: 'No clear RNOR window found. Consider timing your return.',
      cta: 'Get a date strategy',
    });
  }
  
  // Extension feasible info
  if (latestRow.finalStatus === 'NR' || latestRow.finalStatus === 'RNOR') {
    alerts.push({
      id: 'extension-feasible',
      level: 'info',
      text: `Keep FY ${latestRow.fyLabel} ≤59 days to guarantee NR status.`,
      cta: 'Get a travel plan',
    });
  }
  
  return alerts;
}

// Main computation function
export function computePlan(inputs: Inputs): PlanResult {
  const timeline = buildTimeline(inputs);
  calculateResidentTests(timeline);
  calculateSums(timeline);
  calculateFinalStatus(timeline);
  
  const arrivalFY = getFinancialYear(new Date(inputs.landingDate));
  const rnorFYs = timeline.filter(row => row.finalStatus === 'RNOR').map(row => row.fyLabel);
  const rorFYs = timeline.filter(row => row.finalStatus === 'ROR').map(row => row.fyLabel);
  const window = findRNORWindow(timeline);
  
  const bestTimeToRealizeRSUs = rnorFYs.length > 0 ? 'During RNOR' : 'Not Ideal';
  
  const note = `Based on midpoint estimates: ${inputs.blocks.A.choice} (${CHOICE_TO_DAYS[inputs.blocks.A.choice]} days), ${inputs.blocks.B.choice} (${CHOICE_TO_DAYS[inputs.blocks.B.choice]} days), ${inputs.blocks.C.choice} (${CHOICE_TO_DAYS[inputs.blocks.C.choice]} days). Last-7 sum: ${timeline[timeline.length - 1].last7Sum} days. Resident years in last 10: ${timeline[timeline.length - 1].residentYearsInLast10}.`;
  
  const alerts = generateAlerts(timeline);
  
  return {
    arrivalFY,
    rnorYears: rnorFYs,
    rorYears: rorFYs,
    note,
    window,
    timeline,
    bestTimeToRealizeRSUs,
    guardrail: {
      text: `To guarantee NR in FY ${timeline[timeline.length - 1].fyLabel}: ≤59 days`,
      capDays: 59,
    },
    alerts,
  };
}
