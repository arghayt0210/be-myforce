import { cn } from "@/lib/utils"
import React from "react"

interface ContainerProps {
    children: React.ReactNode
    as?: React.ElementType
    size?: "default" | "sm" | "md" | "lg" | "xl" | "full"
    className?: string
}

const Container = ({
    children,
    as: Component = "div",
    size = "default",
    className,
    ...props
}: ContainerProps) => {
    return (
        <Component
            className={cn(
                "mx-auto w-full",
                {
                    "max-w-screen-2xl px-4 md:px-6 lg:px-8": size === "default",
                    "max-w-screen-sm px-4": size === "sm",
                    "max-w-screen-md px-4 md:px-6": size === "md",
                    "max-w-screen-lg px-4 md:px-6": size === "lg",
                    "max-w-screen-xl px-4 md:px-6": size === "xl",
                    "w-full px-4 md:px-6 lg:px-8": size === "full",
                },
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
}

export default Container;