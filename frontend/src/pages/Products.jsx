import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageSearch } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Products({ user, setUser }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/inventory/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // We can just grab the low stock list for now, ideally we want a full /products route
        setProducts(res.data.lowStockItems || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <DashboardLayout user={user} setUser={setUser}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <PackageSearch className="text-indigo-600" size={32} /> Products
          </h1>
          <p className="text-slate-500 mt-1">Manage your complete inventory catalog.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          + Add Product
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Product Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Current Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Reorder Level</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                <td className="px-6 py-4 text-slate-600">{p.current}</td>
                <td className="px-6 py-4 text-slate-500">{p.reorder_level}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    p.current < p.reorder_level ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {p.current < p.reorder_level ? 'Low Stock' : 'Optimized'}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No products found. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
