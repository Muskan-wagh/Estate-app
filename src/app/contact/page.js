'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Reusable Sub-Component
const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">{children}</p>
);

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white font-outfit">
            <Navbar lightHeader={true} />

            <div className="pt-40 pb-32 px-6 max-w-xl mx-auto text-zinc-950">
                {/* Contact Header */}
                <h1 className="text-5xl font-black mb-20 tracking-tighter">Contact</h1>

                {/* Address Info */}
                <section className="mb-24">
                    <SectionLabel>ESTABLISHMENT</SectionLabel>
                    <div className="space-y-12">
                        <div className="group">
                            <h3 className="text-lg font-black mb-3 group-hover:translate-x-1 transition-transform">Address</h3>
                            <p className="text-zinc-500 font-medium text-sm leading-relaxed">Indore</p>
                        </div>
                    </div>
                </section>

                {/* Contact Sales Form */}
                <section className="mb-24">
                    <SectionLabel>COMMUNICATION</SectionLabel>
                    <h2 className="text-3xl font-black mb-4 tracking-tight">Contact sales</h2>
                    <p className="text-sm font-medium text-zinc-400 mb-16 italic">
                        "Drop us your email and our architects will reach out immediately."
                    </p>

                    <form className="space-y-12">
                        <div className="grid grid-cols-1 gap-10">
                            <div className="relative group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">Identity</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full border-b border-zinc-200 py-4 focus:outline-none focus:border-zinc-950 text-sm font-bold transition-all placeholder:text-zinc-300"
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">Electronic Mail</label>
                                <input
                                    type="email"
                                    placeholder="name@domain.com"
                                    className="w-full border-b border-zinc-200 py-4 focus:outline-none focus:border-zinc-950 text-sm font-bold transition-all placeholder:text-zinc-300"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-y border-zinc-50 transition-colors hover:bg-zinc-50/50 px-2 rounded-lg">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-tight">I accept the Terms and Conditions</label>
                            <div className="w-6 h-6 border-2 border-zinc-100 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden group">
                                <input type="checkbox" className="w-full h-full opacity-0 cursor-pointer absolute z-10" />
                                <div className="w-full h-full bg-zinc-950 scale-0 peer-checked:scale-100 transition-transform duration-300 rounded-sm"></div>
                                <svg className="w-3 h-3 text-zinc-400 relative z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-6 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 duration-500">
                            Transmit Inquiry
                        </button>
                    </form>
                </section>

                {/* Map */}
                <div className="mt-32 grayscale rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 group transition-all duration-700">
                    <img
                        src="/map-placeholder.png"
                        alt="Location Map"
                        className="w-full aspect-video object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
}
