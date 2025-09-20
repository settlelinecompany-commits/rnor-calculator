// Test scenarios for RNOR calculator
const { computePlan } = require('./lib/rnor.ts');

// Sanity scenario: Landing date 2025-09-20, Blocks A/B/C = Rarely, no spikes
const sanityInputs = {
  landingDate: '2025-09-20',
  region: 'US',
  blocks: {
    A: { choice: 'rarely', hasSpike: false, years: 3 },
    B: { choice: 'rarely', hasSpike: false, years: 4 },
    C: { choice: 'rarely', hasSpike: false, years: 3 },
  },
};

console.log('Testing sanity scenario...');
console.log('Inputs:', sanityInputs);

try {
  const result = computePlan(sanityInputs);
  console.log('\nResults:');
  console.log('Arrival FY:', result.arrivalFY);
  console.log('RNOR Years:', result.rnorYears);
  console.log('ROR Years:', result.rorYears);
  console.log('Window:', result.window);
  console.log('Timeline (last 4):', result.timeline.slice(-4).map(r => `${r.fyLabel} (${r.finalStatus})`));
} catch (error) {
  console.error('Error:', error.message);
}
