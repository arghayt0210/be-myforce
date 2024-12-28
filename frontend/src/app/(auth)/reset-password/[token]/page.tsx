import Image from 'next/image'
import forgotPasswordImage from '@/assets/images/forgot-password.svg'
import Container from '@/components/Container'
import { Metadata } from 'next'
import React from 'react'
import ResetPasswordForm from './_components/ResetPasswordForm'

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password',
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ResetPasswordPage({ params, searchParams }: { params: { token: string }, searchParams: SearchParams }) {
    const { token } = await params
    const { email } = await searchParams

    return (
        <Container>
            <div className="flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-2/5 items-center">
                    <Image
                        src={forgotPasswordImage}
                        alt="Reset Password"
                        width={800}
                        height={800}
                        className="object-contain w-full"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex justify-center px-4 lg:px-8">
                    <div className="w-full max-w-sm">
                        <ResetPasswordForm token={token} email={email as string} />
                    </div>
                </div>
            </div>
        </Container>
    )
}