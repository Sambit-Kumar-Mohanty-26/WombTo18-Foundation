import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Tent, MapPin, Calendar, Loader2, Coins, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { toast } from "sonner";

export function VolunteerCamps() {
  const { state } = useAuth();
  const [myCamps, setMyCamps] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const volId = state.user?.volunteerId || state.user?.identifier || "";
  const historyPageSize = 3;

  const loadCamps = () => {
    if (!volId) return;
    Promise.all([
      client.get<any[]>(`/volunteers/camps/${encodeURIComponent(volId)}`),
      client.get<any[]>("/camps/upcoming"),
    ]).then(([my, up]) => {
      setMyCamps(my || []);
      setUpcoming(up || []);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCamps();
  }, [volId]);

  const sortedHistory = [...myCamps].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.camp?.date || 0).getTime();
    const bTime = new Date(b.createdAt || b.camp?.date || 0).getTime();
    return bTime - aTime;
  });
  const totalHistoryPages = Math.max(1, Math.ceil(sortedHistory.length / historyPageSize));
  const pagedHistory = sortedHistory.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);
  const historyPageNumbers = (() => {
    if (totalHistoryPages <= 5) return Array.from({ length: totalHistoryPages }, (_, index) => index + 1);
    const pages = [1];
    const left = Math.max(2, historyPage - 1);
    const right = Math.min(totalHistoryPages - 1, historyPage + 1);
    if (left > 2) pages.push(-1);
    for (let p = left; p <= right; p += 1) pages.push(p);
    if (right < totalHistoryPages - 1) pages.push(-1);
    pages.push(totalHistoryPages);
    return pages;
  })();

  useEffect(() => {
    if (historyPage > totalHistoryPages) {
      setHistoryPage(totalHistoryPages);
    }
  }, [historyPage, totalHistoryPages]);

  const handleScanDigital = async (campId: string) => {
    try {
      setLocalLoading(true);
      const res: any = await client.post(`/camps/${campId}/scan-digital`, { volunteerId: volId });
      toast.success(res?.awarded ? `Marked Attendance! Awarded ${res.awarded} Coins` : "Attendance Marked successfully!");
      
      // Delay reload slightly to let toast render
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch(err: any) {
      toast.error(err.response?.data?.message || "Failed to process attendance");
      setLocalLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">Camps</h1>
        <p className="text-amber-700/50 text-sm font-bold mt-1">Your camp attendance and upcoming events</p>
      </div>

      {/* Upcoming Camps */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2"><Calendar className="h-5 w-5 text-emerald-500" /> Upcoming Camps</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map((camp: any) => {
                const participation = myCamps.find((p: any) => p.campId === camp.id);
                const campDate = new Date(camp.date);
                const today = new Date();
                const isCampDay = campDate.toDateString() === today.toDateString();
                const diffTime = campDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                const handleRegister = async () => {
                  try {
                    await client.post(`/camps/${camp.id}/register`, { volunteerId: volId });
                    setMyCamps([...myCamps, { campId: camp.id, status: 'PENDING', camp }]);
                  } catch (err: any) {
                    console.error("Failed to register:", err);
                  }
                };

                return (
                  <div key={camp.id} className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-transparent hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Tent className="h-5 w-5 text-emerald-600" />
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold mt-1">
                          {isCampDay ? "TODAY" : camp.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">{camp.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{camp.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold mb-4">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {camp.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {campDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-4 border-t border-emerald-100">
                      {!participation ? (
                        <button onClick={handleRegister} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-colors">
                          Register for Camp
                        </button>
                      ) : (
                        (() => {
                          const now = new Date();
                          const activeExpiry = camp.activeQrExpiry ? new Date(camp.activeQrExpiry) : null;
                          const isShared = !!participation.shareSelected;
                          const isEngineActiveForMe = isShared && activeExpiry && activeExpiry > now;

                          if (participation.status === 'PENDING') {
                            return (
                              <div className="w-full bg-amber-50 text-amber-700 font-bold text-xs py-2.5 rounded-lg text-center border border-amber-200">
                                Waiting for Approval
                              </div>
                            );
                          } else if (participation.status === 'APPROVED') {
                            if (isEngineActiveForMe) {
                              return (
                                <button onClick={() => handleScanDigital(camp.id)} disabled={localLoading} className="w-full bg-emerald-600 animate-pulse hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/30">
                                  {localLoading ? 'Processing...' : '✔ MARK ATTENDANCE NOW'}
                                </button>
                              );
                            } else if (!isShared) {
                              return (
                                <div className="w-full bg-slate-50 text-slate-600 font-bold text-xs py-2.5 rounded-lg text-center border border-slate-200">
                                  Approved: waiting for admin to share the link
                                </div>
                              );
                            } else if (isCampDay) {
                              return (
                                <div className="w-full bg-gray-100 text-gray-400 font-bold text-xs py-2.5 rounded-lg text-center animate-pulse">
                                  Waiting for Admin to open digital attendance...
                                </div>
                              );
                            } else {
                              return (
                                <div className="w-full bg-emerald-50 text-emerald-700 font-bold text-xs py-2.5 rounded-lg border border-emerald-200 text-center">
                                  Approved: {diffDays} days remaining
                                </div>
                              );
                            }
                          } else if (participation.status === 'REJECTED') {
                            return (
                              <div className="w-full bg-rose-50 text-rose-700 font-bold text-xs py-2.5 rounded-lg text-center border border-rose-200">
                                Registration Declined
                              </div>
                            );
                          }
                          return (
                            <div className="w-full bg-gray-100 text-gray-500 font-bold text-xs py-2.5 rounded-lg text-center">
                              Attended
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-200" />
              <p className="font-bold">No upcoming camps</p>
              <p className="text-xs">Check back soon for new events!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Camp History */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2"><Tent className="h-5 w-5 text-amber-500" /> My Camp History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {pagedHistory.length > 0 ? pagedHistory.map((cp: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${cp.participationType === 'ACTIVE' ? 'bg-amber-100' : 'bg-emerald-50'}`}>
                    {cp.participationType === 'ACTIVE' ? <Star className="h-5 w-5 text-amber-600" /> : <Tent className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{cp.camp?.name}</p>
                    <p className="text-[10px] text-gray-400">{cp.camp?.location} • {new Date(cp.camp?.date || cp.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-[10px] font-bold ${cp.participationType === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {cp.participationType === 'ACTIVE' ? '⭐ Active' : 'Normal'}
                  </Badge>
                  <p className="text-xs font-black text-amber-600 mt-1 flex items-center justify-end gap-1">
                    +{cp.coinsAwarded} <Coins className="h-3 w-3" />
                  </p>
                </div>
              </div>
            )) : (
              <div className="py-16 text-center text-gray-400">
                <Tent className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <p className="font-bold">No camp history</p>
                <p className="text-xs mt-1">Scan camp QR codes to register your attendance!</p>
              </div>
            )}
          </div>
          {sortedHistory.length > 3 && (
            <div className="px-4 py-4 border-t border-gray-100">
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        if (historyPage > 1) setHistoryPage(current => current - 1);
                      }}
                      className={historyPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {historyPageNumbers.map((value, index) =>
                    value === -1 ? (
                      <PaginationItem key={`history-ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={value}>
                        <PaginationLink
                          href="#"
                          isActive={value === historyPage}
                          onClick={(event) => {
                            event.preventDefault();
                            setHistoryPage(value);
                          }}
                        >
                          {value}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        if (historyPage < totalHistoryPages) setHistoryPage(current => current + 1);
                      }}
                      className={historyPage === totalHistoryPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
