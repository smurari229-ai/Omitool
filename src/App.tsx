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
  const [currentLanguage, setCurrentLanguage] = useState<ProgrammingLanguage>(() => {
    return PROGRAMMING_LANGUAGES.find((l) => l.id === 'python') || PROGRAMMING_LANGUAGES[0];
  });

  const [activePlatform, setActivePlatform] = useState<ActivePlatform>('replit');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [code, setCode] = useState<string>(() => currentLanguage.defaultCode);

  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([
    {
      id: 'f-1',
      name: `main${currentLanguage.extension}`,
      content: currentLanguage.defaultCode,
      languageId: currentLanguage.id,
      language: currentLanguage.id,
      isEntry: true,
      lastModified: 'just now',
    },
    {
      id: 'f-2',
      name: 'README.md',
      content: `# OmniCode Polyglot Workspace\n\nEquipped with 105 language definitions, AI assistance, debugging tools, and integration panels.\n\nExecution is reported honestly: only configured runtimes execute code; unsupported runtimes are reported as unavailable.`,
      languageId: 'markdown',
      language: 'markdown',
      isEntry: false,
      lastModified: 'just now',
    },
    {
      id: 'f-3',
      name: '.replit',
      content: `run = "${currentLanguage.runtime} main${currentLanguage.extension}"\nentrypoint = "main${currentLanguage.extension}"\nhidden = [".config", "package-lock.json"]`,
      languageId: 'toml',
      language: 'toml',
      isEntry: false,
      lastModified: 'just now',
    },
    {
      id: 'f-4',
      name: 'vercel.json',
      content: `{\n  "version": 2,\n  "framework": "vite",\n  "cleanUrls": true\n}`,
      languageId: 'json',
      language: 'json',
      isEntry: false,
      lastModified: 'just now',
    },
  ]);

  useEffect(() => {
    setWorkspaceFiles((prev) =>
      prev.map((f) => (f.isEntry ? { ...f, content: code, lastModified: 'just now' } : f))
    );
  }, [code]);

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **OmniCode AI Platform**! 🌐\n\n- ⚡ **Workspace**: Multi-file coding workspace with language-aware editing.\n- 🐙 **GitHub**: Integration panel for repository operations supported by the connected backend.\n- ▲ **Vercel**: Integration panel for deployment configuration/status.\n- 🐞 **AI Debugger**: AI + offline diagnostic analysis across the language catalog.\n- ▶️ **Execution**: Real execution is used only for configured secure runtimes; unsupported languages are reported instead of receiving fake output.\n\nAsk me any programming question or explore the platform tabs above!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSelectLanguage = (lang: ProgrammingLanguage, loadDefaultCode: boolean) => {
    setCurrentLanguage(lang);
    if (loadDefaultCode) {
      setCode(lang.defaultCode);
      setWorkspaceFiles((prev) => [
        {
          id: 'f-1',
          name: `main${lang.extension}`,
          content: lang.defaultCode,
          languageId: lang.id,
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

  const handleLoadSampleBug = () => {
    if (currentLanguage.sampleBugCode) {
      setCode(currentLanguage.sampleBugCode);
      const tip = currentLanguage.debuggingTips?.[0] || currentLanguage.bugDescription;
      setMessages((prev) => [
        ...prev,
        {
          id: `bug-loaded-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Loaded a sample bug into \`main${currentLanguage.extension}\` (${currentLanguage.name}):\n\n> *${tip}*\n\nUse **AI Debug** to diagnose it.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setActivePlatform('replit');
    }
  };

  const handleResetCode = () => {
    setCode(currentLanguage.defaultCode);
    setDebugReport(null);
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: currentLanguage.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.errors || `Execution request failed (${res.status})`);
      }
      setExecutionResult({
        success: Boolean(data.success),
        output: data.output || '',
        errors: data.errors || '',
        duration: data.duration || '0ms',
        memory: data.memory || 'N/A',
        exitCode: typeof data.exitCode === 'number' ? data.exitCode : (data.success ? 0 : 1),
        sandboxAvailable: data.sandboxAvailable,
      });
    } catch (err: any) {
      setExecutionResult({
        success: false,
        output: '',
        errors: `Execution error: ${err?.message || String(err)}`,
        duration: '0ms',
        memory: 'N/A',
        exitCode: 1,
        sandboxAvailable: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Debug request failed (${res.status})`);
      if (data.report) setDebugReport(data.report);
    } catch (err: any) {
      console.error('Debug error:', err);
      setDebugReport(null);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleApplyCodeToEditor = (newCode: string) => {
    setCode(newCode);
    setActivePlatform('replit');
  };

  const handleSendMessage = async (userPrompt: string, mode: string = 'general') => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
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
        .map((m) => ({ role: m.role, parts: [{ text: m.content }] }));

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

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `AI request failed (${res.status})`);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply || "I've analyzed your code.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: data.groundingSources || [],
          usedWebSearch: Boolean(data.usedWebSearch),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error communicating with OmniCode AI: ${err?.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void handleRunCode();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [code, currentLanguage]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
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

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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

          {activePlatform === 'github' && (
            <GitHubPlatform
              files={workspaceFiles}
              activeCode={code}
              onCommitChanges={(msg, branch) => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `commit-${Date.now()}`,
                    role: 'assistant',
                    content: `🐙 GitHub operation completed for branch \`${branch}\`:\n> "${msg}"`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              onDeployToVercel={() => setActivePlatform('vercel')}
              onSwitchToEditor={() => setActivePlatform('replit')}
            />
          )}

          {activePlatform === 'vercel' && (
            <VercelPlatform
              activeCode={code}
              files={workspaceFiles}
              onSwitchToReplit={() => setActivePlatform('replit')}
              onSwitchToGitHub={() => setActivePlatform('github')}
            />
          )}

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

      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </div>
  );
}
