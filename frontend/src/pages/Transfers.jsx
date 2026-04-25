import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Transfers({ user, setUser }) {
  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ArrowRightLeft className="text-indigo-600" size={32} /> Transfers
          </h1>
          <p className="text-slate-500 mt-1">Move stock between warehouse locations.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          + Initiate Transfer
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <ArrowRightLeft className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">No active transfers</h3>
        <p className="text-slate-500 mt-2">Move goods between bins or facilities.</p>
      </div>
    </DashboardLayout>
  );
}
