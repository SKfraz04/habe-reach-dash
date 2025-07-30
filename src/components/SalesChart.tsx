import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartData {
  date: string;
  volumeGenerated: number;
  earnings: number;
  tokensDistributed: number;
}

interface SalesChartProps {
  data: ChartData[];
}

const chartOptions = [
  { value: "volumeGenerated", label: "Volume Generated (USDT)", color: "hsl(260 60% 65%)" },
  { value: "earnings", label: "Earnings Over Time (USDT)", color: "hsl(142 76% 45%)" },
  { value: "tokensDistributed", label: "Tokens Distributed (HABE)", color: "hsl(35 91% 62%)" },
];

const timePeriods = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
];

export function SalesChart({ data }: SalesChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("volumeGenerated");
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const currentOption = chartOptions.find(option => option.value === selectedMetric);

  const formatTooltipValue = (value: number, name: string) => {
    if (name.includes("USDT")) {
      return [`$${value.toLocaleString()}`, name];
    }
    return [`${value.toLocaleString()} HABE`, name];
  };

  return (
    <Card className="shadow-admin-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Sales Analytics</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
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
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
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
                  if (selectedMetric === "tokensDistributed") {
                    return `${(value / 1000).toFixed(0)}K`;
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
        </div>
      </CardContent>
    </Card>
  );
}