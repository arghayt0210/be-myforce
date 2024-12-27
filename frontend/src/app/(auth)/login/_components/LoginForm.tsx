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
// import GoogleIcon from '@/assets/icons/GoogleIcon';
import { useLoginWithCredentialsMutation } from '@/hooks/api/auth';
import { LoadingButton } from '@/components/LoadingButton';
// import { useRouter } from 'next/navigation';

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

export interface LoginResponse {
    message: string;
    user: User;
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
        <Form {...form}>
            <>
                {loginWithCredentialsMutation.error && (
                    <Alert variant={'destructive'}>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {loginWithCredentialsMutation.error.response ? loginWithCredentialsMutation.error.response.data.message : 'Failed to login'}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='password'>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
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
                        className="w-full h-11 text-base font-medium"
                    >
                        Login
                    </LoadingButton>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Login Button Container */}

            </>
        </Form>
    )
}
