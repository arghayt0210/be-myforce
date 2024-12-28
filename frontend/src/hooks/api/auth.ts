import { LoginResponse } from "@/app/(auth)/login/_components/LoginForm"
import { SignUpResponse } from "@/app/(auth)/sign-up/_components/SignUpForm"
import { ApiError } from "@/lib/api"
import { ForgotPasswordValues, LoginFormValues } from "@/schemas/auth.schema"
import { forgotPassword, loginWithCredentials, loginWithGoogle, signUp } from "@/services/auth"
import { SignUpPayload } from "@/types/auth"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export const useSignUpMutation = ({ ...options }: UseMutationOptions<SignUpResponse, ApiError, SignUpPayload, unknown>) => {
    return useMutation({
        mutationFn: signUp,
        ...options
    })
}

export const useLoginWithCredentialsMutation = ({ ...options }: UseMutationOptions<LoginResponse, ApiError, LoginFormValues, unknown>) => {
    return useMutation({
        mutationFn: loginWithCredentials,
        ...options
    })
}

export const useLoginWithGoogleMutation = ({ ...options }: UseMutationOptions<LoginResponse, ApiError, any, unknown>) => {
    return useMutation({
        mutationFn: loginWithGoogle,
        ...options
    })
}

export const useForgotPasswordMutation = ({ ...options }: UseMutationOptions<unknown, ApiError, ForgotPasswordValues, unknown>) => {
    return useMutation({
        mutationFn: forgotPassword,
        ...options
    })
}
