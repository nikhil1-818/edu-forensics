import React, { useState } from 'react';
import { Loader2, ArrowRight, ArrowLeft, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';

export const SignupPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState('Nikhil Tyagi');
  const [email, setEmail] = useState('nikhiltyagi8093@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('Academic Intelligence & Institutional Research');
  const [role, setRole] = useState<UserRole>('INSTITUTION_ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signup(name, email, department, role, phoneNumber);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle({
        email: email.trim() || 'nikhiltyagi8093@gmail.com',
        name: name.trim() || 'Nikhil Tyagi',
        role,
        department,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-xs font-mono">
              EF
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-mono">
                EDUFORENSICS
              </span>
              <p className="text-[10px] text-red-700 font-mono font-semibold uppercase leading-none">
                Intelligence Deployment
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
            Role Setup
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Register Institutional Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Join National Polytechnic University's academic intelligence deployment.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* 1-Click Google Registration */}
        <div className="mt-5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Quick Google Registration</span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Recommended
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Register instantly with your verified Google account ({email || 'nikhiltyagi8093@gmail.com'}).
          </p>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Register with Google as {role}</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-mono text-[10px]">
              Or fill registration details
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name & Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Prof. Jane Doe"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane.doe@npu.edu"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Academic Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
            >
              <option value="Academic Intelligence & Institutional Research">Academic Intelligence & Institutional Research</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Define Your Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('INSTITUTION_ADMIN')}
                className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                  role === 'INSTITUTION_ADMIN'
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Dean / Admin</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Curriculum & simulations
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('SUPER_ADMIN')}
                className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                  role === 'SUPER_ADMIN'
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Super Admin</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  System telemetry & root
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('FACULTY')}
                className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                  role === 'FACULTY'
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Faculty Professor</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Course forensics & exams
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('ANALYST')}
                className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                  role === 'ANALYST'
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Intelligence Analyst</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Forecasting & reports
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Launch</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Already have institutional access? </span>
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-red-700 hover:text-red-800 cursor-pointer"
          >
            Sign In with Google or Phone
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <button
          onClick={() => navigate('/login')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>

        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
          <Mail className="w-5 h-5" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">Reset Institutional Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered institutional or Google email address to receive password reset instructions.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <p className="font-semibold">Reset Directive Dispatched</p>
            <p className="mt-1 text-slate-600">
              If an account is associated with <span className="font-mono font-medium">{email}</span>,
              a secure recovery link has been delivered.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@npu.edu or name@gmail.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Dispatch Recovery Instructions
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
