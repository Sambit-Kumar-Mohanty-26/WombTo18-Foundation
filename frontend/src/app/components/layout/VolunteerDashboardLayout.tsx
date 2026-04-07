import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router";
import {
  LayoutDashboard, Coins, Users, Tent, Trophy, Award, BarChart3,
  LogOut, Menu, X, ChevronLeft, User, Zap
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth, DonorSession } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export function VolunteerDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<DonorSession | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const s = auth.getSession();
    if (!s) {
      navigate("/login", { replace: true });
    } else {
      setSession(s);
      
      // Mandatory Onboarding Guard
      if (s.role === 'VOLUNTEER' && s.profileCompleted === false) {
        navigate("/volunteer-onboarding", { replace: true });
        return;
      }

      const expectedId = s.volunteerId || s.donorId;
      if (id && expectedId && id !== expectedId) {
        navigate(`/volunteer/${expectedId}/dashboard`, { replace: true });
      }
    }
  }, [navigate, id]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFFAF0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-amber-700/60 text-sm font-bold">Loading volunteer hub...</p>
        </div>
      </div>
    );
  }

  const volId = session.volunteerId || session.donorId || 'admin';
  const volunteerLinks = [
    { href: `/volunteer/${volId}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/volunteer/${volId}/coins`, label: "Impact Credits", icon: Coins },
    { href: `/volunteer/${volId}/referrals`, label: "Referrals", icon: Users },
    { href: `/volunteer/${volId}/camps`, label: "Camps", icon: Tent },
    { href: `/volunteer/${volId}/leaderboard`, label: "Leaderboard", icon: Trophy },
    { href: `/volunteer/${volId}/certificates`, label: "Certificates", icon: Award },
    { href: `/volunteer/${volId}/commissions`, label: "Rewards", icon: Zap },
    { href: `/volunteer/${volId}/stats`, label: "Stats", icon: BarChart3 },
    { href: `/volunteer/${volId}/profile`, label: "Profile", icon: User },
  ];

  const { logout } = useAuth();
  const handleLogout = () => { logout(); navigate("/"); };
  const initials = (session.name || session.identifier || "V").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-[#FFFAF0]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-gradient-to-b from-[#1a0e00] to-[#2d1800] text-white transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 flex items-center justify-between border-b border-white/5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="h-5 w-5 text-white fill-current" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight">
                  <span className="text-amber-400">Womb</span>
                  <span className="text-orange-300">To</span>
                  <span className="text-yellow-300">18</span>
                </span>
                <p className="text-[8px] text-amber-500/50 font-bold uppercase tracking-[0.2em] -mt-0.5">Volunteer Hub</p>
              </div>
            </Link>
            <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="p-4 mx-3 mt-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-amber-500/30">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-black">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{session.name || "Volunteer"}</p>
                <p className="text-[10px] text-amber-400/60 font-bold uppercase tracking-widest">{session.volunteerId || "VOL"}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
            {volunteerLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/5 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-white/30 hover:text-white hover:bg-white/5 transition-all">
              <ChevronLeft className="h-4 w-4" /> Back to Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#FFFAF0]/80 backdrop-blur-xl border-b border-amber-100/50 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-amber-900 hover:bg-amber-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg text-amber-950 font-black tracking-tight">Volunteer Hub</h2>
              <p className="text-[10px] text-amber-600/50 font-bold uppercase tracking-widest">Impact Through Action</p>
            </div>
          </div>
          <Link to="/donate">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black shadow-lg shadow-amber-500/20 rounded-xl h-10 px-5 text-sm">
              <Zap className="h-4 w-4 mr-2 fill-current" /> Quick Donate
            </Button>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
