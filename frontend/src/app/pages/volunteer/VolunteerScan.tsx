import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tent, Coins, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";

export function VolunteerScan() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const token = searchParams.get('token');
  const volunteerId = state.user?.volunteerId || state.user?.identifier;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Auth Guard
    if (!state.isAuthenticated || !volunteerId) {
      navigate(`/volunteer/login?returnUrl=/scan?token=${token}`);
      return;
    }
  }, [state, navigate, token, volunteerId]);

  const handleScan = async () => {
    if (!token) {
      setStatus('error');
      setErrorMsg("No QR token found in the URL.");
      return;
    }

    setStatus('loading');
    try {
      const res = await client.post<any>('/camps/scan', { token, volunteerId });
      setResult(res);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || "Failed to scan QR token.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <Card className="w-full max-w-md bg-white border-2 border-emerald-100 shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-4 inner-shadow">
            <Tent className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Camp Attendance</h1>
          <p className="text-sm text-emerald-100 font-medium mt-1">Scan verification portal</p>
        </div>

        <CardContent className="p-8">
          {status === 'idle' && (
            <div className="text-center space-y-6">
              <p className="text-gray-600 font-medium">Ready to claim your camp attendance?</p>
              <Button 
                onClick={handleScan} 
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 text-lg transition-transform active:scale-95"
              >
                Scan Token Now
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
              <p className="text-gray-500 font-bold animate-pulse">Verifying QR Signature...</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="text-center space-y-5 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-gray-900">Attendance Verified!</h2>
                <p className="text-gray-500 font-medium mt-1">You just earned coins for participating.</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl inline-block mt-4">
                <p className="text-amber-800 font-black text-2xl flex items-center justify-center gap-2">
                  +{result.coinsAwarded} <Coins className="h-6 w-6 text-amber-500" />
                </p>
              </div>
              <Button 
                onClick={() => navigate('/volunteer/dashboard')} 
                className="w-full h-12 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl mt-6"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-5 animate-in slide-in-from-bottom-4 duration-500">
              <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
                <p className="text-rose-600 font-medium mt-1 bg-rose-50 p-3 rounded-lg text-sm border border-rose-100 line-clamp-3">
                  {errorMsg}
                </p>
              </div>
              <Button 
                onClick={() => navigate('/volunteer/camps')} 
                className="w-full h-12 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl mt-6"
              >
                Return to Camps
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
