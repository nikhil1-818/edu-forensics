import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Server,
  Activity,
  UserPlus,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { User, UserRole, AuditLog } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard } from '../components/common/ChartCard.tsx';
import { LoadingState, ErrorState, Modal } from '../components/common/States.tsx';

export const AdminPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'system' | 'users' | 'audit'>('system');
  const [systemData, setSystemData] = useState<any | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New user modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('FACULTY');
  const [newUserDept, setNewUserDept] = useState('Computer Science');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sys, usrList] = await Promise.all([
        api.getAdminSystem(),
        api.getAdminUsers(),
      ]);
      setSystemData(sys);
      setUsers(usrList);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      await api.createAdminUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        department: newUserDept,
      });
      setIsAddUserOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to provision user.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateStatus = async (user: User, newStatus: 'active' | 'suspended') => {
    try {
      await api.updateAdminUser(user.id, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      console.warn('Status update failed', err);
    }
  };

  if (isLoading) return <LoadingState message="Connecting to secure administrative core..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAdminData} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        kicker="Platform Governance"
        title="Institutional Administration Console"
        subheading="System-wide role access control, machine learning model health, database normalization telemetry, and immutable audit logs."
        actions={
          activeTab === 'users' && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision User</span>
            </button>
          )
        }
      />

      {/* SEGMENTED TAB SELECTOR */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'system'
              ? 'bg-red-50 text-red-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>System & Model Health</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-red-50 text-red-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User & RBAC Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-red-50 text-red-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Security Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM & MODEL HEALTH */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400">Database Engine</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {systemData.databaseType}
              </p>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">Status: Nominal (ACID)</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400">Monitored Cohort</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {systemData.studentsCount} Students · {systemData.coursesCount} Courses
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Undergraduate Engineering</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400">System Security</span>
              <p className="text-base font-bold text-slate-900 mt-1">Role-Based Access (RBAC)</p>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">FERPA Compliant</p>
            </div>
          </div>

          {/* Machine Learning Telemetry */}
          <ChartCard
            title="Computational AI & Inference Pipeline Status"
            subtitle="Active models powering Bayesian forensics, survival forecasting, and counterfactual simulations"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-2.5 font-medium">Model Architecture</th>
                    <th className="py-2.5 font-medium">State</th>
                    <th className="py-2.5 font-medium">Mean Latency</th>
                    <th className="py-2.5 font-medium">Accuracy / Nodes</th>
                    <th className="py-2.5 text-right font-medium">Health Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {systemData.models.map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 font-semibold text-slate-900 font-sans">{m.name}</td>
                      <td className="py-3 text-emerald-700 font-bold">{m.status}</td>
                      <td className="py-3 text-slate-600">{m.latency}</td>
                      <td className="py-3 text-slate-700">
                        {m.accuracy ? `Acc: ${m.accuracy}` : m.nodes ? `${m.nodes} Nodes` : `${m.scenariosEvaluated} Runs`}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Nominal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">User Name & Email</th>
                  <th className="py-3 px-4 font-semibold">Assigned Role</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Account Status</th>
                  <th className="py-3 px-4 font-semibold">Last Authentication</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.department || 'General'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{u.lastLogin || 'Never'}</td>
                    <td className="py-3 px-4 text-right">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateStatus(u, 'suspended')}
                          className="text-[11px] text-red-600 hover:text-red-800 cursor-pointer font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u, 'active')}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 cursor-pointer font-medium"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Security Audit Trail</h3>
            <span className="text-xs text-slate-400 font-mono">Append-Only Immutable Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Actor</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Resource</th>
                  <th className="py-3 px-4 font-semibold">Details</th>
                  <th className="py-3 px-4 text-right font-semibold">IP Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {systemData.auditLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-sans">{log.user}</td>
                    <td className="py-3 px-4 text-red-700 font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-slate-700 font-sans">{log.resource}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans">{log.details}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROVISION USER MODAL */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision Institutional User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Full Name
            </label>
            <input
              type="text"
              required
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              placeholder="Prof. Alan Turing"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
              placeholder="alan.turing@npu.edu"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Assigned Role
            </label>
            <select
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              <option value="FACULTY">FACULTY (Courses, assessments, student telemetry)</option>
              <option value="ANALYST">ANALYST (Forensics, forecasts, dossiers)</option>
              <option value="INSTITUTION_ADMIN">INSTITUTION_ADMIN (Simulations, curriculum, users)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full system control)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-mono">
              Department
            </label>
            <select
              value={newUserDept}
              onChange={e => setNewUserDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingUser}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {isCreatingUser ? 'Provisioning...' : 'Provision User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
