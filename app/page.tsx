"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Inputs } from "@/types/rnor";
import { InputsCard } from "@/components/InputsCard";
import { ExplainerCard } from "@/components/ExplainerCard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQCard } from "@/components/FAQCard";
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
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Compute plan with throttling
  const plan = useMemo(() => {
    return computePlan(inputs);
  }, [inputs]);

  // Throttled input change handler (150-200ms)
  const handleInputsChange = useCallback((newInputs: Inputs) => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
    
    throttleRef.current = setTimeout(() => {
      setInputs(newInputs);
    }, 150);
  }, []);

  const handleRecalculate = useCallback(() => {
    // Force recalculation by updating inputs (even if same)
    setInputs({ ...inputs });
  }, [inputs]);

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* H1: Your RNOR Settings */}
        <h1 className="text-3xl font-serif tracking-tight">Your RNOR Settings</h1>
        
        {/* Section 1: Inputs Card */}
        <InputsCard 
          inputs={inputs}
          onInputsChange={handleInputsChange}
          onRecalculate={handleRecalculate}
        />

        {/* Section 2: What is RNOR? Explainer Card */}
        <ExplainerCard />

        {/* Section 3: Results */}
        <div aria-live="polite" aria-label="RNOR calculation results">
          <ResultsPanel plan={plan} />
        </div>

        {/* Section 4: FAQ Card */}
        <FAQCard />
      </div>
    </main>
  );
}
