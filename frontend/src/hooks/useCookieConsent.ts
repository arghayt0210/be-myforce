import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_OPTIONS } from '@/constants';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState<CookieSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing cookie consent when component mounts
    const savedConsent = Cookies.get('cookie-settings');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        // Validate that the parsed consent has the expected structure
        if (
          typeof parsedConsent === 'object' && 
          'necessary' in parsedConsent &&
          'analytics' in parsedConsent &&
          'marketing' in parsedConsent
        ) {
          setCookieConsent(parsedConsent);
        }
      } catch {
        // If JSON parsing fails, remove the invalid cookie
        Cookies.remove('cookie-settings');
      }
    }
    setIsLoading(false);
  }, []);

  const updateConsent = (settings: Partial<CookieSettings>) => {
    const newSettings = {
      ...cookieConsent,
      ...settings,
      necessary: true, // Always true
    };
    
    Cookies.set('cookie-settings', JSON.stringify(newSettings), COOKIE_OPTIONS);
    setCookieConsent(newSettings as CookieSettings);
  };

  const acceptAll = () => {
    const allSettings: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    
    Cookies.set('cookie-settings', JSON.stringify(allSettings), { 
      expires: 365,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === 'prod',
      sameSite: 'strict'
    });
    
    setCookieConsent(allSettings);
  };

  const declineAll = () => {
    const minimalSettings: CookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    
    Cookies.set('cookie-settings', JSON.stringify(minimalSettings), { 
      expires: 365,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === 'prod',
      sameSite: 'strict'
    });
    
    setCookieConsent(minimalSettings);
  };

  return {
    cookieConsent,
    isLoading,
    updateConsent,
    acceptAll,
    declineAll,
    hasAnalytics: cookieConsent?.analytics || false,
    hasMarketing: cookieConsent?.marketing || false,
  };
};