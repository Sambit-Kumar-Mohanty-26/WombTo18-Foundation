import { motion } from "motion/react";
import { Award, Download, Share2, FileCheck, Shield } from "lucide-react";

export function PartnerCertificates() {
  const certificates = [
    {
      id: '1',
      title: 'Platinum CSR Partner 2026',
      date: '2026-03-01',
      type: 'MILESTONE',
      status: 'AVAILABLE',
    },
    {
      id: '2',
      title: '1M+ Impact Award',
      date: '2026-02-15',
      type: 'IMPACT',
      status: 'AVAILABLE',
    },
    {
      id: '3',
      title: 'FY2025 80G Tax Receipt',
      date: '2025-04-05',
      type: 'TAX_RECEIPT',
      status: 'AVAILABLE',
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Certificates & Tax Documents</h1>
          <p className="text-gray-500 font-medium">Download and share your official corporate recognition and 80G receipts.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white rounded-3xl p-1 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity ${
              cert.type === 'TAX_RECEIPT' ? 'from-amber-500 to-orange-600' : 'from-sky-500 to-blue-600'
            }`} />
            
            <div className="bg-white rounded-[1.4rem] p-6 h-full border border-gray-100 relative z-10 flex flex-col">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${
                cert.type === 'TAX_RECEIPT' 
                  ? 'bg-amber-50 border-amber-100 text-amber-600'
                  : 'bg-sky-50 border-sky-100 text-sky-600'
              }`}>
                {cert.type === 'TAX_RECEIPT' ? <FileCheck className="h-6 w-6" /> : <Award className="h-6 w-6" />}
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{cert.title}</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">{new Date(cert.date).toLocaleDateString()}</p>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" /> Download
                </button>
                {cert.type !== 'TAX_RECEIPT' && (
                  <button className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 80G Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4"
      >
        <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm border border-amber-100 text-amber-600">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-amber-900">Tax Exemption Info</h4>
          <p className="text-amber-700/80 text-sm mt-1 leading-relaxed">
            All donations made under the CSR category are eligible for a 50% tax deduction under Section 80G of the Income Tax Act, 1961. Receipts are automatically generated at the end of the financial quarter and uploaded here. For urgent 80G compliance requests, please contact your dedicated relationship manager.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
