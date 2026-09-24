import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { DataImportRecord } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard } from '../components/common/ChartCard.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

type DatasetType =
  | 'Student Performance'
  | 'Assessment Results'
  | 'Curriculum'
  | 'Attendance'
  | 'Course Data';

export const DataIngestionPage: React.FC = () => {
  const [imports, setImports] = useState<DataImportRecord[]>([]);
  const [selectedDatasetType, setSelectedDatasetType] = useState<DatasetType>('Student Performance');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    errors?: string[];
  } | null>(null);

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    try {
      const records = await api.getDataImports();
      setImports(records);
    } catch (err) {
      console.warn('Failed to fetch import logs', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = async event => {
      const content = event.target?.result as string;
      try {
        const res = await api.uploadData({
          datasetType: selectedDatasetType,
          fileName: file.name,
          fileContent: content,
        });
        setUploadResult({
          success: res.success,
          message: res.message,
          errors: res.errors,
        });
        fetchImports();
      } catch (err: any) {
        setUploadResult({
          success: false,
          message: err.message || 'Upload failed during validation.',
          errors: [err.message || 'Malformed schema structure.'],
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = (type: DatasetType) => {
    window.open(`/api/data/template/${encodeURIComponent(type)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Data Pipeline Operations"
        title="Institutional Data Ingestion"
        subheading="Ingest student performance, item discrimination results, curriculum maps, and attendance telemetry. Validates against schema boundaries before knowledge graph ingestion."
      />

      {/* UPLOAD COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload Dropzone & Category Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">1. Select Ingestion Stream</h3>
            <span className="text-xs font-mono text-slate-400">CSV & JSON Supported</span>
          </div>

          {/* Dataset Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              'Student Performance',
              'Assessment Results',
              'Curriculum',
              'Attendance',
              'Course Data',
            ].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedDatasetType(type as DatasetType)}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedDatasetType === type
                    ? 'border-red-700 bg-red-50/80 text-red-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Upload Drop Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors relative">
            <UploadCloud className="w-8 h-8 text-red-700 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Upload {selectedDatasetType} Dataset
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Drag and drop CSV/JSON file here or click to browse
            </p>

            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* Validation Feedback */}
          {isUploading && (
            <div className="p-4 rounded-xl bg-slate-100 flex items-center gap-3 text-xs text-slate-700 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-red-700" />
              <span>Verifying schema columns and data integrity against FERPA standards...</span>
            </div>
          )}

          {uploadResult && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                uploadResult.success
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-red-50/80 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {uploadResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span>{uploadResult.message}</span>
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <ul className="list-disc pl-5 mt-2 space-y-0.5 text-[11px] text-red-800 font-mono">
                  {uploadResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right: Downloadable Templates */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Standard Templates</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download clean CSV schemas with sample normalized rows.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { type: 'Student Performance', desc: 'student_id, gpa, attendance_rate' },
              { type: 'Assessment Results', desc: 'assessment_id, student_id, score_obtained' },
              { type: 'Curriculum', desc: 'course_code, prerequisites, concepts' },
              { type: 'Attendance', desc: 'student_id, session_date, status' },
              { type: 'Course Data', desc: 'course_code, instructor, enrolled_count' },
            ].map(item => (
              <div
                key={item.type}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item.type}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                    {item.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(item.type as DatasetType)}
                  className="p-1.5 text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="Download CSV Template"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IMPORT AUDIT LOG TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Data Ingestion Records</h3>
          <span className="text-xs text-slate-400 font-mono">Real-Time Validation Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Dataset Type</th>
                <th className="py-3 px-4 font-semibold">File Name</th>
                <th className="py-3 px-4 font-semibold">Rows Ingested</th>
                <th className="py-3 px-4 font-semibold">Validation Errors</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Uploaded By</th>
                <th className="py-3 px-4 text-right font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {imports.map(imp => (
                <tr key={imp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{imp.datasetType}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{imp.fileName}</td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    {imp.recordsImported} / {imp.rowsDetected}
                  </td>
                  <td className="py-3 px-4">
                    {imp.validationErrorsCount > 0 ? (
                      <span className="text-red-600 font-mono font-bold">
                        {imp.validationErrorsCount} errors
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-mono">0 errors</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        imp.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {imp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{imp.uploadedBy}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">
                    {imp.uploadedAt.replace('T', ' ').substring(0, 19)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
