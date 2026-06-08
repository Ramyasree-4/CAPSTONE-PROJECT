import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Building2,
  ClipboardCheck,
  Coins,
  FileClock,
  FileText,
  Gauge,
  GitBranch,
  HelpCircle,
  History,
  Home,
  KeyRound,
  Layers3,
  LineChart,
  Lock,
  MessageSquare,
  PieChart,
  Search,
  Settings,
  Shield,
  Upload,
  User,
  Users
} from "lucide-react";

export const appNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/documents", label: "My Documents", icon: FileText },
  { href: "/documents/upload", label: "Upload", icon: Upload },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/chat/history", label: "Conversations", icon: History },
  { href: "/queries", label: "Queries", icon: FileClock },
  { href: "/search", label: "Search", icon: Search },
  { href: "/evaluation", label: "Evaluation", icon: ClipboardCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/feedback", label: "Feedback", icon: Bot },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings }
];

export const adminNav = [
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/roles", label: "Roles", icon: KeyRound },
  { href: "/admin/documents", label: "Documents", icon: Layers3 },
  { href: "/admin/monitoring", label: "Monitoring", icon: Gauge },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: Lock },
  { href: "/admin/security", label: "Security", icon: Activity }
];

export const advancedNav = [
  { href: "/super-admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/super-admin/settings", label: "System Config", icon: Settings },
  { href: "/knowledge-graph", label: "Knowledge Graph", icon: GitBranch },
  { href: "/models/compare", label: "Model Compare", icon: PieChart },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/help", label: "Help", icon: HelpCircle },
  { href: "/api-docs", label: "API Docs", icon: BookOpen }
];

export const quickStats = [
  { label: "Documents", value: "0", icon: FileText, tone: "bg-pine" },
  { label: "Queries", value: "0", icon: MessageSquare, tone: "bg-violet" },
  { label: "Storage", value: "0%", icon: Layers3, tone: "bg-coral" },
  { label: "Monthly Cost", value: "$0", icon: Coins, tone: "bg-amber" },
  { label: "Latency", value: "0s", icon: LineChart, tone: "bg-ink" }
];
