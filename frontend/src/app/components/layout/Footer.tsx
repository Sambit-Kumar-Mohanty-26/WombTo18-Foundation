import { Link } from "react-router";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200/50 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/Wombto18 foundation logo.svg" 
                alt="WombTo18 Foundation" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="text-lg text-white" style={{ fontWeight: 800 }}>WombTo18</span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider" style={{ lineHeight: 1 }}>Foundation</p>
              </div>
            </div>
            <p className="text-sm text-emerald-100/80 mb-4">
              Nurturing every child from conception to adulthood. Building a foundation of health, education, and opportunity.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            {[
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Our Programs" },
              { href: "/impact", label: "Our Impact" },
              { href: "/donate", label: "Donate" },
              { href: "/blog", label: "Blog" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block text-sm text-emerald-100/80 hover:text-primary py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white mb-4">Programs</h4>
            {[
              "Prenatal Care",
              "Early Childhood",
              "Education Support",
              "Health & Nutrition",
              "Youth Empowerment",
            ].map((item) => (
              <p key={item} className="text-sm text-emerald-100/80 py-1.5">{item}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <p className="text-sm text-emerald-100/80">123 Foundation Street, Mumbai, Maharashtra 400001, India</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm text-emerald-100/80">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm text-emerald-100/80">hello@wombto18.org</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-emerald-100/60">&copy; 2026 WombTo18 Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-emerald-100/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-emerald-100/60 hover:text-primary transition-colors">Terms of Use</a>
            <a href="#" className="text-sm text-emerald-100/60 hover:text-primary transition-colors">80G Certificate</a>
          </div>
        </div>
      </div>
    </footer>
  );
}