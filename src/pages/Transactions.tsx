import React, { useState, useMemo, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TransactionFilters } from "@/components/TransactionFilters";
import { TransactionsTable } from "@/components/TransactionsTable";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_CONFIG } from '@/lib/config';

// Sample transaction data
const sampleTransactions = [
  {
    id: 1,
    date: "2024-07-30 14:32:15",
    transactionHash: "0x4f4f7f7e4e3c5d2f1b8c9a7e6f5d4c3b2a1e0f9e8d7c6b5a4f3e2d1c0b9a8e7f6",
    userWallet: "0xAD1752e1c10c3b7B1C8Cf1cF39C8DcEAe9Ac5882",
    purchaseAmount: "0.001 ETH",
    habeTokens: 1894.13,
    managerEarnings: 132.59,
    referralTokens: 170.47,
    commissionRate: "7%",
    status: "completed" as const,
    blockNumber: 18234567,
    gasUsed: "21000",
    confirmations: 145,
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  },
  {
    id: 2,
    date: "2024-07-30 13:45:32",
    transactionHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    userWallet: "0x742d35Cc6634C0532925a3b8D4D4c4E5f6A7b8C9",
    purchaseAmount: "0.005 ETH",
    habeTokens: 9470.65,
    managerEarnings: 662.95,
    referralTokens: 852.35,
    commissionRate: "7%",
    status: "completed" as const,
    blockNumber: 18234521,
    gasUsed: "21000",
    confirmations: 178,
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  },
  {
    id: 3,
    date: "2024-07-30 12:18:45",
    transactionHash: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    userWallet: "0x8F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a",
    purchaseAmount: "0.002 ETH",
    habeTokens: 3788.26,
    managerEarnings: 265.18,
    referralTokens: 340.94,
    commissionRate: "7%",
    status: "pending" as const,
    blockNumber: 18234489,
    gasUsed: "21000",
    confirmations: 23,
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  },
  {
    id: 4,
    date: "2024-07-29 16:22:18",
    transactionHash: "0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
    userWallet: "0x2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c",
    purchaseAmount: "0.008 ETH",
    habeTokens: 15153.04,
    managerEarnings: 1060.71,
    referralTokens: 1363.77,
    commissionRate: "7%",
    status: "completed" as const,
    blockNumber: 18232145,
    gasUsed: "21000",
    confirmations: 2456,
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  },
  {
    id: 5,
    date: "2024-07-29 14:55:12",
    transactionHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    userWallet: "0x6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d",
    purchaseAmount: "0.003 ETH",
    habeTokens: 5682.39,
    managerEarnings: 397.77,
    referralTokens: 511.42,
    commissionRate: "7%",
    status: "failed" as const,
    blockNumber: 18232098,
    gasUsed: "21000",
    confirmations: 0,
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  },
  // Add more sample transactions...
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    date: `2024-07-${28 - Math.floor(i / 3)} ${10 + i}:${20 + (i * 3) % 40}:${15 + (i * 7) % 45}`,
    transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
    userWallet: `0x${Math.random().toString(16).slice(2, 42)}`,
    purchaseAmount: `${(Math.random() * 0.01 + 0.001).toFixed(4)} ETH`,
    habeTokens: Math.random() * 10000 + 1000,
    managerEarnings: Math.random() * 500 + 50,
    referralTokens: Math.random() * 800 + 100,
    commissionRate: "7%",
    status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)] as "completed" | "pending" | "failed",
    blockNumber: 18230000 + Math.floor(Math.random() * 5000),
    gasUsed: "21000",
    confirmations: Math.floor(Math.random() * 1000),
    exchangeRate: 1894130,
    referralUrl: "https://platform.com/ref/johndoe123"
  }))
];

export default function Transactions() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any>(null);

  const params = {
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    exportRequest: false,
    refference: true,
    paymentStatus: statusFilter === "all" ? "" : statusFilter,
    filter: searchTerm,
    fromDate: dateRange.start,
    toDate: dateRange.end,
    utmManagerId: API_CONFIG.MANAGER_ID
  };
  
  async function getAllTransactions() {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/transactions/getAll`, {
        params: params,
        headers: {
          'accept': 'application/json',
          'authorization': API_CONFIG.AUTH_TOKEN,
        }
      });
      setTransactions(response.data?.data);
      return response.data;
      
    } catch (error) {
      console.error('=== API Error ===');
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Status Text:', error.response.statusText);
        console.error('Headers:', error.response.headers);
        console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('No response received');
        console.error('Request config:', error.config);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  }

  useEffect(() => {
  getAllTransactions()

  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions?.items?.filter((transaction: any) => {
      // Search filter
      const searchMatch = !searchTerm || 
        transaction?.transactionHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction?.userWallet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction?.purchaseAmount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction?.habeTokens?.toString().includes(searchTerm);

      // Status filter
      const statusMatch = statusFilter === "all" || transaction?.status === statusFilter;

      // Date range filter
      const transactionDate = new Date(transaction?.createdAt);
      const startDateMatch = !dateRange.start || transactionDate >= new Date(dateRange.start);
      const endDateMatch = !dateRange.end || transactionDate <= new Date(dateRange.end + " 23:59:59");

      return searchMatch && statusMatch && startDateMatch && endDateMatch;
    });
  }, [searchTerm, statusFilter, dateRange]);

  // Paginate filtered transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(transactions?.totalItems / itemsPerPage);

  const handleExport = () => {
    const csvContent = [
      // CSV headers
      ['Sr. No', 'Date', 'Transaction Hash', 'User Wallet', 'Purchase Amount', 'HABE Tokens', 'Manager Earnings', 'Referral Tokens', 'Commission %', 'Status'].join(','),
      // CSV data
      ...filteredTransactions.map((transaction: any, index: number) => [
        index + 1,
        transaction?.createdAt,
        transaction?.transactionHash,
        transaction?.walletAddress,
        transaction?.usdStake,
        transaction?.tokens,
        transaction?.utmManagerDetails?.managerEarnings,
        transaction?.tokens /  transaction?.utmManagerDetails?.commissionPercent,
        transaction?.utmManagerDetails?.commissionPercent,
        transaction?.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utm-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: `${filteredTransactions.length} transactions exported to CSV`,
      duration: 3000,
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">UTM Transactions</h1>
            <p className="text-muted-foreground">
              View all transactions made through your referral URL
            </p>
          </div>

          {/* Filters */}
          <TransactionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExport={handleExport}
            resultCount={transactions?.totalItems}
          />

          {/* Transactions Table */}
          <TransactionsTable
            // transactions={paginatedTransactions}
            isLoading={isLoading}
            transactionsData={transactions}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions?.totalItems)} of {transactions?.totalItems} transactions
                </div>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-32 bg-background/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}