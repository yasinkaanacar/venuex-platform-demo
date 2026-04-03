import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePostHog } from "posthog-js/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PATHS, standaloneRoutes, appRoutes, NotFound } from "@/routes";
import DemoGate from "@/components/shared/DemoGate";


function Router() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();
  const posthogInstance = usePostHog();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    if (location === PATHS.VENUEX_AI) {
      setSidebarCollapsed(true);
    }
  }, [location]);

  useEffect(() => {
    posthogInstance?.capture('$pageview');
  }, [location, posthogInstance]);

  return (
    <Switch>
      {/* Standalone pages without sidebar */}
      {standaloneRoutes.map((route) => (
        <Route key={route.path} path={route.path} component={route.component} />
      ))}

      {/* Main app with sidebar */}
      <Route>
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          <main className={`flex-1 h-screen overflow-y-auto transition-all duration-300 bg-white dark:bg-gray-800 ${sidebarCollapsed ? 'ml-0' : ''}`}>
            <Header />
            <Switch>
              {appRoutes.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </Route>
    </Switch>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3}>
          <AuthProvider>
            <BrandProvider>
              <LanguageProvider>
                <DemoGate>
                  <Router />
                </DemoGate>
              </LanguageProvider>
            </BrandProvider>
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
