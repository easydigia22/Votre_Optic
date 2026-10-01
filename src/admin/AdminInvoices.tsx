import React, { useMemo, useState } from 'react';
import { Invoice, Client, StoreSettings, InvoiceDocType, InvoiceStatus } from '../types';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceDocument } from './InvoiceDocument';
import { formatMad } from '../services/billing';
import { FilePlus, Printer, Trash2, Pencil, ArrowRightLeft, Search, X } from 'lucide-react';

interface AdminInvoicesProps {
  invoices: Invoice[];
  clients: Client[];
  settings: StoreSettings;
  initialClientFilter?: string | null;
  onSaveInvoice: (i: Invoice) => Promise<Invoice> | void;
  onDeleteInvoice: (id: string) => Promise<void>;
  onConvertDevisToFacture: (devis: Invoice) => Promise<Invoice> | void;
  onEnsureClient: (name: string) => Promise<string>;
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: 'Brouillon',
  accepte: 'Accepté',
  refuse: 'Refusé',
  impayee: 'Impayée',
  payee: 'Payée',
  annulee: 'Annulée',
};

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  brouillon: 'text-gray-400',
  accepte: 'text-green-400',
  refuse: 'text-red-400',
  impayee: 'text-yellow-400',
  payee: 'text-emerald-400',
  annulee: 'text-gray-500 line-through',
};

const seedInvoice = (docType: InvoiceDocType): Invoice => ({
  id: crypto.randomUUID(),
  clientId: '',
  docType,
  number: '',
  docDate: new Date().toISOString().slice(0, 10),
  status: docType === 'devis' ? 'brouillon' : 'impayee',
  items: [{ label: '', qty: 1, unitPriceHt: 0 }],
  totalHt: 0,
  tvaRate: 20,
  tvaAmount: 0,
  totalTtc: 0,
  notes: '',
  sourceDevisId: null,
  createdAt: '',
  updatedAt: '',
});

export const AdminInvoices: React.FC<AdminInvoicesProps> = ({
  invoices,
  clients,
  settings,
  initialClientFilter,
  onSaveInvoice,
  onDeleteInvoice,
  onConvertDevisToFacture,
  onEnsureClient,
}) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'devis' | 'facture'>('all');
  const [clientFilter, setClientFilter] = useState<string | null>(initialClientFilter ?? null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [printing, setPrinting] = useState<Invoice | null>(null);

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.fullName ?? '—';

  const filteredClient = clients.find((c) => c.id === clientFilter) ?? null;

  const rows = useMemo(() => {
    return invoices.filter((i) => {
      if (typeFilter !== 'all' && i.docType !== typeFilter) return false;
      if (clientFilter && i.clientId !== clientFilter) return false;
      const hay = `${i.number} ${clientName(i.clientId)}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, typeFilter, clientFilter, query, clients]);

  const caFacture = invoices
    .filter((i) => i.docType === 'facture' && i.status !== 'annulee')
    .reduce((s, i) => s + i.totalTtc, 0);

  const impaye = invoices
    .filter((i) => i.docType === 'facture' && i.status === 'impayee')
    .reduce((s, i) => s + i.totalTtc, 0);

  const handleSave = async (draft: Invoice) => {
    await onSaveInvoice(draft);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce document ? Cette action est irréversible.')) return;
    await onDeleteInvoice(id);
  };

  const handleConvert = async (devis: Invoice) => {
    await onConvertDevisToFacture(devis);
  };

  const printingClient = printing
    ? clients.find((c) => c.id === printing.clientId) ?? null
    : null;

  return (
    <div className="space-y-4">
      {/* Totals banner */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1A1915] border border-white/10 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
            CA Facturé TTC
          </div>
          <div className="text-xl font-bold text-[#EDB21B] font-mono">
            {formatMad(caFacture)}
          </div>
          <div className="text-[10px] text-[#9F9A8E] mt-0.5">factures non annulées</div>
        </div>
        <div className="bg-[#1A1915] border border-white/10 px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
            Total Impayé
          </div>
          <div className="text-xl font-bold text-yellow-400 font-mono">
            {formatMad(impaye)}
          </div>
          <div className="text-[10px] text-[#9F9A8E] mt-0.5">factures impayées</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9F9A8E]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher numéro, client…"
            className="w-full bg-[#11110F] border border-white/10 text-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#EDB21B]"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1">
          {(['all', 'devis', 'facture'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                typeFilter === t
                  ? 'bg-[#EDB21B] text-[#0D0C0B] border-[#EDB21B] font-semibold'
                  : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {t === 'all' ? 'Tous' : t === 'devis' ? 'Devis' : 'Factures'}
            </button>
          ))}
        </div>

        {/* Client filter chip */}
        {filteredClient && (
          <div className="flex items-center gap-1.5 bg-[#EDB21B]/10 border border-[#EDB21B]/40 px-3 py-1.5 text-xs text-[#EDB21B]">
            <span>{filteredClient.fullName}</span>
            <button
              onClick={() => setClientFilter(null)}
              className="hover:text-white transition-colors"
              aria-label="Effacer le filtre client"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setEditing(seedInvoice('devis'))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-white/10 text-white/70 hover:border-[#EDB21B] hover:text-[#EDB21B] transition-colors"
          >
            <FilePlus size={14} />
            Nouveau devis
          </button>
          <button
            onClick={() => setEditing(seedInvoice('facture'))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#EDB21B] text-[#0D0C0B] font-semibold hover:bg-[#F5E6A6] transition-colors"
          >
            <FilePlus size={14} />
            Nouvelle facture
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/10 overflow-x-auto">
        <table className="w-full text-xs text-white/80">
          <thead>
            <tr className="border-b border-white/10 bg-[#11110F]">
              <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                Numéro
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                Type
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                Client
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                Date
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                Statut
              </th>
              <th className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#9F9A8E] font-normal">
                TTC
              </th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#9F9A8E] text-xs">
                  Aucun document trouvé.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[#EDB21B]">
                    {row.number || <span className="text-white/30 italic">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${
                        row.docType === 'devis'
                          ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                          : 'border-[#EDB21B]/30 text-[#EDB21B] bg-[#EDB21B]/10'
                      }`}
                    >
                      {row.docType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{clientName(row.clientId)}</td>
                  <td className="px-4 py-3 text-white/60">{row.docDate}</td>
                  <td className={`px-4 py-3 ${STATUS_COLORS[row.status]}`}>
                    {STATUS_LABELS[row.status]}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">
                    {formatMad(row.totalTtc)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(row)}
                        title="Éditer"
                        className="p-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const c = clients.find((cl) => cl.id === row.clientId);
                          if (!c) {
                            alert("Client introuvable — impossible d'imprimer.");
                            return;
                          }
                          setPrinting(row);
                        }}
                        title="Imprimer"
                        className="p-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <Printer size={14} />
                      </button>
                      {row.docType === 'devis' && (
                        <button
                          onClick={() => handleConvert(row)}
                          title="Convertir en facture"
                          className="p-1.5 text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                          <ArrowRightLeft size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(row.id)}
                        title="Supprimer"
                        className="p-1.5 text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-40 bg-black/70 overflow-auto p-4">
          <div className="mx-auto max-w-2xl bg-[#18170F] border border-white/10">
            {/* En-tête collant avec bouton Fermer bien visible */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#18170F] border-b border-white/10 px-6 py-4">
              <h2 className="text-sm font-semibold text-[#EDB21B] uppercase tracking-widest">
                {editing.number
                  ? `Modifier ${editing.docType} ${editing.number}`
                  : editing.docType === 'facture'
                  ? 'Nouvelle facture'
                  : 'Nouveau devis'}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Fermer sans enregistrer"
                title="Fermer sans enregistrer"
                className="flex items-center gap-1.5 bg-[#EDB21B] text-[#11110F] font-bold px-3 py-2 text-xs uppercase tracking-wide hover:bg-[#F5E6A6] transition-colors shadow-lg"
              >
                <X size={18} strokeWidth={3} />
                Fermer
              </button>
            </div>
            <div className="p-6">
              <InvoiceForm
                clients={clients}
                initial={editing}
                onEnsureClient={onEnsureClient}
                onSubmit={handleSave}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Print modal */}
      {printing && printingClient && (
        <InvoiceDocument
          invoice={printing}
          client={printingClient}
          settings={settings}
          onClose={() => setPrinting(null)}
        />
      )}
    </div>
  );
};
