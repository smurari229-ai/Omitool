import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProgrammingLanguage } from '../types';
import { 
  Send, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Bug, 
  Zap, 
  CheckCircle,
  FileCheck,
  RefreshCw,
  Search
} from 'lucide-react';

interface AIChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, mode?: string) => Promise<void>;
  isLoading: boolean;
  language: ProgrammingLanguage;
  useWebSearch: boolean;
  onToggleWebSearch: () => void;
  onApplyCodeToEditor: (code: string) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  language,
  useWebSearch,
  onToggleWebSearch,
  onApplyCodeToEditor,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract code blocks from assistant markdown
  const extractCodeBlock = (content: string) => {
    const match = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
    return match ? match[1] : null;
  };

  return (
    <div className="w-full lg:w-[420px] flex flex-col bg-slate-900 border-l border-slate-800 shrink-0 h-full overflow-hidden">
      {/* Chat Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Global AI Copilot</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            {language.name}
          </span>
        </div>

        {/* Real-time search grounding status */}
        <button
          onClick={onToggleWebSearch}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
            useWebSearch
              ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Google Real-time Web Search Grounding"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Search: {useWebSearch ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() => onSendMessage(`Explain how this ${language.name} code works step-by-step.`, 'explain')}
          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 flex items-center gap-1 transition-colors"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          Explain
        </button>

        <button
          onClick={() => onSendMessage(`Perform a deep debugging review on this ${language.name} code. Find all logical bugs, edge cases, and memory/performance issues.`, 'debug')}
          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 flex items-center gap-1 transition-colors"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          Deep Debug
        </button>

        <button
          onClick={() => onSendMessage(`Optimize this ${language.name} code for maximum time and space efficiency (Big-O analysis).`, 'refactor')}
          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Optimize
        </button>

        <button
          onClick={() => onSendMessage(`Generate a comprehensive unit test suite covering edge cases for this ${language.name} code.`, 'generate_tests')}
          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 flex items-center gap-1 transition-colors"
        >
          <FileCheck className="w-3 h-3 text-emerald-400" />
          Unit Tests
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 bg-slate-950/20">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const codeBlock = !isUser ? extractCodeBlock(msg.content) : null;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[92%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white rounded-br-sm shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-sm shadow-sm'
                }`}
              >
                {/* Message text with formatting */}
                <div className="whitespace-pre-wrap font-sans break-words">
                  {msg.content}
                </div>

                {/* Grounding Web Search Sources Citations */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-medium mb-1">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span>Live Grounding Sources (Google Search):</span>
                    </div>
                    <div className="space-y-1">
                      {msg.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 hover:underline truncate bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/40"
                        >
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{source.title || source.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code action pill if response has a code block */}
                {codeBlock && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-cyan-400" />
                      Code extracted
                    </span>
                    <button
                      onClick={() => onApplyCodeToEditor(codeBlock)}
                      className="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 text-[10px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Apply to Editor
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp & Copy action */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                <span>{msg.timestamp}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-200 transition-opacity"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>OmniCode is analyzing code &amp; searching web...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="relative flex items-center">
          <input
            id="ai-chat-input"
            type="text"
            placeholder={`Ask OmniCode anything (${language.name}, debugging, docs)...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 disabled:hover:bg-cyan-600 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
          <span>Global Knowledge • 105 Languages</span>
          {useWebSearch && (
            <span className="text-cyan-400 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              Live Search Grounded
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
