import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { WithdrawalFilters } from '@/components/WithdrawalFilters';
import { WithdrawalsTable } from '@/components/WithdrawalsTable';
import { RequestWithdrawalModal } from '@/components/RequestWithdrawalModal';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/lib/config';
import axios from 'axios';

interface Withdrawal {
  id: string;
  withdrawAmount: number;
  remark: string;
  withdrawalDate: string;
  managerInfo: {
    walletAddress: string;
    name: string;
    email: string;
  };
}

interface WithdrawalsResponse {
  status: number;
  message: string;
  data: {
    withdrawals: Withdrawal[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    managerInfo: {
      id: string;
      name: string;
      email: string;
      totalWithdrawn: number;
    };
  };
  error: string;
}

const Withdrawals = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [managerDatas, setManagerDatas] = useState<any>(null);
  console.log(managerDatas, "managerDatas");
  const [error, setError] = useState<string | null>(null);
  const managerId = API_CONFIG.MANAGER_ID;
  const [managerInfo, setManagerInfo] = useState({
    name: "",
    email: "",
    walletAddress: "",
    availableBalance: 0,
    totalWithdrawn: 0
  });

  // Fetch withdrawals from API
  const fetchWithdrawals = async (page: number = 1, limit: number = 10) => {
    try {
      setIsLoading(true);
      
      // Get latest auth token and manager ID
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      console.log(userData?.data?.manager?.id,"userData")
      const manager_Id = userData?.data?.manager?.id || '';
      const authToken = localStorage.getItem('authToken') || userData?.data?.token || userData?.token || '';
      const managerId = userData?.data?.manager?.id || '';
      
      if (!authToken) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/utm/managers/${managerId}/withdrawals?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'authorization': authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WithdrawalsResponse = await response.json();
      
      if (data.status === 200) {
        setWithdrawals(data.data.withdrawals);
        setFilteredWithdrawals(data.data.withdrawals);
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.totalItems);
        setCurrentPage(data.data.currentPage);
        
        setManagerInfo(prev => ({
          ...prev,
          name: data.data.managerInfo.name,
          email: data.data.managerInfo.email,
          totalWithdrawn: data.data.managerInfo.totalWithdrawn,
          walletAddress: data.data.withdrawals[0]?.managerInfo.walletAddress || prev.walletAddress
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch withdrawals');
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawals. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUtmManager = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/utm/managers/${managerId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Manager API Response:', response.data);
      setManagerDatas(response?.data?.data);
      
    } catch (error) {
      console.error('Error making API request:');
      
      if (error.response) {
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      
      setError('Failed to fetch manager data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Refresh config to get latest auth token
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const authToken = localStorage.getItem('authToken') || userData?.data?.token || userData?.token || '';
    
    if (!authToken) {
      toast({
        title: "Authentication Required",
        description: "Please login to view withdrawals.",
      });
      return;
    }
    
    fetchWithdrawals(currentPage, itemsPerPage);
    getUtmManager();

  }, []);

  // Fetch data when page or items per page changes
  useEffect(() => {
    fetchWithdrawals(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleFiltersChange = (filters: any) => {
    // Apply filters to withdrawals
    let filtered = [...withdrawals];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(w => 
        w.managerInfo.name.toLowerCase().includes(searchTerm) ||
        w.managerInfo.email.toLowerCase().includes(searchTerm) ||
        w.remark.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(w => 
        new Date(w.withdrawalDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(w => 
        new Date(w.withdrawalDate) <= new Date(filters.dateTo)
      );
    }
    
    setFilteredWithdrawals(filtered);
  };

  const handleSort = (field: string) => {
    const sorted = [...filteredWithdrawals].sort((a, b) => {
      switch (field) {
        case 'withdrawAmount':
          return b.withdrawAmount - a.withdrawAmount;
        case 'withdrawalDate':
          return new Date(b.withdrawalDate).getTime() - new Date(a.withdrawalDate).getTime();
        default:
          return 0;
      }
    });
    setFilteredWithdrawals(sorted);
  };

  const handleRefresh = () => {
    fetchWithdrawals(currentPage, itemsPerPage);
  };

  const handleExport = () => {
    console.log('Export CSV');
  };

  const handleWithdrawalRequest = async (withdrawalData: any) => {
    console.log('New withdrawal request:', withdrawalData);
    // TODO: Implement withdrawal request API call
    setIsRequestModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manager Withdrawals</h1>
                <p className="text-muted-foreground mt-1">
                  View all your withdrawal transactions and request new withdrawals
                </p>
              </div>
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
                      ${managerDatas?.openBalUSD?.toFixed(2) || 0}
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
                      $ {managerDatas?.totalWithdrawnUSD?.toFixed(2) || 0}
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
              withdrawals={filteredWithdrawals}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onSort={handleSort}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
          </main>
        </div>
      </div>

      <RequestWithdrawalModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        availableBalance={managerInfo.availableBalance}
        managerWallet={managerInfo.walletAddress}
        onSubmit={handleWithdrawalRequest}
      />
    </div>
  );
};

export default Withdrawals;