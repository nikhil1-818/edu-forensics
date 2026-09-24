import React from 'react';
import { RiskLevel } from '../../types.ts';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const norm = (level || '').toUpperCase();

  let colorClasses = 'text-emerald-700 bg-emerald-50/70 border-emerald-200/80';
  let dotColor = 'bg-emerald-500';
  let label = 'Low Risk';

  if (norm.includes('HIGH') || norm.includes('CRITICAL')) {
    colorClasses = 'text-red-700 bg-red-50/80 border-red-200/80';
    dotColor = 'bg-red-600';
    label = 'High Risk';
  } else if (norm.includes('MED') || norm.includes('WARN')) {
    colorClasses = 'text-amber-700 bg-amber-50/80 border-amber-200/80';
    dotColor = 'bg-amber-500';
    label = 'Medium Risk';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${colorClasses} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{label}</span>
    </span>
  );
};

export const RiskIndicator: React.FC<{ score: number; label?: string }> = ({ score, label }) => {
  let color = 'bg-emerald-500';
  let textColor = 'text-emerald-700';

  if (score >= 70) {
    color = 'bg-red-600';
    textColor = 'text-red-700';
  } else if (score >= 45) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, Math.max(5, score))}%` }} />
      </div>
      <span className={`font-mono text-xs font-semibold tabular-nums ${textColor}`}>
        {score}
        {label && <span className="text-slate-400 font-normal ml-0.5">{label}</span>}
      </span>
    </div>
  );
};
