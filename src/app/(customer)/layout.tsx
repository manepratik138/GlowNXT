import Link from "next/link";
import { Sparkles, User, ShoppingBag } from "lucide-react";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Premium Glassmorphism Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-rose-400 to-pink-600 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200 group-hover:shadow-rose-300 group-hover:-translate-y-0.5 transition-all duration-300">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Glow<span className="text-rose-500 font-medium">NXT</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-full transition-all">
              Home
            </Link>
            <Link href="/services" className="text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-full transition-all">
              Services
            </Link>
            <button className="text-slate-600 hover:text-rose-600 p-2 rounded-full hover:bg-rose-50 transition-all">
              <ShoppingBag size={20} />
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
              <User size={18} /> Login
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="font-medium">&copy; {new Date().getFullYear()} GlowNXT Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/pro" className="hover:text-rose-600 transition-colors">Join as Professional</Link>
            <Link href="/admin" className="hover:text-rose-600 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
