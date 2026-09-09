import React, { useState, useEffect, useRef } from 'react';
import { ProgrammingLanguage, WorkspaceFile, ReplitPackage, ReplitTerminalLine, ReplitTelemetry } from '../types';
import { 
  Play, 
  Square, 
  Terminal as TerminalIcon, 
  FolderTree, 
  Plus, 
  Trash2, 
  FileCode, 
  Cpu, 
  HardDrive, 
  Package, 
  Key, 
  Eye, 
  RefreshCw, 
  Check, 
  Layers,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';

interface ReplitPlatformProps {
  currentLanguage: ProgrammingLanguage;
  files: WorkspaceFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onUpdateFileContent: (fileId: string, content: string) => void;
  onCreateFile: (name: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  onOpenGitHub: () => void;
  onOpenVercel: () => void;
  onOpenDebugger: () => void;
}

const DEFAULT_PACKAGES: ReplitPackage[] = [
  { name: 'requests', version: '2.31.0', language: 'python', installed: true, description: 'HTTP library for Python' },
  { name: 'numpy', version: '1.26.4', language: 'python', installed: true, description: 'Fundamental package for scientific computing' },
  { name: 'express', version: '4.19.2', language: 'javascript', installed: true, description: 'Fast, unopinionated web framework for Node' },
  { name: 'lodash', version: '4.17.21', language: 'javascript', installed: false, description: 'Modern JavaScript utility library' },
  { name: 'serde', version: '1.0.200', language: 'rust', installed: true, description: 'Generic serialization/deserialization framework' },
  { name: 'tokio', version: '1.38.0', language: 'rust', installed: false, description: 'An asynchronous runtime for Rust' },
  { name: 'gin-gonic/gin', version: '1.9.1', language: 'go', installed: false, description: 'HTTP web framework written in Go' },
];

export const ReplitPlatform: React.FC<ReplitPlatformProps> = ({
  currentLanguage,
  files,
  activeFileId,
  onSelectFile,
  onUpdateFileContent,
  onCreateFile,
  onDeleteFile,
  onRunCode,
  isRunning,
  onOpenGitHub,
  onOpenVercel,
  onOpenDebugger,
}) => {
  // Sidebar tab: 'files' | 'packages' | 'secrets' | 'config'
  const [sidebarTab, setSidebarTab] = useState<'files' | 'packages' | 'secrets' | 'config'>('files');
  // Right output view: 'terminal' | 'preview'
  const [outputTab, setOutputTab] = useState<'terminal' | 'preview'>('terminal');

  // New file input state
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Packages state
  const [packages, setPackages] = useState<ReplitPackage[]>(DEFAULT_PACKAGES);
  const [packageSearch, setPackageSearch] = useState('');
  const [isInstallingPkg, setIsInstallingPkg] = useState<string | null>(null);

  // Secrets state
  const [secrets, setSecrets] = useState<Array<{ key: string; value: string }>>([
    { key: 'API_KEY', value: 'sk_live_omnicode_repl_992' },
    { key: 'DATABASE_URL', value: 'postgresql://repl:sandbox@localhost:5432/repl_db' },
    { key: 'NODE_ENV', value: 'development' }
  ]);
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretVal, setNewSecretVal] = useState('');

  // Telemetry state
  const [telemetry, setTelemetry] = useState<ReplitTelemetry>({
    cpuPercent: 3.8,
    ramUsageMB: 28.4,
    status: 'online',
    storageMB: 12.6,
  });

  // Terminal REPL State
  const [terminalLines, setTerminalLines] = useState<ReplitTerminalLine[]>([
    { id: '1', type: 'system', text: `OmniCode Cloud Repl v4.2 [${currentLanguage.name} Runtime Environment]` },
    { id: '2', type: 'system', text: `Linux repl-vm-container 6.1.0-cloud-amd64 #1 SMP x86_64` },
    { id: '3', type: 'output', text: `Type 'help' to inspect commands, 'run' to execute, or 'deploy' for Vercel.` },
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active file
  const currentFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  // Handle Command in Shell
  const handleExecuteCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLines: ReplitTerminalLine[] = [
      ...terminalLines,
      { id: String(Date.now()), type: 'prompt', text: `$ ${trimmed}` }
    ];

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
      case 'help':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `Available Replit Shell Commands:
  run                   - Execute current active file (${currentFile?.name})
  ls                    - List all files in the Repl workspace
  cat <filename>        - Display contents of a file
  pip/npm install <pkg> - Install package into container
  pip/npm list          - List installed packages
  clear                 - Clear the terminal screen
  git status            - Inspect Git repository state
  git commit -m "msg"   - Commit changes to built-in GitHub
  deploy                - Trigger 1-click Vercel Edge deployment
  env                   - Print environment secrets
  telemetry             - Display container CPU/RAM resource usage`
        });
        break;

      case 'clear':
        setTerminalLines([]);
        setCommandInput('');
        return;

      case 'ls':
        const fileList = files.map((f) => `${f.name.padEnd(20)} (${f.content.length} bytes)`).join('\n');
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: fileList || 'No files in workspace'
        });
        break;

      case 'cat':
        if (!arg) {
          newLines.push({ id: String(Date.now() + 1), type: 'error', text: 'Usage: cat <filename>' });
        } else {
          const target = files.find((f) => f.name.toLowerCase() === arg.toLowerCase());
          if (target) {
            newLines.push({ id: String(Date.now() + 1), type: 'output', text: target.content });
          } else {
            newLines.push({ id: String(Date.now() + 1), type: 'error', text: `File '${arg}' not found.` });
          }
        }
        break;

      case 'run':
      case 'python':
      case 'node':
      case 'cargo':
      case 'go':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'system',
          text: `[Replit Runner] Spawning sandbox process for ${currentFile.name}...`
        });
        onRunCode();
        setTimeout(() => {
          setTerminalLines((prev) => [
            ...prev,
            { id: String(Date.now()), type: 'output', text: `Execution exited with code 0 (Process completed in 24ms)` }
          ]);
        }, 600);
        break;

      case 'git':
        if (parts[1] === 'status') {
          const modifiedFiles = files.filter(f => f.isModified);
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `On branch main\nChanges not staged for commit:\n${modifiedFiles.length > 0 ? modifiedFiles.map(f => `  modified: ${f.name}`).join('\n') : '  (working tree clean)'}`
          });
        } else if (parts[1] === 'commit') {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `[main 7f2a89c] ${parts.slice(3).join(' ') || 'Commit from Replit shell'}\n ${files.length} files changed, 24 insertions(+)`
          });
        } else {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: `Git engine active. Switch to the 'GitHub' tab for visual branching & pull requests.`
          });
        }
        break;

      case 'deploy':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'system',
          text: `Routing build to Vercel Edge Pipeline... Check the 'Vercel' tab to watch live deployment!`
        });
        onOpenVercel();
        break;

      case 'env':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: secrets.map((s) => `${s.key}=${s.value}`).join('\n')
        });
        break;

      case 'telemetry':
        newLines.push({
          id: String(Date.now() + 1),
          type: 'output',
          text: `CPU: ${telemetry.cpuPercent}%\nRAM: ${telemetry.ramUsageMB} MB / 512 MB\nStorage: ${telemetry.storageMB} MB / 1024 MB\nStatus: ${telemetry.status.toUpperCase()}`
        });
        break;

      case 'pip':
      case 'npm':
      case 'cargo':
        if (parts[1] === 'install') {
          const pkgToInstall = parts[2] || 'package';
          newLines.push({
            id: String(Date.now() + 1),
            type: 'system',
            text: `Resolving dependencies for '${pkgToInstall}'...\nDownloaded ${pkgToInstall} (100%)\nSuccessfully installed into Repl virtual environment.`
          });
          setPackages((prev) => [
            { name: pkgToInstall, version: '1.0.0', language: currentLanguage.id, installed: true, description: 'Installed via shell' },
            ...prev
          ]);
        } else if (parts[1] === 'list') {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'output',
            text: packages.filter(p => p.installed).map(p => `${p.name.padEnd(20)} ${p.version}`).join('\n')
          });
        }
        break;

      default:
        newLines.push({
          id: String(Date.now() + 1),
          type: 'error',
          text: `bash: ${cmd}: command not found. Type 'help' for available commands.`
        });
        break;
    }

    setTerminalLines(newLines);
    setCommandInput('');
  };

  // Install package via GUI
  const handleTogglePackage = (pkgName: string) => {
    setIsInstallingPkg(pkgName);
    setTimeout(() => {
      setPackages((prev) =>
        prev.map((p) => (p.name === pkgName ? { ...p, installed: !p.installed } : p))
      );
      setTerminalLines((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'system', text: `[Replit Nix] Configured package '${pkgName}' in replit.nix` }
      ]);
      setIsInstallingPkg(null);
    }, 600);
  };

  // Add secret
  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretKey.trim()) return;
    setSecrets((prev) => [...prev, { key: newSecretKey.trim().toUpperCase(), value: newSecretVal.trim() }]);
    setNewSecretKey('');
    setNewSecretVal('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Replit Top Control Strip */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            REPLIT CLOUD IDE
          </div>

          {/* Run / Stop Button */}
          <button
            id="replit-run-btn"
            onClick={onRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              isRunning
                ? 'bg-amber-600 text-white animate-pulse cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950/40'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run (Ctrl+Enter)</span>
              </>
            )}
          </button>

          {/* Quick Cross-Platform Jump Buttons */}
          <button
            onClick={onOpenGitHub}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            title="Open GitHub Version Control for this Repl"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Git &amp; PRs</span>
          </button>

          <button
            onClick={onOpenVercel}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            title="Deploy this Repl to Vercel Edge Network"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Deploy to Vercel</span>
          </button>
        </div>

        {/* Replit Telemetry Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CPU: {isRunning ? '48%' : `${telemetry.cpuPercent}%`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>RAM: {telemetry.ramUsageMB} MB / 512 MB</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Repl Active</span>
          </div>
        </div>
      </div>

      {/* Main Split Body: Left Tool Drawer | Center Code Editor | Right Terminal/Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Replit Navigation / Files / Packages Sidebar */}
        <div className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          {/* Sidebar Tab Header */}
          <div className="flex border-b border-slate-800 bg-slate-950 text-xs">
            <button
              onClick={() => setSidebarTab('files')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
                sidebarTab === 'files'
                  ? 'border-orange-500 text-orange-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Files"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Files</span>
            </button>
            <button
              onClick={() => setSidebarTab('packages')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
                sidebarTab === 'packages'
                  ? 'border-orange-500 text-orange-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Packages"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Packages</span>
            </button>
            <button
              onClick={() => setSidebarTab('secrets')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
                sidebarTab === 'secrets'
                  ? 'border-orange-500 text-orange-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Secrets (.env)"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Secrets</span>
            </button>
          </div>

          {/* Files List View */}
          {sidebarTab === 'files' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">Workspace Files</span>
                <button
                  onClick={() => setIsCreatingFile(true)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  title="Add new file"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isCreatingFile && (
                <div className="mb-2 p-1.5 rounded bg-slate-800 border border-slate-700">
                  <input
                    type="text"
                    placeholder="e.g. index.html or utils.py"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newFileName.trim()) {
                        onCreateFile(newFileName.trim());
                        setNewFileName('');
                        setIsCreatingFile(false);
                      } else if (e.key === 'Escape') {
                        setIsCreatingFile(false);
                      }
                    }}
                    autoFocus
                    className="w-full bg-slate-950 text-xs px-2 py-1 rounded text-slate-100 border border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <div className="flex justify-end gap-1 mt-1 text-[10px]">
                    <button
                      onClick={() => setIsCreatingFile(false)}
                      className="px-2 py-0.5 text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newFileName.trim()) {
                          onCreateFile(newFileName.trim());
                          setNewFileName('');
                          setIsCreatingFile(false);
                        }
                      }}
                      className="px-2 py-0.5 bg-orange-600 text-white rounded hover:bg-orange-500"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-0.5">
                {files.map((file) => {
                  const isActive = file.id === activeFileId;
                  return (
                    <div
                      key={file.id}
                      onClick={() => onSelectFile(file.id)}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-orange-500/15 text-orange-300 font-medium border border-orange-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                        <span className="truncate font-mono">{file.name}</span>
                        {file.isModified && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Modified" />
                        )}
                      </div>

                      {files.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFile(file.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 transition-opacity"
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Repl Config Links */}
              <div className="mt-auto pt-3 border-t border-slate-800/80 text-xs">
                <div className="px-2 py-1 text-[10px] text-slate-500 font-mono">REPL CONFIGURATION</div>
                <div className="px-2.5 py-1 text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="text-orange-400 font-bold">.replit</span> (entrypoint: {currentFile?.name})
                </div>
                <div className="px-2.5 py-1 text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">replit.nix</span> (pkgs.{currentLanguage.id})
                </div>
              </div>
            </div>
          )}

          {/* Packages Manager View */}
          {sidebarTab === 'packages' && (
            <div className="flex-1 flex flex-col p-2 overflow-y-auto">
              <input
                type="text"
                placeholder="Search packages (e.g. numpy, express)"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                className="w-full bg-slate-950 text-xs px-2.5 py-1.5 rounded border border-slate-800 text-slate-200 focus:outline-none focus:border-orange-500 mb-2"
              />

              <div className="space-y-1.5">
                {packages
                  .filter((p) => p.name.toLowerCase().includes(packageSearch.toLowerCase()))
                  .map((pkg) => (
                    <div
                      key={pkg.name}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-slate-200">{pkg.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">v{pkg.version}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{pkg.description}</p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleTogglePackage(pkg.name)}
                          disabled={isInstallingPkg === pkg.name}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            pkg.installed
                              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                              : 'bg-orange-600 hover:bg-orange-500 text-white'
                          }`}
                        >
                          {isInstallingPkg === pkg.name
                            ? 'Configuring Nix...'
                            : pkg.installed
                            ? '✓ Installed'
                            : '+ Install'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Secrets (.env) Manager View */}
          {sidebarTab === 'secrets' && (
            <div className="flex-1 flex flex-col p-2 overflow-y-auto">
              <div className="text-[11px] text-slate-400 mb-2">
                Environment variables are injected directly into the Repl container runtime.
              </div>

              <form onSubmit={handleAddSecret} className="mb-3 space-y-1.5 p-2 rounded bg-slate-950 border border-slate-800">
                <input
                  type="text"
                  placeholder="KEY (e.g. STRIPE_KEY)"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  className="w-full bg-slate-900 text-xs px-2 py-1 rounded text-slate-200 border border-slate-700 uppercase font-mono"
                />
                <input
                  type="password"
                  placeholder="Value"
                  value={newSecretVal}
                  onChange={(e) => setNewSecretVal(e.target.value)}
                  className="w-full bg-slate-900 text-xs px-2 py-1 rounded text-slate-200 border border-slate-700 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium transition-colors"
                >
                  + Add Secret
                </button>
              </form>

              <div className="space-y-1">
                {secrets.map((sec, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-mono text-orange-400 font-medium">{sec.key}</div>
                      <div className="text-[10px] text-slate-500 font-mono">•••••••••••••</div>
                    </div>
                    <button
                      onClick={() => setSecrets(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: In-App Code Editor */}
        <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-9 bg-slate-900/80 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-slate-200">{currentFile?.name}</span>
              {currentFile?.isModified && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Uncommitted</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDebugger}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Debug</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="flex-1 relative flex overflow-hidden font-mono text-xs bg-slate-950">
            {/* Line numbers gutter */}
            <div className="w-11 bg-slate-900/50 text-slate-600 select-none text-right pr-2 py-3 border-r border-slate-800/60 shrink-0 font-mono text-xs">
              {(currentFile?.content || '').split('\n').map((_, idx) => (
                <div key={idx} className="leading-5">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              id="replit-code-editor"
              value={currentFile?.content || ''}
              onChange={(e) => onUpdateFileContent(currentFile.id, e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-100 p-3 leading-5 resize-none focus:outline-none font-mono text-xs selection:bg-orange-500/30 overflow-auto"
              style={{ tabSize: 2 }}
            />
          </div>
        </div>

        {/* Right Output: Interactive Terminal REPL or Live Web Preview */}
        <div className="w-96 flex flex-col bg-slate-950 overflow-hidden shrink-0">
          {/* Tab Selector */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOutputTab('terminal')}
                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                  outputTab === 'terminal'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Console / Shell</span>
              </button>
              <button
                onClick={() => setOutputTab('preview')}
                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                  outputTab === 'preview'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Web Preview</span>
              </button>
            </div>

            {outputTab === 'terminal' && (
              <button
                onClick={() => setTerminalLines([])}
                className="text-slate-400 hover:text-slate-200 text-[11px]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Terminal Console Mode */}
          {outputTab === 'terminal' && (
            <div className="flex-1 flex flex-col bg-slate-950 p-3 font-mono text-xs overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-1 mb-2 pr-1">
                {terminalLines.map((line) => (
                  <div
                    key={line.id}
                    className={`leading-relaxed whitespace-pre-wrap break-all ${
                      line.type === 'system'
                        ? 'text-cyan-400'
                        : line.type === 'prompt'
                        ? 'text-emerald-400 font-semibold'
                        : line.type === 'error'
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Shell Command Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 shrink-0">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleExecuteCommand(commandInput);
                    } else if (e.key === 'ArrowUp') {
                      if (commandHistory.length > 0) {
                        const newIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
                        setHistoryIndex(newIdx);
                        setCommandInput(commandHistory[commandHistory.length - 1 - newIdx] || '');
                      }
                    } else if (e.key === 'ArrowDown') {
                      if (historyIndex > 0) {
                        const newIdx = historyIndex - 1;
                        setHistoryIndex(newIdx);
                        setCommandInput(commandHistory[commandHistory.length - 1 - newIdx] || '');
                      } else {
                        setHistoryIndex(-1);
                        setCommandInput('');
                      }
                    }
                  }}
                  placeholder="Type command ('help', 'run', 'ls')..."
                  className="flex-1 bg-transparent text-slate-100 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Web Preview Mode */}
          {outputTab === 'preview' && (
            <div className="flex-1 flex flex-col bg-slate-900/50">
              <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] truncate">http://localhost:3000/sandbox</span>
                <button
                  onClick={onRunCode}
                  className="p-1 hover:text-slate-200 text-slate-400"
                  title="Reload Preview"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Replit Live Web Sandbox</h4>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Runs interactive HTML5, React, Python Flask, or Node.js web applications directly inside this workspace.
                </p>
                <button
                  onClick={onRunCode}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium transition-colors"
                >
                  Execute &amp; Render Output
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
