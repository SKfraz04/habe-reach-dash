import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { API_CONFIG } from "@/lib/config";

interface ManagerProfileProps {
  name: string;
  email: string;
  uniqueUrl: string;
  data: any;
}

export function ManagerProfile({ name, email, uniqueUrl, data }: ManagerProfileProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://habe-ico.zip2box.com/?ref=${uniqueUrl}`);
      setCopied(true);
      toast({
        title: "URL Copied!",
        description: "Your referral URL has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-admin-card">
      <CardContent className="p-6">
        <div className="space-y-4">       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Manager Name</label>
              <p className="text-lg font-semibold text-foreground uppercase">{name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <p className="text-lg text-foreground">{email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Commission Rate</label>
              <p className="text-lg text-foreground">{data?.commissionPercent}%</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Your Unique Referral URL</label>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 p-3 bg-muted-light rounded-lg border">
                <p className="text-sm font-mono text-foreground break-all">{`https://habe-ico.zip2box.com/?ref=${uniqueUrl}`}</p>
              </div>
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                size="sm"
                className="px-3"
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}