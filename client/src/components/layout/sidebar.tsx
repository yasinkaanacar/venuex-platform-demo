import { Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  MapPin, 
  Package, 
  ArrowRightLeft, 
  CheckCircle, 
  Bell,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

const navigationItems = [
  { 
    name: 'Overview', 
    href: '/', 
    icon: BarChart3,
    active: true 
  },
  { 
    name: 'Locations', 
    href: '/locations', 
    icon: MapPin,
    active: false 
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package,
    active: false 
  },
  { 
    name: 'Data Integration', 
    href: '/data-integration', 
    icon: ArrowRightLeft,
    active: false 
  },
  { 
    name: 'Data Quality', 
    href: '/data-quality', 
    icon: CheckCircle,
    active: false 
  },
  { 
    name: 'Alerts', 
    href: '/alerts', 
    icon: Bell,
    active: false 
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Logo and Brand */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <img 
            src={venueXLogo} 
            alt="VenueX Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>

      {/* Current Role Section */}
      <div className="px-6 py-4">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          CURRENT ROLE
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Digital Marketing Dashboard
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              All systems operational
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last updated 2 min ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}