import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Withdrawal {
  id: number;
  withdrawalDate: string;
  managerName: string;
  managerEmail: string;
  walletAddress: string;
  amount: number;
  transactionHash: string | null;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  remark: string;
  processingDate: string | null;
  withdrawalId: string;
  processingFee?: number;
  finalAmount?: number;
  adminRemarks?: string;
}

interface WithdrawalDetailsModalProps {
  withdrawal: Withdrawal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalDetailsModal: React.FC<WithdrawalDetailsModalProps> = ({
  withdrawal,
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
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!withdrawal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-between">
            Withdrawal Details
            <Badge className={`ml-2 ${getStatusColor(withdrawal.status)} capitalize`}>
              {withdrawal.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Withdrawal Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Withdrawal ID</label>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-sm bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20">
                      {withdrawal.withdrawalId}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(withdrawal.withdrawalId, 'Withdrawal ID')}
                      className="h-9 w-9"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Manager Wallet Address</label>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-sm bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20">
                      {withdrawal.walletAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(withdrawal.walletAddress, 'Wallet address')}
                      className="h-9 w-9"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://etherscan.io/address/${withdrawal.walletAddress}`, '_blank')}
                      className="h-9 w-9"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {withdrawal.transactionHash && (
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Transaction Hash</label>
                    <div className="flex items-center gap-3 mt-2">
                      <code className="text-sm bg-background/80 px-3 py-2 rounded flex-1 font-mono border border-border/20">
                        {withdrawal.transactionHash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(withdrawal.transactionHash!, 'Transaction hash')}
                        className="h-9 w-9"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://etherscan.io/tx/${withdrawal.transactionHash}`, '_blank')}
                        className="h-9 w-9"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Manager Name</label>
                    <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                      {withdrawal.managerName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Manager Email</label>
                    <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                      {withdrawal.managerEmail}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Withdrawal Note</label>
                  <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                    {withdrawal.remark}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Timeline Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Request Date</label>
                  <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                    {new Date(withdrawal.withdrawalDate).toLocaleString()}
                  </p>
                </div>
                {withdrawal.processingDate && (
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Processing Date</label>
                    <p className="text-sm bg-background/80 px-3 py-2 rounded mt-2 border border-border/20">
                      {new Date(withdrawal.processingDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-background/50 p-6 rounded-lg border border-border/30">
              <h3 className="font-semibold text-foreground mb-5 text-lg">Financial Details</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Requested Amount</label>
                  <p className="text-xl font-bold text-primary bg-background/80 px-3 py-3 rounded mt-2 border border-primary/20">
                    ${withdrawal.amount.toFixed(2)} USDT
                  </p>
                </div>
                
                {withdrawal.processingFee !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Processing Fee</label>
                    <p className="text-lg font-bold text-yellow-400 bg-background/80 px-3 py-3 rounded mt-2 border border-yellow-400/20">
                      ${withdrawal.processingFee.toFixed(2)} USDT
                    </p>
                  </div>
                )}

                {withdrawal.finalAmount !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground font-medium mb-2 block">Final Amount</label>
                    <p className="text-lg font-bold text-green-400 bg-background/80 px-3 py-3 rounded mt-2 border border-green-400/20">
                      ${withdrawal.finalAmount.toFixed(2)} USDT
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-2 block">Current Status</label>
                  <div className="mt-2">
                    <Badge className={`text-base px-4 py-2 ${getStatusColor(withdrawal.status)} capitalize`}>
                      {withdrawal.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {withdrawal.adminRemarks && (
              <div className="bg-background/50 p-6 rounded-lg border border-border/30">
                <h3 className="font-semibold text-foreground mb-5 text-lg">Admin Remarks</h3>
                
                <div>
                  <p className="text-sm bg-background/80 px-3 py-3 rounded border border-border/20 leading-relaxed">
                    {withdrawal.adminRemarks}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 text-lg">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Withdrawal request of ${withdrawal.amount.toFixed(2)} USDT submitted on {new Date(withdrawal.withdrawalDate).toLocaleDateString()}. 
                Current status: {withdrawal.status}.
                {withdrawal.finalAmount && ` Final amount: $${withdrawal.finalAmount.toFixed(2)} USDT.`}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};