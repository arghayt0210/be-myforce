import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            title: "Create Your Profile",
            description: "Share your interests, hobbies, and what you're looking for in connections.",
            icon: "📝" // Replace with actual icon component
        },
        {
            title: "Discover People",
            description: "Find nearby people who share your interests and passions.",
            icon: "🔍" // Replace with actual icon component
        },
        {
            title: "Chat Safely",
            description: "Connect through our secure in-app chat before sharing personal details.",
            icon: "💬" // Replace with actual icon component
        },
        {
            title: "Meet Up",
            description: "Build real connections and meet your new friends in person.",
            icon: "🤝" // Replace with actual icon component
        }
    ];

    return (
        <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <Card key={index} className="border-none shadow-md">
                            <CardHeader>
                                <div className="flex justify-center text-4xl mb-4">{step.icon}</div>
                                <CardTitle className="text-center text-xl">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;