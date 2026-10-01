import React, { useState, useRef } from 'react';
import { Client, Prescription, Invoice } from '../types';
import { ClientForm } from './ClientForm';
import { PrescriptionForm } from './PrescriptionForm';
import { formatMad } from '../services/billing';
import { UserPlus, Search, Trash2, Pencil, FileText, Eye } from 'lucide-react';

interface AdminClientsProps {
  clients: Client[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  onSaveClient: (c: Client) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
  onSavePrescription: (p: Prescription) => Promise<void>;
  onDeletePrescription: (id: string) => Promise<void>;
  onNavigateToInvoice: (clientId: string) => void;
}

export const AdminClients: React.FC<AdminClientsProps> = ({
  clients,
  prescriptions,
  invoices,
  onSaveClient,
  onDeleteClient,
  onSavePrescription,
  onDeletePrescription,
  onNavigateToInvoice,
}) => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [addingPrescription, setAddingPrescription] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Ouvre le formulaire de mesures de vue et fait défiler jusqu'à lui
  const openPrescriptionForm = () => {
    setEditingPrescription(null);
    setAddingPrescription(true);
    setTimeout(() => {
      prescriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const filtered = clients.filter((c) =>
    [c.fullName, c.phone, c.clientCode]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const selected = clients.find((c) => c.id === selectedId) ?? null;
  const clientPrescriptions = prescriptions.filter((p) => p.clientId === selectedId);
  const clientInvoices = invoices.filter((i) => i.clientId === selectedId);

  const handleSave = async (c: Client, openMeasures = false) => {
    await onSaveClient(c);
    setSelectedId(c.id);
    setEditing(false);
    setAddingNew(false);
    // Après la création d'un nouveau client, ouvrir directement la saisie des mesures
    if (openMeasures) {
      setEditingPrescription(null);
      setAddingPrescription(true);
      setTimeout(() => {
        prescriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce client ? Cette action est irréversible.')) return;
    await onDeleteClient(id);
    if (selectedId === id) setSelectedId(null);
  };

  const statusLabel: Record<string, string> = {
    brouillon: 'Brouillon',
    accepte: 'Accepté',
    refuse: 'Refusé',
    impayee: 'Impayée',
    payee: 'Payée',
    annulee: 'Annulée',
  };

  const statusColor: Record<string, string> = {
    brouillon: 'text-[#9F9A8E]',
    accepte: 'text-emerald-400',
    refuse: 'text-red-400',
    impayee: 'text-amber-400',
    payee: 'text-emerald-400',
    annulee: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C9A42C]">
            Gestion
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Clients
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            {clients.length} client{clients.length !== 1 ? 's' : ''} enregistré{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setAddingNew(true); setEditing(false); setSelectedId(null); }}
          className="flex items-center gap-2 bg-[#C9A42C] text-[#11110F] font-bold px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#E2BE54] transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      {/* New client form (full-width when open) */}
      {addingNew && (
        <div className="bg-[#1B1A15] border border-white/5 p-6">
          <h2 className="font-serif-luxury text-lg text-[#F5E6A6] mb-1">Nouveau client</h2>
          <p className="text-xs text-[#9F9A8E] mb-4">
            Après l'enregistrement, la saisie des mesures de vue s'ouvre automatiquement.
          </p>
          <ClientForm
            onSubmit={(c) => void handleSave(c, true)}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — search + list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9F9A8E]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-[#11110F] border border-white/10 text-white pl-8 pr-3 py-2.5 text-xs outline-none focus:border-[#C9A42C]"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs text-[#9F9A8E] px-1">Aucun client trouvé.</p>
          ) : (
            <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => { setSelectedId(c.id); setEditing(false); }}
                    className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${
                      selectedId === c.id
                        ? 'bg-[#C9A42C]/10 border border-[#C9A42C]/30 text-white'
                        : 'bg-[#1B1A15] border border-white/5 text-[#9F9A8E] hover:text-white hover:bg-[#15140F]'
                    }`}
                  >
                    <div className="font-semibold text-white truncate">{c.fullName}</div>
                    <div className="flex gap-2 mt-0.5 text-[10px]">
                      <span className="text-[#C9A42C]">{c.clientCode || '—'}</span>
                      <span>{c.city}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT — client detail */}
        <div className="lg:col-span-2">
          {!selected && !addingNew && (
            <div className="bg-[#1B1A15] border border-white/5 p-8 text-center text-xs text-[#9F9A8E]">
              Sélectionnez un client ou créez-en un nouveau.
            </div>
          )}

          {selected && !addingNew && (
            <div className="space-y-4">
              {/* ── Coordonnées ── */}
              <div className="bg-[#1B1A15] border border-white/5 p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-serif-luxury text-lg text-[#F5E6A6]">{selected.fullName}</h2>
                    <span className="text-[10px] font-mono text-[#C9A42C]">{selected.clientCode}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={openPrescriptionForm}
                      className="flex items-center gap-1.5 bg-[#C9A42C] text-[#11110F] font-bold px-3 py-1.5 text-xs uppercase tracking-wide hover:bg-[#E2BE54] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Mesures de vue
                    </button>
                    <button
                      onClick={() => setEditing((v) => !v)}
                      className="flex items-center gap-1.5 border border-white/20 text-white px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Éditer
                    </button>
                    <button
                      onClick={() => void handleDelete(selected.id)}
                      className="flex items-center gap-1.5 border border-red-800/50 text-red-400 px-3 py-1.5 text-xs hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editing ? (
                  <ClientForm
                    initial={selected}
                    onSubmit={(c) => void handleSave(c)}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    {[
                      ['Téléphone', selected.phone || '—'],
                      ['Email', selected.email || '—'],
                      ['Ville', selected.city],
                      ['Naissance', selected.birthDate || '—'],
                      ['Adresse', selected.address || '—'],
                      ['Notes', selected.notes || '—'],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <dt className="text-[#9F9A8E] uppercase text-[10px] font-semibold">{label}</dt>
                        <dd className="text-white mt-0.5">{val}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {/* ── Ordonnances — mesures de vue ── */}
              <div ref={prescriptionRef} className="bg-[#1B1A15] border border-[#C9A42C]/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#C9A42C]" />
                    Ordonnances — mesures de vue
                  </h3>
                  {!addingPrescription && !editingPrescription && (
                    <button
                      onClick={openPrescriptionForm}
                      className="flex items-center gap-1.5 bg-[#C9A42C] text-[#11110F] font-bold px-4 py-2 text-xs uppercase tracking-wide hover:bg-[#E2BE54] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Saisir les mesures de vue
                    </button>
                  )}
                </div>

                {(addingPrescription || editingPrescription) && (
                  <div className="border border-white/5 bg-[#11110F] p-4">
                    <h4 className="text-xs font-semibold text-[#F5E6A6] mb-3">
                      {editingPrescription ? 'Modifier l\'ordonnance' : 'Nouvelle ordonnance'}
                    </h4>
                    <PrescriptionForm
                      clientId={selected.id}
                      initial={editingPrescription ?? null}
                      onSubmit={(p) => {
                        void onSavePrescription(p);
                        setAddingPrescription(false);
                        setEditingPrescription(null);
                      }}
                      onCancel={() => {
                        setAddingPrescription(false);
                        setEditingPrescription(null);
                      }}
                    />
                  </div>
                )}

                {clientPrescriptions.length === 0 ? (
                  !addingPrescription && !editingPrescription && (
                    <div className="border border-dashed border-[#C9A42C]/30 bg-[#11110F] px-4 py-6 text-center space-y-3">
                      <p className="text-xs text-[#9F9A8E]">
                        Aucune mesure de vue enregistrée pour ce client.
                      </p>
                      <button
                        onClick={openPrescriptionForm}
                        className="inline-flex items-center gap-1.5 bg-[#C9A42C] text-[#11110F] font-bold px-4 py-2 text-xs uppercase tracking-wide hover:bg-[#E2BE54] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Saisir les mesures de vue
                      </button>
                    </div>
                  )
                ) : (
                  <ul className="space-y-2">
                    {clientPrescriptions.map((p) => (
                      <li
                        key={p.id}
                        className="bg-[#11110F] border border-white/5 px-3 py-2 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-[#9F9A8E] flex gap-3">
                            <span>{p.prescriptionDate}</span>
                            <span>{p.prescriber || '—'}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setEditingPrescription(p); setAddingPrescription(false); }}
                              className="text-[#9F9A8E] hover:text-[#C9A42C] transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Supprimer cette ordonnance ? Cette action est irréversible.')) {
                                  void onDeletePrescription(p.id);
                                }
                              }}
                              className="text-[#9F9A8E] hover:text-red-400 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-white font-mono text-[10px]">
                          OD : S {p.right.sphere ?? '—'} / C {p.right.cylinder ?? '—'} / A {p.right.axis ?? '—'}
                          {p.right.addition != null ? ` / Add ${p.right.addition}` : ''}
                          &nbsp;&nbsp;|&nbsp;&nbsp;
                          OG : S {p.left.sphere ?? '—'} / C {p.left.cylinder ?? '—'} / A {p.left.axis ?? '—'}
                          {p.left.addition != null ? ` / Add ${p.left.addition}` : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ── Devis & Factures ── */}
              <div className="bg-[#1B1A15] border border-white/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C9A42C]" />
                    Devis &amp; Factures
                  </h3>
                  <button
                    onClick={() => onNavigateToInvoice(selected.id)}
                    className="flex items-center gap-1.5 border border-[#C9A42C]/40 text-[#C9A42C] px-3 py-1.5 text-xs hover:bg-[#C9A42C]/10 transition-colors"
                  >
                    Voir dans Facturation
                  </button>
                </div>

                {clientInvoices.length === 0 ? (
                  <p className="text-xs text-[#9F9A8E]">Aucun devis ni facture.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {clientInvoices.map((inv) => (
                      <li
                        key={inv.id}
                        className="bg-[#11110F] border border-white/5 px-3 py-2 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-white">{inv.number}</span>
                          <span className="ml-2 text-[#9F9A8E] capitalize">{inv.docType}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={statusColor[inv.status] ?? 'text-white'}>
                            {statusLabel[inv.status] ?? inv.status}
                          </span>
                          <span className="text-white font-semibold">{formatMad(inv.totalTtc)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
