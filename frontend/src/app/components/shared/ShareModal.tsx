import { motion, AnimatePresence } from "motion/react";
import { X, Twitter, Linkedin, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareText: string;
  shareUrl: string;
  type: 'DONOR' | 'VOLUNTEER' | 'PARTNER';
}

export function ShareModal({ isOpen, onClose, title, shareText, shareUrl, type }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Derive theme colors based on role
  const getThemeColors = () => {
    switch(type) {
      case 'VOLUNTEER': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', btnHover: 'hover:bg-amber-100' };
      case 'PARTNER': return { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', btnHover: 'hover:bg-sky-100' };
      default: return { bg: 'bg-emerald-50', text: 'text-[var(--womb-forest)]', border: 'border-emerald-200', btnHover: 'hover:bg-emerald-100' };
    }
  };

  const theme = getThemeColors();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    toast.success("Share text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    // LinkedIn share endpoint taking only URL, text is grabbed from og:tags
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-white/20 overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Share your Impact</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">
            Tell the world about {title.toLowerCase()} and inspire others to get involved!
          </p>

          <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} mb-6`}>
            <p className="text-gray-800 text-sm leading-relaxed mb-4 font-medium italic">
              "{shareText}"
            </p>
            <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
              <input 
                type="text" 
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent border-none text-xs font-mono text-gray-500 outline-none px-2"
              />
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} hover:opacity-80`}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={shareToTwitter}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ecf4f8] text-[#1DA1F2] hover:bg-[#e1eff6] transition-colors"
            >
              <Twitter className="h-6 w-6 mb-2" />
              <span className="text-xs font-bold">Twitter</span>
            </button>
            <button 
              onClick={shareToLinkedIn}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#eef3f8] text-[#0A66C2] hover:bg-[#e1e9f1] transition-colors"
            >
              <Linkedin className="h-6 w-6 mb-2" />
              <span className="text-xs font-bold">LinkedIn</span>
            </button>
            <button 
              onClick={shareToWhatsApp}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ecf7f4] text-[#25D366] hover:bg-[#dcf0ea] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <path d="M12.01 2.01001C6.49 2.01001 2 6.50001 2 12.02C2 13.78 2.46 15.48 3.29 16.96L2.12 21.21L6.47 20.07C7.91 20.84 9.53 21.25 11.23 21.25H11.24H12.01C17.53 21.25 22.02 16.76 22.02 11.24C22.02 5.72001 17.53 2.01001 12.01 2.01001ZM17.47 15.54C17.24 16.19 16.3 16.78 15.63 16.92C15.17 17.02 14.52 17.11 11.75 15.96C8.21 14.49 5.92 10.89 5.75 10.66C5.58 10.43 4.54 9.04001 4.54 7.61001C4.54 6.18001 5.27 5.48001 5.56 5.17001C5.81 4.90001 6.22 4.79001 6.58 4.79001C6.69 4.79001 6.8 4.79001 6.89 4.80001C7.23 4.81001 7.39 4.83001 7.62 5.37001C7.88 5.99001 8.51 7.54001 8.59 7.70001C8.67 7.86001 8.76 8.08001 8.65 8.30001C8.54 8.52001 8.44 8.61001 8.28 8.80001C8.12 8.98001 7.95 9.14001 7.8 9.34001C7.62 9.54001 7.42 9.74001 7.68 10.19C7.94 10.64 8.51 11.56 9.35 12.31C10.43 13.28 11.33 13.58 11.8 13.78C12.15 13.93 12.55 13.9 12.8 13.63C13.12 13.28 13.5 12.72 13.88 12.16C14.15 11.77 14.48 11.72 14.88 11.87C15.28 12.03 17.38 13.06 17.79 13.27C18.2 13.48 18.47 13.58 18.57 13.75C18.67 13.93 18.67 14.89 17.47 15.54Z" fill="currentColor"/>
              </svg>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
