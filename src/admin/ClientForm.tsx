import React, { useState } from 'react';
import { Client } from '../types';

interface Props {
  initial?: Client | null;
  onSubmit: (c: Client) => void;
  onCancel: () => void;
}

const empty: Client = {
  id: '',
  clientCode: '',
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: 'Marrakech',
  birthDate: null,
  notes: '',
  createdAt: '',
  updatedAt: '',
};

export const ClientForm: React.FC<Props> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Client>(
    initial ?? { ...empty, id: crypto.randomUUID() },
  );

  const set = (k: keyof Client, v: string | null) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 text-xs"
    >
      {/* fullName */}
      <div>
        <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
          Nom complet *
        </label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
          placeholder="Prénom Nom"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* phone */}
        <div>
          <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
            Téléphone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
            placeholder="+212 6XX XXX XXX"
          />
        </div>

        {/* email */}
        <div>
          <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
            placeholder="client@email.com"
          />
        </div>
      </div>

      {/* address */}
      <div>
        <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
          Adresse
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
          placeholder="Rue, quartier…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* city */}
        <div>
          <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
            Ville
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
          />
        </div>

        {/* birthDate */}
        <div>
          <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
            Date de naissance
          </label>
          <input
            type="date"
            value={form.birthDate ?? ''}
            onChange={(e) => set('birthDate', e.target.value || null)}
            className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A]"
          />
        </div>
      </div>

      {/* notes */}
      <div>
        <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
          Notes
        </label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#E3A72A] resize-none"
          placeholder="Remarques internes…"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="bg-[#E3A72A] text-[#11110F] font-bold px-4 py-2 hover:bg-[#F0C24A] transition-colors"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-white/20 text-white px-4 py-2 hover:bg-white/5 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
