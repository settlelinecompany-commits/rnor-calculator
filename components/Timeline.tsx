import React from 'react';

export interface TimelineItem {
  label: string;
  status: 'NR' | 'ROR'; // Simplified to just safe/unsafe
}

interface TimelineProps {
  items: TimelineItem[];
}

const getStatusStyles = (status: TimelineItem['status']) => {
  switch (status) {
    case 'NR': return 'bg-green-500 text-white'; // Safe to sell
    case 'ROR': return 'bg-red-500 text-white'; // India taxes worldwide income
    default: return 'bg-gray-500 text-white';
  }
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(item.status)}`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
