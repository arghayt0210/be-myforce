import Cookies from 'js-cookie';

export const CookieUtil = {
  // Set a cookie
  set: (name: string, value: string, options = {}) => {
    Cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },

  // Get a cookie
  get: (name: string) => {
    return Cookies.get(name);
  },

  // Remove a cookie
  remove: (name: string) => {
    Cookies.remove(name);
  },

  // Check if user has consented to cookies
  hasConsented: () => {
    return Cookies.get('cookie-consent') === 'true';
  },

  // Set cookie consent
  setConsent: (value: boolean) => {
    Cookies.set('cookie-consent', value.toString(), { 
      expires: 365,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },
};