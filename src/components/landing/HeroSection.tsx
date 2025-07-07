import React from 'react';
import { Sparkles, Star, Camera } from 'lucide-react';
import { HeroSectionProps } from '../../types/landing.types';
import { HERO_STATS, ANIMATION_CLASSES } from '../../constants/features';

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-8 h-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white font-medium">FROM</span>
          </div>
          
          <div className="bg-green-600 text-white px-4 py-2 rounded-full inline-block text-2xl font-bold mb-6">
            FREE
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            FIND YOUR
            <br />
            MATCHES!
          </h1>
          
          <p className="text-white/90 text-lg mb-8 max-w-md">
            Discover your celebrity twin, spirit animal, core color, and more with AI analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-300 fill-current" />
            <span className="text-white font-semibold">{HERO_STATS.rating}</span>
            <span className="text-white/80 text-sm">since {HERO_STATS.year}</span>
          </div>
          
          <div className="flex space-x-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
    </div>
  );
}; 