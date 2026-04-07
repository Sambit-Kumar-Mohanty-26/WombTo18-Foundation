import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Zap, IndianRupee, Landmark, ShieldCheck, History, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { client } from "../../lib/api/client";
import { toast } from "sonner";

export function VolunteerCommissions() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bankSubmitting, setBankSubmitting] = useState(false);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [bankData, setBankData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await client.get<any>(`/volunteers/commissions/${id}`);
      setData(res);
      if (res.bankDetails) {
        setBankData(res.bankDetails);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBankSubmitting(true);
      await client.put(`/volunteers/bank-details/${id}`, bankData);
      toast.success("Bank details updated successfully!");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update bank details");
    } finally {
      setBankSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    // Check if bank details are updated
    if (!bankData.bankName || !bankData.accountNumber || !bankData.ifscCode || !bankData.accountName) {
      toast.error("Please update your reward transfer details before requesting a redemption.", {
        description: "We need your account information to process the bank transfer.",
        duration: 5000,
      });
      return;
    }

    try {
      setWithdrawSubmitting(true);
      const loadingToast = toast.loading(`Requesting redemption of ₹${data.eligibleAmountInr.toLocaleString()}...`);
      
      await client.post(`/volunteers/withdraw/${id}`);
      
      toast.dismiss(loadingToast);
      toast.success("Redemption request submitted successfully!", {
        description: "Our team will verify and process your transfer shortly."
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to request redemption");
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { totalCoins, withdrawnThreshold, availableGap, isEligible, eligibleAmountInr, history } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-amber-950 tracking-tight">Impact Rewards</h1>
          <p className="text-sm font-bold text-amber-700/60 uppercase tracking-widest mt-1">Your impact, recognized</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Credits */}
        <Card className="border-amber-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-amber-700/50 mb-1">Total Impact Credits</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-amber-950">{totalCoins.toLocaleString()}</h3>
                </div>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-amber-500 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Unlocked */}
        <Card className="border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><IndianRupee className="h-24 w-24" /></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-emerald-700/50 mb-1">Redeemable Rewards</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-950">{availableGap.toLocaleString()}</h3>
                </div>
                <p className="text-xs font-bold text-emerald-700 mt-1">Reward Value: ₹{(availableGap/10).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Tracker */}
        <Card className="border-blue-100 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase tracking-widest font-black text-blue-700/50 mb-1">Next Impact Milestone</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-3xl font-black text-blue-950">{(100000 - (availableGap % 100000)).toLocaleString()}</h3>
              <span className="text-sm font-bold text-blue-700/60">credits to go</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(availableGap % 100000) / 1000}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Panel */}
        <Card className="border-amber-100/50 shadow-sm">
          <CardHeader className="pb-3 border-b border-amber-50 bg-amber-50/30">
            <CardTitle className="inline-flex items-center gap-2 text-amber-950">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              Claim Your Rewards
            </CardTitle>
            <CardDescription className="text-amber-700/70">
              Rewards can be redeemed once your impact balance reaches 1,00,000 credits.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className={`p-6 rounded-2xl border ${isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'} text-center space-y-4`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isEligible ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                {isEligible ? <ShieldCheck className="h-8 w-8" /> : <IndianRupee className="h-8 w-8" />}
              </div>
              
              <div>
                <h3 className={`text-xl font-black ${isEligible ? 'text-emerald-900' : 'text-gray-900'}`}>
                  {isEligible ? `₹${eligibleAmountInr.toLocaleString()} Available` : "Almost There"}
                </h3>
                <p className={`text-xs font-bold mt-2 ${isEligible ? 'text-emerald-700' : 'text-gray-500'}`}>
                  {isEligible 
                    ? `You have a total of ${availableGap.toLocaleString()} credits to redeem. Claim now!` 
                    : `You need ${(100000 - availableGap).toLocaleString()} more credits to unlock your rewards.`}
                </p>
              </div>

              <Button 
                onClick={handleWithdraw}
                disabled={!isEligible || withdrawSubmitting}
                className={`w-full font-black ${isEligible ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20' : ''}`}
                size="lg"
              >
                {withdrawSubmitting ? "Processing..." : "Redeem Rewards"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {(!bankData.bankName || !bankData.accountNumber || !bankData.ifscCode) && (
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                  ⚠️ Incomplete Bank Details
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="border-amber-100/50 shadow-sm">
          <CardHeader className="pb-3 border-b border-amber-50 bg-amber-50/30">
             <CardTitle className="inline-flex items-center gap-2 text-amber-950">
              <Landmark className="h-5 w-5 text-amber-600" />
              Reward Transfer Details
            </CardTitle>
            <CardDescription className="text-amber-700/70">
              Where should we send your rewards?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleBankUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
                  <Input required placeholder="HDFC, SBI etc." value={bankData.bankName} onChange={e => setBankData({...bankData, bankName: e.target.value})} className="font-bold border-gray-200 bg-gray-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">IFSC Code</label>
                  <Input required placeholder="HDFC0001234" value={bankData.ifscCode} onChange={e => setBankData({...bankData, ifscCode: e.target.value})} className="font-bold uppercase border-gray-200 bg-gray-50/50" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Account Holder Name</label>
                <Input required placeholder="Name as per bank" value={bankData.accountName} onChange={e => setBankData({...bankData, accountName: e.target.value})} className="font-bold border-gray-200 bg-gray-50/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Account Number</label>
                <Input required type="number" placeholder="Enter Ac No." value={bankData.accountNumber} onChange={e => setBankData({...bankData, accountNumber: e.target.value})} className="font-bold tracking-widest border-gray-200 bg-gray-50/50" />
              </div>
              <Button type="submit" disabled={bankSubmitting} className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold">
                {bankSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card className="border-amber-100/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-amber-50">
          <CardTitle className="inline-flex items-center gap-2 text-amber-950 font-black">
            <History className="h-5 w-5 text-amber-600" />
            Reward History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <IndianRupee className="h-10 w-10 text-amber-200 mx-auto mb-3" />
              <p className="text-amber-950 font-bold">No rewards claimed yet</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Your transfer history will appear here once you make your first redemption.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((req: any) => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">₹{req.amountInr.toLocaleString()}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{new Date(req.createdAt).toLocaleDateString()} • {req.amountCoins.toLocaleString()} Credits</p>
                  </div>
                  <div>
                    <Badge className={
                      req.status === 'APPROVED' || req.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }>
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
