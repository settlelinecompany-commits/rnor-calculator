/**
 * Estimates RNOR (Resident but Not Ordinarily Resident) and ROR (Resident and Ordinarily Resident) years
 * based on landing date and past 7-year India days
 */

export interface RNORResult {
  arrivalFY: string;
  rnorFYs: string[];
  rorFYs: string[];
  assumptionNote: string;
}

/**
 * Gets the financial year for a given date
 * Indian financial year runs from April 1 to March 31
 */
function getFinancialYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  
  // If date is between April and December, it belongs to the current financial year
  // If date is between January and March, it belongs to the previous financial year
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
}

/**
 * Gets the next financial year
 */
function getNextFinancialYear(fy: string): string {
  const [startYear, endYear] = fy.split('-');
  const nextStartYear = parseInt(startYear) + 1;
  const nextEndYear = parseInt(endYear) + 1;
  return `${nextStartYear}-${nextEndYear.toString().slice(-2)}`;
}

/**
 * Estimates RNOR and ROR years based on landing date and past 7-year India days
 * @param landingDate - The date when the person landed in India
 * @param past7yrIndiaDays - Optional number of days spent in India in the past 7 years
 * @returns Object containing arrivalFY, rnorFYs, rorFYs, and assumptionNote
 */
export function estimateRNOR(
  landingDate: Date,
  past7yrIndiaDays?: number
): RNORResult {
  const arrivalFY = getFinancialYear(landingDate);
  
  // Determine number of RNOR years based on past 7-year India days
  // Default: 2 RNOR years
  // If past7yrIndiaDays > 729 (approximately 2 years), then 1 RNOR year
  const numRNORYears = past7yrIndiaDays && past7yrIndiaDays > 729 ? 1 : 2;
  
  // Calculate RNOR years starting from arrival FY
  const rnorFYs: string[] = [];
  let currentFY = arrivalFY;
  
  for (let i = 0; i < numRNORYears; i++) {
    rnorFYs.push(currentFY);
    currentFY = getNextFinancialYear(currentFY);
  }
  
  // Calculate next 2 ROR years after RNOR ends
  const rorFYs: string[] = [];
  for (let i = 0; i < 2; i++) {
    rorFYs.push(currentFY);
    currentFY = getNextFinancialYear(currentFY);
  }
  
  // Generate assumption note
  const assumptionNote = past7yrIndiaDays && past7yrIndiaDays > 729
    ? `Based on ${past7yrIndiaDays} days in India in the past 7 years (>729 days), assuming 1 RNOR year followed by 2 ROR years.`
    : `Based on ${past7yrIndiaDays ? past7yrIndiaDays : 'unknown'} days in India in the past 7 years (≤729 days), assuming 2 RNOR years followed by 2 ROR years.`;
  
  return {
    arrivalFY,
    rnorFYs,
    rorFYs,
    assumptionNote
  };
}
