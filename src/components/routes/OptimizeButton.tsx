import React from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface OptimizeButtonProps {
  isOptimizing: boolean;
  onOptimize: () => void;
  isAlreadyOptimized?: boolean;
}

export const OptimizeButton: React.FC<OptimizeButtonProps> = ({
  isOptimizing,
  onOptimize,
  isAlreadyOptimized = false,
}) => {
  return (
    <Button
      variant="primary"
      onClick={onOptimize}
      disabled={isOptimizing}
      className={`w-full py-3 font-extrabold text-sm transition shadow-md ${
        isAlreadyOptimized
          ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
      }`}
    >
      {isOptimizing ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          <span>Calculating Dhaka TSP Best Path...</span>
        </div>
      ) : isAlreadyOptimized ? (
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Re-Optimize Route Sequence</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>🔀 Optimize Route Sequence</span>
        </div>
      )}
    </Button>
  );
};
