import { useClerk } from '@clerk/clerk-react';
import { useCallback } from 'react';

export const useAuth = () => {
  const { openSignIn, openSignUp } = useClerk();

  const handleShowAuth = useCallback((mode: 'signin' | 'signup') => {
    if (mode === 'signin') {
      openSignIn();
    } else {
      openSignUp();
    }
  }, [openSignIn, openSignUp]);

  const handleCloseAuth = useCallback(() => {
    // Clerk manages its own modal state, so this might not be needed
    // or could be handled differently depending on UI requirements.
  }, []);

  return {
    handleShowAuth,
    handleCloseAuth,
  };
}; 