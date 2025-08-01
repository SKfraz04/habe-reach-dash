import React, { useState } from 'react';
import { Copy, ExternalLink, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TransactionDetailsModal } from './TransactionDetailsModal';

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
  utmManagerDetails: any;
}

interface TransactionsTableProps {
  isLoading: boolean;
  transactionsData: any;
}

type SortField = 'date' | 'habeTokens' | 'managerEarnings' | 'status';
type SortDirection = 'asc' | 'desc';

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  isLoading,
  transactionsData
}) => {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // const sortedTransactions = [...transactionsData?.items].sort((a, b) => {
  //   let aValue: any, bValue: any;

  //   switch (sortField) {
  //     case 'date':
  //       aValue = new Date(a.date);
  //       bValue = new Date(b.date);
  //       break;
  //     case 'habeTokens':
  //       aValue = a.habeTokens;
  //       bValue = b.habeTokens;
  //       break;
  //     case 'managerEarnings':
  //       aValue = a.managerEarnings;
  //       bValue = b.managerEarnings;
  //       break;
  //     case 'status':
  //       aValue = a.status;
  //       bValue = b.status;
  //       break;
  //     default:
  //       return 0;
  //   }

  //   if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
  //   if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
  //   return 0;
  // });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-background/50 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (transactionsData?.items?.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground">
            No transactions match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-16 font-semibold">S No</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/50 font-semibold"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date & Time
                    <SortIcon field="date" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Transaction Hash</TableHead>
                <TableHead className="font-semibold">User Wallet</TableHead>
                <TableHead className="font-semibold">Amount (USDT)</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/50 font-semibold"
                  onClick={() => handleSort('habeTokens')}
                >
                  <div className="flex items-center gap-2">
                    HABE Tokens
                    <SortIcon field="habeTokens" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/50 font-semibold"
                  onClick={() => handleSort('managerEarnings')}
                >
                  <div className="flex items-center gap-2">
                    Manager Earnings
                    <SortIcon field="managerEarnings" />
                  </div>
                </TableHead>
                {/* <TableHead className="font-semibold">Referral Tokens</TableHead> */}
                <TableHead className="font-semibold">Referee Rewards (HABE)</TableHead>

                <TableHead className="font-semibold">Commission %</TableHead>
                {/* <TableHead 
                  className="cursor-pointer hover:bg-accent/50 font-semibold"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <SortIcon field="status" />
                  </div>
                </TableHead> */}
                {/* <TableHead className="font-semibold">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsData?.items?.map((transaction: any, index: number) => (
                <TableRow
                  key={transaction?.id}
                  className="hover:bg-accent/30 border-border/30 cursor-pointer"
                  onClick={() => openTransactionDetails(transaction)}
                >
                  <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {new Date(transaction?.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(transaction?.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background/80 px-2 py-1 rounded font-mono">
                        {truncateAddress(transaction?.transactionHash)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(transaction?.transactionHash, 'Transaction hash');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://etherscan.io/tx/${transaction?.transactionHash}`, '_blank');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background/80 px-2 py-1 rounded font-mono">
                        {truncateAddress(transaction?.walletAddress)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(transaction?.walletAddress, 'Wallet address');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {transaction?.usdStake}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction?.tokens?.toLocaleString()} HABE
                  </TableCell>
                  <TableCell className="font-medium text-green-400">
                    ${(transaction?.usdStake / transaction?.utmManagerDetails?.commissionPercent)?.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium text-violet-400">
                    {(transaction?.tokens / transaction?.utmManagerDetails?.commissionPercent)?.toFixed(2)} HABE
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {transaction?.utmManagerDetails?.commissionPercent}%
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    <Badge className={`${getStatusColor(transaction?.status)} capitalize`}>
                      {transaction?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTransactionDetails(transaction);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
      /> */}
    </>
  );
};