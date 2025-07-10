import { Star, Sparkles, Palette, User} from 'lucide-react';
import { FeatureBlock } from '../types/landing.types';

export const FEATURE_BLOCKS: FeatureBlock[] = [
  {
    id: 'celebrity',
    title: 'CELEBRITY',
    description: 'Find your twin',
    icon: Star,
    gradient: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-100',
    size: 'large'
  },
  {
    id: 'animal',
    title: 'SPIRIT ANIMAL',
    description: 'Discover your core animal',
    icon: Sparkles,
    gradient: 'from-green-400 to-emerald-600',
    textColor: 'text-green-100',
    size: 'medium'
  },
  {
    id: 'color',
    title: 'COLOR',
    description: 'Your color vibe',
    icon: Palette,
    gradient: 'from-rose-400 to-pink-600',
    textColor: 'text-pink-100',
    size: 'small'
  },
  {
    id: 'gender',
    title: 'GENDER',
    description: 'Gender analysis',
    icon: User,
    gradient: 'from-indigo-400 to-purple-600',
    textColor: 'text-indigo-100',
    size: 'medium'
  },
];

export const HERO_STATS = {
  rating: 4.9,
  year: 2024,
  users: '10K+',
  accuracy: '98%',
  matches: '50K+'
};

export const GRID_LAYOUT_CLASSES = {
  container: 'grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4',
  celebrity: 'md:col-span-2 md:row-span-2',
  spiritAnimal: 'md:col-span-1',
  personality: 'md:col-span-3',
  color: 'md:col-span-1',
};

export const ANIMATION_CLASSES = {
  hover: 'group transition-transform duration-300 cursor-pointer',
  card: 'rounded-3xl h-full relative overflow-hidden',
  iconContainer: 'w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3',
  button: 'bg-white/20 rounded-full px-4 py-2'
}; 