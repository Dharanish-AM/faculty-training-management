'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, ClipboardCheck, X, FileText } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';

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
    proofUrl: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    if (!formData.proofUrl) {
      toast.error('Please upload a proof document first');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          proofUrl: '',
        });
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fromDate" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
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
            <div className="flex flex-col gap-2">
              <label htmlFor="toDate" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
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
            <div className="flex flex-col gap-2">
              <label htmlFor="totalDays" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Days</label>
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

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Proof of Training</label>
            
            {formData.proofUrl ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl group animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Document Uploaded</p>
                    <a href={formData.proofUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 font-bold uppercase tracking-tight hover:underline">View Uploaded File</a>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, proofUrl: '' }))}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="proofUploader"
                onClientUploadComplete={(res) => {
                  setFormData(prev => ({ ...prev, proofUrl: res[0].ufsUrl }));
                  toast.success("File uploaded successfully!");
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
                className="ut-label:text-blue-600 ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-500/50 ut-button:ut-uploading:bg-blue-500/50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              />
            )}
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
