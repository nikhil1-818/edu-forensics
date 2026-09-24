import React, { useState } from 'react';
import {
  LayoutDashboard,
  Search,
  GitBranch,
  TrendingUp,
  Cpu,
  FlaskConical,
  GraduationCap,
  BookOpen,
  FileCheck2,
  Network,
  UploadCloud,
  Bell,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types.ts';

interface AppShellProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, navigate, children }) => {
  const { user, logout, loginAsDemo, hasRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { label: 'Learning Forensics', path: '/forensics', icon: GitBranch },
        { label: 'Risk Forecast', path: '/risk-forecast', icon: TrendingUp },
        { label: 'Curriculum Digital Twin', path: '/digital-twin', icon: Cpu },
        { label: 'What-If Simulator', path: '/simulator', icon: FlaskConical },
      ],
    },
    {
      group: 'ACADEMIC DATA',
      items: [
        { label: 'Students Analytics', path: '/students', icon: GraduationCap },
        { label: 'Courses Directory', path: '/courses', icon: BookOpen },
        { label: 'Assessments', path: '/assessments', icon: FileCheck2 },
        { label: 'Curriculum Structure', path: '/curriculum', icon: Network },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Data Ingestion', path: '/data', icon: UploadCloud },
        { label: 'Alerts Center', path: '/alerts', icon: Bell, badge: '2' },
        { label: 'Institutional Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  if (hasRole(['SUPER_ADMIN', 'INSTITUTION_ADMIN'])) {
    navItems.push({
      group: 'ADMINISTRATION',
      items: [
        { label: 'Admin Console', path: '/admin', icon: ShieldCheck },
      ],
    });
  }

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full system & platform access' },
    { role: 'INSTITUTION_ADMIN', label: 'Dean / Administrator', desc: 'Curriculum & simulations' },
    { role: 'FACULTY', label: 'Faculty Professor', desc: 'Course & assessment forensics' },
    { role: 'ANALYST', label: 'Intelligence Analyst', desc: 'Forecasting & data reports' },
  ];

  const handleRoleSwitch = async (role: UserRole) => {
    await loginAsDemo(role);
    setIsProfileMenuOpen(false);
  };

  const getBreadcrumbTitle = () => {
    for (const group of navItems) {
      for (const item of group.items) {
        if (currentPath === item.path) return item.label;
      }
    }
    if (currentPath.startsWith('/curriculum/')) return 'Course Detail';
    if (currentPath.startsWith('/students/')) return 'Student Analytics Detail';
    if (currentPath.startsWith('/assessments/')) return 'Assessment Deep Dive';
    if (currentPath.startsWith('/reports/')) return 'Report Briefing';
    return 'Intelligence Platform';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div
            onClick={() => {
              navigate('/dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold font-mono tracking-wider shadow-xs group-hover:bg-red-800 transition-colors">
              EF
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">
                EDUFORENSICS
              </span>
              <p className="text-[10px] uppercase font-mono tracking-widest text-red-700 font-semibold leading-none">
                Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map(group => (
            <div key={group.group}>
              <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1.5 font-mono">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-red-50/90 text-red-800 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-red-700' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-100 text-red-700 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Institution & Active User Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs font-mono shrink-0">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Profile & Role Switcher Popup */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg p-2 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-2 border-b border-slate-100 mb-1.5">
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-slate-500 text-[11px] truncate font-mono">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-red-700 font-medium">
                    <Building2 className="w-3 h-3" />
                    <span>National Polytech Univ</span>
                  </div>
                </div>

                <div className="px-2.5 py-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1">
                    Quick Role Switch (Demo)
                  </p>
                  <div className="space-y-1">
                    {roleOptions.map(opt => (
                      <button
                        key={opt.role}
                        onClick={() => handleRoleSwitch(opt.role)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex flex-col transition-colors cursor-pointer ${
                          user?.role === opt.role
                            ? 'bg-red-50 text-red-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Contextual Breadcrumbs */}
            <nav className="flex items-center text-xs font-medium text-slate-500">
              <span className="text-slate-400">EDUFORENSICS</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">{getBreadcrumbTitle()}</span>
            </nav>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search Input */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search concepts, courses, students..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Institution Selector Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-red-700" />
              <span>National Polytech Univ</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Alerts Center"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            </button>

            {/* Public Landing Link */}
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              title="View Public Overview"
            >
              <span>Platform Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
