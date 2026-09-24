import React from 'react';
import { AlertTriangle, AlertCircle, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Alert, RiskLevel } from '../../types.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onViewAnalysis?: (courseCode: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onResolve,
  onViewAnalysis,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {alert.severity === 'HIGH' ? (
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : alert.severity === 'MEDIUM' ? (
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{alert.title}</h4>
              <RiskBadge level={alert.severity} size="sm" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span className="font-semibold text-slate-700">{alert.courseCode}</span>
              <span>·</span>
              <span>{alert.department}</span>
              <span>·</span>
              <span>{alert.date}</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{alert.description}</p>

            {alert.suggestedAction && (
              <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Recommended Action: </span>
                {alert.suggestedAction}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
              alert.status === 'RESOLVED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : alert.status === 'ACKNOWLEDGED'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {alert.status}
          </span>

          <div className="flex items-center gap-1.5 mt-2">
            {onViewAnalysis && (
              <button
                onClick={() => onViewAnalysis(alert.courseCode)}
                className="text-xs font-medium text-red-700 hover:text-red-800 flex items-center gap-0.5 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span>Forensics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {alert.status === 'UNACKNOWLEDGED' && onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Acknowledge
              </button>
            )}

            {alert.status !== 'RESOLVED' && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 border border-emerald-200 bg-emerald-50/50 px-2 py-1 rounded hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Resolve</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterBarProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, actions }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
