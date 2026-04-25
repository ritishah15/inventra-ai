import { useState } from 'react';
import { Box } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Receipts({ user, setUser }) {
  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Box className="text-indigo-600" size={32} /> Receipts
          </h1>
          <p className="text-slate-500 mt-1">Log incoming inventory from suppliers.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          + New Receipt
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <Box className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">No recent receipts</h3>
        <p className="text-slate-500 mt-2">When suppliers deliver stock, log them here.</p>
      </div>
    </DashboardLayout>
  );
}
