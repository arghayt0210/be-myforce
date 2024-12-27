"use client"

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from './Logo';
import Container from './Container';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { useAuthStore } from '@/hooks/store/auth.store';
import UserMenu from './UserMenu';

const Header = () => {
    const { isAuthenticated } = useAuthStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationLinks = {
        discover: {
            name: 'Discover',
            links: [
                { name: 'Activity Feed', href: '/feed' },
            ],
        },
        ...(isAuthenticated && {
            connect: {
                name: 'Connect',
                links: [
                    { name: 'My Buddy', href: '/my-buddy' },
                ],
            },
        })
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="container flex h-16 items-center">
                    {/* Logo */}
                    <div className="mr-4 flex">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex flex-1">
                        <NavigationMenuList>
                            {Object.entries(navigationLinks).map(([key, category]) => (
                                <NavigationMenuItem key={key}>
                                    <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-48 p-1">
                                            {category.links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right Section */}
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <nav className="flex items-center space-x-2">
                            <ThemeToggle />
                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </Container>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border">
                    <Container>
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {Object.entries(navigationLinks).map(([key, category]) => (
                                <div key={key} className="space-y-1">
                                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground">
                                        {category.name}
                                    </button>
                                    <div className="pl-4 space-y-1">
                                        {category.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="block px-3 py-2 text-sm text-muted-foreground hover:text-accent-foreground"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 space-y-2">
                                {!isAuthenticated && (
                                    <Link
                                        href="/login"
                                        className="block w-full px-3 py-2 text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
};

export default Header;