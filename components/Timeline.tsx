import React from 'react';

export interface TimelineItem {
  label: string;
  status: 'NR' | 'ROR'; // Simplified to just safe/unsafe
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const totalItems = items.length;
  const safeItems = items.filter(item => item.status === 'NR').length;
  const unsafeItems = totalItems - safeItems;
  
  const safePercentage = (safeItems / totalItems) * 100;
  const unsafePercentage = (unsafeItems / totalItems) * 100;

  return (
    <div className="space-y-4">
      {/* Horizontal Bar */}
      <div className="w-full h-8 rounded-full overflow-hidden border-2 border-gray-200">
        <div className="h-full flex">
          {safeItems > 0 && (
            <div 
              className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
              style={{ width: `${safePercentage}%` }}
            >
              {safeItems > 0 && safePercentage > 15 && 'Safe to sell'}
            </div>
          )}
          {unsafeItems > 0 && (
            <div 
              className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
              style={{ width: `${unsafePercentage}%` }}
            >
              {unsafeItems > 0 && unsafePercentage > 15 && 'Worldwide tax applies'}
            </div>
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      <p className="text-sm text-muted-foreground text-center">
        Plan big moves while the bar is green.
      </p>
      
      {/* Detailed Timeline (for reference) */}
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map((item, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded text-xs font-medium ${
              item.status === 'NR' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
