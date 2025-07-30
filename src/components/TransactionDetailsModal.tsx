import React from 'react';
import { Copy, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: number;
  date: string;
  transactionHash: string;
  userWallet: string;
  purchaseAmount: string;
  habeTokens: number;
  managerEarnings: number;
  referralTokens: number;
  commissionRate: string;
  status: 'completed' | 'pending' | 'failed';
  blockNumber: number;
  gasUsed: string;
  confirmations: number;
  exchangeRate: number;
  referralUrl: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-between">
            Transaction Details
            <Badge className={`ml-2 ${getStatusColor(transaction.status)} capitalize`}>
              {transaction.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Transaction Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Transaction Hash</label>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-sm bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20">
                      {transaction.transactionHash}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transaction.transactionHash, 'Transaction hash')}
                      className="h-9 w-9"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://etherscan.io/tx/${transaction.transactionHash}`, '_blank')}
                      className="h-9 w-9"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">User Wallet</label>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-sm bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20">
                      {transaction.userWallet}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transaction.userWallet, 'Wallet address')}
                      className="h-9 w-9"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://etherscan.io/address/${transaction.userWallet}`, '_blank')}
                      className="h-9 w-9"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Block Number</label>
                    <p className="text-sm font-mono bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                      {transaction.blockNumber.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Confirmations</label>
                    <p className="text-sm font-mono bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                      {transaction.confirmations}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Gas Used</label>
                  <p className="text-sm font-mono bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                    {transaction.gasUsed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Timing Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Transaction Date</label>
                  <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                    {new Date(transaction.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Exchange Rate (at time)</label>
                  <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                    1 ETH = {transaction.exchangeRate.toLocaleString()} HABE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Financial Details</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Purchase Amount</label>
                  <p className="text-xl font-bold text-primary bg-background/80 px-3 py-3 rounded mt-2 border border-primary/20">
                    {transaction.purchaseAmount}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">HABE Tokens Received</label>
                  <p className="text-xl font-bold text-foreground bg-background/80 px-3 py-3 rounded mt-2 border border-border/20">
                    {transaction.habeTokens.toLocaleString()} HABE
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Manager Earnings</label>
                    <p className="text-lg font-bold text-green-400 bg-background/80 px-3 py-3 rounded mt-2 border border-green-400/20">
                      ${transaction.managerEarnings.toFixed(2)} USDT
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Commission Rate</label>
                    <p className="text-lg font-bold text-primary bg-background/80 px-3 py-3 rounded mt-2 border border-primary/20">
                      {transaction.commissionRate}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Referral Bonus Tokens</label>
                  <p className="text-lg font-bold text-violet-400 bg-background/80 px-3 py-3 rounded mt-2 border border-violet-400/20">
                    {transaction.referralTokens.toFixed(2)} HABE
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Referral Information</h3>
              
              <div>
                <label className="text-sm text-muted-foreground font-medium mb-2 block">Referral URL Used</label>
                <div className="flex items-center gap-3 mt-2">
                  <code className="text-xs bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20 break-all">
                    {transaction.referralUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transaction.referralUrl, 'Referral URL')}
                    className="h-9 w-9"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 text-lg">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                User purchased {transaction.habeTokens.toLocaleString()} HABE tokens for {transaction.purchaseAmount}, 
                generating ${transaction.managerEarnings.toFixed(2)} USDT in manager earnings and {transaction.referralTokens.toFixed(2)} HABE in referral bonuses.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};