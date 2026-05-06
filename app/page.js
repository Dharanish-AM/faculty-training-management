'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ClipboardCheck, ArrowRight, Star, Award, Users } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'tween', duration: 0.3 } }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-20 px-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-20"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <Star className="w-3 h-3 text-blue-600 fill-blue-600" />
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Faculty Training Management</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
          Elevate Your <span className="text-blue-600">Professional</span> Development
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          A streamlined, secure system for managing and verifying faculty training programs with academic precision.
        </motion.p>
      </motion.div>

      {/* Action Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
      >
        {/* Faculty Card */}
        <motion.div variants={itemVariants} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Faculty Portal</h3>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed flex-grow">
            Submit recent training details, upload certificates, and maintain your professional growth record effortlessly.
          </p>
          <Link 
            href="/submit-training" 
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
          >
            <span>Submit Training</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Admin Card */}
        <motion.div variants={itemVariants} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Admin Gateway</h3>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed flex-grow">
            Secure access for administrators to review submissions, manage records, and generate comprehensive reports.
          </p>
          <Link 
            href="/admin/login" 
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <span>Admin Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4"><Award className="w-6 h-6" /></div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Verified Records</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Official Certification</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4"><Users className="w-6 h-6" /></div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Scalable Tech</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Unlimited Faculty</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4"><ShieldCheck className="w-6 h-6" /></div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Secure Access</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">AES Protection</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
