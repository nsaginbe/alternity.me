import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'en' },
  { code: 'ru', label: 'ru' },
  { code: 'kz', label: 'kz' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-all min-w-[44px] text-sm font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm text-black">{currentLang.label}</span>
        <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" />
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-16 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 transition-all animate-fade-in" role="listbox">
          {LANGUAGES.map(lang => (
            <li key={lang.code}>
              <button
                className={`block w-full text-left px-3 py-1 text-sm rounded-md transition-all hover:bg-gray-100 ${current === lang.code ? 'text-red-600 bg-gray-50' : 'text-gray-700'}`}
                onClick={() => changeLanguage(lang.code)}
                role="option"
                aria-selected={current === lang.code}
                disabled={current === lang.code}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.15s ease; }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher; 