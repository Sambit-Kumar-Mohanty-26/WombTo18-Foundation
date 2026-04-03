import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router";
import { LayoutDashboard, Building2, Bell, LogOut, Menu, X, ChevronLeft, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";

export function PartnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, logout } = useAuth();
  
  useEffect(() => {
    if (state.user) {
      const expectedId = state.user.donorId;
      if (id && expectedId && id !== expectedId) {
        navigate(`/partner/${expectedId}/dashboard`, { replace: true });
      }
    } else if (state.isLoaded) {
      navigate('/partner/login', { replace: true });
    }
  }, [navigate, id, state.user, state.isLoaded]);

  const ptnId = state.user?.donorId || 'legacy';
  const partnerLinks = [
    { href: `/partner/${ptnId}/dashboard`, label: "Overview", icon: LayoutDashboard },
    { href: `/partner/${ptnId}/projects`, label: "My Projects", icon: MapPin },
    { href: `/partner/${ptnId}/notices`, label: "Announcements", icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* Sidebar for Partner */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-gray-900 border-r border-gray-100 transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/WombTo18 foundation logo icon only.svg" 
                alt="WombTo18 Foundation" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-bold text-gray-900 tracking-tight">Partner Portal</span>
            </Link>
            <button className="lg:hidden p-2 text-gray-400 hover:text-gray-900" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Hook */}
          <div className="p-5">
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-emerald-500/20">
                  <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                    {state.user?.name?.substring(0, 2) || "PI"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">Institution Member</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest truncate">{partnerLinks[0].label}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 mt-2">
            {partnerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.href
                    ? "bg-[#0a3a1e] text-white shadow-lg shadow-emerald-900/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-emerald-50/50"
                }`}
              >
                <link.icon className={`h-4.5 w-4.5 ${location.pathname === link.href ? "fill-white/10" : ""}`} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-50 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
              Main Website
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors w-full"
            >
              <LogOut className="h-4.5 w-4.5" />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">Operational Status: Healthy</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
