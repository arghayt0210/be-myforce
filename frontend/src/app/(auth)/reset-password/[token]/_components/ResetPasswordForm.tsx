'use client'

import React from 'react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/LoadingButton'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, ResetPasswordValues } from '@/schemas/auth.schema'
import { useResetPasswordMutation } from '@/hooks/api/auth'

interface ResetPasswordFormProps {
    token: string
    email: string
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
    const { toast } = useToast()
    const router = useRouter()

    const resetPasswordMutation = useResetPasswordMutation({
        onSuccess: () => {
            toast({
                title: "Password Reset Successful",
                description: "Your password has been reset successfully. Please login with your new password.",
            })
            router.push('/login')
        }
    })

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email,
            token,
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = (data: ResetPasswordValues) => {
        resetPasswordMutation.mutate(data)
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-white border dark:border-gray-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-900">
                    Reset Your Password
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    {resetPasswordMutation.isError && (
                        <Alert variant={'destructive'} className="mb-6">
                            <AlertTitle className="text-red-600 dark:text-red-600">Error</AlertTitle>
                            <AlertDescription className="text-red-600 dark:text-red-600">
                                {resetPasswordMutation.error.response ? resetPasswordMutation.error.response.data.message : 'Failed to reset password'}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-700">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                            placeholder="Enter your new password"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                            placeholder="Confirm your new password"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-500" />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            variant="outline"
                            isLoading={resetPasswordMutation.isPending}
                            loadingText="Resetting..."
                            className="w-full h-11 text-base font-medium bg-primary text-white hover:bg-primary/90"
                        >
                            Reset Password
                        </LoadingButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}