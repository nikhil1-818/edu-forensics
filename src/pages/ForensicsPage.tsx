import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  ArrowRight,
  Sparkles,
  Download,
  AlertTriangle,
  FileText,
  FlaskConical,
  CheckCircle2,
  TrendingDown,
  Info,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { ForensicAnalysisResult } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard, InsightPanel } from '../components/common/ChartCard.tsx';
import { RiskBadge } from '../components/common/RiskBadge.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

interface ForensicsPageProps {
  navigate: (path: string) => void;
}

export const ForensicsPage: React.FC<ForensicsPageProps> = ({ navigate }) => {
  const [courses, setCourses] = useState<{ id: string; code: string; name: string }[]>([]);
  const [assessments, setAssessments] = useState<{ id: string; name: string; courseId: string }[]>([]);
  const [concepts, setConcepts] = useState<{ id: string; name: string; courseId: string }[]>([]);
  const [cohorts, setCohorts] = useState<string[]>([]);

  // Selection states
  const [selectedCourseId, setSelectedCourseId] = useState('course-math202');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('asm-math202-midterm1');
  const [selectedConceptId, setSelectedConceptId] = useState('concept-math-de');
  const [selectedCohort, setSelectedCohort] = useState('Cohort 2024-B (Spring Semester)');

  const [analysis, setAnalysis] = useState<ForensicAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active highlighted node in the DAG
  const [activeNodeId, setActiveNodeId] = useState<string | null>('node-alg');

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const opts = await api.getForensicOptions();
        setCourses(opts.courses);
        setAssessments(opts.assessments);
        setConcepts(opts.concepts);
        setCohorts(opts.cohorts);
        runInvestigation('course-math202', 'asm-math202-midterm1', 'concept-math-de');
      } catch (err: any) {
        setError(err.message || 'Failed to load options.');
      } finally {
        setIsOptionsLoading(false);
      }
    };
    loadOptions();
  }, []);

  const runInvestigation = async (
    courseId = selectedCourseId,
    assessmentId = selectedAssessmentId,
    conceptId = selectedConceptId
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.runForensics({
        courseId,
        assessmentId,
        conceptId,
        cohort: selectedCohort,
      });
      setAnalysis(res);
      setActiveNodeId(res.nodes[res.nodes.length - 1]?.id || null);
    } catch (err: any) {
      setError(err.message || 'Forensic analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isOptionsLoading) return <LoadingState message="Initializing Bayesian causal models..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Root Cause Discovery"
        title="Learning Failure Forensics"
        subheading="Bayesian causal path decomposition. Trace high-stakes examination failures back to hidden prerequisite choke points and unmastered foundational concepts."
        actions={
          analysis && (
            <button
              onClick={() => navigate('/simulator')}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Simulate Counterfactual Bridge</span>
            </button>
          )
        }
      />

      {/* STEP 1: PARAMETER INVESTIGATION COCKPIT */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-red-50 text-red-700 flex items-center justify-center font-mono font-bold text-xs">
              01
            </span>
            <h3 className="text-sm font-bold text-slate-900">Define Investigation Parameters</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Structural Causal Modeling Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
              Target Course
            </label>
            <select
              value={selectedCourseId}
              onChange={e => {
                setSelectedCourseId(e.target.value);
                const relatedAssessments = assessments.filter(a => a.courseId === e.target.value);
                if (relatedAssessments.length > 0) setSelectedAssessmentId(relatedAssessments[0].id);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
              Observed Assessment
            </label>
            <select
              value={selectedAssessmentId}
              onChange={e => setSelectedAssessmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              {assessments
                .filter(a => !selectedCourseId || a.courseId === selectedCourseId)
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
              Target Concept
            </label>
            <select
              value={selectedConceptId}
              onChange={e => setSelectedConceptId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              {concepts
                .filter(c => !selectedCourseId || c.courseId === selectedCourseId)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
              Academic Cohort
            </label>
            <select
              value={selectedCohort}
              onChange={e => setSelectedCohort(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              {cohorts.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            Analyzes 126 item response signals across 235 student examinations.
          </p>
          <button
            onClick={() => runInvestigation()}
            disabled={isLoading}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Computing Causal Trajectory...</span>
              </>
            ) : (
              <>
                <GitBranch className="w-3.5 h-3.5" />
                <span>Execute Bayesian Forensics Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => runInvestigation()} />}

      {analysis && (
        <div className="space-y-6">
          {/* BOTTLENECK CALLOUT BANNER */}
          <div className="bg-red-50/90 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-red-700">
                    Primary Causal Choke Point Detected
                  </span>
                  <span className="text-[10px] font-mono bg-red-200/80 text-red-900 font-bold px-1.5 py-0.5 rounded">
                    {analysis.primaryBottleneck.confidence}% Causal Confidence
                  </span>
                </div>
                <h2 className="text-lg font-bold text-red-950 mt-0.5">
                  {analysis.primaryBottleneck.concept} ({analysis.primaryBottleneck.course})
                </h2>
                <p className="text-xs text-red-800/90 mt-1 max-w-3xl leading-relaxed">
                  {analysis.primaryBottleneck.impactExplanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/simulator')}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Test Remedial Bridge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SECTION: CAUSAL DAG GRAPH & EVIDENCE SIGNALS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Causal DAG Visual Representation */}
            <div className="lg:col-span-2">
              <ChartCard
                title="Directed Causal Failure Graph (DAG)"
                subtitle="Pearl Causal Graph showing step-by-step backward path from examination failure"
                badge={
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    4 Nodes · 3 Directed Edges
                  </span>
                }
              >
                {/* Visual DAG Nodes Flow */}
                <div className="py-6 space-y-4">
                  {analysis.nodes.map((node, idx) => {
                    const isSelected = activeNodeId === node.id;
                    const isRoot = node.type === 'prerequisite_root';
                    const isFailure = node.type === 'failure_event';

                    return (
                      <React.Fragment key={node.id}>
                        {/* Directed Transition Edge */}
                        {idx > 0 && (
                          <div className="flex items-center justify-center my-1">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-mono font-semibold text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded shadow-2xs">
                                ↓ {analysis.edges[idx - 1]?.label} ({Math.round(analysis.edges[idx - 1]?.probability * 100)}% weight)
                              </span>
                              <div className="w-0.5 h-3 bg-red-300" />
                            </div>
                          </div>
                        )}

                        {/* Node Card */}
                        <div
                          onClick={() => setActiveNodeId(node.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-red-600 bg-white shadow-md ring-2 ring-red-600/10'
                              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                                  isRoot
                                    ? 'bg-red-700 text-white'
                                    : isFailure
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {idx + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {node.label}
                                  </h4>
                                  {node.isBottleneck && (
                                    <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                                      CHOKE POINT
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 font-mono">
                                  {node.courseName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-right">
                              <div>
                                <p className="text-[10px] uppercase font-mono text-slate-400">Mastery</p>
                                <p
                                  className={`text-sm font-mono font-bold tabular-nums ${
                                    node.mastery < 60 ? 'text-red-600' : 'text-slate-900'
                                  }`}
                                >
                                  {node.mastery}%
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-mono text-slate-400">Failure Rate</p>
                                <p className="text-sm font-mono font-bold tabular-nums text-red-700">
                                  {node.failureRate}%
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-mono text-slate-400">Affected</p>
                                <p className="text-sm font-mono text-slate-700 tabular-nums">
                                  {node.affectedStudents}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Methodology: {analysis.causalMethodology}</span>
                </div>
              </ChartCard>
            </div>

            {/* Evidence Signals Side Panel */}
            <div>
              <ChartCard
                title="Evidence Signals & Anomaly Telemetry"
                subtitle="Quantitative signals confirming causal failure mechanism"
              >
                <div className="space-y-3.5">
                  {analysis.evidenceSignals.map((sig, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs ${
                        sig.status === 'critical'
                          ? 'bg-red-50/50 border-red-200/80'
                          : sig.status === 'warning'
                          ? 'bg-amber-50/50 border-amber-200/80'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{sig.signal}</span>
                        <span
                          className={`font-mono font-bold text-[11px] ${
                            sig.status === 'critical'
                              ? 'text-red-700'
                              : sig.status === 'warning'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {sig.value}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{sig.description}</p>
                      <div className="mt-2 text-[10px] font-mono text-slate-400">
                        Benchmark: {sig.benchmark}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Institutional Dossier</span>
                  <button
                    onClick={() => navigate('/reports')}
                    className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Briefing PDF</span>
                  </button>
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
