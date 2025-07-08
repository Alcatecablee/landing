/**
 * Focus management utilities for better accessibility
 */

export class FocusManager {
  private static focusableSelectors = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    "audio[controls]",
    "video[controls]",
    "details summary",
    '[role="button"]:not([disabled])',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="switch"]',
    '[role="tab"]',
  ].join(",");

  /**
   * Get all focusable elements within a container
   */
  static getFocusableElements(container: Element): HTMLElement[] {
    return Array.from(
      container.querySelectorAll(this.focusableSelectors),
    ) as HTMLElement[];
  }

  /**
   * Trap focus within a container (useful for modals, dialogs)
   */
  static trapFocus(container: Element): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.restoreFocus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }

  /**
   * Save current focus for later restoration
   */
  static saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  }

  /**
   * Restore focus to previously saved element
   */
  static restoreFocus(element?: HTMLElement | null): void {
    if (element && typeof element.focus === "function") {
      element.focus();
    }
  }

  /**
   * Focus first error in a form (useful for form validation)
   */
  static focusFirstError(container: Element): boolean {
    const errorElement = container.querySelector(
      '[aria-invalid="true"], .error, [data-error]',
    ) as HTMLElement;

    if (errorElement && typeof errorElement.focus === "function") {
      errorElement.focus();
      return true;
    }

    return false;
  }

  /**
   * Announce to screen readers
   */
  static announce(
    message: string,
    priority: "polite" | "assertive" = "polite",
  ): void {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Check if element is visible and focusable
   */
  static isFocusable(element: HTMLElement): boolean {
    if (!element || element.tabIndex < 0) return false;

    const style = window.getComputedStyle(element);
    return !(
      style.display === "none" ||
      style.visibility === "hidden" ||
      element.hasAttribute("disabled") ||
      element.getAttribute("aria-hidden") === "true"
    );
  }

  /**
   * Set focus with visual indication (useful for programmatic focus)
   */
  static focusWithIndication(element: HTMLElement): void {
    if (!this.isFocusable(element)) return;

    element.focus();

    // Add temporary focus ring for better visual feedback
    element.style.outline = "2px solid #3b82f6";
    element.style.outlineOffset = "2px";

    setTimeout(() => {
      element.style.outline = "";
      element.style.outlineOffset = "";
    }, 2000);
  }

  /**
   * Skip to content (for skip links)
   */
  static skipToContent(targetId: string): void {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus();

      // Remove tabindex after focus to prevent focus trap
      setTimeout(() => {
        target.removeAttribute("tabindex");
      }, 100);
    }
  }

  /**
   * Manage focus during route changes
   */
  static handleRouteChange(pageTitle?: string): void {
    // Announce page change to screen readers
    if (pageTitle) {
      this.announce(`Navigated to ${pageTitle}`);
    }

    // Focus main content or first heading
    const mainContent = document.getElementById("main-content");
    const firstHeading = document.querySelector(
      "h1, h2, h3, h4, h5, h6",
    ) as HTMLElement;

    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      setTimeout(() => {
        mainContent.removeAttribute("tabindex");
      }, 100);
    } else if (firstHeading) {
      firstHeading.setAttribute("tabindex", "-1");
      firstHeading.focus();
      setTimeout(() => {
        firstHeading.removeAttribute("tabindex");
      }, 100);
    }
  }

  /**
   * Enhanced keyboard navigation for custom components
   */
  static setupKeyboardNavigation(
    container: Element,
    options: {
      onEnter?: (element: HTMLElement) => void;
      onEscape?: () => void;
      onArrowUp?: (element: HTMLElement) => void;
      onArrowDown?: (element: HTMLElement) => void;
      onArrowLeft?: (element: HTMLElement) => void;
      onArrowRight?: (element: HTMLElement) => void;
    } = {},
  ): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      switch (e.key) {
        case "Enter":
          if (options.onEnter) {
            e.preventDefault();
            options.onEnter(target);
          }
          break;
        case "Escape":
          if (options.onEscape) {
            e.preventDefault();
            options.onEscape();
          }
          break;
        case "ArrowUp":
          if (options.onArrowUp) {
            e.preventDefault();
            options.onArrowUp(target);
          }
          break;
        case "ArrowDown":
          if (options.onArrowDown) {
            e.preventDefault();
            options.onArrowDown(target);
          }
          break;
        case "ArrowLeft":
          if (options.onArrowLeft) {
            e.preventDefault();
            options.onArrowLeft(target);
          }
          break;
        case "ArrowRight":
          if (options.onArrowRight) {
            e.preventDefault();
            options.onArrowRight(target);
          }
          break;
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }
}

/**
 * React hook for focus management
 */
export function useFocusManagement() {
  const trapFocus = (container: Element) => FocusManager.trapFocus(container);
  const saveFocus = () => FocusManager.saveFocus();
  const restoreFocus = (element?: HTMLElement | null) =>
    FocusManager.restoreFocus(element);
  const announce = (message: string, priority?: "polite" | "assertive") =>
    FocusManager.announce(message, priority);
  const focusFirstError = (container: Element) =>
    FocusManager.focusFirstError(container);

  return {
    trapFocus,
    saveFocus,
    restoreFocus,
    announce,
    focusFirstError,
  };
}

/**
 * React hook for route focus management
 */
export function useRouteFocus() {
  const handleRouteChange = (pageTitle?: string) => {
    FocusManager.handleRouteChange(pageTitle);
  };

  return { handleRouteChange };
}
