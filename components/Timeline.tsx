"use client";

import { Badge } from "@/components/ui/badge";
import { FYRow } from "@/types/rnor";

interface TimelineProps {
  timeline: FYRow[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NR':
      return 'bg-blue-500 text-white';
    case 'RNOR':
      return 'bg-green-500 text-white';
    case 'ROR':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export function Timeline({ timeline }: TimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {timeline.map((row, index) => (
          <Badge
            key={index}
            className={`${getStatusColor(row.finalStatus)} px-3 py-1.5 rounded-full text-sm hover:opacity-80 transition-opacity`}
          >
            {row.fyLabel}
          </Badge>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
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
    </div>
  );
}
