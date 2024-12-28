"use client"

import { User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import Link from "next/link"
import { useAuthStore } from "@/hooks/store/auth.store"
import Image from "next/image"
import { logout } from "@/services/auth"
import { useRouter } from "next/navigation"
import { googleLogout } from "@react-oauth/google"

const UserMenu = () => {
    const { user, clearAuth } = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        clearAuth()
        router.push('/')
        googleLogout()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    {user?.profile_image ? (
                        <Image
                            src={user.profile_image}
                            alt="Profile"
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded-full"
                        />
                    ) : (
                        <User className="h-5 w-5" />
                    )}
                    <span className="sr-only">User menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu