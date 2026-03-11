import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Heart, LayoutDashboard, Receipt, FileText, Award, LogOut, Menu, X, ChevronLeft, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";

const donorLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/donations", label: "My Donations", icon: Receipt },
  { href: "/dashboard/reports", label: "Impact Reports", icon: FileText },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-emerald-950/50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-white border-r border-white/5 transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/Foundation logo .png" 
                alt="WombTo18 Foundation" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-bold">WombTo18</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/20 text-primary text-sm">PS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Priya Sharma</p>
                <p className="text-xs text-emerald-400 font-medium">Platinum Donor</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {donorLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-orange-500/20"
                    : "text-emerald-100/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className={`h-4 w-4 ${location.pathname === link.href ? "fill-current" : ""}`} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-emerald-100/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Website
            </Link>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-emerald-100/60 hover:text-rose-400 hover:bg-rose-400/5 transition-colors w-full">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-emerald-950/50">
        <header className="sticky top-0 z-30 bg-emerald-900/50 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-white hover:bg-white/5 rounded-md" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg text-white font-semibold">Donor Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Impact Score</span>
              <span className="text-sm text-white font-bold">1,240 pts</span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Quick Donate
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}