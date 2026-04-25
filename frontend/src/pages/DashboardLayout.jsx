import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ user, setUser, children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar user={user} setUser={setUser} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
