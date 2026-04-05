import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Heart, LayoutDashboard, Receipt, FileText, Award, LogOut, Menu, X, ChevronLeft, CalendarDays, User } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth, DonorSession } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

import { useDonorData } from "../../lib/useDonorData";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<DonorSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch dynamic donor data (cached across components)
  const { impactScore } = useDonorData();

  useEffect(() => {
    const currentSession = auth.getSession();
    if (!currentSession) {
      navigate("/donor/login", { replace: true });
    } else {
      setSession(currentSession);
      setIsLoading(false);
      const expectedId = currentSession.donorId;
      if (id && expectedId && id !== expectedId) {
        navigate(`/donor/${expectedId}/dashboard`, { replace: true });
      }
    }
  }, [navigate, id]);

  if (isLoading || !session) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading dashboard...</div>;
  }

  const donId = session.donorId || 'legacy';
  const allDonorLinks = [
    { href: `/donor/${donId}/dashboard`, label: "Overview", icon: LayoutDashboard, requiredEligibility: true },
    { href: `/donor/${donId}/donations`, label: "My Donations", icon: Receipt, requiredEligibility: false },
    { href: `/donor/${donId}/reports`, label: "Impact Reports", icon: FileText, requiredEligibility: true },
    { href: `/donor/${donId}/certificates`, label: "Receipts & Certificates", icon: Award, requiredEligibility: false },
    { href: `/donor/${donId}/events`, label: "Events", icon: CalendarDays, requiredEligibility: true },
    { href: `/donor/${donId}/profile`, label: "Profile", icon: User, requiredEligibility: false },
  ];

  // Filter links based on donor eligibility
  const visibleLinks = allDonorLinks.filter(link => 
    !link.requiredEligibility || session.eligible
  );

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex text-slate-800 font-sans selection:bg-[#1D6E3F]/20 relative bg-[#FAFAF8]">
      {/* Background Cinematic Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden fixed z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(29,110,63,0.06)_0%,_transparent_70%)] rounded-full blur-[80px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(242,159,5,0.04)_0%,_transparent_70%)] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/70 backdrop-blur-3xl border-r border-white shadow-[10px_0_40px_-20px_rgba(0,0,0,0.05)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-white/40 to-transparent">
          <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/Foundation logo .png" 
                alt="WombTo18 Foundation" 
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="text-sm font-black tracking-tight">
                <span style={{ color: '#1D6E3F' }}>Womb</span>
                <span style={{ color: '#FF9900' }}>To</span>
                <span style={{ color: '#00AEEF' }}>18</span>
              </span>
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1D6E3F] to-emerald-400 rounded-full blur opacity-40" />
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md relative bg-white">
                    <AvatarFallback className="bg-emerald-50 text-[#1D6E3F] font-black">{session.identifier.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 truncate max-w-[140px] tracking-tight" title={session.identifier}>
                    {session.identifier.split("@")[0]}
                  </p>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1D6E3F]/80">
                    {session.eligible ? "Premium Donor" : "Donor"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "text-white shadow-[0_10px_20px_-10px_rgba(29,110,63,0.4)]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1D6E3F] to-emerald-500 z-0" />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 z-0 mix-blend-overlay" />
                  )}
                  <link.icon className={`h-4 w-4 relative z-10 transition-transform duration-300 ${isActive ? "text-white scale-110" : "group-hover:scale-110 text-gray-400 group-hover:text-[#1D6E3F]"}`} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400" />
              Back to Website
            </Link>
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-rose-700 hover:bg-rose-50/80 transition-all duration-300 w-full"
            >
              <LogOut className="h-4 w-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-white/50 h-20 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_30px_-20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl text-gray-900 font-black tracking-tight hidden sm:block">Donor Ecosystem</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#F29F05]">Impact Score</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Award className="h-3.5 w-3.5 text-[#F29F05] fill-[#F29F05]/20" />
                <span className="text-base text-gray-900 font-extrabold tracking-tight">{impactScore.toLocaleString()} <span className="text-xs text-gray-400 font-bold ml-0.5">pts</span></span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <Button size="lg" className="bg-gradient-to-r from-[#1D6E3F] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-black shadow-[0_10px_20px_-10px_rgba(29,110,63,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(29,110,63,0.6)] rounded-xl px-5 h-10 transition-all duration-300 hover:-translate-y-0.5 border border-emerald-500/20">
              <Heart className="h-4 w-4 mr-2 fill-emerald-400/50" />
              Quick Donate
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}