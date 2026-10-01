import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem, InvoiceDocType, InvoiceStatus, Client } from '../types';
import { computeInvoiceTotals, formatMad } from '../services/billing';

const STATUS_BY_TYPE: Record<InvoiceDocType, InvoiceStatus[]> = {
  devis: ['brouillon', 'accepte', 'refuse'],
  facture: ['impayee', 'payee', 'annulee'],
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: 'Brouillon',
  accepte: 'Accepté',
  refuse: 'Refusé',
  impayee: 'Impayée',
  payee: 'Payée',
  annulee: 'Annulée',
};

const inputCls =
  'w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A]';

const labelCls = 'block text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1';

/** Parse a number input value safely; returns 0 for empty/NaN intermediate strings. */
const safeNum = (raw: string): number => {
  if (raw === '' || raw === '-') return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

// ─── Module-scope component — must NOT be defined inside InvoiceForm ───
interface ItemRowProps {
  idx: number;
  item: InvoiceItem;
  canRemove: boolean;
  onChange: (idx: number, k: keyof InvoiceItem, v: string | number) => void;
  onRemove: (idx: number) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ idx, item, canRemove, onChange, onRemove }) => (
  <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
    <input
      type="text"
      value={item.label}
      onChange={(e) => onChange(idx, 'label', e.target.value)}
      placeholder="Description de l'article"
      className={inputCls}
    />
    <input
      type="number"
      min="1"
      step="1"
      value={item.qty === 0 ? '' : item.qty}
      onChange={(e) => onChange(idx, 'qty', safeNum(e.target.value))}
      placeholder="Qté"
      className={inputCls + ' text-center'}
    />
    <input
      type="number"
      min="0"
      step="0.01"
      value={item.unitPriceHt === 0 ? '' : item.unitPriceHt}
      onChange={(e) => onChange(idx, 'unitPriceHt', safeNum(e.target.value))}
      placeholder="PU HT"
      className={inputCls + ' text-right'}
    />
    <button
      type="button"
      onClick={() => onRemove(idx)}
      disabled={!canRemove}
      className="flex items-center justify-center w-8 h-7 text-red-400 hover:text-red-300 disabled:opacity-20 disabled:cursor-not-allowed"
      aria-label="Supprimer la ligne"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

interface Props {
  clients: Client[];
  initial?: Invoice | null;
  defaultClientId?: string | null;
  /** Résout un nom saisi en clientId : relie un client existant ou en crée un. */
  onEnsureClient: (name: string) => Promise<string>;
  onSubmit: (i: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<Props> = ({
  clients,
  initial,
  defaultClientId,
  onEnsureClient,
  onSubmit,
  onCancel,
}) => {
  const initialItems = initial?.items ?? [{ label: '', qty: 1, unitPriceHt: 0 }];
  const [form, setForm] = useState<Invoice>(
    initial ?? {
      id: crypto.randomUUID(),
      clientId: defaultClientId ?? '',
      docType: 'devis',
      number: '',
      docDate: new Date().toISOString().slice(0, 10),
      status: 'brouillon',
      items: initialItems,
      totalHt: 0,
      tvaRate: 20,
      tvaAmount: 0,
      totalTtc: 0,
      notes: '',
      sourceDevisId: null,
      createdAt: '',
      updatedAt: '',
    },
  );
  // Stable UI-only row ids — never persisted; keeps input focus across add/remove
  const [rowIds, setRowIds] = useState<string[]>(() =>
    initialItems.map(() => crypto.randomUUID()),
  );

  // Nom du client saisi librement (autocomplétion sur les clients existants)
  const [clientNameInput, setClientNameInput] = useState<string>(() => {
    const linkedId = initial?.clientId ?? defaultClientId ?? '';
    return clients.find((c) => c.id === linkedId)?.fullName ?? '';
  });
  const [saving, setSaving] = useState(false);

  const totals = useMemo(
    () => computeInvoiceTotals(form.items, form.tvaRate),
    [form.items, form.tvaRate],
  );

  const handleDocTypeChange = (newType: InvoiceDocType) => {
    setForm((p) => ({
      ...p,
      docType: newType,
      status: STATUS_BY_TYPE[newType][0],
    }));
  };

  const handleItemChange = (idx: number, k: keyof InvoiceItem, v: string | number) => {
    setForm((p) => ({
      ...p,
      items: p.items.map((it, i) => (i === idx ? { ...it, [k]: v } : it)),
    }));
  };

  const addItem = () => {
    setForm((p) => ({ ...p, items: [...p.items, { label: '', qty: 1, unitPriceHt: 0 }] }));
    setRowIds((ids) => [...ids, crypto.randomUUID()]);
  };

  const removeItem = (idx: number) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
    setRowIds((ids) => ids.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = clientNameInput.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      const clientId = await onEnsureClient(name);
      onSubmit({ ...form, clientId, ...totals });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Client + docType + date + statut */}
      <div className="grid grid-cols-2 gap-4">
        {/* Client — saisie libre avec autocomplétion ; créé automatiquement si nouveau */}
        <div className="col-span-2">
          <label className={labelCls}>Client *</label>
          <input
            type="text"
            required
            list="invoice-client-suggestions"
            value={clientNameInput}
            onChange={(e) => setClientNameInput(e.target.value)}
            placeholder="Nom du client"
            autoComplete="off"
            className={inputCls}
          />
          <datalist id="invoice-client-suggestions">
            {clients.map((c) => (
              <option key={c.id} value={c.fullName} />
            ))}
          </datalist>
          <p className="mt-1 text-[10px] text-[#9F9A8E]">
            Un nouveau client est créé automatiquement si le nom n'existe pas encore.
          </p>
        </div>

        {/* Type de document */}
        <div>
          <label className={labelCls}>Type</label>
          <select
            value={form.docType}
            onChange={(e) => handleDocTypeChange(e.target.value as InvoiceDocType)}
            className={inputCls}
          >
            <option value="devis">Devis</option>
            <option value="facture">Facture</option>
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className={labelCls}>Statut</label>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as InvoiceStatus }))}
            className={inputCls}
          >
            {STATUS_BY_TYPE[form.docType].map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className={labelCls}>Date</label>
          <input
            type="date"
            value={form.docDate}
            onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
            className={inputCls}
          />
        </div>

        {/* Numéro (optionnel, généré en aval) */}
        <div>
          <label className={labelCls}>Numéro</label>
          <input
            type="text"
            value={form.number}
            onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
            placeholder="Auto-généré si vide"
            className={inputCls}
          />
        </div>
      </div>

      {/* Lignes d'articles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={labelCls + ' mb-0'}>Lignes</span>
          {/* Header labels */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_100px_32px] gap-2 flex-1 mx-4 text-[10px] uppercase tracking-widest text-[#9F9A8E]">
            <span>Description</span>
            <span className="text-center">Qté</span>
            <span className="text-right">PU HT (MAD)</span>
            <span />
          </div>
        </div>

        {/* Column header row */}
        <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 mb-1 text-[10px] uppercase tracking-widest text-[#9F9A8E]">
          <span>Description</span>
          <span className="text-center">Qté</span>
          <span className="text-right">PU HT</span>
          <span />
        </div>

        <div className="space-y-2">
          {form.items.map((item, idx) => (
            <ItemRow
              key={rowIds[idx]}
              idx={idx}
              item={item}
              canRemove={form.items.length > 1}
              onChange={handleItemChange}
              onRemove={removeItem}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 text-[#E3A72A] hover:text-[#F5E6A6] text-xs font-medium transition-colors"
        >
          <Plus size={14} />
          Ajouter une ligne
        </button>
      </div>

      {/* TVA */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Taux TVA (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={form.tvaRate === 0 ? '' : form.tvaRate}
            onChange={(e) =>
              setForm((p) => ({ ...p, tvaRate: safeNum(e.target.value) }))
            }
            className={inputCls}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={3}
          placeholder="Remarques, conditions particulières…"
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Récapitulatif */}
      <div className="border border-white/10 bg-[#11110F] px-4 py-3 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-2">Récapitulatif</div>
        <div className="flex justify-between text-xs text-white/70">
          <span>Total HT</span>
          <span className="font-mono">{formatMad(totals.totalHt)}</span>
        </div>
        <div className="flex justify-between text-xs text-white/70">
          <span>TVA ({form.tvaRate}%)</span>
          <span className="font-mono">{formatMad(totals.tvaAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-[#E3A72A] border-t border-white/10 pt-2 mt-1">
          <span>Total TTC</span>
          <span className="font-mono">{formatMad(totals.totalTtc)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs bg-[#E3A72A] text-[#0D0C0B] font-semibold hover:bg-[#F5E6A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};
