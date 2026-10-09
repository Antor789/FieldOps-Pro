import React from 'react';
import { Search, Filter, Star, Flag, Globe } from 'lucide-react';

interface FeedbackFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  minRating: number;
  onMinRatingChange: (val: number) => void;
  selectedTechId: string;
  onTechChange: (techId: string) => void;
  onlyFlagged: boolean;
  onFlaggedToggle: (flagged: boolean) => void;
  technicians: { id: string; name: string }[];
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  searchQuery,
  onSearchChange,
  minRating,
  onMinRatingChange,
  selectedTechId,
  onTechChange,
  onlyFlagged,
  onFlaggedToggle,
  technicians,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl px-3 py-1.5 flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer, work order or comment..."
          className="bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 focus:outline-none w-full"
        />
      </div>

      {/* Star Filter */}
      <div className="flex items-center space-x-2 text-xs">
        <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(parseInt(e.target.value, 10))}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-slate-900 dark:text-slate-100 font-semibold"
        >
          <option value={0}>All Star Ratings</option>
          <option value={5}>5 Stars Only</option>
          <option value={4}>4+ Stars</option>
          <option value={3}>3+ Stars</option>
          <option value={1}>1-2 Stars (Low Ratings)</option>
        </select>
      </div>

      {/* Technician Filter */}
      <div className="flex items-center space-x-2 text-xs">
        <select
          value={selectedTechId}
          onChange={(e) => onTechChange(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-slate-900 dark:text-slate-100 font-semibold"
        >
          <option value="all">All Technicians</option>
          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
      </div>

      {/* Flagged Toggle */}
      <button
        type="button"
        onClick={() => onFlaggedToggle(!onlyFlagged)}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
          onlyFlagged
            ? 'bg-red-500 text-white border-red-600 shadow-xs'
            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-red-400'
        }`}
      >
        <Flag className="w-3.5 h-3.5" />
        Flagged Only
      </button>
    </div>
  );
};
