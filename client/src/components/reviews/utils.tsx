import { SiGoogle, SiFacebook, SiTripadvisor, SiYelp, SiApple, SiAmazon } from 'react-icons/si';
import { Globe, Star } from 'lucide-react';

export const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'google':
      return <SiGoogle className="w-4 h-4 text-blue-600" />;
    case 'facebook':
      return <SiFacebook className="w-4 h-4 text-blue-700" />;
    case 'website':
      return <Globe className="w-4 h-4 text-gray-600" />;
    case 'tripadvisor':
      return <SiTripadvisor className="w-4 h-4 text-green-600" />;
    case 'yelp':
      return <SiYelp className="w-4 h-4 text-red-600" />;
    case 'apple':
      return <SiApple className="w-4 h-4 text-gray-800" />;
    case 'amazon':
      return <SiAmazon className="w-4 h-4 text-orange-500" />;
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
