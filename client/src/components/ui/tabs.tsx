import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-1 text-zinc-400 backdrop-blur-sm transition-all duration-300 min-h-[3rem] overflow-x-auto scrollbar-hide touch-manipulation",
      "focus-within:ring-2 focus-within:ring-blue-500/70 focus-within:ring-offset-2 focus-within:ring-offset-black",
      "sm:h-auto sm:overflow-x-visible",
      className,
    )}
    role="tablist"
    aria-orientation="horizontal"
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden min-w-[44px] min-h-[44px] touch-manipulation",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
      "hover:text-white hover:bg-zinc-800/50 hover:scale-105 active:scale-95",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:scale-105",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700",
      "hover:before:translate-x-[100%] focus:before:translate-x-[100%]",
      "sm:px-4 sm:py-2 sm:min-w-[auto] sm:min-h-[auto]",
      className,
    )}
    role="tab"
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-bottom-2 data-[state=inactive]:duration-200",
      className,
    )}
    role="tabpanel"
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
