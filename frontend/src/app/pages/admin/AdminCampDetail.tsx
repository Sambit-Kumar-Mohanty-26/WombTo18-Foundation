import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tent, Users, Coins, MapPin, Calendar, ArrowLeft, Loader2, Star, CheckCircle2, XCircle, Lock, RefreshCw, Sparkles, Target, Activity, ShieldCheck, Zap, ArrowRight, UserPlus } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { client } from "../../lib/api/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function AdminCampDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<string[]>([]);
  const [masterCountdown, setMasterCountdown] = useState(0);
  const [token, setToken] = useState("");
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectionBusyId, setSelectionBusyId] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await client.get<any>(`/camps/admin/${id}`);
      setData(res);
      setToken(res?.qrCodes?.attendance?.token || "");
      setSelectedVolunteerIds(
        (res?.camp?.participations || [])
          .filter((p: any) => p.shareSelected)
          .map((p: any) => p.volunteerId)
      );

      const expiry = res?.camp?.activeQrExpiry ? new Date(res.camp.activeQrExpiry) : null;
      if (expiry && expiry > new Date()) {
        setIsEngineActive(true);
        setMasterCountdown(Math.floor((expiry.getTime() - Date.now()) / 1000));
      } else {
        setIsEngineActive(false);
        setMasterCountdown(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isEngineActive || loading) return;

    const interval = setInterval(() => {
      setMasterCountdown(prev => {
        if (prev <= 1) {
          setIsEngineActive(false);
          loadData();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEngineActive, loading]);

  const handleToggleSelection = async (volunteerId: string, nextSelected: boolean) => {
    try {
      setSelectionBusyId(volunteerId);
      await client.post(`/camps/${id}/selection`, {
        volunteerId,
        shareSelected: nextSelected,
      });
      setSelectedVolunteerIds(prev =>
        nextSelected ? [...prev, volunteerId] : prev.filter(v => v !== volunteerId)
      );
      await loadData();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update selection");
    } finally {
      setSelectionBusyId(null);
    }
  };

  const handleRegistrationStatus = async (volunteerId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setSelectionBusyId(volunteerId);
      await client.post(`/camps/${id}/registrations/${volunteerId}/status`, { status });
      await loadData();
      toast.success(status === 'APPROVED' ? 'Identity verified' : 'Identity purged');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update registration');
    } finally {
      setSelectionBusyId(null);
    }
  };

  const handleActivateAttendance = async () => {
    try {
      setActivating(true);
      await client.post(`/camps/${id}/activate-attendance`);
      await loadData();
      toast.success("Deployment window initialized for 10 minutes.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to initialize mission window");
    } finally {
      setActivating(false);
    }
  };

  const closeDigitalChannels = async () => {
    try {
      await client.post(`/camps/${id}/close-channels`);
      setIsEngineActive(false);
      setMasterCountdown(0);
      await loadData();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to terminate channels");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
       <Loader2 className="h-10 w-10 animate-spin text-sky-300 mb-4" />
       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Synchronizing Mission Data...</p>
    </div>
  );
  
  if (!data) return <div className="p-10 text-center font-black text-slate-400">MISSION DATA UNREACHABLE</div>;

  const { camp, stats } = data;
  const todayStr = new Date().toDateString();
  const campDateStr = new Date(camp.date).toDateString();
  const isCampDay = todayStr === campDateStr;

  const approvedParticipations = camp.participations?.filter((p: any) => p.status === 'APPROVED' || p.status === 'ATTENDED') || [];
  const pendingRegistrations = camp.participations?.filter((p: any) => p.status === 'PENDING') || [];
  const notJoiningParticipations = approvedParticipations.filter((p: any) => p.volunteerResponse === 'NOT_JOINING');

  const joiningCount = approvedParticipations.filter((p: any) => p.volunteerResponse === 'JOINING').length;
  const activeDivisor = joiningCount > 0 ? joiningCount : (approvedParticipations.length > 0 ? approvedParticipations.length : 1);
  const projectedCoins = camp.totalCoinPool > 0 ? Math.floor(camp.totalCoinPool / activeDivisor) : 100;


  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl hover:bg-white hover:shadow-sm" onClick={() => navigate('/admin/camps')}>
            <ArrowLeft className="h-6 w-6 text-slate-400" />
          </Button>
          <div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm mb-2">
               <Sparkles className="w-3 h-3 mr-2" /> Camp Details
            </Badge>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{camp.name}</h1>
            <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
              <span className="flex items-center gap-1.5 text-sky-400"><MapPin size={12} /> {camp.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-emerald-400" /> {new Date(camp.date).toLocaleDateString()}</span>
              <Badge className="bg-slate-50 text-slate-400 border-none px-2 py-0.5 rounded-md font-black text-[9px]">{camp.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-sky-50 bg-white h-12 px-6">
              <ShieldCheck size={18} className="mr-2 text-sky-500" /> View Roster
           </Button>
           <Button className="rounded-2xl bg-sky-500 hover:bg-sky-600 text-white h-12 px-8 shadow-xl shadow-sky-500/20">
              Edit Camp
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Approved Volunteers", value: stats.totalParticipants, icon: ShieldCheck, color: "sky" },
          { label: "Selected for Story", value: stats.selectedParticipants, icon: Star, color: "amber" },
          { label: "Attendance Count", value: stats.attendedParticipants, icon: Target, color: "emerald" },
          { label: "Not Joining", value: stats.notJoiningParticipants || 0, icon: XCircle, color: "rose" },
        ].map((m, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-none bg-white shadow-xl shadow-sky-900/[0.02] rounded-[2rem] p-6 group hover:bg-slate-50 transition-colors cursor-default">
               <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-${m.color}-50 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <m.icon size={20} className={`text-${m.color}-500`} />
                  </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
               <h4 className="text-2xl font-black text-slate-800 tracking-tighter mt-1">{m.value}</h4>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        {camp.status !== 'COMPLETED' ? (
          isCampDay ? (
            isEngineActive ? (
              <div className="bg-white border border-sky-50 rounded-[3rem] p-4 shadow-2xl shadow-sky-900/[0.04]">
                <div className="grid lg:grid-cols-12 gap-8 items-center p-8">
                   <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative group p-8 bg-sky-50 rounded-[2.5rem] border-2 border-white shadow-inner">
                         <div className="absolute inset-0 bg-sky-500/5 animate-pulse rounded-[2.5rem]" />
                         <AnimatePresence mode="wait">
                           {token ? (
                             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
                               <QRCodeSVG
                                 value={`${window.location.origin}/scan?token=${token}`}
                                 size={220}
                                 level="H"
                                 fgColor="#0369a1"
                                 style={{ transition: 'all 0.3s ease' }}
                                 className="relative z-10"
                               />
                             </motion.div>
                           ) : (
                             <div className="h-[220px] w-[220px] flex items-center justify-center">
                               <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
                             </div>
                           )}
                         </AnimatePresence>
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mt-8">Secure Identity Token: {token?.slice(0, 8)}...</p>
                   </div>
                   
                   <div className="lg:col-span-8 space-y-8">
                      <div className="flex items-center justify-between">
                         <div>
                            <Badge className="bg-sky-50 text-sky-500 border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 mb-2 flex items-center gap-2">
                               <div className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                               </div>
                               Attendance Status: Live
                            </Badge>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Attendance <span className="text-sky-500">Active</span></h3>
                         </div>
                         <Button variant="outline" onClick={closeDigitalChannels} className="rounded-2xl border-rose-50 text-rose-500 hover:bg-rose-50 h-12 px-6 text-[10px] uppercase font-black tracking-widest italic">
                            Close Link
                         </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time Remaining</p>
                            <div className="flex items-end gap-3">
                               <span className={`text-4xl font-black tabular-nums tracking-tighter ${masterCountdown < 60 ? 'text-rose-500' : 'text-slate-800'}`}>{formatTime(masterCountdown)}</span>
                               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">minutes</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-6 overflow-hidden">
                               <motion.div 
                                 initial={{ width: '100%' }}
                                 animate={{ width: `${(masterCountdown / 600) * 100}%` }}
                                 transition={{ duration: 1, ease: 'linear' }}
                                 className={`h-full ${masterCountdown < 60 ? 'bg-rose-400' : 'bg-sky-500'}`} 
                               />
                            </div>
                         </div>
                         
                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                  <Zap className="text-orange-400" size={20} />
                               </div>
                               <div>
                                  <p className="text-[12px] font-black text-slate-800">{projectedCoins} Coin Reward</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Coins Enabled</p>
                               </div>
                            </div>
                            <p className="text-[10px] text-slate-300 font-bold leading-relaxed mt-4">Calculated from pool of {camp.totalCoinPool} divided among {activeDivisor} verified joining volunteers.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-sky-50 rounded-[3rem] p-16 text-center shadow-2xl shadow-sky-900/[0.04] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                   <Zap size={200} className="text-sky-500" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-emerald-100/50">
                      <ShieldCheck size={32} className="text-emerald-500" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Attendance Link Locked</h3>
                   <p className="text-sm font-bold text-slate-400 max-w-lg leading-relaxed mb-10">
                     The attendance window is ready to be opened. Make sure you have selected {selectedVolunteerIds.length} volunteers who should receive attendance.
                   </p>
                   <Button
                     onClick={handleActivateAttendance}
                     disabled={activating || selectedVolunteerIds.length === 0}
                     className="bg-sky-500 hover:bg-sky-600 text-white font-black text-[12px] uppercase tracking-[0.2em] h-14 px-12 rounded-2xl shadow-2xl shadow-sky-500/40 active:scale-95 transition-all"
                   >
                     {activating ? <Loader2 className="h-6 w-6 mr-2 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-3" />}
                     Open 10 Min Window
                   </Button>
                   {selectedVolunteerIds.length === 0 && (
                     <p className="text-[10px] font-black text-orange-400 mt-6 uppercase tracking-widest">Select volunteers to enable the link</p>
                   )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-orange-50/30 border border-orange-100 rounded-[3rem] p-16 text-center shadow-sm">
               <Lock className="w-16 h-16 text-orange-200 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-orange-900 uppercase tracking-tighter">Gateway Standby</h3>
               <p className="text-sm font-bold text-orange-700/60 mt-3 max-w-md mx-auto">
                 The attendance control node will automatically initialize on mission day: <span className="text-orange-500">{campDateStr}</span>.
               </p>
            </div>
          )
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-16 text-center shadow-inner">
             <Activity className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Mission Archive</h3>
             <p className="text-sm font-bold text-slate-300 mt-3">This deployment has been successfully concluded and moved to history.</p>
          </div>
        )}
      </motion.div>

      {pendingRegistrations.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                 <UserPlus size={16} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Pending Registrations</h3>
              <Badge className="bg-orange-50 text-orange-500 border-none px-2 py-0.5 rounded-md font-black text-[9px] uppercase">{pendingRegistrations.length}</Badge>
           </div>
           
           <Card className="border-none bg-white shadow-xl shadow-sky-900/[0.02] rounded-[2.5rem] overflow-hidden">
             <table className="w-full text-sm">
               <thead className="bg-slate-50/50">
                 <tr className="border-b border-gray-50">
                   <th className="px-10 py-5 text-left font-black text-[10px] text-slate-400 uppercase tracking-widest">Volunteer Name</th>
                   <th className="px-8 py-5 text-right font-black text-[10px] text-slate-400 uppercase tracking-widest">Applied On</th>
                   <th className="px-8 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                   <th className="px-10 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {pendingRegistrations.map((p: any) => (
                   <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center font-black text-sky-500 text-[11px] uppercase">{p.volunteer?.name?.slice(0, 2)}</div>
                           <div>
                              <p className="font-black text-slate-900 tracking-tight">{p.volunteer?.name || "Unknown"}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{p.volunteer?.phone || "Phone Hidden"}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-right font-bold text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                     <td className="px-8 py-5 text-center">
                        <Badge className="bg-orange-50 text-orange-500 border-none font-black text-[9px] uppercase px-3 py-1">Pending</Badge>
                     </td>
                     <td className="px-10 py-5">
                        <div className="flex items-center justify-center gap-3">
                           <Button
                             variant="outline"
                             disabled={selectionBusyId === p.volunteerId}
                             onClick={() => handleRegistrationStatus(p.volunteerId, 'APPROVED')}
                             className="h-10 rounded-xl border-emerald-50 text-emerald-500 hover:bg-emerald-50 text-[10px] px-4"
                           >
                             {selectionBusyId === p.volunteerId ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} className="mr-2" />} APPROVE
                           </Button>
                           <Button
                             variant="outline"
                             disabled={selectionBusyId === p.volunteerId}
                             onClick={() => handleRegistrationStatus(p.volunteerId, 'REJECTED')}
                             className="h-10 rounded-xl border-rose-50 text-rose-400 hover:bg-rose-50 text-[10px] px-4"
                           >
                             REJECT
                           </Button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-4">
         <div className="flex items-center justify-between ml-2">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Activity size={16} className="text-emerald-500" />
               </div>
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Approved Volunteers</h3>
            </div>
            {notJoiningParticipations.length > 0 && <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic">{notJoiningParticipations.length} Volunteers Not Joining</span>}
         </div>

         <Card className="border-none bg-white shadow-xl shadow-sky-900/[0.02] rounded-[2.5rem] overflow-hidden">
           <table className="w-full text-sm">
             <thead className="bg-slate-50/50">
               <tr className="border-b border-gray-50">
                 <th className="px-10 py-5 text-left font-black text-[10px] text-slate-400 uppercase tracking-widest">Volunteer Name</th>
                 <th className="px-8 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">RSVP Status</th>
                 <th className="px-8 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">Selected</th>
                 <th className="px-8 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                 <th className="px-8 py-5 text-right font-black text-[10px] text-slate-400 uppercase tracking-widest">Coins</th>
                 <th className="px-10 py-5 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {approvedParticipations.length > 0 ? approvedParticipations.map((p: any) => {
                 const isSelected = !!p.shareSelected;
                 const canToggle = p.status === 'APPROVED';
                 const isNotJoining = p.volunteerResponse === 'NOT_JOINING';
                 return (
                   <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                           <div className={`w-9 h-9 rounded-xl ${isNotJoining ? 'bg-slate-100 text-slate-300' : 'bg-sky-50 text-sky-500'} flex items-center justify-center font-black text-[11px] uppercase`}>{p.volunteer?.name?.slice(0, 2)}</div>
                           <div>
                              <p className={`font-black tracking-tight ${isNotJoining ? 'text-slate-300 line-through' : 'text-slate-900'}`}>{p.volunteer?.name || 'Unknown'}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{p.volunteer?.phone || "Phone Hidden"}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <Badge className={`px-3 py-1 rounded-md font-black text-[8px] uppercase tracking-widest border-none ${p.volunteerResponse === 'JOINING' ? 'bg-emerald-50 text-emerald-600' : p.volunteerResponse === 'NOT_JOINING' ? 'bg-rose-50 text-rose-400' : 'bg-slate-50 text-slate-300'}`}>
                           {p.volunteerResponse || "PENDING"}
                        </Badge>
                     </td>
                     <td className="px-8 py-5 text-center">
                         <div className={`mx-auto w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'}`} />
                     </td>
                     <td className="px-8 py-5 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${p.status === 'ATTENDED' ? 'text-emerald-500' : 'text-slate-300'}`}>{p.status}</span>
                     </td>
                     <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 font-black text-slate-800">
                           <Coins size={12} className={p.coinsAwarded > 0 ? "text-amber-400" : "text-slate-200"} />
                           <span className={p.coinsAwarded > 0 ? "text-slate-800" : "text-slate-200"}>+{p.coinsAwarded}</span>
                        </div>
                     </td>
                     <td className="px-10 py-5">
                       <div className="flex items-center justify-center">
                          {canToggle ? (
                            <Button
                              variant="ghost"
                              disabled={selectionBusyId === p.volunteerId || isNotJoining}
                              onClick={() => handleToggleSelection(p.volunteerId, !isSelected)}
                              className={`h-9 rounded-xl text-[9px] font-black uppercase px-4 ${isSelected ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-sky-50 hover:text-sky-500'}`}
                            >
                              {selectionBusyId === p.volunteerId ? <Loader2 size={12} className="animate-spin" /> : isSelected ? 'Unselect' : 'Select'}
                            </Button>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><Lock size={14} className="text-slate-200" /></div>
                          )}
                       </div>
                     </td>
                   </tr>
                 );
               }) : (
                 <tr>
                   <td colSpan={6} className="px-10 py-20 text-center opacity-40">
                      <Users size={32} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-300">Zero Verified Units Detected</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
           <div className="p-8 text-center bg-slate-50/30 border-t border-slate-50">
              <Button variant="ghost" className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] hover:text-sky-500 hover:bg-transparent">
                 Synchronize External Attendance Ledger <ArrowRight size={14} className="ml-2" />
              </Button>
           </div>
         </Card>
      </motion.div>
    </motion.div>
  );
}

function Button({ children, className, variant = "default", size = "md", ...props }: any) {
  const base = "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 font-black";
  const variants: any = {
    default: "bg-sky-500 text-white",
    ghost: "text-slate-400 hover:bg-slate-100/50",
    outline: "border border-slate-100 text-slate-500 bg-white shadow-sm"
  };
  const sizes: any = {
    sm: "h-9 px-4 text-[10px] uppercase",
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-base"
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
