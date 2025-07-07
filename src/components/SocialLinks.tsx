import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';

// Custom TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialLinksProps {
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ className = "" }) => {
  const socialLinks = [
    { 
      icon: Instagram, 
      href: 'https://instagram.com/alternity.me', 
      label: 'Instagram',
      hoverColor: 'hover:text-pink-600'
    },
    { 
      icon: TikTokIcon, 
      href: 'https://tiktok.com/@alternity.me', 
      label: 'TikTok',
      hoverColor: 'hover:text-black'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/nsaginbe', 
      label: 'LinkedIn',
      hoverColor: 'hover:text-blue-600'
    },
  ];

  const handleSocialClick = (href: string, label: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleSocialKeyDown = (event: React.KeyboardEvent, href: string, label: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSocialClick(href, label);
    }
  };

  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
        <button
          key={label}
          onClick={() => handleSocialClick(href, label)}
          onKeyDown={(e) => handleSocialKeyDown(e, href, label)}
          className={`group p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm ${hoverColor}`}
          aria-label={`Visit our ${label} page`}
          tabIndex={0}
        >
          <Icon className={`w-6 h-6 text-gray-600 group-hover:text-current transition-colors duration-300`} />
        </button>
      ))}
    </div>
  );
};

export default SocialLinks; 