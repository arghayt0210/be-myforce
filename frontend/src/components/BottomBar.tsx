"use client"

import Link from 'next/link'
import { Home, Plus, User } from 'lucide-react'
import { useAuthStore } from '@/hooks/store/auth.store'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const BottomBar = () => {
    const { isAuthenticated } = useAuthStore()
    const pathname = usePathname()

    if (!isAuthenticated) return null

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-background/75 backdrop-blur-lg border-t shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/20" />

                <div className="relative flex items-center justify-around h-16 px-4">
                    <Link
                        href="/feed"
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-16 transition-all duration-200 hover:scale-110",
                            pathname === '/feed'
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <div className="p-2 rounded-2xl transition-all duration-200">
                            <Home className="h-5 w-5" />
                            <span className="text-xs mt-1">Home</span>
                        </div>
                    </Link>

                    <Link
                        href="/create-post"
                        className="flex flex-col items-center justify-center -mt-8 transition-transform duration-200 hover:scale-105"
                    >
                        <div className="relative">
                            {/* Glowing effect */}
                            <div className="absolute -inset-1 bg-primary/30 rounded-full blur" />
                            {/* Button */}
                            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg">
                                <Plus className="h-7 w-7 text-primary-foreground" />
                            </div>
                        </div>
                        <span className="text-xs mt-1 text-muted-foreground">Create</span>
                    </Link>

                    <Link
                        href="/profile"
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-16 transition-all duration-200 hover:scale-110",
                            pathname === '/profile'
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <div className="p-2 rounded-2xl transition-all duration-200">
                            <User className="h-5 w-5" />
                            <span className="text-xs mt-1">Profile</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BottomBar