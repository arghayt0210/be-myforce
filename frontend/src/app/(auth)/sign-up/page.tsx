import Image from 'next/image'
import React from 'react'
import registerpageImage from '@/assets/images/registerpage.png'
import SignUpForm from './_components/SignUpForm'
import Container from '@/components/Container'

export const metadata = {
    title: 'Sign Up',
    description: 'Sign up to Be MyForce',
}

export default function SignUpPage() {
    return (
        <Container>
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-2/5">
                    <Image
                        src={registerpageImage}
                        alt="Sign up"
                        width={800}
                        height={800}
                        className="object-contain w-full"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Create your account</h1>
                            <p className="mt-2 text-gray-600">
                                Join us today and start your journey
                            </p>
                        </div>
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </Container>
    )
}
