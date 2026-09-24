import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AppShell } from './components/layout/AppShell.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage, ForgotPasswordPage } from './pages/SignupPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ForensicsPage } from './pages/ForensicsPage.tsx';
import { RiskForecastPage } from './pages/RiskForecastPage.tsx';
import { DigitalTwinPage } from './pages/DigitalTwinPage.tsx';
import { SimulatorPage } from './pages/SimulatorPage.tsx';
import { StudentsPage } from './pages/StudentsPage.tsx';
import { CoursesPage, CurriculumPage } from './pages/CoursesPage.tsx';
import { AssessmentsPage } from './pages/AssessmentsPage.tsx';
import { DataIngestionPage } from './pages/DataIngestionPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { LoadingState } from './components/common/States.tsx';

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingState message="Connecting to EDUFORENSICS Institutional Instance..." />
      </div>
    );
  }

  // Base Path Normalization (strip query strings for matching)
  const basePath = currentPath.split('?')[0];

  // Public Routes
  if (basePath === '/') {
    return <LandingPage navigate={navigate} />;
  }
  if (basePath === '/login') {
    return <LoginPage navigate={navigate} />;
  }
  if (basePath === '/signup') {
    return <SignupPage navigate={navigate} />;
  }
  if (basePath === '/forgot-password') {
    return <ForgotPasswordPage navigate={navigate} />;
  }

  // Protected Routes Check
  if (!isAuthenticated) {
    return <LoginPage navigate={navigate} />;
  }

  // Render inside AppShell
  let pageContent: React.ReactNode = null;

  switch (basePath) {
    case '/dashboard':
      pageContent = <DashboardPage navigate={navigate} />;
      break;
    case '/forensics':
      pageContent = <ForensicsPage navigate={navigate} />;
      break;
    case '/risk-forecast':
      pageContent = <RiskForecastPage navigate={navigate} />;
      break;
    case '/digital-twin':
      pageContent = <DigitalTwinPage navigate={navigate} />;
      break;
    case '/simulator':
      pageContent = <SimulatorPage navigate={navigate} />;
      break;
    case '/curriculum':
      pageContent = <CurriculumPage navigate={navigate} />;
      break;
    case '/assessments':
      pageContent = <AssessmentsPage navigate={navigate} />;
      break;
    case '/students':
      pageContent = <StudentsPage navigate={navigate} />;
      break;
    case '/courses':
      pageContent = <CoursesPage navigate={navigate} />;
      break;
    case '/data':
      pageContent = <DataIngestionPage />;
      break;
    case '/reports':
      pageContent = <ReportsPage />;
      break;
    case '/alerts':
      pageContent = <AlertsPage navigate={navigate} />;
      break;
    case '/settings':
      pageContent = <SettingsPage />;
      break;
    case '/admin':
    case '/admin/users':
    case '/admin/system':
      if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'INSTITUTION_ADMIN') {
        pageContent = (
          <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-800">
            <h3 className="font-bold text-sm text-red-900 mb-1">Access Restricted (RBAC Violation)</h3>
            <p>Your account ({user?.role}) does not possess administrative privileges.</p>
          </div>
        );
      } else {
        pageContent = <AdminPage />;
      }
      break;
    case '/admin/data':
      pageContent = <DataIngestionPage />;
      break;
    default:
      pageContent = <DashboardPage navigate={navigate} />;
  }

  return (
    <AppShell currentPath={currentPath} navigate={navigate}>
      {pageContent}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
