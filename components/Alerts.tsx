"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { PlanResult } from "@/types/rnor";

interface AlertsProps {
  alerts: PlanResult['alerts'];
}

const getAlertIcon = (level: string) => {
  switch (level) {
    case 'danger': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'warn': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    default: return <Lightbulb className="w-4 h-4 text-blue-600" />;
  }
};

const getAlertStyles = (level: string) => {
  switch (level) {
    case 'danger': return 'border-red-200 bg-red-50';
    case 'warn': return 'border-orange-200 bg-orange-50';
    default: return 'border-blue-200 bg-blue-50';
  }
};

// Simplify alert text to be more human-friendly
const simplifyAlertText = (alert: PlanResult['alerts'][0]): string => {
  const text = alert.text.toLowerCase();
  
  if (text.includes('730') || text.includes('7-year')) {
    return "You've already spent too much time in India — your tax-free years may shrink.";
  }
  
  if (text.includes('2-of-10') || text.includes('resident years')) {
    return "You've already spent too much time in India — your tax-free years may shrink.";
  }
  
  if (text.includes('window') || text.includes('overlap')) {
    return "No overlap window found. Adjust your return date to maximize RNOR.";
  }
  
  if (text.includes('extend') || text.includes('59')) {
    return `Keep FY ${new Date().getFullYear() + 1} visits short (<59 days) to extend RNOR.`;
  }
  
  return alert.text; // Keep original if no match
};

export function Alerts({ alerts }: AlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={getAlertStyles(alert.level)}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.level)}
              <div className="flex-1">
                <p className="text-sm font-medium">{simplifyAlertText(alert)}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/book'}
                className="ml-2"
              >
                {alert.cta}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
