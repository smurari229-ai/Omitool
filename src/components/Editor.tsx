import React, { useRef, useState } from 'react';
import { ProgrammingLanguage, DebugIssue } from '../types';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Bug, 
  FileCode2, 
  Sparkles, 
  Info,
  AlertTriangle,
  Play,
  Terminal
} from 'lucide-react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  language: ProgrammingLanguage;
  debugIssues?: DebugIssue[];
  onLoadSampleBug: () => void;
  onResetCode: () => void;
  onRunCode: () => void;
  onDebugCode: () => void;
  isRunning: boolean;
  isDebugging: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  code,
  onChange,
  language,
  debugIssues = [],
  onLoadSampleBug,
  onResetCode,
  onRunCode,
  onDebugCode,
  isRunning,
  isDebugging,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  // Map issues by line number
  const issuesByLine = new Map<number, DebugIssue>();
  for (const issue of debugIssues) {
    if (issue.line && issue.line > 0) {
      issuesByLine.set(issue.line, issue);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Handle Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800 overflow-hidden relative">
      {/* Editor Tab Bar & Controls */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between shrink-0 select-none">
        {/* Active File Tab */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border-t-2 border-cyan-500 rounded-t text-xs font-mono text-cyan-300 font-medium">
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>main{language.extension}</span>
            <span className="text-[10px] text-slate-500 ml-1">({language.name})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 text-xs">
          {/* Load Sample Bug */}
          <button
            onClick={onLoadSampleBug}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors"
            title={`Load a realistic bug in ${language.name} to test advanced debugging`}
          >
            <Bug className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Load Sample Bug</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset to boilerplate"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Textarea */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-[13px] leading-6">
        {/* Line Numbers & Error Gutter */}
        <div className="w-12 bg-slate-900/50 border-r border-slate-800/80 py-3 select-none flex flex-col items-center text-slate-600 text-xs font-mono shrink-0 overflow-hidden">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const issue = issuesByLine.get(lineNum);
            return (
              <div key={lineNum} className="h-6 w-full flex items-center justify-end pr-2.5 relative group">
                {issue ? (
                  <span
                    className={`absolute left-1.5 w-2 h-2 rounded-full cursor-pointer ${
                      issue.severity === 'error' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                    }`}
                    title={`Line ${lineNum}: ${issue.title} - ${issue.explanation}`}
                  />
                ) : null}
                <span className={`text-[11px] ${issue ? 'text-red-400 font-bold' : ''}`}>
                  {lineNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Code Input Textarea */}
        <div className="flex-1 relative overflow-auto bg-slate-950">
          <textarea
            ref={textareaRef}
            id="code-editor-textarea"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-slate-100 font-mono text-[13px] leading-6 resize-none focus:outline-none border-none whitespace-pre overflow-auto selection:bg-cyan-500/25"
            placeholder={`Write or paste ${language.name} code here...`}
          />
        </div>
      </div>

      {/* Editor Bottom Status Bar */}
      <div className="h-7 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-medium">{language.name}</span>
          <span className="text-slate-500">|</span>
          <span>{lines.length} lines</span>
          <span className="text-slate-500">|</span>
          <span>{code.length} chars</span>
          {debugIssues.length > 0 && (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              {debugIssues.length} debug issue{debugIssues.length > 1 ? 's' : ''} detected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <span className="text-emerald-400">● Ready</span>
        </div>
      </div>
    </div>
  );
};
