'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import posthog from 'posthog-js';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (role === 'admin') {
                const { data: existingAdmin, error: adminCheckError } = await supabase
                    .from('admins')
                    .select('id')
                    .limit(1);

                if (adminCheckError) {
                    // Ignore table not found errors or similar during first-time setup
                    if (adminCheckError.code !== 'PGRST116') console.warn('Admin check error:', adminCheckError);
                }

                if (existingAdmin && existingAdmin.length > 0) {
                    throw new Error('An administrator already exists. You can only register as a User.');
                }
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                const table = role === 'admin' ? 'admins' : 'users';
                const { error: insertError } = await supabase
                    .from(table)
                    .insert([{
                        id: authData.user.id,
                        email: email,
                        name: name
                    }]);

                if (insertError) {
                    console.error('Database insertion error:', insertError);
                    // Even if DB profile insert fails (e.g. type mismatch), the Supabase Auth account IS created.
                    // We handle this gracefully per user request.
                    if (insertError.message?.includes('bigint')) {
                        console.warn('Type mismatch detected: Database expects BIGINT but received UUID. Please update your database schema.');
                    } else {
                        throw insertError;
                    }
                }

                posthog.identify(authData.user.id, { email, name });
                posthog.capture('user_signed_up', { email, name, role });

                alert('Successfully signed up! Please check your email for confirmation.');
                router.push('/login');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950 pb-32 transition-colors duration-500 font-outfit">
            <Navbar lightHeader={true} />

            <section className="pt-40 max-w-lg mx-auto px-6">
                <div className="bg-white border border-zinc-200 p-12 rounded-2xl shadow-xl space-y-12">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold uppercase tracking-tighter text-zinc-900 drop-shadow-sm">Member <span className="text-zinc-300 font-medium">Access</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Join our exclusive network of property enthusiasts.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-8">
                        {error && <p className="text-[10px] font-black text-red-600 text-center uppercase tracking-widest leading-relaxed bg-red-50 p-4 rounded-sm border border-red-100">{error}</p>}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`py-4 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${role === 'user' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-zinc-400'}`}
                            >
                                User Role
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`py-4 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${role === 'admin' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-emerald-200 shadow-md'}`}
                            >
                                Admin Role
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">FullName</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 text-sm focus:outline-none focus:border-zinc-950 rounded-lg transition-colors text-zinc-900 font-medium placeholder:text-zinc-300"
                                placeholder="Muskan Wagh"
                            />
                        </div>

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
                            {loading ? 'Authenticating...' : 'Sign Up Now'}
                        </button>
                    </form>

                    <div className="text-center pt-10 border-t border-zinc-100">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Already have an account?</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-3 text-xs font-black text-zinc-900 uppercase tracking-widest hover:underline underline-offset-10 transition-all font-outfit"
                        >
                            Log In Here
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
