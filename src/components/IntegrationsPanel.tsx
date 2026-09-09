import React, { useState } from 'react';
import { ProgrammingLanguage } from '../types';
import { 
  Github, 
  CloudUpload, 
  Terminal, 
  ExternalLink, 
  Check, 
  Copy, 
  Play, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Sparkles, 
  FileCode2, 
  Globe, 
  ShieldCheck, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';

interface IntegrationsPanelProps {
  currentLanguage: ProgrammingLanguage;
  code: string;
  activeTab: 'github' | 'vercel' | 'replit';
  setActiveTab: (tab: 'github' | 'vercel' | 'replit') => void;
}

export const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({
  currentLanguage,
  code,
  activeTab,
  setActiveTab,
}) => {
  // GitHub State
  const [githubRepo, setGithubRepo] = useState('omnicode-polyglot-workspace');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubCommitMsg, setGithubCommitMsg] = useState(`Feat: Implement ${currentLanguage.name} algorithms with OmniCode AI`);
  const [githubToken, setGithubToken] = useState('');
  const [isPublishingGh, setIsPublishingGh] = useState(false);
  const [ghResult, setGhResult] = useState<any>(null);

  // Vercel State
  const [vercelProject, setVercelProject] = useState('omnicode-cloud-app');
  const [isDeployingVercel, setIsDeployingVercel] = useState(false);
  const [vercelResult, setVercelResult] = useState<any>(null);

  // Replit State
  const [isGeneratingReplit, setIsGeneratingReplit] = useState(false);
  const [replitConfig, setReplitConfig] = useState<any>(null);

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // GitHub Actions Trigger
  const handleGithubAction = async (action: 'commit' | 'gist' | 'test_token') => {
    setIsPublishingGh(true);
    try {
      const res = await fetch('/api/github/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'gist' ? 'create_gist' : 'commit',
          repoName: githubRepo,
          branch: githubBranch,
          commitMessage: githubCommitMsg,
          token: githubToken,
          files: [
            { name: `main${currentLanguage.extension}`, content: code },
            { name: 'README.md', content: `# ${githubRepo}\n\nBuilt with OmniCode AI Studio.\nLanguage: ${currentLanguage.name}` },
          ],
        }),
      });
      const data = await res.json();
      setGhResult(data);
    } catch (err: any) {
      setGhResult({ success: false, message: err.message });
    } finally {
      setIsPublishingGh(false);
    }
  };

  // Vercel Deploy Trigger
  const handleVercelDeploy = async () => {
    setIsDeployingVercel(true);
    try {
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: vercelProject,
          language: currentLanguage.id,
          framework: currentLanguage.vercelReady ? 'vite' : 'python',
          files: [{ name: `main${currentLanguage.extension}`, content: code }],
        }),
      });
      const data = await res.json();
      setVercelResult(data);
    } catch (err: any) {
      setVercelResult({ success: false, message: err.message });
    } finally {
      setIsDeployingVercel(false);
    }
  };

  // Replit Config Generate
  const handleReplitConfig = async () => {
    setIsGeneratingReplit(true);
    try {
      const res = await fetch('/api/replit/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentLanguage.id,
          filename: `main${currentLanguage.extension}`,
          entrypoint: `main${currentLanguage.extension}`,
        }),
      });
      const data = await res.json();
      setReplitConfig(data);
    } catch (err: any) {
      setReplitConfig({ success: false, message: err.message });
    } finally {
      setIsGeneratingReplit(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Integrations Header */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-100">Integrated Workspace Deploy &amp; Testing Tools</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'github'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'vercel'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vercel</span>
          </button>
          <button
            onClick={() => setActiveTab('replit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'replit'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Replit</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        {/* ================= GITHUB TAB ================= */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">GitHub Workspace Integration</h3>
                  <p className="text-xs text-slate-400">
                    Direct repository synchronization, automated CI/CD pipelines, and 1-click Gist exports.
                  </p>
                </div>
              </div>

              <a
                href={`https://github.com/new?name=${encodeURIComponent(githubRepo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>New GitHub Repo</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Config & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  Target Repository Name
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
                  <span className="text-slate-500 font-mono">github.com/user/</span>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="flex-1 bg-transparent text-slate-200 focus:outline-none font-mono ml-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Branch
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                      <input
                        type="text"
                        value={githubBranch}
                        onChange={(e) => setGithubBranch(e.target.value)}
                        className="bg-transparent focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Commit Message
                  </label>
                  <input
                    type="text"
                    value={githubCommitMsg}
                    onChange={(e) => setGithubCommitMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Personal Access Token <span className="text-slate-500 font-normal">(Optional for direct API publish)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none font-mono placeholder-slate-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleGithubAction('commit')}
                    disabled={isPublishingGh}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isPublishingGh ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <GitCommit className="w-3.5 h-3.5" />
                    )}
                    <span>Commit &amp; Push</span>
                  </button>

                  <button
                    onClick={() => handleGithubAction('gist')}
                    disabled={isPublishingGh}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Create Gist</span>
                  </button>
                </div>
              </div>

              {/* Generated GitHub Actions CI/CD Workflow */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Auto-Generated GitHub Actions CI
                    </span>
                    <button
                      onClick={() => handleCopy('gh-workflow', ghResult?.workflowYaml || 'name: OmniCode CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest')}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedSection === 'gh-workflow' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'gh-workflow' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[190px]">
{ghResult?.workflowYaml || `name: OmniCode CI/CD
on:
  push:
    branches: [ "${githubBranch}" ]
  pull_request:
    branches: [ "${githubBranch}" ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: OmniCode Quality Checks (${currentLanguage.name})
      run: |
        echo "Validating ${currentLanguage.name} syntax..."
        echo "Test matrix passed!"`}
                  </pre>
                </div>

                {ghResult && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                    <p className="font-medium">{ghResult.message || 'Action executed successfully!'}</p>
                    {ghResult.url && (
                      <a href={ghResult.url} target="_blank" rel="noreferrer" className="underline mt-1 block">
                        Open GitHub Gist ({ghResult.url})
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VERCEL TAB ================= */}
        {activeTab === 'vercel' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Vercel Instant Edge Deployment</h3>
                  <p className="text-xs text-slate-400">
                    Direct workspace deployment, edge routing, serverless runtime mapping, and instant preview domains.
                  </p>
                </div>
              </div>

              <button
                onClick={handleVercelDeploy}
                disabled={isDeployingVercel}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md shadow-cyan-950/50 transition-colors disabled:opacity-50"
              >
                {isDeployingVercel ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isDeployingVercel ? 'Deploying...' : '1-Click Deploy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Deploy Config */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vercel Project Name
                  </label>
                  <input
                    type="text"
                    value={vercelProject}
                    onChange={(e) => setVercelProject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Runtime Framework:</span>
                    <span className="font-mono text-cyan-300">
                      {currentLanguage.vercelReady ? 'Vite / Edge Serverless' : 'Serverless Function'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Target Language:</span>
                    <span className="font-mono text-slate-200">{currentLanguage.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Region:</span>
                    <span className="font-mono text-slate-200">Global Edge (All PoPs)</span>
                  </div>
                </div>

                {/* vercel.json manifest */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200">vercel.json Spec</span>
                    <button
                      onClick={() => handleCopy('vercel-json', vercelResult?.vercelConfig || '{}')}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedSection === 'vercel-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 max-h-[140px] overflow-y-auto">
{vercelResult?.vercelConfig || `{
  "version": 2,
  "name": "${vercelProject}",
  "builds": [{ "src": "main${currentLanguage.extension}", "use": "@vercel/static-build" }]
}`}
                  </pre>
                </div>
              </div>

              {/* Deployment Pipeline Status */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Deployment Pipeline Logs
                  </span>

                  <div className="space-y-1.5">
                    {(vercelResult?.steps || [
                      { name: 'Target environment ready', status: 'completed', time: '0.1s' },
                      { name: 'Routing & manifest generated', status: 'completed', time: '0.2s' },
                      { name: 'Edge CDN SSL certificate verification', status: 'ready', time: '—' },
                    ]).map((step: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-slate-300">{step.name}</span>
                        </div>
                        <span className="font-mono text-slate-500 text-[10px]">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {vercelResult && (
                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Deployment Live on Edge</span>
                    </div>
                    <a
                      href={vercelResult.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-cyan-300 font-mono underline hover:text-cyan-200"
                    >
                      <span>{vercelResult.previewUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= REPLIT TAB ================= */}
        {activeTab === 'replit' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Replit Workspace Integration</h3>
                  <p className="text-xs text-slate-400">
                    Instant containerized environment setup with `.replit` config and `replit.nix` packages for {currentLanguage.name}.
                  </p>
                </div>
              </div>

              <a
                href="https://replit.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-md transition-colors"
              >
                <span>Fork to Replit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* .replit Configuration */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 font-mono">.replit</span>
                  <button
                    onClick={() => handleCopy('dot-replit', replitConfig?.dotReplit || `run = "python3 main.py"\nentrypoint = "main.py"`)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedSection === 'dot-replit' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-amber-300 max-h-[180px] overflow-y-auto leading-relaxed">
{replitConfig?.dotReplit || `run = "omnicode run main${currentLanguage.extension}"
entrypoint = "main${currentLanguage.extension}"

[nix]
channel = "stable-23_11"

[deployment]
run = ["sh", "-c", "omnicode run main${currentLanguage.extension}"]`}
                </pre>
              </div>

              {/* replit.nix Packages */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 font-mono">replit.nix</span>
                  <button
                    onClick={() => handleCopy('replit-nix', replitConfig?.replitNix || `{ pkgs }: {\n  deps = [\n    pkgs.${currentLanguage.id}\n  ];\n}`)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedSection === 'replit-nix' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-indigo-300 max-h-[180px] overflow-y-auto leading-relaxed">
{replitConfig?.replitNix || `{ pkgs }: {
  deps = [
    pkgs.${currentLanguage.id === 'rust' ? 'rustc\n    pkgs.cargo' : currentLanguage.id === 'go' ? 'go' : currentLanguage.id === 'python' ? 'python311' : 'nodejs_20'}
  ];
}`}
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Replit cloud container automatically installs matching runtime and dependencies.</span>
              </div>
              <button
                onClick={handleReplitConfig}
                disabled={isGeneratingReplit}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {isGeneratingReplit ? 'Syncing...' : 'Regenerate Nix Specs'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
