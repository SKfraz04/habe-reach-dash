import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { WithdrawalFilters } from '@/components/WithdrawalFilters';
import { WithdrawalsTable } from '@/components/WithdrawalsTable';
import { RequestWithdrawalModal } from '@/components/RequestWithdrawalModal';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Wallet } from 'lucide-react';

// Sample withdrawal data
const sampleWithdrawals = [
  {
    id: 1,
    withdrawalDate: "2024-07-22 07:23:00",
    managerName: "John Doe",
    managerEmail: "john@example.com",
    walletAddress: "0xdd33d6b7C9E13D9f86C8e32Ff5b69c7f7742b794",
    amount: 20.00,
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    status: "completed" as const,
    remark: "Regular withdrawal",
    processingDate: "2024-07-22 08:15:00",
    withdrawalId: "WD-2024-001",
    processingFee: 1.00,
    finalAmount: 19.00,
    adminRemarks: "Processed successfully by admin"
  },
  {
    id: 2,
    withdrawalDate: "2024-07-25 14:30:00",
    managerName: "John Doe",
    managerEmail: "john@example.com", 
    walletAddress: "0xdd33d6b7C9E13D9f86C8e32Ff5b69c7f7742b794",
    amount: 150.00,
    transactionHash: null,
    status: "pending" as const,
    remark: "Monthly withdrawal",
    processingDate: null,
    withdrawalId: "WD-2024-002",
    adminRemarks: "Under review by finance team"
  }
];

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState(sampleWithdrawals);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState(sampleWithdrawals);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  const managerData = {
    name: "John Doe",
    email: "john@example.com",
    walletAddress: "0xdd33d6b7C9E13D9f86C8e32Ff5b69c7f7742b794",
    availableBalance: 1250.50
  };

  const summary = {
    totalWithdrawn: withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + (w.finalAmount || w.amount), 0),
    pendingAmount: withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0),
    thisMonthWithdrawals: 94.75
  };

  const handleFiltersChange = (filters: any) => {
    setFilteredWithdrawals(withdrawals);
  };

  const handleSort = (field: string) => {
    console.log('Sort by:', field);
  };

  const handleRefresh = () => {
    setFilteredWithdrawals([...withdrawals]);
  };

  const handleExport = () => {
    console.log('Export CSV');
  };

  const handleWithdrawalRequest = async (withdrawalData: any) => {
    console.log('New withdrawal request:', withdrawalData);
  };

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-primary">Manager Withdrawals</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Manager Withdrawals</h1>
                <p className="text-muted-foreground mt-1">
                  View all your withdrawal transactions and request new withdrawals
                </p>
              </div>
              
              <Button 
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-xl font-bold text-primary">
                      ${managerData.availableBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                    <p className="text-xl font-bold text-green-400">
                      ${summary.totalWithdrawn.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <WithdrawalFilters
              onFiltersChange={handleFiltersChange}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <WithdrawalsTable
              withdrawals={paginatedWithdrawals}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              onSort={handleSort}
            />
          </main>
        </div>
      </div>

      <RequestWithdrawalModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        availableBalance={managerData.availableBalance}
        managerWallet={managerData.walletAddress}
        onSubmit={handleWithdrawalRequest}
      />
    </div>
  );
};

export default Withdrawals;