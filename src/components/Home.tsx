import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <LanguageSwitcher />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t('home.welcome')}
        </h1>
        {/* Removed coming soon message and link */}
      </div>
    </div>
  );
}

export default Home; 