"use client";

import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const [isGoogleTranslateReady, setIsGoogleTranslateReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const dropdownRef = useRef(null);

  // This effect will wait for the Google Translate widget to be ready
  useEffect(() => {
    const checkGoogleTranslate = setInterval(() => {
      const googleTranslateSelect = document.querySelector('#google_translate_element select');
      if (googleTranslateSelect && googleTranslateSelect.options.length > 1) {
        console.log('Google Translate is ready with', googleTranslateSelect.options.length, 'options');
        setIsGoogleTranslateReady(true);
        clearInterval(checkGoogleTranslate);
      }
    }, 100); // Check every 100ms

    // Also try to initialize if not already done
    const initializeGoogleTranslate = () => {
      if (typeof window !== 'undefined' && window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        } catch (error) {
          console.log('Google Translate already initialized or error:', error);
        }
      }
    };

    // Try to initialize after a short delay
    setTimeout(initializeGoogleTranslate, 1000);

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to force reset to English
  const forceResetToEnglish = () => {
    console.log('Force resetting to English...');
    
    // Clear all Google Translate cookies
    const cookies = ['googtrans', 'googtrans=/auto/en', 'googtrans=/en/en'];
    cookies.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Remove any translation classes from body
    document.body.classList.remove('translated-ltr', 'translated-rtl');
    
    // Force reload the page
    window.location.reload();
  };

  // Indian languages supported by Google Translate
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', forceReset: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
    // Additional commonly requested languages
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' }
  ];

  const handleLanguageChange = (langCode, langName) => {
    const googleTranslateElement = document.querySelector('#google_translate_element select');
    if (googleTranslateElement) {
      console.log('Changing language to:', langCode, langName);
      
      if (langCode === 'en') {
        // For English, use the force reset method
        setSelectedLanguage(langName);
        setIsDropdownOpen(false);
        
        // Try gentle reset first
        googleTranslateElement.value = '';
        googleTranslateElement.dispatchEvent(new Event('change'));
        
        // If still translated after 500ms, force reload
        setTimeout(() => {
          const isStillTranslated = document.querySelector('font[style*="vertical-align"]') || 
                                   document.querySelector('.goog-te-banner-frame') ||
                                   document.body.classList.contains('translated-ltr') ||
                                   document.body.classList.contains('translated-rtl') ||
                                   document.documentElement.lang !== 'en';
          
          if (isStillTranslated) {
            console.log('Gentle reset failed, using force reset...');
            forceResetToEnglish();
          }
        }, 500);
      } else {
        // For other languages, find the correct option
        const options = Array.from(googleTranslateElement.options);
        console.log('Available options:', options.map(opt => `${opt.value} - ${opt.text}`));
        
        // Look for the language code in the option values
        const targetOption = options.find(option => 
          option.value.endsWith(`|${langCode}`) || 
          option.value === langCode ||
          option.value === `en|${langCode}` ||
          option.text.toLowerCase().includes(langName.toLowerCase())
        );
        
        if (targetOption) {
          console.log('Found target option:', targetOption.value, targetOption.text);
          googleTranslateElement.value = targetOption.value;
          googleTranslateElement.dispatchEvent(new Event('change'));
        } else {
          console.warn('Language not found in Google Translate options:', langCode);
          // Try with the standard format
          const standardValue = `en|${langCode}`;
          googleTranslateElement.value = standardValue;
          googleTranslateElement.dispatchEvent(new Event('change'));
        }
      }
      
      setSelectedLanguage(langName);
      setIsDropdownOpen(false);
    } else {
      console.warn('Google Translate element not found');
    }
  };

  return (
    <div className="relative notranslate" ref={dropdownRef} translate="no">
      {/* This is the hidden Google Translate dropdown */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* Custom Dropdown Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={!isGoogleTranslateReady}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 notranslate"
        aria-label="Select language"
      >
        <Globe size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="hidden sm:inline notranslate">{selectedLanguage}</span>
        <ChevronDown 
          size={14} 
          className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto notranslate"
            translate="no"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code, lang.name)}
                  disabled={!isGoogleTranslateReady}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed notranslate ${
                    selectedLanguage === lang.name 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-200'
                  } ${lang.code === 'en' ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="notranslate">{lang.name}</span>
                      
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 notranslate">
                      {lang.nativeName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}