'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useToast } from '@/hooks/use-toast'
import { useUserOnboardingMutation } from '@/hooks/api/onboading'
import { useRouter } from 'next/navigation'
import { LoadingButton } from '@/components/LoadingButton'
import { useAllInterestsQuery } from '@/hooks/api/master'

if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    console.error('Mapbox access token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file')
}


export const formSchema = z.object({
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
    })
})

export type OnboardingFormValues = z.infer<typeof formSchema>

export default function OnboardingForm() {
    const { toast } = useToast()
    const router = useRouter()
    const mapContainer = React.useRef<HTMLDivElement>(null)
    const map = React.useRef<mapboxgl.Map | null>(null)

    const [selectedLocation, setSelectedLocation] = React.useState<{
        lat: number | null,
        lng: number | null
    }>({
        lat: null,
        lng: null
    })
    // Add WebGL detection function
    const checkWebGLSupport = () => {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return gl !== null
    }

    const { data: interestsList = [], refetch } = useAllInterestsQuery()



    const userOnboardingMutation = useUserOnboardingMutation({
        onSuccess: () => {
            router.push('/feed')
            toast({
                title: 'Onboarding completed',
                description: 'You can now start exploring the app',
            })
        }
    })


    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interests: [],
            bio: "",
            location: {
                coordinates: [0, 0],
                address: "",
                city: "",
                state: "",
                country: "",
            }
        },
    })

    const onSubmit = async (values: OnboardingFormValues) => {
        // Handle form submission
        if (!selectedLocation.lat || !selectedLocation.lng) {
            console.error('Location is not selected')
            toast({
                title: 'Location is not selected',
                description: 'Please allow location access and refresh the page',
                variant: 'destructive',
            })
            return
        }
        userOnboardingMutation.mutate(values)

    }

    React.useEffect(() => {
        refetch()
        if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
            console.error('Mapbox access token is missing')
            return
        }

        // Check WebGL support first
        const webGLSupported = checkWebGLSupport()

        if (!webGLSupported) {
            toast({
                title: 'WebGL is not supported in your browser',
                description: 'Please update your browser to the latest version',
                variant: 'destructive',
            })
            return
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setSelectedLocation({ lat: latitude, lng: longitude })

                // Initialize map
                if (mapContainer.current && !map.current) {
                    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
                    map.current = new mapboxgl.Map({
                        container: mapContainer.current,
                        style: 'mapbox://styles/mapbox/streets-v12',
                        center: [longitude, latitude],
                        zoom: 12
                    })

                    // Add marker
                    new mapboxgl.Marker()
                        .setLngLat([longitude, latitude])
                        .addTo(map.current)
                }
            })
        }
    }, [])


    // Add this effect after your existing useEffect
    React.useEffect(() => {
        if (selectedLocation.lat && selectedLocation.lng) {
            const geocodeLocation = async () => {
                try {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedLocation.lng},${selectedLocation.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
                    )
                    const data = await response.json()

                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0]
                        const context = feature.context || []

                        const city = context.find((item: any) => item.id.includes('place'))?.text || ''
                        const state = context.find((item: any) => item.id.includes('region'))?.text || ''
                        const country = context.find((item: any) => item.id.includes('country'))?.text || ''

                        form.setValue('location', {
                            type: 'Point',
                            coordinates: [selectedLocation.lng!, selectedLocation.lat!],
                            address: feature.place_name || '',
                            city,
                            state,
                            country,
                        })
                    }
                } catch (error) {
                    console.error('Error geocoding location:', error)
                }
            }

            geocodeLocation()
        }
    }, [selectedLocation.lat, selectedLocation.lng, form])

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div
                        ref={mapContainer}
                        className="w-full h-[300px] rounded-lg mb-4"
                    />

                    <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interests</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={interestsList || []}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select your interests"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about yourself"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <LoadingButton
                        type="submit"
                        variant="outline"
                        isLoading={userOnboardingMutation.isPending}
                        loadingText="Onboarding..."
                        className="w-full h-11 text-base font-medium bg-primary text-white hover:bg-primary/90"
                    >
                        Complete Profile
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}