import { Home, CreditCard, DollarSign, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "UTM Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Manager Withdrawals",
    href: "/withdrawals",
    icon: DollarSign,
  },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-admin-sidebar border-r border-admin-sidebar-border">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-admin-sidebar-border px-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-secondary rounded-sm flex items-center justify-center">
            <div className="h-4 w-4 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
          <div className="text-admin-sidebar-text">
            <h1 className="text-sm font-bold">HABE</h1>
            <p className="text-xs opacity-75">DIGITAL INNOVATION</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-admin-sidebar-accent text-admin-sidebar-text"
                  : "text-admin-sidebar-text/70 hover:bg-admin-sidebar-accent/50 hover:text-admin-sidebar-text"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-admin-sidebar-border p-3">
        <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-admin-sidebar-text/70 transition-colors hover:bg-admin-sidebar-accent/50 hover:text-admin-sidebar-text">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}