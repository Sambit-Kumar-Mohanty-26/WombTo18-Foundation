import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Menu, X, Heart, LayoutDashboard } from "lucide-react";
import { auth } from "../../lib/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const navLinks = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about", label: "About", key: "about" },
  { href: "/services", label: "Programs", key: "programs" },
  { href: "/impact", label: "Impact", key: "impact" },
  { href: "/transparency", label: "Transparency Centre", key: "transparency" },
  { href: "/blog", label: "Blog", key: "blog" },
  // { href: "/press", label: "Press", key: "press" },
];

import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { t } = useTranslation();
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = state.isAuthenticated;
  
  const handleSignOut = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
    toast.success("Signed out successfully");
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md py-1" 
          : "bg-white/60 backdrop-blur-md border-b border-transparent py-1 lg:py-2"
      }`}
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/Wombto18 foundation logo.svg" 
              alt="WombTo18 Foundation" 
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-tight" style={{ lineHeight: 1.2 }}>
                <span style={{ color: '#1D6E3F' }}>Womb</span>
                <span style={{ color: '#FF9900' }}>To</span>
                <span style={{ color: '#00AEEF' }}>18</span>
              </span>
              <span className="text-[10px] text-[#1D6E3F] font-bold uppercase tracking-wider" style={{ lineHeight: 1 }}>Foundation</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary hover:bg-primary/5 font-medium transition-all">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />{t('nav.dashboard')}
                  </Button>
                </Link>
                  <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium transition-all"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary hover:bg-primary/5 font-medium transition-all">
                  {t('nav.donorLogin')}
                </Button>
              </Link>
            )}
            <Link to="/donate">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
                <Heart className="h-4 w-4 mr-1 fill-current" /> {t('nav.donate')}
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white/98 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-primary hover:bg-primary/5 font-medium justify-start transition-all">
                      <LayoutDashboard className="h-4 w-4 mr-1.5" />{t('nav.dashboard')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-medium justify-start transition-all">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-primary hover:bg-primary/5 font-medium justify-start transition-all">
                    {t('nav.donorLogin')}
                  </Button>
                </Link>
              )}
              <Link to="/donate" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
                  <Heart className="h-4 w-4 mr-1 fill-current" /> {t('nav.donate')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
