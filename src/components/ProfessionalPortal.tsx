import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ArrowRight,
  BriefcaseBusiness,
  LogOut,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import type { StoreSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfessionalPortalProps {
  settings: StoreSettings;
  onNavigate: (view: string) => void;
}

export const ProfessionalPortal: React.FC<ProfessionalPortalProps> = ({ settings, onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (!supabase) {
      setError("L'espace professionnel n'est pas encore configuré.");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setSubmitting(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      if (signInError) throw signInError;
      setUser(data.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de continuer.');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#11110F] pt-32 text-center text-[#9F9A8E]">Chargement de votre espace…</div>;
  }

  if (user) {
    const metadata = user.user_metadata ?? {};
    const whatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
    return (
      <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="border border-[#C6A53A]/30 bg-[#1B1A15] p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A53A] mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Espace professionnel sécurisé
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white">
                  Bienvenue, {metadata.full_name || user.email}
                </h1>
                <p className="text-sm text-[#9F9A8E] mt-2">
                  {metadata.company || 'Compte professionnel Votre Optique'}
                </p>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-xs text-[#9F9A8E] hover:text-white">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
              <div className="border border-white/10 bg-[#11110F] p-5">
                <Mail className="w-5 h-5 text-[#C6A53A] mb-3" />
                <p className="text-[11px] uppercase tracking-wider text-[#9F9A8E]">Email</p>
                <p className="text-sm mt-1 break-all">{user.email}</p>
              </div>
              <div className="border border-white/10 bg-[#11110F] p-5">
                <BriefcaseBusiness className="w-5 h-5 text-[#C6A53A] mb-3" />
                <p className="text-[11px] uppercase tracking-wider text-[#9F9A8E]">Entreprise</p>
                <p className="text-sm mt-1">{metadata.company || 'À compléter'}</p>
              </div>
              <div className="border border-white/10 bg-[#11110F] p-5">
                <Smartphone className="w-5 h-5 text-[#C6A53A] mb-3" />
                <p className="text-[11px] uppercase tracking-wider text-[#9F9A8E]">Application</p>
                <div className="mt-2"><PWAInstallButton compact /></div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <button onClick={() => onNavigate('catalogue')} className="p-5 bg-[#C6A53A] text-[#11110F] text-left flex items-center justify-between font-semibold">
                Découvrir le catalogue professionnel <ArrowRight className="w-5 h-5" />
              </button>
              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Bonjour Votre Optique, je vous contacte depuis mon espace professionnel.')}`} target="_blank" rel="noreferrer" className="p-5 border border-[#C6A53A]/40 text-[#F5E6A6] flex items-center justify-between font-semibold">
                Conseiller WhatsApp <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] pt-28 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <section className="border border-white/10 bg-[#171612] p-7 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A53A]">
              <ShieldCheck className="w-4 h-4" /> Espace Professionnel
            </div>
            <h1 className="font-serif-luxury text-3xl text-white mt-3">Connexion</h1>
          </div>

          {error && <div className="mb-5 p-3 border border-red-800 bg-red-950/30 text-sm text-red-300">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-[#9F9A8E]">Email</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full bg-[#11110F] border border-white/10 p-2.5 outline-none focus:border-[#C6A53A]" />
            </label>
            <label className="block">
              <span className="text-xs text-[#9F9A8E]">Mot de passe</span>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full bg-[#11110F] border border-white/10 p-2.5 outline-none focus:border-[#C6A53A]" />
            </label>
            <button disabled={submitting} className="w-full py-3 bg-[#C6A53A] hover:bg-[#E3C866] disabled:opacity-60 text-[#11110F] font-bold text-xs uppercase tracking-widest">
              {submitting ? 'Veuillez patienter…' : 'Se connecter'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
