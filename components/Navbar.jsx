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
    { name: 'Dashboard', path: '/admin/trainings', icon: LayoutDashboard },
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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/submit-training" className="flex items-center space-x-3 group transition-all">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 tracking-tight leading-none">FacultyHub</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Management</span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {pathname.startsWith('/admin') && navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className="flex items-center space-x-2">
                  <Link
                    href={item.path}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-600 hover:text-blue-600 transition-all border border-slate-200 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-red-600 transition-all border border-slate-200"
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
