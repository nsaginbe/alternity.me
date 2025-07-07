import { Star, Sparkles, Palette, User, Brain, Camera } from 'lucide-react';
import { FeatureBlock } from '../types/landing.types';

export const FEATURE_BLOCKS: FeatureBlock[] = [
  {
    id: 'celebrity',
    title: 'CELEBRITY',
    description: 'Find your twin',
    icon: Star,
    gradient: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-100',
    size: 'small'
  },
  {
    id: 'spirit-animal',
    title: 'SPIRIT ANIMAL',
    description: 'Discover your core',
    icon: Sparkles,
    gradient: 'from-green-400 to-emerald-600',
    textColor: 'text-green-100',
    size: 'medium'
  },
  {
    id: 'color',
    title: 'COLOR',
    description: 'Your signature',
    icon: Palette,
    gradient: 'from-rose-400 to-pink-600',
    textColor: 'text-pink-100',
    size: 'small'
  },
  {
    id: 'personality',
    title: 'PERSONALITY',
    description: 'Your vibe type',
    icon: User,
    gradient: 'from-indigo-400 to-purple-600',
    textColor: 'text-indigo-100',
    size: 'medium'
  },
  {
    id: 'ai-tech',
    title: 'AI TECH',
    description: 'Advanced machine learning',
    icon: Brain,
    gradient: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-100',
    size: 'large'
  }
];

export const HERO_STATS = {
  rating: 4.9,
  year: 2024,
  users: '10K+',
  accuracy: '98%',
  matches: '50K+'
};

export const GRID_LAYOUT_CLASSES = {
  container: 'grid grid-cols-12 gap-4 h-screen max-h-[800px]',
  hero: 'col-span-12 lg:col-span-7 row-span-2',
  aiTech: 'col-span-12 lg:col-span-5 row-span-1',
  celebrity: 'col-span-6 lg:col-span-2 row-span-1',
  spiritAnimal: 'col-span-6 lg:col-span-3 row-span-1',
  color: 'col-span-6 lg:col-span-2 row-span-1',
  personality: 'col-span-6 lg:col-span-3 row-span-1',
  getStarted: 'col-span-12 lg:col-span-5 row-span-1'
};

export const ANIMATION_CLASSES = {
  hover: 'group hover:scale-[1.02] transition-transform duration-300 cursor-pointer',
  card: 'rounded-3xl h-full relative overflow-hidden',
  iconContainer: 'w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3',
  button: 'bg-white/20 rounded-full px-4 py-2'
}; 