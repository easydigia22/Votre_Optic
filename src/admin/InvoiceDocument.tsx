import React from 'react';
import { Invoice, Client, StoreSettings } from '../types';
import { formatMad, amountToFrenchMad } from '../services/billing';

interface Props {
  invoice: Invoice;
  client: Client;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceDocument: React.FC<Props> = ({ invoice, client, settings, onClose }) => {
  const title = invoice.docType === 'facture' ? 'FACTURE' : 'DEVIS';
  const legal = settings.legal ?? {};
  // Mode sans TVA : taux 0 (ou montant TVA nul) -> on masque le détail HT/TVA
  const noTva = !invoice.tvaRate || invoice.tvaAmount === 0;
  const htSuffix = noTva ? '' : ' HT';

  // Adresse propre : fusionne adresse + ville + pays en supprimant les doublons
  const locationLine = Array.from(
    new Map(
      [settings.address, settings.city, settings.country]
        .flatMap((part) => (part ?? '').split(','))
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => [t.toLowerCase(), t]),
    ).values(),
  ).join(', ');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-auto p-4">
      {/* Printable document */}
      <div className="mx-auto max-w-3xl bg-white text-black print-document border-t-4 border-[#EDB21B] p-8 sm:p-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-300">
          <div>
            <img
              src="/logo-officiel.jpg"
              alt="Vôtre Optique"
              className="h-16 w-auto object-contain mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-900">{settings.storeName}</h1>
            {settings.tagline && (
              <p className="text-xs italic text-[#C6900F]">{settings.tagline}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold text-[#C6900F] tracking-wide">{title}</div>
            <div className="text-sm font-semibold text-gray-800 mt-1 whitespace-nowrap">
              N° {invoice.number}
            </div>
            <div className="text-sm text-gray-600 mt-1 whitespace-nowrap">Date : {invoice.docDate}</div>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700 border border-gray-300">
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Client block */}
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Client</h2>
          <p className="font-semibold text-gray-900">{client.fullName}</p>
          <p className="text-sm text-gray-600">Code : {client.clientCode}</p>
          {client.phone && <p className="text-sm text-gray-600">Tél : {client.phone}</p>}
          {client.email && <p className="text-sm text-gray-600">Email : {client.email}</p>}
          {client.address && (
            <p className="text-sm text-gray-600">
              {client.address}
              {client.city ? `, ${client.city}` : ''}
            </p>
          )}
        </div>

        {/* Items table */}
        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="bg-[#EDB21B] border-b-2 border-[#C6900F]">
              <th className="text-left py-2 px-3 text-sm font-bold text-[#11110F]">Désignation</th>
              <th className="text-center py-2 px-3 text-sm font-bold text-[#11110F] w-16">Qté</th>
              <th className="text-right py-2 px-3 text-sm font-bold text-[#11110F] w-28">PU{htSuffix}</th>
              <th className="text-right py-2 px-3 text-sm font-bold text-[#11110F] w-28">Total{htSuffix}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm text-gray-800">{item.label}</td>
                <td className="py-2 px-3 text-sm text-center text-gray-800">{item.qty}</td>
                <td className="py-2 px-3 text-sm text-right text-gray-800">{(Number(item.unitPriceHt) || 0).toFixed(2)}</td>
                <td className="py-2 px-3 text-sm text-right text-gray-800">{((Number(item.qty) || 0) * (Number(item.unitPriceHt) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals recap */}
        <div className="flex justify-end mb-3">
          <div className="w-72">
            {!noTva && (
              <>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total HT</span>
                  <span className="text-sm font-medium text-gray-900">{formatMad(invoice.totalHt)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-sm text-gray-600">TVA ({invoice.tvaRate} %)</span>
                  <span className="text-sm font-medium text-gray-900">{formatMad(invoice.tvaAmount)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center py-2.5 px-3 mt-1 bg-[#EDB21B] border border-[#C6900F]">
              <span className="text-base font-extrabold text-[#11110F]">
                {noTva ? 'Total' : 'Total TTC'}
              </span>
              <span className="text-base font-extrabold text-[#11110F]">{formatMad(invoice.totalTtc)}</span>
            </div>
          </div>
        </div>

        {/* Montant en toutes lettres (sous le total, à gauche) */}
        <div className="mb-6 text-sm text-gray-800 border-l-4 border-[#EDB21B] pl-3 py-1">
          <span className="font-semibold">
            {invoice.docType === 'facture'
              ? 'Arrêtée la présente facture à la somme de : '
              : 'Arrêté le présent devis à la somme de : '}
          </span>
          <span className="italic">{amountToFrenchMad(invoice.totalTtc)}</span>.
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Pied de page — coordonnées du magasin + mentions légales */}
        <div className="mt-10 pt-4 border-t-2 border-[#EDB21B] text-xs text-gray-600 space-y-1 text-center">
          <p className="font-bold text-gray-800">{settings.storeName}</p>
          {locationLine && <p>{locationLine}</p>}
          <p>
            {settings.phone && <span>Tél : {settings.phone}</span>}
            {settings.phone && settings.email && <span className="mx-2">·</span>}
            {settings.email && <span>Email : {settings.email}</span>}
          </p>
          {(legal.ice || legal.if || legal.rc || legal.patente || legal.capital) && (
            <p className="text-gray-500 pt-1">
              {[
                legal.ice && `ICE : ${legal.ice}`,
                legal.if && `IF : ${legal.if}`,
                legal.rc && `RC : ${legal.rc}`,
                legal.patente && `Patente : ${legal.patente}`,
                legal.capital && `Capital : ${legal.capital}`,
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons — hidden at print */}
      <div className="no-print mx-auto max-w-3xl flex gap-2 mt-4">
        <button
          onClick={() => window.print()}
          className="bg-[#EDB21B] text-[#11110F] font-bold px-6 py-2 rounded hover:bg-[#F5C94E] transition-colors"
        >
          Imprimer / PDF
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 text-white px-6 py-2 rounded border border-white/30 hover:bg-white/20 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
