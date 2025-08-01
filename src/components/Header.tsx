import { Wallet, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  
  const getBreadcrumbText = () => {
    switch (location.pathname) {
      case "/transactions":
        return "UTM Transactions";
      case "/withdrawals":
        return "Manager Withdrawals";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>UTM Manager</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{getBreadcrumbText()}</span>
      </div>
    </header>
  );
}