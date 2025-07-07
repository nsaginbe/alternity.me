import { ReactNode } from 'react';
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

export interface GridLayoutProps {
  features: FeatureBlock[];
  onFeatureClick: (featureId: string) => void;
  onGetStarted: () => void;
}

export interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSubmit: (email: string, password: string, name?: string) => void;
  onToggleMode: () => void;
  isLoading: boolean;
}

export interface HeroSectionProps {
  onGetStarted: () => void;
}

export interface FeatureCardProps {
  feature: FeatureBlock;
  className?: string;
}

export type AuthMode = 'signin' | 'signup';

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
} 