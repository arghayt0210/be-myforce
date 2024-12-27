'use client'

import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { ThemeProvider } from './ThemeProvider';
import ReactQueryProvider from './ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';


export default function Providers({ children }: { children: React.ReactNode }) {
  const { isLoading } = useCookieConsent();

  if (isLoading) {
    return null; // Or show loading state
  }

  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          onScriptLoadError={() => console.error('Google Script Load Error:')}
        >
          {children}
          <CookieConsent />
          <Analytics />
          <Toaster />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
