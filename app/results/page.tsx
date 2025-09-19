"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { estimateRNOR } from "@/lib/rnor";
import { Timeline, TimelineItem } from "@/components/Timeline";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const d7 = searchParams.get('d7');

  // Calculate RNOR results using the estimateRNOR function
  const rnorResults = useMemo(() => {
    if (!date) return null;
    
    const landingDate = new Date(date);
    const past7yrIndiaDays = d7 ? parseInt(d7) : undefined;
    return estimateRNOR(landingDate, past7yrIndiaDays);
  }, [date, d7]);

  // Create timeline data for the Timeline component
  const timelineData = useMemo((): TimelineItem[] => {
    if (!rnorResults) return [];
    
    const items: TimelineItem[] = [];
    
    // Add one NR year before arrival
    const arrivalFY = rnorResults.arrivalFY;
    const [arrivalStartYear] = arrivalFY.split('-');
    const prevFY = `${parseInt(arrivalStartYear) - 1}-${arrivalStartYear.slice(-2)}`;
    items.push({ label: prevFY, status: "NR" });
    
    // Add RNOR years
    rnorResults.rnorFYs.forEach(fy => {
      items.push({ label: fy, status: "RNOR" });
    });
    
    // Add first two ROR years
    rnorResults.rorFYs.slice(0, 2).forEach(fy => {
      items.push({ label: fy, status: "ROR" });
    });
    
    return items;
  }, [rnorResults]);

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

  // If date is invalid, show error
  if (!rnorResults) {
    return (
      <main className="min-h-screen bg-[#f6f0e8] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-600">
                Please enter a valid landing date.
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
                  <div className="text-2xl font-semibold">{rnorResults.arrivalFY}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">RNOR Years</div>
                  <div className="text-2xl font-semibold">{rnorResults.rnorFYs.length}</div>
                  <div className="text-xs text-neutral-600 mt-1">{rnorResults.rnorFYs.join(', ')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-500 mb-2">ROR Years</div>
                  <div className="text-2xl font-semibold">{rnorResults.rorFYs.length}</div>
                  <div className="text-xs text-neutral-600 mt-1">{rnorResults.rorFYs.join(', ')}</div>
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-green-800 mb-1">YOUR RNOR WINDOW</div>
              <div className="text-2xl font-semibold text-green-900">
                {rnorResults.rnorFYs.join(' to ')}
              </div>
            </div>
            
            {/* Assumption Note */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> {rnorResults.assumptionNote}
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
            <Timeline items={timelineData} />
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>NR - Non-Resident</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>RNOR - Resident but Not Ordinarily Resident</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>ROR - Resident and Ordinarily Resident</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to optimize your tax strategy?</h3>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Get personalized advice from our certified tax professionals. 
                We'll help you maximize your RNOR benefits and plan your financial moves strategically.
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
