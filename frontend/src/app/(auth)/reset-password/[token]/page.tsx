import Container from '@/components/Container'
import { Metadata } from 'next'
import React from 'react'
import ResetPasswordForm from './_components/ResetPasswordForm'

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password',
}

export default function ResetPasswordPage() {
    return (
        <Container>
            <ResetPasswordForm />
        </Container>
    )
}
