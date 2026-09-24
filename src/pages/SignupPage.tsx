import React, { useState } from 'react';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';

export const SignupPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [role, setRole] = useState<UserRole>('FACULTY');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signup(name, email, department, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-xs font-mono">
            EF
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-mono">
            EDUFORENSICS
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane.doe@npu.edu"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requested Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
            >
              <option value="FACULTY">Faculty Member (Course & Assessment Forensics)</option>
              <option value="ANALYST">Institutional Analyst (Forecasting & Reports)</option>
              <option value="INSTITUTION_ADMIN">Dean / Institutional Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Already have institutional access? </span>
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-red-700 hover:text-red-800"
          >
            Sign In
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

        <h2 className="text-xl font-bold text-slate-900">Reset Institutional Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered university email to receive a password reset token.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <p className="font-semibold">Reset Instructions Dispatched</p>
            <p className="mt-1">
              If an account is associated with {email}, you will receive a secure recovery directive
              shortly.
            </p>
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
                placeholder="name@npu.edu"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Send Password Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
