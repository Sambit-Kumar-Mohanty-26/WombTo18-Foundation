import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Menu, X, Heart, LayoutDashboard } from "lucide-react";
import { auth } from "../../lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Programs" },
  { href: "/impact", label: "Impact" },
  { href: "/blog", label: "Blog" },
  { href: "/press", label: "Press" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Re-check session on every route change
  useEffect(() => {
    setIsLoggedIn(!!auth.getSession());
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-lg border-b border-emerald-800/50 shadow-lg shadow-black/20 py-0" 
          : "bg-background/60 backdrop-blur-md border-b border-transparent py-2"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/Wombto18 foundation logo.svg" 
              alt="WombTo18 Foundation" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg text-white" style={{ fontWeight: 800, lineHeight: 1.2 }}>WombTo18</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider" style={{ lineHeight: 1 }}>Foundation</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-emerald-100/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to={isLoggedIn ? "/dashboard" : "/donor/login"}>
              <Button variant="ghost" size="sm" className="text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium">
                {isLoggedIn ? (
                  <><LayoutDashboard className="h-4 w-4 mr-1.5" />My Dashboard</>
                ) : (
                  "Donor Login"
                )}
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
                <Heart className="h-4 w-4 mr-1 fill-current" /> Donate Now
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-emerald-950/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-emerald-100/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link to={isLoggedIn ? "/dashboard" : "/donor/login"} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium justify-start">
                  {isLoggedIn ? (
                    <><LayoutDashboard className="h-4 w-4 mr-1.5" />My Dashboard</>
                  ) : (
                    "Donor Login"
                  )}
                </Button>
              </Link>
              <Link to="/donate" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
                  <Heart className="h-4 w-4 mr-1 fill-current" /> Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
