import React, { useState, useEffect } from 'react';
import { VercelDeployment, VercelEnvVar, WorkspaceFile } from '../types';
import { 
  Globe, 
  ExternalLink, 
  RotateCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle2, 
  Clock, 
  Play, 
  Layers, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Server, 
  BarChart2, 
  ArrowUpRight,
  RefreshCw,
  Terminal,
  Code
} from 'lucide-react';

interface VercelPlatformProps {
  activeCode: string;
  files: WorkspaceFile[];
  onSwitchToReplit: () => void;
  onSwitchToGitHub: () => void;
}

export const VercelPlatform: React.FC<VercelPlatformProps> = ({
  activeCode,
  files,
  onSwitchToReplit,
  onSwitchToGitHub,
}) => {
  // Tabs: 'deployments' | 'preview' | 'env' | 'analytics'
  const [activeTab, setActiveTab] = useState<'deployments' | 'preview' | 'env' | 'analytics'>('preview');

  // Preview device mode: 'desktop' | 'tablet' | 'mobile'
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Deployments History
  const [deployments, setDeployments] = useState<VercelDeployment[]>([
    {
      id: 'dpl_98a72b1',
      name: 'omnicode-polyglot-workspace',
      url: 'https://omnicode-polyglot-workspace.vercel.app',
      branch: 'main',
      commitHash: '8b91a2c',
      commitMessage: 'feat: add real-time Google Search grounding & 105 language definitions',
      status: 'READY',
      environment: 'Production',
      creator: 'smurari229',
      duration: '18s',
      deployedAt: '14 minutes ago',
      edgeRegion: 'iad1 (Washington, D.C.)',
      metrics: {
        ttfb: '32ms',
        bundleSize: '148 kB',
        edgeExecutionTime: '11ms',
      },
    },
    {
      id: 'dpl_31f90e4',
      name: 'omnicode-polyglot-workspace-preview',
      url: 'https://omnicode-polyglot-preview-git-ast.vercel.app',
      branch: 'feature/fast-ast-parser',
      commitHash: '5e41f09',
      commitMessage: 'refactor: integrate AST-level deep debugger with automatic rate-limit recovery',
      status: 'READY',
      environment: 'Preview',
      creator: 'OmniCode Agent',
      duration: '22s',
      deployedAt: '1 hour ago',
      edgeRegion: 'fra1 (Frankfurt)',
      metrics: {
        ttfb: '28ms',
        bundleSize: '144 kB',
        edgeExecutionTime: '9ms',
      },
    },
  ]);

  // Live Deploy Pipeline State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployPipelineLogs, setDeployPipelineLogs] = useState<Array<{ step: string; status: 'done' | 'running' | 'pending'; time?: string }>>([]);
  const [activeDeploymentUrl, setActiveDeploymentUrl] = useState('https://omnicode-polyglot-workspace.vercel.app');

  // Environment Variables
  const [envVars, setEnvVars] = useState<VercelEnvVar[]>([
    { id: '1', key: 'GEMINI_API_KEY', value: 'AIzaSyDemoKeyProduction', environments: ['Production', 'Preview'], isSecret: true },
    { id: '2', key: 'VERCEL_ENV', value: 'production', environments: ['Production'], isSecret: false },
    { id: '3', key: 'NEXT_PUBLIC_APP_NAME', value: 'OmniCode AI Studio', environments: ['Production', 'Preview', 'Development'], isSecret: false },
  ]);
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newEnvSecret, setNewEnvSecret] = useState(false);

  // Trigger Instant Vercel Edge Deployment
  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setActiveTab('deployments');
    setDeployPipelineLogs([
      { step: 'Queued deployment request across Vercel global edge', status: 'running' },
      { step: 'Cloning workspace files from in-app GitHub repository', status: 'pending' },
      { step: 'Compiling production bundle & Edge serverless workers', status: 'pending' },
      { step: 'Distributing static assets to 320+ CDN edge nodes', status: 'pending' },
      { step: 'Assigning SSL certificate & live Vercel domain', status: 'pending' },
    ]);

    setTimeout(() => {
      setDeployPipelineLogs((prev) => [
        { ...prev[0], status: 'done', time: '0.4s' },
        { ...prev[1], status: 'running' },
        prev[2],
        prev[3],
        prev[4],
      ]);
    }, 800);

    setTimeout(() => {
      setDeployPipelineLogs((prev) => [
        prev[0],
        { ...prev[1], status: 'done', time: '1.2s' },
        { ...prev[2], status: 'running' },
        prev[3],
        prev[4],
      ]);
    }, 1800);

    setTimeout(() => {
      setDeployPipelineLogs((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done', time: '2.1s' },
        { ...prev[3], status: 'running' },
        prev[4],
      ]);
    }, 2800);

    setTimeout(() => {
      setDeployPipelineLogs((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: 'done', time: '0.8s' },
        { ...prev[4], status: 'running' },
      ]);
    }, 3600);

    setTimeout(() => {
      const depId = `dpl_${Math.random().toString(16).substring(2, 9)}`;
      const url = `https://omnicode-polyglot-${Math.random().toString(36).substring(2, 6)}.vercel.app`;
      const newDeployment: VercelDeployment = {
        id: depId,
        name: 'omnicode-polyglot-workspace',
        url,
        branch: 'main',
        commitHash: Math.random().toString(16).substring(2, 9),
        commitMessage: 'deploy: live workspace edge update from OmniCode',
        status: 'READY',
        environment: 'Production',
        creator: 'smurari229',
        duration: '5.2s',
        deployedAt: 'just now',
        edgeRegion: 'iad1 (Washington, D.C.)',
        metrics: {
          ttfb: '31ms',
          bundleSize: '148 kB',
          edgeExecutionTime: '10ms',
        },
      };

      setDeployPipelineLogs((prev) => [
        prev[0],
        prev[1],
        prev[2],
        prev[3],
        { ...prev[4], status: 'done', time: '0.5s' },
      ]);
      setDeployments([newDeployment, ...deployments]);
      setActiveDeploymentUrl(url);
      setIsDeploying(false);
    }, 4500);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Vercel Project Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center text-white shadow-md">
              <span className="text-lg font-bold leading-none select-none">▲</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">smurari229</span>
                <span className="text-slate-500">/</span>
                <span className="text-sm font-bold text-slate-100">omnicode-polyglot-workspace</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Production: Live
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <a
                  href={activeDeploymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{activeDeploymentUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerDeploy}
              disabled={isDeploying}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                isDeploying
                  ? 'bg-blue-600/50 text-white cursor-wait animate-pulse'
                  : 'bg-white text-black hover:bg-slate-100 shadow-slate-950/50'
              }`}
            >
              <span className="text-xs">▲</span>
              <span>{isDeploying ? 'Deploying to Edge...' : 'Deploy to Vercel'}</span>
            </button>

            <button
              onClick={onSwitchToGitHub}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              Git Commits
            </button>

            <button
              onClick={onSwitchToReplit}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              Replit IDE
            </button>
          </div>
        </div>

        {/* Vercel Navigation Bar */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800 -mb-3 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Live Web Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('deployments')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'deployments'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Deployments ({deployments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Edge Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'env'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Environment Variables ({envVars.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {/* 1. LIVE WEB PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full space-y-3">
            {/* Preview Toolbar (Address Bar & Device Mode Switcher) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 flex-1 max-w-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300 truncate text-[11px]">{activeDeploymentUrl}</span>
                <button
                  onClick={() => handleCopyUrl(activeDeploymentUrl)}
                  className="p-1 hover:text-slate-100 text-slate-400 ml-auto shrink-0"
                  title="Copy URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Device Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 rounded ${deviceMode === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Edge CDN: 32ms
                </span>
                <a
                  href={activeDeploymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Responsive Iframe Frame */}
            <div className="flex-1 flex justify-center items-start overflow-hidden pt-2">
              <div
                className={`h-[580px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
                  deviceMode === 'desktop'
                    ? 'w-full'
                    : deviceMode === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                {/* Browser Frame Top Header */}
                <div className="h-7 bg-slate-950 px-3 flex items-center justify-between border-b border-slate-800 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Vercel Edge Sandbox Preview</span>
                  <div className="w-8" />
                </div>

                {/* Rendered Live HTML/Web Preview Content */}
                <div className="flex-1 bg-slate-950 p-6 overflow-y-auto text-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono mb-4">
                      <span>▲ Vercel Edge Runtime Active</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-100 mb-2">
                      OmniCode Live Deployment
                    </h1>
                    <p className="text-xs text-slate-400 max-w-lg mb-6 leading-relaxed">
                      This application was compiled and distributed across 320+ global Edge Points of Presence with zero cold start latency.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Workspace Files</div>
                        <div className="text-lg font-bold text-slate-200 font-mono">{files.length} Bundled</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Edge Region</div>
                        <div className="text-lg font-bold text-slate-200 font-mono">iad1 (US East)</div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4 font-mono text-xs text-slate-300">
                      <div className="text-slate-500 mb-1">// Active Code Snapshot in Edge Worker:</div>
                      <div className="text-emerald-400 line-clamp-6">
                        {activeCode || '// Empty buffer'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Deployed with OmniCode Studio</span>
                    <span>SSL Certificate: Active (Let's Encrypt)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DEPLOYMENTS LIST & LIVE PIPELINE */}
        {activeTab === 'deployments' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            {/* Live Pipeline Progress (if deploying) */}
            {isDeploying && (
              <div className="p-5 rounded-xl bg-slate-900 border border-blue-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                    <Zap className="w-4 h-4 animate-bounce" />
                    <span>Streaming Vercel Edge Build Pipeline...</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Target: Global Edge</span>
                </div>

                <div className="space-y-2">
                  {deployPipelineLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {log.status === 'done' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : log.status === 'running' ? (
                          <RotateCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={log.status === 'done' ? 'text-slate-200' : log.status === 'running' ? 'text-blue-300 font-semibold' : 'text-slate-500'}>
                          {log.step}
                        </span>
                      </div>
                      {log.time && <span className="text-slate-500 text-[11px]">{log.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deployments List */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Deployment History ({deployments.length})</h3>
              <button
                onClick={handleTriggerDeploy}
                disabled={isDeploying}
                className="px-3 py-1.5 bg-white text-black hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>▲ New Deployment</span>
              </button>
            </div>

            <div className="space-y-3">
              {deployments.map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <a
                        href={dep.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-100 hover:text-blue-400 flex items-center gap-1 font-mono"
                      >
                        <span>{dep.url.replace('https://', '')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        dep.environment === 'Production'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}>
                        {dep.environment}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{dep.commitMessage}</span>
                      <span>•</span>
                      <span className="text-slate-500">{dep.branch} ({dep.commitHash})</span>
                      <span>•</span>
                      <span>{dep.deployedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <div>
                      <div className="text-[10px] text-slate-500">TTFB</div>
                      <div className="text-emerald-400 font-semibold">{dep.metrics.ttfb}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">BUNDLE</div>
                      <div className="text-slate-200">{dep.metrics.bundleSize}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">DURATION</div>
                      <div className="text-slate-200">{dep.duration}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveDeploymentUrl(dep.url);
                        setActiveTab('preview');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. EDGE ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <h3 className="text-sm font-semibold text-slate-200">Vercel Edge Global Analytics</h3>

            {/* Core Web Vitals Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Largest Contentful Paint (LCP)</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">0.78s</div>
                <div className="text-[10px] text-emerald-500 mt-1">98% of users experience Good score</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">First Input Delay (FID)</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">11ms</div>
                <div className="text-[10px] text-emerald-500 mt-1">Near-zero input lag on Edge</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Cumulative Layout Shift (CLS)</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">0.002</div>
                <div className="text-[10px] text-emerald-500 mt-1">Perfect visual stability</div>
              </div>
            </div>

            {/* Regional Edge Latency Breakdown */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200">Edge Point of Presence (PoP) Latency</h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>IAD1 (Washington, D.C. - North America)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">18ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>FRA1 (Frankfurt - Europe)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">24ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>SIN1 (Singapore - Asia-Pacific)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">32ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>NRT1 (Tokyo - Asia East)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">29ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ENVIRONMENT VARIABLES TAB */}
        {activeTab === 'env' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Environment Variables</h3>
              <span className="text-xs text-slate-400">Encrypted at rest with AES-256-GCM</span>
            </div>

            {/* Add Env Var Form */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="KEY (e.g. DATABASE_URL)"
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  className="bg-slate-950 text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-200 uppercase font-mono"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newEnvValue}
                  onChange={(e) => setNewEnvValue(e.target.value)}
                  className="bg-slate-950 text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEnvSecret}
                    onChange={(e) => setNewEnvSecret(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Automatically encrypt secret</span>
                </label>

                <button
                  onClick={() => {
                    if (!newEnvKey.trim()) return;
                    setEnvVars([
                      ...envVars,
                      {
                        id: String(Date.now()),
                        key: newEnvKey.trim().toUpperCase(),
                        value: newEnvValue.trim(),
                        environments: ['Production', 'Preview'],
                        isSecret: newEnvSecret,
                      },
                    ]);
                    setNewEnvKey('');
                    setNewEnvValue('');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  + Add Variable
                </button>
              </div>
            </div>

            {/* Existing Env Vars List */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 divide-y divide-slate-800">
              {envVars.map((v) => (
                <div key={v.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-semibold text-slate-200">{v.key}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {v.isSecret ? '••••••••••••••••••••' : v.value}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {v.environments.map((env) => (
                        <span key={env} className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {env}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setEnvVars(envVars.filter((item) => item.id !== v.id))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
