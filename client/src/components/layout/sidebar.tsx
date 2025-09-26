import { Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  MapPin, 
  Package, 
  ArrowRightLeft, 
  CheckCircle, 
  Bell,
  ChevronDown,
  Menu,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

const navigationGroups = [
  {
    title: "LOKASYONLAR",
    items: [
      { name: 'Lokasyonlar', href: '/locations', icon: MapPin },
      { name: 'Yorumlar', href: '/reviews', icon: MessageSquare },
      { name: 'ReviewsX', href: '/reviewsX', icon: MessageSquare },
      { name: 'ReviewsMVP', href: '/reviewsMVP', icon: MessageSquare }
    ]
  },
  {
    title: "SATIŞLAR", 
    items: [
      { name: 'Satışlar', href: '/sales', icon: TrendingUp },
      { name: 'Katalog', href: '/catalog', icon: Package }
    ]
  },
  {
    title: "DEV",
    items: [
      { name: 'Location Match', href: '/location-match', icon: Target }
    ]
  }
];

const ungroupedItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className="dark:bg-gray-900 border-r border-gray-300 dark:border-gray-600 flex flex-col h-screen shadow-sm transition-all duration-300 w-64 bg-[#f9fafb]">
      {/* Logo and Brand */}
      <div className="h-20">
        <div className="flex items-center justify-center h-full">
          {!collapsed && (
            <img 
              src={venueXLogo} 
              alt="VenueX Logo" 
              className="w-[183px] h-[183px] object-contain"
            />
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">VX</span>
            </div>
          )}
        </div>
      </div>
      {/* Current Role Section */}
      <div className="relative">
        {!collapsed && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <img 
                    src="https://venuex-cdn.s3.eu-central-1.amazonaws.com/images/brands/logo/boyner.png" 
                    alt="Boyner Logo" 
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Boyner
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}
        
        {/* Toggle Button - only show here when expanded */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-md z-10"
            data-testid="sidebar-toggle"
          >
            <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
      {/* Navigation */}
      <nav className={cn("flex-1 py-2", collapsed ? "px-2" : "px-6")}>
        <ul className="space-y-1">
          {/* Ungrouped Items */}
          {ungroupedItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center rounded-md text-sm transition-colors cursor-pointer",
                      collapsed ? "px-3 py-2 justify-center" : "space-x-3 px-3 py-2",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                </Link>
              </li>
            );
          })}
          
          {/* Grouped Items */}
          {navigationGroups.map((group, index) => (
            <li key={group.title} className={index === 0 ? "pt-4" : "pt-6"}>
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <div 
                          className={cn(
                            "flex items-center rounded-md text-sm transition-colors cursor-pointer",
                            collapsed ? "px-3 py-2 justify-center" : "space-x-3 px-3 py-2",
                            isActive 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          title={collapsed ? item.name : undefined}
                        >
                          <item.icon className="w-5 h-5" />
                          {!collapsed && <span>{item.name}</span>}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
          
          {/* Toggle Button - only show here when collapsed, at the end of menu */}
          {collapsed && (
            <li>
              <button
                onClick={onToggle}
                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                data-testid="sidebar-toggle"
                title="Expand sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            </li>
          )}
        </ul>
      </nav>
      {/* System Status */}
      <div className={cn("border-t border-gray-300 dark:border-gray-600", collapsed ? "p-2" : "p-6")}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full" title="All systems operational"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
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
        )}
      </div>
    </div>
  );
}