import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Assessment } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard } from '../components/common/ChartCard.tsx';
import { RiskBadge } from '../components/common/RiskBadge.tsx';
import { LoadingState, ErrorState, Modal } from '../components/common/States.tsx';

interface AssessmentsPageProps {
  navigate: (path: string) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ navigate }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await api.getAssessments();
      setAssessments(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load assessments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = async (assessment: Assessment) => {
    setIsDetailLoading(true);
    try {
      const detail = await api.getAssessmentDetail(assessment.id);
      setSelectedAssessment(detail);
    } catch (err) {
      console.warn('Failed to load assessment detail', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading institutional assessment records..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAssessments} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="Evaluation Telemetry"
        title="Assessments & Item Failure Analysis"
        subheading="Question-level discrimination indices, statistical failure rates, and prerequisite misconception detection."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map(asm => (
          <div
            key={asm.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {asm.courseCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{asm.name}</h3>
                </div>
                {asm.anomaliesDetected > 0 && (
                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {asm.anomaliesDetected} Anomalies
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>{asm.date}</span>
                <span>·</span>
                <span>Weight: {asm.weightage}%</span>
              </div>

              {/* Assessment Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Avg Score</span>
                  <p
                    className={`font-bold mt-0.5 tabular-nums ${
                      asm.averageScore < 60 ? 'text-red-700' : 'text-slate-800'
                    }`}
                  >
                    {asm.averageScore.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Pass Rate</span>
                  <p className="font-bold text-slate-800 mt-0.5 tabular-nums">
                    {asm.passingRate}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Questions</span>
                  <p className="font-bold text-slate-800 mt-0.5 tabular-nums">
                    {asm.questionCount} items
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenDetail(asm)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Question Breakdown
              </button>

              <button
                onClick={() => navigate(`/forensics?courseId=${asm.courseId}&assessmentId=${asm.id}`)}
                className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Forensics Run</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QUESTION LEVEL DETAIL MODAL */}
      <Modal
        isOpen={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        title={selectedAssessment ? `${selectedAssessment.assessment.name} - Question Breakdown` : ''}
        maxWidth="max-w-3xl"
      >
        {selectedAssessment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono">
              <span>Course: {selectedAssessment.assessment.courseName}</span>
              <span>Average: {selectedAssessment.assessment.averageScore.toFixed(1)}%</span>
              <span className="text-red-700 font-bold">
                Anomalies Detected: {selectedAssessment.assessment.anomaliesDetected}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-2.5 font-medium">Q#</th>
                    <th className="py-2.5 font-medium">Target Concept</th>
                    <th className="py-2.5 font-medium">Max Marks</th>
                    <th className="py-2.5 font-medium">Avg Marks</th>
                    <th className="py-2.5 font-medium">Discrimination</th>
                    <th className="py-2.5 text-right font-medium">Failure Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedAssessment.questions.map((q: any) => (
                    <tr
                      key={q.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        q.failureRate > 45 ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-slate-900">Q{q.questionNumber}</td>
                      <td className="py-3 font-semibold text-slate-800">{q.conceptName}</td>
                      <td className="py-3 font-mono text-slate-600">{q.maxMarks}</td>
                      <td className="py-3 font-mono text-slate-800 font-bold">{q.averageMarks}</td>
                      <td className="py-3 font-mono text-slate-600">
                        {q.difficultyIndex.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-red-700">
                        {q.failureRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  const aid = selectedAssessment.assessment.id;
                  const cid = selectedAssessment.assessment.courseId;
                  setSelectedAssessment(null);
                  navigate(`/forensics?courseId=${cid}&assessmentId=${aid}`);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Launch Causal Forensics on Question Misconceptions</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
