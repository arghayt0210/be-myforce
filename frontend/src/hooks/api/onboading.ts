import { OnboardingFormValues } from "@/app/(auth)/onboarding/_components/OnboardingForm"
import { ApiError } from "@/lib/api"
import { userOnboarding } from "@/services/onboarding"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export const useUserOnboardingMutation = ({ ...options }: UseMutationOptions<unknown, ApiError, OnboardingFormValues, unknown>) => {
    return useMutation({
        mutationFn: userOnboarding,
        ...options
    })
}