import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

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

      const data = await response.json();
      
      // Store email in localStorage for OTP verification
      localStorage.setItem('loginEmail', email);
      
      toast({
        title: "Success",
        description: "Login request sent successfully. Please check your email for OTP.",
      });

      // Navigate to OTP screen
      navigate("/otp");
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to send login request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
           <img src="../src/Assets/Images/Habe.png" alt="logo" width={100} height={100} />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to HABE</CardTitle>
          <CardDescription>
            Enter your registered email address to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full theme-bg"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Login"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? Contact your administrator
          </p>
        </CardContent>
      </Card>
    </div>
  );
}