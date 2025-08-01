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
  data: "",
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

export default function Dashboard() {
  const [managerDatas, setManagerDatas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any>(null);

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
  
  const params = {
    pageNumber: 1,
    pageSize: 5,
    exportRequest: false,
    refference: true,
    paymentStatus: '',
    filter: '',
    fromDate: '',
    toDate: '',
    utmManagerId: managerId
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
    getUtmManager();
  getAllTransactions()

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
            data={managerDatas || {}}
          />

          {/* KPI Cards */}
          <KPICards data={managerDatas || {}} />

          {/* Sales Chart */}
          <SalesChart data={chartData} />

          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions} />
        </main>
      </div>
    </div>
  );
}