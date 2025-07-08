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
} 