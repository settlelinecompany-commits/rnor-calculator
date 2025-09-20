"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/Timeline";
import { Alerts } from "@/components/Alerts";
import { PlanResult } from "@/types/rnor";
import { Calendar } from "lucide-react";

interface ResultsPanelProps {
  plan: PlanResult;
}

export function ResultsPanel({ plan }: ResultsPanelProps) {
  const hasRNOR = plan.rnorYears.length > 0;
  const isShortWindow = plan.rnorYears.length === 1;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your plan</h2>
      </div>

      {/* Window Callout */}
      {hasRNOR ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="text-green-600 text-xl">✅</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-green-800">Good news!</h3>
                  {isShortWindow && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      ⚠️ Short window
                    </Badge>
                  )}
                </div>
                <p className="text-green-700 mb-2">
                  You&apos;ll get {plan.rnorYears.length} tax-free year{plan.rnorYears.length > 1 ? 's' : ''} ({plan.rnorYears.join(', ')}). 
                  Best time to sell your US assets.
                </p>
                <p className="text-sm text-green-600">
                  This window closes when you turn ROR. Plan high-tax moves before then.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="text-orange-600 text-xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Heads-up</h3>
                <p className="text-orange-700 mb-2">
                  No tax-free window detected with your inputs. Small travel changes could add one. Get a date strategy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <div className="text-sm text-muted-foreground">RNOR Years</div>
              <div className="text-xs text-muted-foreground">{plan.rnorYears.join(', ')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{plan.rorYears.length}</div>
              <div className="text-sm text-muted-foreground">ROR Years</div>
              <div className="text-xs text-muted-foreground">{plan.rorYears.join(', ')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {plan.bestTimeToRealizeRSUs === 'During RNOR' ? '✅' : '❌'}
              </div>
              <div className="text-sm text-muted-foreground">Best time to sell</div>
              <div className="text-xs text-muted-foreground">During RNOR</div>
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
              <h3 className="text-lg font-semibold text-green-800">RNOR Window</h3>
            </div>
            <p className="text-green-700">
              {plan.window.startFY} to {plan.window.endFY}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <h3 className="text-lg font-semibold mb-3">Notes & Assumptions</h3>
          <p className="text-sm text-neutral-600">{plan.note}</p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <h3 className="text-lg font-semibold mb-3">When is it safe to sell?</h3>
          <Timeline 
            items={plan.timeline.map(row => ({
              label: row.fyLabel,
              status: row.finalStatus === 'NR' || row.finalStatus === 'RNOR' ? 'NR' : 'ROR'
            }))} 
          />
          <div className="flex gap-4 mt-3 text-sm">
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

      {/* Alerts */}
      {plan.alerts.length > 0 && (
        <Alerts alerts={plan.alerts} />
      )}

      {/* Primary CTA */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-5 md:p-6 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-800">
              Don&apos;t miss your RNOR window — get a tax plan
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
            <p className="text-sm text-blue-600">
              Stop optimizing. Start converting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
