import React, { useState } from 'react';
import { DollarSign, Wallet, FileText, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  managerWallet: string;
  onSubmit: (withdrawalData: any) => void;
}

export const RequestWithdrawalModal: React.FC<RequestWithdrawalModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  managerWallet,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState(managerWallet);
  const [note, setNote] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minWithdrawal = 10; // Minimum withdrawal amount
  const processingFee = 1; // Fixed processing fee
  const calculatedFee = amount ? Math.min(parseFloat(amount) * 0.01, processingFee) : 0;
  const finalAmount = amount ? parseFloat(amount) - calculatedFee : 0;

  const validateForm = () => {
    const newErrors: any = {};

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) < minWithdrawal) {
      newErrors.amount = `Minimum withdrawal amount is $${minWithdrawal}`;
    } else if (parseFloat(amount) > availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }

    if (!walletAddress) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.walletAddress = 'Invalid wallet address format';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the withdrawal terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        walletAddress,
        note: note || 'Standard withdrawal request',
        processingFee: calculatedFee,
        finalAmount,
      };

      await onSubmit(withdrawalData);
      
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for $${amount} USDT has been submitted successfully.`,
        duration: 3000,
      });

      // Reset form
      setAmount('');
      setNote('');
      setAgreedToTerms(false);
      setErrors({});
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setNote('');
      setAgreedToTerms(false);
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Request Withdrawal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Available Balance Display */}
          <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="text-lg font-bold text-primary">${availableBalance.toFixed(2)} USDT</span>
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground font-medium">
              Withdrawal Amount (USDT)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-10 bg-background/80 border-border/50 ${errors.amount ? 'border-red-500' : ''}`}
                min={minWithdrawal}
                max={availableBalance}
                step="0.01"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ${minWithdrawal} USDT
            </p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="walletAddress" className="text-foreground font-medium">
              Wallet Address
            </Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className={`pl-10 bg-background/80 border-border/50 font-mono text-sm ${errors.walletAddress ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.walletAddress && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.walletAddress}
              </p>
            )}
          </div>

          {/* Withdrawal Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-foreground font-medium">
              Withdrawal Note (Optional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
              <Textarea
                id="note"
                placeholder="Add a note for this withdrawal request..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="pl-10 bg-background/80 border-border/50 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Fee Calculation */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-background/50 p-4 rounded-lg border border-border/30 space-y-2">
              <h4 className="font-medium text-foreground">Withdrawal Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Amount:</span>
                  <span className="text-foreground">${parseFloat(amount).toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className="text-yellow-400">${calculatedFee.toFixed(2)} USDT</span>
                </div>
                <div className="border-t border-border/30 pt-1 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Final Amount:</span>
                    <span className="text-green-400">${finalAmount.toFixed(2)} USDT</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer">
                I agree to the withdrawal terms and conditions, including processing fees and transaction times.
              </Label>
              {errors.terms && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.terms}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !amount || !walletAddress || !agreedToTerms}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};