import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Linkedin, ArrowRight, Sparkles, Globe } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

// Custom TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Proper Threads icon component (official Threads logo from Figma)
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="20" fill="currentColor"/>
    <path d="M20 12c4.418 0 8 2.686 8 6 0 2.5-2.5 4-5 4-2.5 0-5-1.5-5-4 0-1.657 1.791-3 4-3 2.209 0 4 1.343 4 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 28c-4.418 0-8-2.686-8-6 0-2.5 2.5-4 5-4 2.5 0 5 1.5 5 4 0 1.657-1.791 3-4 3-2.209 0-4-1.343-4-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(Math.floor(Math.random() * 30) + 60); // Start between 60-90%
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // More active dynamic progress bar
  useEffect(() => {
    const updateProgress = () => {
      setProgress(prev => {
        // More frequent and larger changes for active development feel
        const change = (Math.random() - 0.3) * 15; // Bias towards positive growth, larger changes
        const newProgress = Math.max(45, Math.min(95, prev + change)); // Keep between 45-95%
        return Math.floor(newProgress);
      });
    };

    // Much more frequent updates for active feel
    const interval = setInterval(updateProgress, 800 + Math.random() * 1200); // Every 0.8-2 seconds
    return () => clearInterval(interval);
  }, []);

  // Particle system
  useEffect(() => {
    const createParticle = (x: number, y: number): Particle => ({
      id: particleIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.3,
      size: Math.random() * 3 + 1,
    });

    const updateParticles = () => {
      setParticles(prev => {
        // Add new particles near mouse
        const newParticles = [...prev];
        if (Math.random() < 0.1 && newParticles.length < 50) {
          newParticles.push(createParticle(
            mousePosition.x + (Math.random() - 0.5) * 100,
            mousePosition.y + (Math.random() - 0.5) * 100
          ));
        }

        // Update existing particles
        return newParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            opacity: particle.opacity - 0.005,
          }))
          .filter(particle => particle.opacity > 0);
      });
    };

    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [mousePosition]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-100 relative overflow-hidden"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.08)_1px,transparent_1px)] bg-[size:100px_100px] [background-position:0_0,0_0]"></div>
      </div>

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none bg-red-300 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Mouse glow effect */}
      <div
        className="fixed pointer-events-none w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-red-200 via-gray-200 to-white transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Logo at top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center items-center">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="h-10 md:h-14 w-auto object-contain select-none pointer-events-none drop-shadow-lg rounded-xl"
          style={{ maxHeight: '3.5rem' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-800 via-red-700 to-red-600 bg-clip-text text-transparent leading-tight pb-4">
            <span className="inline-flex items-center">
              Coming Soon <Sparkles className="ml-4 w-12 h-12 text-red-500 animate-pulse" />
            </span>
          </h1>

          {/* Subtitle */}
          <div className="mb-12 pb-4">
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your face holds more than identity. We're here to uncover your alternities.
              <span className="text-red-600 font-semibold"> Stay tuned.</span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Development Progress</span>
              <span className="font-semibold text-red-600">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Email signup */}
          <div className="mb-12">
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-red-200/50 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 shadow-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
                >
                  {isSubmitted ? (
                    'Subscribed! ✨'
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Social links */}
          <div className="flex justify-center space-x-6">
            {[
              { icon: Instagram, href: 'https://instagram.com/alternity.me', label: 'Instagram' },
              { icon: TikTokIcon, href: 'https://tiktok.com/@alternity.me', label: 'TikTok' },
              { icon: Linkedin, href: 'https://linkedin.com/in/nsaginbe', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="group p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-red-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm"
                aria-label={label}
              >
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-gray-500 text-sm">
          <p>© 2025 Alternity. Crafted with passion and innovation.</p>
        </div>
      </div>

      {/* Animated shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-red-300/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-32 right-20 w-48 h-48 bg-gray-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-red-200/20 rounded-full blur-xl animate-ping"></div>
    </div>
  );
}

export default App;