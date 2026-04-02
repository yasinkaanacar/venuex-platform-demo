import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  BarChart3,
  MapPin,
  Package,
  TrendingUp,
  Target,
  Brain,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import { useLocales } from '@/lib/formatters';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';
import venueXLogoSmall from '@assets/vx-logo-1000x1000_1764141281095.png';
import venueXFavicon from '@assets/favicon_1765178591266.png';

const recentChats = [
  { id: '1', title: 'Rating drop analysis' },
  { id: '2', title: 'Negative review patterns' },
  { id: '3', title: 'Staff service sentiment' }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

type NavItem = { type: 'item'; name: string; href: string; icon: any } | { type: 'gap' };

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const [aiChatsExpanded, setAiChatsExpanded] = useState(true);
  const { t } = useLocales();

  // Deterministic avatar color from initials (same pattern as Phase 02 TeamTableSection)
  const mockUserName = 'Kursad Arman';
  const mockUserInitials = mockUserName.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'];
  const avatarColorIndex = mockUserName.charCodeAt(0) % avatarColors.length;
  const avatarBgColor = avatarColors[avatarColorIndex];

  const navItems = useMemo((): NavItem[] => [
    { type: 'item', name: t('sidebar.menu.dashboard') || 'Dashboard', href: PATHS.HOME, icon: BarChart3 },
    { type: 'gap' },
    { type: 'item', name: t('sidebar.menu.locations') || 'Locations', href: PATHS.LOCATIONS, icon: MapPin },
    { type: 'item', name: t('sidebar.menu.reviews') || 'Reviews', href: PATHS.REVIEWS, icon: MessageSquare },
    { type: 'item', name: t('sidebar.menu.localInventory') || 'Local Inventory', href: PATHS.CATALOG, icon: Package },
    { type: 'item', name: t('sidebar.menu.offlineConversions') || 'Offline Conversions', href: PATHS.OFFLINE_CONVERSIONS, icon: TrendingUp },
    { type: 'item', name: t('sidebar.menu.segments') || 'Segments', href: PATHS.SEGMENTS, icon: Target },
    { type: 'gap' },
    { type: 'item', name: t('sidebar.menu.venuexAI') || 'VenueX AI', href: PATHS.VENUEX_AI, icon: Brain },
  ], [t]);

  return (
    <div className={cn(
      "border-r border-gray-200 flex flex-col min-h-screen sticky top-0 max-h-screen overflow-hidden shadow-sm transition-all duration-300 bg-[#f9fafb]",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-20">
        <Link href={PATHS.HOME}>
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

      {/* Brand Switcher */}
      {!collapsed ? (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
              <img src={venueXLogoSmall} alt="Brand" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate flex-1">VenueX</span>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <div
            className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-sm overflow-hidden cursor-pointer"
            title={t('sidebar.menu.brandSwitcherTooltip') || 'Switch brand'}
          >
            <img src={venueXLogoSmall} alt="Brand" className="w-6 h-6 object-contain" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-3")}>
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            if (item.type === 'gap') {
              return <li key={`gap-${index}`} className="pt-4" />;
            }

            const isActive = location === item.href;
            const isVenueXAI = item.href === PATHS.VENUEX_AI;

            if (isVenueXAI && !collapsed) {
              return (
                <li key={item.href}>
                  <div>
                    <div className="flex items-center">
                      <Link href={item.href} className="flex-1">
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-md text-sm transition-colors cursor-pointer px-3 py-2",
                            isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                          )}
                          data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => setAiChatsExpanded(!aiChatsExpanded)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
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
                            <Link href={PATHS.VENUEX_AI}>
                              <div
                                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer truncate"
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
                </li>
              );
            }

            // Standard nav item
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-md text-sm transition-colors cursor-pointer",
                      collapsed ? "px-3 py-2 justify-center" : "gap-3 px-3 py-2",
                      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
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
      </nav>

      {/* Bottom Footer Strip */}
      {collapsed ? (
        <div className="border-t border-gray-200 p-2 flex flex-col items-center gap-1">
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            data-testid="sidebar-toggle"
            title={t('sidebar.menu.collapseTooltipCollapsed') || 'Expand sidebar'}
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
          <Link href={PATHS.SETTINGS}>
            <div
              className={cn(
                "p-2 rounded-md transition-colors cursor-pointer",
                location === PATHS.SETTINGS ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
              title={t('sidebar.menu.settings') || 'Settings'}
            >
              <Settings className="w-5 h-5" />
            </div>
          </Link>
          <Link href={PATHS.PROFILE}>
            <div
              className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              title={mockUserName}
            >
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white", avatarBgColor)}>
                {mockUserInitials}
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              data-testid="sidebar-toggle"
              title={t('sidebar.menu.collapseTooltipExpanded') || 'Collapse sidebar'}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1" />
            <Link href={PATHS.SETTINGS}>
              <div
                className={cn(
                  "p-2 rounded-md transition-colors cursor-pointer",
                  location === PATHS.SETTINGS ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
                title={t('sidebar.menu.settings') || 'Settings'}
              >
                <Settings className="w-5 h-5" />
              </div>
            </Link>
            <Link href={PATHS.PROFILE}>
              <div
                className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                title={mockUserName}
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white", avatarBgColor)}>
                  {mockUserInitials}
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
