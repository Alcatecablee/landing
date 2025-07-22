import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Responsive container component with proper spacing and max-widths
 */
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  padding = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div 
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Responsive grid component with breakpoint controls
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className = ''
}) => {
  const getGridClasses = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    classes.push(`gap-${gap}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(getGridClasses(), className)}>
      {children}
    </div>
  );
};

/**
 * Responsive text component with fluid typography
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
    '3xl': 'text-3xl sm:text-4xl md:text-5xl',
    '4xl': 'text-4xl sm:text-5xl md:text-6xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl',
    '6xl': 'text-6xl sm:text-7xl md:text-8xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black'
  };

  return (
    <Component 
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        'leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Mobile-optimized button component
 */
interface MobileButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 transform-gpu backface-visibility-hidden touch-manipulation -webkit-tap-highlight-color-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-white/50',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-800 focus-visible:ring-zinc-500/50',
    outline: 'border-2 border-zinc-600 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:ring-zinc-500/50',
    ghost: 'text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:ring-zinc-500/50'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        'hover:scale-105 active:scale-95',
        className
      )}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

/**
 * Responsive image component with lazy loading and optimization
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall' | 'auto';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio = 'auto'
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    tall: 'aspect-[4/5]',
    auto: ''
  };

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio])}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          aspectRatio !== 'auto' && 'absolute inset-0',
          className
        )}
      />
    </div>
  );
};

/**
 * Responsive spacing component
 */
interface SpacingProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'vertical' | 'horizontal' | 'all';
  className?: string;
}

export const Spacing: React.FC<SpacingProps> = ({
  children,
  size = 'md',
  direction = 'vertical',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
    '2xl': 'gap-16'
  };

  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    all: 'space-y-4 md:space-y-6 lg:space-y-8'
  };

  if (direction === 'all') {
    return (
      <div className={cn(directionClasses[direction], className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn(directionClasses[direction], sizeClasses[size], className)}>
      {children}
    </div>
  );
};

/**
 * Mobile-first card component
 */
interface MobileCardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  padding = 'md',
  interactive = false,
  className = '',
  href,
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = cn(
    'bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-xl',
    paddingClasses[padding],
    interactive && 'transition-all duration-300 hover:bg-zinc-900/70 hover:border-zinc-600 hover:scale-105 active:scale-95 cursor-pointer touch-manipulation',
    className
  );

  if (href) {
    return (
      <a 
        href={href}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={cn(baseClasses, 'w-full text-left')}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

/**
 * Hook for responsive breakpoint detection
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
    isLargeScreen: ['xl', '2xl'].includes(breakpoint)
  };
};

/**
 * Hook for safe area insets (for mobile devices with notches)
 */
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  React.useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

export default {
  Container,
  ResponsiveGrid,
  ResponsiveText,
  MobileButton,
  ResponsiveImage,
  Spacing,
  MobileCard,
  useBreakpoint,
  useSafeArea
};
