import { SignUpResponse } from "@/app/(auth)/sign-up/_components/SignUpForm"
import { ApiError } from "@/lib/api"
import { signUp } from "@/services/auth"
import { SignUpPayload } from "@/types/auth"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export const useSignUpMutation = ({ ...options }: UseMutationOptions<SignUpResponse, ApiError, SignUpPayload, unknown>) => {
    return useMutation({
        mutationFn: signUp,
        ...options
    })
}