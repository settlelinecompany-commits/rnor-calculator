import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate financial year ranges for the 3-4-3 blocks based on landing date
export function generateBlockYearRanges(landingDate: string): {
  blockA: string[]; // Last 3 FYs
  blockB: string[]; // Previous 4 FYs  
  blockC: string[]; // Earlier 3 FYs
} {
  const date = new Date(landingDate);
  const landingYear = date.getFullYear();
  const landingMonth = date.getMonth() + 1; // 1-12
  
  // Determine landing FY (April 1 start)
  const landingFY = landingMonth >= 4 
    ? `${landingYear}-${(landingYear + 1).toString().slice(-2)}` 
    : `${landingYear - 1}-${landingYear.toString().slice(-2)}`;
  
  const landingFYNum = parseInt(landingFY.split('-')[0]);
  
  // Generate 10 FYs before landing (going backwards)
  const fyList: string[] = [];
  for (let i = 9; i >= 0; i--) {
    const fyYear = landingFYNum - i;
    fyList.push(`${fyYear}-${(fyYear + 1).toString().slice(-2)}`);
  }
  
  // Map to blocks (3-4-3 structure)
  const blockC = fyList.slice(0, 3);   // First 3 FYs (earliest)
  const blockB = fyList.slice(3, 7);   // Next 4 FYs
  const blockA = fyList.slice(7, 10);  // Last 3 FYs (closest to landing)
  
  return { blockA, blockB, blockC };
}
