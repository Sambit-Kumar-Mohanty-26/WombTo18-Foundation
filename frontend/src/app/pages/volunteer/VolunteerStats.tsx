import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2, TrendingUp, Users, Coins, Map } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";

export function VolunteerStats() {
  const { state } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  useEffect(() => {
    if (!volId) return;
    client.get<any>(`/volunteers/dashboard?volunteerId=${encodeURIComponent(volId)}`)
      .then(res => setStats(res.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [volId]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">Impact Statistics</h1>
        <p className="text-amber-700/50 text-sm font-bold mt-1">Visualize your lifetime contribution</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-amber-50 rounded-2xl">
          <CardContent className="p-6">
            <Coins className="h-6 w-6 text-amber-600 mb-4" />
            <p className="text-2xl font-black text-amber-900">{stats?.totalCoins || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700/60 mt-1">Total Coins</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-blue-50 rounded-2xl">
          <CardContent className="p-6">
            <Users className="h-6 w-6 text-blue-600 mb-4" />
            <p className="text-2xl font-black text-blue-900">{stats?.totalReferrals || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700/60 mt-1">People Reached</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-emerald-50 rounded-2xl">
          <CardContent className="p-6">
            <TrendingUp className="h-6 w-6 text-emerald-600 mb-4" />
            <p className="text-2xl font-black text-emerald-900">₹{(stats?.totalReferralDonations || 0).toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 mt-1">Funds Mobilized</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-purple-50 rounded-2xl">
          <CardContent className="p-6">
            <Map className="h-6 w-6 text-purple-600 mb-4" />
            <p className="text-2xl font-black text-purple-900">{stats?.campsAttended || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-700/60 mt-1">Camps Attended</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Visual charts could go here in a real implementation using Recharts */}
      <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center">
         <div className="text-center text-gray-400">
           <TrendingUp className="h-10 w-10 mx-auto mb-3 text-gray-200" />
           <p className="font-bold">Growth charts coming soon</p>
           <p className="text-xs">We are preparing beautiful visualizations of your monthly impact trend.</p>
         </div>
      </Card>
    </div>
  );
}
