import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, Box, Truck, ArrowRightLeft, FileSpreadsheet, LogOut, Verified } from 'lucide-react';

export default function Sidebar({ user, setUser }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/dashboard/products', icon: <PackageSearch size={20} /> },
    { name: 'Receipts', path: '/dashboard/receipts', icon: <Box size={20} /> },
    { name: 'Deliveries', path: '/dashboard/deliveries', icon: <Truck size={20} /> },
    { name: 'Transfers', path: '/dashboard/transfers', icon: <ArrowRightLeft size={20} /> },
    { name: 'Stock Ledger', path: '/dashboard/ledger', icon: <FileSpreadsheet size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-full flex flex-col text-slate-300">
      <div className="p-6 flex items-center space-x-3 text-white border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg"><Box className="h-6 w-6" /></div>
        <span className="text-xl font-bold tracking-tight">Inventra AI</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {user?.role === 'admin' && (
          <div className="mt-8">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
            <Link 
              to="/dashboard/admin"
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                location.pathname.includes('/admin') 
                  ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Verified size={20} />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center p-3 bg-slate-800 rounded-lg mb-4">
          <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
