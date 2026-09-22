import React from 'react';
import { CustomerMessage } from '../types';
import { Mail, Phone, MessageCircle, Check, Trash2, Clock } from 'lucide-react';

interface AdminMessagesProps {
  messages: CustomerMessage[];
  onUpdateStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;
  onDeleteMessage: (id: string) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onUpdateStatus,
  onDeleteMessage,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6AE62]">
            Relation Clientèle & Devis
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Demandes Clients & Messages
          </h1>
          <p className="text-xs text-[#A6A6A6]">
            {messages.length} messages reçus depuis le formulaire de contact et les fiches montures
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const cleanPhone = msg.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={msg.id}
                className={`p-6 border transition-colors ${
                  isUnread
                    ? 'bg-[#181818] border-[#D6AE62]/50'
                    : 'bg-[#151515] border-white/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isUnread ? 'bg-[#D6AE62]' : 'bg-transparent border border-white/30'
                      }`}
                    />
                    <h3 className="font-serif-luxury text-lg text-white font-semibold">{msg.name}</h3>
                    <span className="text-xs font-mono text-[#D6AE62]">{msg.phone}</span>
                    {msg.email && <span className="text-xs text-[#A6A6A6]">{msg.email}</span>}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#A6A6A6]">
                    <Clock className="w-3.5 h-3.5 text-[#D6AE62]" />
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-mono uppercase text-[#A6A6A6] block mb-1">
                    Objet : <strong className="text-white">{msg.subject}</strong>
                    {msg.productName && (
                      <span> · Monture concernée : <strong className="text-[#D6AE62]">{msg.productName}</strong></span>
                    )}
                  </span>
                  <p className="text-xs sm:text-sm text-[#E5E5E5] leading-relaxed bg-[#0B0B0B] p-4 border border-white/5">
                    {msg.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Bonjour ${msg.name}, suite à votre demande sur Votre Optique Maroc :`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onUpdateStatus(msg.id, 'replied')}
                      className="px-3 py-1.5 bg-[#D6AE62] text-[#0B0B0B] font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Répondre sur WhatsApp</span>
                    </a>

                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Votre Optique Maroc - Réponse à votre demande`
                        )}`}
                        onClick={() => onUpdateStatus(msg.id, 'replied')}
                        className="px-3 py-1.5 bg-[#0B0B0B] border border-white/10 text-white hover:text-[#D6AE62] flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnread ? (
                      <button
                        onClick={() => onUpdateStatus(msg.id, 'read')}
                        className="p-1.5 text-xs text-[#A6A6A6] hover:text-white"
                      >
                        Marquer comme lu
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{msg.status === 'replied' ? 'Répondu' : 'Lu'}</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce message ?')) {
                          onDeleteMessage(msg.id);
                        }
                      }}
                      className="p-1.5 text-[#A6A6A6] hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#151515] p-12 text-center text-[#A6A6A6] border border-white/5">
            Aucun message pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};
