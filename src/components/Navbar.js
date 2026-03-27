'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Menu, X } from 'lucide-react';

const Navbar = ({ lightHeader = false }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchUserAndName = async (sessionUser) => {
            if (!sessionUser) {
                setUser(null);
                setUserName('');
                return;
            }

            setUser(sessionUser);

            const { data: adminData } = await supabase
                .from('admins')
                .select('name')
                .eq('id', sessionUser.id)
                .single();

            if (adminData) {
                setUserName(adminData.name);
            } else {
                const { data: userData } = await supabase
                    .from('users')
                    .select('name')
                    .eq('id', sessionUser.id)
                    .single();
                if (userData) setUserName(userData.name);
            }
        };

        const initialize = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            fetchUserAndName(session?.user || null);
        };
        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserAndName(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
        setMobileMenuOpen(false);
    };

    const links = [
        { name: 'Home', href: '/' },
        { name: 'Apartments', href: '/properties' },
        { name: 'About us', href: '/about' },
        { name: 'Blog', href: '/blog' },
    ];

    const isDarkText = scrolled || lightHeader || mobileMenuOpen;

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[100] px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-zinc-100 py-3 shadow-sm' : 'bg-transparent'}`}>
                {/* Brand Logo */}
                <div className="flex-1">
                    <Link
                        href="/"
                        className={`text-xl md:text-2xl font-black tracking-tighter transition-colors duration-500 ${isDarkText ? 'text-zinc-950' : 'text-white'}`}
                    >
                        ESTATE
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-sm ${pathname === link.href
                                ? (isDarkText ? 'text-zinc-950 border-b-2 border-zinc-950' : 'text-white border-b-2 border-white')
                                : (isDarkText ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950' : 'text-white/60 hover:bg-white/10 hover:text-white')
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href="/admin"
                            className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-sm ${pathname.startsWith('/admin')
                                ? (isDarkText ? 'text-zinc-950 border-b-2 border-zinc-950' : 'text-white border-b-2 border-white')
                                : (isDarkText ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950' : 'text-white/60 hover:bg-white/10 hover:text-white')
                                }`}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 transition-colors ${isDarkText ? 'text-zinc-950' : 'text-white'}`}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Auth */}
                <div className="hidden lg:flex flex-1 justify-end gap-6 items-center">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden xl:block">
                                <span className={`text-[10px] font-black uppercase tracking-widest block ${isDarkText ? 'text-emerald-700' : 'text-emerald-400'}`}>{userName || 'Member'}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-widest block opacity-60 ${isDarkText ? 'text-zinc-400' : 'text-zinc-300'}`}>{user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 border px-4 py-2 rounded-sm ${isDarkText ? 'border-zinc-200 text-zinc-950 hover:bg-red-50 hover:border-red-100 hover:text-red-700 shadow-sm' : 'border-white/20 text-white hover:bg-white/10 hover:border-white'}`}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className={`px-8 py-3 border text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-xl active:scale-95 ${isDarkText ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800' : 'border-white bg-white text-zinc-950 hover:bg-zinc-100'}`}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-[90] bg-white transition-all duration-700 lg:hidden transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full pt-32 pb-16 px-8 space-y-12 overflow-y-auto">
                    <div className="space-y-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 block">Directory</span>
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block text-4xl font-black uppercase tracking-tighter ${pathname === link.href ? 'text-emerald-500' : 'text-zinc-950'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block text-4xl font-black uppercase tracking-tighter ${pathname.startsWith('/admin') ? 'text-emerald-500' : 'text-zinc-950'}`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="pt-12 border-t border-zinc-100 space-y-8">
                        {user ? (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <span className="text-sm font-black text-zinc-950 block">{userName || 'Member'}</span>
                                    <span className="text-xs font-medium text-zinc-400 block">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-5 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-lg border border-red-100"
                                >
                                    Terminate Session
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full py-5 bg-zinc-950 text-white text-center text-xs font-black uppercase tracking-widest rounded-lg shadow-xl"
                            >
                                Sign In to Network
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
