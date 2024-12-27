'use client'

import { useAuthStore } from '@/hooks/store/auth.store'
import React from 'react'

export default function OnboardingPage() {
    const { user } = useAuthStore()
    console.log(user)
    return (
        <div>Onboarding Page</div>
    )
}
