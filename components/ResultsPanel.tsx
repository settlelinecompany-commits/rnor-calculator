"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanResult } from "@/types/rnor";
import { Timeline } from "./Timeline";
import { Alerts } from "./Alerts";

interface ResultsPanelProps {
  plan: PlanResult;
}

export function ResultsPanel({ plan }: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Arrival FY</div>
            <div className="text-2xl font-semibold">{plan.arrivalFY}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">RNOR Years</div>
            <div className="text-2xl font-semibold">{plan.rnorYears.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {plan.rnorYears.join(', ')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">ROR Years</div>
            <div className="text-2xl font-semibold">{plan.rorYears.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {plan.rorYears.join(', ')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Best year to sell RSUs</div>
            <div className="text-2xl font-semibold">
              {plan.bestTimeToRealizeRSUs === 'During RNOR' ? (
                <Badge className="bg-green-500 text-white">During RNOR</Badge>
              ) : (
                <Badge variant="outline">Not Ideal</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RNOR Window */}
      {plan.window && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-sm text-green-800 mb-1">YOUR RNOR WINDOW</div>
            <div className="text-2xl font-semibold text-green-900">
              {plan.window.startFY} to {plan.window.endFY}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes/Assumptions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> {plan.note}
          </div>
        </CardContent>
      </Card>

      {/* Tax Residency Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Residency Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline timeline={plan.timeline} />
        </CardContent>
      </Card>

      {/* Alerts */}
      <Alerts alerts={plan.alerts} />

      {/* Primary CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to optimize your tax strategy?</h3>
            <p className="text-muted-foreground">
              Get personalized advice from our certified tax professionals.
            </p>
            <Button size="lg" className="w-full">
              Talk to a CA (Free 15-min)
            </Button>
            <p className="text-xs text-muted-foreground">
              Stop optimizing. Start converting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
