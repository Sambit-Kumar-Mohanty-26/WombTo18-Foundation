import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Users, FolderOpen, FileBarChart, LogOut, Menu, X, ChevronLeft, Newspaper, BookOpen, Tent } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/donors", label: "Manage Donors", icon: Users },
  { href: "/admin/programs", label: "Programs", icon: FolderOpen },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/camps", label: "Camp Management", icon: Tent },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Premium Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a3a1e] text-white shadow-2xl transition-all duration-500 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                <img src="/Wombto18 foundation logo icon only.svg" alt="Admin" className="h-6 w-auto" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white uppercase tracking-widest">Staff Portal</h1>
                <p className="text-[10px] text-emerald-400/70 font-bold tracking-widest uppercase">Admin System v2.0</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  location.pathname === link.href
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/50 scale-[1.02]"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className={`h-5 w-5 ${location.pathname === link.href ? "text-white" : "text-emerald-500/50"}`} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer of Sidebar */}
          <div className="p-6 border-t border-white/5 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Exit to Homepage
            </Link>
            <button 
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" /> End Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 px-8 py-5 flex items-center gap-4">
          <button className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:inline-flex bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px] tracking-widest uppercase">
                Secure Authentication: OK
              </Badge>
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">Super Administrator</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Full System Control</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-emerald-500/10">
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#0a3a1e]/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}