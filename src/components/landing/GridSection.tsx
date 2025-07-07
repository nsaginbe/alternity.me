import React from 'react';
import { HeroSection } from './HeroSection';
import { AITechCard } from './AITechCard';
import { FeatureCard } from './FeatureCard';
import { GetStartedCard } from './GetStartedCard';
import { GridLayoutProps } from '../../types/landing.types';
import { GRID_LAYOUT_CLASSES, FEATURE_BLOCKS } from '../../constants/features';

export const GridSection: React.FC<GridLayoutProps> = ({ 
  features, 
  onFeatureClick, 
  onGetStarted 
}) => {
  const handleFeatureClick = (featureId: string) => {
    onFeatureClick(featureId);
  };

  // Получаем конкретные блоки из констант
  const celebrityFeature = FEATURE_BLOCKS.find(f => f.id === 'celebrity');
  const spiritAnimalFeature = FEATURE_BLOCKS.find(f => f.id === 'spirit-animal');
  const colorFeature = FEATURE_BLOCKS.find(f => f.id === 'color');
  const personalityFeature = FEATURE_BLOCKS.find(f => f.id === 'personality');

  return (
    <div className={GRID_LAYOUT_CLASSES.container}>
      
      {/* Main Hero Block - Large left block */}
      <div className={GRID_LAYOUT_CLASSES.hero}>
        <HeroSection onGetStarted={onGetStarted} />
      </div>

      {/* AI Tech Block - Top right */}
      <div className={GRID_LAYOUT_CLASSES.aiTech}>
        <AITechCard onClick={() => handleFeatureClick('ai-tech')} />
      </div>

      {/* Celebrity Match Block - Middle right */}
      {celebrityFeature && (
        <div className={GRID_LAYOUT_CLASSES.celebrity}>
          <FeatureCard 
            feature={{
              ...celebrityFeature,
              onClick: () => handleFeatureClick('celebrity')
            }} 
          />
        </div>
      )}

      {/* Spirit Animal Block */}
      {spiritAnimalFeature && (
        <div className={GRID_LAYOUT_CLASSES.spiritAnimal}>
          <FeatureCard 
            feature={{
              ...spiritAnimalFeature,
              onClick: () => handleFeatureClick('spirit-animal')
            }} 
          />
        </div>
      )}

      {/* Color Analysis Block */}
      {colorFeature && (
        <div className={GRID_LAYOUT_CLASSES.color}>
          <FeatureCard 
            feature={{
              ...colorFeature,
              onClick: () => handleFeatureClick('color')
            }} 
          />
        </div>
      )}

      {/* Personality Block */}
      {personalityFeature && (
        <div className={GRID_LAYOUT_CLASSES.personality}>
          <FeatureCard 
            feature={{
              ...personalityFeature,
              onClick: () => handleFeatureClick('personality')
            }} 
          />
        </div>
      )}

      {/* Get Started Block - Bottom spanning */}
      <div className={GRID_LAYOUT_CLASSES.getStarted}>
        <GetStartedCard onClick={onGetStarted} />
      </div>

    </div>
  );
}; 