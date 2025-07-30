import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function Withdrawals() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Manager Withdrawals</h1>
            <p className="text-muted-foreground">
              Withdrawal history and requests will be managed here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}