import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format year span as "Apr YYYY – Mar YYYY+1"
function formatYearSpan(startYear: number): string {
  return `Apr ${startYear} – Mar ${startYear + 1}`;
}

// Generate year ranges for the 3-4-3 blocks based on landing date
// Only includes the 10 years immediately before landing year (never landing year itself)
export function generateBlockYearRanges(landingDate: string): {
  blockA: string[]; // Last 3 years before landing
  blockB: string[]; // Previous 4 years  
  blockC: string[]; // Earlier 3 years
  landingSpan: string; // Landing year span for reference
} {
  const date = new Date(landingDate);
  const landingYear = date.getFullYear();
  const landingMonth = date.getMonth() + 1; // 1-12
  
  // Determine landing year span (April 1 start)
  const landingStartYear = landingMonth >= 4 ? landingYear : landingYear - 1;
  const landingSpan = formatYearSpan(landingStartYear);
  
  // Generate 10 years immediately before landing year (reverse chronological order)
  const yearSpans: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const yearStart = landingStartYear - i;
    yearSpans.push(formatYearSpan(yearStart));
  }
  
  // Split into 3-4-3 blocks (most recent first)
  const blockA = yearSpans.slice(0, 3);   // Last 3 years before landing
  const blockB = yearSpans.slice(3, 7);   // Previous 4 years
  const blockC = yearSpans.slice(7, 10);  // Earlier 3 years
  
  return { blockA, blockB, blockC, landingSpan };
}

// Generate days by year mapping for RNOR engine
export function generateDaysByYear(landingDate: string, blockChoices: {
  A: 'rarely' | 'sometimes' | 'frequently' | 'mostly';
  B: 'rarely' | 'sometimes' | 'frequently' | 'mostly';
  C: 'rarely' | 'sometimes' | 'frequently' | 'mostly';
}): { [yearSpan: string]: number } {
  const { blockA, blockB, blockC } = generateBlockYearRanges(landingDate);
  
  // Upper bound mapping
  const sliderToDaysUpperBound = {
    'rarely': 60,
    'sometimes': 120,
    'frequently': 180,
    'mostly': 240
  };
  
  const daysByYear: { [yearSpan: string]: number } = {};
  
  // Apply choices to each block
  blockA.forEach(yearSpan => {
    daysByYear[yearSpan] = sliderToDaysUpperBound[blockChoices.A];
  });
  
  blockB.forEach(yearSpan => {
    daysByYear[yearSpan] = sliderToDaysUpperBound[blockChoices.B];
  });
  
  blockC.forEach(yearSpan => {
    daysByYear[yearSpan] = sliderToDaysUpperBound[blockChoices.C];
  });
  
  return daysByYear;
}
