import {
  User,
  UserRole,
  DashboardOverviewData,
  ForensicAnalysisResult,
  RiskForecastData,
  DigitalTwinGraph,
  SimulationScenarioSettings,
  SimulationComparisonResult,
  Course,
  Concept,
  Student,
  Assessment,
  Alert,
  InstitutionalReport,
  DataImportRecord,
  AuditLog,
} from '../types.ts';

const TOKEN_KEY = 'eduforensics_jwt_token';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API Error (${response.status})`);
    }

    return response.json();
  }

  // Auth
  async login(payload: { email?: string; password?: string; role?: UserRole }) {
    const res = await this.request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    return res.user;
  }

  async signup(payload: { name: string; email: string; department?: string; role?: UserRole }) {
    const res = await this.request<{ token: string; user: User }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    return res.user;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await this.request<{ user: User }>('/api/auth/me');
      return res.user;
    } catch {
      return null;
    }
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Dashboard
  async getDashboardOverview(): Promise<DashboardOverviewData> {
    return this.request<DashboardOverviewData>('/api/dashboard/overview');
  }

  // Forensics
  async getForensicOptions() {
    return this.request<{
      courses: { id: string; code: string; name: string; failureRate: number }[];
      assessments: { id: string; name: string; courseId: string; date: string }[];
      concepts: { id: string; name: string; code: string; courseId: string; riskLevel: string }[];
      cohorts: string[];
    }>('/api/forensics/options');
  }

  async runForensics(params: {
    courseId?: string;
    assessmentId?: string;
    cohort?: string;
    conceptId?: string;
  }): Promise<ForensicAnalysisResult> {
    return this.request<ForensicAnalysisResult>('/api/forensics/analyze', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Risk Forecast
  async getRiskForecast(params?: { courseId?: string; department?: string; horizon?: string }): Promise<RiskForecastData> {
    const query = new URLSearchParams();
    if (params?.courseId) query.set('courseId', params.courseId);
    if (params?.department) query.set('department', params.department);
    if (params?.horizon) query.set('horizon', params.horizon);
    return this.request<RiskForecastData>(`/api/risk/forecast?${query.toString()}`);
  }

  // Digital Twin
  async getDigitalTwinGraph(params?: {
    courseId?: string;
    semester?: number;
    riskOverlay?: boolean;
    masteryOverlay?: boolean;
  }): Promise<DigitalTwinGraph> {
    const query = new URLSearchParams();
    if (params?.courseId) query.set('courseId', params.courseId);
    if (params?.semester) query.set('semester', params.semester.toString());
    if (params?.riskOverlay) query.set('riskOverlay', 'true');
    if (params?.masteryOverlay) query.set('masteryOverlay', 'true');
    return this.request<DigitalTwinGraph>(`/api/digital-twin/graph?${query.toString()}`);
  }

  async traceDigitalTwin(nodeId: string, direction: 'upstream' | 'downstream') {
    return this.request<{
      activeNodeId: string;
      pathNodeIds: string[];
      affectedDependenciesCount: number;
      explanation: string;
    }>('/api/digital-twin/trace', {
      method: 'POST',
      body: JSON.stringify({ nodeId, direction }),
    });
  }

  // Simulator
  async runSimulation(settings: SimulationScenarioSettings): Promise<SimulationComparisonResult> {
    return this.request<SimulationComparisonResult>('/api/simulator/run', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getSimulationScenarios(): Promise<SimulationScenarioSettings[]> {
    return this.request<SimulationScenarioSettings[]>('/api/simulator/scenarios');
  }

  async saveSimulationScenario(scenario: SimulationScenarioSettings): Promise<SimulationScenarioSettings> {
    return this.request<SimulationScenarioSettings>('/api/simulator/scenarios', {
      method: 'POST',
      body: JSON.stringify(scenario),
    });
  }

  // Curriculum & Courses
  async getCurriculum(): Promise<{ courses: Course[]; concepts: Concept[] }> {
    return this.request<{ courses: Course[]; concepts: Concept[] }>('/api/curriculum');
  }

  async getCourseDetail(id: string): Promise<{
    course: Course;
    concepts: Concept[];
    assessments: Assessment[];
    enrolledStudentsCount: number;
  }> {
    return this.request(`/api/curriculum/${id}`);
  }

  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/api/courses');
  }

  // Students
  async getStudents(params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    risk?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    students: Student[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search);
    if (params.department) query.set('department', params.department);
    if (params.risk) query.set('risk', params.risk);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    return this.request(`/api/students?${query.toString()}`);
  }

  async getStudentDetail(id: string): Promise<Student> {
    return this.request<Student>(`/api/students/${id}`);
  }

  // Assessments
  async getAssessments(): Promise<Assessment[]> {
    return this.request<Assessment[]>('/api/assessments');
  }

  async getAssessmentDetail(id: string) {
    return this.request<{
      assessment: Assessment;
      questions: any[];
      concepts: Concept[];
    }>(`/api/assessments/${id}`);
  }

  async runAssessmentAnalysis(id: string): Promise<ForensicAnalysisResult> {
    return this.request<ForensicAnalysisResult>(`/api/assessments/${id}/analyze`, {
      method: 'POST',
    });
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>('/api/alerts');
  }

  async updateAlertStatus(id: string, status: 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'RESOLVED'): Promise<Alert> {
    return this.request<Alert>(`/api/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Reports
  async getReports(): Promise<InstitutionalReport[]> {
    return this.request<InstitutionalReport[]>('/api/reports');
  }

  async getReportDetail(id: string): Promise<InstitutionalReport> {
    return this.request<InstitutionalReport>(`/api/reports/${id}`);
  }

  async generateReport(payload: { title: string; type: string; department: string }): Promise<InstitutionalReport> {
    return this.request<InstitutionalReport>('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Data Ingestion
  async getDataImports(): Promise<DataImportRecord[]> {
    return this.request<DataImportRecord[]>('/api/data/imports');
  }

  async uploadData(payload: {
    datasetType: 'Student Performance' | 'Assessment Results' | 'Curriculum' | 'Attendance' | 'Course Data';
    fileName: string;
    fileContent: string;
  }): Promise<{ success: boolean; record: DataImportRecord; message: string; errors?: string[] }> {
    return this.request('/api/data/import', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Admin
  async getAdminSystem(): Promise<{
    institution: any;
    usersCount: number;
    studentsCount: number;
    coursesCount: number;
    models: any[];
    auditLogs: AuditLog[];
    systemHealth: string;
    databaseType: string;
  }> {
    return this.request('/api/admin/system');
  }

  async getAdminUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  async createAdminUser(payload: { name: string; email: string; role: UserRole; department?: string }): Promise<User> {
    return this.request<User>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateAdminUser(id: string, payload: { role?: UserRole; status?: string; department?: string }): Promise<User> {
    return this.request<User>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // AI Explanation
  async explainWithAI(domain: string, metrics: Record<string, any>): Promise<string> {
    const res = await this.request<{ explanation: string }>('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ domain, metrics }),
    });
    return res.explanation;
  }
}

export const api = new ApiClient();
