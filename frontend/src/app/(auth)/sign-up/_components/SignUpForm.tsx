'use client'

import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/schemas/auth.schema'
import { Eye, EyeOff, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { SignUpFormValues } from '@/types/auth'
import { useLoginWithGoogleMutation, useSignUpMutation } from '@/hooks/api/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/store/auth.store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { GoogleLogin } from '@react-oauth/google';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LoadingButton } from '@/components/LoadingButton'

export interface SignUpResponse {
    message: string;
    user: {
        _id: string;
        full_name: string;
        username: string;
        email: string;
        profile_image: string;
        is_email_verified: boolean;
        user_type: 'user' | 'admin';
        is_onboarded: boolean;
    }
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

export interface GoogleLoginResponse {
    message: string;
    user: GoogleUser;
}

export default function SignUpForm() {
    const { toast } = useToast()
    const router = useRouter()
    const { setAuth, user } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const signUpMutation = useSignUpMutation({
        onSuccess: (data: SignUpResponse) => {
            toast({
                title: "Success",
                description: "Account created successfully",
            })

            setAuth({
                _id: data.user._id,
                full_name: data.user.full_name,
                username: data.user.username,
                email: data.user.email,
                profile_image: data.user.profile_image,
                is_email_verified: data.user.is_email_verified,
                user_type: data.user.user_type,
                is_onboarded: data.user.is_onboarded,
                interests: [],
                location: null,
            })
            router.push('/verify-email')
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
            console.log(errorMessage)
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

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: '',
            username: '',
            email: '',
            password: '',
            profile_image: undefined
        }
    })

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            const formData = new FormData()

            // Append all text fields
            formData.append('full_name', data.full_name)
            formData.append('username', data.username)
            formData.append('email', data.email)
            formData.append('password', data.password)

            // Append file if it exists
            if (data.profile_image) {
                formData.append('profile_image', data.profile_image)
            }

            signUpMutation.mutate(formData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('profile_image', file, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
        e.target.value = ''
    }

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        form.setValue('profile_image', undefined, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    return (
        <Card className="w-full max-w-md bg-white dark:bg-white border dark:border-gray-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-900">
                    Create an account
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <>
                        {signUpMutation.error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertTitle className="text-red-600 dark:text-red-600">Error</AlertTitle>
                                <AlertDescription className="text-red-600 dark:text-red-600">
                                    {signUpMutation.error.response?.data.message || 'Failed to sign up'}
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Profile Image Upload */}
                            <FormField
                                control={form.control}
                                name="profile_image"
                                render={() => (
                                    <FormItem className="flex flex-col items-center mb-4">
                                        <div className="relative">
                                            <FormLabel className="relative group cursor-pointer">
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-white">
                                                        {imagePreview ? (
                                                            <AvatarImage src={imagePreview} />
                                                        ) : (
                                                            <div className="w-full h-full rounded-full bg-gray-50 dark:bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-200 hover:border-gray-300 dark:hover:border-gray-300 transition-colors">
                                                                <Upload className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                                                            </div>
                                                        )}
                                                    </Avatar>
                                                    <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-xs font-medium">
                                                        Change
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageChange}
                                                    />
                                                </FormControl>
                                            </FormLabel>
                                            {imagePreview && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                                                    onClick={removeImage}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage className="text-red-500 dark:text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-700">Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                    className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 dark:text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-700">Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="johndoe"
                                                    {...field}
                                                    className="bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-gray-200 dark:border-gray-200"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 dark:text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                                placeholder="john@example.com"
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
                                                    placeholder="••••••••"
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
                                <div></div>
                                <Link
                                    href="/login"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Already have an account?
                                </Link>
                            </div>


                            <LoadingButton
                                type="submit"
                                variant="outline"
                                isLoading={signUpMutation.isPending}
                                loadingText="Creating account..."
                                className="w-full h-11 text-base font-medium bg-primary text-white hover:bg-primary/90"
                            >
                                Sign Up
                            </LoadingButton>

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

                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        loginWithGoogleMutation.mutate(credentialResponse)
                                    }}
                                    onError={() => {
                                        console.log('Login Failed')
                                        toast({
                                            title: "Error",
                                            description: "Failed to login with Google",
                                        })
                                    }}
                                    shape="rectangular"
                                    size="large"
                                    auto_select={true}
                                    useOneTap={false}
                                    cancel_on_tap_outside={true}
                                    ux_mode="popup"
                                />
                            </div>
                        </form>
                    </>
                </Form>
            </CardContent>
        </Card>
    )
}