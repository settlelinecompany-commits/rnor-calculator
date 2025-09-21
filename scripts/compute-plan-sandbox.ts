import { computePlan } from '../lib/rnor';
import { generateDaysByYear } from '../lib/utils';
import type { Inputs } from '../types/rnor';

const sample: Inputs = {
  landingDate: '2025-04-16',
  region: 'US',
  blocks: {
    A: { choice: 'rarely', years: 3 },
    B: { choice: 'rarely', years: 4 },
    C: { choice: 'rarely', years: 3 },
  },
};

// Helpful sanity check: see how the slider choices translate into days per FY span.
const daysByYear = generateDaysByYear(sample.landingDate, {
  A: sample.blocks.A.choice,
  B: sample.blocks.B.choice,
  C: sample.blocks.C.choice,
});
console.log('Conservative day estimates per FY span:', daysByYear);

const plan = computePlan(sample);

console.log('\nFull timeline after computePlan():');
console.table(
  plan.timeline.map(row => ({
    FY: row.fyLabel,
    Days: row.daysInIndia,
    ResidentTest: row.residentTest,
    Last7Sum: row.last7Sum,
    ResidentYearsLast10: row.residentYearsInLast10,
    FinalStatus: row.finalStatus,
  })),
);

console.log('\nSummary outputs:');
console.log('Arrival FY:', plan.arrivalFY);
console.log('RNOR years:', plan.rnorYears);
console.log('ROR years:', plan.rorYears);
console.log('RNOR window:', plan.window);
console.log('Alerts:', plan.alerts);
console.log('Note:', plan.note);
