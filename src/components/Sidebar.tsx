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
    <div className="flex h-screen w-64 min-w-64 flex-col bg-admin-sidebar border-r border-admin-sidebar-border">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-center border-b border-admin-sidebar-border px-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg">
            <div className="h-5 w-5 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
          <div className="text-admin-sidebar-text">
            <h1 className="text-lg font-bold tracking-wide">HABE</h1>
            <p className="text-sm opacity-75 font-medium">DIGITAL INNOVATION</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-4 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-admin-sidebar-accent text-admin-sidebar-text shadow-lg scale-[1.02]"
                  : "text-admin-sidebar-text/70 hover:bg-admin-sidebar-accent/50 hover:text-admin-sidebar-text hover:scale-[1.01] hover:shadow-md"
              )
            }
          >
            <item.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="tracking-wide">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-admin-sidebar-border p-4">
        <button className="flex w-full items-center space-x-4 rounded-xl px-4 py-3 text-base font-semibold text-admin-sidebar-text/70 transition-all duration-200 hover:bg-admin-sidebar-accent/50 hover:text-admin-sidebar-text hover:scale-[1.01] hover:shadow-md group">
          <LogOut className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
}