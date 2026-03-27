'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Home', href: '/' },
        { name: 'Apartments', href: '/properties' },
        { name: 'About us', href: '/about' },
        { name: 'Blog', href: '/blog' },
    ];

    return (
        <nav className="absolute top-0 left-0 w-full z-50 px-8 py-8 flex items-center justify-between pointer-events-auto">
            {/* Brand Logo - Serif */}
            <div className="flex-1">
                <Link
                    href="/"
                    className="text-3xl font-bold text-white tracking-tight font-playfair hover:opacity-80 transition-opacity"
                >
                    Estate
                </Link>
            </div>

            {/* Main Navigation - Balanced */}
            <div className="flex items-center gap-1">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-sm ${pathname === link.href
                                ? 'text-white border-b-2 border-white'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Action Button - Framed */}
            <div className="flex-1 flex justify-end">
                <Link
                    href="/contact"
                    className="px-8 py-3 border border-white/50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white/10 hover:border-white transition-all shadow-lg active:scale-95"
                >
                    Contact
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
