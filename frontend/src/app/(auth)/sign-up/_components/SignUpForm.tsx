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
import { useSignUpMutation } from '@/hooks/api/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/store/auth.store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

export default function SignUpForm() {
    const { toast } = useToast()
    const router = useRouter()
    const { setAuth } = useAuthStore()
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
        <Form {...form}>
            <>
                {
                    signUpMutation.error && (
                        <Alert variant={'destructive'}>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {signUpMutation.error.response ? signUpMutation.error.response.data.message || 'Failed to sign up' : 'Failed to sign up'}
                            </AlertDescription>
                        </Alert>
                    )
                }
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Image Upload */}
                    <FormField
                        control={form.control}
                        name="profile_image"
                        render={() => (
                            <FormItem className="flex flex-col items-center">
                                <div className="relative"> {/* Add this wrapper div */}
                                    <FormLabel className="relative group cursor-pointer">
                                        <div className="relative w-32 h-32">
                                            <Avatar className="w-32 h-32">
                                                {imagePreview ? (
                                                    <AvatarImage src={imagePreview} />
                                                ) : (
                                                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-sm font-medium">
                                                Change Photo
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
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Full Name */}
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
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
                                <FormLabel>Password</FormLabel>
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={signUpMutation.isPending}
                    >
                        {signUpMutation.isPending
                            ? 'Creating account...'
                            : 'Create account'}
                    </Button>
                </form></>
        </Form>
    )
}