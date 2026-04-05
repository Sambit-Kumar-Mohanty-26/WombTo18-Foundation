import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Trophy, Coins, Tent, Users, EyeOff, Eye, Loader2, Medal, Crown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { toast } from "sonner";

export function VolunteerLeaderboard() {
  const { state } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnBoard, setShowOnBoard] = useState(true);
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  useEffect(() => {
    client.get<any[]>("/volunteers/leaderboard")
      .then(setLeaderboard).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleVisibility = async () => {
    try {
      await client.post("/volunteers/leaderboard-visibility", { volunteerId: volId, show: !showOnBoard });
      setShowOnBoard(!showOnBoard);
      toast.success(showOnBoard ? "Your name is now hidden on the leaderboard" : "Your name is now visible on the leaderboard");
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  const myRank = leaderboard.find(v => v.volunteerId === volId);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-amber-950 tracking-tight">Volunteer Leaderboard</h1>
          <p className="text-amber-700/50 text-sm font-bold mt-1">Ranked by coins earned through impact</p>
        </div>
        <Button onClick={toggleVisibility} variant="outline" className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 font-bold">
          {showOnBoard ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showOnBoard ? "Hide My Name" : "Show My Name"}
        </Button>
      </div>

      {/* My Position */}
      {myRank && (
        <Card className="border-none shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black">
                #{myRank.rank}
              </div>
              <div>
                <p className="text-lg font-black">Your Current Rank</p>
                <p className="text-amber-100/60 text-sm font-bold">{myRank.totalCoins} coins earned</p>
              </div>
            </div>
            <Trophy className="h-10 w-10 text-amber-200/40" />
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="font-black flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Top Volunteers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {leaderboard.map((v, i) => {
              const isMe = v.volunteerId === volId;
              const rankIcons = [Crown, Medal, Medal];
              const rankColors = ["text-amber-500", "text-gray-400", "text-orange-400"];
              return (
                <div key={i} className={`flex items-center justify-between p-4 transition-colors ${isMe ? 'bg-amber-50/50 border-l-4 border-amber-500' : 'hover:bg-gray-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm ${
                      i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {i < 3 ? (() => { const Icon = rankIcons[i]; return <Icon className={`h-5 w-5 ${rankColors[i]}`} />; })() : v.rank}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isMe ? 'text-amber-900' : 'text-gray-900'}`}>
                        {v.name} {isMe && <span className="text-amber-500 text-xs">(You)</span>}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">{v.volunteerId}{v.city ? ` • ${v.city}` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
                      <Coins className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-sm font-black text-amber-700">{v.totalCoins}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
