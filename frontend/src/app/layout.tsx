import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Container from '@/components/Container';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Be MyForce",
    default: "Be MyForce",
  },
  description: "Be MyForce - Connect with like-minded individuals, find your perfect buddy partner, and build meaningful relationships. Join our community to discover people who share your interests and form lasting bonds with team members who match your passion.",
  keywords: ["social networking", "buddy finder", "team building", "community", "interests", "connections", "friendship", "partnerships"],
  authors: [{ name: 'Argha Chandra Das' }],
  creator: 'Be MyForce',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Be MyForce',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <>
            <Header />
            <main className="flex-grow pt-16">
              <Container>
                {children}
              </Container>
            </main>
            <Footer />
          </>
        </Providers>
      </body>
    </html>
  );
}
