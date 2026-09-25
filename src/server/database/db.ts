import {
  SEED_INSTITUTION,
  SEED_DEPARTMENTS,
  SEED_COURSES,
  SEED_CONCEPTS,
  SEED_ASSESSMENTS,
  SEED_QUESTIONS,
  SEED_ALERTS,
  SEED_REPORTS,
  SEED_USERS,
  SEED_IMPORTS,
  SEED_AUDIT_LOGS,
  SEED_STUDENTS,
} from './seedData.ts';
import {
  User,
  Institution,
  Department,
  Course,
  Concept,
  Student,
  Assessment,
  AssessmentQuestion,
  Alert,
  InstitutionalReport,
  DataImportRecord,
  AuditLog,
  SimulationScenarioSettings,
  SimulationComparisonResult,
} from './types.ts';

class DatabaseStore {
  institution: Institution = { ...SEED_INSTITUTION };
  departments: Department[] = [...SEED_DEPARTMENTS];
  courses: Course[] = [...SEED_COURSES];
  concepts: Concept[] = [...SEED_CONCEPTS];
  assessments: Assessment[] = [...SEED_ASSESSMENTS];
  questions: AssessmentQuestion[] = [...SEED_QUESTIONS];
  students: Student[] = [...SEED_STUDENTS];
  alerts: Alert[] = [...SEED_ALERTS];
  reports: InstitutionalReport[] = [...SEED_REPORTS];
  users: User[] = [...SEED_USERS];
  imports: DataImportRecord[] = [...SEED_IMPORTS];
  auditLogs: AuditLog[] = [...SEED_AUDIT_LOGS];

  savedScenarios: SimulationScenarioSettings[] = [
    {
      id: 'scen-baseline',
      name: 'Status Quo Baseline (Spring 2026)',
      description: 'Current standard curriculum sequencing and 35% midterm weighting.',
      courseOrdering: [
        { courseId: 'course-cs201', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-math202', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-cs304', originalSemester: 4, newSemester: 4 },
        { courseId: 'course-cs305', originalSemester: 5, newSemester: 5 },
        { courseId: 'course-cs401', originalSemester: 7, newSemester: 7 },
      ],
      prerequisiteRelationship: 'standard',
      assessmentWeightage: {
        midtermWeight: 35,
        quizWeight: 15,
        assignmentWeight: 20,
        finalWeight: 30,
      },
      learningIntervention: 'none',
      courseDifficulty: 'unchanged',
      assessmentFrequency: 'biweekly',
    },
    {
      id: 'scen-remedial-bridge',
      name: 'Prerequisite Bridging & Diagnostic Scaffolding',
      description: 'Mandatory 2-week Integration review module before Differential Equations with weekly formative quizzes.',
      courseOrdering: [
        { courseId: 'course-cs201', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-math202', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-cs304', originalSemester: 4, newSemester: 4 },
        { courseId: 'course-cs305', originalSemester: 5, newSemester: 5 },
        { courseId: 'course-cs401', originalSemester: 7, newSemester: 7 },
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
    },
    {
      id: 'scen-formative-shift',
      name: 'Counterfactual Alpha: Formative Weighting Shift',
      description: 'Shift 10% weight from high-stakes midterm into continuous formative quizzes with weekly diagnostic feedback.',
      courseOrdering: [
        { courseId: 'course-cs201', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-math202', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-cs304', originalSemester: 4, newSemester: 4 },
        { courseId: 'course-cs305', originalSemester: 5, newSemester: 5 },
        { courseId: 'course-cs401', originalSemester: 7, newSemester: 7 },
      ],
      prerequisiteRelationship: 'strengthened_bridge',
      assessmentWeightage: {
        midtermWeight: 20,
        quizWeight: 35,
        assignmentWeight: 20,
        finalWeight: 25,
      },
      learningIntervention: 'adaptive_quiz_scaffolding',
      courseDifficulty: 'unchanged',
      assessmentFrequency: 'weekly',
    },
    {
      id: 'scen-peer-assisted',
      name: 'Peer-Assisted Lab Mentorship & Concurrency Review',
      description: 'Pair struggling students in Operating Systems threads with senior student lab mentors.',
      courseOrdering: [
        { courseId: 'course-cs201', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-math202', originalSemester: 3, newSemester: 3 },
        { courseId: 'course-cs304', originalSemester: 4, newSemester: 4 },
        { courseId: 'course-cs305', originalSemester: 5, newSemester: 5 },
        { courseId: 'course-cs401', originalSemester: 7, newSemester: 7 },
      ],
      prerequisiteRelationship: 'standard',
      assessmentWeightage: {
        midtermWeight: 30,
        quizWeight: 20,
        assignmentWeight: 25,
        finalWeight: 25,
      },
      learningIntervention: 'peer_assisted_labs',
      courseDifficulty: 'unchanged',
      assessmentFrequency: 'biweekly',
    },
  ];

  // User Auth & Session Store
  activeSessions: Map<string, User> = new Map();

  constructor() {
    // Seed an initial session for quick demo auth if needed
    this.activeSessions.set('demo-session-super', this.users[0]);
  }

  logAudit(user: string, action: string, resource: string, details: string, ipAddress: string = '127.0.0.1') {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      resource,
      details,
      ipAddress,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    return log;
  }

  getDashboardStats() {
    const totalStudents = this.students.length;
    const coursesMonitored = this.courses.length;
    const highRiskConcepts = this.concepts.filter(c => c.riskLevel === 'HIGH').length;
    
    // Average predicted risk across all students
    const avgRisk = Math.round(
      this.students.reduce((acc, s) => acc + s.riskScore, 0) / (totalStudents || 1)
    );

    // Critical bottlenecks (concepts with failure rate > 40% and downstream dependencies >= 2)
    const criticalBottlenecks = this.concepts.filter(
      c => c.failureRate > 40 && c.downstreamIds.length >= 1
    ).length;

    // Distribution
    const highRiskCount = this.students.filter(s => s.riskLevel === 'HIGH').length;
    const medRiskCount = this.students.filter(s => s.riskLevel === 'MEDIUM').length;
    const lowRiskCount = this.students.filter(s => s.riskLevel === 'LOW').length;

    // Top emerging bottlenecks
    const emergingBottlenecks = this.concepts
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        concept: c.name,
        course: c.courseName,
        courseCode: c.courseCode,
        risk: c.riskScore,
        riskLevel: c.riskLevel,
        affectedStudents: c.affectedStudents,
        trend: c.trend,
      }));

    // Root cause signals
    const rootCauses = [
      {
        id: 'rc-1',
        title: 'Prerequisite Decay in Multivariable Integration',
        signal: 'Calculus II & ODE performance decline is strongly associated with weak prerequisite mastery in Integration Techniques.',
        confidence: 94,
        affectedCourse: 'MATH202',
        impactScore: 'High Risk Propagation',
      },
      {
        id: 'rc-2',
        title: 'Pointer & Dynamic Memory Choke Point',
        signal: 'Operating Systems concurrency failures trace back to unstable dynamic memory pointers from CS201.',
        confidence: 89,
        affectedCourse: 'CS305',
        impactScore: 'Critical Bottleneck',
      },
      {
        id: 'rc-3',
        title: 'Asymptotic Complexity Evaluation Deficit',
        signal: 'Graph traversal algorithm failures reflect incomplete grasp of binary heap priority queue representations.',
        confidence: 82,
        affectedCourse: 'CS201',
        impactScore: 'Moderate Propagation',
      },
    ];

    // Curriculum health
    const curriculumHealth = [
      { department: 'Computer Science', status: 'Warning', score: 71, healthyCourses: 3, warningCourses: 1, criticalCourses: 1 },
      { department: 'Electrical Engineering', status: 'Critical', score: 58, healthyCourses: 0, warningCourses: 0, criticalCourses: 1 },
      { department: 'Mechanical Engineering', status: 'Healthy', score: 86, healthyCourses: 4, warningCourses: 0, criticalCourses: 0 },
    ];

    return {
      kpi: {
        studentsAnalyzed: totalStudents,
        coursesMonitored,
        highRiskConcepts,
        predictedAcademicRisk: avgRisk,
        criticalBottlenecks,
      },
      riskDistribution: {
        high: { count: highRiskCount, percentage: Math.round((highRiskCount / totalStudents) * 100) },
        medium: { count: medRiskCount, percentage: Math.round((medRiskCount / totalStudents) * 100) },
        low: { count: lowRiskCount, percentage: Math.round((lowRiskCount / totalStudents) * 100) },
      },
      riskTrend: [
        { period: 'Sep 2025', risk: 28, benchmark: 30 },
        { period: 'Oct 2025', risk: 32, benchmark: 31 },
        { period: 'Nov 2025', risk: 36, benchmark: 32 },
        { period: 'Dec 2025', risk: 34, benchmark: 32 },
        { period: 'Jan 2026', risk: 39, benchmark: 33 },
        { period: 'Feb 2026', risk: 42, benchmark: 34 },
        { period: 'Mar 2026 (Now)', risk: avgRisk, benchmark: 35 },
        { period: 'Apr 2026 (Proj)', risk: 48, benchmark: 35 },
        { period: 'May 2026 (Finals)', risk: 54, benchmark: 36 },
      ],
      emergingBottlenecks,
      rootCauses,
      curriculumHealth,
      recentAlerts: this.alerts.slice(0, 4),
    };
  }
}

export const db = new DatabaseStore();
