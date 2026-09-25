import Link from "next/link";
import { Shield, LayoutDashboard, Users, CreditCard } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg text-white">
              <Shield size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">Admin<span className="text-purple-400">Panel</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-purple-600/20 text-purple-400 rounded-xl font-medium border border-purple-500/30">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
            <Users size={20} /> Manage Users
          </Link>
          <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
            <CreditCard size={20} /> Payments
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
