import React from 'react';
import { FeatureCardProps } from '../../types/landing.types';
import { ANIMATION_CLASSES } from '../../constants/features';

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  feature, 
  className = '' 
}) => {
  const IconComponent = feature.icon;

  return (
    <div className={`${className} group relative overflow-hidden`}>
      <div className="shine-effect"></div>
      <div 
        className={`bg-gradient-to-br ${feature.gradient} text-white p-4 ${ANIMATION_CLASSES.card} ${ANIMATION_CLASSES.hover} min-h-[200px]`}
        onClick={feature.onClick}
        role="button"
        tabIndex={0}
        aria-label={`${feature.title} - ${feature.description}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            feature.onClick?.();
          }
        }}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className={ANIMATION_CLASSES.iconContainer}>
            <IconComponent className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
          <p className={`text-sm ${feature.textColor}`}>{feature.description}</p>
        </div>
      </div>
    </div>
  );
}; 