import api from "@/lib/api";
import { SignUpPayload } from "@/types/auth";

export const signUp = async (data: SignUpPayload) => {
    const response = await api.post('/auth/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}



