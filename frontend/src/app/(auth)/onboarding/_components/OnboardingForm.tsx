'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"

// Define interests list
const interestsList = [
    { value: "tech", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "food", label: "Food" },
    // Add more interests as needed
]

const formSchema = z.object({
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    location: z.object({
        coordinates: z.array(z.number()).length(2),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
    })
})

export default function OnboardingForm() {
    const [selectedLocation, setSelectedLocation] = React.useState({
        lat: 0,
        lng: 0
    })

    const form = useForm<z.infer<typeof formSchema>>({
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Handle form submission
        console.log(values)
    }

    // Get current location
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setSelectedLocation({ lat: latitude, lng: longitude })

                // Fetch address details using Google Geocoding API
                // Update form values with location details
            })
        }
    }, [])

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interests</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={interestsList}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select your interests"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {selectedLocation.lat && selectedLocation.lng && `${selectedLocation.lat}, ${selectedLocation.lng}`}

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



                    <Button type="submit">Complete Profile</Button>
                </form>
            </Form>
        </div>
    )
}