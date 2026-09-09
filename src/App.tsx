import React, { useState, useEffect } from 'react';
import { 
  ProgrammingLanguage, 
  ChatMessage, 
  DebugReport, 
  ExecutionResult,
  WorkspaceFile
} from './types';
import { PROGRAMMING_LANGUAGES } from './data/languages';
import { Header, ActivePlatform } from './components/Header';
import { ReplitPlatform } from './components/ReplitPlatform';
import { GitHubPlatform } from './components/GitHubPlatform';
import { VercelPlatform } from './components/VercelPlatform';
import { DebuggerPanel } from './components/DebuggerPanel';
import { AIChatPanel } from './components/AIChatPanel';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

export default function App() {
  // Default language: Python
  const [currentLanguage, setCurrentLanguage] = useState<ProgrammingLanguage>(() => {
    return PROGRAMMING_LANGUAGES.find((l) => l.id === 'python') || PROGRAMMING_LANGUAGES[0];
  });

  // Active Platform: 'replit' | 'github' | 'vercel' | 'debugger'
  const [activePlatform, setActivePlatform] = useState<ActivePlatform>('replit');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(true);

  // Active Code
  const [code, setCode] = useState<string>(() => currentLanguage.defaultCode);

  // Shared Multi-File Workspace State
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([
    {
      id: 'f-1',
      name: `main${currentLanguage.extension}`,
      content: currentLanguage.defaultCode,
      language: currentLanguage.id,
      isEntry: true,
      lastModified: 'just now',
    },
    {
      id: 'f-2',
      name: 'README.md',
      content: `# OmniCode Polyglot Workspace\n\nEquipped with 105 programming languages, live Google Search grounding, AST debugger, and native GitHub, Vercel, and Replit runtime engines.`,
      language: 'markdown',
      isEntry: false,
      lastModified: 'just now',
    },
    {
      id: 'f-3',
      name: '.replit',
      content: `run = "${currentLanguage.runtime} main${currentLanguage.extension}"\nentrypoint = "main${currentLanguage.extension}"\nhidden = [".config", "package-lock.json"]`,
      language: 'toml',
      isEntry: false,
      lastModified: 'just now',
    },
    {
      id: 'f-4',
      name: 'vercel.json',
      content: `{\n  "version": 2,\n  "framework": "vite",\n  "regions": ["iad1", "fra1", "sin1"],\n  "cleanUrls": true\n}`,
      language: 'json',
      isEntry: false,
      lastModified: 'just now',
    },
  ]);

  // Sync main file content when code changes
  useEffect(() => {
    setWorkspaceFiles((prev) =>
      prev.map((f) => (f.isEntry ? { ...f, content: code, lastModified: 'just now' } : f))
    );
  }, [code]);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Debugger State
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null);

  // AI Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **OmniCode AI Platform**! 🌐\n\nOur application directly embodies the three pillars of modern cloud software engineering:\n- ⚡ **Replit IDE**: Multi-file workspace, interactive bash REPL, \`replit.nix\` packages, secrets, and live preview.\n- 🐙 **GitHub**: Real Git commit graph, branch management, pull requests with side-by-side code review & merge, issues tracker, and Gists.\n- ▲ **Vercel**: 1-click Edge Deployment pipeline, live responsive sandbox preview (Desktop/Tablet/Mobile), rollback history, and Web Vitals.\n- 🐞 **AI Debugger**: AST-level diagnostic engine for all **105 programming languages** with Big-O analysis and 1-click auto-patching.\n\nAsk me any programming question or explore the platform tabs above!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Switch Language
  const handleSelectLanguage = (lang: ProgrammingLanguage, loadDefaultCode: boolean) => {
    setCurrentLanguage(lang);
    if (loadDefaultCode) {
      setCode(lang.defaultCode);
      setWorkspaceFiles((prev) => [
        {
          id: 'f-1',
          name: `main${lang.extension}`,
          content: lang.defaultCode,
          language: lang.id,
          isEntry: true,
          lastModified: 'just now',
        },
        ...prev.filter((f) => !f.isEntry),
      ]);
    }
    setDebugReport(null);
    setExecutionResult(null);
  };

  // Load sample bug for active language
  const handleLoadSampleBug = () => {
    if (currentLanguage.sampleBugCode) {
      setCode(currentLanguage.sampleBugCode);
      const tip = currentLanguage.debuggingTips?.[0] || currentLanguage.bugDescription;
      setMessages((prev) => [
        ...prev,
        {
          id: `bug-loaded-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Loaded a realistic bug into \`main${currentLanguage.extension}\` (${currentLanguage.name}):\n\n> *${tip}*\n\nClick **"AI Debug"** or switch to the **AI Debugger** tab to diagnose and 1-click auto-patch this issue!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setActivePlatform('replit');
    }
  };

  // Reset to default boilerplate
  const handleResetCode = () => {
    setCode(currentLanguage.defaultCode);
    setDebugReport(null);
    setExecutionResult(null);
  };

  // Run Code in sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: currentLanguage.id,
        }),
      });
      const data = await res.json();
      setExecutionResult({
        output: data.output || '',
        errors: data.errors || '',
        duration: data.duration || '24ms',
        memory: data.memory || '14.2 MB',
        exitCode: data.exitCode ?? 0,
      });
    } catch (err: any) {
      setExecutionResult({
        output: '',
        errors: `Execution error: ${err.message}`,
        duration: '0ms',
        memory: '0 MB',
        exitCode: 1,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Debug Code using AST & Gemini AI
  const handleDebugCode = async () => {
    setIsDebugging(true);
    setActivePlatform('debugger');
    try {
      const res = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: currentLanguage.name,
          context: `Target file is main${currentLanguage.extension}, runtime is ${currentLanguage.runtime}`,
        }),
      });
      const data = await res.json();
      if (data.report) {
        setDebugReport(data.report);
      }
    } catch (err: any) {
      console.error('Debug error:', err);
    } finally {
      setIsDebugging(false);
    }
  };

  // Apply code to editor
  const handleApplyCodeToEditor = (newCode: string) => {
    setCode(newCode);
    setActivePlatform('replit');
  };

  // Send AI Chat Message
  const handleSendMessage = async (userPrompt: string, mode: string = 'general') => {
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          codeContext: code,
          language: currentLanguage.name,
          useSearchGrounding: useWebSearch,
          history: historyPayload,
          mode,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've analyzed your code.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error communicating with OmniCode AI: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Hotkey support (Cmd/Ctrl + Enter to run code)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [code, currentLanguage]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Universal Header */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageSelector={() => setIsLangModalOpen(true)}
        useWebSearch={useWebSearch}
        onToggleWebSearch={() => setUseWebSearch(!useWebSearch)}
        onRunCode={handleRunCode}
        onDebugCode={handleDebugCode}
        isRunning={isRunning}
        isDebugging={isDebugging}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        isAiDrawerOpen={isAiDrawerOpen}
        onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
      />

      {/* Main Unified Platform Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Platform Body */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* 1. REPLIT PLATFORM */}
          {activePlatform === 'replit' && (
            <ReplitPlatform
              currentLanguage={currentLanguage}
              code={code}
              onChangeCode={setCode}
              onRunCode={handleRunCode}
              isRunning={isRunning}
              executionResult={executionResult}
              onDebugCode={handleDebugCode}
              onLoadSampleBug={handleLoadSampleBug}
              onResetCode={handleResetCode}
              files={workspaceFiles}
              onUpdateFiles={setWorkspaceFiles}
              onSwitchToGitHub={() => setActivePlatform('github')}
              onSwitchToVercel={() => setActivePlatform('vercel')}
            />
          )}

          {/* 2. GITHUB PLATFORM */}
          {activePlatform === 'github' && (
            <GitHubPlatform
              files={workspaceFiles}
              activeCode={code}
              onCommitChanges={(msg, branch) => {
                // Keep commit log in chat
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `commit-${Date.now()}`,
                    role: 'assistant',
                    content: `🐙 Committed changes to GitHub repository on branch \`${branch}\`:\n> "${msg}"`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              onDeployToVercel={() => setActivePlatform('vercel')}
              onSwitchToEditor={() => setActivePlatform('replit')}
            />
          )}

          {/* 3. VERCEL PLATFORM */}
          {activePlatform === 'vercel' && (
            <VercelPlatform
              activeCode={code}
              files={workspaceFiles}
              onSwitchToReplit={() => setActivePlatform('replit')}
              onSwitchToGitHub={() => setActivePlatform('github')}
            />
          )}

          {/* 4. AI DEBUGGER PLATFORM */}
          {activePlatform === 'debugger' && (
            <DebuggerPanel
              report={debugReport}
              isDebugging={isDebugging}
              onTriggerDebug={handleDebugCode}
              onApplyFixedCode={handleApplyCodeToEditor}
              language={currentLanguage}
              code={code}
            />
          )}
        </div>

        {/* Global AI Copilot Right Drawer (Expandable / Collapsible) */}
        {isAiDrawerOpen && (
          <div className="w-96 border-l border-slate-800 flex flex-col h-full bg-slate-900 shrink-0 shadow-2xl z-20">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 text-xs">
              <span className="font-semibold text-purple-400 flex items-center gap-1.5">
                <span>🌐</span> OmniCode Global AI Copilot
              </span>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isAiLoading}
                language={currentLanguage}
                useWebSearch={useWebSearch}
                onToggleWebSearch={() => setUseWebSearch(!useWebSearch)}
                onApplyCodeToEditor={handleApplyCodeToEditor}
              />
            </div>
          </div>
        )}
      </div>

      {/* 100+ Languages Selection Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </div>
  );
}

