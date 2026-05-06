'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();
  const navItems = [
    { name: 'Admin Dashboard', path: '/admin/trainings', icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout');
      if (res.ok) {
        toast.success('Logged out');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/submit-training" className="flex items-center space-x-3 group transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_rgba(37,99,235,0.2)] group-hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-black text-xl">F</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">FacultyHub</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Training Portal</span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {pathname.startsWith('/admin') && navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className="flex items-center space-x-2">
                  <Link
                    href={item.path}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all border border-slate-100"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
