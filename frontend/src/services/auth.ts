import api from "@/lib/api";
import { ForgotPasswordValues, LoginFormValues, ResetPasswordValues } from "@/schemas/auth.schema";
import { SignUpPayload } from "@/types/auth";

export const signUp = async (data: SignUpPayload) => {
    const response = await api.post('/auth/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const loginWithCredentials = async (data: LoginFormValues) => {
    const response = await api.post('/auth/login', data)
    return response.data
}

export const loginWithGoogle = async (data: any) => {
    const response = await api.post('/auth/google', data)
    return response.data
}

export const logout = async () => {
    const response = await api.get('/auth/logout')
    return response.data
}

export const forgotPassword = async (data: ForgotPasswordValues) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
}

export const resetPassword = async (data: ResetPasswordValues) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
}