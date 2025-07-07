import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Gift, Zap, Crown, Star, Trophy } from 'lucide-react';

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  action: string;
  gradient: string;
  icon: React.ReactNode;
}

interface ComprehensiveSliderSystemProps {
  onSliderAction: (actionType: string) => void;
}

export default function ComprehensiveSliderSystem({ onSliderAction }: ComprehensiveSliderSystemProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const sliderItems: SliderItem[] = [
    {
      id: 'welcome_bonus',
      title: '₹51 WELCOME BONUS',
      subtitle: 'Join now and get instant bonus',
      image: '/api/placeholder/300/150',
      action: 'claim_bonus',
      gradient: 'from-yellow-500 to-orange-500',
      icon: <Gift className="w-6 h-6" />
    },
    {
      id: 'mega_tournament',
      title: 'MEGA TOURNAMENT',
      subtitle: '₹2.5L Prize Pool - Join Now!',
      image: '/api/placeholder/300/150',
      action: 'join_tournament',
      gradient: 'from-purple-500 to-pink-500',
      icon: <Trophy className="w-6 h-6" />
    },
    {
      id: 'vip_exclusive',
      title: 'VIP EXCLUSIVE',
      subtitle: 'Premium benefits await',
      image: '/api/placeholder/300/150',
      action: 'upgrade_vip',
      gradient: 'from-amber-500 to-yellow-500',
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 'daily_bonus',
      title: 'DAILY BONUS',
      subtitle: '10-day streak rewards',
      image: '/api/placeholder/300/150',
      action: 'daily_bonus',
      gradient: 'from-green-500 to-emerald-500',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'flash_sale',
      title: 'FLASH SALE',
      subtitle: '50% Extra on deposits',
      image: '/api/placeholder/300/150',
      action: 'deposit_bonus',
      gradient: 'from-red-500 to-pink-500',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6">
      {/* Main Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${sliderItems[currentSlide].gradient} flex items-center justify-between p-6 text-white`}
          >
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {sliderItems[currentSlide].icon}
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">
                {sliderItems[currentSlide].title}
              </h3>
              <p className="text-sm opacity-90 mb-3">
                {sliderItems[currentSlide].subtitle}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSliderAction(sliderItems[currentSlide].action)}
                className="bg-white text-gray-800 px-6 py-2 rounded-full font-bold text-sm flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Claim Now
              </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="flex-shrink-0 ml-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {sliderItems[currentSlide].icon}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-3 right-3">
        <div 
          className={`w-2 h-2 rounded-full ${
            isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}
        />
      </div>
    </div>
  );
}