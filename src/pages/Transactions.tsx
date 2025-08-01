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
  }, [searchTerm, statusFilter, dateRange]);

  const totalPages = Math.ceil(transactions?.totalItems / itemsPerPage);

  const handleExport = () => {
    const csvContent = [
      // CSV headers
      ['Sr. No', 'Date', 'Transaction Hash', 'User Wallet', 'Purchase Amount', 'HABE Tokens', 'Manager Earnings', 'Referral Tokens', 'Commission %', 'Status'].join(','),
      // CSV data
      ...transactions?.items?.map((transaction: any, index: number) => [
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
      description: `${transactions?.items?.length} transactions exported to CSV`,
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