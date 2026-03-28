'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, X } from 'lucide-react';

// Modular Sub-Components to remove repetition
const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 mb-10">{children}</p>
);

const FormInput = ({ label, placeholder, value, onChange, type = "text", required = true }) => (
    <div className="space-y-2 text-left">
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            required={required}
            className="w-full border-b border-zinc-200 bg-transparent py-3 px-1 focus:outline-none focus:border-zinc-950 text-sm font-bold transition-all placeholder:text-zinc-300"
            value={value}
            onChange={onChange}
        />
    </div>
);

const AboutUsPage = () => {
    const [team, setTeam] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', role: '' });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTeamAndStatus = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: adminData } = await supabase.from('admins').select('id').eq('id', session.user.id).single();
                if (adminData) setIsAdmin(true);
            }

            const { data: teamData, error } = await supabase.from('team').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            setTeam(teamData || []);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Core Logic Error:', err.message);
            }
            setTeam([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeamAndStatus();
    }, [fetchTeamAndStatus]);

    const handleDelete = async (memberId) => {
        if (!window.confirm('Terminate this asset member?')) return;
        const { error } = await supabase.from('team').delete().eq('id', memberId);
        if (!error) setTeam(prev => prev.filter(m => m.id !== memberId));
        else alert(`Termination Failed: ${error.message}`);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let image_url = '';
            if (imageFile) {
                const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
                const filePath = `team/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('properties').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('properties').getPublicUrl(filePath);
                image_url = publicUrl;
            }

            const { data, error } = await supabase.from('team').insert([{ ...newMember, image_url }]).select();
            if (error) throw error;
            if (data?.length > 0) {
                setTeam(prev => [...prev, data[0]]);
                setShowAddForm(false);
                setNewMember({ name: '', role: '' });
                setImageFile(null);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                alert('Error adding property: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <main className="min-h-screen bg-white font-outfit">
            <Navbar lightHeader={true} />
            <div className="pt-40 pb-32 px-6 max-w-xl mx-auto text-zinc-950">
                <header className="mb-24">
                    <h1 className="text-5xl font-black mb-20 tracking-tighter">About us</h1>
                    <SectionLabel>CORE PHILOSOPHY</SectionLabel>
                    <p className="text-base font-medium leading-relaxed text-zinc-500 italic">
                        "The pursuit of architectural excellence and human-centric design defines our every move."
                    </p>
                </header>

                <section className="mb-24">
                    <div className="flex justify-between items-end mb-4 pr-1">
                        <h2 className="text-3xl font-black tracking-tight underline underline-offset-8 decoration-zinc-100">Team</h2>
                        {isAdmin && (
                            <button onClick={() => setShowAddForm(!showAddForm)} className={`p-3 rounded-full transition-all border ${showAddForm ? 'bg-red-50 border-red-100 text-red-500 scale-90' : 'bg-zinc-50 border-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100'}`}>
                                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                            </button>
                        )}
                    </div>
                    <SectionLabel>THE ARCHITECTS</SectionLabel>

                    {showAddForm && (
                        <div className="mb-16 p-8 border border-zinc-100 rounded-2xl bg-zinc-50/50 backdrop-blur-sm shadow-xl animate-in slide-in-from-top-4 duration-500">
                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">Portrait Asset</label>
                                    <input type="file" accept="image/*" required onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 cursor-pointer" />
                                </div>
                                <FormInput label="Identity" placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                                <FormInput label="Designation" placeholder="Professional Role" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} />
                                <button disabled={submitting} className="w-full py-5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-xl active:scale-95">
                                    {submitting ? 'Transmitting Data...' : 'Establish Member'}
                                </button>
                            </form>
                        </div>
                    )}

                    <p className="text-sm font-medium leading-loose text-zinc-400 mb-16 max-w-sm">
                        Curating exceptional spaces requires an exceptional vision.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-20">
                        {team.map((member, idx) => (
                            <div key={member.id || idx} className="space-y-6 group relative animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                {isAdmin && member.id && (
                                    <button onClick={() => handleDelete(member.id)} className="absolute top-4 right-4 z-10 p-3 bg-white/90 border border-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-50 shadow-2xl hover:scale-110 active:scale-90"><Trash2 size={16} /></button>
                                )}
                                <div className="aspect-[4/5] bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                    {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full bg-gradient-to-br from-zinc-50 to-zinc-100 group-hover:scale-110 transition-transform duration-700" />}
                                </div>
                                <div className="group-hover:translate-x-1 transition-transform">
                                    <h3 className="text-xl font-black tracking-tighter text-zinc-950">{member.name}</h3>
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
};

export default AboutUsPage;