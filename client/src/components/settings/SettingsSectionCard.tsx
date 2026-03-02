import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSectionCardProps {
  title: string;
  description?: string;
  tooltip?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

export default function SettingsSectionCard({
  title,
  description,
  tooltip,
  children,
  headerRight,
  className,
}: SettingsSectionCardProps) {
  return (
    <div className={cn('vx-card', className)}>
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              {tooltip && (
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                    {tooltip}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                  </div>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {headerRight && (
            <div className="flex-shrink-0 ml-4">{headerRight}</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="vx-card-body vx-surface-muted">{children}</div>
    </div>
  );
}
