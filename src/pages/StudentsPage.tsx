import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Student, RiskLevel } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { RiskBadge, RiskIndicator } from '../components/common/RiskBadge.tsx';
import { FilterBar } from '../components/common/AlertCard.tsx';
import { Drawer, LoadingState, ErrorState, EmptyState } from '../components/common/States.tsx';

interface StudentsPageProps {
  navigate: (path: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ navigate }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [risk, setRisk] = useState('all');
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected Student Drawer
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getStudents({
        page: pagination.page,
        limit: pagination.limit,
        search,
        department,
        risk,
        sortBy,
        sortOrder,
      });
      setStudents(res.students);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to query student intelligence.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, department, risk, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchStudents();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="Student Telemetry"
        title="Student Analytics & Risk Profiles"
        subheading="Granular student-level vulnerability modeling. Discover prerequisite weaknesses and concept-level mastery deficits across cohorts."
      />

      {/* FILTER & SEARCH BAR */}
      <FilterBar
        actions={
          <span className="text-xs text-slate-500 font-mono">
            Total: {pagination.total} Students
          </span>
        }
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </form>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Dept:</span>
          <select
            value={department}
            onChange={e => {
              setDepartment(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Risk:</span>
          <select
            value={risk}
            onChange={e => {
              setRisk(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="all">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="riskScore">Highest Risk Score</option>
            <option value="gpa">GPA</option>
            <option value="attendanceRate">Attendance Rate</option>
            <option value="name">Name</option>
          </select>
        </div>
      </FilterBar>

      {/* DATA TABLE */}
      {isLoading ? (
        <LoadingState message="Querying student profiles..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchStudents} />
      ) : students.length === 0 ? (
        <EmptyState
          title="No student profiles matched query"
          description="Adjust your search term or department and risk filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setDepartment('all');
            setRisk('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student ID</th>
                  <th className="py-3 px-4 font-semibold">Name & Email</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">GPA</th>
                  <th className="py-3 px-4 font-semibold">Attendance</th>
                  <th className="py-3 px-4 font-semibold">Risk Score</th>
                  <th className="py-3 px-4 font-semibold">Standing</th>
                  <th className="py-3 px-4 text-right font-semibold">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(student => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.department}
                      <span className="text-[10px] text-slate-400 font-mono ml-1">
                        (Sem {student.semester})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                      {student.gpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                      {student.attendanceRate}%
                    </td>
                    <td className="py-3 px-4">
                      <RiskIndicator score={student.riskScore} />
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={student.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-semibold text-red-700 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} students)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL DRAWER */}
      <Drawer
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.name || 'Student Detail'}
        subtitle={`${selectedStudent?.studentId} · ${selectedStudent?.department} (Semester ${selectedStudent?.semester})`}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-slate-400">Current GPA</span>
                <p className="text-lg font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                  {selectedStudent.gpa.toFixed(2)}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-slate-400">Attendance</span>
                <p className="text-lg font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                  {selectedStudent.attendanceRate}%
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-slate-400">Risk Score</span>
                <p className="text-lg font-mono font-bold text-red-700 mt-0.5 tabular-nums">
                  {selectedStudent.riskScore}
                </p>
              </div>
            </div>

            {/* Academic Standing */}
            <div className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-mono">Academic Status:</span>
                <p className="text-xs font-semibold text-slate-900">{selectedStudent.status}</p>
              </div>
              <RiskBadge level={selectedStudent.riskLevel} />
            </div>

            {/* Concept Weaknesses */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-2">
                Identified Prerequisite Concept Weaknesses
              </h4>
              <div className="space-y-1.5">
                {selectedStudent.conceptWeaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-red-50/70 border border-red-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="font-semibold text-red-950">{weakness}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStudent(null);
                        navigate('/forensics');
                      }}
                      className="text-[11px] font-medium text-red-700 hover:text-red-900 underline cursor-pointer"
                    >
                      Trace Root Cause
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled Courses & Scores */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-2">
                Active Enrolled Courses & Grade Telemetry
              </h4>
              <div className="space-y-2">
                {selectedStudent.enrollments.map((enr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-xs">
                        {enr.courseCode}: {enr.courseName}
                      </span>
                      <RiskBadge level={enr.riskLevel} size="sm" />
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                      <div className="p-1.5 bg-slate-50 rounded">
                        <span className="text-slate-400">Midterm</span>
                        <p className="font-bold text-slate-800">{enr.midtermScore}%</p>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded">
                        <span className="text-slate-400">Quizzes</span>
                        <p className="font-bold text-slate-800">{enr.quizScore}%</p>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded">
                        <span className="text-slate-400">Assign</span>
                        <p className="font-bold text-slate-800">{enr.assignmentScore}%</p>
                      </div>
                      <div className="p-1.5 bg-red-50 text-red-900 rounded">
                        <span className="text-red-700">Projected</span>
                        <p className="font-bold">{enr.finalPredictedScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
