import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Filter, Search } from 'lucide-react';
import { api } from '../services/api.ts';
import { Alert, RiskLevel } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { AlertCard, FilterBar } from '../components/common/AlertCard.tsx';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States.tsx';

export const AlertsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await api.getAlerts();
      setAlerts(list);
    } catch (err: any) {
      setError(err.message || 'Failed to query alerts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    await api.updateAlertStatus(id, 'ACKNOWLEDGED');
    fetchAlerts();
  };

  const handleResolve = async (id: string) => {
    await api.updateAlertStatus(id, 'RESOLVED');
    fetchAlerts();
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  if (isLoading) return <LoadingState message="Querying active institutional alerts..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAlerts} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="System Boundary Monitoring"
        title="Alerts & Prerequisite Warnings"
        subheading="Real-time alerts triggered by high failure discrimination, prerequisite breakdown propagation, and attendance drops."
      />

      <FilterBar
        actions={
          <span className="text-xs text-slate-500 font-mono">
            {filteredAlerts.length} Alerts Active
          </span>
        }
      >
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="UNACKNOWLEDGED">Unacknowledged</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono">Severity:</span>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
          >
            <option value="all">All Severities</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>
      </FilterBar>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts match the selected criteria"
          description="All monitored academic boundary indicators are currently in a nominal state."
        />
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              onViewAnalysis={code => navigate(`/forensics?courseCode=${code}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
