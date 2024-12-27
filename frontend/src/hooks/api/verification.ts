import { VerifyEmailFormValues } from "@/app/(auth)/verify-email/_components/VerifyEmailForm"
import { ApiError } from "@/lib/api"
import { resendVerificationEmail, verifyEmail } from "@/services/verification"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export const useVerifyEmailMutation = ({ ...options }: UseMutationOptions<unknown, ApiError, VerifyEmailFormValues & { email: string }, unknown>) => {
    return useMutation({
        mutationFn: verifyEmail,
        ...options
    })
}

export const useResendVerificationEmailMutation = ({ ...options }: UseMutationOptions<unknown, ApiError, { email: string }, unknown>) => {
    return useMutation({
        mutationFn: resendVerificationEmail,
        ...options
    })
}