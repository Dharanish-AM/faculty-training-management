'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ClipboardCheck, ArrowRight, Star, Award, Users } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center max-w-4xl mx-auto mb-16"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-blue-100 shadow-[0_2px_10px_rgba(37,99,235,0.05)] mb-8">
          <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Advanced Faculty Management</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
          Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Professional</span> Development
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Manage, track, and verify faculty training programs with our streamlined, secure database system designed for academic excellence.
        </motion.p>
      </motion.div>

      {/* Choice Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
      >
        {/* Faculty Card */}
        <motion.div variants={itemVariants} className="group relative">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <div className="card-white p-8 group-hover:border-blue-200 h-full flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-transform duration-300">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Faculty Portal</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow">
              Submit your recent training details, upload certificates, and maintain your professional growth record effortlessly.
            </p>
            <Link 
              href="/submit-training" 
              className="inline-flex items-center justify-center space-x-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 group/btn shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
            >
              <span>Submit Training</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Admin Card */}
        <motion.div variants={itemVariants} className="group relative">
          <div className="absolute inset-0 bg-slate-900 rounded-3xl blur-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="card-white p-8 group-hover:border-slate-300 h-full flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(15,23,42,0.2)] group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Admin Gateway</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow">
              Secure access for administrators to review submissions, manage records, and generate comprehensive reports.
            </p>
            <Link 
              href="/admin/login" 
              className="inline-flex items-center justify-center space-x-2 px-6 py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn"
            >
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats/Features Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl"
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4"><Award className="w-6 h-6 text-blue-500" /></div>
          <h4 className="text-xl font-black text-slate-900">Verified</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Official Records</p>
        </motion.div>
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4"><Users className="w-6 h-6 text-blue-500" /></div>
          <h4 className="text-xl font-black text-slate-900">Scalable</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Unlimited Entries</p>
        </motion.div>
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-4"><ShieldCheck className="w-6 h-6 text-blue-500" /></div>
          <h4 className="text-xl font-black text-slate-900">Secure</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">AES Protection</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
