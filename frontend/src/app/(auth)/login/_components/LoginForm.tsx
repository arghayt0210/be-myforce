'use client'

import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/store/auth.store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { LoginFormValues, loginSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLoginWithCredentialsMutation, useLoginWithGoogleMutation } from '@/hooks/api/auth';
import { LoadingButton } from '@/components/LoadingButton';
import { GoogleLogin } from '@react-oauth/google';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface User {
    _id: string;
    full_name: string;
    username: string;
    email: string;
    password: string;
    is_onboarded: boolean;
    user_type: 'user' | 'admin';
    interests: string[];
    is_email_verified: boolean;
    profile_image: string;
    profile_image_asset: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    last_login: string;
}
export interface GoogleUser {
    _id: string;
    full_name: string;
    username: string;
    email: string;
    is_onboarded: boolean;
    user_type: 'user' | 'admin';
    is_email_verified: boolean;
    profile_image: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}
export interface GoogleLoginResponse {
    message: string;
    user: GoogleUser;
}

export default function LoginForm() {
    const { toast } = useToast()
    const router = useRouter()
    const { setAuth, user } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)

    const loginWithCredentialsMutation = useLoginWithCredentialsMutation({
        onSuccess: (data) => {
            setAuth({
                ...user,
                ...data.user
            })
            if (data.user.is_email_verified && data.user.is_onboarded) {
                router.push('/feed')
            } else if (data.user.is_email_verified && !data.user.is_onboarded) {
                router.push('/onboarding')
            } else if (!data.user.is_email_verified) {
                router.push('/verify-email')
            }
            toast({
                title: "Success",
                description: "Logged in successfully",
            })
        },
        onError: (error) => {
            console.log('error: ', error)
        }
    })

    const loginWithGoogleMutation = useLoginWithGoogleMutation({
        onSuccess: (data: GoogleLoginResponse) => {
            setAuth({
                ...user,
                _id: data.user._id,
                full_name: data.user.full_name,
                username: data.user.username,
                email: data.user.email,
                is_onboarded: data.user.is_onboarded,
                user_type: data.user.user_type,
                is_email_verified: data.user.is_email_verified,
                profile_image: data.user.profile_image,
            })
            if (data.user.is_email_verified && data.user.is_onboarded) {
                router.push('/feed')
            } else if (data.user.is_email_verified && !data.user.is_onboarded) {
                router.push('/onboarding')
            } else if (!data.user.is_email_verified) {
                router.push('/verify-email')
            }
        },
    })

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const onSubmit = (data: LoginFormValues) => {
        loginWithCredentialsMutation.mutate(data)
    }

    return (
        <Card className="w-full max-w-md bg-white dark:bg-white border dark:border-gray-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-900">
                    Welcome back
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <>
                        {loginWithCredentialsMutation.error && (
                            <Alert variant={'destructive'} className="mb-6">
                                <AlertTitle className="text-red-600 dark:text-red-600">Error</AlertTitle>
                                <AlertDescription className="text-red-600 dark:text-red-600">
                                    {loginWithCredentialsMutation.error.response ? loginWithCredentialsMutation.error.response.data.message : 'Failed to login'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
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
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...field}
                                                    className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-100"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Don&apos;t have an account?
                                </Link>
                            </div>

                            <LoadingButton
                                type="submit"
                                variant="outline"
                                isLoading={loginWithCredentialsMutation.isPending}
                                loadingText="Logging in..."
                                className="w-full h-11 text-base font-medium bg-primary text-white hover:bg-primary/90"
                            >
                                Login
                            </LoadingButton>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-white text-gray-500 dark:text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google Login Button Container */}
                            <div className='w-full flex justify-center'>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        loginWithGoogleMutation.mutate(credentialResponse)
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                        toast({
                                            title: "Error",
                                            description: "Failed to login with Google",
                                        })
                                    }}
                                    shape='rectangular'
                                    size='large'
                                    auto_select={true}
                                    useOneTap={false}
                                    cancel_on_tap_outside={true}
                                    ux_mode='popup'
                                />
                            </div>
                        </form>
                    </>
                </Form>
            </CardContent>
        </Card>
    )
}
