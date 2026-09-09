import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  GitPullRequest, 
  GitIssue, 
  GitGist, 
  WorkspaceFile 
} from '../types';
import { 
  GitBranch as GitBranchIcon, 
  GitCommit as GitCommitIcon, 
  GitPullRequest as GitPullRequestIcon, 
  CircleDot, 
  Star, 
  GitFork, 
  Eye, 
  FileCode, 
  Plus, 
  Check, 
  Clock, 
  User, 
  Code, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Share2,
  Lock,
  Globe
} from 'lucide-react';

interface GitHubPlatformProps {
  files: WorkspaceFile[];
  activeCode: string;
  onCommitChanges: (message: string, branchName: string) => void;
  onDeployToVercel: () => void;
  onSwitchToEditor: () => void;
}

export const GitHubPlatform: React.FC<GitHubPlatformProps> = ({
  files,
  activeCode,
  onCommitChanges,
  onDeployToVercel,
  onSwitchToEditor,
}) => {
  // Navigation tab inside GitHub: 'code' | 'commits' | 'pulls' | 'issues' | 'gists'
  const [gitTab, setGitTab] = useState<'code' | 'commits' | 'pulls' | 'issues' | 'gists'>('code');

  // Branches
  const [branches, setBranches] = useState<GitBranch[]>([
    { name: 'main', isDefault: true, isCurrent: true, lastCommitHash: '8b91a2c' },
    { name: 'feature/fast-ast-parser', isDefault: false, isCurrent: false, lastCommitHash: '5e41f09' },
    { name: 'fix/boundary-conditions', isDefault: false, isCurrent: false, lastCommitHash: '3d77e11' },
  ]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');

  // Commits History
  const [commits, setCommits] = useState<GitCommit[]>([
    {
      id: 'c-3',
      hash: '8b91a2c8f1e29d03',
      shortHash: '8b91a2c',
      message: 'feat: add real-time Google Search grounding & 105 language definitions',
      author: 'smurari229',
      authorEmail: 'smurari229@gmail.com',
      timestamp: '12 minutes ago',
      branch: 'main',
      filesChanged: 3,
      insertions: 142,
      deletions: 18,
      codeSnapshot: activeCode,
    },
    {
      id: 'c-2',
      hash: '5e41f09ab9c18274',
      shortHash: '5e41f09',
      message: 'refactor: integrate AST-level deep debugger with automatic rate-limit recovery',
      author: 'OmniCode Agent',
      authorEmail: 'agent@omnicode.ai',
      timestamp: '1 hour ago',
      branch: 'main',
      filesChanged: 2,
      insertions: 89,
      deletions: 12,
      codeSnapshot: activeCode,
    },
    {
      id: 'c-1',
      hash: '3d77e1104e8a65bb',
      shortHash: '3d77e11',
      message: 'Initial commit: Multi-language workspace scaffold with Vercel & Replit runtime',
      author: 'smurari229',
      authorEmail: 'smurari229@gmail.com',
      timestamp: '3 hours ago',
      branch: 'main',
      filesChanged: 6,
      insertions: 350,
      deletions: 0,
      codeSnapshot: activeCode,
    },
  ]);

  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(null);

  // Commit Creation Form
  const [commitMessage, setCommitMessage] = useState('');
  const [commitTargetBranch, setCommitTargetBranch] = useState('main');
  const [commitSuccessNotice, setCommitSuccessNotice] = useState(false);

  // Pull Requests
  const [pullRequests, setPullRequests] = useState<GitPullRequest[]>([
    {
      id: 'pr-1',
      number: 1,
      title: 'feat: AST memory leak diagnostics and automated test suite',
      description: 'Audits memory consumption on nested loops and generates automated assertions.',
      author: 'smurari229',
      sourceBranch: 'feature/fast-ast-parser',
      targetBranch: 'main',
      status: 'open',
      createdTime: '25 minutes ago',
      comments: [
        { author: 'omnicode-bot', text: 'All 105 language integration tests passed. Zero regressions detected.', timestamp: '20 minutes ago' }
      ],
      diffSummary: '+142 -18 lines across 3 files',
      mergeable: true,
    }
  ]);
  const [activePR, setActivePR] = useState<GitPullRequest | null>(null);
  const [newPRTitle, setNewPRTitle] = useState('');
  const [newPRDesc, setNewPRDesc] = useState('');
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [prCommentInput, setPrCommentInput] = useState('');

  // Issues
  const [issues, setIssues] = useState<GitIssue[]>([
    {
      id: 'iss-1',
      number: 4,
      title: 'Add Rust Cargo.lock auto-dependency resolution for Nix',
      description: 'Replit Nix packaging requires lockfile validation when running cargo build.',
      author: 'developer',
      labels: ['enhancement', 'replit'],
      status: 'open',
      createdTime: '45 minutes ago'
    },
    {
      id: 'iss-2',
      number: 3,
      title: 'Optimize Google Search grounding latency on 3G connections',
      description: 'Cache repeated search terms across the session.',
      author: 'smurari229',
      labels: ['performance', 'gemini'],
      status: 'open',
      createdTime: '2 hours ago'
    }
  ]);
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  // Gists
  const [gists, setGists] = useState<GitGist[]>([
    {
      id: 'gist-1',
      description: 'Polyglot Fast Matrix Multiplication Algorithm (C++ & Rust)',
      fileName: 'matrix_mult.rs',
      content: activeCode,
      isPublic: true,
      createdTime: '1 hour ago',
      url: 'https://gist.github.com/omnicode/a892df41'
    }
  ]);
  const [newGistDesc, setNewGistDesc] = useState('');
  const [newGistPublic, setNewGistPublic] = useState(true);

  // Handle Commit Action
  const handlePerformCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const hash = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const shortHash = hash.substring(0, 7);

    const newCommit: GitCommit = {
      id: `c-${Date.now()}`,
      hash,
      shortHash,
      message: commitMessage.trim(),
      author: 'smurari229',
      authorEmail: 'smurari229@gmail.com',
      timestamp: 'just now',
      branch: commitTargetBranch,
      filesChanged: files.length,
      insertions: Math.floor(Math.random() * 40) + 5,
      deletions: Math.floor(Math.random() * 10),
      codeSnapshot: activeCode,
    };

    setCommits([newCommit, ...commits]);
    onCommitChanges(commitMessage.trim(), commitTargetBranch);
    setCommitMessage('');
    setCommitSuccessNotice(true);
    setTimeout(() => setCommitSuccessNotice(false), 3000);
  };

  // Create Branch
  const handleCreateBranch = () => {
    if (!newBranchInput.trim()) return;
    const name = newBranchInput.trim().replace(/\s+/g, '-');
    setBranches([...branches, { name, isDefault: false, isCurrent: true, lastCommitHash: commits[0]?.shortHash || 'main' }]);
    setCurrentBranch(name);
    setNewBranchInput('');
    setIsBranchDropdownOpen(false);
  };

  // Merge PR
  const handleMergePR = (prId: string) => {
    setPullRequests(prev => prev.map(pr => pr.id === prId ? { ...pr, status: 'merged' } : pr));
    if (activePR && activePR.id === prId) {
      setActivePR({ ...activePR, status: 'merged' });
    }
  };

  // Add Comment to PR
  const handleAddPRComment = (prId: string) => {
    if (!prCommentInput.trim()) return;
    const newComment = {
      author: 'smurari229',
      text: prCommentInput.trim(),
      timestamp: 'just now'
    };
    setPullRequests(prev => prev.map(pr => pr.id === prId ? { ...pr, comments: [...pr.comments, newComment] } : pr));
    if (activePR && activePR.id === prId) {
      setActivePR({ ...activePR, comments: [...activePR.comments, newComment] });
    }
    setPrCommentInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* GitHub Repository Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-purple-400 hover:underline cursor-pointer">smurari229</span>
                <span className="text-slate-500">/</span>
                <span className="text-sm font-bold text-slate-100">omnicode-workspace</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">Public</span>
              </div>
              <p className="text-xs text-slate-400">Global Knowledge AI Studio with 105 Languages, AST Debugger &amp; Multi-Cloud Runtime</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDeployToVercel}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>▲ Deploy to Vercel</span>
            </button>
            <button
              onClick={onSwitchToEditor}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              Open in Editor
            </button>
            <div className="flex items-center border border-slate-700 rounded-md bg-slate-800/80 text-xs overflow-hidden">
              <button className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:bg-slate-700">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Star</span>
              </button>
              <span className="px-2 py-1 bg-slate-900 text-slate-400 border-l border-slate-700 font-mono">1.4k</span>
            </div>
          </div>
        </div>

        {/* GitHub Navigation Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800 -mb-3 text-xs">
          <button
            onClick={() => setGitTab('code')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              gitTab === 'code'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setGitTab('commits')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              gitTab === 'commits'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommitIcon className="w-4 h-4" />
            <span>Commits ({commits.length})</span>
          </button>

          <button
            onClick={() => setGitTab('pulls')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              gitTab === 'pulls'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequestIcon className="w-4 h-4" />
            <span>Pull Requests ({pullRequests.filter(p => p.status === 'open').length})</span>
          </button>

          <button
            onClick={() => setGitTab('issues')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              gitTab === 'issues'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CircleDot className="w-4 h-4" />
            <span>Issues ({issues.filter(i => i.status === 'open').length})</span>
          </button>

          <button
            onClick={() => setGitTab('gists')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium transition-colors ${
              gitTab === 'gists'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Gists ({gists.length})</span>
          </button>
        </div>
      </div>

      {/* Main GitHub Content Views */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 1. CODE & REPOSITORY VIEW */}
        {gitTab === 'code' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Branch Bar & Commit Authoring Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium"
                >
                  <GitBranchIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{currentBranch}</span>
                  <span className="text-[10px] text-slate-400">({branches.length} branches)</span>
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 p-2 text-xs">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 px-1">Switch Branches</div>
                    <div className="space-y-0.5 max-h-40 overflow-y-auto mb-2">
                      {branches.map((b) => (
                        <div
                          key={b.name}
                          onClick={() => {
                            setCurrentBranch(b.name);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`px-2 py-1.5 rounded cursor-pointer font-mono flex items-center justify-between ${
                            currentBranch === b.name ? 'bg-purple-600/20 text-purple-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{b.name}</span>
                          {currentBranch === b.name && <Check className="w-3 h-3 text-purple-400" />}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="New branch name..."
                          value={newBranchInput}
                          onChange={(e) => setNewBranchInput(e.target.value)}
                          className="flex-1 bg-slate-950 text-[11px] px-2 py-1 rounded text-slate-200 border border-slate-700"
                        />
                        <button
                          onClick={handleCreateBranch}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px]"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Commit Creation Composer */}
              <form onSubmit={handlePerformCommit} className="flex-1 max-w-xl flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Commit message (e.g. fix: bounds check in loop)..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="flex-1 bg-slate-900 text-xs px-3 py-1.5 rounded-md border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition-colors shrink-0 shadow-sm"
                >
                  Commit changes
                </button>
              </form>
            </div>

            {commitSuccessNotice && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Changes successfully committed to <strong>{commitTargetBranch}</strong>! Git tree updated.</span>
              </div>
            )}

            {/* Latest Commit Bar */}
            <div className="p-3 rounded-t-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {commits[0]?.author[0].toUpperCase()}
                </div>
                <span className="font-semibold text-slate-200">{commits[0]?.author}</span>
                <span className="text-slate-400 truncate max-w-md">{commits[0]?.message}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-slate-400 text-[11px]">
                <span>{commits[0]?.shortHash}</span>
                <span>{commits[0]?.timestamp}</span>
              </div>
            </div>

            {/* Files List Table */}
            <div className="border-x border-b border-slate-800 rounded-b-lg overflow-hidden bg-slate-950/70">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs hover:bg-slate-900/60 transition-colors ${
                    idx !== files.length - 1 ? 'border-b border-slate-800/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-mono">
                    <FileCode className="w-4 h-4 text-slate-400" />
                    <span className="text-purple-300 font-medium hover:underline cursor-pointer">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-slate-400 font-mono text-[11px]">
                    <span className="truncate max-w-xs">{commits[0]?.message}</span>
                    <span>{file.content.length} bytes</span>
                  </div>
                </div>
              ))}
            </div>

            {/* README Preview Box */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>README.md</span>
              </div>
              <div className="p-6 text-xs text-slate-300 space-y-3 leading-relaxed">
                <h2 className="text-lg font-bold text-slate-100 pb-2 border-b border-slate-800">
                  OmniCode AI Polyglot Studio
                </h2>
                <p>
                  A unified engineering ecosystem featuring <strong>105 programming languages</strong>, real-time Google Search grounding, deep AST-level debugging, and native <strong>GitHub, Vercel, and Replit</strong> execution environments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <div className="font-semibold text-purple-400 mb-1">🐙 GitHub Built-In</div>
                    <div className="text-[11px] text-slate-400">Git commit graph, branches, pull requests with code reviews, and issue tracking.</div>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <div className="font-semibold text-blue-400 mb-1">▲ Vercel Built-In</div>
                    <div className="text-[11px] text-slate-400">1-click Edge CDN deployment pipeline, preview sandbox with device responsiveness.</div>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <div className="font-semibold text-orange-400 mb-1">⚡ Replit Built-In</div>
                    <div className="text-[11px] text-slate-400">Multi-file cloud workspace with interactive bash REPL terminal and package manager.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMMITS GRAPH & DIFF VIEW */}
        {gitTab === 'commits' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Commit History &amp; Git Graph ({commits.length} commits)</h3>
              <span className="text-xs text-slate-400 font-mono">Branch: {currentBranch}</span>
            </div>

            {/* Commits Timeline */}
            <div className="space-y-3">
              {commits.map((commit, idx) => (
                <div
                  key={commit.id}
                  onClick={() => setSelectedCommit(selectedCommit?.id === commit.id ? null : commit)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCommit?.id === commit.id
                      ? 'bg-purple-950/20 border-purple-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-xs font-semibold text-slate-100">{commit.message}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                        {commit.shortHash}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{commit.author} &lt;{commit.authorEmail}&gt;</span>
                      <span>•</span>
                      <span>{commit.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">+{commit.insertions}</span>
                      <span className="text-rose-400">-{commit.deletions}</span>
                    </div>
                  </div>

                  {/* Expanded Commit Diff Viewer */}
                  {selectedCommit?.id === commit.id && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="font-semibold text-slate-300">Commit Diff Details:</span>
                        <span className="text-slate-400 font-mono text-[11px]">Full Hash: {commit.hash}</span>
                      </div>
                      <div className="p-3 rounded bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800/80 overflow-x-auto max-h-60">
                        <div className="text-slate-500 mb-2">--- a/workspace/main.code<br/>+++ b/workspace/main.code</div>
                        <div className="text-emerald-400 leading-5 whitespace-pre">
                          {`+ // Commit ${commit.shortHash}: ${commit.message}
+ // Author: ${commit.author} (${commit.timestamp})
+ // Verified by OmniCode Automated Testing Suite
`}
                        </div>
                        <div className="text-slate-300 leading-5 whitespace-pre">
                          {commit.codeSnapshot.slice(0, 400)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PULL REQUESTS & CODE REVIEW */}
        {gitTab === 'pulls' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Pull Requests &amp; Code Review</h3>
              <button
                onClick={() => setIsCreatingPR(!isCreatingPR)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-medium transition-colors"
              >
                {isCreatingPR ? 'Cancel' : 'New Pull Request'}
              </button>
            </div>

            {/* Create PR Form */}
            {isCreatingPR && (
              <div className="p-4 rounded-lg bg-slate-900 border border-purple-500/40 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200">Open a New Pull Request</h4>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>base: <strong>main</strong></span>
                  <span>←</span>
                  <span>compare: <strong>feature/fast-ast-parser</strong></span>
                </div>
                <input
                  type="text"
                  placeholder="PR Title (e.g. feat: integrate Big-O calculation)"
                  value={newPRTitle}
                  onChange={(e) => setNewPRTitle(e.target.value)}
                  className="w-full bg-slate-950 text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-200"
                />
                <textarea
                  placeholder="Leave a comment describing the architectural changes..."
                  value={newPRDesc}
                  onChange={(e) => setNewPRDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 text-xs p-3 rounded border border-slate-700 text-slate-200 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreatingPR(false)}
                    className="px-3 py-1 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newPRTitle.trim()) return;
                      const newPr: GitPullRequest = {
                        id: `pr-${Date.now()}`,
                        number: pullRequests.length + 1,
                        title: newPRTitle.trim(),
                        description: newPRDesc.trim() || 'No description provided.',
                        author: 'smurari229',
                        sourceBranch: 'feature/fast-ast-parser',
                        targetBranch: 'main',
                        status: 'open',
                        createdTime: 'just now',
                        comments: [],
                        diffSummary: '+42 -6 lines across 2 files',
                        mergeable: true,
                      };
                      setPullRequests([newPr, ...pullRequests]);
                      setIsCreatingPR(false);
                      setNewPRTitle('');
                      setNewPRDesc('');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium"
                  >
                    Create Pull Request
                  </button>
                </div>
              </div>
            )}

            {/* Pull Requests List */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 divide-y divide-slate-800">
              {pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setActivePR(activePR?.id === pr.id ? null : pr)}
                  className="p-4 hover:bg-slate-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${pr.status === 'open' ? 'bg-emerald-400' : 'bg-purple-400'}`} />
                      <span className="text-xs font-semibold text-slate-100 hover:text-purple-300">
                        {pr.title} <span className="text-slate-500">#{pr.number}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        pr.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {pr.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{pr.diffSummary}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <span>by {pr.author}</span>
                    <span>•</span>
                    <span>opened {pr.createdTime}</span>
                    <span>•</span>
                    <span className="text-slate-300">{pr.sourceBranch} → {pr.targetBranch}</span>
                  </div>

                  {/* Expanded PR Details & Merge Controls */}
                  {activePR?.id === pr.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                        {pr.description}
                      </p>

                      {/* Comments Thread */}
                      <div className="space-y-2">
                        {pr.comments.map((comment, i) => (
                          <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                              <span className="font-semibold text-purple-300">{comment.author}</span>
                              <span>{comment.timestamp}</span>
                            </div>
                            <div className="text-slate-200">{comment.text}</div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Leave a review comment..."
                          value={prCommentInput}
                          onChange={(e) => setPrCommentInput(e.target.value)}
                          className="flex-1 bg-slate-950 text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-200"
                        />
                        <button
                          onClick={() => handleAddPRComment(pr.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
                        >
                          Comment
                        </button>
                      </div>

                      {/* Merge PR Button */}
                      {pr.status === 'open' && (
                        <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                          <div className="text-xs text-emerald-300">
                            <strong>Ready to Merge:</strong> No conflicts with base branch.
                          </div>
                          <button
                            onClick={() => handleMergePR(pr.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors"
                          >
                            Merge Pull Request
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ISSUES TRACKER */}
        {gitTab === 'issues' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">GitHub Issues Tracker</h3>
              <button
                onClick={() => setIsCreatingIssue(!isCreatingIssue)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-medium"
              >
                {isCreatingIssue ? 'Cancel' : 'New Issue'}
              </button>
            </div>

            {isCreatingIssue && (
              <div className="p-4 rounded-lg bg-slate-900 border border-purple-500/40 space-y-3">
                <input
                  type="text"
                  placeholder="Issue Title"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full bg-slate-950 text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-200"
                />
                <textarea
                  placeholder="Describe the bug or feature request..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 text-xs p-3 rounded border border-slate-700 text-slate-200 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      if (!issueTitle.trim()) return;
                      const newIss: GitIssue = {
                        id: `iss-${Date.now()}`,
                        number: issues.length + 1,
                        title: issueTitle.trim(),
                        description: issueDesc.trim(),
                        author: 'smurari229',
                        labels: ['bug', 'investigating'],
                        status: 'open',
                        createdTime: 'just now',
                      };
                      setIssues([newIss, ...issues]);
                      setIsCreatingIssue(false);
                      setIssueTitle('');
                      setIssueDesc('');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium"
                  >
                    Submit Issue
                  </button>
                </div>
              </div>
            )}

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 divide-y divide-slate-800">
              {issues.map((issue) => (
                <div key={issue.id} className="p-4 flex items-center justify-between hover:bg-slate-900 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CircleDot className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-100">{issue.title}</span>
                      {issue.labels.map((label) => (
                        <span key={label} className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      #{issue.number} opened {issue.createdTime} by {issue.author}
                    </div>
                  </div>
                  <button
                    onClick={() => setIssues(issues.map(i => i.id === issue.id ? { ...i, status: i.status === 'open' ? 'closed' : 'open' } : i))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    {issue.status === 'open' ? 'Close issue' : 'Reopen issue'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GISTS */}
        {gitTab === 'gists' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">GitHub Gists (Code Snippets)</h3>
              <button
                onClick={() => {
                  const newGist: GitGist = {
                    id: `gist-${Date.now()}`,
                    description: newGistDesc || 'Active Code Snippet from OmniCode Workspace',
                    fileName: files[0]?.name || 'snippet.code',
                    content: activeCode,
                    isPublic: newGistPublic,
                    createdTime: 'just now',
                    url: `https://gist.github.com/omnicode/${Math.random().toString(16).substring(2, 8)}`,
                  };
                  setGists([newGist, ...gists]);
                  setNewGistDesc('');
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-medium"
              >
                + Create Gist from Editor
              </button>
            </div>

            <div className="space-y-4">
              {gists.map((gist) => (
                <div key={gist.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-purple-300">{gist.description}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{gist.fileName} • {gist.createdTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {gist.isPublic ? 'Public' : 'Secret'}
                      </span>
                      <a
                        href={gist.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>{gist.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <pre className="p-3 rounded bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800/80 overflow-x-auto max-h-40">
                    {gist.content.slice(0, 300)}...
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
