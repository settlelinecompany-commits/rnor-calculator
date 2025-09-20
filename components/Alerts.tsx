"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { PlanResult } from "@/types/rnor";

interface AlertsProps {
  alerts: PlanResult['alerts'];
}

const getAlertIcon = (level: string) => {
  switch (level) {
    case 'danger':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'warn':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="w-4 h-4 text-blue-500" />;
  }
};

const getAlertBorderColor = (level: string) => {
  switch (level) {
    case 'danger':
      return 'border-red-200 bg-red-50';
    case 'warn':
      return 'border-yellow-200 bg-yellow-50';
    case 'info':
    default:
      return 'border-blue-200 bg-blue-50';
  }
};

export function Alerts({ alerts }: AlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`${getAlertBorderColor(alert.level)} p-5 md:p-6 rounded-2xl shadow-sm`}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.level)}
              <div className="flex-1">
                <p className="text-sm">{alert.text}</p>
              </div>
              <Button variant="outline" size="sm">
                {alert.cta}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
