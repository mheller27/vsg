import { useTheme } from "./contexts/ThemeContext";
import { Toaster } from '@shared-ui/toaster';
import { Toaster as Sonner } from '@shared-ui/sonner';
import { TooltipProvider } from '@shared-ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import PropertyProfile from "./pages/PropertyProfile";
import GlobalHeader from "./components/GlobalHeader";
import { ThemeProvider } from "./contexts/ThemeContext";

// Query client
const queryClient = new QueryClient();

// AppContent moved out so we can use useTheme inside
const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        <BrowserRouter>
          <TooltipProvider>
            <GlobalHeader />
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/property/:slug" element={<PropertyProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;