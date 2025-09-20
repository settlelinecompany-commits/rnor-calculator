"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Inputs, PlanResult } from "@/types/rnor";
import { InputsCard } from "@/components/InputsCard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { computePlan } from "@/lib/rnor";
import { ExplainerCard } from "@/components/ExplainerCard";
import { FAQCard } from "@/components/FAQCard";
import { Card, CardContent } from "@/components/ui/card";

// Default to today + 1 year
const getDefaultLandingDate = () => {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return nextYear.toISOString().slice(0, 10);
};

const defaultInputs: Inputs = {
  landingDate: getDefaultLandingDate(),
  region: 'US',
  blocks: {
    A: { choice: 'sometimes', years: 3 },
    B: { choice: 'sometimes', years: 4 },
    C: { choice: 'sometimes', years: 3 },
  },
};

export default function Page() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [throttledInputs, setThrottledInputs] = useState<Inputs>(inputs);

  const handleInputsChange = useCallback((newInputs: Inputs) => {
    setInputs(newInputs);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledInputs(inputs);
    }, 150); // 150ms throttle

    return () => {
      clearTimeout(handler);
    };
  }, [inputs]);

  const plan: PlanResult = useMemo(() => computePlan(throttledInputs), [throttledInputs]);

  const handleResetBlocks = useCallback(() => {
    setInputs(prev => ({
      ...prev,
      blocks: {
        A: { choice: 'sometimes', years: 3 },
        B: { choice: 'sometimes', years: 4 },
        C: { choice: 'sometimes', years: 3 },
      },
    }));
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Hero Copy */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
            When are you moving back to India?
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find out if you qualify for a tax-free window (RNOR) — and how to extend it.
          </p>
        </div>

        <InputsCard
          inputs={inputs}
          onInputsChange={handleInputsChange}
          onRecalculate={() => setThrottledInputs(inputs)}
          onResetBlocks={handleResetBlocks}
        />

        {/* Value Card */}
        <Card className="p-5 md:p-6 rounded-2xl shadow-sm">
          <CardContent className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Why this matters</h3>
              <p className="text-neutral-700">
                During RNOR, foreign assets (stocks, RSUs, 401k, property) can be sold tax-free in India. 
                Missing this window could cost you lakhs.
              </p>
              <p className="text-sm text-muted-foreground">
                RNOR doesn&apos;t change US taxes; it prevents Indian tax on certain foreign gains.
              </p>
            </div>
          </CardContent>
        </Card>

        <div aria-live="polite">
          <ResultsPanel plan={plan} />
        </div>

        <ExplainerCard />
        <FAQCard />
      </div>
    </main>
  );
}
