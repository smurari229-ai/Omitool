import React, { useState } from 'react';
import { DebugReport, ProgrammingLanguage, DebugIssue } from '../types';
import { 
  Bug, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  RefreshCw,
  ArrowRight,
  Code2,
  Check
} from 'lucide-react';

interface DebuggerPanelProps {
  report: DebugReport | null;
  isDebugging: boolean;
  onTriggerDebug: () => void;
  onApplyFixedCode: (code: string) => void;
  language: ProgrammingLanguage;
  code: string;
}

export const DebuggerPanel: React.FC<DebuggerPanelProps> = ({
  report,
  isDebugging,
  onTriggerDebug,
  onApplyFixedCode,
  language,
  code,
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'fixedCode' | 'complexity'>('issues');
  const [copied, setCopied] = useState(false);

  const handleCopyFixed = () => {
    if (report?.fixedCode) {
      navigator.clipboard.writeText(report.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeverityBadge = (sev: DebugIssue['severity']) => {
    switch (sev) {
      case 'error':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-medium uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium uppercase tracking-wider">
            <Info className="w-3 h-3" />
            Info
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Debugger Header */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100">Advanced AI Debugging &amp; Quality Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                {language.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deep static analysis, race conditions, memory safety, and algorithmic verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerDebug}
            disabled={isDebugging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            {isDebugging ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Code...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Run Full Debug Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-9 bg-slate-900/60 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-medium shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'issues'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Issues &amp; Root Causes {report?.issues ? `(${report.issues.length})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('fixedCode')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'fixedCode'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fixed &amp; Corrected Code
          </button>
          <button
            onClick={() => setActiveTab('complexity')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'complexity'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Complexity &amp; Security
          </button>
        </div>

        {report?.fixedCode && (
          <button
            onClick={() => onApplyFixedCode(report.fixedCode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Apply Fix to Workspace</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!report && !isDebugging && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
              <Bug className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Ready for Deep Code Debugging
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              Click "Run Full Debug Audit" or test with sample bugs to uncover runtime pitfalls, bounds errors, memory leaks, and Big-O efficiency insights across {language.name}.
            </p>
            <button
              onClick={onTriggerDebug}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-md transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Analyze Active Workspace Code
            </button>
          </div>
        )}

        {isDebugging && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <div className="text-sm font-medium text-slate-200">
              OmniCode Deep Analyzer is inspecting {language.name} AST...
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Cross-referencing syntax specs, runtime constraints, and known exception vectors.
            </p>
          </div>
        )}

        {report && !isDebugging && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Overview Summary Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-slate-200 mb-0.5">Diagnostics Summary</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{report.summary}</p>
              </div>
            </div>

            {/* TAB 1: Issues */}
            {activeTab === 'issues' && (
              <div className="space-y-3">
                {report.issues.length === 0 ? (
                  <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-emerald-300 mb-1">Zero Fatal Errors Found</h4>
                    <p className="text-xs text-slate-400">
                      The code adheres to idiomatic {language.name} syntax and safe execution standards.
                    </p>
                  </div>
                ) : (
                  report.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(issue.severity)}
                          <span className="text-xs font-mono font-medium text-slate-400">
                            Line {issue.line || '—'}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {issue.title}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mb-2.5 leading-relaxed font-sans">
                        {issue.explanation}
                      </p>

                      {issue.suggestedFix && (
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs font-mono">
                          <span className="text-emerald-400 font-semibold shrink-0">Fix:</span>
                          <span className="text-slate-300">{issue.suggestedFix}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: Fixed Code */}
            {activeTab === 'fixedCode' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-300 font-mono flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    Corrected Implementation (Ready to apply)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyFixed}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onApplyFixedCode(report.fixedCode)}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Apply to Editor</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {report.fixedCode || '// No code modification needed'}
                </pre>
              </div>
            )}

            {/* TAB 3: Complexity & Security */}
            {activeTab === 'complexity' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Big-O Card */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-medium text-xs">
                    <Clock className="w-4 h-4" />
                    <span>Algorithmic Complexity (Big-O)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Time Complexity</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                        {report.complexity?.time || 'O(n)'}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Space Complexity</div>
                      <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                        {report.complexity?.space || 'O(1)'}
                      </div>
                    </div>
                  </div>

                  {report.complexity?.explanation && (
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {report.complexity.explanation}
                    </p>
                  )}
                </div>

                {/* Security & Performance Audits */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Security &amp; Performance Audit</span>
                  </div>

                  <div className="space-y-2">
                    {report.securityAndPerformance?.map((item, sIdx) => (
                      <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
