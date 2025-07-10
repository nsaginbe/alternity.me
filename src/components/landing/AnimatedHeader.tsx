import React from 'react';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-gradient-x py-2">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
}; 