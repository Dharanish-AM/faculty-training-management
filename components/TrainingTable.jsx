'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Eye, Edit2, Trash2, X, AlertCircle, Loader2, ArrowRight, FileText, Download, Filter, ArrowUpDown, Calendar, Clock, GraduationCap, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function TrainingTable() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controls
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  
  // Modals
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, [search]);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`/api/trainings?search=${search}`);
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      toast.error('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (training) => {
    setEditingId(training._id);
    setEditForm({
      ...training,
      fromDate: training.fromDate ? new Date(training.fromDate).toISOString().split('T')[0] : '',
      toDate: training.toDate ? new Date(training.toDate).toISOString().split('T')[0] : '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { _id, __v, createdAt, ...updateData } = editForm;
    try {
      const res = await fetch(`/api/trainings/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        toast.success('Record updated successfully');
        setEditingId(null);
        fetchTrainings();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Update failed');
      }
    } catch (err) {
      toast.error('A network error occurred');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted successfully');
        setShowDeleteConfirm(null);
        fetchTrainings();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // Derived state (Filter & Sort)
  const filteredTrainings = trainings.filter(t => {
    if (filterType !== 'All' && t.type !== filterType) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'Duration (High-Low)') return b.totalDays - a.totalDays;
    if (sortBy === 'Duration (Low-High)') return a.totalDays - b.totalDays;
    if (sortBy === 'Faculty (A-Z)') return a.facultyName.localeCompare(b.facultyName);
    return 0;
  });

  // KPIs
  const totalSubmissions = filteredTrainings.length;
  const uniqueFaculties = new Set(filteredTrainings.map(t => t.facultyName)).size;
  const totalDays = filteredTrainings.reduce((sum, t) => sum + t.totalDays, 0);
  const internshipCount = filteredTrainings.filter(t => t.type === 'Internship').length;
  const trainingCount = totalSubmissions - internshipCount;

  const handleExportCSV = () => {
    if (filteredTrainings.length === 0) return toast.error('No data to export');
    const headers = ['Faculty,Institution,Program,Type,Technology,Trainer,Total Days,Start Date,End Date'];
    const rows = filteredTrainings.map(t => 
      `"${t.facultyName}","${t.companyName}","${t.trainingName}","${t.type}","${t.technology}","${t.trainerName}",${t.totalDays},${new Date(t.fromDate).toLocaleDateString()},${new Date(t.toDate).toLocaleDateString()}`
    );
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `faculty_training_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported Successfully');
  };

  const handleGeneratePDF = () => {
    if (filteredTrainings.length === 0) return toast.error('No data to export');
    const doc = new jsPDF();
    doc.text('Faculty Training Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    doc.text(`Total Submissions: ${totalSubmissions}`, 14, 30);
    doc.text(`Unique Faculty: ${uniqueFaculties}`, 14, 35);
    doc.text(`Total Training Days: ${totalDays}`, 80, 30);
    doc.text(`Internships: ${internshipCount} | Trainings: ${trainingCount}`, 80, 35);

    const tableColumn = ["Faculty", "Institution", "Program", "Type", "Days", "Dates"];
    const tableRows = [];

    filteredTrainings.forEach(t => {
      const rowData = [
        t.facultyName,
        t.companyName,
        t.trainingName,
        t.type,
        t.totalDays.toString(),
        `${new Date(t.fromDate).toLocaleDateString()} - ${new Date(t.toDate).toLocaleDateString()}`
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`training_report_${new Date().getTime()}.pdf`);
    toast.success('PDF Generated Successfully');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={handleGeneratePDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button onClick={handleExportCSV} className="flex-1 sm:flex-none btn-primary px-5 py-2.5 text-xs shadow-none">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><GraduationCap className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Records</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">{totalSubmissions}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Building2 className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unique Faculty</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">{uniqueFaculties}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Days</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">{totalDays}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center gap-1 hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internships</span>
            <span className="text-sm font-black text-slate-900">{internshipCount}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalSubmissions ? (internshipCount/totalSubmissions)*100 : 0}%` }}></div>
          </div>
          <div className="flex justify-between items-center w-full mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trainings</span>
            <span className="text-sm font-black text-slate-900">{trainingCount}</span>
          </div>
        </div>
      </div>

      {/* Filters and Table Wrapper */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="All">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Duration (High-Low)">Duration (High-Low)</option>
                <option value="Duration (Low-High)">Duration (Low-High)</option>
                <option value="Faculty (A-Z)">Faculty (A-Z)</option>
              </select>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200/50 shadow-sm">
            Showing {filteredTrainings.length} records
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Type</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Technology</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trainer</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Days</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Duration</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Reference</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTrainings.map((t) => (
                <tr key={t._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-900 line-clamp-1">{t.facultyName}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-500 font-medium line-clamp-1 tracking-tight">{t.companyName}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold text-slate-700 line-clamp-1">{t.trainingName}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${t.type === 'Internship' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] text-slate-600 font-sans font-semibold whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{t.technology}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] text-slate-500 font-sans font-medium whitespace-nowrap">{t.trainerName}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-slate-900">{t.totalDays}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center justify-center leading-none space-y-1 opacity-80" suppressHydrationWarning>
                      <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap flex items-center gap-1">
                        {new Date(t.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      <div className="h-[2px] w-3 bg-slate-200 rounded-full" />
                      <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap flex items-center gap-1">
                        {new Date(t.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <a
                      href={t.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest bg-blue-50/50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Proof</span>
                    </a>
                  </td>
                  <td className="px-6 py-5 border-l border-transparent transition-colors group-hover:border-slate-50">
                    <div className="flex justify-end items-center space-x-1">
                      <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(t._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrainings.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-slate-700">No records found</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Modify Training Record</h3>
              <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="editFacultyName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty Name</label>
                  <input
                    id="editFacultyName"
                    required
                    value={editForm.facultyName}
                    onChange={(e) => setEditForm({ ...editForm, facultyName: e.target.value })}
                    className="input-style"
                    placeholder="e.g. Dr. Jane Smith"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editCompanyName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution / Company</label>
                  <input
                    id="editCompanyName"
                    required
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="input-style"
                    placeholder="Organization Name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editType" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Type</label>
                  <div className="relative">
                    <select
                      id="editType"
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="input-style bg-transparent appearance-none pr-10"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Training">Training Program</option>
                    </select>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rotate-90 text-blue-500 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editTechnology" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Technology</label>
                  <input
                    id="editTechnology"
                    required
                    value={editForm.technology}
                    onChange={(e) => setEditForm({ ...editForm, technology: e.target.value })}
                    className="input-style"
                    placeholder="e.g. Cloud, React"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="editTrainingName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Name</label>
                  <input
                    id="editTrainingName"
                    required
                    value={editForm.trainingName}
                    onChange={(e) => setEditForm({ ...editForm, trainingName: e.target.value })}
                    className="input-style"
                    placeholder="Official Title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editTrainerName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trainer Name</label>
                  <input
                    id="editTrainerName"
                    required
                    value={editForm.trainerName || ''}
                    onChange={(e) => setEditForm({ ...editForm, trainerName: e.target.value })}
                    className="input-style"
                    placeholder="Name of trainer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="editFromDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                  <input
                    id="editFromDate"
                    required
                    type="date"
                    value={editForm.fromDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm((prev) => {
                        const updated = { ...prev, fromDate: val };
                        if (val && updated.toDate) {
                          const start = new Date(val);
                          const end = new Date(updated.toDate);
                          if (start <= end) {
                            const diffTime = Math.abs(end - start);
                            updated.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          }
                        }
                        return updated;
                      });
                    }}
                    className="input-style"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editToDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                  <input
                    id="editToDate"
                    required
                    type="date"
                    value={editForm.toDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm((prev) => {
                        const updated = { ...prev, toDate: val };
                        if (updated.fromDate && val) {
                          const start = new Date(updated.fromDate);
                          const end = new Date(val);
                          if (start <= end) {
                            const diffTime = Math.abs(end - start);
                            updated.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          }
                        }
                        return updated;
                      });
                    }}
                    className="input-style"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="editTotalDays" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Days</label>
                  <input
                    id="editTotalDays"
                    required
                    type="number"
                    value={editForm.totalDays || ''}
                    onChange={(e) => setEditForm({ ...editForm, totalDays: e.target.value })}
                    className="input-style"
                    placeholder="Days"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-6 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Discard Changes
                </button>
                <button type="submit" className="btn-primary px-8">
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/10 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl w-full max-w-[300px] p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in scale-in duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Confirm Deletion</h3>
            <p className="text-[11px] text-gray-400 mt-2 mb-8 leading-relaxed">Are you certain you want to remove this record? This cannot be undone.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 text-xs font-bold text-gray-400 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
