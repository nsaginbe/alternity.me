import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import ModernLanding from './components/ModernLanding';
import FloatingNav from './components/FloatingNav';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import SignInModalTrigger from './components/SignInModalTrigger';
import './i18n';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function AppContent() {

  const { t, i18n } = useTranslation();
  console.log(t("greeting.hello", { name: "John" }));

  useEffect(() => {
    document.body.classList.remove('font-fredoka', 'font-nunito');
    if (i18n.language === 'en') {
      document.body.classList.add('font-fredoka');
    } else {
      document.body.classList.add('font-nunito');
    }
  }, [i18n.language]);


  return (
    <div className="min-h-screen">
       <FloatingNav />
      <main>
        <Routes>
          <Route path="/" element={<ModernLanding />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <SignInModalTrigger />
                </SignedOut>
              </>
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