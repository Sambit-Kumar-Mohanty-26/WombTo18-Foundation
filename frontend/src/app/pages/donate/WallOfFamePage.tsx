import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Trophy, Award, Medal, Sparkles, Filter, Users, ChevronLeft, Key, Lock, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";

interface FameDonor {
  id: string;
  name: string;
  amount: number;
  tier: string;
  date: string;
}

type FilterType = 'recent' | 'top_month' | 'top_all_time';

export default function WallOfFamePage() {
  const [filter, setFilter] = useState<FilterType>('top_month');
  const [donors, setDonors] = useState<FameDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/donations/wall-of-fame?filter=${filter}`)
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
        // Trigger unlock animation after data loads
        setTimeout(() => setIsUnlocked(true), 500);
      })
      .catch(err => {
        console.error("Failed to load Wall of Fame:", err);
        setLoading(false);
      });
  }, [filter]);

  function formatAmount(amount: number) {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }

  function getTimeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 30) return d.toLocaleDateString();
    return `${diffDays} days ago`;
  }

  const isRanking = filter !== 'recent';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2A2A] selection:bg-purple-100 selection:text-purple-900 scroll-smooth">
      
      {/* Decorative Parallax Background Keys */}
      <BackgroundElements />

      {/* Hero Banner Section */}
      <div className="relative pt-12 pb-20 overflow-hidden isolate">
        {/* Soft Lavender Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-100/50 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <Link to="/donate" className="group inline-flex items-center gap-3 text-sm font-bold text-purple-600/70 hover:text-purple-700 transition-all bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-purple-100/50 shadow-sm hover:shadow-md">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              <span>Return to Mission</span>
            </Link>
          </motion.div>
          
          <div className="text-center max-w-4xl mx-auto relative">
             {/* Key turning icon animation */}
             <motion.div
               animate={isUnlocked ? { rotate: 90, scale: 1.1 } : { rotate: 0, scale: 1 }}
               transition={{ type: "spring", stiffness: 100, damping: 10 }}
               className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-purple-100 shadow-xl mb-6 relative group"
             >
                <Key className={`w-8 h-8 ${isUnlocked ? 'text-amber-500' : 'text-purple-300'} transition-colors duration-500`} strokeWidth={1.5} />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-0"
                  animate={isUnlocked ? { scale: [1, 1.5], opacity: [0.5, 0] } : {}}
                  transition={{ duration: 1 }}
                />
             </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                The Vault of <br />
                <span className="italic text-purple-600">Pure Impact</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Celebrating the souls who hold the <span className="text-amber-600 font-bold italic">Gold Keys</span> to society. Your generosity unlocked dreams for thousands today.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-40">
        
        {/* Board Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6"
        >
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white shadow-xl shadow-purple-900/5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-sm font-black text-gray-900">Impact Registry</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Verified by WombTo18</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl shadow-purple-900/5">
            {(['recent', 'top_month', 'top_all_time'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setIsUnlocked(false); }}
                className={`relative px-8 py-3.5 rounded-3xl font-black text-xs transition-all duration-500 whitespace-nowrap uppercase tracking-widest ${filter === f ? 'text-white' : 'text-purple-400 hover:text-purple-700'}`}
              >
                {filter === f && (
                  <motion.div
                    layoutId="boardFilter"
                    className="absolute inset-0 bg-purple-600 rounded-3xl shadow-lg shadow-purple-600/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {f === 'recent' ? 'Latest Keys' : f === 'top_month' ? 'August Elite' : 'Eternal Legends'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          {loading ? (
            <SkeletonLoader key="loading" />
          ) : donors.length === 0 ? (
            <EmptyBoard key="empty" />
          ) : (
            <motion.div 
              key="board-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20"
            >
              {/* Grand Pillars (Top 3) */}
              {isRanking && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative py-10 px-4">
                  {/* Lavender Spotlight behind Gold */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] bg-purple-200/20 blur-[120px] pointer-events-none" />
                  
                  <PillarCard rank={2} donor={donors[1]} theme="silver" stagger={0.1} />
                  <PillarCard rank={1} donor={donors[0]} theme="gold" stagger={0} />
                  <PillarCard rank={3} donor={donors[2]} theme="bronze" stagger={0.2} />
                </div>
              )}

              {/* The Impact Board (Grid) - Only show if there are donors beyond the top 3 (or all if not ranking) */}
              {((isRanking && donors.length > 3) || (!isRanking && donors.length > 0)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={isUnlocked ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1 }}
                  className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white shadow-[0_32px_64px_-16px_rgba(147,112,219,0.1)] relative overflow-hidden"
                >
                  {/* Board Title Decor */}
                  <div className="flex items-center gap-4 mb-12">
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-100" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-300">Impact Registry Grid</span>
                     <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {(isRanking ? donors.slice(3) : donors).map((donor, idx) => (
                       <TileCard key={donor.id} donor={donor} index={idx} />
                     ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Design */}
      <div className="max-w-4xl mx-auto px-6 text-center pb-20">
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="p-10 rounded-[3rem] bg-gradient-to-br from-purple-600 to-indigo-800 text-white relative overflow-hidden group"
         >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"
            />
            <h2 className="text-3xl font-black leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Want to Unlocked your Key?</h2>
            <p className="text-purple-100 mb-8 max-w-sm mx-auto font-medium">Join our legendary donors and help us unlock a better future for every child.</p>
            <Link to="/donate">
              <button className="bg-white text-purple-900 px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                LOCKED YOUR SPOT NOW
              </button>
            </Link>
         </motion.div>
      </div>
    </div>
  );
}

function PillarCard({ rank, donor, theme, stagger }: { rank: number, donor?: FameDonor, theme: 'gold' | 'silver' | 'bronze', stagger: number }) {
  if (!donor) return null;

  const themes = {
    gold: {
      bg: 'bg-white',
      border: 'border-amber-200',
      icon: <Trophy className="w-12 h-12 text-amber-500 drop-shadow-lg" />,
      glow: 'shadow-amber-400/20',
      text: 'text-amber-600',
      tag: 'Grand Legend',
      badge: <Key className="w-4 h-4 text-amber-500" />
    },
    silver: {
      bg: 'bg-white',
      border: 'border-slate-200',
      icon: <Award className="w-10 h-10 text-slate-400 drop-shadow-md" />,
      glow: 'shadow-slate-300/20',
      text: 'text-slate-600',
      tag: 'Impact Guardian',
      badge: <Key className="w-4 h-4 text-slate-400" />
    },
    bronze: {
      bg: 'bg-white',
      border: 'border-orange-100',
      icon: <Medal className="w-10 h-10 text-orange-400/80 drop-shadow-md" />,
      glow: 'shadow-orange-200/20',
      text: 'text-orange-600',
      tag: 'Noble Soul',
      badge: <Key className="w-4 h-4 text-orange-400" />
    }
  }[theme];

  const isGold = theme === 'gold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 + stagger, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group ${isGold ? 'z-20' : 'z-10'}`}
    >
      <div className={`relative ${themes.bg} ${themes.border} border-2 rounded-[3.5rem] p-8 text-center transition-all duration-700 hover:-translate-y-4 shadow-2xl ${themes.glow} overflow-hidden`}>
         {/* Internal texture decor */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,112,219,0.05),transparent)] pointer-events-none" />
         
         <div className="relative z-10">
            {/* Rank Badge */}
            <div className={`mx-auto mb-8 w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-white shadow-inner group-hover:scale-110 transition-transform duration-500`}>
               {themes.icon}
            </div>

            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 ${themes.text} text-[10px] font-black uppercase tracking-widest mb-4`}>
               {themes.badge} {themes.tag}
            </span>

            <h3 className={`text-2xl font-black text-gray-900 mb-2 truncate px-2`} style={{ fontFamily: "'Playfair Display', serif" }}>
               {donor.name}
            </h3>
            
            <div className={`text-4xl font-black ${themes.text} tracking-tight`}>
               ₹{donor.amount.toLocaleString('en-IN')}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center">
               <div className="flex -space-x-2 mb-3">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[8px] font-black italic">W</div>)}
               </div>
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">{donor.tier} STATUS</span>
            </div>
         </div>
      </div>
      
      {/* Rank floating label */}
      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm border-4 border-[#FDFBF7] shadow-xl group-hover:scale-110 transition-transform">
         #{rank}
      </div>
    </motion.div>
  );
}

function TileCard({ donor, index }: { donor: FameDonor, index: number }) {
  const colors = ['#E6E6FA', '#FDF5E6', '#F0F8FF', '#F5F5F5']; // Lavender, Creamy, Azure, White
  const borderColor = ['#D8BFD8', '#F5DEB3', '#ADD8E6', '#E0E0E0'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 10) * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-6 rounded-[2.5rem] bg-white border border-purple-50 group transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-purple-900/5 cursor-default relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
         <Key className="w-12 h-12 text-purple-600 rotate-45" />
      </div>

      <div className="flex items-center gap-4 mb-6">
         <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-lg font-black group-hover:rotate-12 transition-transform duration-500">
            {donor.name.charAt(0).toUpperCase()}
         </div>
         <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{donor.name}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{donor.tier}</p>
         </div>
      </div>

      <div className="flex items-end justify-between gap-2">
         <div>
            <span className="block text-[9px] font-black text-purple-300 uppercase tracking-widest mb-1 italic">Contribution</span>
            <span className="text-xl font-black text-purple-600 leading-none">₹{donor.amount.toLocaleString('en-IN')}</span>
         </div>
         <div className="h-8 w-px bg-purple-50" />
         <div className="text-right">
            <span className="block text-[9px] font-black text-purple-300 uppercase tracking-widest mb-1 italic">Impact Date</span>
            <span className="text-[10px] font-black text-gray-400 block whitespace-nowrap">{new Date(donor.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
         </div>
      </div>
    </motion.div>
  );
}

function BackgroundElements() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
       {/* Parallax Keys */}
       <motion.div style={{ y }} className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", rotate: Math.random() * 360, opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute text-purple-400"
            >
               <Key className="w-20 h-20" strokeWidth={0.5} />
            </motion.div>
          ))}
       </motion.div>
       
       {/* Background Noise Texture (Conceptual) */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}

function EmptyBoard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-[4rem] border border-white border-dashed shadow-2xl"
    >
       <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-purple-100">
         <Lock className="w-10 h-10 text-purple-300" />
       </div>
       <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>Vault is Empty</h3>
       <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">The board of impact is currently locked. Be the very first Soul to unlock your key and lead the registry.</p>
       <Link to="/donate">
         <button className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-colors">
            UNLOCK THE FUTURE
         </button>
       </Link>
    </motion.div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-3 gap-8">
         {[1,2,3].map(i => <div key={i} className="h-[400px] bg-slate-100/50 animate-pulse rounded-[3.5rem] border border-white" />)}
      </div>
      <div className="bg-white/40 h-80 rounded-[3rem] animate-pulse border border-white flex items-center justify-center">
         <Sparkles className="w-10 h-10 text-purple-100 animate-spin" />
      </div>
    </div>
  );
}
