import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileExperienceEnhancer() {
  const [showQuickTop, setShowQuickTop] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const updateProgress = () => {
      const maximum = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / maximum));
      root.style.setProperty("--mobile-scroll-progress", progress.toFixed(4));
      setShowQuickTop((visible) => {
        const nextVisible = window.scrollY > window.innerHeight * 0.9;
        return visible === nextVisible ? visible : nextVisible;
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      root.style.removeProperty("--mobile-scroll-progress");
    };
  }, []);

  const returnToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return <>
    <div className="mobile-scroll-progress" aria-hidden="true"><span /></div>
    <button type="button" className={`mobile-quick-top${showQuickTop ? " mobile-quick-top--visible" : ""}`} onClick={returnToTop} aria-label="Return to the top of the page"><ArrowUp size={18} strokeWidth={2} /></button>
  </>;
}
