import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { ANIMATION_CLASSES } from '../../constants/features';

interface AITechCardProps {
  onClick?: () => void;
}

export const AITechCard: React.FC<AITechCardProps> = ({ onClick }) => {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white h-full group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
         onClick={onClick}
         role="button"
         tabIndex={0}
         aria-label="AI Tech - Advanced machine learning"
         onKeyDown={(e) => {
           if (e.key === 'Enter' || e.key === ' ') {
             e.preventDefault();
             onClick?.();
           }
         }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-black mb-2">AI TECH</h3>
          <p className="text-blue-100">Advanced machine learning</p>
        </div>
        <div className="bg-white/20 rounded-full p-3">
          <Brain className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mt-auto">
        <div className={ANIMATION_CLASSES.button}>
          <span className="font-bold">EXPLORE</span>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}; 