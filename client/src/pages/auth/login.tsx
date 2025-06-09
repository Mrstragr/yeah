import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back to TashanWin!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid phone number or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a1810] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffd700] to-[#ffa500] bg-clip-text text-transparent mb-2">
            TashanWin
          </h1>
          <p className="text-gray-400">Welcome back! Login to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#2a2a2a] border border-[#444] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#ffd700] font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("phone")}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-red-400 text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#ffd700] font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password"
                className="text-[#ffd700] hover:text-[#ffa500] text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffa500] hover:to-[#ffd700] text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#444]"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-[#444]"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link 
                href="/auth/register"
                className="text-[#ffd700] hover:text-[#ffa500] font-medium"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Demo Account:</p>
          <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4">
            <p className="text-[#ffd700] text-sm">Phone: 9876543210</p>
            <p className="text-[#ffd700] text-sm">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}