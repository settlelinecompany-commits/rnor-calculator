import { Inputs, PlanResult, FYRow, BlockChoice } from '@/types/rnor';
import { generateDaysByYear } from '@/lib/utils';

// Map choices to upper bounds (conservative approach)
const CHOICE_TO_DAYS: Record<BlockChoice, number> = {
  rarely: 59,
  sometimes: 120,
  frequently: 183,
  mostly: 240,
};

// Parse date without timezone drift (treat as UTC date)
function parseUTCDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Get financial year for a date (India FY: Apr 1–Mar 31)
function getFinancialYear(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 1-12
  
  if (month >= 4) {
    // Apr-Dec: current FY
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    // Jan-Mar: previous FY
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

// Calculate days from landing date to end of financial year (inclusive)
function getDaysFromLandingToFYEnd(landingDate: Date): number {
  const landingFY = getFinancialYear(landingDate);
  const fyEndYear = parseInt(landingFY.split('-')[1]) + 2000; // Convert 2-digit to 4-digit year
  const fyEndDate = new Date(Date.UTC(fyEndYear, 2, 31)); // March 31
  const diffTime = fyEndDate.getTime() - landingDate.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1); // +1 for inclusive
}

// Build timeline of 10 prior years + landing year + forward until first ROR
function buildTimeline(inputs: Inputs): FYRow[] {
  const landingDate = parseUTCDate(inputs.landingDate);
  const arrivalFY = getFinancialYear(landingDate);
  const timeline: FYRow[] = [];
  
  // Generate days by year using the new system
  const daysByYear = generateDaysByYear(inputs.landingDate, {
    A: inputs.blocks.A.choice,
    B: inputs.blocks.B.choice,
    C: inputs.blocks.C.choice,
  });
  
  // Convert year spans to FY format for compatibility with existing system
  const fyDaysByYear: { [fy: string]: number } = {};
  Object.entries(daysByYear).forEach(([yearSpan, days]) => {
    // Convert "Apr 2024 – Mar 2025" to "2024-25"
    const startYear = parseInt(yearSpan.split(' ')[1]);
    const fy = `${startYear}-${(startYear + 1).toString().slice(-2)}`;
    fyDaysByYear[fy] = days;
  });
  
  // Build 10 prior FYs using the new data
  const priorFYs: string[] = [];
  let currentFY = arrivalFY;
  
  for (let i = 0; i < 10; i++) {
    currentFY = getPreviousFinancialYear(currentFY);
    priorFYs.unshift(currentFY);
  }
  
  // Add prior FYs with their day estimates
  priorFYs.forEach(fy => {
    const days = fyDaysByYear[fy] || 0;
    
    timeline.push({
      fyLabel: fy,
      daysInIndia: days,
      residentTest: 'NR', // Will be calculated later
      last7Sum: 0, // Will be calculated later
      residentYearsInLast10: 0, // Will be calculated later
      finalStatus: 'NR', // Will be calculated later
    });
  });
  
  // Add landing FY (computed days from landing to Mar 31)
  const landingDays = getDaysFromLandingToFYEnd(landingDate);
  timeline.push({
    fyLabel: arrivalFY,
    daysInIndia: landingDays,
    residentTest: 'NR', // Will be calculated later
    last7Sum: 0, // Will be calculated later
    residentYearsInLast10: 0, // Will be calculated later
    finalStatus: 'NR', // Will be calculated later
  });
  
  // Add next FY (assume resident ~full-year)
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
    // Resident if days >= 182, OR (days >= 60 AND sum of preceding 4 FYs >= 365)
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
    // Last 7 sum (excluding current FY - only preceding 7 FYs)
    const last7Sum = timeline
      .slice(Math.max(0, index - 7), index)
      .reduce((sum, r) => sum + r.daysInIndia, 0);
    row.last7Sum = last7Sum;
    
    // Resident years in last 10 (excluding current FY - only preceding 10 FYs)
    const last10ResidentYears = timeline
      .slice(Math.max(0, index - 10), index)
      .filter(r => r.residentTest === 'Resident').length;
    row.residentYearsInLast10 = last10ResidentYears;
  });
}

// Calculate final status (RNOR vs ROR) and continue until first ROR
function calculateFinalStatus(timeline: FYRow[]): void {
  let foundFirstROR = false;
  
  timeline.forEach((row, index) => {
    if (foundFirstROR) {
      // Stop after first ROR
      return;
    }
    
    if (row.residentTest === 'NR') {
      row.finalStatus = 'NR';
    } else {
      // ROR only if BOTH:
      // 1. Resident in >=2 of last 10 FYs, AND
      // 2. Sum of last 7 FYs days >= 730
      const isROR = row.residentYearsInLast10 >= 2 && row.last7Sum >= 730;
      row.finalStatus = isROR ? 'ROR' : 'RNOR';
      
      if (isROR) {
        foundFirstROR = true;
      }
    }
  });
}

// Find RNOR window (US-India overlay)
function findRNORWindow(timeline: FYRow[], landingDate: Date): { startFY: string; endFY: string } | null {
  const landingYear = landingDate.getUTCFullYear();
  const rnorFYs = timeline.filter(row => row.finalStatus === 'RNOR');
  
  if (rnorFYs.length === 0) return null;
  
  // US resident in landing calendar year, US non-resident from Jan 1 next CY
  const usNonResidentStartYear = landingYear + 1;
  
  // Find intersection where India ∈ {NR, RNOR} AND US = Non-Resident
  const validFYs = rnorFYs.filter(fy => {
    const fyStartYear = parseInt(fy.fyLabel.split('-')[0]);
    return fyStartYear >= usNonResidentStartYear;
  });
  
  if (validFYs.length === 0) return null;
  
  return {
    startFY: validFYs[0].fyLabel,
    endFY: validFYs[validFYs.length - 1].fyLabel,
  };
}

// Generate alerts
function generateAlerts(timeline: FYRow[], landingDate: Date): PlanResult['alerts'] {
  const alerts: PlanResult['alerts'] = [];
  const arrivalFY = getFinancialYear(landingDate);
  const landingRow = timeline.find(row => row.fyLabel === arrivalFY);
  
  if (!landingRow) return alerts;
  
  // Last-7 sum >= 650 and < 730 in landing FY
  if (landingRow.last7Sum >= 650 && landingRow.last7Sum < 730) {
    alerts.push({
      id: 'near-730',
      level: 'warn',
      text: 'You&apos;re approaching the 730-day threshold for ROR status.',
      cta: 'Verify my residency history',
    });
  }
  
  // Resident-years in last-10 >= 2 in landing FY
  if (landingRow.residentYearsInLast10 >= 2) {
    alerts.push({
      id: 'risk-2-of-10',
      level: 'warn',
      text: 'You have 2+ resident years in the last 10, increasing ROR risk.',
      cta: 'Run a residency audit',
    });
  }
  
  // No clean US overlap
  const window = findRNORWindow(timeline, landingDate);
  if (!window) {
    alerts.push({
      id: 'no-overlap',
      level: 'info',
      text: 'No clear US-India overlap window found. Consider timing your return.',
      cta: 'Get a date strategy',
    });
  }
  
  // RNOR extension feasible
  if (landingRow.finalStatus === 'NR' || landingRow.finalStatus === 'RNOR') {
    alerts.push({
      id: 'extension-feasible',
      level: 'info',
      text: `Keep FY ${landingRow.fyLabel} ≤59 days to extend RNOR.`,
      cta: 'Get a travel plan',
    });
  }
  
  return alerts;
}

// Main computation function
export function computePlan(inputs: Inputs): PlanResult {
  const landingDate = parseUTCDate(inputs.landingDate);
  const timeline = buildTimeline(inputs);
  calculateResidentTests(timeline);
  calculateSums(timeline);
  calculateFinalStatus(timeline);
  
  const arrivalFY = getFinancialYear(landingDate);
  const rnorFYs = timeline.filter(row => row.finalStatus === 'RNOR').map(row => row.fyLabel);
  const rorFYs = timeline.filter(row => row.finalStatus === 'ROR').map(row => row.fyLabel);
  const window = findRNORWindow(timeline, landingDate);
  
  const bestTimeToRealizeRSUs = rnorFYs.length > 0 ? 'During RNOR' : 'Not Ideal';
  
  const note = `Based on midpoint estimates: ${inputs.blocks.A.choice} (${CHOICE_TO_DAYS[inputs.blocks.A.choice]} days), ${inputs.blocks.B.choice} (${CHOICE_TO_DAYS[inputs.blocks.B.choice]} days), ${inputs.blocks.C.choice} (${CHOICE_TO_DAYS[inputs.blocks.C.choice]} days). Resident from landing→Mar 31 and full next FY. Last-7 sum: ${timeline[timeline.length - 1].last7Sum} days. Resident years in last 10: ${timeline[timeline.length - 1].residentYearsInLast10}.`;
  
  const alerts = generateAlerts(timeline, landingDate);
  
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
