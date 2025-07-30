import React, { useState } from 'react';
import { Copy, ExternalLink, Eye, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { WithdrawalDetailsModal } from './WithdrawalDetailsModal';

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const truncateHash = (hash: string | null) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const handleViewDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsDetailsModalOpen(true);
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
                <TableHead className="text-foreground font-semibold">
                  <Button variant="ghost" onClick={() => handleSort('withdrawalDate')} className="h-auto p-0 font-semibold">
                    Withdrawal Date <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-semibold">Manager Name</TableHead>
                <TableHead className="text-foreground font-semibold">Manager Email</TableHead>
                <TableHead className="text-foreground font-semibold">Wallet Address</TableHead>
                <TableHead className="text-foreground font-semibold">
                  <Button variant="ghost" onClick={() => handleSort('amount')} className="h-auto p-0 font-semibold">
                    Amount (USDT) <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-semibold">Transaction Hash</TableHead>
                <TableHead className="text-foreground font-semibold">
                  <Button variant="ghost" onClick={() => handleSort('status')} className="h-auto p-0 font-semibold">
                    Status <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground font-semibold">Remark</TableHead>
                <TableHead className="text-foreground font-semibold">Processing Date</TableHead>
                <TableHead className="text-foreground font-semibold">Actions</TableHead>
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
                  <TableCell className="text-foreground">
                    <div className="text-sm">
                      {new Date(withdrawal.withdrawalDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(withdrawal.withdrawalDate).toLocaleTimeString()}
                    </div>
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
                  <TableCell>
                    {withdrawal.transactionHash ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
                          {truncateHash(withdrawal.transactionHash)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(withdrawal.transactionHash!, 'Transaction hash')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`https://etherscan.io/tx/${withdrawal.transactionHash}`, '_blank')}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(withdrawal.status)} capitalize`}>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-32 truncate">
                    {withdrawal.remark}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {withdrawal.processingDate ? (
                      <div>
                        <div>{new Date(withdrawal.processingDate).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(withdrawal.processingDate).toLocaleTimeString()}</div>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetails(withdrawal)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
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

      <WithdrawalDetailsModal
        withdrawal={selectedWithdrawal}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};