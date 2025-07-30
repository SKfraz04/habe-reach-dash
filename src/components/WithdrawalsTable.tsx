import React, { useState } from 'react';
import { Copy, Eye, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface WithdrawalsTableProps {
  withdrawals: Withdrawal[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSort: (column: string) => void;
}

export const WithdrawalsTable: React.FC<WithdrawalsTableProps> = ({
  withdrawals,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSort,
}) => {
  const { toast } = useToast();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);

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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewRemarks = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsRemarksModalOpen(true);
  };

  const handleSort = (column: string) => {
    onSort(column);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <>
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-background/50">
                <TableHead className="text-foreground font-semibold">Sr. No</TableHead>
                <TableHead className="text-foreground font-semibold">Manager Name</TableHead>
                <TableHead className="text-foreground font-semibold">Manager Email</TableHead>
                <TableHead className="text-foreground font-semibold">Wallet Address</TableHead>
                <TableHead className="text-foreground font-semibold">
                  <Button variant="ghost" onClick={() => handleSort('amount')} className="h-auto p-0 font-semibold">
                    Withdrawal Amount <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  <Button variant="ghost" onClick={() => handleSort('withdrawalDate')} className="h-auto p-0 font-semibold">
                    Withdrawal Date <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-semibold">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal, index) => (
                <TableRow 
                  key={withdrawal.id} 
                  className="border-border/30 hover:bg-background/30 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {withdrawal.managerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {withdrawal.managerEmail}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
                        {truncateAddress(withdrawal.walletAddress)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(withdrawal.walletAddress, 'Wallet address')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">
                    ${withdrawal.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="text-sm">
                      {new Date(withdrawal.withdrawalDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(withdrawal.withdrawalDate).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewRemarks(withdrawal)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-background/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-border/50 bg-background/80 rounded px-2 py-1 text-foreground"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-border/50"
            >
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-border/50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isRemarksModalOpen} onOpenChange={setIsRemarksModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Remarks</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedWithdrawal?.adminRemarks ? (
              <p className="text-sm text-foreground">{selectedWithdrawal.adminRemarks}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No remarks</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};