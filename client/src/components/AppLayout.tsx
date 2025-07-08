import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardIcon } from "@/components/ui/DashboardIcon";
import { TransformCodeIcon } from "@/components/ui/TransformCodeIcon";
import {
  FileCode,
  Upload,
  Code,
  Github,
  Settings,
  User,
  CreditCard,
  Crown,
  Zap,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  History,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
      description: "View your analytics",
    },
    {
      name: "Transform Code",
      href: "/app",
      icon: TransformCodeIcon,
      description: "Advanced rule-based code transformation",
    },
    {
      name: "Teams",
      href: "/teams",
      icon: Users,
      description: "Collaborate with your team",
    },
    {
      name: "Live Sessions",
      href: "/team/live-sessions",
      icon: Code,
      description: "Real-time code collaboration",
    },
    {
      name: "History",
      href: "/history",
      icon: History,
      description: "View past transformations",
    },
    {
      name: "Documentation",
      href: "/docs",
      icon: BookOpen,
      description: "Learn how to use NeuroLint",
    },
  ];

  const planType = user?.app_metadata?.plan_type || "free";
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const getPlanIcon = () => {
    switch (planType) {
      case "pro":
        return <Zap className="w-4 h-4 text-zinc-400" />;
      case "enterprise":
        return <Crown className="w-4 h-4 text-zinc-400" />;
      default:
        return <Users className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getPlanColor = () => {
    return "bg-zinc-800/30 text-zinc-400 border-zinc-700/30";
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-zinc-900/95 border-r border-zinc-700/40 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-50 ${
          sidebarCollapsed
            ? "w-16 lg:w-16"
            : "w-72 lg:w-72 fixed lg:relative inset-y-0 left-0"
        } before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.02] before:to-transparent before:pointer-events-none`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="p-5 border-b border-zinc-700/30 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
          <div className="flex items-center justify-between relative z-10">
            {!sidebarCollapsed && (
              <Link
                to="/"
                className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fff4a9c5485bd483f9de4955855068620%2F782095f7d5454085bbee2289a7106f2e?format=webp&width=800"
                    alt="NeuroLint"
                    className="h-8 w-auto filter brightness-110 transition-all duration-300 group-hover:brightness-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-300 p-2.5 min-h-[44px] min-w-[44px] rounded-xl hover:scale-110 active:scale-95 border border-transparent hover:border-zinc-600/30"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              aria-expanded={!sidebarCollapsed}
              aria-controls="main-navigation"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5" />
              ) : (
                <ChevronLeft className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-0.5" />
              )}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-zinc-700/30 flex-shrink-0 bg-gradient-to-r from-zinc-900/30 to-zinc-800/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"></div>
          {sidebarCollapsed ? (
            <div className="flex justify-center relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl flex items-center justify-center shadow-lg border border-zinc-600/30 transition-all duration-300 hover:scale-110 hover:from-zinc-600 hover:to-zinc-700">
                <User className="w-5 h-5 text-zinc-200" />
              </div>
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg border border-zinc-600/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:from-zinc-600 group-hover:to-zinc-600 relative overflow-hidden">
                  <User className="w-5 h-5 text-zinc-100 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate flex items-center gap-2">
                    {displayName}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  </div>
                  <div className="text-xs text-zinc-400 truncate font-medium">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-xs px-3 py-1 rounded-lg border-zinc-600/50 bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-zinc-700/50 ${getPlanColor()}`}
                >
                  {getPlanIcon()}
                  <span className="ml-2 capitalize font-medium">
                    {planType} Plan
                  </span>
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          id="main-navigation"
          className="p-4 space-y-2 flex-1 min-h-0 overflow-y-auto scrollbar-hide"
          role="list"
        >
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden will-change-transform min-h-[48px] touch-manipulation border backdrop-blur-sm ${
                  isActive
                    ? "bg-gradient-to-r from-zinc-700/80 to-zinc-600/60 text-white shadow-xl border-zinc-500/40 scale-[1.02] shadow-zinc-900/50"
                    : "text-zinc-400 hover:text-white hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/30 hover:scale-[1.02] border-transparent hover:border-zinc-600/30 focus:bg-gradient-to-r focus:from-zinc-800/50 focus:to-zinc-700/30 focus:text-white focus:scale-[1.02] focus:border-zinc-600/30"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                title={
                  sidebarCollapsed
                    ? `${item.name}: ${item.description}`
                    : undefined
                }
                aria-label={
                  sidebarCollapsed
                    ? `${item.name}: ${item.description}`
                    : item.name
                }
                aria-current={isActive ? "page" : undefined}
                role="listitem"
                onFocus={(e) => {
                  if (sidebarCollapsed && window.innerWidth < 1024) {
                    setSidebarCollapsed(false);
                  }
                }}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 shadow-lg" : "group-hover:bg-zinc-600/30"}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0 transition-all duration-300">
                    <div className="text-sm font-semibold leading-tight">
                      {item.name}
                    </div>
                    <div className="text-xs text-zinc-500 group-hover:text-zinc-300 leading-tight mt-0.5 transition-colors duration-200 font-medium">
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Enhanced active indicator */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full shadow-lg shadow-blue-500/50" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  </>
                )}

                {/* Enhanced hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none rounded-2xl" />

                {/* Subtle glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isActive ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-100" : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-zinc-400/5 to-zinc-300/5"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with subtle branding */}
        <div className="p-4 flex-shrink-0 border-t border-zinc-700/30 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"></div>
            {!sidebarCollapsed ? (
              <div className="relative z-10 flex items-center justify-between">
                <div className="text-xs text-zinc-500 font-medium">
                  NeuroLint v1.0
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-xs text-zinc-500 font-medium">
                    Online
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center relative z-10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-900/80 border-b border-zinc-800/60 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(false)}
            className="text-zinc-400 hover:text-white p-2 min-h-[44px] min-w-[44px]"
            aria-label="Open navigation menu"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="text-sm font-medium text-white">NeuroLint</div>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-black relative">
          <main role="main" className="w-full h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
