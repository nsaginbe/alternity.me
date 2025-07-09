import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CreditCard, LogIn, UserPlus } from 'lucide-react';
import logo from '/src/assets/logo-only-transparent.png';
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
        isScrolled ? 'max-w-3xl' : 'max-w-6xl'
      }`}>
        <div className={`flex justify-between items-center transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-xl rounded-xl border border-white/20 py-2 px-6' 
            : 'bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg py-3 px-6'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <img
              src={logo}
              alt="Alternity Logo"
              className={`transition-all duration-500 ease-out object-contain group-hover:scale-105 ${
                isScrolled ? 'h-7 w-7' : 'h-7 w-7'
              }`}
            />
            <span className="font-medium text-gray-800 text-lg">
              alternity
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className={`flex items-center justify-center flex-1 transition-all duration-500 ease-out ${
            isScrolled ? 'mx-6' : 'mx-8'
          }`}>
            <div className={`flex items-center transition-all duration-500 ease-out ${
              isScrolled ? 'space-x-1' : 'space-x-2'
            }`}>
              {navItems.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 ease-out px-4 py-2 rounded-lg font-semibold border ${
                      location.pathname === item.href 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'text-gray-600 border-transparent hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
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
              <div className="transform scale-120">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-all duration-300 ease-out px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg font-semibold"
                    tabIndex={0}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Sign In</span>
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="transition-all duration-300 ease-out px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shadow-md hover:shadow-lg rounded-lg font-semibold"
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