import React from 'react';

export interface TimelineItem {
  label: string;
  status: "NR" | "RNOR" | "ROR";
}

interface TimelineProps {
  items: TimelineItem[];
}

const getStatusStyles = (status: TimelineItem['status']) => {
  switch (status) {
    case "NR":
      return "bg-blue-500 text-white";
    case "RNOR":
      return "bg-green-500 text-white";
    case "ROR":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={`
            px-4 py-2 rounded-2xl text-sm font-medium
            ${getStatusStyles(item.status)}
            transition-all duration-200 hover:scale-105
          `}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
