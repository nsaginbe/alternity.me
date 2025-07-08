import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CreditCard, LogIn, UserPlus } from 'lucide-react';
import logo from '/src/assets/logo-transparent.png';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Hide FloatingNav on dashboard pages to avoid conflicts
  const isDashboardPage = location.pathname === '/dashboard';
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render FloatingNav on dashboard pages
  if (isDashboardPage) {
    return null;
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      name: 'Pricing',
      href: '/pricing',
      icon: <CreditCard className="w-4 h-4" />
    }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled ? 'py-3 px-4' : 'py-4 px-6'
    }`}>
      <div className={`mx-auto transition-all duration-500 ease-out ${
        isScrolled ? 'max-w-4xl' : 'max-w-7xl'
      }`}>
        <div className={`flex justify-between items-center transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-xl rounded-xl border border-white/20 py-2 px-6' 
            : 'bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg py-3 px-6'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src={logo}
              alt="Alternity Logo"
              className={`rounded-lg transition-all duration-500 ease-out object-contain group-hover:scale-105 ${
                isScrolled ? 'h-12 w-12' : 'h-16 w-16'
              }`}
            />
          </Link>

          {/* Center Navigation */}
          <nav className={`flex items-center justify-center flex-1 transition-all duration-500 ease-out ${
            isScrolled ? 'mx-6' : 'mx-8'
          }`}>
            <div className={`flex items-center bg-gray-50/50 rounded-xl p-1 transition-all duration-500 ease-out ${
              isScrolled ? 'space-x-1' : 'space-x-2'
            }`}>
              {navItems.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 ease-out px-4 py-2 rounded-lg font-medium ${
                      location.pathname === item.href 
                        ? 'bg-gradient-to-r from-crimson to-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 hover:shadow-sm'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2 font-semibold">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Auth Buttons */}
          <div className={`flex items-center flex-shrink-0 transition-all duration-500 ease-out ${
            isScrolled ? 'space-x-2' : 'space-x-3'
          }`}>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-all duration-300 ease-out px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/70 border border-transparent hover:border-gray-200 rounded-lg font-medium"
                    tabIndex={0}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Sign In</span>
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="transition-all duration-300 ease-out px-4 py-2 bg-gradient-to-r from-crimson to-red-600 hover:from-red-700 hover:to-red-700 text-white shadow-md hover:shadow-lg border border-transparent rounded-lg font-medium transform hover:scale-105"
                    tabIndex={0}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span>Sign Up</span>
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
} 