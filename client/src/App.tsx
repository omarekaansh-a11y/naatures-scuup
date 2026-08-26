import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";

/** Style reminder — Mall Road Monograph: Home and Full Menu remain still beneath a single deep-maroon diagonal navigation sweep. */
import ErrorBoundary from "./components/ErrorBoundary";
import { MobileExperienceEnhancer } from "./components/MobileExperienceEnhancer";
import { SiteHeader } from "./components/SiteHeader";
import { StructuralStyles } from "./components/StructuralStyles";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <>
      <a className="mobile-skip-link" href="#main-content">Skip to page content</a>
      <SiteHeader paper={location === "/menu"} />
      <Switch location={location}>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider><StructuralStyles /><Toaster /><Router /><MobileExperienceEnhancer /></TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
