import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    isAdverse?: boolean; // If up is bad, e.g. risk increase
  };
  badgeText?: string;
  badgeType?: 'danger' | 'warning' | 'neutral' | 'success';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  badgeText,
  badgeType = 'neutral',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        {badgeText && (
          <span
            className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
              badgeType === 'danger'
                ? 'bg-red-50 text-red-700 border border-red-200/70'
                : badgeType === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/70'
                : badgeType === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                : 'bg-slate-50 text-slate-600 border border-slate-200/70'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {value}
        </span>

        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium font-mono ${
              trend.direction === 'neutral'
                ? 'text-slate-500'
                : (trend.direction === 'up' && trend.isAdverse) || (trend.direction === 'down' && !trend.isAdverse)
                ? 'text-red-600'
                : 'text-emerald-600'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500 leading-relaxed">{subtitle}</p>}
    </div>
  );
};
