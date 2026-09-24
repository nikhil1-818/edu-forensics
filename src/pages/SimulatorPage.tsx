import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  Save,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  History,
} from 'lucide-react';
import { api } from '../services/api.ts';
import {
  SimulationScenarioSettings,
  SimulationComparisonResult,
} from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { MetricCard } from '../components/common/MetricCard.tsx';
import { ChartCard, InsightPanel } from '../components/common/ChartCard.tsx';
import { RiskBadge } from '../components/common/RiskBadge.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

interface SimulatorPageProps {
  navigate: (path: string) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ navigate }) => {
  const [savedScenarios, setSavedScenarios] = useState<SimulationScenarioSettings[]>([]);
  const [currentSettings, setCurrentSettings] = useState<SimulationScenarioSettings>({
    name: 'Targeted Remedial Bridge + Formative Scaffolding',
    description: 'Mandatory 2-week prerequisite diagnostic bridge on multivariable integration with weekly formative evaluation.',
    courseOrdering: [
      { courseId: 'course-math202', originalSemester: 3, newSemester: 3 },
      { courseId: 'course-cs305', originalSemester: 5, newSemester: 5 },
    ],
    prerequisiteRelationship: 'strengthened_bridge',
    assessmentWeightage: {
      midtermWeight: 25,
      quizWeight: 30,
      assignmentWeight: 20,
      finalWeight: 25,
    },
    learningIntervention: 'targeted_remedial_prerequisite',
    courseDifficulty: 'calibrated_minus_10',
    assessmentFrequency: 'weekly',
  });

  const [result, setResult] = useState<SimulationComparisonResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScenarios();
    runSimulation();
  }, []);

  const loadScenarios = async () => {
    try {
      const list = await api.getSimulationScenarios();
      setSavedScenarios(list);
    } catch (err) {
      console.warn('Failed to load saved scenarios', err);
    }
  };

  const runSimulation = async (settings = currentSettings) => {
    setIsSimulating(true);
    setError(null);
    try {
      const res = await api.runSimulation(settings);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Simulation execution failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveScenario = async () => {
    setIsSaving(true);
    try {
      await api.saveSimulationScenario(currentSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadScenarios();
    } catch (err: any) {
      setError(err.message || 'Failed to save scenario.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadScenario = (scen: SimulationScenarioSettings) => {
    setCurrentSettings(scen);
    runSimulation(scen);
  };

  const totalWeight =
    currentSettings.assessmentWeightage.midtermWeight +
    currentSettings.assessmentWeightage.quizWeight +
    currentSettings.assessmentWeightage.assignmentWeight +
    currentSettings.assessmentWeightage.finalWeight;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Counterfactual Experimentation"
        title="What-If Education Simulator"
        subheading="Test curriculum sequencing, prerequisite bridging, and assessment weightage adjustments virtually before applying them to a live student cohort."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => runSimulation()}
              disabled={isSimulating}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
            <button
              onClick={handleSaveScenario}
              disabled={isSaving}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Saved!' : 'Save Scenario'}</span>
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={() => runSimulation()} />}

      {/* SPLIT SCREEN COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCENARIO SETTINGS & LEVERS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-700" />
                <h3 className="text-sm font-bold text-slate-900">Intervention Levers</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Monte Carlo Engine</span>
            </div>

            {/* Scenario Name & Desc */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Scenario Name
              </label>
              <input
                type="text"
                value={currentSettings.name}
                onChange={e => setCurrentSettings({ ...currentSettings, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              />
            </div>

            {/* Prerequisite Structure Lever */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Prerequisite Relationship
              </label>
              <select
                value={currentSettings.prerequisiteRelationship}
                onChange={e =>
                  setCurrentSettings({
                    ...currentSettings,
                    prerequisiteRelationship: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              >
                <option value="strengthened_bridge">
                  Strengthened Bridge (Mandatory 2-wk Diagnostic Remedial)
                </option>
                <option value="standard">Standard Prerequisite Enforcement</option>
                <option value="relaxed_concurrent">Relaxed Concurrent Enrollment</option>
              </select>
            </div>

            {/* Targeted Learning Intervention Lever */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                Learning Intervention Strategy
              </label>
              <select
                value={currentSettings.learningIntervention}
                onChange={e =>
                  setCurrentSettings({
                    ...currentSettings,
                    learningIntervention: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              >
                <option value="targeted_remedial_prerequisite">
                  Targeted Remedial Prerequisite Bridge
                </option>
                <option value="adaptive_quiz_scaffolding">
                  Adaptive Quiz Scaffolding (Automated Diagnostics)
                </option>
                <option value="peer_assisted_labs">
                  Peer-Assisted Recitation & Practice Labs
                </option>
                <option value="none">None (Status Quo Baseline)</option>
              </select>
            </div>

            {/* Assessment Weightage Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
                  Assessment Weightage Allocation
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    totalWeight === 100 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  Total: {totalWeight}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Midterm Exam ({currentSettings.assessmentWeightage.midtermWeight}%)</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={currentSettings.assessmentWeightage.midtermWeight}
                    onChange={e =>
                      setCurrentSettings({
                        ...currentSettings,
                        assessmentWeightage: {
                          ...currentSettings.assessmentWeightage,
                          midtermWeight: Number(e.target.value),
                        },
                      })
                    }
                    className="w-32 accent-red-700 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Formative Quizzes ({currentSettings.assessmentWeightage.quizWeight}%)</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={currentSettings.assessmentWeightage.quizWeight}
                    onChange={e =>
                      setCurrentSettings({
                        ...currentSettings,
                        assessmentWeightage: {
                          ...currentSettings.assessmentWeightage,
                          quizWeight: Number(e.target.value),
                        },
                      })
                    }
                    className="w-32 accent-red-700 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Assignments & Labs ({currentSettings.assessmentWeightage.assignmentWeight}%)</span>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={currentSettings.assessmentWeightage.assignmentWeight}
                    onChange={e =>
                      setCurrentSettings({
                        ...currentSettings,
                        assessmentWeightage: {
                          ...currentSettings.assessmentWeightage,
                          assignmentWeight: Number(e.target.value),
                        },
                      })
                    }
                    className="w-32 accent-red-700 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Final Exam ({currentSettings.assessmentWeightage.finalWeight}%)</span>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={currentSettings.assessmentWeightage.finalWeight}
                    onChange={e =>
                      setCurrentSettings({
                        ...currentSettings,
                        assessmentWeightage: {
                          ...currentSettings.assessmentWeightage,
                          finalWeight: Number(e.target.value),
                        },
                      })
                    }
                    className="w-32 accent-red-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Frequency & Difficulty */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
                  Cadence
                </label>
                <select
                  value={currentSettings.assessmentFrequency}
                  onChange={e =>
                    setCurrentSettings({
                      ...currentSettings,
                      assessmentFrequency: e.target.value as any,
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="tri_semester">3 Times/Sem</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-mono">
                  Target Rigor
                </label>
                <select
                  value={currentSettings.courseDifficulty}
                  onChange={e =>
                    setCurrentSettings({
                      ...currentSettings,
                      courseDifficulty: e.target.value as any,
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
                >
                  <option value="calibrated_minus_10">Calibrated -10%</option>
                  <option value="unchanged">Unchanged</option>
                  <option value="rigorous_plus_10">Rigorous +10%</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => runSimulation()}
              disabled={isSimulating}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Counterfactual Intervention</span>
            </button>
          </div>

          {/* SAVED SCENARIOS LIBRARY */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Saved Scenarios Library
                </h4>
              </div>
            </div>
            <div className="space-y-2">
              {savedScenarios.map(scen => (
                <div
                  key={scen.id}
                  onClick={() => handleLoadScenario(scen)}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 hover:border-red-600/40 hover:bg-red-50/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">{scen.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{scen.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATION COMPARISON RESULTS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <>
              {/* COMPARISON METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Predicted Mastery</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {result.scenario.predictedMastery}%
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      +{result.delta.masteryChange}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Baseline: {result.baseline.predictedMastery}%
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Academic Risk</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {result.scenario.academicRisk}%
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {result.delta.riskChange}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Baseline: {result.baseline.academicRisk}%
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Bottlenecks Resolved</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {result.scenario.bottleneckCount}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {result.delta.bottleneckChange} active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Baseline: {result.baseline.bottleneckCount}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Students Insulated</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                      {result.delta.studentsSaved}
                    </span>
                    <span className="text-xs font-mono text-slate-400">students</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Remaining at risk: {result.scenario.affectedStudents}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs sm:col-span-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Risk Propagation Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {result.scenario.riskPropagationScore}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">
                      -{(result.baseline.riskPropagationScore - result.scenario.riskPropagationScore).toFixed(2)} coefficient
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Baseline: {result.baseline.riskPropagationScore}
                  </p>
                </div>
              </div>

              {/* CAUSAL REASONING EXPLANATION */}
              <InsightPanel
                title="Causal Mechanism of Intervention"
                content={result.causalExplanation}
                modelAttribution={result.modelAttribution}
              />

              {/* CONCEPT IMPACT DELTA TABLE */}
              <ChartCard
                title="Concept Mastery Delta Analysis"
                subtitle="Predicted impact across core engineering and computing concepts"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                        <th className="py-2.5 font-medium">Concept</th>
                        <th className="py-2.5 font-medium">Course</th>
                        <th className="py-2.5 font-medium">Baseline</th>
                        <th className="py-2.5 font-medium">Simulated</th>
                        <th className="py-2.5 text-right font-medium">Risk Reduction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.conceptImpacts.map((ci, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 font-semibold text-slate-900">{ci.concept}</td>
                          <td className="py-3 text-slate-500 font-mono">{ci.course}</td>
                          <td className="py-3 font-mono text-slate-600 tabular-nums">
                            {ci.baselineMastery}%
                          </td>
                          <td className="py-3 font-mono font-bold text-emerald-700 tabular-nums">
                            {ci.scenarioMastery}%
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                            -{ci.riskReduction}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>DISCLAIMER: Computational simulation prototype for academic planning.</span>
                  <button
                    onClick={() => navigate('/reports')}
                    className="text-xs font-semibold text-red-700 hover:text-red-800"
                  >
                    Export Scenario Brief
                  </button>
                </div>
              </ChartCard>
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
              Run simulation to compute comparative counterfactual outputs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
