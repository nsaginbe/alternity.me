import React, { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import { staticCelebrityService } from '../services/staticCelebrities';

interface CelebrityImageProps {
  name: string;
  similarity: number;
  index: number;
  size?: number; // Add size prop
  className?: string;
}

export const CelebrityImage: React.FC<CelebrityImageProps> = ({ 
  name, 
  similarity, 
  index, 
  size = 48, // Default size
  className = '' 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCelebrityPhoto = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const photo = await tmdbService.getCelebrityPhoto(name);
        setImageUrl(photo);
      } catch (error) {
        console.error('Error fetching celebrity photo:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrityPhoto();
  }, [name]);

  const getColorClass = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-200 animate-pulse ${className}`}>
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (imageUrl && !hasError) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback to colored block with initials
  return (
    <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center ${getColorClass(index)} ${className}`}>
      <span className="text-6xl font-bold text-white">
        {getInitials(name)}
      </span>
    </div>
  );
};

// Alternative component using Unsplash as fallback
export const CelebrityImageWithUnsplash: React.FC<CelebrityImageProps> = ({ 
  name, 
  similarity, 
  index, 
  size = 48, // Default size
  className = '' 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCelebrityPhoto = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Try TMDb first
        let photo = await tmdbService.getCelebrityPhoto(name);
        
        // If TMDb doesn't have the photo, try Unsplash as fallback
        if (!photo) {
          const unsplashQuery = encodeURIComponent(name + ' celebrity');
          photo = `https://source.unsplash.com/400x400/?${unsplashQuery}`;
        }
        
        setImageUrl(photo);
      } catch (error) {
        console.error('Error fetching celebrity photo:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrityPhoto();
  }, [name]);

  const getColorClass = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-200 animate-pulse ${className}`}>
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (imageUrl && !hasError) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback to colored block with initials
  return (
    <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center ${getColorClass(index)} ${className}`}>
      <span className="text-6xl font-bold text-white">
        {getInitials(name)}
      </span>
    </div>
  );
};

// Multi-source celebrity image component (tries TMDb -> Static -> Unsplash)
export const CelebrityImageMultiSource: React.FC<CelebrityImageProps> = ({ 
  name, 
  similarity, 
  index, 
  size = 48, // Default size
  className = '' 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState<string>('');

  useEffect(() => {
    const fetchCelebrityPhoto = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        let photo: string | null = null;

        // Try 1: TMDb API
        setCurrentSource('TMDb');
        photo = await tmdbService.getCelebrityPhoto(name);
        
        // Try 2: Static celebrities service
        if (!photo) {
          setCurrentSource('Static');
          photo = staticCelebrityService.getCelebrityPhoto(name);
        }
        
        // Try 3: Unsplash API as a final fallback
        if (!photo) {
          setCurrentSource('Unsplash');
          const unsplashQuery = encodeURIComponent(name);
          photo = `https://source.unsplash.com/400x400/?${unsplashQuery},face,portrait`;
        }
        
        setImageUrl(photo);
        console.log(`✅ Celebrity photo loaded from ${currentSource}:`, name);
      } catch (error) {
        console.error('Error fetching celebrity photo:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrityPhoto();
  }, [name]);

  const getColorClass = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-200 animate-pulse ${className}`}>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (imageUrl && !hasError) {
    return (
      <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 overflow-hidden shadow-lg ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback to colored block with initials
  return (
    <div className={`w-${size} h-${size} rounded-2xl mx-auto mb-4 flex items-center justify-center ${getColorClass(index)} ${className}`}>
      <span className="text-6xl font-bold text-white">
        {getInitials(name)}
      </span>
    </div>
  );
}; 