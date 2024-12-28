import Image from 'next/image'
import React from 'react'
import loginPageImage from '@/assets/images/registerpage.png'
import ForgotPasswordForm from './_components/ForgotPasswordForm'
import Container from '@/components/Container'

export const metadata = {
    title: 'Forgot Password',
    description: 'Reset your BeMyForce password',
}

export default function ForgotPasswordPage() {
    return (
        <Container>
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-2/5">
                    <Image
                        src={loginPageImage}
                        alt="Forgot Password"
                        width={800}
                        height={800}
                        className="object-contain w-full"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex justify-center px-4 lg:px-8">
                    <div className="w-full max-w-sm">
                        <ForgotPasswordForm />
                    </div>
                </div>
            </div>
        </Container>
    )
}