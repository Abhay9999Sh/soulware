"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [isGoogleTranslateReady, setIsGoogleTranslateReady] = useState(false);

  // This effect will wait for the Google Translate widget to be ready
  useEffect(() => {
    const checkGoogleTranslate = setInterval(() => {
      const googleTranslateSelect = document.querySelector('#google_translate_element select');
      if (googleTranslateSelect) {
        setIsGoogleTranslateReady(true);
        clearInterval(checkGoogleTranslate);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ur', name: 'Urdu' },
    // Add more languages as needed
  ];

  const handleLanguageChange = (langCode) => {
    const googleTranslateElement = document.querySelector('#google_translate_element select');
    if (googleTranslateElement) {
      googleTranslateElement.value = langCode;
      googleTranslateElement.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div>
      {/* This is the hidden Google Translate dropdown */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* Your custom buttons will only be active when the widget is ready */}
      <div className="flex items-center gap-2">
        <Globe size={20} className="text-gray-600 dark:text-gray-300" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            // Disable buttons until the Google script is loaded
            disabled={!isGoogleTranslateReady}
            className="px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}