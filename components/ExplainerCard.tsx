"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ExplainerCard() {
  return (
    <Card className="p-5 md:p-6 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">What is RNOR?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span><strong>NR:</strong> Non-Resident</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span><strong>RNOR:</strong> Resident but Not Ordinarily Resident</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span><strong>ROR:</strong> Resident and Ordinarily Resident</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Benefits */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Best years to realize foreign gains</span>
            <span className="text-green-600 font-medium">During RNOR</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Foreign income taxed in India</span>
            <span className="text-green-600 font-medium">Lower</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Capital gains on foreign assets</span>
            <span className="text-green-600 font-medium">Tax-free</span>
          </div>
        </div>

        {/* Primary CTA */}
        <Button className="w-full md:w-auto">
          Talk to a CA (Free 15-min)
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Get personalized advice on your RNOR strategy.
        </p>
      </CardContent>
    </Card>
  );
}
