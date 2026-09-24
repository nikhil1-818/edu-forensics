import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  FlaskConical,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { DashboardOverviewData } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { ChartCard, InsightPanel } from '../components/common/ChartCard.tsx';
import { RiskBadge, RiskIndicator } from '../components/common/RiskBadge.tsx';
import { AlertCard } from '../components/common/AlertCard.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>(
    'Cross-cohort telemetry reveals an active prerequisite choke point in Multivariable Integration (MATH202). Failure propagation models project a 26% downstream risk increase in Operating Systems concurrency and Machine Learning optimization if unaddressed prior to Week 8.'
  );
  const [isExplaining, setIsExplaining] = useState(false);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load executive overview.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRefreshExplanation = async () => {
    if (!data) return;
    setIsExplaining(true);
    try {
      const text = await api.explainWithAI('dashboard', {
        predictedRisk: data.kpi.predictedAcademicRisk,
        criticalBottlenecks: data.kpi.criticalBottlenecks,
        highRiskConcepts: data.kpi.highRiskConcepts,
      });
      setAiExplanation(text);
    } catch (err) {
      console.warn('AI explain fallback used', err);
    } finally {
      setIsExplaining(false);
    }
  };

  if (isLoading) return <LoadingState message="Aggregating cross-departmental academic telemetry..." />;
  if (error || !data) return <ErrorState message={error || 'No telemetry data available.'} onRetry={fetchOverview} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Institutional Intelligence"
        title="Executive Academic Overview"
        subheading="Continuous multi-factor telemetry across 1,420 students, 6 core courses, and 84 prerequisite dependencies."
        actions={
          <>
            <button
              onClick={() => navigate('/forensics')}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Launch Forensics</span>
            </button>
            <button
              onClick={() => navigate('/simulator')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
              <span>What-If Simulator</span>
            </button>
          </>
        }
      />

      {/* TOP KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Students Monitored"
          value={data.kpi.studentsAnalyzed.toLocaleString()}
          subtitle="Enrolled active undergraduates"
          badgeText="Live Sync"
          badgeType="neutral"
        />

        <MetricCard
          title="Courses Analyzed"
          value={data.kpi.coursesMonitored}
          subtitle="Core engineering & CS tracks"
        />

        <MetricCard
          title="Predicted Academic Risk"
          value={`${data.kpi.predictedAcademicRisk}%`}
          subtitle="Cohort average vulnerability"
          trend={{ direction: 'up', value: '+6% vs Baseline', isAdverse: true }}
          badgeText="High"
          badgeType="danger"
        />

        <MetricCard
          title="High-Risk Concepts"
          value={data.kpi.highRiskConcepts}
          subtitle="Failure rate exceeds 40%"
          trend={{ direction: 'up', value: '+2 this month', isAdverse: true }}
          badgeText="Alert"
          badgeType="warning"
        />

        <MetricCard
          title="Critical Bottlenecks"
          value={data.kpi.criticalBottlenecks}
          subtitle="Active downstream propagation"
          badgeText="Intervention Req"
          badgeType="danger"
        />
      </div>

      {/* INTELLIGENCE SYNTHESIS PANEL */}
      <InsightPanel
        title="Executive Forensic Intelligence Briefing"
        content={aiExplanation}
        isLoading={isExplaining}
        onRefresh={handleRefreshExplanation}
      />

      {/* SECTION: RISK DISTRIBUTION & TEMPORAL PROJECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cohort Risk Distribution */}
        <ChartCard
          title="Cohort Risk Distribution"
          subtitle="Current distribution across enrolled cohort"
          badge={<RiskBadge level="HIGH" size="sm" />}
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">High Risk (Failure Prob &gt; 70%)</span>
                <span className="font-mono font-semibold text-red-700">
                  {data.riskDistribution.high.count} students ({data.riskDistribution.high.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${data.riskDistribution.high.percentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Medium Risk (Vulnerable 45–69%)</span>
                <span className="font-mono font-semibold text-amber-700">
                  {data.riskDistribution.medium.count} students ({data.riskDistribution.medium.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.riskDistribution.medium.percentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Low Risk (Nominal Mastery &lt; 45%)</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {data.riskDistribution.low.count} students ({data.riskDistribution.low.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.riskDistribution.low.percentage}%` }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Risk Threshold Floor: 40%</span>
              <button
                onClick={() => navigate('/risk-forecast')}
                className="font-medium text-red-700 hover:text-red-800 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Full Forecast</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </ChartCard>

        {/* Temporal Risk Trajectory */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Academic Risk Trajectory (Historical vs Projected)"
            subtitle="Gradient-boosted temporal trajectory through May 2026 examination finals"
            actions={
              <button
                onClick={() => navigate('/risk-forecast')}
                className="text-xs text-red-700 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Horizon Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            {/* Visual Custom Responsive Spark/Bar Timeline */}
            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2">
              {data.riskTrend.map((pt, idx) => {
                const isProjected = pt.period.includes('Proj') || pt.period.includes('Finals');
                const isNow = pt.period.includes('Now');
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono font-semibold text-slate-700 tabular-nums">
                      {pt.risk}%
                    </span>
                    <div className="w-full max-w-[28px] h-32 bg-slate-50 rounded-t flex items-end p-0.5">
                      <div
                        className={`w-full rounded-t transition-all ${
                          isNow
                            ? 'bg-red-700'
                            : isProjected
                            ? 'bg-red-300 border border-dashed border-red-500'
                            : 'bg-slate-400 group-hover:bg-slate-600'
                        }`}
                        style={{ height: `${(pt.risk / 80) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`text-[9px] text-center font-mono leading-tight truncate w-full ${
                        isNow ? 'text-red-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {pt.period.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-slate-400 rounded-xs" /> Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-700 rounded-xs" /> Current Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border border-dashed border-red-500 bg-red-200 rounded-xs" /> Model Projection
                </span>
              </div>
              <span>Target Benchmark: &lt; 35%</span>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* SECTION: EMERGING BOTTLENECKS & ROOT CAUSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emerging Bottlenecks Table */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Emerging Prerequisite Bottlenecks"
            subtitle="Concepts exhibiting anomalous failure spikes and active downstream propagation"
            actions={
              <button
                onClick={() => navigate('/curriculum')}
                className="text-xs text-red-700 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Curriculum Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-2.5 font-medium">Concept</th>
                    <th className="py-2.5 font-medium">Course</th>
                    <th className="py-2.5 font-medium">Risk Score</th>
                    <th className="py-2.5 font-medium">Affected</th>
                    <th className="py-2.5 font-medium">Trend</th>
                    <th className="py-2.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.emergingBottlenecks.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        {b.concept}
                      </td>
                      <td className="py-3 text-slate-600 font-mono">
                        {b.courseCode}
                      </td>
                      <td className="py-3">
                        <RiskIndicator score={b.risk} />
                      </td>
                      <td className="py-3 text-slate-600 font-mono tabular-nums">
                        {b.affectedStudents} students
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-[11px] ${
                            b.trend === 'increasing' ? 'text-red-600 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {b.trend === 'increasing' ? '↑ Rising' : '→ Stable'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/forensics?courseId=${b.courseCode}&conceptId=${b.id}`)}
                          className="text-xs font-semibold text-red-700 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Forensic Run
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Causal Root Causes */}
        <ChartCard
          title="Root Cause Signals"
          subtitle="Statistically verified failure propagation chains"
          actions={
            <button
              onClick={() => navigate('/forensics')}
              className="text-xs text-red-700 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>DAG Trace</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-3.5">
            {data.rootCauses.map(rc => (
              <div
                key={rc.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-slate-900">{rc.title}</h4>
                  <span className="text-[11px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    {rc.confidence}% Conf
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{rc.signal}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Course: {rc.affectedCourse}</span>
                  <span className="text-red-600 font-medium">{rc.impactScore}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* RECENT ALERTS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active High-Priority Alerts</h3>
            <p className="text-xs text-slate-500">
              System alerts generated by statistical boundary violations and prerequisite failures
            </p>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Alerts ({data.recentAlerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {data.recentAlerts.slice(0, 2).map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onViewAnalysis={code => navigate(`/forensics?courseCode=${code}`)}
              onAcknowledge={async id => {
                await api.updateAlertStatus(id, 'ACKNOWLEDGED');
                fetchOverview();
              }}
              onResolve={async id => {
                await api.updateAlertStatus(id, 'RESOLVED');
                fetchOverview();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
