import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Heart, Star, Sparkles, Camera, Zap, Palette, User, Brain } from 'lucide-react';
import SocialLinks from './SocialLinks';

// Импортируем наши новые компоненты
import { GridSection, AuthModal } from './landing';

// Импортируем хуки и константы
import { useAuth } from '../hooks/useAuth';
import { useScrollEffect } from '../hooks/useScrollEffect';
import { FEATURE_BLOCKS, HERO_STATS } from '../constants/features';

interface FeatureCard {
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
}

interface ModernLandingProps {
  onAuthRequired?: () => void;
}

function ModernLanding({ onAuthRequired }: ModernLandingProps) {
  const navigate = useNavigate();
  // Используем наши новые хуки
  const isScrolled = useScrollEffect(50);
  const {
    showAuth,
    isLoading,
    handleShowAuth,
    handleCloseAuth,
    handleToggleAuthMode,
    handleAuth
  } = useAuth();

  // Map feature IDs to dashboard sections
  const featureToSectionMap: Record<string, string> = {
    'celebrity': 'celebrity',
    'spirit-animal': 'animal',
    'color': 'color',
    'personality': 'gender', // Map personality to gender analysis
    'ai-tech': 'analytics'
  };

  // Обработчики для блоков
  const handleFeatureClick = (featureId: string) => {
    console.log(`Feature clicked: ${featureId}`);
    
    // If user needs auth, trigger auth modal
    if (onAuthRequired) {
      onAuthRequired();
      return;
    }

    // Map feature to dashboard section and navigate
    const dashboardSection = featureToSectionMap[featureId];
    if (dashboardSection) {
      navigate(`/dashboard?section=${dashboardSection}`);
    } else {
      // Fallback to auth for unmapped features
      handleShowAuth('signup');
    }
  };

  const handleGetStarted = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      navigate('/dashboard');
    }
  };

  // Update feature card click handlers
  const handleFeatureCardClick = (featureTitle: string) => {
    if (onAuthRequired) {
      onAuthRequired();
      return;
    }

    // Map feature card titles to dashboard sections
    switch (featureTitle) {
      case 'CELEBRITY':
        navigate('/dashboard?section=celebrity');
        break;
      case 'SPIRIT ANIMAL':
        navigate('/dashboard?section=animal');
        break;
      case 'COLOR & MORE':
        navigate('/dashboard?section=color');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const features: FeatureCard[] = [
    {
      title: "CELEBRITY",
      description: "Find your celebrity doppelganger",
      price: "FREE",
      icon: <Star className="w-8 h-8" />,
      gradient: "from-orange-400 to-pink-500",
      textColor: "text-white"
    },
    {
      title: "SPIRIT ANIMAL",
      description: "Discover your core animal match",
      price: "FREE",
      icon: <Sparkles className="w-8 h-8" />,
      gradient: "from-green-400 to-blue-500",
      textColor: "text-white"
    },
    {
      title: "COLOR & MORE",
      description: "Core color, gender analysis & more",
      price: "FREE",
      icon: <Camera className="w-8 h-8" />,
      gradient: "from-purple-400 to-pink-500",
      textColor: "text-white"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "98%", label: "Accuracy" },
    { number: "50K+", label: "Matches Made" }
  ];

  return (
    <>
      <style>
        {`
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear,
          input[type="password"]::-webkit-credentials-auto-fill-button {
            display: none !important;
          }
        `}
      </style>
      <div className="min-h-screen bg-[#f4f5f0]">
        {/* Hero Section */}
        <section id="hero" className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GridSection 
              features={FEATURE_BLOCKS}
              onFeatureClick={handleFeatureClick}
              onGetStarted={handleGetStarted}
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#f4f5f0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Top Picks */}
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-8">
                  TOP-3
                  <br />
                  PICKS
                </h2>
                
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleFeatureCardClick(feature.title)}
                      className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{feature.price}</span>
                        <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors group-hover:scale-105 transform duration-200">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white">
                <h3 className="text-3xl font-black mb-6">TRUSTED BY THOUSANDS</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-purple-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/20 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6" />
                    <span className="font-semibold">Join the community</span>
                  </div>
                  <p className="text-purple-100 text-sm mb-4">
                    Connect with others who found their amazing matches
                  </p>
                  <button 
                    onClick={() => onAuthRequired ? onAuthRequired() : handleShowAuth('signup')}
                    className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    GET STARTED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-[#f4f5f0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-16">
              HOW IT WORKS
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. UPLOAD PHOTO</h3>
                <p className="text-gray-600">Take a selfie or upload your best photo</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. AI ANALYSIS</h3>
                <p className="text-gray-600">Our AI analyzes your facial features</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. GET RESULTS</h3>
                <p className="text-gray-600">Discover your matches across multiple categories</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-crimson to-red-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              READY TO FIND
              <br />
              YOUR MATCHES?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Join thousands of users who discovered their celebrity twins, spirit animals, and more
            </p>
            <button 
              onClick={() => onAuthRequired ? onAuthRequired() : handleShowAuth('signup')}
              className="inline-flex items-center px-8 py-4 bg-white text-crimson font-bold rounded-full text-lg hover:shadow-xl transition-shadow duration-200"
            >
              START NOW - IT'S FREE
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <span className="text-xl font-bold">Alternity</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex space-x-6">
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="text-gray-400 hover:text-white transition-colors"
                    tabIndex={0}
                    aria-label="Privacy Policy"
                  >
                    Privacy
                  </button>
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="text-gray-400 hover:text-white transition-colors"
                    tabIndex={0}
                    aria-label="Terms of Service"
                  >
                    Terms
                  </button>
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="text-gray-400 hover:text-white transition-colors"
                    tabIndex={0}
                    aria-label="Support"
                  >
                    Support
                  </button>
                </div>
                
                <SocialLinks className="mb-4 md:mb-0" />
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Alternity. Find your celebrity twin with AI.</p>
            </div>
          </div>
        </footer>

        {/* Authentication Modal */}
        <AuthModal
          isOpen={showAuth !== null}
          mode={showAuth || 'signin'}
          onClose={handleCloseAuth}
          onSubmit={handleAuth}
          onToggleMode={handleToggleAuthMode}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

export default ModernLanding;
