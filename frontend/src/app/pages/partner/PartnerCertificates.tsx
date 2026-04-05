import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { partnerApi } from "../../lib/api/partner";
import { 
  Award, 
  Download, 
  FileText, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";

export function PartnerCertificates() {
  const { id } = useParams();
  const { state } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const partnerId = (state.user as any)?.partnerId;
  const isAuthorized = state.isLoaded && state.user && partnerId && (!id || id === partnerId);

  useEffect(() => {
    async function fetchCerts() {
      try {
        if (id) {
          const data = await partnerApi.getCertificates(id);
          setCerts(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } as any }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <ShieldCheck className="h-10 w-10 text-[#1D6E3F] animate-pulse" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Decrypting Vault...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase underline decoration-[#FF9900]/40 decoration-4 underline-offset-[12px]">Your Documents</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] pt-3">Official Certificates & Receipts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-white border border-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Activity size={14} /> Compliance Check
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#1D6E3F] to-[#155e33] p-10 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_#FF990020_0%,_transparent_70%)] pointer-events-none" />
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
               <ShieldCheck size={36} className="text-[#FF9900]" />
            </div>
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Verified Impact Records</h3>
               <p className="text-[11px] font-bold text-emerald-100/70 uppercase tracking-widest leading-relaxed max-w-lg">
                  All 80G tax receipts and contribution certificates are generated automatically. 
                  These documents are digitally signed and legally valid.
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
               <p className="text-[8px] font-black uppercase tracking-widest text-[#FF9900] mb-1">Tax Year</p>
               <p className="text-[14px] font-black tracking-widest">FY26-27</p>
            </div>
            <button className="h-[52px] px-10 bg-white text-[#1D6E3F] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/30 active:scale-95 transition-all">
               Request Audit
            </button>
         </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {certs.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-inner"
          >
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 bg-[#FF9900]/10 blur-3xl animate-pulse" />
               <FileText size={64} strokeWidth={1} className="text-gray-200 mx-auto" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Vault Empty</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2 max-w-xs mx-auto">Complete your first sponsorship to generate institutional certifications.</p>
            <button className="mt-8 px-10 py-5 bg-[#1D6E3F] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
               Explore Programs <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.map((cert, i) => (
              <motion.div 
                key={cert.id} 
                variants={itemVariants}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#1D6E3F] to-[#FF9900]" />
                
                <div className="flex items-center justify-between mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] border border-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1D6E3F] group-hover:bg-[#1D6E3F]/5 transition-all">
                      {cert.type === '80G' ? <Shield size={24} /> : <Award size={24} />}
                   </div>
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100/50">
                      <Zap size={10} className="fill-emerald-500" /> Instant
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tighter leading-tight uppercase group-hover:text-[#1D6E3F] transition-colors">{cert.title || 'Official Document'}</h4>
                    <div className="flex items-center gap-3 mt-4">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          cert.type === '80G' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                       }`}>
                          {cert.type}
                       </span>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                          <CalendarDays size={12} />
                          {new Date(cert.createdAt).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}
                       </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 space-y-6">
                     <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-wider">
                        Recipient: <span className="text-gray-900 font-black">{cert.recipientName || 'Strategic Partner Node'}</span>
                     </p>
                     
                     <div className="flex items-center gap-3">
                        <button className="flex-1 h-[52px] bg-gray-50 group-hover:bg-[#1D6E3F] text-gray-400 group-hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner group-hover:shadow-xl group-hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                           <Download size={14} /> Secure Download
                        </button>
                        <button className="h-[52px] w-[52px] bg-[#FAFAF8] border border-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:text-[#FF9900] transition-all">
                           <ExternalLink size={16} />
                        </button>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="p-8 rounded-[2rem] bg-[#FAFAF8] border border-gray-100 flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
               <ShieldCheck size={20} className="text-[#1D6E3F]" />
            </div>
            <div>
               <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">Official Document Center</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">All receipts are verified and legally valid under section 80G.</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <img src="/placeholder-seal.png" alt="Seal" className="h-10 opacity-20 filter grayscale" />
            <div className="h-8 w-px bg-gray-200" />
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">WombTo18 Signature Verified</p>
         </div>
      </motion.div>
    </motion.div>
  );
}
