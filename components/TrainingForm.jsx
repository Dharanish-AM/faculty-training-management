'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, ArrowRight, ClipboardCheck, Calendar } from 'lucide-react';

export default function TrainingForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    facultyName: '',
    companyName: '',
    type: 'Internship',
    trainingName: '',
    technology: '',
    fromDate: '',
    toDate: '',
    trainerName: '',
    totalDays: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append('proof', file);

    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        toast.success('Training details submitted successfully!');
        setFormData({
          facultyName: '',
          companyName: '',
          type: 'Internship',
          trainingName: '',
          technology: '',
          fromDate: '',
          toDate: '',
          trainerName: '',
          totalDays: '',
        });
        setFile(null);
        e.target.reset();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Submission failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Training Submission</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Faculty Professional Development Portal</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
          {/* Faculty Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="facultyName" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Faculty Name</label>
              <input
                id="facultyName"
                required
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                className="input-style"
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Organization / Institution</label>
              <input
                id="companyName"
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-style"
                placeholder="Where did the training happen?"
              />
            </div>
          </div>

          {/* Program Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Program Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-style cursor-pointer"
              >
                <option value="Internship">Internship</option>
                <option value="Training">Training Program</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar / Conference</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="technology" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Core Technology</label>
              <input
                id="technology"
                required
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="input-style"
                placeholder="e.g. Cloud, AI/ML, React"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="trainingName" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Program Title</label>
              <input
                id="trainingName"
                required
                name="trainingName"
                value={formData.trainingName}
                onChange={handleChange}
                className="input-style"
                placeholder="Full name of the training"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="trainerName" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Trainer / Facilitator</label>
              <input
                id="trainerName"
                required
                name="trainerName"
                value={formData.trainerName}
                onChange={handleChange}
                className="input-style"
                placeholder="Who led the session?"
              />
            </div>
          </div>

          {/* Dates & Duration Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fromDate" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <div className="relative">
                <input
                  id="fromDate"
                  required
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="input-style"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="toDate" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
              <div className="relative">
                <input
                  id="toDate"
                  required
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="input-style"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="totalDays" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Days</label>
              <div className="relative">
                <input
                  id="totalDays"
                  required
                  type="number"
                  min="1"
                  name="totalDays"
                  value={formData.totalDays}
                  onChange={handleChange}
                  className="input-style bg-slate-50/50"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Proof of Training</label>
            <div className="relative">
              <input
                required
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
                id="proof-upload"
              />
              <label
                htmlFor="proof-upload"
                className="flex items-center justify-center w-full px-6 py-10 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {file ? file.name : 'Upload Document'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-tighter">PDF or Image (Max 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="uppercase tracking-widest font-black text-xs">Submitting...</span>
              </>
            ) : (
              <span className="uppercase tracking-widest font-black text-xs">Verify and Submit Details</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
