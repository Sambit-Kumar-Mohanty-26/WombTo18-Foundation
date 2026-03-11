import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Menu, X, Heart } from "lucide-react";

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
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="Frontend/public/Wombto18 foundation logo.png" 
              alt="WombTo18 Foundation" 
              className="h-10 w-auto object-contain"
            />
            <div className="hidden xs:flex flex-col leading-tight">
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
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium">Donor Login</Button>
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
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium justify-start">Donor Login</Button>
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
