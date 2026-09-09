import React from 'react';
import { ProgrammingLanguage } from '../types';
import { 
  Globe, 
  Terminal, 
  Play, 
  Bug, 
  ChevronDown,
  Layers,
  Code2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

export type ActivePlatform = 'replit' | 'github' | 'vercel' | 'debugger';

interface HeaderProps {
  currentLanguage: ProgrammingLanguage;
  onOpenLanguageSelector: () => void;
  useWebSearch: boolean;
  onToggleWebSearch: () => void;
  onRunCode: () => void;
  onDebugCode: () => void;
  isRunning: boolean;
  isDebugging: boolean;
  activePlatform: ActivePlatform;
  setActivePlatform: (platform: ActivePlatform) => void;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguageSelector,
  useWebSearch,
  onToggleWebSearch,
  onRunCode,
  onDebugCode,
  isRunning,
  isDebugging,
  activePlatform,
  setActivePlatform,
  isAiDrawerOpen,
  onToggleAiDrawer,
}) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-20 shrink-0">
      {/* Brand & Language Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-950/40">
            <span className="text-sm font-black">Ω</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 text-sm tracking-tight">OmniCode</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                GITHUB • VERCEL • REPLIT
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

        {/* 100+ Languages Picker Button */}
        <button
          id="language-picker-btn"
          onClick={onOpenLanguageSelector}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-xs text-slate-200 transition-colors group"
          title="Click to switch among 100+ programming languages"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
          <span className="font-mono font-medium">{currentLanguage.name}</span>
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">({currentLanguage.extension})</span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">105 langs</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
        </button>
      </div>

      {/* Center Unified Platform Tabs: Replit, GitHub, Vercel, AI Debugger */}
      <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shadow-inner">
        <button
          id="tab-replit-platform"
          onClick={() => setActivePlatform('replit')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
            activePlatform === 'replit'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Built-in Replit Cloud IDE & Shell"
        >
          <Terminal className="w-3.5 h-3.5 text-orange-400" />
          <span>Replit IDE</span>
        </button>

        <button
          id="tab-github-platform"
          onClick={() => setActivePlatform('github')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
            activePlatform === 'github'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Built-in GitHub Repository & PR Platform"
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          <span>GitHub</span>
        </button>

        <button
          id="tab-vercel-platform"
          onClick={() => setActivePlatform('vercel')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
            activePlatform === 'vercel'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Built-in Vercel Edge Deployment Platform & Web Preview"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Vercel Cloud</span>
        </button>

        <button
          id="tab-debugger-platform"
          onClick={() => setActivePlatform('debugger')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
            activePlatform === 'debugger'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="AST-Level Code Debugger & Big-O Analyzer"
        >
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Debugger</span>
        </button>
      </div>

      {/* Right Action Tools: Web Search toggle, AI Copilot Toggle, Run & Debug */}
      <div className="flex items-center gap-2">
        {/* Real-time Web Search Toggle */}
        <button
          id="realtime-search-toggle"
          onClick={onToggleWebSearch}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
            useWebSearch
              ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={useWebSearch ? 'Real-Time Web Search is ACTIVE (Google Grounding)' : 'Enable Real-Time Web Search'}
        >
          <Globe className={`w-3.5 h-3.5 ${useWebSearch ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Web Search</span>
          <span className={`w-1.5 h-1.5 rounded-full ${useWebSearch ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-slate-600'}`} />
        </button>

        {/* AI Copilot Drawer Toggle */}
        <button
          onClick={onToggleAiDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
            isAiDrawerOpen
              ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle AI Global Copilot"
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Run Code Button */}
        <button
          id="run-code-btn"
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm transition-colors disabled:opacity-50"
          title="Run code in isolated execution sandbox"
        >
          {isRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run'}</span>
        </button>

        {/* AI Deep Debug Button */}
        <button
          id="debug-code-btn"
          onClick={onDebugCode}
          disabled={isDebugging}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-600/90 hover:bg-amber-500 text-white shadow-sm transition-colors disabled:opacity-50"
          title="Analyze and debug code with AST & Gemini AI"
        >
          {isDebugging ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bug className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{isDebugging ? 'Analyzing...' : 'AI Debug'}</span>
        </button>
      </div>
    </header>
  );
};
