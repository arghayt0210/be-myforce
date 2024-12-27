import { VerifyEmailFormValues } from "@/app/(auth)/verify-email/_components/VerifyEmailForm"
import api from "@/lib/api"

export const verifyEmail = async (data: VerifyEmailFormValues & { email: string }) => {
    const response = await api.post('/verification/verify-email', data)
    return response.data
}

export const resendVerificationEmail = async (data: { email: string }) => {
    const response = await api.post('/verification/resend-verify-email', data)
    return response.data
}
