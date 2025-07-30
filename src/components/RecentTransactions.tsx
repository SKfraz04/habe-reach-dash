import { ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  date: string;
  transactionHash: string;
  userWallet: string;
  volumeUSDT: number;
  tokensDistributed: number;
  managerEarnings: number;
  status: "completed" | "pending" | "failed";
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const truncateAddress = (address: string, start = 6, end = 4) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success-light text-success border-success/20";
    case "pending":
      return "bg-warning-light text-warning border-warning/20";
    case "failed":
      return "bg-destructive-light text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: `Failed to copy ${type.toLowerCase()}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-admin-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tx Hash</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Volume</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Tokens</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Earnings</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-b-0 hover:bg-muted-light/50">
                      <td className="py-3 px-2 text-sm text-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-foreground">
                            {truncateAddress(tx.transactionHash)}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(tx.transactionHash, "Transaction hash")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(`https://etherscan.io/tx/${tx.transactionHash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-foreground">
                            {truncateAddress(tx.userWallet)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(tx.userWallet, "Wallet address")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-medium text-foreground">
                        ${tx.volumeUSDT.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-medium text-foreground">
                        {tx.tokensDistributed.toLocaleString()} HABE
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-medium text-success">
                        ${tx.managerEarnings.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={`text-xs capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}