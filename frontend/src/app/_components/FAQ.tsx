
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "How do I find people with similar interests?",
            answer: "Our platform uses your selected interests to match you with compatible people nearby. You can also search and filter users based on specific interests and location."
        },
        {
            question: "Is it safe to use this platform?",
            answer: "Yes! We prioritize user safety. All chats happen within our secure platform, and personal information is only shared when you choose to do so. We also have reporting features and strict community guidelines."
        },
        {
            question: "Is this a dating app?",
            answer: "No, this is a platform focused on making friends and connections based on shared interests. While some people might form romantic connections, our primary goal is to help people find like-minded friends."
        },
        {
            question: "How does the nearby location feature work?",
            answer: "The app uses your general location (with your permission) to show you potential connections within your specified radius. You can adjust this radius in your settings."
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-muted/50">
            <div className="container px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQ;