import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Overview from "@/pages/overview";
import OfflineConversions from "@/pages/offline-conversions";
import OfflineConversionsMVP from "@/pages/offline-conversionsMVP";
import Locations from "@/pages/locations";
import Reviews from "@/pages/reviews";
import ReviewsX from "@/pages/reviewsX";
import ReviewsMVP from "@/pages/reviewsMVP";
import LocationMatch from "@/pages/location-match";
import AIRecommendations from "@/pages/ai-recommendations";
import CreatePost from "@/pages/create-post";
import ManagePosts from "@/pages/manage-posts";
import Catalog from "@/pages/catalog";
import VenueXAI from "@/pages/venuex-ai";
import Setup from "@/pages/setup";
import Setup2 from "@/pages/setup2";
import OnboardingUnified from "@/pages/onboarding-unified";
import Signup from "@/pages/signup";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';

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
      
      {/* Main app with sidebar */}
      <Route>
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 bg-white dark:bg-gray-800 ${sidebarCollapsed ? 'ml-0' : ''}`}>
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/offline-conversions" component={OfflineConversions} />
              <Route path="/offline-conversionsMVP" component={OfflineConversionsMVP} />
              <Route path="/locations" component={Locations} />
              <Route path="/locations/posts" component={Locations} />
              <Route path="/reviews" component={Reviews} />
              <Route path="/reviewsX" component={ReviewsX} />
              <Route path="/reviewsMVP" component={ReviewsMVP} />
              <Route path="/location-match" component={LocationMatch} />
              <Route path="/ai-recommendations" component={AIRecommendations} />
              <Route path="/create-post" component={CreatePost} />
              <Route path="/manage-posts" component={ManagePosts} />
              <Route path="/catalog" component={Catalog} />
              <Route path="/venuex-ai" component={VenueXAI} />
              <Route path="/setup" component={Setup} />
              <Route path="/setup2" component={Setup2} />
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
          <Router />
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
