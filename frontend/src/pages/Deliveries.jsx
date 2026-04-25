import { useState } from 'react';
import { Truck } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Deliveries({ user, setUser }) {
  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Truck className="text-indigo-600" size={32} /> Deliveries
          </h1>
          <p className="text-slate-500 mt-1">Manage outbound shipments to customers.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          + New Delivery
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <Truck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">No outbound deliveries</h3>
        <p className="text-slate-500 mt-2">Log products leaving the warehouse here.</p>
      </div>
    </DashboardLayout>
  );
}
