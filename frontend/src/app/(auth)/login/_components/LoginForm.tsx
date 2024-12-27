'use client'

import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import api from '@/lib/api';
// import { useRouter } from 'next/navigation';

export default function LoginForm() {
    // const router = useRouter();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (!credentialResponse.credential) {
                console.error('No credential received');
                return;
            }
            // const response = await fetch(`/api/auth/google`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         credential: credentialResponse.credential
            //     }),
            //     credentials: 'include',
            // });
            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential
            });


            // const data = await response.json();
            console.log('data: ', response);

            // if (data.success) {
            //     // Redirect to dashboard or handle successful login
            //     // router.push('/onboarding');
            // } else {
            //     console.log('Google login error:', data.message);
            // }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.error('Login Failed');
                }}
                useOneTap={false}
                theme="filled_blue"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
                context="signin"
                // Add these props to help with popup issues
                type="standard"
                ux_mode="popup"
            />
        </div>
    )
}
