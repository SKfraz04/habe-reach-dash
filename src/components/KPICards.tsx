import { TrendingUp, Users, DollarSign, Percent, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatLargeNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num?.toString();
};

export function KPICards({ data }: any) {
  console.log(data,"dataaaaaaa")
  const kpiItems = [
    {
      title: "Total Referrals",
      value: `${data?.usersReferred} Users`,
      fullValue: `${data?.usersReferred} Users`,
      icon: Users,
      gradient: "bg-gradient-referrals",
      textColor: "text-white",
    },
    {
      title: "Total Volume Generated",
      value: `${formatLargeNumber(data?.tokensSold)} HABE`,
      fullValue: `${formatNumber(data?.tokensSold)} HABE`,
      icon: TrendingUp,
      gradient: "bg-gradient-volume",
      textColor: "text-white",
    },
    {
      title: "Total Earnings",
      value: `$${formatNumber(data?.usdStake)} USDT`,
      fullValue: `$${formatNumber(data?.usdStake)} USDT`,
      icon: DollarSign,
      gradient: "bg-gradient-earnings",
      textColor: "text-white",
    },
    {
      title: "Commission Rate",
      value: data?.commissionPercent,
      fullValue: data?.commissionPercent,
      icon: Percent,
      gradient: "bg-gradient-commission",
      textColor: "text-white",
      badge: "Admin Set",
    },
    {
      title: "Total Referral Tokens",
      value: `${formatLargeNumber(data?.userRewardBalance)} HABE`,
      fullValue: `${formatNumber(data?.userRewardBalance)} HABE`,
      icon: Gift,
      gradient: "bg-gradient-tokens",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {kpiItems.map((item) => (
        <Card key={item.title} className="shadow-admin-card hover:shadow-admin-md transition-shadow duration-200">
          <CardContent className="p-0">
            <div className={`${item.gradient} p-6 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <item.icon className={`h-8 w-8 ${item.textColor}`} />
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <p className={`text-sm ${item.textColor} opacity-90`}>{item.title}</p>
                <p className={`text-2xl font-bold ${item.textColor} mt-1`} title={item.fullValue}>
                  {item.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}