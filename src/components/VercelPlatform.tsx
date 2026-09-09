import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Monitor, Tablet, Smartphone, Rocket, AlertTriangle, RefreshCw } from 'lucide-react';
import { VercelDeployment, WorkspaceFile } from '../types';

interface VercelPlatformProps {
  activeCode: string;
  files: WorkspaceFile[];
  onSwitchToReplit: () => void;
  onSwitchToGitHub: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const VercelPlatform: React.FC<VercelPlatformProps> = ({
  activeCode,
  files,
  onSwitchToReplit,
  onSwitchToGitHub,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [activeDeploymentUrl, setActiveDeploymentUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const deploy = async () => {
    setIsDeploying(true);
    setError('');
    try {
      const response = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: 'omitool', branch: 'main', files }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Vercel did not accept the deployment request.');
      }

      const url = data.previewUrl || '';
      const deployment: VercelDeployment = {
        id: data.deploymentId || 'unknown',
        name: 'omitool',
        url: url.startsWith('http') ? url : (url ? `https://${url}` : ''),
        branch: 'main',
        commitHash: 'server-confirmed',
        commitMessage: 'Deployment accepted by Vercel API',
        status: 'BUILDING',
        environment: data.target === 'production' ? 'Production' : 'Preview',
        creator: 'Vercel API',
        duration: 'pending',
        deployedAt: 'just now',
        edgeRegion: 'Vercel-managed',
        metrics: { ttfb: 'pending', bundleSize: 'pending', edgeExecutionTime: 'pending' },
      };
      setDeployments((previous) => [deployment, ...previous]);
      setActiveDeploymentUrl(deployment.url);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrl = async () => {
    if (!activeDeploymentUrl) return;
    await navigator.clipboard.writeText(activeDeploymentUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const previewWidth = deviceMode === 'desktop' ? 'w-full' : deviceMode === 'tablet' ? 'w-[768px] max-w-full' : 'w-[375px] max-w-full';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold">Vercel Integration</div>
            <div className="text-xs text-slate-400 mt-1">Real deployment requests only. No fake URLs or simulated READY states.</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={deploy} disabled={isDeploying} className="px-4 py-2 rounded-md bg-white text-black text-xs font-semibold disabled:opacity-50 flex items-center gap-2">
              {isDeploying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
              {isDeploying ? 'Requesting…' : 'Deploy to Vercel'}
            </button>
            <button onClick={onSwitchToGitHub} className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs">GitHub</button>
            <button onClick={onSwitchToReplit} className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs">Workspace</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {error && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div><div className="font-semibold">Deployment not completed</div><div className="text-xs mt-1 text-amber-100/80">{error}</div></div>
          </div>
        )}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold">Live deployment preview</h3>
              <p className="text-xs text-slate-500 mt-1">A real URL appears here only after Vercel accepts the request.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md p-1">
              <button onClick={() => setDeviceMode('desktop')} className={`p-1.5 rounded ${deviceMode === 'desktop' ? 'bg-slate-800' : 'text-slate-500'}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setDeviceMode('tablet')} className={`p-1.5 rounded ${deviceMode === 'tablet' ? 'bg-slate-800' : 'text-slate-500'}`}><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setDeviceMode('mobile')} className={`p-1.5 rounded ${deviceMode === 'mobile' ? 'bg-slate-800' : 'text-slate-500'}`}><Smartphone className="w-4 h-4" /></button>
            </div>
          </div>

          {activeDeploymentUrl ? (
            <>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-md p-2 mb-3">
                <a href={activeDeploymentUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 truncate flex-1">{activeDeploymentUrl}</a>
                <button onClick={copyUrl} className="p-1 text-slate-400">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                <a href={activeDeploymentUrl} target="_blank" rel="noreferrer" className="p-1 text-slate-400"><ExternalLink className="w-4 h-4" /></a>
              </div>
              <div className={`mx-auto ${previewWidth} h-[480px] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden`}>
                <iframe title="Vercel deployment preview" src={activeDeploymentUrl} className="w-full h-full bg-white" sandbox="allow-scripts allow-forms allow-same-origin" />
              </div>
            </>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex items-center justify-center text-center p-6">
              <div><div className="text-sm text-slate-300">No verified deployment yet</div><div className="text-xs text-slate-500 mt-2">Configure VERCEL_TOKEN on the server, then deploy. The panel will never invent a URL.</div></div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold mb-3">Deployment history</h3>
          {deployments.length === 0 ? (
            <div className="text-xs text-slate-500">No deployments confirmed by this session.</div>
          ) : (
            <div className="space-y-2">
              {deployments.map((deployment) => (
                <button key={deployment.id} onClick={() => setActiveDeploymentUrl(deployment.url)} className="w-full text-left p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono truncate">{deployment.url || deployment.id}</span>
                    <span className="text-[10px] text-blue-300">{deployment.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{deployment.environment} · {deployment.deployedAt}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold mb-2">Workspace snapshot</h3>
          <div className="text-xs text-slate-500 mb-3">{files.length} files currently in the workspace.</div>
          <pre className="max-h-64 overflow-auto rounded-lg bg-slate-950 border border-slate-800 p-3 text-[11px] text-slate-300 whitespace-pre-wrap">{activeCode || '// Empty buffer'}</pre>
        </section>
      </div>
    </div>
  );
};
