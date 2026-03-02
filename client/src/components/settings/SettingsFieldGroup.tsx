import { cn } from '@/lib/utils';

interface SettingsFieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsFieldGroup({
  title,
  description,
  children,
  className,
}: SettingsFieldGroupProps) {
  return (
    <div
      className={cn(
        'p-5 bg-white rounded-lg border border-gray-100 shadow-sm',
        className,
      )}
    >
      {title && (
        <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      )}
      {description && (
        <p className="text-xs text-gray-500 mb-3">{description}</p>
      )}
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}
