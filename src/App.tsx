import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComingSoon from './components/ComingSoon';
import ModernLanding from './components/ModernLanding';
import FloatingNav from './components/FloatingNav';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';

// Auth Context
const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string, name: string) => void;
  signOut: () => void;
}>({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {}
});

export const useAuth = () => React.useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const signIn = (email: string, password: string) => {
    // Mock authentication
    const mockUser = {
      name: email.split('@')[0],
      email: email
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const signUp = (email: string, password: string, name: string) => {
    // Mock registration
    const mockUser = {
      name: name,
      email: email
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  // Check for existing session on load
  React.useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppContent() {
  const { isAuthenticated, signIn, signUp, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (email: string, password: string, name?: string) => {
    if (authMode === 'signin') {
      signIn(email, password);
    } else {
      signUp(email, password, name || '');
    }
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen">
      <FloatingNav 
        isAuthenticated={isAuthenticated}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={signOut}
      />
      <Routes>
        <Route path="/" element={<ModernLanding onAuthRequired={handleSignUp} />} />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <ModernLanding onAuthRequired={handleSignUp} />
        } />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              const name = formData.get('name') as string;
              handleAuthSubmit(email, password, name);
            }}>
              {authMode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
                  placeholder="Password"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-crimson to-red-600 text-white rounded-lg hover:from-red-700 hover:to-red-700"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-crimson hover:text-red-700 text-sm"
              >
                {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;