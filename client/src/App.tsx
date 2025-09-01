import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import Overview from "@/pages/overview";
import OfflineConversions from "@/pages/offline-conversions";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : ''}`}>
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/offline-conversions" component={OfflineConversions} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
