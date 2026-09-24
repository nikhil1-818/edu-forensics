import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { InstitutionalReport } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { LoadingState, ErrorState, Modal } from '../components/common/States.tsx';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<InstitutionalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReport, setSelectedReport] = useState<InstitutionalReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Forensic Analysis Report');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await api.getReports();
      setReports(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await api.generateReport({
        title: newTitle || 'Curriculum Integrity Intelligence Briefing',
        type: newType,
        department: 'Institution-Wide',
      });
      setIsModalOpen(false);
      setNewTitle('');
      fetchReports();
    } catch (err: any) {
      console.warn('Failed to generate report', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading institutional report briefings..." />;
  if (error) return <ErrorState message={error} onRetry={fetchReports} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="Executive Dossiers"
        title="Institutional Intelligence Reports"
        subheading="Curated executive summaries, bottleneck analysis, and intervention projections for university leadership and curriculum committees."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Briefing</span>
          </button>
        }
      />

      {/* REPORTS LIST */}
      <div className="space-y-3">
        {reports.map(rep => (
          <div
            key={rep.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded">
                  {rep.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {rep.date} · {rep.department}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{rep.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-3xl line-clamp-2">
                {rep.executiveSummary}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setSelectedReport(rep)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Read Briefing</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT VIEWER MODAL */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || 'Report Briefing'}
        maxWidth="max-w-3xl"
      >
        {selectedReport && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-500">
              <span>Date: {selectedReport.date}</span>
              <span>Author: {selectedReport.author}</span>
              <span>Scope: {selectedReport.department}</span>
            </div>

            {/* Executive Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 font-mono mb-1.5">
                Executive Summary
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 bg-red-50/30 p-4 rounded-xl border border-red-100">
                {selectedReport.executiveSummary}
              </p>
            </div>

            {/* Key Findings */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                Key Empirical Findings
              </h4>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-700 leading-relaxed">
                {selectedReport.keyFindings.map((kf, idx) => (
                  <li key={idx}>{kf}</li>
                ))}
              </ul>
            </div>

            {/* Root Causes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                Causal Root Causes
              </h4>
              <div className="space-y-1.5">
                {selectedReport.rootCauses.map((rc, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    {rc}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                Actionable Recommendations
              </h4>
              <div className="space-y-1.5">
                {selectedReport.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50/70 border border-emerald-200 text-emerald-950 rounded-lg font-medium"
                  >
                    ✓ {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>Attribution: {selectedReport.modelInfo}</span>
              <button
                onClick={() => window.print()}
                className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* GENERATE NEW REPORT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Institutional Intelligence Report"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Report Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Midterm 1 Prerequisite Vulnerability Synthesis"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Report Category
            </label>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              <option value="Academic Risk Report">Academic Risk Report</option>
              <option value="Forensic Analysis Report">Forensic Analysis Report</option>
              <option value="Curriculum Bottleneck Report">Curriculum Bottleneck Report</option>
              <option value="Course Health Report">Course Health Report</option>
              <option value="Simulation Report">Simulation Report</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {isGenerating ? 'Compiling Dossier...' : 'Generate Dossier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
