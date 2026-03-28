'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import posthog from 'posthog-js';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            posthog.capture('user_sign_in_failed', { error: error.message });
        } else {
            posthog.identify(data.user.id, { email: data.user.email });
            posthog.capture('user_signed_in', { email: data.user.email });
            router.push('/');
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950 pb-32 transition-colors duration-500 font-outfit">
            <Navbar lightHeader={true} />

            <section className="pt-40 max-w-lg mx-auto px-6">
                <div className="bg-white border border-zinc-200 p-12 rounded-2xl shadow-xl space-y-12">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold uppercase tracking-tighter text-zinc-900 drop-shadow-sm">Welcome <span className="text-zinc-300 font-medium">Back</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Sign in to access exclusive insights and collections.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {error && <p className="text-[10px] font-black text-red-600 text-center uppercase tracking-widest leading-relaxed bg-red-50 p-4 rounded-sm border border-red-100">{error}</p>}

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 text-sm focus:outline-none focus:border-zinc-950 rounded-lg transition-colors text-zinc-900 font-medium placeholder:text-zinc-300"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 text-sm focus:outline-none focus:border-zinc-950 rounded-lg transition-colors text-zinc-900 font-medium placeholder:text-zinc-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full py-5 text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-xl active:scale-[0.98] ${loading ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                    </form>

                    <div className="text-center pt-10 border-t border-zinc-100">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">No membership?</p>
                        <button
                            onClick={() => router.push('/signup')}
                            className="mt-3 text-xs font-black text-zinc-900 uppercase tracking-widest hover:underline underline-offset-10 transition-all"
                        >
                            Request Access
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
