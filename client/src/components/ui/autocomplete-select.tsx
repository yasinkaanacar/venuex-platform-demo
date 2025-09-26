import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  subtitle?: string;
  badge?: string;
  suggested?: boolean;
}

interface AutocompleteSelectProps {
  placeholder: string;
  options: AutocompleteOption[];
  onValueChange: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
  'data-testid'?: string;
  emptyMessage?: string;
  maxResults?: number;
}

export function AutocompleteSelect({
  placeholder,
  options,
  onValueChange,
  onSearch,
  className,
  'data-testid': testId,
  emptyMessage = "No results found",
  maxResults = 50
}: AutocompleteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return options.slice(0, maxResults);
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      (option.subtitle && option.subtitle.toLowerCase().includes(query)) ||
      (option.badge && option.badge.toLowerCase().includes(query))
    );
    
    // Sort by relevance - exact matches first, then partial matches
    filtered.sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      
      if (aLabel.startsWith(query) && !bLabel.startsWith(query)) return -1;
      if (!aLabel.startsWith(query) && bLabel.startsWith(query)) return 1;
      
      return 0;
    });
    
    return filtered.slice(0, maxResults);
  }, [searchQuery, options, maxResults]);

  // Handle search with debouncing
  useEffect(() => {
    if (onSearch) {
      const debounceTimer = setTimeout(() => {
        onSearch(searchQuery);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, onSearch]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    setSelectedValue(option.value);
    setSearchQuery(option.label);
    setIsOpen(false);
    onValueChange(option.value);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedValue('');
    
    if (!isOpen && value.length > 0) {
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
          data-testid={testId}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {filteredOptions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0",
                      index === highlightedIndex
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800",
                      option.suggested && "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                    )}
                    onClick={() => handleSelect(option)}
                    data-testid={`option-${option.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {option.suggested && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">
                            ✨ SUGGESTED
                          </span>
                        )}
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {option.label}
                        </div>
                        {option.badge && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                    {selectedValue === option.value && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{emptyMessage}</p>
                {searchQuery && (
                  <p className="text-sm mt-1">
                    Try a different search term
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}