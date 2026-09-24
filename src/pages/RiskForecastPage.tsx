import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Cpu,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { RiskForecastData } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { ChartCard, InsightPanel } from '../components/common/ChartCard.tsx';
import { RiskBadge, RiskIndicator } from '../components/common/RiskBadge.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

interface RiskForecastPageProps {
  navigate: (path: string) => void;
}

export const RiskForecastPage: React.FC<RiskForecastPageProps> = ({ navigate }) => {
  const [data, setData] = useState<RiskForecastData | null>(null);
  const [horizon, setHorizon] = useState('Next Assessment (Week 8)');
  const [department, setDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getRiskForecast({ horizon, department });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load risk forecast.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [horizon, department]);

  if (isLoading) return <LoadingState message="Calculating temporal risk propagation models..." />;
  if (error || !data) return <ErrorState message={error || 'Failed to compute forecast.'} onRetry={fetchForecast} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Predictive Academic Intelligence"
        title="Academic Risk Forecast"
        subheading="Pre-examination risk indicators with transparent multi-factor causal attribution. Detect vulnerabilities 4-6 weeks before examination results reveal them."
        actions={
          <div className="flex items-center gap-2.5">
            <select
              value={horizon}
              onChange={e => setHorizon(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg shadow-xs focus:outline-none focus:border-red-600"
            >
              <option value="Next Assessment (Week 8)">Horizon: Next Assessment (Week 8)</option>
              <option value="Final Examination (Week 14)">Horizon: Final Examination (Week 14)</option>
              <option value="Next Academic Term (Fall 2026)">Horizon: Next Academic Term</option>
            </select>
          </div>
        }
      />

      {/* TOP COMPARISON CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Observed Risk"
          value={`${data.currentRisk}%`}
          subtitle="Baseline cohort vulnerability"
          badgeText="Active Status"
          badgeType="warning"
        />

        <MetricCard
          title="Projected Forecast Risk"
          value={`${data.forecastRisk}%`}
          subtitle={`Anticipated at ${data.horizon}`}
          trend={{ direction: 'up', value: `+${data.forecastRisk - data.currentRisk}% Net Spike`, isAdverse: true }}
          badgeText="Critical Surge"
          badgeType="danger"
        />

        <MetricCard
          title="Forecast Horizon"
          value={data.horizon.split(' ')[0]}
          subtitle={data.horizon}
        />

        <MetricCard
          title="Forecast Confidence"
          value="91.8%"
          subtitle="Bayesian posterior precision"
          badgeText="High Reliability"
          badgeType="success"
        />
      </div>

      {/* PROPAGATION SUMMARY BANNER */}
      <InsightPanel
        title="Risk Trajectory & Failure Propagation Synthesis"
        content={data.propagationSummary}
      />

      {/* SECTION: TIMELINE PROJECTION CHART */}
      <ChartCard
        title="Temporal Risk Propagation Timeline"
        subtitle="Survival analysis projection with 90% Bayesian credible bounds"
        badge={
          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Temporal Survival Model (GBDT)
          </span>
        }
      >
        <div className="pt-6 pb-2">
          <div className="h-60 flex items-end justify-between gap-3">
            {data.timeline.map((item, idx) => {
              const isProj = !!item.projected && !item.historical;
              const isHistorical = !!item.historical;
              const val = item.historical || item.projected || 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {/* Credible bounds pill */}
                  {item.lowerBound && (
                    <span className="text-[9px] font-mono text-slate-400 tabular-nums">
                      {item.lowerBound}–{item.upperBound}%
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {val}%
                  </span>

                  <div className="w-full max-w-[36px] h-36 bg-slate-50 rounded-t flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isProj
                          ? 'bg-red-400 border border-dashed border-red-600'
                          : 'bg-slate-700 group-hover:bg-slate-900'
                      }`}
                      style={{ height: `${(val / 85) * 100}%` }}
                    />
                  </div>

                  <span
                    className={`text-[10px] text-center font-mono leading-tight truncate w-full ${
                      isProj ? 'text-red-700 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {item.period}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-700 rounded-xs" /> Observed Telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-dashed border-red-600 bg-red-400 rounded-xs" /> Projected Risk Vector
              </span>
            </div>
            <span>Safe Benchmark Line: &lt; 35%</span>
          </div>
        </div>
      </ChartCard>

      {/* SECTION: RANKED CONTRIBUTING FACTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ranked Contributing Risk Drivers"
          subtitle="Transparent multi-factor decomposition explaining why risk is increasing"
        >
          <div className="space-y-4">
            {data.contributingFactors.map(factor => (
              <div
                key={factor.rank}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 text-[10px] font-mono font-bold flex items-center justify-center">
                      #{factor.rank}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{factor.factor}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {factor.impactPercentage}% Impact
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{factor.description}</p>

                <div className="mt-2.5 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${factor.impactPercentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* DOWNSTREAM AFFECTED COURSES */}
        <ChartCard
          title="Downstream Affected Courses"
          subtitle="Courses at immediate risk of failure propagation"
          actions={
            <button
              onClick={() => navigate('/digital-twin')}
              className="text-xs text-red-700 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Trace in Digital Twin</span>
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-2.5 font-medium">Course</th>
                  <th className="py-2.5 font-medium">Current</th>
                  <th className="py-2.5 font-medium">Forecast</th>
                  <th className="py-2.5 font-medium">Propagation</th>
                  <th className="py-2.5 text-right font-medium">Investigate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.affectedCourses.map(course => (
                  <tr key={course.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-slate-900">{course.code}</p>
                      <p className="text-[11px] text-slate-500">{course.name}</p>
                    </td>
                    <td className="py-3 font-mono font-semibold text-slate-700 tabular-nums">
                      {course.currentRisk}%
                    </td>
                    <td className="py-3 font-mono font-bold text-red-700 tabular-nums">
                      {course.forecastRisk}%
                    </td>
                    <td className="py-3">
                      <RiskBadge level={course.propagationRisk} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/forensics?courseId=${course.code}`)}
                        className="text-xs font-semibold text-red-700 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Forensics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
