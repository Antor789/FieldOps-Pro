import React, { useState } from 'react';
import { Smartphone, Monitor, Sun, Moon, Copy, Check, ExternalLink, Code } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface EmailPreviewProps {
  htmlContent: string;
  subject?: string;
  className?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  htmlContent,
  subject = 'FieldOps Pro Email Preview',
  className = '',
}) => {
  const { addToast } = useToast();
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [viewSource, setViewSource] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setHasCopied(true);
    addToast({
      title: 'HTML Copied',
      description: 'Email template HTML copied to clipboard.',
      type: 'success',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md ${className}`}>
      {/* Preview Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
            Subject: {subject}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Device Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Desktop Preview (600px max-width)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Mobile Responsive Preview (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Background Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer border border-slate-200 dark:border-slate-600"
            title={`Toggle ${themeMode === 'light' ? 'Dark' : 'Light'} Container Background`}
          >
            {themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* HTML Source Toggle */}
          <button
            onClick={() => setViewSource(!viewSource)}
            className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
              viewSource
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600'
            }`}
            title="Inspect Raw HTML"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          {/* Copy HTML */}
          <button
            onClick={handleCopyHtml}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer border border-slate-200 dark:border-slate-600"
            title="Copy HTML to Clipboard"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div
        className={`flex-1 p-4 overflow-auto flex justify-center items-start transition-colors duration-200 min-h-[480px] ${
          themeMode === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
        }`}
      >
        {viewSource ? (
          <div className="w-full max-w-4xl bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-auto max-h-[560px] border border-slate-800 shadow-inner">
            <pre className="whitespace-pre-wrap">{htmlContent}</pre>
          </div>
        ) : (
          <div
            className={`transition-all duration-300 shadow-xl overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white ${
              deviceView === 'mobile' ? 'w-[375px] h-[640px]' : 'w-full max-w-[650px] min-h-[580px]'
            }`}
          >
            <iframe
              srcDoc={htmlContent}
              title="Email HTML Preview"
              className="w-full h-full min-h-[580px] border-none block bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-white dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
        <span>Render Engine: WebKit HTML5 Compatible (Outlook / Gmail / Apple Mail)</span>
        <span className="font-mono">{deviceView === 'mobile' ? '375px viewport' : '600px desktop max'}</span>
      </div>
    </div>
  );
};
