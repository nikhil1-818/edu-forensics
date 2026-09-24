import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Bell, Save, Check } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard } from '../components/common/ChartCard.tsx';

export const SettingsPage: React.FC = () => {
  const [institutionName, setInstitutionName] = useState('National Polytechnic University');
  const [riskFloor, setRiskFloor] = useState(40);
  const [criticalDiscriminationThreshold, setCriticalDiscriminationThreshold] = useState(0.8);
  const [ferpaEnforced, setFerpaEnforced] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="System Configuration"
        title="Institutional Settings & Parameters"
        subheading="Configure statistical risk thresholds, academic term dates, FERPA compliance guards, and computational modeling parameters."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <ChartCard
          title="Institutional Identity"
          subtitle="Campus credentials and deployment instance metadata"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Institution Name
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500">
              <div>
                <span>Instance ID:</span>
                <p className="font-bold text-slate-800">inst-npu-prod-01</p>
              </div>
              <div>
                <span>Academic Calendar:</span>
                <p className="font-bold text-slate-800">Semester System (Spring 2026 Active)</p>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Statistical Anomaly & Risk Thresholds"
          subtitle="Configure sensitivity triggers for Bayesian causal inference and survival projections"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-700">Academic Risk Alert Floor</span>
                <span className="text-red-700 font-bold">{riskFloor}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={riskFloor}
                onChange={e => setRiskFloor(Number(e.target.value))}
                className="w-full accent-red-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Trigger alerts when a cohort concept failure probability crosses this threshold.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-700">Question Item Discrimination Index</span>
                <span className="text-red-700 font-bold">{criticalDiscriminationThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={criticalDiscriminationThreshold}
                onChange={e => setCriticalDiscriminationThreshold(Number(e.target.value))}
                className="w-full accent-red-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Flags questions showing extreme sensitivity to unmastered prerequisite gaps.
              </p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Data Governance & Compliance"
          subtitle="Statutory privacy protection standards and student anonymization controls"
        >
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">FERPA & PII Masking</p>
                <p className="text-[11px] text-slate-500">
                  Ensures all machine learning models evaluate pseudonymous student IDs.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enforced Active
            </span>
          </div>
        </ChartCard>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Settings updated successfully</span>
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Institutional Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
