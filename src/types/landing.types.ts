import { LucideIcon } from 'lucide-react';

export interface FeatureBlock {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
  backgroundImage?: string;
}

export interface FeatureCardProps {
  feature: FeatureBlock;
  className?: string;
} 