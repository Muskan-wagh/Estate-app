import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white text-zinc-400 py-16 sm:py-24 px-6 border-t border-zinc-100 font-outfit">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16">
                <div className="max-w-xs space-y-6">
                    <Link href="/" className="text-2xl font-black text-zinc-950 tracking-tighter uppercase">
                        Estate
                    </Link>
                    <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                        Leading real estate platform providing professional services and property solutions globally.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16 w-full md:w-auto">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">Company</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-emerald-600 transition-colors">Magazine</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">Services</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link href="/properties" className="hover:text-emerald-600 transition-colors">Buy Property</Link></li>
                            <li><Link href="/properties" className="hover:text-emerald-600 transition-colors">Rentals</Link></li>
                            <li><Link href="/admin" className="hover:text-emerald-600 transition-colors">Partner Dashboard</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6 col-span-2 sm:col-span-1">
                        <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">Socials</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest flex flex-wrap gap-x-8 sm:block sm:gap-0">
                            <li><Link href="#" className="hover:text-emerald-600 transition-colors block py-1 sm:py-0">Instagram</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 transition-colors block py-1 sm:py-0">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 transition-colors block py-1 sm:py-0">Facebook</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-zinc-50 text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em] text-center">
                &copy; 2025 Estate Real Estate App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
