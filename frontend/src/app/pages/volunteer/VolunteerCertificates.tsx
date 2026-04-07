import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Award, Download, Share2, Loader2, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ShareModal } from "../../components/shared/ShareModal";
import { certificateApi } from "../../lib/api/certificates";
import { toast } from "sonner";

export function VolunteerCertificates() {
  const { state } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [shareCert, setShareCert] = useState<any>(null);
  
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  useEffect(() => {
    if (!state.user?.donorId && !volId) return;
    
    // Fetch both volunteer and donor certificates if applicable
    const fetchCerts = async () => {
      try {
        const volCerts = await certificateApi.list('VOLUNTEER', volId);
        setCertificates(volCerts);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [volId, state.user?.donorId]);

  const handleDownload = async (cert: any) => {
    try {
      if (cert.type === "DONATION_RECEIPT") await certificateApi.downloadReceipt(cert.donorId);
      else if (cert.type === "80G") await certificateApi.download80G(cert.id);
      else if (cert.type === "VOLUNTEER") await certificateApi.downloadVolunteerCert(cert.volunteerId);
      else if (cert.type === "CAMP") {
         const meta = JSON.parse(cert.metadata || '{}');
         await certificateApi.downloadCampCert(cert.volunteerId, meta.campId);
      }
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleDownloadAll = async () => {
    if (certificates.length === 0) return;
    setDownloadingZip(true);
    toast.info("Preparing ZIP archive...", { description: "Bundling all your impact achievements." });
    try {
      await certificateApi.downloadZip("VOLUNTEER", volId);
      toast.success("Archive downloaded successfully!");
    } catch (err) {
      console.error("ZIP download failed:", err);
      toast.error("Failed to prepare archive.");
    } finally {
      setDownloadingZip(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-amber-950 tracking-tight">My Certificates</h1>
          <p className="text-amber-700/50 text-sm font-bold mt-1">Download and share your impact achievements</p>
        </div>
        <Button
          variant="outline"
          disabled={downloadingZip || certificates.length === 0}
          onClick={handleDownloadAll}
          className="bg-white border-amber-100 text-amber-900 hover:bg-amber-50 font-bold rounded-xl h-11 shadow-sm"
        >
          {downloadingZip ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Preparing...</>
          ) : (
            <><Download className="h-4 w-4 mr-2" /> Download All (ZIP)</>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length > 0 ? certificates.map((cert) => (
          <Card key={cert.id} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
            <div className={`h-2 w-full ${cert.type === 'VOLUNTEER' ? 'bg-amber-500' : cert.type.includes('CAMP') ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${cert.type === 'VOLUNTEER' ? 'bg-amber-50 text-amber-600' : cert.type.includes('CAMP') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Award className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                  {cert.type.replace('_', ' ')}
                </Badge>
              </div>
              
              <h3 className="text-lg font-black text-gray-900 mb-1 line-clamp-2">{cert.title}</h3>
              <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">Awarded to {cert.recipientName} on {new Date(cert.createdAt).toLocaleDateString()}</p>
              
              <div className="flex gap-2">
                <Button onClick={() => handleDownload(cert)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
                <Button onClick={() => setShareCert(cert)} variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 border-dashed">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No certificates yet</h3>
            <p className="text-sm mt-1 max-w-sm">Participate in camps or earn referral milestones to unlock printable impact certificates.</p>
          </div>
        )}
      </div>

      {shareCert && (
        <ShareModal 
          isOpen={!!shareCert} 
          onClose={() => setShareCert(null)} 
          shareText={shareCert.shareText || `I just unlocked the ${shareCert.title} at WombTo18!`} 
          shareUrl={`${window.location.origin}/impact/${shareCert.id}`}
          type="VOLUNTEER"
          title="Share Your Impact"
        />
      )}
    </div>
  );
}
