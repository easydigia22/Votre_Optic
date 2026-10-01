import React, { useState } from 'react';
import { Prescription, EyePrescription } from '../types';
import { formatDiopter, computeNear } from '../services/billing';

const num = (v: string): number | null => (v.trim() === '' ? null : Number(v));

const emptyEye: EyePrescription = { sphere: null, cylinder: null, axis: null, addition: null };

interface Props {
  clientId: string;
  initial?: Prescription | null;
  onSubmit: (p: Prescription) => void;
  onCancel: () => void;
}

const inputCls =
  'w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A] text-center';

// ─── Module-scope component — must NOT be defined inside PrescriptionForm ───
interface EyeRowProps {
  label: string;
  eye: EyePrescription;
  vp: string;
  onChange: (k: keyof EyePrescription, v: number | null) => void;
}

const EyeRow: React.FC<EyeRowProps> = ({ label, eye, vp, onChange }) => (
  <tr className="border-b border-white/5">
    <td className="py-2 pr-3 text-xs font-semibold text-[#E3A72A] whitespace-nowrap">{label}</td>
    <td className="py-1.5 px-1">
      <input
        type="number"
        step="0.25"
        value={eye.sphere ?? ''}
        onChange={(e) => onChange('sphere', num(e.target.value))}
        className={inputCls}
        placeholder="—"
      />
    </td>
    <td className="py-1.5 px-1">
      <input
        type="number"
        step="0.25"
        value={eye.cylinder ?? ''}
        onChange={(e) => onChange('cylinder', num(e.target.value))}
        className={inputCls}
        placeholder="—"
      />
    </td>
    <td className="py-1.5 px-1">
      <input
        type="number"
        step="1"
        min="0"
        max="180"
        value={eye.axis ?? ''}
        onChange={(e) => onChange('axis', num(e.target.value))}
        className={inputCls}
        placeholder="—"
      />
    </td>
    <td className="py-1.5 px-1">
      <input
        type="number"
        step="0.25"
        value={eye.addition ?? ''}
        onChange={(e) => onChange('addition', num(e.target.value))}
        className={inputCls}
        placeholder="—"
      />
    </td>
    <td className="py-1.5 pl-3 text-xs font-mono text-[#F5E6A6] whitespace-nowrap">
      {vp || '—'}
    </td>
  </tr>
);

export const PrescriptionForm: React.FC<Props> = ({ clientId, initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Prescription>(
    initial ?? {
      id: crypto.randomUUID(),
      clientId,
      prescriptionDate: new Date().toISOString().slice(0, 10),
      prescriber: '',
      right: { ...emptyEye },
      left: { ...emptyEye },
      pd: null,
      pdRight: null,
      pdLeft: null,
      notes: '',
      createdAt: '',
      updatedAt: '',
    },
  );

  const setEye = (side: 'right' | 'left', k: keyof EyePrescription, v: number | null) =>
    setForm((p) => ({ ...p, [side]: { ...p[side], [k]: v } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const vpRight = formatDiopter(computeNear(form.right.sphere, form.right.addition));
  const vpLeft = formatDiopter(computeNear(form.left.sphere, form.left.addition));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
            Date de prescription
          </label>
          <input
            type="date"
            value={form.prescriptionDate}
            onChange={(e) => setForm((p) => ({ ...p, prescriptionDate: e.target.value }))}
            className="w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
            Prescripteur
          </label>
          <input
            type="text"
            value={form.prescriber}
            onChange={(e) => setForm((p) => ({ ...p, prescriber: e.target.value }))}
            className="w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A]"
            placeholder="Dr. …"
          />
        </div>
      </div>

      {/* Eye table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3 text-[10px] uppercase tracking-widest text-[#9F9A8E] w-12"></th>
              <th className="py-2 px-1 text-[10px] uppercase tracking-widest text-[#9F9A8E]">Sphère</th>
              <th className="py-2 px-1 text-[10px] uppercase tracking-widest text-[#9F9A8E]">Cylindre</th>
              <th className="py-2 px-1 text-[10px] uppercase tracking-widest text-[#9F9A8E]">Axe</th>
              <th className="py-2 px-1 text-[10px] uppercase tracking-widest text-[#9F9A8E]">Addition</th>
              <th className="py-2 pl-3 text-left text-[10px] uppercase tracking-widest text-[#9F9A8E]">VP</th>
            </tr>
          </thead>
          <tbody>
            <EyeRow
              label="OD"
              eye={form.right}
              vp={vpRight}
              onChange={(k, v) => setEye('right', k, v)}
            />
            <EyeRow
              label="OG"
              eye={form.left}
              vp={vpLeft}
              onChange={(k, v) => setEye('left', k, v)}
            />
          </tbody>
        </table>
      </div>

      {/* PD */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            ['pd', 'ÉP Total (mm)'],
            ['pdRight', 'ÉP Droit (mm)'],
            ['pdLeft', 'ÉP Gauche (mm)'],
          ] as const
        ).map(([field, label]) => (
          <div key={field}>
            <label className="block text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
              {label}
            </label>
            <input
              type="number"
              step="0.5"
              value={form[field] ?? ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, [field]: num(e.target.value) }))
              }
              className="w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A]"
              placeholder="—"
            />
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-[#9F9A8E] mb-1">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={2}
          className="w-full bg-[#11110F] border border-white/10 text-white px-2 py-1.5 text-xs outline-none focus:border-[#E3A72A] resize-none"
          placeholder="Remarques…"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="border border-white/20 text-[#9F9A8E] px-4 py-2 text-xs hover:text-white hover:bg-white/5 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[#E3A72A] text-[#11110F] font-bold px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#F0C24A] transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};
