"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { computePlan } from "@/lib/rnor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/Timeline";
import { Calendar, TrendingUp } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');

  const plan = useMemo(() => {
    if (!date) return null;
    
    // Create inputs object for computePlan
    const inputs = {
      landingDate: date,
      region: 'US' as const,
      blocks: {
        A: { choice: 'sometimes' as const, years: 3 },
        B: { choice: 'sometimes' as const, years: 4 },
        C: { choice: 'sometimes' as const, years: 3 },
      },
    };
    
    return computePlan(inputs);
  }, [date]);

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#f6f0e8]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-semibold mb-4">Go back and enter your landing date</h1>
              <Button onClick={() => window.location.href = '/'}>
                Back to Calculator
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        
        {/* Results Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Your RNOR Plan</h1>
          <p className="text-neutral-600">
            Based on your landing date: {new Date(date!).toLocaleDateString()}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{plan.arrivalFY}</div>
              <div className="text-sm text-muted-foreground">Arrival FY</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{plan.rnorYears.length}</div>
              <div className="text-sm text-muted-foreground">RNOR Years</div>
              <div className="text-xs text-muted-foreground mt-1">{plan.rnorYears.join(', ')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{plan.rorYears.length}</div>
              <div className="text-sm text-muted-foreground">ROR Years</div>
              <div className="text-xs text-muted-foreground mt-1">{plan.rorYears.join(', ')}</div>
            </CardContent>
          </Card>
        </div>

        {/* RNOR Window */}
        {plan.window && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Calendar className="w-5 h-5" />
                RNOR Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                {plan.window.startFY} to {plan.window.endFY}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tax Residency Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline 
              items={plan.timeline.map(row => ({
                label: row.fyLabel,
                status: row.finalStatus === 'NR' || row.finalStatus === 'RNOR' ? 'NR' : 'ROR'
              }))} 
            />
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Safe to sell foreign assets (RNOR/NR)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>India taxes worldwide income (ROR)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notes & Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 whitespace-pre-line">{plan.note}</p>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Don&apos;t miss your RNOR window — get a tax plan
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/book'}
              >
                Talk to a CA (Free 15-min)
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/book'}
              >
                Find out how to extend your tax-free years
              </Button>
            </div>
            <p className="text-sm text-blue-600 mt-4">
              Stop optimizing. Start converting.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
