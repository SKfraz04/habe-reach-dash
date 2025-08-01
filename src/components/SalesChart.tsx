import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { API_CONFIG } from "@/lib/config";
import { format, parseISO } from "date-fns";

interface SalesData {
  date: string;
  label: string;
  totalAmount: number;
  totalTransactions: number;
  totalUSDStake: number;
}

interface SalesChartProps {
  data?: any[];
}

const chartOptions = [
  { value: "totalUSDStake", label: "Total USD Stake", color: "hsl(260 60% 65%)" },
  // { value: "totalAmount", label: "Total Amount", color: "hsl(142 76% 45%)" },
  { value: "totalTransactions", label: "Total Transactions", color: "hsl(35 91% 62%)" },
];

const timePeriods = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "yearly", label: "Yearly" },
];

export function SalesChart({ data }: SalesChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("totalUSDStake");
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [managerDatas, setManagerDatas] = useState<SalesData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const managerId = API_CONFIG.MANAGER_ID;
  const [isLoading, setIsLoading] = useState(true);
  const currentOption = chartOptions.find(option => option.value === selectedMetric);

  const formatTooltipValue = (value: number, name: string) => {
    if (name.includes("USD") || name.includes("Amount")) {
      return [`$${value.toLocaleString()}`, name];
    }
    return [`${value.toLocaleString()}`, name];
  };

  const formatDateLabel = (date: string, period: string) => {
    try {
      const parsedDate = parseISO(date);
      
      switch (period) {
        case "7days":
          return format(parsedDate, "MMM dd"); // Jul 26
        case "30days":
          return format(parsedDate, "MMM dd"); // Jul 26
        case "yearly":
          return format(parsedDate, "MMM yyyy"); // Jul 2024
        default:
          return format(parsedDate, "MMM dd");
      }
    } catch (error) {
      return date;
    }
  };

  const getUtmManager = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/utm/managers/${managerId}/sales-analytics?period=${selectedPeriod}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Sales Analytics API Response:', response.data);
      
      if (response.data?.data?.salesData) {
        // Transform the data to include formatted date labels
        const transformedData = response.data.data.salesData.map((item: SalesData) => ({
          ...item,
          formattedDate: formatDateLabel(item.date, selectedPeriod)
        }));
        
        setManagerDatas(transformedData);
      } else {
        setManagerDatas([]);
      }
      
    } catch (error) {
      console.error('Error making API request:');
      
      if (error.response) {
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      
      setError('Failed to fetch sales analytics data');
      setManagerDatas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUtmManager();
  }, [selectedPeriod]); // Re-fetch when period changes

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  if (isLoading) {
    return (
      <Card className="shadow-admin-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-admin-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-destructive">Error loading analytics: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-admin-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Sales Analytics</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {managerDatas.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={managerDatas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (selectedMetric === "totalTransactions") {
                      return value.toLocaleString();
                    }
                    return `$${(value / 1000).toFixed(0)}K`;
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg shadow-admin-lg p-3 z-50">
                          <p className="text-sm font-medium text-card-foreground">{label}</p>
                          <p className="text-sm text-card-foreground" style={{ color: currentOption?.color }}>
                            {formatTooltipValue(payload[0].value as number, currentOption?.label || "")[0]}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={currentOption?.color}
                  strokeWidth={3}
                  dot={{ fill: currentOption?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentOption?.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-muted-foreground">No data available for the selected period</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}