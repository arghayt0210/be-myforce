import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Features = () => {
    const features = [
        {
            title: "Interest-Based Matching",
            description: "Connect with people who share your hobbies, from gaming to hiking and everything in between.",
            icon: "🎯" // Replace with actual icon component
        },
        {
            title: "Location-Based Search",
            description: "Find friends nearby who share your interests for easier meetups and local connections.",
            icon: "📍" // Replace with actual icon component
        },
        {
            title: "Secure Chat",
            description: "Chat safely within the app before deciding to share personal contact information.",
            icon: "🔒" // Replace with actual icon component
        },
        {
            title: "Interest Groups",
            description: "Join or create groups based on specific interests to meet multiple like-minded people.",
            icon: "👥" // Replace with actual icon component
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-muted/50">
            <div className="container px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                    Why Choose Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-md">
                            <CardHeader>
                                <div className="flex justify-center text-4xl mb-4">{feature.icon}</div>
                                <CardTitle className="text-center text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;