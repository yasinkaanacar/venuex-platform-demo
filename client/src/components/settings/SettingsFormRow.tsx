import { cn } from '@/lib/utils';

interface SettingsFormRowProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsFormRow({
  label,
  htmlFor,
  required,
  hint,
  children,
  className,
}: SettingsFormRowProps) {
  return (
    <div className={cn('flex items-start gap-4 py-3', className)}>
      {/* Label side */}
      <div className="w-1/3 flex-shrink-0 pt-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5">*</span>
          )}
        </label>
        {hint && (
          <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
        )}
      </div>

      {/* Input side */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
