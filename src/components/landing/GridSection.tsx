import React from 'react';
import { FeatureCard } from './FeatureCard';
import { GRID_LAYOUT_CLASSES, FEATURE_BLOCKS } from '../../constants/features';
import { FeatureBlock } from '../../types/landing.types';

export const GridSection: React.FC<{ onFeatureClick: (id: string) => void }> = ({ 
  onFeatureClick, 
}) => {
  const handleFeatureClick = (featureId: string) => {
    onFeatureClick(featureId);
  };

  const celebrityFeature = FEATURE_BLOCKS.find((f: FeatureBlock) => f.id === 'celebrity');
  const spiritAnimalFeature = FEATURE_BLOCKS.find((f: FeatureBlock) => f.id === 'animal');
  const colorFeature = FEATURE_BLOCKS.find((f: FeatureBlock) => f.id === 'color');
  const personalityFeature = FEATURE_BLOCKS.find((f: FeatureBlock) => f.id === 'gender');

  return (
    <div className={GRID_LAYOUT_CLASSES.container}>
      
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

      {spiritAnimalFeature && (
        <div className={GRID_LAYOUT_CLASSES.spiritAnimal}>
          <FeatureCard 
            feature={{
              ...spiritAnimalFeature,
              onClick: () => handleFeatureClick('animal')
            }} 
          />
        </div>
      )}

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

      {personalityFeature && (
        <div className={GRID_LAYOUT_CLASSES.personality}>
          <FeatureCard 
            feature={{
              ...personalityFeature,
              onClick: () => handleFeatureClick('gender')
            }} 
          />
        </div>
      )}

    </div>
  );
}; 