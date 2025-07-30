import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get email from localStorage (set during login)
    const storedEmail = localStorage.getItem('loginEmail');
    if (!storedEmail) {
      toast({
        title: "Error",
        description: "No email found. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setEmail(storedEmail);
  }, [navigate, toast]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://habe-ico-api.zip2box.com/api/utm/manager/verify-otp', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          email: email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store authentication token if provided in response
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // Clear login email from localStorage
      localStorage.removeItem('loginEmail');
      
      toast({
        title: "Success",
        description: "OTP verified successfully!",
      });

      // Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch('https://habe-ico-api.zip2box.com/api/utm/manager/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "OTP resent successfully. Please check your email.",
      });
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <div className="h-6 w-6 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            onClick={handleVerify}
            className="w-full"
            size="lg"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button 
              variant="link" 
              onClick={handleResendOTP}
              className="text-primary"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}