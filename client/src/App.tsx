import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useState } from "react";

/** Style reminder — Mall Road Monograph: route changes move vertically with a quiet maroon-and-mango loading trace. */
import ErrorBoundary from "./components/ErrorBoundary";
import { StructuralStyles } from "./components/StructuralStyles";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";

function Router() {
  const [location] = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setIsRouteLoading(true);
    const resetAfterTransition = window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 380);
    const stopLoading = window.setTimeout(() => setIsRouteLoading(false), 520);
    return () => {
      window.clearTimeout(resetAfterTransition);
      window.clearTimeout(stopLoading);
    };
  }, [location]);

  return (
    <>
      <div className={`route-loading${isRouteLoading ? " route-loading--active" : ""}`} role="status" aria-live="polite" aria-label={isRouteLoading ? "Loading page" : undefined}>
        <span className="route-loading__bar" />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={location} className="route-transition" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/menu" component={MenuPage} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider><StructuralStyles /><Toaster /><Router /></TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
