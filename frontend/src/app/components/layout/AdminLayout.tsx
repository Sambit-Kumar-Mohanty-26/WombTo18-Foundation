import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Users, FolderOpen, FileBarChart, LogOut, Menu, X, ChevronLeft, Newspaper, BookOpen, Tent, Bell, Search, Command } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/donors", label: "Supporters", icon: Users },
  { href: "/admin/programs", label: "Initiatives", icon: FolderOpen },
  { href: "/admin/camps", label: "Health Camps", icon: Tent },
  { href: "/admin/reports", label: "Analytics", icon: FileBarChart },
  { href: "/admin/blog", label: "Journal", icon: Newspaper },
  { href: "/admin/case-studies", label: "Impact Stories", icon: BookOpen },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-black selection:text-white">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 flex flex-col border-r border-slate-200/60 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full shadow-2xl"
        }`}
      >
        {/* Brand Header */}
        <div className="h-24 px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl leading-none tracking-tighter">W.</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">Foundation</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace</p>
            </div>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-black transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Search */}
        <div className="px-6 mb-6">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40">
              <Command size={10} />
              <span className="text-[10px] font-bold">K</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <div className="px-4 mb-3">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Menu</p>
          </div>
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href === "/admin/dashboard" && location.pathname === "/admin");
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-black"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {isActive && (
                   <motion.div 
                     layoutId="activePillAdminModern" 
                     className="absolute inset-0 bg-slate-100/80 rounded-xl mix-blend-multiply" 
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                )}
                <link.icon className={`h-4 w-4 relative z-10 ${isActive ? "text-black" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Block Footer */}
        <div className="p-4 mx-4 mb-4 border border-slate-200 rounded-2xl bg-white relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-black rounded-lg">
                <AvatarFallback className="bg-black text-white text-[11px] font-bold">AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">admin@womb18.org</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center px-1">
             <Link to="/" className="text-[11px] font-semibold text-slate-500 hover:text-black flex-1 flex items-center gap-1.5 transition-colors">
               <ChevronLeft className="h-3 w-3" /> Back
             </Link>
             <button 
               onClick={() => { logout(); navigate("/"); }}
               className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
             >
               Sign out
             </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between">
          <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-black transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Platform Operational</span>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2 text-slate-400 hover:text-black transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <button 
              onClick={() => navigate("/admin/camps/create")}
              className="bg-black hover:bg-slate-800 text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-md shadow-black/10"
            >
              Create Campaign
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}