export const APP_NAME = "AI Coding Mentor";
export const APP_DESCRIPTION = "Your AI-powered coding mentor for learning, debugging, and mastering programming.";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "AI Mentor", href: "/mentor", icon: "Bot" },
  { label: "Code Review", href: "/code-review", icon: "GitPullRequest" },
  { label: "Debug Lab", href: "/debug-lab", icon: "Bug" },
  { label: "Learning Path", href: "/learning-path", icon: "Route" },
  { label: "Challenges", href: "/challenges", icon: "Trophy" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Recommendations", href: "/recommendations", icon: "Sparkles" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
] as const;

export const BOTTOM_NAV_ITEMS = [
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Profile", href: "/settings#profile", icon: "User" },
] as const;
