import { OnboardingFormValues } from "@/app/(auth)/onboarding/_components/OnboardingForm"
import api from "@/lib/api"

export const userOnboarding = async (data: OnboardingFormValues) => {
    const response = await api.post('/onboarding/complete', data)
    return response.data
}