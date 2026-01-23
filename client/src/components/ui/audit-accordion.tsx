import { useState } from 'react';
import { Search, TriangleAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AuditAccordionProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'warning';
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  'data-testid'?: string;
}

export const AuditAccordion = ({
  id,
  title,
  count,
  children,
  defaultOpen = false,
  variant = 'default',
  searchPlaceholder = 'Search within this list...',
  searchValue = '',
  onSearchChange,
  'data-testid': testId
}: AuditAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const headerClass = variant === 'warning' 
    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <div className={`border rounded-lg overflow-hidden ${headerClass}`} data-testid={testId}>
      <Accordion type="single" collapsible value={isOpen ? id : ''} onValueChange={(value) => setIsOpen(!!value)}>
        <AccordionItem value={id} className="border-none">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {/* Left side - Trigger with icon and title */}
              <AccordionTrigger className="py-0 hover:no-underline flex-none" data-testid={`button-toggle-${testId}`}>
                <div className="flex items-center space-x-2">
                  {variant === 'warning' && (
                    <TriangleAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {title} ({count})
                  </span>
                </div>
              </AccordionTrigger>

              {/* Right side - Search (only show when open) */}
              {isOpen && onSearchChange && (
                <div className="relative w-64 ml-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-8 text-sm"
                    data-testid={`input-search-${testId}`}
                  />
                </div>
              )}
            </div>
          </div>

          <AccordionContent className="px-0 pb-0">
            {/* Scrollable content area */}
            <div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900">
              {children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};