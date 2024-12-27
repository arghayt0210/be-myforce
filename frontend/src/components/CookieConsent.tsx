'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

const CookieConsent = () => {
    const {
        cookieConsent,
        isLoading,
        acceptAll,
        declineAll,
    } = useCookieConsent();

    // Don't show if loading or if consent is already set
    if (isLoading || cookieConsent !== null) return null;

    // Add check for cookie existence directly
    const cookieExists = document.cookie.includes('cookie-settings');
    if (cookieExists) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between flex-wrap">
                    <p className="text-sm text-gray-700">
                        We use cookies to enhance your experience.
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={declineAll}
                            className="px-4 py-2 border rounded text-black"
                        >
                            Decline All
                        </button>
                        <button
                            onClick={acceptAll}
                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;