'use client'

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean
    loadingText?: string
}

export function LoadingButton({
    children,
    isLoading,
    loadingText,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            disabled={disabled || isLoading}
            className={cn("flex items-center gap-2", className)}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading && loadingText ? loadingText : children}
        </Button>
    )
}