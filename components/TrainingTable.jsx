'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Eye, Edit2, Trash2, X, Loader2, Download, Filter, ArrowUpDown, Calendar, MonitorPlay, CheckCircle2, Clock, GraduationCap, Building2, Briefcase, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrainingTable() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch('/api/trainings');
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Record deleted');
        fetchTrainings();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (training) => {
    setEditingData({
      ...training,
      fromDate: training.fromDate.split('T')[0],
      toDate: training.toDate.split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => {
      const updated = { ...prev, [name]: value };
      if ((name === 'fromDate' || name === 'toDate') && updated.fromDate && updated.toDate) {
        const start = new Date(updated.fromDate);
        const end = new Date(updated.toDate);
        if (start <= end) {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          updated.totalDays = diffDays;
        }
      }
      return updated;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/trainings/${editingData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });
      if (res.ok) {
        toast.success('Training updated successfully');
        setIsEditModalOpen(false);
        fetchTrainings();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredTrainings.length === 0) return toast.error('No data to export');
    
    const headers = ["Faculty", "Institution", "Program", "Type", "Technology", "Trainer", "Total Days", "Start Date", "End Date"];
    const csvContent = [
      headers.join(','),
      ...filteredTrainings.map(t => [
        `"${t.facultyName}"`,
        `"${t.companyName}"`,
        `"${t.trainingName}"`,
        `"${t.type}"`,
        `"${t.technology}"`,
        `"${t.trainerName}"`,
        t.totalDays || 0,
        new Date(t.fromDate).toLocaleDateString(),
        new Date(t.toDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `faculty_training_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported Successfully');
  };

  const filteredTrainings = trainings
    .filter(t => {
      const searchStr = `${t.facultyName} ${t.companyName} ${t.trainingName} ${t.technology} ${t.trainerName}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.fromDate) - new Date(a.fromDate);
      if (sortOrder === 'oldest') return new Date(a.fromDate) - new Date(b.fromDate);
      return 0;
    });

  const totalSubmissions = trainings.length;
  const uniqueFaculties = new Set(trainings.map(t => t.facultyName)).size;
  const totalDays = trainings.reduce((sum, t) => sum + (Number(t.totalDays) || 0), 0);
  const internshipCount = trainings.filter(t => t.type === 'Internship').length;
  const trainingCount = trainings.filter(t => t.type === 'Training').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 w-full px-6 md:px-10 mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><GraduationCap className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Submissions</p>
            <h4 className="text-3xl font-black text-slate-900 leading-none mt-1">{totalSubmissions}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unique Faculty</p>
            <h4 className="text-3xl font-black text-slate-900 leading-none mt-1">{uniqueFaculties}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Days</p>
            <h4 className="text-3xl font-black text-slate-900 leading-none mt-1">{totalDays}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><MonitorPlay className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type Split</p>
            <h4 className="text-sm font-bold text-slate-700 mt-1">
              {internshipCount} Internship · {trainingCount} Training
            </h4>
          </div>
        </div>
      </div>

      {/* Controls Section - ABOVE TABLE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search database..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:w-64">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer flex-1"
            >
              <option value="all">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Training">Training</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:w-64">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer flex-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm sm:w-64">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <div className="flex items-center gap-2 px-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {filteredTrainings.length} {filteredTrainings.length === 1 ? 'Record' : 'Records'} Found
            </p>
          </div>
        </div>


      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[160px]">Faculty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[180px]">Institution</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[220px]">Program</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[140px]">Technology</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[140px]">Trainer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20 text-center">Days</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-28">Start</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-28">End</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20">Proof</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredTrainings.map((t) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={t._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{t.facultyName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">{t.companyName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">{t.trainingName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                        t.type === 'Internship' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full inline-block">
                        {t.technology}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-600">{t.trainerName}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs font-bold text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg mx-auto">{t.totalDays || 0}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-500">{new Date(t.fromDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-500">{new Date(t.toDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      {t.proofUrl ? (
                        <a href={t.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase tracking-wider transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      ) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No Proof</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(t._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredTrainings.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Edit Training Record</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Update professional development data</p>
                  </div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Faculty Name</label>
                    <input
                      required
                      name="facultyName"
                      value={editingData?.facultyName || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Institution</label>
                    <input
                      required
                      name="companyName"
                      value={editingData?.companyName || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Program Title</label>
                    <input
                      required
                      name="trainingName"
                      value={editingData?.trainingName || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Technology</label>
                    <input
                      required
                      name="technology"
                      value={editingData?.technology || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Trainer</label>
                    <input
                      required
                      name="trainerName"
                      value={editingData?.trainerName || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
                    <select
                      name="type"
                      value={editingData?.type || 'Internship'}
                      onChange={handleEditChange}
                      className="input-style cursor-pointer"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                    <input
                      required
                      type="date"
                      name="fromDate"
                      value={editingData?.fromDate || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                    <input
                      required
                      type="date"
                      name="toDate"
                      value={editingData?.toDate || ''}
                      onChange={handleEditChange}
                      className="input-style"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Days</label>
                    <input
                      readOnly
                      type="number"
                      name="totalDays"
                      value={editingData?.totalDays || 0}
                      className="input-style bg-slate-50 font-bold text-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={updating}
                    type="submit"
                    className="flex-[2] btn-primary py-4 shadow-blue-500/20 shadow-lg"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="uppercase tracking-widest font-black text-xs">Updating...</span>
                      </>
                    ) : (
                      <span className="uppercase tracking-widest font-black text-xs">Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
