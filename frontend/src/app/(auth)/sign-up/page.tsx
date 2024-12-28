import Image from 'next/image'
import React from 'react'
import fillForm from '@/assets/images/fill-form.svg'
import SignUpForm from './_components/SignUpForm'
import Container from '@/components/Container'

export const metadata = {
    title: 'Sign Up',
    description: 'Sign up to Be MyForce',
}

export default function SignUpPage() {
    return (
        <Container>
            <div className="flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-2/5 items-center">
                    <Image
                        src={fillForm}
                        alt="Sign up"
                        width={800}
                        height={800}
                        className="object-contain w-full"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex justify-center px-4 lg:px-8">
                    <div className="w-full max-w-sm">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </Container>
    )
}
