import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Crown, Star, Gamepad2 } from "lucide-react";

export default function DreamClubLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { phone: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        queryClient.invalidateQueries();
        window.location.href = "/";
      }
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { phone: string; password: string; username: string; email: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        queryClient.invalidateQueries();
        window.location.href = "/";
      }
    },
    onError: (error: any) => {
      setError(error.message || "Registration failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      loginMutation.mutate({
        phone: formData.phone,
        password: formData.password,
      });
    } else {
      registerMutation.mutate({
        phone: formData.phone,
        password: formData.password,
        username: formData.username,
        email: formData.email,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">91DreamClub</h1>
          <p className="text-gray-400 text-sm">Your ultimate gaming destination</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Premium Games</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Gamepad2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Live Casino</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">VIP Rewards</p>
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6">
          {/* Tab Switcher */}
          <div className="bg-slate-700/50 rounded-2xl p-1 mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-slate-700/50 text-white p-4 rounded-2xl border border-slate-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-700/50 text-white p-4 rounded-2xl border border-slate-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-white p-4 rounded-2xl border border-slate-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-white p-4 rounded-2xl border border-slate-600 focus:border-purple-500 focus:outline-none placeholder-gray-400 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending || registerMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loginMutation.isPending || registerMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? "Logging in..." : "Creating account..."}</span>
                </div>
              ) : (
                isLogin ? "Login" : "Create Account"
              )}
            </button>
          </form>

          {/* Demo Account */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-2xl">
            <p className="text-blue-300 text-sm font-medium mb-2">Demo Account:</p>
            <p className="text-blue-200 text-xs">Phone: 9999888777</p>
            <p className="text-blue-200 text-xs">Password: password123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}