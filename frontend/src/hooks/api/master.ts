import { allInterests } from "@/services/master"
import { useQuery } from "@tanstack/react-query"

export const useAllInterestsQuery = () => {
    return useQuery({
        queryKey: ['allInterests'],
        queryFn: allInterests,
        select: (data: any) => {
            return data?.interests.map((item: any) => ({
                label: item.name, // Adjust the property name based on your actual data structure
                value: item._id    // Adjust the property name based on your actual data structure
            }))
        }
    })
}

// { ...options }: UseQueryOptions<unknown, ApiError>