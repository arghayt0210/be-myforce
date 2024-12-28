import Image from 'next/image'
import React from 'react'
import fillForm from '@/assets/images/fill-form.svg'
import LoginForm from './_components/LoginForm'
import Container from '@/components/Container'

export const metadata = {
    title: 'Login',
    description: 'Login to Be MyForce',
}

export default function LoginPage() {
    return (
        <Container>
            <div className="flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-2/5 items-center">
                    <Image
                        src={fillForm}
                        alt="Login"
                        width={800}
                        height={800}
                        className="object-contain w-full"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex justify-center px-4 lg:px-8">
                    <div className="w-full max-w-sm">

                        <LoginForm />
                    </div>
                </div>
            </div>
        </Container>
    )
}