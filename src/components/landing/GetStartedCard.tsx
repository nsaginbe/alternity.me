import React from 'react';
import { ArrowRight } from 'lucide-react';

interface GetStartedCardProps {
  onClick: () => void;
}

export const GetStartedCard: React.FC<GetStartedCardProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-gradient-to-br from-crimson to-red-600 rounded-3xl p-6 text-white h-full group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Get Started - Start your journey now"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowRight className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-1">GET STARTED</h3>
            <p className="text-red-100">Start your journey now</p>
          </div>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
          FREE
        </div>
      </div>
    </div>
  );
}; 