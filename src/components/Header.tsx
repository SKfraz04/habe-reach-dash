import { Wallet, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>UTM Manager</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Dashboard</span>
      </div>

      {/* Connect Wallet Button */}
      <Button className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    </header>
  );
}