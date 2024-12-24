'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useEffect } from 'react';

const Analytics = () => {
    const { hasAnalytics, isLoading } = useCookieConsent();

    useEffect(() => {
        if (!isLoading && hasAnalytics) {
            // Initialize analytics (Google Analytics, etc.)
            // Only runs if user has consented to analytics cookies
        }
    }, [hasAnalytics, isLoading]);

    return null;
};

export default Analytics;