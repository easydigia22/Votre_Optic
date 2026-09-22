import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { storage } from '../services/storage';
import confetti from 'canvas-confetti';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
} from 'lucide-react';

interface ContactPageProps {
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Demande de renseignement ou essayage',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to storage
    storage.addMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D6AE62', '#E8C987', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Bonjour Votre Optique,\nJe m'appelle ${formData.name || 'un client'}.\nTéléphone: ${formData.phone || 'Non renseigné'}\nMessage: ${formData.message || 'Je souhaite des informations sur vos montures.'}`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EF] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#D6AE62] font-semibold">
            Boutique & Espace Conseil · Casablanca
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-white font-medium mt-1 mb-4">
            Contact & Rendez-vous
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed">
            Notre équipe d'opticiens diplômés vous accueille pour vos examens de la vue,
            le choix de vos montures de luxe et le centrage précis de vos verres.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Store Details (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#151515] border border-[#D6AE62]/20 p-6 sm:p-8 space-y-6">
              <h2 className="font-serif-luxury text-2xl text-[#F0D8A5]">
                Informations du Magasin
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider">
                      Téléphone
                    </span>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="font-mono font-bold text-white hover:text-[#D6AE62] transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62] shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider">
                      WhatsApp Direct
                    </span>
                    <a
                      href={`https://wa.me/${cleanNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-[#E8C987] hover:underline"
                    >
                      +212 770 420 663
                    </a>
                    <p className="text-[11px] text-[#A6A6A6] mt-0.5">
                      Réponse rapide 7j/7 pour devis et photos de modèles
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider">
                      Adresse
                    </span>
                    <p className="text-white">{settings.address}</p>
                    <p className="text-[#A6A6A6]">{settings.city}, {settings.country}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider">
                      Email
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-white hover:text-[#D6AE62]"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider">
                      Horaires d'ouverture
                    </span>
                    <p className="text-white">{settings.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-white/10">
                <span className="block text-[11px] text-[#A6A6A6] uppercase tracking-wider mb-3">
                  Suivez notre actualité
                </span>
                <div className="flex items-center gap-3">
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0B0B0B] border border-white/10 text-white hover:text-[#D6AE62] hover:border-[#D6AE62] transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0B0B0B] border border-white/10 text-white hover:text-[#D6AE62] hover:border-[#D6AE62] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialLinks.whatsapp && (
                    <a
                      href={settings.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0B0B0B] border border-white/10 text-[#D6AE62] hover:border-[#D6AE62] transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Google Maps / Location preview */}
            <div className="bg-[#151515] border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-white font-medium">Localisation Casablanca</span>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D6AE62] hover:underline"
                >
                  Ouvrir Google Maps →
                </a>
              </div>
              <div className="h-44 bg-[#0B0B0B] border border-white/5 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D6AE62_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative text-center z-10 p-4">
                  <MapPin className="w-8 h-8 text-[#D6AE62] mx-auto mb-1 animate-bounce" />
                  <p className="text-xs font-semibold text-white">{settings.address}</p>
                  <p className="text-[11px] text-[#A6A6A6]">Quartier Racine · Casablanca</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-[#151515] border border-white/10 p-6 sm:p-10">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mb-2">
                Envoyez-nous un Message
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A6A6] mb-8">
                Remplissez ce formulaire pour poser une question sur un modèle, demander un devis de
                verres ou planifier une consultation au magasin.
              </p>

              {submitted ? (
                <div className="bg-[#0B0B0B] border border-[#D6AE62]/40 p-8 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#151515] border border-[#D6AE62] text-[#D6AE62] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl text-[#F0D8A5]">
                    Message bien reçu !
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CCCCCC] max-w-md mx-auto">
                    Merci {formData.name}. Notre opticien vous contactera très rapidement par
                    téléphone ou email.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          subject: 'Demande de renseignement',
                          message: '',
                        });
                      }}
                      className="px-4 py-2 border border-white/10 text-xs text-[#A6A6A6] hover:text-white"
                    >
                      Envoyer un autre message
                    </button>
                    <button
                      onClick={handleWhatsAppDirect}
                      className="px-4 py-2 bg-[#D6AE62] text-[#0B0B0B] font-bold text-xs uppercase flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Continuer sur WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Omar Alami"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +212 661 000 000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Ex: contact@exemple.ma"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
                        Objet
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, subject: e.target.value }))
                        }
                        className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors"
                      >
                        <option value="Renseignement monture">Renseignement monture</option>
                        <option value="Devis verres optiques">Devis verres optiques / ordonnance</option>
                        <option value="Prise de rendez-vous">Prise de rendez-vous examen</option>
                        <option value="Disponibilité en magasin">Disponibilité en magasin</option>
                        <option value="Autre demande">Autre demande</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1.5 font-medium">
                      Votre Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Précisez votre demande, la monture souhaitée ou toute question particulière..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      className="w-full bg-[#0B0B0B] border border-white/10 focus:border-[#D6AE62] px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors resize-y"
                    />
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Envoi...' : 'Envoyer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-3.5 border border-[#D6AE62]/40 bg-[#0B0B0B] hover:bg-[#1E1E1E] text-[#F0D8A5] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-[#D6AE62]" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
