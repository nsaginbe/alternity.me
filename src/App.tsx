import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import ComingSoon from './components/ComingSoon';
import ModernLanding from './components/ModernLanding';
import FloatingNav from './components/FloatingNav';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import React from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function AppContent() {
  return (
    <div className="min-h-screen">
       <FloatingNav />
      <main>
        <Routes>
          <Route path="/" element={<ModernLanding />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
        </Routes>
      </main>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;