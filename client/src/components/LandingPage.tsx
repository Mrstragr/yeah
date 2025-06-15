import React from 'react';
import { Play, Star, Trophy, Users, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage = ({ onLoginClick }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-purple-500">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-2xl">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">9</span>
              </div>
            </div>
            <span className="text-4xl font-bold text-white tracking-wider">91CLUB</span>
          </div>

          {/* Tagline */}
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Experience the Ultimate<br />Gaming Platform
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join millions of players worldwide in<br />
            the most exciting gaming experience
          </p>

          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="bg-white text-red-500 px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 mb-8"
          >
            Get Started
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
            <div className="text-white">
              <div className="text-2xl font-bold">2.5M+</div>
              <div className="text-sm opacity-90">Active Players</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">₹50L+</div>
              <div className="text-sm opacity-90">Daily Payouts</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose 91CLUB?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Win Big Prizes</h3>
              <p className="text-gray-600">
                Play exciting games and win amazing prizes with our fair gaming system
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with bank-level security
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Payouts</h3>
              <p className="text-gray-600">
                Get your winnings instantly with our fast withdrawal system
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Games</h3>
              <p className="text-gray-600">
                Choose from a variety of exciting games including lottery, slots, and more
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Active Community</h3>
              <p className="text-gray-600">
                Join our vibrant community of players and share your gaming experience
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Experience</h3>
              <p className="text-gray-600">
                Enjoy premium gaming experience with high-quality graphics and smooth gameplay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Playing?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of players and start winning today!
        </p>
        <button
          onClick={onLoginClick}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
        >
          Join Now
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8 px-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">9</span>
            </div>
          </div>
          <span className="text-xl font-bold text-white">91CLUB</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2024 91CLUB. All rights reserved.
        </p>
      </div>
    </div>
  );
};