import React from 'react';
import { ExecutionResult } from '../types';
import { Terminal, Play, Trash2, CheckCircle, AlertCircle, Clock, Cpu } from 'lucide-react';

interface ConsolePanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onRun: () => void;
  onClear: () => void;
  languageName: string;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  result,
  isRunning,
  onRun,
  onClear,
  languageName,
}) => {
  return (
    <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0 overflow-hidden select-none font-mono">
      {/* Console Toolbar */}
      <div className="h-8 bg-slate-900 px-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">Terminal &amp; Execution Runner</span>
          <span className="text-[10px] text-slate-500">[{languageName}]</span>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {result.duration}
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-500" />
                {result.memory}
              </span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  result.exitCode === 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {result.exitCode === 0 ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                Exit: {result.exitCode}
              </span>
            </div>
          )}

          <button
            onClick={onClear}
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Clear console output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-5 bg-slate-950/95 text-slate-300">
        {isRunning && (
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Executing in isolated sandbox environment...</span>
          </div>
        )}

        {!isRunning && !result && (
          <div className="text-slate-600">
            Press "Run" to execute {languageName} code or test functions. Output and telemetry will display here.
          </div>
        )}

        {!isRunning && result && (
          <div className="space-y-1">
            {result.output && (
              <pre className="whitespace-pre-wrap text-slate-200 font-mono">
                {result.output}
              </pre>
            )}

            {result.errors && (
              <pre className="whitespace-pre-wrap text-rose-400 font-mono bg-rose-950/20 p-2 rounded border border-rose-900/40 mt-2">
                {result.errors}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
