import React from 'react';

interface PageHeaderProps {
  title: string;
  subheading?: string;
  kicker?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subheading, kicker, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
      <div>
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-1">
            {kicker}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subheading && (
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">{subheading}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
