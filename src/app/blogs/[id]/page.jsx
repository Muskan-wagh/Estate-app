import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Playfair_Display } from 'next/font/google';
import { MapPin, FileText, ExternalLink, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const revalidate = 3600; // Cache for 1 hour

export default async function BlogDetail({ params }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !blog) {
        return (
            <div className="pt-40 text-center font-sans">
                <h1 className="text-xl font-bold mb-4 uppercase text-black">Article Not Found</h1>
                <Link href="/blogs" className="text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 underline underline-offset-8">
                    <ArrowLeft size={14} /> Back to Directory
                </Link>
            </div>
        );
    }

    const renderMap = (mapLink) => {
        if (!mapLink || mapLink.length < 5) return null;

        if (mapLink.includes('<iframe')) {
            const cleanIframe = mapLink.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"');
            return <div dangerouslySetInnerHTML={{ __html: cleanIframe }} className="w-full h-full" />;
        }

        return (
            <iframe
                src={mapLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Property Map"
            />
        );
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans flex flex-col">
            <Navbar lightHeader={true} />

            <article className="flex-grow pt-40 max-w-4xl mx-auto px-6 w-full">
                {/* 1. Breadcrumbs */}
                <Link href="/blogs" className="text-black transition-colors inline-flex items-center gap-2 mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Editorial Directory</span>
                </Link>

                {/* 2. Hero Image Stack */}
                <header className="mb-20">
                    <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-100 mb-16">
                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-10 text-center sm:text-left">
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.3em]">
                            {new Date(blog.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>

                        <h1 className={`text-5xl md:text-8xl font-bold leading-[0.95] tracking-tighter ${playfair.className} max-w-4xl text-black`}>
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4">
                            <span className="text-[10px] font-black px-6 py-3 bg-black text-white rounded-full uppercase tracking-[0.2em]">{blog.property_type || 'Residential'}</span>
                            <span className="text-[10px] font-black px-6 py-3 bg-zinc-50 border border-black rounded-full uppercase tracking-[0.2em] text-black flex items-center gap-2">
                                <MapPin size={12} /> {blog.location || 'MP'}
                            </span>
                        </div>
                        <p className="text-sm font-black text-black uppercase tracking-widest pl-2">
                            LOCATION: {blog.address}
                        </p>
                    </div>
                </header>

                {/* 3. Property Assets Grid (Black Themed) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                    {blog.document_url && (
                        <a href={blog.document_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-8 bg-zinc-50 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-all group shadow-xl">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-black text-white rounded-2xl group-hover:bg-white group-hover:text-black transition-all shadow-lg"><FileText size={24} /></div>
                                <div className="space-y-1">
                                    <span className="text-[11px] font-black uppercase tracking-widest block">Legal Document</span>
                                    <span className="text-[9px] font-black uppercase block opacity-60">Download Asset</span>
                                </div>
                            </div>
                            <ExternalLink size={16} />
                        </a>
                    )}

                    {blog.mpbhulekh_link && (
                        <a href={blog.mpbhulekh_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-8 bg-zinc-50 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-all group shadow-xl">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-black text-white rounded-2xl group-hover:bg-white group-hover:text-black transition-all shadow-lg"><Globe size={24} /></div>
                                <div className="space-y-1">
                                    <span className="text-[11px] font-black uppercase tracking-widest block">Bhulekh Link</span>
                                    <span className="text-[9px] font-black uppercase block opacity-60">Land Records</span>
                                </div>
                            </div>
                            <ExternalLink size={16} />
                        </a>
                    )}
                </section>

                {/* 4. Content Narrative */}
                <div className="max-w-3xl mx-auto py-12 px-2 mb-32 border-t border-black">
                    <div className={`text-xl md:text-3xl leading-[1.6] text-black font-medium ${playfair.className} first-letter:text-9xl first-letter:font-black first-letter:mr-6 first-letter:float-left first-letter:leading-[0.7] first-letter:text-black`}>
                        <div className="whitespace-pre-wrap">{blog.content}</div>
                    </div>
                </div>

                {/* 5. Map Section */}
                {blog.map_link && blog.map_link.length > 5 && (
                    <div className="mt-20 mb-40 space-y-12">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="h-[3px] w-16 bg-black mb-4" />
                            <p className="text-[11px] font-black text-black uppercase tracking-[0.5em]">REGIONAL MAPPING</p>
                        </div>
                        <div className="w-full aspect-video rounded-[3.5rem] overflow-hidden border-4 border-black transition-all duration-1000 shadow-2xl bg-zinc-50">
                            {renderMap(blog.map_link)}
                        </div>
                    </div>
                )}
            </article>

            <Footer />
        </main>
    );
}
