import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';
import { CodeSnippet } from '../types/architecture';

interface CodeBlockProps {
  snippet: CodeSnippet;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-200">{snippet.title}</span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-blue-950 text-blue-400 border border-blue-800/60">
            {snippet.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      <p className="px-4 py-2 bg-slate-900/40 text-xs text-slate-400 border-b border-slate-800/60">
        {snippet.explanation}
      </p>

      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950">
        <pre>{snippet.code}</pre>
      </div>
    </div>
  );
};
