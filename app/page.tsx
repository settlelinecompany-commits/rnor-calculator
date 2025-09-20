"use client";

import { useState, useMemo, useCallback } from "react";
import { Inputs } from "@/types/rnor";
import { InputsCard } from "@/components/InputsCard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { computePlan } from "@/lib/rnor";

// Default inputs
const defaultInputs: Inputs = {
  landingDate: new Date().toISOString().slice(0, 10),
  region: 'US',
  blocks: {
    A: { choice: 'rarely', hasSpike: false, years: 3 },
    B: { choice: 'rarely', hasSpike: false, years: 4 },
    C: { choice: 'rarely', hasSpike: false, years: 3 },
  },
};

export default function Page() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);

  // Compute plan with throttling
  const plan = useMemo(() => {
    return computePlan(inputs);
  }, [inputs]);

  // Throttled input change handler
  const handleInputsChange = useCallback((newInputs: Inputs) => {
    setInputs(newInputs);
  }, []);

  const handleRecalculate = useCallback(() => {
    // Force recalculation by updating inputs (even if same)
    setInputs({ ...inputs });
  }, [inputs]);

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
        
        {/* Section 1: Inputs */}
        <InputsCard 
          inputs={inputs}
          onInputsChange={handleInputsChange}
          onRecalculate={handleRecalculate}
        />

        {/* Section 2: Results */}
        <div aria-live="polite" aria-label="RNOR calculation results">
          <ResultsPanel plan={plan} />
        </div>
      </div>
    </main>
  );
}
