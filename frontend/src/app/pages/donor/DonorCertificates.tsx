import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Download, Award, FileText, ChevronLeft, Loader2, FileCheck2, Search, ArrowRight } from "lucide-react";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useDonorData } from "../../lib/useDonorData";
import { useAuth } from "../../context/AuthContext";
import { certificateApi } from "../../lib/api/certificates";

export function DonorCertificates() {
  const { profile, donations, totalDonated, loading: donorLoading } = useDonorData();
  const { state } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [search, setSearch] = useState("");

  const donorName = profile?.name || state.user?.name || state.user?.identifier || "Donor";
  const donorId = profile?.donorId || state.user?.donorId || "—";
  const tier = profile?.tier ?? "DONOR";

  useEffect(() => {
    if (!donorId || donorId === "—") {
      setCertsLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await certificateApi.getByDonor(donorId);
        setCerts(data || []);
      } catch (e) {
        console.error("Failed to load certificates:", e);
      } finally {
        setCertsLoading(false);
      }
    })();
  }, [donorId]);

  const allDocuments = certs.length > 0 ? certs.map((c: any) => ({
    id: c.id,
    type: c.type === "80G" || c.type === "DONATION_RECEIPT" ? "Donation Receipt" : c.title,
    recipientName: c.recipientName,
    fileUrl: c.fileUrl,
    amount: (() => { try { return JSON.parse(c.metadata || "{}").amount || 0; } catch { return 0; } })(),
    date: new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  })) : donations.map((d, i) => ({
    id: d.id || `donation-${i}`,
    type: "Donation Receipt",
    recipientName: donorName,
    fileUrl: null,
    amount: d.amount,
    date: d.date,
  }));

  const filteredDocs = allDocuments.filter(d => 
    (d.type ?? "").toLowerCase().includes(search.toLowerCase()) || 
    (d.date ?? "").includes(search)
  );

  async function handleDownload(doc: any) {
    setDownloadingId(doc.id);
    try {
      if (doc.fileUrl) {
        await certificateApi.downloadFromUrl(doc.fileUrl, `${doc.id}.pdf`);
        toast.success("Certificate downloaded!");
      } else if (doc.id.startsWith("80G-")) {
        await certificateApi.download80G(doc.id);
        toast.success("80G Certificate downloaded!");
      } else if (doc.type === "Donation Receipt" || doc.type === "DONATION_RECEIPT") {
        await certificateApi.downloadReceipt(doc.id);
        toast.success("Receipt downloaded!");
      } else {
        await certificateApi.download80G(doc.id);
        toast.success("Certificate downloaded!");
      }
    } catch (err: any) {
      console.error("Download failed:", err);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDownloadAll() {
    if (allDocuments.length === 0) {
      toast.error("No documents available to bundle.");
      return;
    }
    setDownloadingZip(true);
    toast.info("Preparing ZIP archive...", { description: "Bundling all your financial documents securely." });
    try {
      await certificateApi.downloadZip("DONOR", donorId);
      toast.success("Archive downloaded successfully!");
    } catch (err: any) {
      console.error("ZIP download failed:", err);
      toast.error("Failed to prepare archive. Please try individual downloads.");
    } finally {
      setDownloadingZip(false);
    }
  }

  if (donorLoading || certsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1D6E3F]" />
        <p className="text-gray-500 font-medium tracking-tight">Retrieving Financial Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full animate-in fade-in duration-700">
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <Link to="/dashboard" className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1D6E3F] mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Overview
          </Link>
          <h1 className="text-3xl sm:text-[2.5rem] font-black text-gray-900 tracking-tight leading-none mb-2">
            Tax <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500">Certificates</span>
          </h1>
          <p className="text-gray-500 font-medium">Verified documents and receipts for <span className="font-bold text-gray-800">{donorName}</span>.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline" size="lg"
            disabled={downloadingZip || allDocuments.length === 0}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold rounded-xl h-12 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 outline-none"
            onClick={handleDownloadAll}
          >
            {downloadingZip ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin text-[#1D6E3F]" /> Preparing...</>
            ) : (
              <><Download className="h-4 w-4 mr-2 text-[#1D6E3F]" /> Download All (ZIP)</>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Tier Badge Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        {totalDonated > 0 ? (
          <Card className="bg-gradient-to-r from-[#f0faf4] to-emerald-50/30 border-[#d1f5e0]/60 shadow-[0_8px_30px_-15px_rgba(29,110,63,0.15)] rounded-[2rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
               <Award className="h-40 w-40 -mr-12 -mt-12 rotate-12 text-[#1D6E3F]" />
            </div>
            <CardContent className="p-8 sm:p-10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0 border border-[#1D6E3F]/10">
                  <Award className="h-10 w-10 text-[#1D6E3F]" />
                </div>
                <div className="flex-1">
                  <Badge className="bg-[#1D6E3F]/10 text-[#1D6E3F] hover:bg-[#1D6E3F]/20 font-black px-3 py-1 border-none shadow-sm text-[10px] uppercase tracking-widest mb-2">
                    {tier} Donor Status
                  </Badge>
                  <h4 className="text-gray-900 font-black text-2xl tracking-tight leading-none mb-1">
                    Tax Exemption Eligible
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    Total lifetime contributions: <span className="font-bold text-gray-900">₹{totalDonated.toLocaleString("en-IN")}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-100 bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]">
            <CardContent className="py-16 text-center">
              <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-gray-50/50">
                 <FileCheck2 className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Records Available</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">Generate your first tax exemption certificate by making a contribution to any active program.</p>
              <Link to="/donate">
                <Button size="lg" className="bg-[#1D6E3F] hover:bg-emerald-700 text-white font-black shadow-lg rounded-xl h-12 px-8 transition-transform hover:-translate-y-0.5">
                  Start Donating
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Documents List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {allDocuments.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Filter by type or date..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-14 rounded-2xl shadow-sm text-base font-medium focus-visible:ring-emerald-500/20 outline-none"
                />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                {filteredDocs.length} {filteredDocs.length === 1 ? 'Document' : 'Documents'}
              </p>
            </div>

            <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[2rem] overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-50 bg-[#fafaf8] text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                 <div className="col-span-3">Document ID</div>
                 <div className="col-span-3">Assigned Type</div>
                 <div className="col-span-2">Value</div>
                 <div className="col-span-2">Date Issue</div>
                 <div className="col-span-2 text-right">Download</div>
              </div>
              <div className="divide-y divide-gray-50/80">
                <AnimatePresence>
                  {filteredDocs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-16 text-center">
                       <FileCheck2 className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                       <p className="text-gray-500 font-medium">No documents match your query "{search}"</p>
                    </motion.div>
                  ) : filteredDocs.map((doc, i) => (
                    <motion.div 
                      key={doc.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-[#fafaf8] transition-colors group cursor-default"
                    >
                      <div className="col-span-3">
                         <span className="text-xs font-mono font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{doc.id}</span>
                      </div>
                      <div className="col-span-3">
                         <div className="flex items-center gap-2.5">
                           <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${doc.type.includes("80G") ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                             {doc.type.includes("80G") ? <Award className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                           </div>
                           <span className="text-sm font-bold text-gray-800">{doc.type}</span>
                         </div>
                      </div>
                      <div className="col-span-2">
                         <span className="text-base font-black text-gray-900 tracking-tight">₹{(doc.amount || 0).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="col-span-2">
                         <span className="text-sm font-semibold text-gray-600">{doc.date}</span>
                      </div>
                      <div className="col-span-2 text-right">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           disabled={downloadingId === doc.id}
                           onClick={() => handleDownload(doc)}
                           className="text-[#1D6E3F] hover:text-white border-[#1D6E3F]/20 border hover:bg-[#1D6E3F] rounded-xl h-10 px-4 transition-all shadow-[0_4px_10px_-4px_rgba(29,110,63,0.2)] hover:shadow-lg font-bold"
                         >
                           {downloadingId === doc.id ? (
                             <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Fetching</>
                           ) : (
                             <><Download className="h-4 w-4 mr-2" /> PDF</>
                           )}
                         </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
