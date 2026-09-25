export type UserRole = 'SUPER_ADMIN' | 'INSTITUTION_ADMIN' | 'FACULTY' | 'ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  department?: string;
  phoneNumber?: string;
  avatar?: string;
  authProvider?: 'password' | 'google' | 'phone';
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
  lastLogin?: string;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
  prerequisites: string[];
  riskLevel: RiskLevel;
  riskScore: number;
  failureRate: number;
  enrolledStudents: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  description: string;
  instructor: string;
}

export interface Concept {
  id: string;
  code: string;
  name: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  masteryRate: number;
  failureRate: number;
  riskScore: number;
  riskLevel: RiskLevel;
  affectedStudents: number;
  prerequisiteIds: string[];
  downstreamIds: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  gpa: number;
  attendanceRate: number;
  riskLevel: RiskLevel;
  riskScore: number;
  status: 'Good Standing' | 'Academic Warning' | 'Critical Intervention';
  enrollments: {
    courseId: string;
    courseCode: string;
    courseName: string;
    midtermScore: number;
    quizScore: number;
    assignmentScore: number;
    finalPredictedScore: number;
    riskLevel: RiskLevel;
  }[];
  conceptWeaknesses: string[];
  attendanceHistory: { week: number; rate: number }[];
  riskTimeline: { month: string; score: number }[];
}

export interface Assessment {
  id: string;
  name: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  date: string;
  maxMarks: number;
  weightage: number;
  difficulty: 'High' | 'Medium' | 'Low';
  averageScore: number;
  passingRate: number;
  conceptIds: string[];
  anomaliesDetected: number;
  questionCount: number;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionNumber: number;
  conceptId: string;
  conceptName: string;
  maxMarks: number;
  averageMarks: number;
  difficultyIndex: number;
  failureRate: number;
}

export interface RiskForecastData {
  currentRisk: number;
  forecastRisk: number;
  horizon: string;
  trend: 'up' | 'down' | 'stable';
  timeline: {
    period: string;
    historical?: number;
    projected?: number;
    lowerBound?: number;
    upperBound?: number;
  }[];
  contributingFactors: {
    rank: number;
    factor: string;
    impactPercentage: number;
    direction: 'positive' | 'negative';
    description: string;
  }[];
  affectedCourses: {
    code: string;
    name: string;
    currentRisk: number;
    forecastRisk: number;
    propagationRisk: 'High' | 'Medium' | 'Low';
  }[];
  affectedConcepts: {
    name: string;
    course: string;
    riskScore: number;
    downstreamImpactCount: number;
  }[];
  propagationSummary: string;
}

export interface ForensicNode {
  id: string;
  label: string;
  type: 'failure_event' | 'course' | 'concept' | 'prerequisite_root';
  conceptName?: string;
  courseName?: string;
  mastery: number;
  failureRate: number;
  affectedStudents: number;
  causalWeight: number;
  isBottleneck?: boolean;
}

export interface ForensicEdge {
  from: string;
  to: string;
  label: string;
  probability: number;
}

export interface ForensicAnalysisResult {
  id: string;
  timestamp: string;
  courseId: string;
  courseName: string;
  assessmentId: string;
  assessmentName: string;
  cohort: string;
  targetConcept: string;
  primaryBottleneck: {
    concept: string;
    course: string;
    confidence: number;
    severity: RiskLevel;
    impactExplanation: string;
  };
  prerequisiteChain: string[];
  nodes: ForensicNode[];
  edges: ForensicEdge[];
  evidenceSignals: {
    signal: string;
    value: string;
    status: 'critical' | 'warning' | 'nominal';
    benchmark: string;
    description: string;
  }[];
  causalMethodology: string;
}

export interface DigitalTwinNode {
  id: string;
  label: string;
  type: 'Course' | 'Unit' | 'Concept' | 'Prerequisite';
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  semester?: number;
  mastery: number;
  riskScore: number;
  riskLevel: RiskLevel;
  affectedStudents: number;
  prerequisitesCount: number;
  dependenciesCount: number;
  x?: number;
  y?: number;
}

export interface DigitalTwinEdge {
  id: string;
  source: string;
  target: string;
  type: 'REQUIRES' | 'CONTAINS' | 'DEPENDS_ON';
  riskPropagationWeight: number;
}

export interface DigitalTwinGraph {
  nodes: DigitalTwinNode[];
  edges: DigitalTwinEdge[];
  stats: {
    totalCourses: number;
    totalUnits: number;
    totalConcepts: number;
    criticalBottlenecks: number;
    averageCurriculumMastery: number;
  };
}

export interface SimulationScenarioSettings {
  id?: string;
  name: string;
  description: string;
  courseOrdering: {
    courseId: string;
    originalSemester: number;
    newSemester: number;
  }[];
  prerequisiteRelationship: 'standard' | 'strengthened_bridge' | 'relaxed_concurrent';
  assessmentWeightage: {
    midtermWeight: number;
    quizWeight: number;
    assignmentWeight: number;
    finalWeight: number;
  };
  learningIntervention: 'none' | 'targeted_remedial_prerequisite' | 'adaptive_quiz_scaffolding' | 'peer_assisted_labs';
  courseDifficulty: 'unchanged' | 'calibrated_minus_10' | 'rigorous_plus_10';
  assessmentFrequency: 'biweekly' | 'weekly' | 'tri_semester';
}

export interface SimulationComparisonResult {
  id: string;
  name: string;
  timestamp: string;
  baseline: {
    predictedMastery: number;
    academicRisk: number;
    bottleneckCount: number;
    affectedStudents: number;
    riskPropagationScore: number;
  };
  scenario: {
    predictedMastery: number;
    academicRisk: number;
    bottleneckCount: number;
    affectedStudents: number;
    riskPropagationScore: number;
  };
  delta: {
    masteryChange: number;
    riskChange: number;
    bottleneckChange: number;
    studentsSaved: number;
  };
  causalExplanation: string;
  conceptImpacts: {
    concept: string;
    course: string;
    baselineMastery: number;
    scenarioMastery: number;
    riskReduction: number;
  }[];
  modelAttribution: string;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  title: string;
  courseCode: string;
  courseName: string;
  conceptName?: string;
  department: string;
  date: string;
  description: string;
  status: 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'RESOLVED';
  suggestedAction: string;
}

export interface InstitutionalReport {
  id: string;
  title: string;
  type: 'Academic Risk Report' | 'Course Health Report' | 'Curriculum Bottleneck Report' | 'Forensic Analysis Report' | 'Simulation Report';
  date: string;
  author: string;
  department: string;
  executiveSummary: string;
  keyFindings: string[];
  riskSignals: string[];
  rootCauses: string[];
  affectedAreas: string[];
  recommendations: string[];
  modelInfo: string;
}

export interface DataImportRecord {
  id: string;
  datasetType: 'Student Performance' | 'Assessment Results' | 'Curriculum' | 'Attendance' | 'Course Data';
  fileName: string;
  rowsDetected: number;
  columnsDetected: number;
  recordsImported: number;
  validationErrorsCount: number;
  validationErrors?: string[];
  uploadedBy: string;
  uploadedAt: string;
  status: 'Completed' | 'Failed' | 'Partial Success';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  resource: string;
  details: string;
  ipAddress: string;
}

export interface DashboardOverviewData {
  kpi: {
    studentsAnalyzed: number;
    coursesMonitored: number;
    highRiskConcepts: number;
    predictedAcademicRisk: number;
    criticalBottlenecks: number;
  };
  riskDistribution: {
    high: { count: number; percentage: number };
    medium: { count: number; percentage: number };
    low: { count: number; percentage: number };
  };
  riskTrend: { period: string; risk: number; benchmark: number }[];
  emergingBottlenecks: {
    id: string;
    concept: string;
    course: string;
    courseCode: string;
    risk: number;
    riskLevel: RiskLevel;
    affectedStudents: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  rootCauses: {
    id: string;
    title: string;
    signal: string;
    confidence: number;
    affectedCourse: string;
    impactScore: string;
  }[];
  curriculumHealth: {
    department: string;
    status: 'Healthy' | 'Warning' | 'Critical';
    score: number;
    healthyCourses: number;
    warningCourses: number;
    criticalCourses: number;
  }[];
  recentAlerts: Alert[];
}
