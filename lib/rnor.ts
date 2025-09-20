import { Inputs, PlanResult, FYRow } from "@/types/rnor";

// Convert slider choices to per-FY day estimates
function convertBlocksToFYDays(inputs: Inputs): { [fy: string]: number } {
  const landingDate = new Date(inputs.landingDate);
  const landingYear = landingDate.getFullYear();
  
  // Determine FY based on landing date (April 1 start)
  const landingMonth = landingDate.getMonth() + 1; // 1-12
  const landingFY = landingMonth >= 4 ? `${landingYear}-${(landingYear + 1).toString().slice(-2)}` : `${landingYear - 1}-${landingYear.toString().slice(-2)}`;
  
  // Generate 10 FYs before landing
  const fyDays: { [fy: string]: number } = {};
  const landingFYNum = parseInt(landingFY.split('-')[0]);
  
  // Create FY list (10 years before landing)
  const fyList: string[] = [];
  for (let i = 9; i >= 0; i--) {
    const fyYear = landingFYNum - i;
    fyList.push(`${fyYear}-${(fyYear + 1).toString().slice(-2)}`);
  }
  
  // Map slider choices to day estimates
  const choiceToDays = {
    'rarely': 30,
    'sometimes': 90,
    'frequently': 150,
    'mostly': 240
  };
  
  // Apply estimates to each block
  let fyIndex = 0;
  
  // Block C (first 3 FYs)
  for (let i = 0; i < inputs.blocks.C.years; i++) {
    fyDays[fyList[fyIndex]] = choiceToDays[inputs.blocks.C.choice];
    fyIndex++;
  }
  
  // Block B (next 4 FYs)
  for (let i = 0; i < inputs.blocks.B.years; i++) {
    fyDays[fyList[fyIndex]] = choiceToDays[inputs.blocks.B.choice];
    fyIndex++;
  }
  
  // Block A (last 3 FYs)
  for (let i = 0; i < inputs.blocks.A.years; i++) {
    fyDays[fyList[fyIndex]] = choiceToDays[inputs.blocks.A.choice];
    fyIndex++;
  }
  
  // Apply 6+ month spikes (bump closest FY to landing date in each block)
  fyIndex = 0;
  
  // Block C spike
  if (inputs.blocks.C.hasSpike) {
    const spikeIndex = fyIndex + inputs.blocks.C.years - 1; // Closest to landing
    fyDays[fyList[spikeIndex]] = 190; // ≥183 days
  }
  fyIndex += inputs.blocks.C.years;
  
  // Block B spike
  if (inputs.blocks.B.hasSpike) {
    const spikeIndex = fyIndex + inputs.blocks.B.years - 1; // Closest to landing
    fyDays[fyList[spikeIndex]] = 190; // ≥183 days
  }
  fyIndex += inputs.blocks.B.years;
  
  // Block A spike
  if (inputs.blocks.A.hasSpike) {
    const spikeIndex = fyIndex + inputs.blocks.A.years - 1; // Closest to landing
    fyDays[fyList[spikeIndex]] = 190; // ≥183 days
  }
  
  return fyDays;
}

// Generate detailed notes with slider choices and FY bumps
function generateDetailedNotes(inputs: Inputs, fyDays: { [fy: string]: number }): string {
  const choiceLabels = {
    'rarely': 'Rarely (0–60 days/year)',
    'sometimes': 'Sometimes (61–120 days/year)',
    'frequently': 'Often (121–180 days/year)',
    'mostly': 'Mostly (181–240 days/year)'
  };
  
  let notes = "Slider choices per block:\n";
  notes += `• Last 3 FYs: ${choiceLabels[inputs.blocks.A.choice]}`;
  if (inputs.blocks.A.hasSpike) notes += " (with 6+ month spike)";
  notes += "\n";
  
  notes += `• Previous 4 FYs: ${choiceLabels[inputs.blocks.B.choice]}`;
  if (inputs.blocks.B.hasSpike) notes += " (with 6+ month spike)";
  notes += "\n";
  
  notes += `• Earlier 3 FYs: ${choiceLabels[inputs.blocks.C.choice]}`;
  if (inputs.blocks.C.hasSpike) notes += " (with 6+ month spike)";
  notes += "\n\n";
  
  // Find which FYs got the 6+ month bump
  const bumpedFYs = Object.entries(fyDays)
    .filter(([, days]) => days === 190)
    .map(([fy]) => fy);
  
  if (bumpedFYs.length > 0) {
    notes += `FYs with 6+ month bump: ${bumpedFYs.join(', ')}\n\n`;
  }
  
  // Calculate last-7 years total and resident years in last-10
  const fyList = Object.keys(fyDays).sort();
  const last7FYs = fyList.slice(-7);
  const last7Sum = last7FYs.reduce((sum, fy) => sum + fyDays[fy], 0);
  const residentYearsInLast10 = fyList.filter(fy => fyDays[fy] >= 182).length;
  
  notes += `Last-7 years total: ${last7Sum} days\n`;
  notes += `Resident years in last-10: ${residentYearsInLast10}\n\n`;
  
  notes += "Estimates use midpoint values. RNOR eligibility depends on 182-day test and 60/365-day test.";
  
  return notes;
}

export function computePlan(inputs: Inputs): PlanResult {
  const landingDate = new Date(inputs.landingDate);
  const landingYear = landingDate.getFullYear();
  
  // Determine FY based on landing date (April 1 start)
  const landingMonth = landingDate.getMonth() + 1; // 1-12
  const arrivalFY = landingMonth >= 4 ? `${landingYear}-${(landingYear + 1).toString().slice(-2)}` : `${landingYear - 1}-${landingYear.toString().slice(-2)}`;
  
  // Convert blocks to per-FY day estimates
  const fyDays = convertBlocksToFYDays(inputs);
  
  // Generate detailed notes
  const note = generateDetailedNotes(inputs, fyDays);
  
  // Build timeline starting from 10 FYs before landing
  const timeline: FYRow[] = [];
  const fyList = Object.keys(fyDays).sort();
  
  // Add 10 prior FYs
  fyList.forEach((fy, index) => {
    const days = fyDays[fy];
    const residentTest = days >= 182 ? 'Resident' : 'NR';
    
    // Calculate last-7 sum (including this FY)
    const last7Start = Math.max(0, index - 6);
    const last7FYs = fyList.slice(last7Start, index + 1);
    const last7Sum = last7FYs.reduce((sum, fy) => sum + fyDays[fy], 0);
    
    // Calculate resident years in last-10 (including this FY)
    const last10Start = Math.max(0, index - 9);
    const last10FYs = fyList.slice(last10Start, index + 1);
    const residentYearsInLast10 = last10FYs.filter(fy => fyDays[fy] >= 182).length;
    
    // Determine final status
    let finalStatus: 'NR' | 'Resident' | 'RNOR' | 'ROR' = 'NR';
    
    if (residentTest === 'Resident') {
      // Check RNOR vs ROR
      if (residentYearsInLast10 >= 2 && last7Sum >= 730) {
        finalStatus = 'ROR';
      } else {
        finalStatus = 'RNOR';
      }
    }
    
    timeline.push({
      fyLabel: fy,
      daysInIndia: days,
      residentTest,
      last7Sum,
      residentYearsInLast10,
      finalStatus
    });
  });
  
  // Add landing FY (estimate based on landing date)
  const landingFYDays = landingMonth >= 4 ? 
    Math.floor((365 - (landingDate.getTime() - new Date(landingYear, 3, 1).getTime()) / (1000 * 60 * 60 * 24))) :
    Math.floor((new Date(landingYear, 3, 1).getTime() - landingDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const landingResidentTest = landingFYDays >= 182 ? 'Resident' : 'NR';
  const landingLast7Sum = timeline.slice(-7).reduce((sum, row) => sum + row.daysInIndia, 0) + landingFYDays;
  const landingResidentYearsInLast10 = timeline.filter(row => row.residentTest === 'Resident').length + (landingResidentTest === 'Resident' ? 1 : 0);
  
  let landingFinalStatus: 'NR' | 'Resident' | 'RNOR' | 'ROR' = 'NR';
  if (landingResidentTest === 'Resident') {
    if (landingResidentYearsInLast10 >= 2 && landingLast7Sum >= 730) {
      landingFinalStatus = 'ROR';
    } else {
      landingFinalStatus = 'RNOR';
    }
  }
  
  timeline.push({
    fyLabel: arrivalFY,
    daysInIndia: landingFYDays,
    residentTest: landingResidentTest,
    last7Sum: landingLast7Sum,
    residentYearsInLast10: landingResidentYearsInLast10,
    finalStatus: landingFinalStatus
  });
  
  // Add next FY (assume resident ~300 days)
  const nextFY = `${landingYear + 1}-${(landingYear + 2).toString().slice(-2)}`;
  const nextFYDays = 300;
  const nextResidentTest = 'Resident';
  const nextLast7Sum = timeline.slice(-6).reduce((sum, row) => sum + row.daysInIndia, 0) + nextFYDays;
  const nextResidentYearsInLast10 = timeline.filter(row => row.residentTest === 'Resident').length + 1;
  
  let nextFinalStatus: 'NR' | 'Resident' | 'RNOR' | 'ROR' = 'RNOR';
  if (nextResidentYearsInLast10 >= 2 && nextLast7Sum >= 730) {
    nextFinalStatus = 'ROR';
  }
  
  timeline.push({
    fyLabel: nextFY,
    daysInIndia: nextFYDays,
    residentTest: nextResidentTest,
    last7Sum: nextLast7Sum,
    residentYearsInLast10: nextResidentYearsInLast10,
    finalStatus: nextFinalStatus
  });
  
  // Continue until first ROR FY
  let currentFY = landingYear + 2;
  const currentDays = 300;
  let currentLast7Sum = nextLast7Sum;
  let currentResidentYearsInLast10 = nextResidentYearsInLast10;
  
  while (currentResidentYearsInLast10 < 2 || currentLast7Sum < 730) {
    currentFY++;
    const fyLabel = `${currentFY}-${(currentFY + 1).toString().slice(-2)}`;
    
    // Update running totals
    currentLast7Sum = currentLast7Sum - timeline[timeline.length - 7]?.daysInIndia + currentDays;
    currentResidentYearsInLast10 = timeline.slice(-9).filter(row => row.residentTest === 'Resident').length + 1;
    
    let finalStatus: 'NR' | 'Resident' | 'RNOR' | 'ROR' = 'RNOR';
    if (currentResidentYearsInLast10 >= 2 && currentLast7Sum >= 730) {
      finalStatus = 'ROR';
    }
    
    timeline.push({
      fyLabel,
      daysInIndia: currentDays,
      residentTest: 'Resident',
      last7Sum: currentLast7Sum,
      residentYearsInLast10: currentResidentYearsInLast10,
      finalStatus
    });
    
    if (finalStatus === 'ROR') break;
  }
  
  // Extract RNOR and ROR years
  const rnorYears = timeline.filter(row => row.finalStatus === 'RNOR').map(row => row.fyLabel);
  const rorYears = timeline.filter(row => row.finalStatus === 'ROR').map(row => row.fyLabel);
  
  // Find RNOR window (India RNOR/NR AND US Non-Resident overlap)
  let window: { startFY: string; endFY: string } | null = null;
  
  // Assume US resident in landing calendar year, US non-resident from Jan 1 next CY
  const landingCY = landingDate.getFullYear();
  const usNonResidentStart = landingCY + 1;
  
  // Find earliest intersection where India is NR/RNOR AND US is Non-Resident
  for (const row of timeline) {
    if ((row.finalStatus === 'NR' || row.finalStatus === 'RNOR')) {
      const fyYear = parseInt(row.fyLabel.split('-')[0]);
      if (fyYear >= usNonResidentStart) {
        if (!window) {
          window = { startFY: row.fyLabel, endFY: row.fyLabel };
        } else {
          window.endFY = row.fyLabel;
        }
      }
    }
  }
  
  // Generate alerts
  const alerts: PlanResult['alerts'] = [];
  
  // Near 730 days warning
  const last7Sum = timeline.slice(-7).reduce((sum, row) => sum + row.daysInIndia, 0);
  if (last7Sum >= 700 && last7Sum < 730) {
    alerts.push({
      id: 'near-730',
      level: 'warn',
      text: `You're close to the 730-day threshold (${last7Sum} days). Small changes could affect your RNOR status.`,
      cta: 'Verify my residency history'
    });
  }
  
  // 2-of-10 risk
  const residentYearsInLast10 = timeline.filter(row => row.residentTest === 'Resident').length;
  if (residentYearsInLast10 >= 1 && residentYearsInLast10 < 2) {
    alerts.push({
      id: '2-of-10-risk',
      level: 'warn',
      text: `You have ${residentYearsInLast10} resident year in the last 10. One more could trigger ROR status.`,
      cta: 'Run a residency audit'
    });
  }
  
  // Extension tip
  if (rnorYears.length > 0) {
    alerts.push({
      id: 'extension-tip',
      level: 'info',
      text: `To extend RNOR: keep visits under 59 days in FY ${arrivalFY.split('-')[1]}.`,
      cta: 'Get a travel plan'
    });
  }
  
  // No clean US overlap
  if (!window && rnorYears.length > 0) {
    alerts.push({
      id: 'no-us-overlap',
      level: 'warn',
      text: 'No clean US overlap window found. Consider adjusting your return date.',
      cta: 'Get a date strategy'
    });
  }
  
  return {
    arrivalFY,
    rnorYears,
    rorYears,
    note,
    window,
    timeline,
    bestTimeToRealizeRSUs: rnorYears.length > 0 ? 'During RNOR' : 'Not Ideal',
    guardrail: {
      text: `To guarantee NR in FY ${arrivalFY}: ≤59 days.`,
      capDays: 59
    },
    alerts
  };
}
