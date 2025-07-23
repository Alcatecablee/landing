import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:no-underline"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform-gpu ${
          isScrolled
            ? "bg-black/98 shadow-2xl shadow-black/50 border-zinc-700/80 translate-y-0"
            : "bg-black/95 border-zinc-800/60 translate-y-0"
        }`}
        role="banner"
        aria-label="Site header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center group transition-all duration-300 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg p-1 -m-1 interactive"
                aria-label="NeuroLint home"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fff4a9c5485bd483f9de4955855068620%2F782095f7d5454085bbee2289a7106f2e?format=webp&width=800"
                  alt="NeuroLint Logo"
                  className="h-8 w-auto transition-all duration-300 group-hover:brightness-110 group-focus-visible:brightness-110 bee-flight-animation"
                  loading="eager"
                  decoding="async"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {[].map((item, index) =>
                item.comingSoon ? (
                  <span
                    key={item.label}
                    className="px-4 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed rounded-lg relative"
                    style={{
                      animationDelay: `${index * 75}ms`,
                      animation: isScrolled
                        ? "slideInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                        : "none",
                    }}
                  >
                    {item.label}
                    <span className="absolute -top-1 -right-1 bg-zinc-700 text-zinc-300 text-xs px-1 py-0.5 rounded text-[10px]">
                      soon
                    </span>
                  </span>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) transform hover:scale-105 hover:-translate-y-0.5 focus-visible:scale-105 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative touch-manipulation will-change-transform interactive-lift"
                    style={{
                      animationDelay: `${index * 75}ms`,
                      animation: isScrolled
                        ? "slideInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                        : "none",
                    }}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>

            {/* Demo, Pricing and Get Started Buttons */}
            <div className="flex items-center space-x-3">
              <a
                href="https://app.neurolint.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black interactive btn-smooth"
                aria-label="View NeuroLint demo"
              >
                Demo
              </a>
              <a
                href="https://app.neurolint.dev/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black interactive btn-smooth"
                aria-label="View NeuroLint pricing plans"
              >
                Pricing
              </a>
              <a
                href="https://app.neurolint.dev/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 active:bg-zinc-200 transition-all duration-300 text-sm transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-lg hover:shadow-xl interactive btn-smooth"
                aria-label="Get started with NeuroLint"
              >
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 h-12 w-12 p-0 transition-all duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black micro-bounce"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                      isMenuOpen
                        ? "opacity-0 rotate-180 scale-75"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                    aria-hidden="true"
                  />
                  <X
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                      isMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-180 scale-75"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          <div
            className={`md:hidden fixed inset-0 z-40 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
              isMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
              role="presentation"
            />

            {/* Mobile Menu Panel */}
            <div
              ref={menuRef}
              id="mobile-menu"
              className={`absolute top-16 left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl shadow-black/50 transform transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform mobile-scroll ${
                isMenuOpen
                  ? "translate-y-0 opacity-100 scale-100"
                  : "-translate-y-full opacity-0 scale-98"
              }`}
              role="navigation"
              aria-label="Mobile navigation menu"
              aria-hidden={!isMenuOpen}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <nav className="px-4 py-6 space-y-1" role="navigation">
                {[].map((item, index) =>
                  item.comingSoon ? (
                    <span
                      key={item.label}
                      className="block px-6 py-4 text-lg font-medium text-zinc-500 cursor-not-allowed rounded-lg min-h-[56px] flex items-center justify-between touch-manipulation"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isMenuOpen
                          ? `slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms forwards`
                          : "none",
                      }}
                    >
                      {item.label}
                      <span className="bg-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </span>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-4 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) transform hover:translate-x-2 focus-visible:translate-x-2 active:scale-98 active:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black min-h-[56px] flex items-center touch-manipulation -webkit-tap-highlight-color-transparent mobile-nav-item"
                      onClick={() => setIsMenuOpen(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setIsMenuOpen(false);
                        }
                      }}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isMenuOpen
                          ? `slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms forwards`
                          : "none",
                      }}
                    >
                      {item.label}
                    </a>
                  ),
                )}

                {/* Demo, Pricing and Get Started Section in Mobile Menu */}
                <div className="border-t border-zinc-800/50 mt-4 pt-4 px-4 space-y-3">
                  <a
                    href="https://app.neurolint.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-6 py-3 text-center text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 mobile-nav-item interactive"
                    aria-label="View NeuroLint demo"
                  >
                    Demo
                  </a>
                  <a
                    href="https://app.neurolint.dev/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-6 py-3 text-center text-zinc-300 hover:text-white hover:bg-zinc-800/70 rounded-lg transition-all duration-300 mobile-nav-item interactive"
                    aria-label="View NeuroLint pricing plans"
                  >
                    Pricing
                  </a>
                  <a
                    href="https://app.neurolint.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-6 py-3 text-center bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 mobile-nav-item interactive"
                    aria-label="Get started with NeuroLint"
                  >
                    Get Started
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
