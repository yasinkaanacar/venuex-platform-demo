import { Building, MapPin, Globe } from 'lucide-react';

interface RichLocationCardProps {
  location: {
    name: string;
    storeCode?: string;
    address?: string;
    city?: string;
    platform?: string;
  };
  variant?: 'default' | 'create' | 'delete';
  'data-testid'?: string;
}

export const RichLocationCard = ({ 
  location, 
  variant = 'default',
  'data-testid': testId 
}: RichLocationCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'create':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'delete':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-l-4 border-l-blue-500 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div 
      className={`p-3 rounded border ${getVariantStyles()}`}
      data-testid={testId}
    >
      {/* Location Name */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 leading-tight">
          {location.name}
        </h4>
        {variant === 'delete' && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full ml-2">
            TO DELETE
          </span>
        )}
        {variant === 'create' && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full ml-2">
            TO CREATE
          </span>
        )}
      </div>

      {/* Store Code */}
      {location.storeCode && (
        <div className="flex items-center space-x-2 mb-1">
          <Building className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            Code: {location.storeCode}
          </span>
        </div>
      )}

      {/* Address */}
      {location.address && (
        <div className="flex items-start space-x-2 mb-1">
          <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {location.address}
            {location.city && `, ${location.city}`}
          </span>
        </div>
      )}

      {/* Platform */}
      {location.platform && (
        <div className="flex items-center space-x-2">
          <Globe className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {location.platform}
          </span>
        </div>
      )}
    </div>
  );
};