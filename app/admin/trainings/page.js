import TrainingTable from '@/components/TrainingTable';
import { LayoutDashboard, FileText, Download, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 ml-11">Management Console</p>
        </div>
      </div>

      <div className="card-white p-1">
        <div className="p-6 border-b border-slate-100/50 flex items-center justify-between bg-slate-50/30 rounded-t-3xl">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Submissions</h2>
        </div>
        <div className="p-6">
          <TrainingTable />
        </div>
      </div>
    </div>
  );
}
