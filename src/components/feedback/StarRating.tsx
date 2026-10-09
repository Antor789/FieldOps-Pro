import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number; // 1-5
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  lang?: 'en' | 'bn';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = false,
  lang = 'en',
}) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const displayVal = hoverVal !== null ? hoverVal : value;

  const starLabels: Record<number, { en: string; bn: string }> = {
    1: { en: 'Terrible', bn: 'খুবই বাজে' },
    2: { en: 'Poor', bn: 'খারাপ' },
    3: { en: 'Average', bn: 'মোটামুটি' },
    4: { en: 'Good', bn: 'ভালো' },
    5: { en: 'Excellent', bn: 'অসাধারণ' },
  };

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayVal;

          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverVal(star)}
              onMouseLeave={() => !readOnly && setHoverVal(null)}
              className={`transition transform ${
                readOnly ? 'cursor-default' : 'hover:scale-110 cursor-pointer focus:outline-none'
              }`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-500'
                    : 'fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && displayVal > 0 && (
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
          {lang === 'bn' ? starLabels[displayVal]?.bn : starLabels[displayVal]?.en}
        </span>
      )}
    </div>
  );
};
