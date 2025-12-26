import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  MapPin, 
  Package, 
  ArrowRightLeft, 
  CheckCircle, 
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Target,
  Brain,
  Settings,
  Rocket,
  Code,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';
import venueXLogoSmall from '@assets/vx-logo-1000x1000_1764141281095.png';
import venueXFavicon from '@assets/favicon_1765178591266.png';

const recentChats = [
  { id: '1', title: 'Rating drop analysis' },
  { id: '2', title: 'Negative review patterns' },
  { id: '3', title: 'Staff service sentiment' }
];

const navigationGroups = [
  {
    title: "LOCATION",
    items: [
      { name: 'Locations', href: '/locations', icon: MapPin },
      { name: 'Reviews', href: '/reviewsMVP', icon: MessageSquare }
    ]
  },
  {
    title: "SALES", 
    items: [
      { name: 'Local Inventory', href: '/catalog', icon: Package },
      { name: 'Offline Conversions', href: '/offline-conversionsMVP', icon: TrendingUp }
    ]
  },
  {
    title: "AI",
    items: [
      { name: 'VenueX AI', href: '/venuex-ai', icon: Brain }
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: 'Setup', href: '/setup', icon: Settings },
      { name: 'Setup 2', href: '/setup2', icon: Settings },
      { name: 'Setup 3', href: '/setup3', icon: Settings },
      { name: 'Setup 3B', href: '/setup3B', icon: Settings }
    ]
  },
  {
    title: "DEV",
    items: [
      { name: 'Onboarding', href: '/onboarding', icon: Rocket },
      { name: 'Signup', href: '/signup', icon: UserPlus }
    ]
  }
];

const ungroupedItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Enhance', href: '/ai-recommendations', icon: Brain }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const [aiChatsExpanded, setAiChatsExpanded] = useState(true);

  return (
    <div className={cn(
      "dark:bg-gray-900 border-r border-gray-300 dark:border-gray-600 flex flex-col min-h-screen sticky top-0 max-h-screen overflow-y-auto shadow-sm transition-all duration-300 bg-[#f9fafb]",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Brand */}
      <div className="h-20">
        <Link href="/">
          <div className="flex items-center justify-center h-full cursor-pointer">
            {!collapsed && (
              <img 
                src={venueXLogo} 
                alt="VenueX Logo" 
                className="w-[183px] h-[183px] object-contain"
              />
            )}
            {collapsed && (
              <img 
                src={venueXFavicon} 
                alt="VenueX Logo" 
                className="w-10 h-10 object-contain"
              />
            )}
          </div>
        </Link>
      </div>
      {/* Current Role Section */}
      <div className="relative">
        {!collapsed && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
                  <img 
                    src={venueXLogoSmall} 
                    alt="VenueX Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">VenueX</span>
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
            <li key={group.title} className={index === 0 ? "pt-4" : "pt-4"}>
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.href;
                  const isVenueXAI = item.name === 'VenueX AI';
                  
                  return (
                    <li key={item.name}>
                      {isVenueXAI && !collapsed ? (
                        <div>
                          <div className="flex items-center">
                            <Link href={item.href} className="flex-1">
                              <div 
                                className={cn(
                                  "flex items-center rounded-md text-sm transition-colors cursor-pointer space-x-3 px-3 py-2",
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
                            <button
                              onClick={() => setAiChatsExpanded(!aiChatsExpanded)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                              data-testid="toggle-ai-chats"
                            >
                              {aiChatsExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {aiChatsExpanded && (
                            <ul className="mt-1 ml-6 space-y-0.5">
                              {recentChats.map((chat) => (
                                <li key={chat.id}>
                                  <Link href="/venuex-ai">
                                    <div 
                                      className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer truncate"
                                      data-testid={`chat-link-${chat.id}`}
                                      title={chat.title}
                                    >
                                      {chat.title}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
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
                      )}
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
      <div className={cn("border-t border-gray-300 dark:border-gray-600", collapsed ? "p-2" : "px-4 py-3")}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full" title="All systems operational"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-300">
                All systems operational
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}