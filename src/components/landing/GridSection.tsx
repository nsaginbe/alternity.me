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
        <FeatureCard
          className={GRID_LAYOUT_CLASSES.celebrity}
          feature={{
            ...celebrityFeature,
            onClick: () => handleFeatureClick('celebrity')
          }} 
        />
      )}

      {spiritAnimalFeature && (
        <FeatureCard
          className={GRID_LAYOUT_CLASSES.spiritAnimal}
          feature={{
            ...spiritAnimalFeature,
            onClick: () => handleFeatureClick('animal')
          }} 
        />
      )}

      {colorFeature && (
        <FeatureCard
          className={GRID_LAYOUT_CLASSES.color}
          feature={{
            ...colorFeature,
            onClick: () => handleFeatureClick('color')
          }} 
        />
      )}

      {personalityFeature && (
        <FeatureCard
          className={GRID_LAYOUT_CLASSES.personality}
          feature={{
            ...personalityFeature,
            onClick: () => handleFeatureClick('gender')
          }} 
        />
      )}

    </div>
  );
}; 