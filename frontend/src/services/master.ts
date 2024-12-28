import api from "@/lib/api"

export const allInterests = async () => {
    const response = await api.get('/master/interests')
    return response.data
}