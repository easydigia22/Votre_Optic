import React from 'react';
import { Invoice, Client, StoreSettings } from '../types';
import { formatMad } from '../services/billing';

interface Props {
  invoice: Invoice;
  client: Client;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceDocument: React.FC<Props> = ({ invoice, client, settings, onClose }) => {
  const title = invoice.docType === 'facture' ? 'FACTURE' : 'DEVIS';
  const legal = settings.legal ?? {};

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-auto p-4">
      {/* Printable document */}
      <div className="mx-auto max-w-3xl bg-white text-black print-document">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{settings.storeName}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {settings.address}
              {settings.city ? `, ${settings.city}` : ''}
              {settings.country ? `, ${settings.country}` : ''}
            </p>
            {settings.phone && (
              <p className="text-sm text-gray-600">Tél : {settings.phone}</p>
            )}
            {settings.email && (
              <p className="text-sm text-gray-600">Email : {settings.email}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">{title}</div>
            <div className="text-lg font-semibold text-gray-700 mt-1">{invoice.number}</div>
            <div className="text-sm text-gray-600 mt-1">Date : {invoice.docDate}</div>
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
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Désignation</th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700 w-16">Qté</th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700 w-28">PU HT</th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700 w-28">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm text-gray-800">{item.label}</td>
                <td className="py-2 px-3 text-sm text-center text-gray-800">{item.qty}</td>
                <td className="py-2 px-3 text-sm text-right text-gray-800">{formatMad(item.unitPriceHt)}</td>
                <td className="py-2 px-3 text-sm text-right text-gray-800">{formatMad(item.qty * item.unitPriceHt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals recap */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total HT</span>
              <span className="text-sm font-medium text-gray-900">{formatMad(invoice.totalHt)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm text-gray-600">TVA ({invoice.tvaRate} %)</span>
              <span className="text-sm font-medium text-gray-900">{formatMad(invoice.tvaAmount)}</span>
            </div>
            <div className="flex justify-between py-2 mt-1 border-t-2 border-gray-400">
              <span className="text-base font-bold text-gray-900">Total TTC</span>
              <span className="text-base font-bold text-gray-900">{formatMad(invoice.totalTtc)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Legal footer */}
        {(legal.ice || legal.if || legal.rc || legal.patente || legal.capital) && (
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            {legal.ice && <div>ICE : {legal.ice}</div>}
            {legal.if && <div>IF : {legal.if}</div>}
            {legal.rc && <div>RC : {legal.rc}</div>}
            {legal.patente && <div>Patente : {legal.patente}</div>}
            {legal.capital && <div>Capital : {legal.capital}</div>}
          </div>
        )}
      </div>

      {/* Action buttons — hidden at print */}
      <div className="no-print mx-auto max-w-3xl flex gap-2 mt-4">
        <button
          onClick={() => window.print()}
          className="bg-[#C9A42C] text-[#11110F] font-bold px-6 py-2 rounded hover:bg-[#E2BE54] transition-colors"
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
