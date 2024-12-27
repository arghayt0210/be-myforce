'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

const MarketingBanner = () => {
    const { hasMarketing } = useCookieConsent();

    if (!hasMarketing) {
        return null;
    }

    return (
        <div className="marketing-banner">
            {/* Marketing content */}
        </div>
    );
};

export default MarketingBanner;