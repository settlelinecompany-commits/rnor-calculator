"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computePlan } from "@/lib/rnor";
import { Timeline } from "@/components/Timeline";
import { Inputs } from "@/types/rnor";

function ResultsContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const d7 = searchParams.get('d7');

  // Create inputs from URL parameters
  const inputs = useMemo((): Inputs => {
    return {
      landingDate: date || new Date().toISOString().slice(0, 10),
      region: 'US',
      blocks: {
        A: { choice: 'rarely', hasSpike: false, years: 3 },
        B: { choice: 'rarely', hasSpike: false, years: 4 },
        C: { choice: 'rarely', hasSpike: false, years: 3 },
      },
    };
  }, [date, d7]);

  // Calculate RNOR results using the computePlan function
  const plan = useMemo(() => {
    return computePlan(inputs);
  }, [inputs]);

  // If no parameters provided, show error message
  if (!date) {
    return (
      <main className="min-h-screen bg-[#f6f0e8] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Missing Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-600">
                Go back and enter your landing date.
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Your RNOR Analysis</h1>
          <p className="text-neutral-700">
            Based on your landing date: <strong>{new Date(date).toLocaleDateString()}</strong>
            {d7 && <span> and {d7} days in India (past 7 years)</span>}
          </p>
        </div>

        {/* Results Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">Arrival FY</div>
                  <div className="text-2xl font-semibold">{plan.arrivalFY}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">RNOR Years</div>
                  <div className="text-2xl font-semibold">{plan.rnorYears.length}</div>
                  <div className="text-xs text-neutral-600 mt-1">{plan.rnorYears.join(', ')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">ROR Years</div>
                  <div className="text-2xl font-semibold">{plan.rorYears.length}</div>
                  <div className="text-xs text-neutral-600 mt-1">{plan.rorYears.join(', ')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">Best year to sell RSUs</div>
                  <div className="text-2xl font-semibold">During RNOR</div>
                </CardContent>
              </Card>
            </div>
            
            {/* RNOR Window */}
            {plan.window && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="text-sm text-green-800 mb-1">YOUR RNOR WINDOW</div>
                <div className="text-2xl font-semibold text-green-900">
                  {plan.window.startFY} to {plan.window.endFY}
                </div>
              </div>
            )}
            
            {/* Assumption Note */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> {plan.note}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Timeline Component */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Residency Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline timeline={plan.timeline} />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to optimize your tax strategy?</h3>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Get personalized advice from our certified tax professionals. 
                {"We'll help you maximize your RNOR benefits and plan your financial moves strategically."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => (window.location.href = "/book")}
                  className="px-8"
                >
                  Talk to a CA (Free 15-min)
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="px-8"
                >
                  Back to Calculator
                </Button>
              </div>
              <p className="text-xs text-neutral-500">
                Indicative only. We confirm your exact RNOR status on the consultation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f6f0e8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your RNOR analysis...</p>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
