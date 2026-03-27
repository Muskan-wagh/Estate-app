import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-zinc-400 py-16 px-6 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-xs space-y-4">
                    <Link href="/" className="text-2xl font-bold text-white tracking-tight italic">
                        Estate
                    </Link>
                    <p className="text-sm leading-relaxed">
                        Leading real estate platform providing professional services and property solutions globally.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/properties" className="hover:text-white transition-colors">Buy Property</Link></li>
                            <li><Link href="/properties" className="hover:text-white transition-colors">Rentals</Link></li>
                            <li><Link href="/admin" className="hover:text-white transition-colors">Partner Dashboard</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Socials</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-widest text-center">
                © 2025 Estate Real Estate App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
