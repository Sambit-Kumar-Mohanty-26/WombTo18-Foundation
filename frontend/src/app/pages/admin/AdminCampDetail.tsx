import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tent, Users, Coins, MapPin, Calendar, ArrowLeft, Loader2, Star, CheckCircle2, XCircle, Lock, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { client } from "../../lib/api/client";
import { toast } from "sonner";

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
      toast.success(status === 'APPROVED' ? 'Volunteer approved' : 'Volunteer rejected');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update registration status');
    } finally {
      setSelectionBusyId(null);
    }
  };

  const handleActivateAttendance = async () => {
    try {
      setActivating(true);
      await client.post(`/camps/${id}/activate-attendance`);
      await loadData();
      toast.success("Attendance QR activated for 10 minutes.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to activate attendance QR");
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
      toast.error(e.response?.data?.message || "Failed to close attendance channel");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  if (!data) return <div className="p-10 text-center">Camp not found</div>;

  const { camp, stats } = data;
  const todayStr = new Date().toDateString();
  const campDateStr = new Date(camp.date).toDateString();
  const isCampDay = todayStr === campDateStr;

  const approvedParticipations = camp.participations?.filter((p: any) => p.status === 'APPROVED' || p.status === 'ATTENDED') || [];
  const pendingRegistrations = camp.participations?.filter((p: any) => p.status === 'PENDING') || [];

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/camps')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{camp.name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {camp.location}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(camp.date).toLocaleDateString()}</span>
            <Badge variant="outline" className="ml-2 text-xs font-bold uppercase">{camp.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <h4 className="text-xl font-black">{stats.totalParticipants}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Selected for Share</p>
              <h4 className="text-xl font-black">{stats.selectedParticipants}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Tent className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Attended</p>
              <h4 className="text-xl font-black">{stats.attendedParticipants}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {camp.status !== 'COMPLETED' ? (
        isCampDay ? (
          isEngineActive ? (
            <div className="bg-emerald-50/50 border-2 border-emerald-300 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </div>
                  <h3 className="text-lg font-black text-emerald-900">Attendance QR is LIVE</h3>
                </div>
                <Button variant="outline" onClick={closeDigitalChannels} className="h-9 text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs">
                  <XCircle className="h-4 w-4 mr-1" /> Close Channels
                </Button>
              </div>

              <div className="mb-6 bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Master Timer</span>
                  <span className={`text-2xl font-black tabular-nums ${masterCountdown < 60 ? 'text-rose-600' : 'text-emerald-700'}`}>{formatTime(masterCountdown)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(masterCountdown / 600) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">QR closes automatically at 0:00</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Tent className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-lg font-black text-gray-900">100 Coin Attendance QR</h4>
                </div>
                <Badge className="bg-amber-50 text-amber-700 text-xs font-bold mb-4">Single QR for camp attendance</Badge>
                <div className="flex justify-center mb-4 p-4 bg-emerald-50/50 rounded-xl">
                  {token ? (
                    <QRCodeSVG
                      value={`${window.location.origin}/scan?token=${token}`}
                      size={190}
                      level="H"
                      fgColor="#047857"
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  ) : (
                    <div className="h-[190px] w-[190px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-mono break-all">{token?.slice(0, 20)}...</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
              <Tent className="h-12 w-12 text-emerald-500 mb-4 opacity-50" />
              <h3 className="text-xl font-black text-emerald-900">Attendance QR Offline</h3>
              <p className="text-sm font-medium text-emerald-700 mt-2 max-w-md">
                On camp day, the admin can open the 10-minute attendance window with one click after selecting approved volunteers.
              </p>
              <p className="text-xs text-amber-700 mt-3 font-semibold">
                Approved and selected volunteers: {selectedVolunteerIds.length}
              </p>
              <Button
                onClick={handleActivateAttendance}
                disabled={activating || selectedVolunteerIds.length === 0}
                className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-emerald-500/30"
              >
                {activating ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-2" />}
                Activate 10 Min Window
              </Button>
              {selectedVolunteerIds.length === 0 && (
                <p className="text-xs text-amber-700 mt-3 font-semibold">Pick at least one approved volunteer before activation.</p>
              )}
            </div>
          )
        ) : (
          <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <Lock className="h-12 w-12 text-amber-300 mb-4" />
            <h3 className="text-xl font-black text-amber-900">Control Locked</h3>
            <p className="text-sm font-medium text-amber-700 mt-2 max-w-md">The attendance QR will be available on the camp day: {campDateStr}.</p>
          </div>
        )
      ) : (
        <div className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <Lock className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-black text-gray-500">Camp Concluded</h3>
          <p className="text-sm font-medium text-gray-400 mt-2 max-w-md">This camp has passed. Attendance is no longer available.</p>
        </div>
      )}

      {pendingRegistrations.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-gray-900 pt-4">Pending Approvals</h3>
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-amber-50/50 border-b border-amber-100 text-amber-900">
                <tr>
                  <th className="px-5 py-3 font-semibold">Volunteer Name</th>
                  <th className="px-5 py-3 font-semibold text-right">Applied At</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {pendingRegistrations.map((p: any) => (
                  <tr key={p.id} className="hover:bg-amber-50/30">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.volunteer?.name || 'Unknown'}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-center">
                      <Badge className="bg-amber-100 text-amber-700 text-[10px] font-bold">Pending</Badge>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={selectionBusyId === p.volunteerId}
                          onClick={() => handleRegistrationStatus(p.volunteerId, 'APPROVED')}
                          className="h-8 text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        >
                          {selectionBusyId === p.volunteerId ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={selectionBusyId === p.volunteerId}
                          onClick={() => handleRegistrationStatus(p.volunteerId, 'REJECTED')}
                          className="h-8 text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3 className="text-lg font-bold text-gray-900 pt-4">Approved Roster</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="px-5 py-3 font-semibold">Volunteer Name</th>
              <th className="px-5 py-3 font-semibold">Share Link</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Coins Issued</th>
              <th className="px-5 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {approvedParticipations.length > 0 ? approvedParticipations.map((p: any) => {
              const isSelected = !!p.shareSelected;
              const canToggle = p.status === 'APPROVED';
              return (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{p.volunteer?.name || 'Unknown'}</td>
                  <td className="px-5 py-3">
                    <Badge className={`text-[10px] font-bold ${isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {isSelected ? 'Shared' : 'Not Shared'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={`text-[10px] font-bold ${p.status === 'ATTENDED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-amber-600">+{p.coinsAwarded}</td>
                  <td className="px-5 py-3 text-center">
                    {canToggle ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={selectionBusyId === p.volunteerId}
                        onClick={() => handleToggleSelection(p.volunteerId, !isSelected)}
                        className={`h-8 text-xs font-bold ${isSelected ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50' : 'text-gray-700'}`}
                      >
                        {selectionBusyId === p.volunteerId ? <Loader2 className="h-4 w-4 animate-spin" /> : isSelected ? 'Shared' : 'Share Link'}
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">Locked</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No approved participants yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
