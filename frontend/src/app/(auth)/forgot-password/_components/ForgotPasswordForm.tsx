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
import Link from 'next/link'
import { forgotPasswordSchema, ForgotPasswordValues } from '@/schemas/auth.schema'
import { useForgotPasswordMutation } from '@/hooks/api/auth'



export default function ForgotPasswordForm() {
    const { toast } = useToast()

    const forgotPasswordMutation = useForgotPasswordMutation({
        onSuccess: () => {
            toast({
                title: "Check your email",
                description: "If an account exists with this email, you will receive a password reset link",
            })
        }
    })

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = (data: ForgotPasswordValues) => {
        forgotPasswordMutation.mutate(data)
    }

    return (
        <Card className="w-full max-w-md bg-white dark:bg-white border dark:border-gray-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-900">
                    Reset Password
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    {
                        forgotPasswordMutation.isError && (
                            <Alert variant={'destructive'} className="mb-6">
                                <AlertTitle className="text-red-600 dark:text-red-600">Error</AlertTitle>
                                <AlertDescription className="text-red-600 dark:text-red-600">
                                    {forgotPasswordMutation.error.response ? forgotPasswordMutation.error.response.data.message : 'Failed to send reset link'}
                                </AlertDescription>
                            </Alert>
                        )
                    }
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                            placeholder="Enter your email address"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-500" />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            variant="outline"
                            isLoading={forgotPasswordMutation.isPending}
                            loadingText="Sending..."
                            className="w-full h-11 text-base font-medium bg-primary text-white hover:bg-primary/90"
                        >
                            Send Reset Link
                        </LoadingButton>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="text-sm text-primary hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}