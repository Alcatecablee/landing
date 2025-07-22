import React from 'react';

/**
 * Screen reader only text component
 * Used for providing additional context to screen readers without visual display
 */
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

/**
 * Skip navigation component for better keyboard accessibility
 */
export const SkipNavigation: React.FC = () => {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#footer" className="skip-link">
        Skip to footer
      </a>
    </div>
  );
};

/**
 * Live region component for announcing dynamic content changes
 */
interface LiveRegionProps {
  children: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ 
  children, 
  level = 'polite', 
  atomic = false 
}) => {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};

/**
 * Focus management component for trapping focus within a container
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  active, 
  className = '' 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

/**
 * Progress indicator component with accessibility features
 */
interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label,
  description,
  size = 'md'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-sm text-zinc-400">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div 
        className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress indicator'}
        aria-describedby={description ? 'progress-description' : undefined}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {description && (
        <p id="progress-description" className="text-xs text-zinc-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

/**
 * Accessible tooltip component
 */
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const tooltipId = React.useId();

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div aria-describedby={tooltipId}>
        {children}
      </div>
      
      {(isVisible || isFocused) && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-zinc-900 border border-zinc-700 rounded-md shadow-lg pointer-events-none ${positionClasses[position]}`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-zinc-900 border border-zinc-700 transform rotate-45" />
        </div>
      )}
    </div>
  );
};

/**
 * Announcement component for screen readers
 */
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export const Announcement: React.FC<AnnouncementProps> = ({ 
  message, 
  priority = 'polite' 
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

/**
 * Keyboard shortcut indicator component
 */
interface KeyboardShortcutProps {
  keys: string[];
  description: string;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ 
  keys, 
  description 
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            {index > 0 && <span className="text-zinc-500 text-xs">+</span>}
            <kbd className="px-2 py-1 text-xs font-mono bg-zinc-800 border border-zinc-700 rounded shadow-sm">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
      <span className="text-sm text-zinc-400">{description}</span>
    </div>
  );
};

/**
 * Loading state component with accessibility features
 */
interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  loadingText = 'Loading...',
  children
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
            role="status"
            aria-live="polite"
            aria-label={loadingText}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white font-medium">{loadingText}</span>
            </div>
          </div>
          <VisuallyHidden>{loadingText}</VisuallyHidden>
        </>
      )}
      <div aria-hidden={isLoading}>
        {children}
      </div>
    </div>
  );
};

export default {
  VisuallyHidden,
  SkipNavigation,
  LiveRegion,
  FocusTrap,
  ProgressIndicator,
  Tooltip,
  Announcement,
  KeyboardShortcut,
  LoadingState
};
