import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, FileText, CheckCircle2, AlertCircle, Building2, MapPin, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";

const partnerStats = [
  { label: "Active Operations", value: "8 Schools", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Beneficiaries Served", value: "4,240", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Reports Generated", value: "24", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Compliance Score", value: "100%", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
];

const projects = [
  { name: "Snehanchal Day School", location: "Bhubaneswar", students: 450, status: "Healthy", lastVisit: "Mar 15, 2026" },
  { name: "Pratibha Residential", location: "Cuttack", students: 1200, status: "Active", lastVisit: "Feb 28, 2026" },
  { name: "Govt School - Sec 4", location: "Rourkela", students: 380, status: "Healthy", lastVisit: "Mar 10, 2026" },
];

export function PartnerDashboard() {
  const { state } = useAuth();
  const partnerName = state.user?.name || "Partner Institute";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Premium Institutional Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a3a1e] p-8 md:p-12 text-white shadow-2xl shadow-emerald-950/20">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[200px] h-[200px] rounded-full bg-blue-500/10 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold uppercase tracking-[0.2em] text-[10px] px-3 py-1">
              Verified Partner Portal
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Welcome back,</h1>
            <p className="text-emerald-100/60 text-lg font-medium tracking-tight">
              Managing impact records for <span className="text-white font-bold">{partnerName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-12 rounded-2xl px-6 font-bold transition-all">
              <Download className="h-4 w-4 mr-2" /> Export Log
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-white border-none h-12 rounded-2xl px-8 font-black shadow-xl shadow-emerald-900/40 transition-all active:scale-95">
              Support Desk
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {partnerStats.map((stat, i) => (
          <Card key={i} className="group relative border-none bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${stat.bg.replace('50', '10')}`} />
            <CardContent className="p-8 relative">
              <div className={`w-14 h-14 rounded-2xl translate-z-0 ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.15em]">{stat.label}</p>
              
              {/* Subtle accent bar */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full w-2/3 ${stat.color.replace('text-', 'bg-')} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Operations Hub */}
        <Card className="lg:col-span-2 border-none bg-white/80 backdrop-blur-2xl shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-gray-900 tracking-tight">Active Operation Sites</CardTitle>
              <p className="text-sm font-medium text-gray-400 mt-1">Real-time health delivery tracking</p>
            </div>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-widest">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {projects.map((p, i) => (
                <div key={i} className="group p-8 hover:bg-emerald-50/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:border-emerald-200 group-hover:shadow-md transition-all duration-300">
                      <MapPin className="h-6 w-6 text-gray-300 group-hover:text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 group-hover:text-emerald-900 transition-colors tracking-tight">{p.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.location}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span className="text-xs font-bold text-emerald-600/70">{p.students} Enrolled</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden sm:flex flex-col items-end">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1 rounded-lg">
                        {p.status}
                      </Badge>
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2 italic flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Audited {p.lastVisit}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-300 group-hover:translate-x-1">
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50/50 flex items-center justify-center">
              <Button variant="link" className="text-gray-400 hover:text-emerald-600 font-bold gap-2 no-underline">
                Generate Comprehensive Performance Sheet <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <Card className="group relative bg-[#0a3a1e] border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-8 text-white min-h-[320px] flex flex-col">
            <div className="absolute top-[-20%] right-[-10%] w-[180px] h-[180px] rounded-full bg-emerald-500/20 blur-3xl transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <AlertCircle className="h-7 w-7 text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-3">Health Audit Protocol</h3>
                <p className="text-emerald-100/60 font-medium leading-relaxed">
                  Annual student record synchronization for the 2026-27 session commences on <span className="text-white font-bold">April 1st</span>. 
                  Please ensure biometric parity before the deadline.
                </p>
              </div>
              <Button className="mt-auto w-full h-14 bg-orange-500 hover:bg-orange-400 text-white font-black text-base rounded-2xl border-none shadow-xl shadow-orange-950/40 transition-all active:scale-95">
                Review Protocol
              </Button>
            </div>
          </Card>

          <Card className="border-none bg-white/50 backdrop-blur-xl shadow-sm rounded-[2rem] p-8 border border-gray-100/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-black text-gray-900 tracking-tight">Support Architecture</h3>
            </div>
            <p className="text-sm font-medium text-gray-400 leading-relaxed mb-6">
              Our technical compliance team is available for real-time synchronization assistance.
            </p>
            <div className="p-5 rounded-2xl bg-white/50 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors">
              <span className="text-xs font-bold text-gray-900 lowercase tracking-widest">partners@wombto18.org</span>
              <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
