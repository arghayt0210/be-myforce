import Link from "next/link";
import Logo from "./Logo";
import Container from "./Container";

const Footer = () => {
    const footerLinks = {
        company: {
            title: 'Company',
            links: [
                // { name: 'About Us', href: '/about' },
                // { name: 'Careers', href: '/careers' },
                // { name: 'Press', href: '/press' },
                // { name: 'Blog', href: '/blog' },
            ],
        },
        product: {
            title: 'Product',
            links: [
                // { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                // { name: 'Success Stories', href: '/stories' },
                // { name: 'Resources', href: '/resources' },
            ],
        },
        support: {
            title: 'Support',
            links: [
                // { name: 'Help Center', href: '/help' },
                { name: 'Contact Us', href: '/contact' },
                // { name: 'Community', href: '/community' },
                // { name: 'Status', href: '/status' },
            ],
        },
        legal: {
            title: 'Legal',
            links: [
                // { name: 'Privacy Policy', href: '/privacy' },
                // { name: 'Terms of Service', href: '/terms' },
                // { name: 'Cookie Policy', href: '/cookies' },
                // { name: 'Guidelines', href: '/guidelines' },
            ],
        },
    };

    const socialLinks = [
        { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
        { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
        { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    ];

    return (
        <footer className="w-full border-t bg-background py-4">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Logo and Description Section */}
                    <div className="lg:col-span-2">
                        <Logo />
                        <p className="mt-4 text-sm text-muted-foreground">
                            Connect with like-minded individuals, find your perfect buddy partner,
                            and build meaningful relationships in our growing community.
                        </p>
                        {/* Social Links */}
                        <div className="mt-6 flex space-x-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="sr-only">{social.name}</span>
                                    {/* <SocialIcon name={social.icon} /> */}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([key, category]) => (
                        <div key={key} className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                                {category.title}
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {category.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Be MyForce. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <Link
                                href="/privacy"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/cookies"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Cookie Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;