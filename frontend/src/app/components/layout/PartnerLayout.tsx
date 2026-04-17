import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { LayoutDashboard, Bell, LogOut, Menu, X, ChevronLeft, Link2, Award, BarChart3, Search, Command, ShieldCheck, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export function PartnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, logout } = useAuth();
  
  useEffect(() => {
    if (state.isLoaded) {
      if (!state.user) {
        navigate('/partner/login', { replace: true });
      } else {
        const expectedId = (state.user as any).partnerId;
        if (id && expectedId && id !== expectedId) {
          navigate(`/partner/${expectedId}/dashboard`, { replace: true });
        }
      }
    }
  }, [navigate, id, state.user, state.isLoaded]);

  const expectedId = (state.user as any)?.partnerId;
  const isAuthorized = state.isLoaded && state.user && (!id || id === expectedId);

  if (!state.isLoaded || (!isAuthorized && state.user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-[3px] border-emerald-100 border-t-[#1D6E3F] rounded-full" 
          />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  const ptnId = expectedId || 'N/A';
  const partnerLinks = [
    { href: `/partner/${ptnId}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/partner/${ptnId}/profile`, label: "Profile", icon: User },
    { href: `/partner/${ptnId}/referrals`, label: "Referrals", icon: Link2 },
    { href: `/partner/${ptnId}/stats`, label: "Statistics", icon: BarChart3 },
    { href: `/partner/${ptnId}/certificates`, label: "Documents", icon: Award },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const orgName = (state.user as any)?.organizationName || "Partner Organization";
  const initials = orgName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-[#1D6E3F]/10">
      <motion.aside
        initial={false}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#1D6E3F] text-white transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-24 px-8 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6 text-[#1D6E3F]" />
            </div>
            <div>
              <h1 className="text-[14px] font-black text-white tracking-tight leading-none uppercase">WombTo18</h1>
              <p className="text-[9px] font-bold text-emerald-300 tracking-widest mt-1">PARTNER PORTAL</p>
            </div>
          </Link>
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Partner Badge */}
        <div className="px-6 py-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9900] to-[#FF6B00] flex items-center justify-center font-black text-[12px] text-white shadow-lg">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-white truncate">{orgName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider">Partner ID: {ptnId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Workspace</p>
          {partnerLinks.map((link) => {
            const isActive = location.pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
                  isActive
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="partnerActiveBar"
                    className="absolute left-0 w-1.5 h-6 bg-[#FF9900] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon className={`h-[18px] w-[18px] ${isActive ? "text-[#FF9900]" : "text-white/30 group-hover:text-white/50"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/10 bg-black/5">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
            <ChevronLeft className="h-4 w-4" /> Public Portal
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-rose-300/60 hover:text-rose-300 hover:bg-rose-500/10 transition-all mt-1"
          >
            <LogOut className="h-4 w-4" /> Secure Sign Out
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-[80px] px-8 flex items-center justify-between">
          <button className="lg:hidden p-2 text-gray-400 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden lg:flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#1D6E3F] rounded-full border border-emerald-100/50">
                <Sparkles size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Partner Dashboard</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D6E3F] transition-colors" />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none w-48 focus:w-64 focus:border-emerald-200 focus:bg-white transition-all shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-20 pointer-events-none">
                <Command size={10} />
                <span className="text-[9px] font-black">K</span>
              </div>
            </div>

            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF9900] border-2 border-white rounded-full"></span>
            </button>

            <Avatar className="h-10 w-10 border-2 border-emerald-50 p-0.5">
              <AvatarFallback className="bg-[#1D6E3F] text-white text-[11px] font-black rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 relative overflow-x-hidden overflow-y-auto">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
          
          <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto min-h-full">
             <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1D6E3F]/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
