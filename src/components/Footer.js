import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white py-12 px-6 font-sans border-t border-zinc-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Brand & Language */}
                    <div className="space-y-6 w-full md:w-auto">
                        <Link href="/" className="text-2xl font-serif font-black tracking-tighter block">
                            Estate
                        </Link>

                        <div className="relative inline-block group">
                            <select className="appearance-none bg-zinc-900/50 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-3 pr-10 rounded-sm border-none focus:outline-none cursor-pointer hover:bg-zinc-800 transition-all">
                                <option>ENG</option>
                                <option>ESP</option>
                                <option>FRA</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap gap-x-16 gap-y-10 w-full md:w-auto pt-2">
                        {/* Directory */}
                        <ul className="space-y-3 px-2">
                            <li><Link href="/" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/properties" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">Apartments</Link></li>
                        </ul>

                        {/* Socials */}
                        <ul className="space-y-3 px-2">
                            <li><Link href="/about-us" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">About us</Link></li>
                            <li><Link href="/blogs" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">Blog</Link></li>
                        </ul>

                        {/* Contact & Legal */}
                        <ul className="space-y-3 px-2">
                            <li><Link href="/privacy" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white transition-colors">Instagram</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.5em]">
                        &copy; 2026 Estate Core
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">
                            All Rights Reserved
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
