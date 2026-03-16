import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { Globe, Star } from 'lucide-react';

/**
 * Returns a platform icon for the given ReviewSourceEnum value.
 * Aligned with production ReviewSourceEnum: Google, Apple, Meta, Tiktok.
 */
export const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'google':
      return <SiGoogle className="w-4 h-4 text-blue-600" />;
    case 'meta':
      return <SiMeta className="w-4 h-4 text-blue-700" />;
    case 'apple':
      return <SiApple className="w-4 h-4 text-gray-800" />;
    case 'tiktok':
      return <SiTiktok className="w-4 h-4 text-gray-900" />;
    default:
      return <Globe className="w-4 h-4 text-gray-600" />;
  }
};

export const renderStars = (rating: number) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export const renderStarsSm = (rating: number) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export const parseRelativeDate = (dateStr: string): number => {
  if (dateStr.includes('hours ago') || dateStr.includes('minutes ago') || dateStr.includes('hour ago') || dateStr.includes('minute ago')) {
    const hours = parseInt(dateStr) || 0;
    return Date.now() - hours * 60 * 60 * 1000;
  }
  if (dateStr.includes('days ago') || dateStr.includes('day ago')) {
    const days = parseInt(dateStr) || 0;
    return Date.now() - days * 24 * 60 * 60 * 1000;
  }
  return new Date(dateStr).getTime();
};
