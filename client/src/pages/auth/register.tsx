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
import { Eye, EyeOff, Phone, Lock, User, Mail, Gift } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response;
    },
    onSuccess: (data: any) => {
      localStorage.setItem('token', data.token);
      toast({
        title: "Registration Successful",
        description: "Welcome to TashanWin! You've received ₹500 welcome bonus!",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a1810] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffd700] to-[#ffa500] bg-clip-text text-transparent mb-2">
            TashanWin
          </h1>
          <p className="text-gray-400">Join TashanWin and start winning!</p>
          <div className="bg-gradient-to-r from-[#ffd700]/20 to-[#ffa500]/20 border border-[#ffd700] rounded-lg p-3 mt-4">
            <p className="text-[#ffd700] text-sm font-bold">🎁 Welcome Bonus: ₹500 Free!</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-[#2a2a2a] border border-[#444] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#ffd700] font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="pl-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("username")}
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
              )}
            </div>

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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#ffd700] font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#ffd700] font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-400 text-sm">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-[#ffd700] font-medium">
                Referral Code (Optional)
              </Label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code for bonus"
                  className="pl-10 bg-[#1a1a1a] border-[#444] text-white placeholder-gray-500 focus:border-[#ffd700] focus:ring-[#ffd700]"
                  {...form.register("referralCode")}
                />
              </div>
              <p className="text-xs text-gray-400">Get extra ₹200 bonus with valid referral code!</p>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffa500] hover:to-[#ffd700] text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                  Creating Account...
                </div>
              ) : (
                "Register & Get ₹500 Bonus"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#444]"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-[#444]"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link 
                href="/auth/login"
                className="text-[#ffd700] hover:text-[#ffa500] font-medium"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our{" "}
            <Link href="/terms" className="text-[#ffd700] hover:text-[#ffa500]">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#ffd700] hover:text-[#ffa500]">
              Privacy Policy
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Must be 18+ to play. Gambling can be addictive.
          </p>
        </div>
      </div>
    </div>
  );
}