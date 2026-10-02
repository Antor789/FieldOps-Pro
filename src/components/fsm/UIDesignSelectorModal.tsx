import React from 'react';
import { UIThemeId, classNameThemes } from '../../lib/theme';
import { Palette, Check, Sparkles, X, Layout, Monitor } from 'lucide-react';

interface UIDesignSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: UIThemeId;
  onSelectTheme: (themeId: UIThemeId) => void;
}

export const UIDesignSelectorModal: React.FC<UIDesignSelectorModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Select UI Design & Aesthetic Theme
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  5 Presets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose a visual theme below to instantly transform the entire interface's color palette, cards, and borders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(classNameThemes).map((theme) => {
            const isSelected = theme.id === activeThemeId;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                }}
                className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-500 bg-slate-800/80 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Selected Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Swatch Header */}
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {theme.previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border border-slate-700 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                      {theme.name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Live Mini Preview Box */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div
                    className={`p-2.5 rounded-lg text-[11px] flex items-center justify-between font-mono ${
                      theme.id === 'clean-light'
                        ? 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                        : theme.id === 'neon-cyberpunk'
                        ? 'bg-black border border-yellow-500 text-yellow-300'
                        : theme.id === 'nordic-warm'
                        ? 'bg-stone-900 border border-amber-900 text-stone-200'
                        : theme.id === 'glassmorphism'
                        ? 'bg-slate-900/80 backdrop-blur border border-indigo-500/40 text-indigo-100'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Monitor className="w-3.5 h-3.5 opacity-70" />
                      <span>Preview Mode</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      theme.id === 'clean-light'
                        ? 'bg-indigo-100 text-indigo-700'
                        : theme.id === 'neon-cyberpunk'
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-500'
                        : theme.id === 'nordic-warm'
                        ? 'bg-amber-950 text-amber-300'
                        : theme.id === 'glassmorphism'
                        ? 'bg-indigo-900/80 text-indigo-200'
                        : 'bg-blue-950 text-cyan-300'
                    }`}>
                      ACTIVE
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Theme applies instantly across all FSM views, map, kanban, and mobile app.</span>
          </div>

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl transition shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
