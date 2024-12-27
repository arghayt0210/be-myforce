import Container from '@/components/Container'
import React from 'react'
import VerifyEmailForm from './_components/VerifyEmailForm'

export const metadata = {
    title: 'Verify Email',
    description: 'Verify your email',
}

export default function VerifyEmailPage() {
    return (
        <Container>
            <VerifyEmailForm />
        </Container>
    )
}
