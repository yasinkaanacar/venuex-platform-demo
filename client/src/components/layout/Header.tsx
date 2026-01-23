import { useLocation } from "wouter";
import { getRouteConfig } from "@/lib/route-config";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const [location] = useLocation();
    const config = getRouteConfig(location);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
                {/* Left Side: Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {config.breadcrumbs.map((item, index) => (
                        <div key={item.label} className="flex items-center gap-2">
                            {index > 0 && <span className="text-muted-foreground/50">/</span>}
                            <span className={index === config.breadcrumbs.length - 1 ? "font-semibold text-foreground" : ""}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right Side: Actions & User */}
                <div className="ml-auto flex items-center gap-4">
                    {/* Action: Search (Optional placeholder) */}
                    <div className="relative w-64 hidden md:block">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8 h-9" />
                    </div>

                    {/* Action: Notifications */}
                    <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                    </button>

                    <div className="h-6 w-px bg-border/50" />

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors outline-none">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-medium leading-none">Kürşad Arman</div>
                                    <div className="text-xs text-muted-foreground mt-1">Admin</div>
                                </div>
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="Kürşad Arman" />
                                    <AvatarFallback className="bg-primary/10 text-primary">KA</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
