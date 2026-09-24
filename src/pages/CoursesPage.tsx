import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  GitBranch,
  Cpu,
  FlaskConical,
  ExternalLink,
  ChevronRight,
  User,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Course } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { RiskBadge, RiskIndicator } from '../components/common/RiskBadge.tsx';
import { FilterBar } from '../components/common/AlertCard.tsx';
import { LoadingState, ErrorState, Modal } from '../components/common/States.tsx';

interface CoursesPageProps {
  navigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ navigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getCourses();
      setCourses(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === 'all' || c.departmentName === department;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="Curriculum Management"
        title="Courses & Prerequisite Catalog"
        subheading="Cross-departmental monitoring of course health, failure probabilities, and prerequisite chain integrity."
      />

      <FilterBar
        actions={
          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredCourses.length} Courses
          </span>
        }
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses or instructor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Department:</span>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingState message="Loading course curriculum data..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCourses} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-red-700">{c.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{c.name}</h3>
                  </div>
                  <RiskBadge level={c.riskLevel} size="sm" />
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                  {c.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Enrolled</span>
                    <p className="font-bold text-slate-800 tabular-nums">
                      {c.enrolledStudents} students
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Failure Rate</span>
                    <p className="font-bold text-red-700 tabular-nums">{c.failureRate}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Semester</span>
                    <p className="font-medium text-slate-700">Sem {c.semester} ({c.credits} cr)</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Risk Score</span>
                    <p className="font-bold text-slate-800 tabular-nums">{c.riskScore} / 100</p>
                  </div>
                </div>

                {/* Prerequisites list */}
                <div className="mt-3 text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">
                    Mandatory Prerequisites:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.prerequisites.length > 0 ? (
                      c.prerequisites.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-mono rounded"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">None (Foundational)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourse(c)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  View Details
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/forensics?courseId=${c.id}`)}
                    className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    title="Run Forensics"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/digital-twin?courseId=${c.id}`)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                    title="View in Digital Twin"
                  >
                    <Cpu className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COURSE DETAIL MODAL */}
      <Modal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse ? `${selectedCourse.code}: ${selectedCourse.name}` : 'Course Detail'}
      >
        {selectedCourse && (
          <div className="space-y-5 text-xs">
            <div>
              <p className="text-slate-600 leading-relaxed text-sm">{selectedCourse.description}</p>
              <div className="mt-3 flex items-center gap-4 text-slate-500 font-mono">
                <span>Instructor: {selectedCourse.instructor}</span>
                <span>·</span>
                <span>{selectedCourse.departmentName}</span>
                <span>·</span>
                <span>Semester {selectedCourse.semester}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px]">Enrollment</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedCourse.enrolledStudents}
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px]">Course Failure Rate</span>
                <p className="text-base font-bold text-red-700 mt-0.5">
                  {selectedCourse.failureRate}%
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px]">Prerequisite Health</span>
                <p className="text-base font-bold text-amber-700 mt-0.5">
                  {selectedCourse.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  navigate(`/forensics?courseId=${selectedCourse.id}`);
                }}
                className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Deconstruct in Forensics</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCourse(null);
                  navigate(`/digital-twin?courseId=${selectedCourse.id}`);
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Inspect in Digital Twin</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const CurriculumPage: React.FC<CoursesPageProps> = props => {
  return <CoursesPage {...props} />;
};
