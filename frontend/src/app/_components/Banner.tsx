import React from 'react';
import { Button } from "@/components/ui/button";

const Banner = () => {
    return (
        <section className="py-12 md:py-20">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                        Find Your Perfect Team Buddy
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        Connect with passionate people who share your interests. From content creation to sports,
                        find the perfect partner for your next adventure or project.
                    </p>
                    <div className="space-x-4">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Get Started
                        </Button>
                        <Button size="lg" variant="outline">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;