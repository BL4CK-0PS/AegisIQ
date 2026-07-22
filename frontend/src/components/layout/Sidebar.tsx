import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Dna,
  ClipboardCheck,
  GraduationCap,
  Fingerprint,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { to: "/job-description", label: "Role Definition", icon: FileText },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/skill-dna-profile", label: "Skill DNA", icon: Dna },
  { to: "/assessment", label: "Assessments", icon: ClipboardCheck },
  { to: "/learning", label: "Learning", icon: GraduationCap },
  { to: "/cyber-twin", label: "Cyber Twin", icon: Fingerprint },
];

const bottomItems = [
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-surface-800 bg-surface-950">
      <div className="flex h-16 items-center gap-2 border-b border-surface-800 px-6">
        <Shield className="h-8 w-8 text-primary-500" />
        <span className="text-lg font-bold text-surface-100">AegisIQ</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-600/10 text-primary-400"
                  : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-800 px-3 py-3">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-600/10 text-primary-400"
                  : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-3 flex items-center gap-3 rounded-lg border-t border-surface-800 pt-3">
          <Avatar name={user?.name ?? "User"} size="sm" />
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-surface-200">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-surface-500">{user?.email ?? "user@aegisiq.io"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
