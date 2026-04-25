import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function StockLedger({ user, setUser }) {
  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileSpreadsheet className="text-indigo-600" size={32} /> Stock Ledger
          </h1>
          <p className="text-slate-500 mt-1">Complete audit trail of all inventory movements.</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition shadow-sm">
          Export CSV
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <FileSpreadsheet className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Ledger History</h3>
        <p className="text-slate-500 mt-2">Your historical transactions will appear here.</p>
      </div>
    </DashboardLayout>
  );
}
