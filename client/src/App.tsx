import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import { Waitlist } from "./components/Waitlist";
import { NotFound } from "./components/NotFound";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const App = () => {
  const [currentView, setCurrentView] = useState<
    "landing" | "waitlist" | "404"
  >("landing");

  useEffect(() => {
    // Check if user came from app.neurolint.dev or any direct app link
    const referrer = document.referrer;
    const currentUrl = window.location.href;

    // Check if the referrer or current URL suggests they were looking for the app
    if (
      referrer.includes("app.neurolint.dev") ||
      currentUrl.includes("app") ||
      window.location.search.includes("app") ||
      window.location.hash.includes("app")
    ) {
      setCurrentView("404");
    }
  }, []);

  const handleJoinWaitlist = () => {
    setCurrentView("waitlist");
  };

  const renderContent = () => {
    switch (currentView) {
      case "waitlist":
        return <Waitlist />;
      case "404":
        return <NotFound onJoinWaitlist={handleJoinWaitlist} />;
      default:
        return (
          <div className="min-h-screen bg-black text-white">
            <SiteHeader onJoinWaitlist={handleJoinWaitlist} />
            <main id="main-content" className="relative">
              <Index onJoinWaitlist={handleJoinWaitlist} />
            </main>
            <SiteFooter />
          </div>
        );
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        {/* Skip link for keyboard navigation */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200"
        >
          Skip to main content
        </a>

        <Toaster />
        <Sonner />

        {renderContent()}
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
