import { getSession } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the admin email. Replace this with your actual admin email.
const ADMIN_EMAIL = 'maahi@example.com';

export default async function AdminDashboard() {
    const session = await getSession();

    // Redirect if not logged in
    if (!session) {
        redirect('/login');
    }

    // Role-based protection: Only specific person can access admin panel
    if (session.user.email !== ADMIN_EMAIL) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black uppercase tracking-widest italic mb-6 text-red-500">Access Denied</h1>
                <p className="text-zinc-500 max-w-sm mb-12 uppercase text-xs font-bold leading-relaxed tracking-widest leading-relaxed">
                    You do not have the clearance (Admin Role) to access this zone.
                </p>
                <Link href="/" className="px-8 py-3 border border-white/20 text-white text-sm font-black uppercase tracking-widest rounded-sm hover:bg-white/5 transition-colors">
                    Return to HQ
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-16">
            <Navbar />

            <section className="pt-40 max-w-7xl mx-auto px-6 space-y-16">
                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Partner <span className="text-zinc-500">Dashboard</span></h1>
                    <p className="max-w-xl text-lg text-zinc-400 font-medium italic leading-relaxed">
                        Management clearance for {session.user.email} (Admin).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Link href="/admin/properties/add" className="group bg-zinc-900/40 p-12 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="space-y-4 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Inventory</span>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic group-hover:text-emerald-400 transition-colors underline underline-offset-8 decoration-1 decoration-zinc-800 group-hover:decoration-emerald-500/50">Add Property</h2>
                        </div>
                        <div className="absolute top-0 right-0 p-8 text-6xl font-black italic text-zinc-900 group-hover:text-emerald-950 transition-colors pointer-events-none">01.</div>
                    </Link>

                    <Link href="/admin/blogs/add" className="group bg-zinc-900/40 p-12 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="space-y-4 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Insights</span>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic group-hover:text-emerald-400 transition-colors underline underline-offset-8 decoration-1 decoration-zinc-800 group-hover:decoration-emerald-500/50">Post Article</h2>
                        </div>
                        <div className="absolute top-0 right-0 p-8 text-6xl font-black italic text-zinc-900 group-hover:text-emerald-950 transition-colors pointer-events-none">02.</div>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
