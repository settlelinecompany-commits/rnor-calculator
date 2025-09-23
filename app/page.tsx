"use client";

import { useState, useMemo, useCallback } from "react";
import { Inputs, PlanResult } from "@/types/rnor";
import { InputsCard } from "@/components/InputsCard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { Timeline } from "@/components/Timeline";
import { computePlan } from "@/lib/rnor";
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

  const handleInputsChange = useCallback((newInputs: Inputs) => {
    setInputs(newInputs);
  }, []);

  const plan: PlanResult = useMemo(() => computePlan(inputs), [inputs]);

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

  const scrollToResults = () => {
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Hero Copy */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
            When are you moving back to India?
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find out if you qualify for a tax-free window (RNOR) — and how to extend it.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Inputs (65-70%) */}
          <div className="lg:col-span-2 space-y-6">
            <InputsCard
              inputs={inputs}
              onInputsChange={handleInputsChange}
              onResetBlocks={handleResetBlocks}
            />
            
            {/* Auto-update helper */}
            <p className="text-sm text-muted-foreground text-center lg:text-left">
              Calculations update automatically.
            </p>
          </div>

          {/* Right Column - Compact Explainer (30-35%) */}
          <div className="lg:col-span-1">
            <Card className="p-4 rounded-2xl shadow-sm h-fit">
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Why your return date matters</h3>
                  <p className="text-sm text-muted-foreground">
                    Your RNOR years are a temporary tax-free window in India for certain foreign gains.
                  </p>
                </div>

                {/* Color Legend */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>NR — Non-Resident</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>RNOR — Resident but Not Ordinarily Resident</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>ROR — Resident and Ordinarily Resident</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These colors match the timeline below.
                  </p>
                </div>

                {/* Outcome Rows */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span>💰</span>
                      <span>Best years to realize foreign gains</span>
                    </span>
                    <span className="font-medium text-green-600">During RNOR</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>Foreign income taxed in India</span>
                    </span>
                    <span className="font-medium text-green-600">Lower</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span>📈</span>
                      <span>Capital gains on foreign assets</span>
                    </span>
                    <span className="font-medium text-green-600">Tax-free</span>
                  </div>
                </div>

                {/* Primary Action */}
                <button
                  onClick={scrollToResults}
                  className="w-full mt-4 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  See your RNOR years →
                </button>
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card className="p-4 rounded-2xl shadow-sm">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">When is it safe to sell?</h3>
                <Timeline 
                  items={plan.timeline.map(row => ({
                    label: row.fyLabel,
                    status: row.finalStatus === 'NR' || row.finalStatus === 'RNOR' ? 'NR' : 'ROR'
                  }))} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        <div id="results" aria-live="polite">
          <ResultsPanel plan={plan} />
        </div>

        <FAQCard />
      </div>
    </main>
  );
}
