'use client'

import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';


export default function Providers({ children }: { children: React.ReactNode }) {
  const { isLoading } = useCookieConsent();

  if (isLoading) {
    return null; // Or show loading state
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
      <CookieConsent />
      <Analytics />
    </GoogleOAuthProvider>
  )
}
