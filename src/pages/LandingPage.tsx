import React from 'react';
import {
  ArrowRight,
  GitBranch,
  TrendingUp,
  Cpu,
  FlaskConical,
  ShieldCheck,
  Network,
  ChevronRight,
  Database,
  LineChart,
} from 'lucide-react';
import heroImage from '../assets/images/eduforensics_hero_twin_1790243544963.jpg';
import { EduForensicsLogo } from '../components/common/EduForensicsLogo.tsx';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer hover:opacity-95 transition-opacity"
          >
            <EduForensicsLogo size="sm" subtext="Intelligence & Digital Twin" />
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-red-700 transition-colors">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-red-700 transition-colors">
              System Architecture
            </a>
            <a href="#philosophy" className="hover:text-red-700 transition-colors">
              The Decision Loop
            </a>
            <a
              onClick={() => navigate('/digital-twin')}
              className="hover:text-red-700 transition-colors cursor-pointer"
            >
              Curriculum Twin
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>AI-Powered Education Intelligence & Digital Twin</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Don't just analyze student performance.{' '}
              <span className="text-red-700">Forensically analyze</span> the education system.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              An institutional intelligence platform that discovers why learning systems fail,
              forecasts academic risks before examinations, maps curriculum prerequisite dependencies,
              and simulates interventions before they reach real cohorts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Launch Institutional Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/digital-twin')}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-red-700" />
                <span>View Curriculum Digital Twin</span>
              </button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">94.2%</p>
                <p className="text-xs text-slate-500 mt-0.5">Causal Attribution Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">4–6 Wks</p>
                <p className="text-xs text-slate-500 mt-0.5">Lead Time Risk Prediction</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">1,420+</p>
                <p className="text-xs text-slate-500 mt-0.5">Undergraduate Cohort Monitored</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="mt-12 rounded-2xl border border-slate-200 shadow-xl overflow-hidden bg-slate-950 relative">
            <img
              src={heroImage}
              alt="EDUFORENSICS Curriculum Digital Twin Knowledge Graph"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[520px]"
            />
            <div className="absolute bottom-4 left-6 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Computational Twin Active · 84 Nodes · 126 Dependency Edges</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700 font-mono mb-2">
            Institutional Capabilities
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Engineered for Academic Decision-Makers
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Moving beyond retrospective GPA dashboards into predictive causal modeling and
            computational curriculum architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 01 Forensics */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-700">01. FORENSICS</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Learning Failure Forensics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Discover the root cause behind academic failure. When examination grades collapse,
                trace the breakdown backwards through prerequisite chains, unmastered concepts, and
                systemic pedagogical bottlenecks.
              </p>
            </div>
            <button
              onClick={() => navigate('/forensics')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 mt-4 cursor-pointer"
            >
              <span>Explore Forensics Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 02 Risk Forecast */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-700">02. PREDICTION</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Academic Risk Forecasting
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Detect emerging academic bottlenecks before examination results reveal them.
                Multi-factor temporal survival models rank transparent contributing drivers rather
                than black-box heuristics.
              </p>
            </div>
            <button
              onClick={() => navigate('/risk-forecast')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 mt-4 cursor-pointer"
            >
              <span>View Risk Horizons</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 03 Digital Twin */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-700">03. DIGITAL TWIN</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Curriculum Digital Twin
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Model courses, concepts, and prerequisite relationships as an interactive,
                computational education system. Trace upstream dependencies, analyze downstream blast
                radius, and identify invisible curriculum choke points.
              </p>
            </div>
            <button
              onClick={() => navigate('/digital-twin')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 mt-4 cursor-pointer"
            >
              <span>Explore Interactive Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 04 Simulator */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-700">04. SIMULATION</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                What-If Education Simulator
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Test academic and curriculum changes virtually before applying them to a live cohort.
                Evaluate counterfactual course resequencing, prerequisite bridging, and assessment
                weight adjustments with side-by-side metric comparison.
              </p>
            </div>
            <button
              onClick={() => navigate('/simulator')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 mt-4 cursor-pointer"
            >
              <span>Configure What-If Scenario</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE PIPELINE */}
      <section id="architecture" className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700 font-mono mb-2">
              Computational Architecture
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              End-to-End System Intelligence Flow
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              How institutional academic data transforms into predictive signals and counterfactual decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Academic Data Ingestion', desc: 'Normalized grades, question-level item discrimination, LMS logs, and attendance records.' },
              { step: '02', title: 'Education Knowledge Graph', desc: 'Courses, units, and concepts mapped into directed dependency acyclic graphs (DAG).' },
              { step: '03', title: 'Forensic & Causal Engine', desc: 'Bayesian path inference identifies hidden prerequisite decay and failure choke points.' },
              { step: '04', title: 'Curriculum Digital Twin', desc: 'Living computational model allowing virtual intervention tests before real deployment.' },
            ].map(item => (
              <div key={item.step} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-mono font-bold text-red-700">{item.step}</span>
                <h4 className="text-sm font-semibold text-slate-900 mt-1 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY & DECISION LOOP */}
      <section id="philosophy" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <p className="text-xs uppercase font-mono tracking-widest text-red-400 font-semibold mb-3">
              The Institutional Paradigm
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              DATA → FORENSICS → PREDICTION → DIGITAL TWIN → SIMULATION → DECISION
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              EDUFORENSICS turns a university's academic data into a living digital twin: it finds the
              root causes of learning failure, forecasts future academic risks, models curriculum
              dependencies, and lets institutions test what-if changes before implementing them.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Access Institutional Dashboard
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Explore Demo Roles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <EduForensicsLogo size="xs" subtext="Institutional Intelligence System" />
        <p>© 2026 EDUFORENSICS Intelligence Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
