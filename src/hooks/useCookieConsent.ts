import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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
      setCookieConsent(JSON.parse(savedConsent));
    }
    setIsLoading(false);
  }, []);

  const updateConsent = (settings: Partial<CookieSettings>) => {
    const newSettings = {
      ...cookieConsent,
      ...settings,
      necessary: true, // Always true
    };
    
    Cookies.set('cookie-settings', JSON.stringify(newSettings), { 
      expires: 365,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
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