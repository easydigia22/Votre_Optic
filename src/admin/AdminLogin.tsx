import React, { useState } from 'react';
import { signInAdmin } from '../services/supabase';
import { Logo } from '../components/Logo';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState('admin@votreoptique.ma');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await signInAdmin(email.trim(), password);
      onLoginSuccess(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EF] flex items-center justify-center p-4 relative">
      {/* Back to store button */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 text-xs text-[#A6A6A6] hover:text-[#D6AE62] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au site public</span>
      </button>

      <div className="w-full max-w-md bg-[#151515] border border-[#D6AE62]/30 p-8 sm:p-10 shadow-2xl relative">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#D6AE62]" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B0B0B] border border-[#D6AE62]/30 text-[#E8C987] text-[11px] font-mono uppercase tracking-wider mb-2">
            <Shield className="w-3 h-3 text-[#D6AE62]" />
            <span>Portail Administrateur</span>
          </div>
          <h1 className="font-serif-luxury text-2xl text-white font-medium">
            Accès Sécurisé Back-Office
          </h1>
          <p className="text-xs text-[#A6A6A6] mt-1">
            Gestion du catalogue, des stocks et des promotions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
              Email Administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A6A6A6] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@votreoptique.ma"
                className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] text-xs sm:text-sm text-white pl-9 pr-3 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A6A6A6] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] text-xs sm:text-sm text-white pl-9 pr-3 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        {/* Security notice */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-[#0B0B0B] border border-white/5 text-[11px] text-[#A6A6A6] space-y-1.5">
            <p className="text-[#E8C987] font-semibold">Authentification sécurisée Supabase</p>
            <p>La session est limitée aux administrateurs autorisés.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
