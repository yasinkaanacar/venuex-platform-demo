import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/Header";
import Overview from "@/pages/overview";
import OfflineConversionsMVP from "@/pages/offline-conversionsMVP";
import Locations2 from "@/pages/locations2";
import ReviewsMVP from "@/pages/reviewsMVP";
import LocationMatch from "@/pages/location-match";
import AIRecommendations from "@/pages/ai-recommendations";
import CreatePost from "@/pages/create-post";
import ManagePosts from "@/pages/manage-posts";
import Catalog from "@/pages/catalog";
import Segments from "@/pages/segments";
import SegmentsMVP from "@/pages/segmentsMVP";
import VenueXAI from "@/pages/venuex-ai";
import Setup from "@/pages/setup";
import Setup2 from "@/pages/setup2";
import Setup3 from "@/pages/setup3";
import Setup3B from "@/pages/setup3B";
import OnboardingUnified from "@/pages/onboarding-unified";
import Signup from "@/pages/signup";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/not-found";
import Components from "@/pages/components";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import { LanguageProvider } from "@/contexts/LanguageContext";

function Router() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    if (location === '/venuex-ai') {
      setSidebarCollapsed(true);
    }
  }, [location]);

  return (
    <Switch>
      {/* Standalone pages without sidebar */}
      <Route path="/onboarding" component={OnboardingUnified} />
      <Route path="/signup" component={Signup} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/setup3" component={Setup3} />
      <Route path="/setup3B" component={Setup3B} />

      {/* Main app with sidebar */}
      <Route>
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          <main className={`flex-1 h-screen overflow-y-auto transition-all duration-300 bg-white dark:bg-gray-800 ${sidebarCollapsed ? 'ml-0' : ''}`}>
            <Header />
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/offline-conversions" component={OfflineConversionsMVP} />
              <Route path="/locations" component={Locations2} />
              <Route path="/locations/posts" component={Locations2} />
              <Route path="/reviews" component={ReviewsMVP} />
              <Route path="/location-match" component={LocationMatch} />
              <Route path="/ai-recommendations" component={AIRecommendations} />
              <Route path="/create-post" component={CreatePost} />
              <Route path="/manage-posts" component={ManagePosts} />
              <Route path="/catalog" component={Catalog} />
              <Route path="/segments" component={Segments} />
              <Route path="/segmentsMVP" component={SegmentsMVP} />
              <Route path="/venuex-ai" component={VenueXAI} />
              <Route path="/setup" component={Setup} />
              <Route path="/setup2" component={Setup2} />
              <Route path="/components" component={Components} />
              <Route path="/settings" component={Settings} />
              <Route path="/profile" component={Profile} />
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
          <LanguageProvider>
            <Router />
          </LanguageProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
