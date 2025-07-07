import { useState, useCallback } from 'react';
import { AuthMode, AuthFormData } from '../types/landing.types';

export const useAuth = () => {
  const [showAuth, setShowAuth] = useState<AuthMode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowAuth = useCallback((mode: AuthMode) => {
    setShowAuth(mode);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setShowAuth(null);
  }, []);

  const handleToggleAuthMode = useCallback(() => {
    setShowAuth(prev => prev === 'signin' ? 'signup' : 'signin');
  }, []);

  const handleAuth = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // После успешной аутентификации перенаправляем в приложение
      window.location.href = '/app';
      
    } catch (error) {
      console.error('Auth error:', error);
      // Здесь можно добавить обработку ошибок
    } finally {
      setIsLoading(false);
      setShowAuth(null);
    }
  }, []);

  return {
    showAuth,
    isLoading,
    handleShowAuth,
    handleCloseAuth,
    handleToggleAuthMode,
    handleAuth
  };
}; 