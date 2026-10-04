import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glass?: boolean;
  accentBorderColor?: string;
  gradientOverlay?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hoverLift = false,
      glass = false,
      accentBorderColor,
      gradientOverlay = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
          glass
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
        } ${
          hoverLift
            ? 'hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600/60'
            : ''
        } ${className}`}
        style={{
          borderLeftColor: accentBorderColor || undefined,
          borderLeftWidth: accentBorderColor ? '4px' : undefined,
        }}
        {...props}
      >
        {gradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-3 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 ${className}`} {...props}>
    {children}
  </div>
);
