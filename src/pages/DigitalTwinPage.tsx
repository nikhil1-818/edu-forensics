import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  GitBranch,
  FlaskConical,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { DigitalTwinGraph, DigitalTwinNode, DigitalTwinEdge } from '../types.ts';
import { PageHeader } from '../components/common/PageHeader.tsx';
import { ChartCard, InsightPanel } from '../components/common/ChartCard.tsx';
import { RiskBadge, RiskIndicator } from '../components/common/RiskBadge.tsx';
import { LoadingState, ErrorState } from '../components/common/States.tsx';

interface DigitalTwinPageProps {
  navigate: (path: string) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({ navigate }) => {
  const [graph, setGraph] = useState<DigitalTwinGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Canvas Viewport Controls
  const [zoom, setZoom] = useState(1);
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [riskOverlay, setRiskOverlay] = useState(true);
  const [masteryOverlay, setMasteryOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection & Tracing State
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [traceExplanation, setTraceExplanation] = useState<string | null>(null);
  const [isTracing, setIsTracing] = useState(false);

  const fetchGraph = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDigitalTwinGraph({
        semester: semesterFilter === 'all' ? undefined : Number(semesterFilter),
        riskOverlay,
        masteryOverlay,
      });
      setGraph(res);
      if (res.nodes.length > 0 && !selectedNode) {
        // Select Integration or Differential Equations default
        const target = res.nodes.find(n => n.label.includes('Integration')) || res.nodes[0];
        setSelectedNode(target);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Digital Twin knowledge graph.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [semesterFilter, riskOverlay, masteryOverlay]);

  const handleTrace = async (direction: 'upstream' | 'downstream') => {
    if (!selectedNode) return;
    setIsTracing(true);
    try {
      const res = await api.traceDigitalTwin(selectedNode.id, direction);
      setHighlightedNodeIds(res.pathNodeIds);
      setTraceExplanation(res.explanation);
    } catch (err: any) {
      console.warn('Trace failed', err);
    } finally {
      setIsTracing(false);
    }
  };

  const handleClearTrace = () => {
    setHighlightedNodeIds([]);
    setTraceExplanation(null);
  };

  const filteredNodes = graph?.nodes.filter(n => {
    if (!searchQuery) return true;
    return (
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  if (isLoading) return <LoadingState message="Instantiating Curriculum Digital Twin Knowledge Graph..." />;
  if (error || !graph) return <ErrorState message={error || 'Digital Twin Graph unavailable.'} onRetry={fetchGraph} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        kicker="Computational Curriculum Model"
        title="Curriculum Digital Twin"
        subheading="Interactive knowledge graph modeling courses, concepts, and prerequisite dependencies as a living system. Trace root weaknesses upstream or calculate failure blast radius downstream."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/forensics')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-slate-500" />
              <span>Forensics</span>
            </button>
            <button
              onClick={() => navigate('/simulator')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Simulate Intervention</span>
            </button>
          </div>
        }
      />

      {/* GRAPH CONTROL TOOLBAR */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left side: Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter node in graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-600 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Semester:</span>
            <select
              value={semesterFilter}
              onChange={e => setSemesterFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:border-red-600"
            >
              <option value="all">All Semesters (1–8)</option>
              <option value="1">Sem 1 (Freshman Fall)</option>
              <option value="2">Sem 2 (Freshman Spring)</option>
              <option value="3">Sem 3 (Sophomore Fall)</option>
              <option value="4">Sem 4 (Sophomore Spring)</option>
              <option value="5">Sem 5 (Junior Fall)</option>
              <option value="7">Sem 7 (Senior Fall)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Overlays */}
          <button
            onClick={() => setRiskOverlay(!riskOverlay)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              riskOverlay
                ? 'bg-red-50 text-red-800 border-red-200 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Risk Heatmap: {riskOverlay ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setMasteryOverlay(!masteryOverlay)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              masteryOverlay
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Mastery %: {masteryOverlay ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Right side: Zoom & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-500 w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.6, zoom + 0.15))}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              handleClearTrace();
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TRACE NOTIFICATION BANNER */}
      {traceExplanation && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-700 shrink-0" />
            <span className="leading-relaxed">{traceExplanation}</span>
          </div>
          <button
            onClick={handleClearTrace}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline ml-4 cursor-pointer shrink-0"
          >
            Clear Active Trace
          </button>
        </div>
      )}

      {/* MAIN COMPUTATIONAL GRAPH CANVAS & SIDE DEEP DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col min-h-[580px]">
          {/* Canvas Background & Grid */}
          <div
            className="flex-1 p-6 relative overflow-auto select-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #E2E8F0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div
              className="relative transition-transform duration-150 origin-top-left"
              style={{
                transform: `scale(${zoom})`,
                minWidth: '920px',
                minHeight: '520px',
              }}
            >
              {/* Semester Headers Columns */}
              <div className="grid grid-cols-4 gap-6 mb-8 border-b border-slate-200 pb-3">
                {['Semester 1 (Freshman)', 'Semester 3 (Sophomore)', 'Semester 4 / 5 (Junior)', 'Semester 7 (Senior)'].map((sem, idx) => (
                  <div key={idx} className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    {sem}
                  </div>
                ))}
              </div>

              {/* Node Cards positioned in topological flow */}
              <div className="grid grid-cols-4 gap-6">
                {/* Column 1: Foundational Roots (Sem 1) */}
                <div className="space-y-4">
                  {filteredNodes
                    .filter(n => (n.semester || 1) <= 2)
                    .map(node => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        isHighlighted={highlightedNodeIds.includes(node.id)}
                        riskOverlay={riskOverlay}
                        masteryOverlay={masteryOverlay}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                </div>

                {/* Column 2: Intermediate Core (Sem 3) */}
                <div className="space-y-4">
                  {filteredNodes
                    .filter(n => n.semester === 3)
                    .map(node => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        isHighlighted={highlightedNodeIds.includes(node.id)}
                        riskOverlay={riskOverlay}
                        masteryOverlay={masteryOverlay}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                </div>

                {/* Column 3: Advanced Systems (Sem 4 & 5) */}
                <div className="space-y-4">
                  {filteredNodes
                    .filter(n => n.semester === 4 || n.semester === 5)
                    .map(node => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        isHighlighted={highlightedNodeIds.includes(node.id)}
                        riskOverlay={riskOverlay}
                        masteryOverlay={masteryOverlay}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                </div>

                {/* Column 4: Capstone & Advanced Electives (Sem 7) */}
                <div className="space-y-4">
                  {filteredNodes
                    .filter(n => (n.semester || 1) >= 7)
                    .map(node => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        isHighlighted={highlightedNodeIds.includes(node.id)}
                        riskOverlay={riskOverlay}
                        masteryOverlay={masteryOverlay}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Graph Footer Telemetry */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span>Nodes: {graph.stats.totalConcepts + graph.stats.totalCourses}</span>
              <span>·</span>
              <span>Avg Mastery: {graph.stats.averageCurriculumMastery}%</span>
              <span>·</span>
              <span className="text-red-700 font-bold">
                Critical Choke Points: {graph.stats.criticalBottlenecks}
              </span>
            </div>
            <span>Directed Edge Types: REQUIRES · CONTAINS · DEPENDS_ON</span>
          </div>
        </div>

        {/* NODE DEEP DIVE & TRACE INSPECTOR */}
        <div>
          {selectedNode ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {selectedNode.type} Node Inspector
                  </span>
                  <RiskBadge level={selectedNode.riskLevel} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedNode.label}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedNode.courseCode ? `${selectedNode.courseCode} · ` : ''}Semester {selectedNode.semester}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                  <p className="text-[10px] uppercase font-mono text-slate-400">Mastery Level</p>
                  <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                    {selectedNode.mastery}%
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                  <p className="text-[10px] uppercase font-mono text-slate-400">Vulnerability Score</p>
                  <p className="text-lg font-mono font-bold text-red-700 tabular-nums">
                    {selectedNode.riskScore}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                  <p className="text-[10px] uppercase font-mono text-slate-400">Upstream Prereqs</p>
                  <p className="text-sm font-mono font-semibold text-slate-800 tabular-nums">
                    {selectedNode.prerequisitesCount} dependencies
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                  <p className="text-[10px] uppercase font-mono text-slate-400">Downstream Blast</p>
                  <p className="text-sm font-mono font-semibold text-slate-800 tabular-nums">
                    {selectedNode.dependenciesCount} dependents
                  </p>
                </div>
              </div>

              {/* TRACE ACTIONS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
                  Causal Traversal
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTrace('upstream')}
                    disabled={isTracing}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                    <span>Trace Upstream</span>
                  </button>

                  <button
                    onClick={() => handleTrace('downstream')}
                    disabled={isTracing}
                    className="p-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Trace Blast Radius</span>
                  </button>
                </div>
              </div>

              {/* ACTION LINKS */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate(`/forensics?conceptId=${selectedNode.id}`)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <GitBranch className="w-3.5 h-3.5 text-red-700" />
                  <span>Deconstruct Failures in Forensics</span>
                </button>

                <button
                  onClick={() => navigate('/simulator')}
                  className="w-full py-2 bg-red-50 hover:bg-red-100/80 text-red-900 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-red-700" />
                  <span>Simulate Resequencing in What-If</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Click any node in the Curriculum Twin to inspect dependencies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Node Card in Canvas
const NodeCard: React.FC<{
  node: DigitalTwinNode;
  isSelected: boolean;
  isHighlighted: boolean;
  riskOverlay: boolean;
  masteryOverlay: boolean;
  onClick: () => void;
}> = ({ node, isSelected, isHighlighted, riskOverlay, masteryOverlay, onClick }) => {
  const isCourse = node.type === 'Course';

  let borderColor = 'border-slate-200';
  let badgeColor = 'bg-slate-100 text-slate-700';

  if (riskOverlay) {
    if (node.riskScore >= 70) {
      borderColor = 'border-red-400 bg-red-50/40';
      badgeColor = 'bg-red-100 text-red-800';
    } else if (node.riskScore >= 45) {
      borderColor = 'border-amber-300 bg-amber-50/30';
      badgeColor = 'bg-amber-100 text-amber-800';
    }
  }

  if (isSelected) {
    borderColor = 'border-red-700 ring-2 ring-red-600/20 shadow-md bg-white';
  } else if (isHighlighted) {
    borderColor = 'border-red-600 ring-2 ring-red-400/30 shadow-md bg-red-50/70';
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-xs ${borderColor}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${badgeColor}`}
        >
          {node.type}
        </span>
        {masteryOverlay ? (
          <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
            {node.mastery}%
          </span>
        ) : (
          <RiskBadge level={node.riskLevel} size="sm" showDot={false} />
        )}
      </div>

      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
        {node.label}
      </h4>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Sem {node.semester}</span>
        <span className="tabular-nums">{node.affectedStudents} students</span>
      </div>
    </div>
  );
};
