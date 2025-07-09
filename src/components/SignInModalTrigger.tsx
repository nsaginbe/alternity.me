import { useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInModalTrigger = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); 
    openSignIn({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    });
  }, [openSignIn, navigate]);

  return null;
};

export default SignInModalTrigger; 