import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ManagerProfile } from "@/components/ManagerProfile";
import { KPICards } from "@/components/KPICards";
import { SalesChart } from "@/components/SalesChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import axios from "axios";
import { API_CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');

const managerData = {
  name: userDataFromStorage?.data?.manager?.name,
  email: userDataFromStorage?.data?.manager?.email,
  uniqueUrl: `https://habe-ico.zip2box.com/?ref=${userDataFromStorage?.data?.manager?.refCode}`,
};

const chartData = [
  { date: "Jan 1", volumeGenerated: 15000, earnings: 1500, tokensDistributed: 75000 },
  { date: "Jan 2", volumeGenerated: 18000, earnings: 1800, tokensDistributed: 90000 },
  { date: "Jan 3", volumeGenerated: 22000, earnings: 2200, tokensDistributed: 110000 },
  { date: "Jan 4", volumeGenerated: 19000, earnings: 1900, tokensDistributed: 95000 },
  { date: "Jan 5", volumeGenerated: 25000, earnings: 2500, tokensDistributed: 125000 },
  { date: "Jan 6", volumeGenerated: 28000, earnings: 2800, tokensDistributed: 140000 },
  { date: "Jan 7", volumeGenerated: 32000, earnings: 3200, tokensDistributed: 160000 },
  { date: "Jan 8", volumeGenerated: 29000, earnings: 2900, tokensDistributed: 145000 },
  { date: "Jan 9", volumeGenerated: 35000, earnings: 3500, tokensDistributed: 175000 },
  { date: "Jan 10", volumeGenerated: 38000, earnings: 3800, tokensDistributed: 190000 },
];

const recentTransactions = [
  {
    id: "1",
    date: "2024-01-10",
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    userWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    volumeUSDT: 5000,
    tokensDistributed: 25000,
    managerEarnings: 500,
    status: "completed" as const,
  },
  {
    id: "2",
    date: "2024-01-10",
    transactionHash: "0x2345678901bcdef12345678901bcdef123456789",
    userWallet: "0xbcdef12345678901bcdef12345678901bcdef123",
    volumeUSDT: 3200,
    tokensDistributed: 16000,
    managerEarnings: 320,
    status: "completed" as const,
  },
  {
    id: "3",
    date: "2024-01-09",
    transactionHash: "0x3456789012cdef123456789012cdef1234567890",
    userWallet: "0xcdef123456789012cdef123456789012cdef1234",
    volumeUSDT: 7500,
    tokensDistributed: 37500,
    managerEarnings: 750,
    status: "pending" as const,
  },
  {
    id: "4",
    date: "2024-01-09",
    transactionHash: "0x456789013def1234567890123def12345678901",
    userWallet: "0xdef1234567890123def1234567890123def12345",
    volumeUSDT: 2100,
    tokensDistributed: 10500,
    managerEarnings: 210,
    status: "completed" as const,
  },
  {
    id: "5",
    date: "2024-01-08",
    transactionHash: "0x56789014ef123456789014ef123456789014ef12",
    userWallet: "0xef123456789014ef123456789014ef123456789",
    volumeUSDT: 8900,
    tokensDistributed: 44500,
    managerEarnings: 890,
    status: "failed" as const,
  },
];

export default function Dashboard() {
  const [managerDatas, setManagerDatas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const managerId = API_CONFIG.MANAGER_ID;

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
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
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

  useEffect(() => {
    getUtmManager();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Manager Profile Section */}
          <ManagerProfile
            name={managerDatas?.name || managerData.name}
            email={managerDatas?.email || managerData.email}
            uniqueUrl={managerDatas?.refCode || userDataFromStorage?.data?.manager?.refCode}
          />

          {/* KPI Cards */}
          <KPICards data={managerDatas || {}} />

          {/* Sales Chart */}
          <SalesChart data={chartData} />

          {/* Recent Transactions */}
          <RecentTransactions transactions={recentTransactions} />
        </main>
      </div>
    </div>
  );
}