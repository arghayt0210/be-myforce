'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuthStore } from '@/hooks/store/auth.store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useResendVerificationEmailMutation, useVerifyEmailMutation } from '@/hooks/api/verification'
import { LoadingButton } from '@/components/LoadingButton'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

// Create schema for OTP validation
const verifyEmailSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
})

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>

export default function VerifyEmailForm() {
    const { user, setAuth } = useAuthStore()
    const router = useRouter()
    const { toast } = useToast()

    const verifyEmailMutation = useVerifyEmailMutation({
        onSuccess: () => {
            toast({
                title: 'Email verified successfully',
                description: `We've verified your email. You can now proceed to onboarding.`,
            })
            setAuth({
                ...user,
                is_email_verified: true,
            })
            router.push('/onboarding')
        },
        onError: (error) => {
            console.error('Error verifying email:', error)
        },
    })

    const resendVerificationEmailMutation = useResendVerificationEmailMutation({
        onSuccess: () => {
            toast({
                title: 'Verification email resent successfully',
                description: `We've resent the verification code to your email.`,
            })
        },
        onError: (error) => {
            console.error('Error resending verification email:', error)
        },
    })

    const form = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            otp: '',
        },
    })

    const onSubmit = async (data: VerifyEmailFormValues) => {

        verifyEmailMutation.mutate({
            otp: data.otp,
            email: user?.email!,
        })
    }

    const handleResendEmail = async () => {
        resendVerificationEmailMutation.mutate({
            email: user?.email!,
        })
    }

    if (!user?.email) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Email not found. Please sign in again.</AlertDescription>
            </Alert>
        )
    }

    // Add watch to form initialization
    const otp = form.watch('otp')

    return (
        <div className="max-w-md w-full mx-auto space-y-8 p-6">
            <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
                <p className="text-muted-foreground text-sm">
                    We&apos;ve sent a verification code to{' '}
                    <span className="font-medium text-foreground">{user.email}</span>
                </p>
            </div>

            {verifyEmailMutation.error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{verifyEmailMutation.error.response ? verifyEmailMutation.error.response.data.message : 'Failed to verify email'}</AlertDescription>
                </Alert>
            )}

            {resendVerificationEmailMutation.error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{resendVerificationEmailMutation.error.response ? resendVerificationEmailMutation.error.response.data.message : 'Failed to resend verification email'}</AlertDescription>
                </Alert>
            )}


            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => form.setValue('otp', value)}
                            className="gap-2"
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={0}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />
                                <InputOTPSlot
                                    index={1}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />
                                <InputOTPSlot
                                    index={2}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />

                                <InputOTPSlot
                                    index={3}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />
                                <InputOTPSlot
                                    index={4}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />
                                <InputOTPSlot
                                    index={5}
                                    className="rounded-md border-input h-12 w-12 text-lg"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        {otp === "" && (
                            <>Please enter the 6-digit verification code</>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <LoadingButton
                        type="submit"
                        isLoading={verifyEmailMutation.isPending}
                        loadingText="Verifying..."
                        className="w-full h-11 text-base font-medium"
                    >
                        Verify Email
                    </LoadingButton>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or
                            </span>
                        </div>
                    </div>
                    <LoadingButton
                        type="button"
                        variant="outline"
                        isLoading={resendVerificationEmailMutation.isPending}
                        loadingText="Sending verification code..."
                        className="w-full h-11 text-base font-medium"
                        onClick={handleResendEmail}
                    >
                        Resend verification code
                    </LoadingButton>
                </div>
            </form>

        </div>
    )
}