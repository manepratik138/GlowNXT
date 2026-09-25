import Link from "next/link";
import { Briefcase, Bell, Settings, LogOut } from "lucide-react";

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Professional Dashboard Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/pro" className="flex items-center gap-2 group">
            <div className="bg-blue-500 p-1.5 rounded-lg text-white">
              <Briefcase size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Pro <span className="text-blue-400">Dashboard</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden ml-2 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=200&h=200" alt="Pro" className="w-full h-full object-cover" />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
