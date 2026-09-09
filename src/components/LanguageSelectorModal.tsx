import React, { useState, useMemo } from 'react';
import { ProgrammingLanguage } from '../types';
import { PROGRAMMING_LANGUAGES, LANGUAGE_CATEGORIES } from '../data/languages';
import { Search, X, Check, Code2, Sparkles, Cpu, Layers } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: ProgrammingLanguage;
  onSelectLanguage: (language: ProgrammingLanguage, loadDefaultCode: boolean) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadDefaultBoilerplate, setLoadDefaultBoilerplate] = useState(true);

  const filteredLanguages = useMemo(() => {
    return PROGRAMMING_LANGUAGES.filter((lang) => {
      const matchesCategory = selectedCategory === 'all' || lang.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        lang.name.toLowerCase().includes(query) ||
        lang.id.toLowerCase().includes(query) ||
        lang.extension.toLowerCase().includes(query) ||
        lang.paradigm.toLowerCase().includes(query) ||
        lang.runtime.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Select Programming Language
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  {PROGRAMMING_LANGUAGES.length} Languages Supported
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Global knowledge base and deep debugging calibrated for over 100 modern and historic runtimes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Options Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 105 languages (e.g., Rust, Python, COBOL, Zig)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/70 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              autoFocus
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none self-start sm:self-auto">
            <input
              type="checkbox"
              checked={loadDefaultBoilerplate}
              onChange={(e) => setLoadDefaultBoilerplate(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Load idiomatic boilerplate snippet for selected language</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {LANGUAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 flex-1 min-h-[300px]">
          {filteredLanguages.map((lang) => {
            const isSelected = currentLanguage.id === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang, loadDefaultBoilerplate);
                  onClose();
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs group-hover:text-cyan-300 transition-colors">
                        {lang.name}
                      </span>
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                        {lang.extension}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-cyan-400 bg-cyan-500/10 p-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-mono">
                    {lang.paradigm}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/50 text-[10px]">
                  <span className="text-slate-500 font-mono flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5" />
                    {lang.runtime}
                  </span>
                  {lang.vercelReady && (
                    <span className="ml-auto px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Vercel
                    </span>
                  )}
                  <span className="px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Replit
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs">
              No programming languages match "{searchQuery}". Try another keyword or browse all categories.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI automatically shifts parser, lint rules, and debugging context to the selected language.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
