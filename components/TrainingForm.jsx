'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, ArrowRight } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <div className="card-white p-6 sm:p-10">

        <form key="training-form-v2" onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2 group">
              <label htmlFor="facultyName" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Faculty Name</label>
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
            <div className="flex flex-col gap-2 group">
              <label htmlFor="companyName" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Company Name</label>
              <input
                id="companyName"
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-style"
                placeholder="Organization or Institution"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2 group">
              <label htmlFor="type" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">FDP / Program Type</label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-style bg-transparent appearance-none pr-10 cursor-pointer"
                >
                  <option value="Internship">Internship</option>
                  <option value="Training">Training Program</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 group">
              <label htmlFor="technology" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Core Technology</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2 group">
              <label htmlFor="trainingName" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Program / Training Name</label>
              <input
                id="trainingName"
                required
                name="trainingName"
                value={formData.trainingName}
                onChange={handleChange}
                className="input-style"
                placeholder="Official title of the program"
              />
            </div>
            <div className="flex flex-col gap-2 group">
              <label htmlFor="trainerName" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Trainer Name</label>
              <input
                id="trainerName"
                required
                name="trainerName"
                value={formData.trainerName}
                onChange={handleChange}
                className="input-style"
                placeholder="Name of the trainer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2 group">
              <label htmlFor="fromDate" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Commencement Date</label>
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
            <div className="flex flex-col gap-2 group">
              <label htmlFor="toDate" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Conclusion Date</label>
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
            <div className="flex flex-col gap-2 group">
              <label htmlFor="totalDays" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Total Days</label>
              <input
                id="totalDays"
                required
                type="number"
                min="1"
                name="totalDays"
                value={formData.totalDays}
                onChange={handleChange}
                className="input-style"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Evidence / Proof Document</label>
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
                className="flex items-center justify-center w-full px-6 py-12 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group/upload"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 group-hover/upload:bg-blue-100 group-hover/upload:text-blue-600 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 text-center uppercase tracking-wider">
                    {file ? file.name : 'Upload Certificate or Evidence'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">PDF, PNG or JPG max 10MB</p>
                </div>
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-4 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                <span className="uppercase tracking-widest font-black text-xs">Processing Submission...</span>
              </>
            ) : (
              <span className="uppercase tracking-widest font-black text-xs">Verify and Submit Record</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
