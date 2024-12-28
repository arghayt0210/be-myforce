import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo.svg';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

const Logo = ({ className = '', showText = true }: LogoProps) => {
    return (
        <Link href="/" className={`flex items-center ${className}`}>
            <Image
                src={logo}
                alt="Be MyForce Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
            />
            {showText && (
                <span className={`ml-2 text-xl font-bold text-primary`}>
                    BeMyForce
                </span>
            )}
        </Link>
    );
};

export default Logo;