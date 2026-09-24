import React, { useState } from 'react';
import {
  GitBranch,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';
import loginVisual from '../assets/images/eduforensics_login_visual_1790243554712.jpg';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('dean.mitchell@npu.edu');
  const [password, setPassword] = useState('EnterprisePassword2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRoleClick = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginAsDemo(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDE: Brand & Capability Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background visual asset */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={loginVisual}
            alt="Forensic Intelligence Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold font-mono text-sm shadow-xs">
              EF
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              EDUFORENSICS
            </span>
          </div>

          <div className="mt-16 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Understand why learning systems fail.
            </h1>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Transform raw academic, assessment, and LMS telemetry into explainable intelligence,
              predictive risk signals, and computational curriculum simulations.
            </p>

            {/* 3 Core Capability Indicators */}
            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Learning Failure Forensics</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Bayesian causal DAGs trace examination failure back to foundational prerequisite decay.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Academic Risk Forecasting</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-examination risk indicators with transparent multi-factor causal attribution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Curriculum Digital Twin</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Living knowledge graph modeling courses, concepts, and prerequisite choke points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="relative z-10 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>AES-256 Encrypted · FERPA Compliant</span>
          </div>
          <span>National Polytechnic University Instance</span>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login & Demo Quick-Select */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-xs font-mono">
                EF
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                EDUFORENSICS
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Authenticate using your institutional credentials or single sign-on.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Direct Demo Roles Picker */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Demo Quick-Select (One Click)
              </span>
              <UserCheck className="w-3.5 h-3.5 text-red-700" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoRoleClick('INSTITUTION_ADMIN')}
                className="p-2 rounded-lg border border-slate-200 hover:border-red-600/50 hover:bg-red-50/40 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-slate-900 group-hover:text-red-700">
                  Dean / Admin
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Dean Mitchell</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleClick('FACULTY')}
                className="p-2 rounded-lg border border-slate-200 hover:border-red-600/50 hover:bg-red-50/40 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-slate-900 group-hover:text-red-700">
                  Faculty Prof
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Prof. Ronald Chen</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleClick('ANALYST')}
                className="p-2 rounded-lg border border-slate-200 hover:border-red-600/50 hover:bg-red-50/40 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-slate-900 group-hover:text-red-700">
                  Intelligence Analyst
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Elena Rostova</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleClick('SUPER_ADMIN')}
                className="p-2 rounded-lg border border-slate-200 hover:border-red-600/50 hover:bg-red-50/40 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-slate-900 group-hover:text-red-700">
                  Super Admin
                </p>
                <p className="text-[10px] text-slate-500 font-mono">System Architect</p>
              </button>
            </div>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-400 font-mono text-[10px]">
                Or enter password
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 transition-colors"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-red-700 hover:text-red-800 font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 transition-colors"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Institutional ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <span>New institutional deployment? </span>
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-red-700 hover:text-red-800"
            >
              Register Faculty Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
