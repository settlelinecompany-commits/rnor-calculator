"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanResult } from "@/types/rnor";
import { Calendar } from "lucide-react";

interface ResultsPanelProps {
  plan: PlanResult;
}

export function ResultsPanel({ plan }: ResultsPanelProps) {
  const hasRNOR = plan.rnorYears.length > 0;
  const isShortWindow = plan.rnorYears.length === 1;
  const firstRORYear = plan.rorYears[0] || 'N/A';

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Plan</h2>
      </div>

      {/* Green Highlight Box - Dominant */}
      {hasRNOR ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="text-green-600 text-2xl">✅</div>
                <h3 className="text-2xl font-bold text-green-800">Good news!</h3>
                {isShortWindow && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    ⚠️ Short window
                  </Badge>
                )}
              </div>
              <p className="text-lg text-green-700 max-w-2xl mx-auto">
                You&apos;ll get {plan.rnorYears.length} tax-free year{plan.rnorYears.length > 1 ? 's' : ''}: {plan.rnorYears.join(', ')}. 
                Sell US assets before then to avoid India tax.
              </p>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.location.href = '/book'}
              >
                Maximize my tax-free years → Talk to a CA
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="text-orange-600 text-2xl">⚠️</div>
                <h3 className="text-2xl font-bold text-orange-800">Heads-up</h3>
              </div>
              <p className="text-lg text-orange-700 max-w-2xl mx-auto">
                India will start taxing your worldwide income as soon as you return. 
                Adjust your return date to add tax-free years.
              </p>
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => window.location.href = '/book'}
              >
                Get a date strategy with a CA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Muted line under highlight box */}
      <p className="text-sm text-muted-foreground text-center">
        After {firstRORYear}, India will start taxing your worldwide income.
      </p>

      {/* Summary Row */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{plan.arrivalFY}</div>
              <div className="text-sm text-muted-foreground">Arrival FY</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{plan.rnorYears.length}</div>
              <div className="text-sm text-muted-foreground">Tax-free Years</div>
              <div className="text-xs text-muted-foreground">{plan.rnorYears.join(', ')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{plan.rorYears.length}</div>
              <div className="text-sm text-muted-foreground">Tax Years</div>
              <div className="text-xs text-muted-foreground">{plan.rorYears.join(', ')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {plan.bestTimeToRealizeRSUs === 'During RNOR' ? '✅' : '❌'}
              </div>
              <div className="text-sm text-muted-foreground">Best time to sell</div>
              <div className="text-xs text-muted-foreground">During tax-free years</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RNOR Window */}
      {plan.window && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Tax-free Window</h3>
            </div>
            <p className="text-green-700">
              {plan.window.startFY} to {plan.window.endFY}
            </p>
          </CardContent>
        </Card>
      )}



      {/* Final CTA Section - Reinforcement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-800">
              Don&apos;t miss your RNOR window
            </h3>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Get a personalized plan from our CAs before your window closes.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = '/book'}
            >
              Talk to a CA (Free 15-min)
            </Button>
            <p className="text-sm text-blue-600">
              Stop optimizing. Start converting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
