import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Check, ChevronRight } from "lucide-react";
import { PROGRAMS, PROGRAM_CATEGORIES } from "./donateData";
import { useTranslation } from "react-i18next";

const CAT_META: Record<string, { dot: string; label: string }> = {
  "Child Health & Wellness": { dot: "#1D6E3F", label: "Health" },
  "Education & Development": { dot: "#F29F05", label: "Education" },
  "Climate & Environment": { dot: "#2ca86e", label: "Climate" },
  "Community Empowerment": { dot: "#6d63ff", label: "Community" },
  "Technology & Innovation": { dot: "#0284c7", label: "Technology" },
  "Emergency & Safety": { dot: "#C5192D", label: "Emergency" },
};

interface ProgramSelectorProps {
  selectedPrograms: Record<string, { quantity: number; school?: string }>;
  onToggleProgram: (progId: string) => void;
  accentColor: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function ProgramSelector({
  selectedPrograms,
  onToggleProgram,
  accentColor,
  sectionTitle,
  sectionSubtitle,
}: ProgramSelectorProps) {
  const { t } = useTranslation('donate');
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayTitle = sectionTitle || t('selector.title');
  const displaySubtitle = sectionSubtitle || t('selector.subtitle');

  const allCats = ["All", ...PROGRAM_CATEGORIES];

  const filteredPrograms = useMemo(() => {
    let progs = [...PROGRAMS];
    if (search.trim()) {
      const q = search.toLowerCase();
      progs = progs.filter(p =>
        t(`programs.${p.id}.name`).toLowerCase().includes(q) ||
        t(`categories.${p.category}`).toLowerCase().includes(q) ||
        t(`programs.${p.id}.desc`).toLowerCase().includes(q)
      );
    }
    if (activeCat) {
      progs = progs.filter(p => p.category === activeCat);
    }
    return progs;
  }, [search, activeCat, t]);

  const selectedCount = Object.keys(selectedPrograms).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)`,
                borderColor: `${accentColor}20`,
              }}
            >
              <span className="text-lg">📋</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-[15px] font-black text-gray-900 tracking-tight">{displayTitle}</h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{displaySubtitle}</p>
            </div>
          </div>

          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="text-[11px] font-black px-3 py-1.5 rounded-full text-white shadow-sm shrink-0"
                style={{ background: accentColor }}
              >
                {t('selector.selected', { count: selectedCount })}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            placeholder={t('selector.placeholder')}
          />
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scroll-hide">
          {allCats.map((cat) => {
            const isActive = activeCat === cat || (activeCat === null && cat === "All");
            const meta = CAT_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat === "All" ? null : cat)}
                className={`
                  flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold
                  transition-all duration-300 border
                  ${isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }
                `}
              >
                {meta && !isActive && (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.dot }} />
                )}
                {cat === "All" ? t('categories.All', 'All') : t(`categories.${cat}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-5 sm:mx-6 h-px bg-gray-100" />

      <div
        ref={scrollRef}
        className="max-h-[340px] overflow-y-auto scroll-hide"
        data-lenis-prevent="true"
        onWheel={(e) => {
          const target = e.currentTarget;
          const isAtTop = target.scrollTop <= 0 && e.deltaY < 0;
          const isAtBottom = target.scrollTop + target.clientHeight >= (target.scrollHeight - 1) && e.deltaY > 0;
          if (isAtTop || isAtBottom) {
            window.scrollBy({ top: e.deltaY });
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat ?? "__all__"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="py-1"
          >
            {filteredPrograms.map((prog, idx) => {
              const isSelected = !!selectedPrograms[prog.id];
              const meta = CAT_META[prog.category];

              return (
                <motion.button
                  key={prog.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.025, ease: [0.22, 1, 0.36, 1] }}
                  type="button"
                  onClick={() => onToggleProgram(prog.id)}
                  className={`
                    w-full flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-6 py-3.5
                    text-left transition-all duration-300 group relative
                    ${isSelected ? "" : "hover:bg-gray-50/80"}
                  `}
                  style={isSelected ? { background: `linear-gradient(to right, ${accentColor}15, ${accentColor}05)` } : {}}
                >
                  <motion.div
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{ background: accentColor }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isSelected ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  <div
                    className={`
                      hidden sm:flex w-[22px] h-[22px] rounded-full shrink-0 items-center justify-center
                      transition-all duration-300 border-[1.5px]
                      ${isSelected
                        ? "border-transparent shadow-sm"
                        : "border-gray-200 group-hover:border-gray-300"
                      }
                    `}
                    style={isSelected ? { background: accentColor } : {}}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: isSelected ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  </div>

                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                      transition-all duration-300 border
                      ${isSelected
                        ? "shadow-sm"
                        : "border-gray-100 group-hover:border-gray-200"
                      }
                    `}
                    style={{
                      background: isSelected ? `${accentColor}08` : "#fafaf8",
                      borderColor: isSelected ? `${accentColor}20` : undefined,
                    }}
                  >
                    {prog.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h4
                        className={`text-[13px] font-bold truncate transition-colors duration-300 ${
                          isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {t(`programs.${prog.id}.name`)}
                      </h4>
                      {meta && (
                        <span className="shrink-0 flex items-center gap-1 text-[9px] font-semibold text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                          {t(`categories.${prog.category}`)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate leading-relaxed group-hover:text-gray-500 transition-colors">
                      {t(`programs.${prog.id}.desc`)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`
                        text-xs font-black tracking-tight transition-colors duration-300
                        ${isSelected ? "" : "text-gray-600"}
                      `}
                      style={isSelected ? { color: accentColor } : {}}
                    >
                      ₹{prog.costPerUnit.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                      {t('selector.pricePer', { unit: t(`units.${prog.unit.split("/")[0]}`) || prog.unit.split("/")[0] })}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-all duration-300 ${
                      isSelected ? "opacity-0 w-0" : "text-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </motion.button>
              );
            })}

            {filteredPrograms.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <Search className="w-5 h-5 text-gray-300" />
                <p className="text-xs font-semibold text-gray-400">{t('selector.noPrograms')}</p>
                <p className="text-[10px] text-gray-300">{t('selector.tryDifferent')}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 sm:px-6 py-3 border-t border-gray-100 flex items-center justify-between"
              style={{ background: `${accentColor}03` }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {Object.keys(selectedPrograms).slice(0, 5).map((id) => {
                    const p = PROGRAMS.find((pr) => pr.id === id);
                    return p ? (
                      <div
                        key={id}
                        className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center text-[10px] shadow-sm"
                      >
                        {p.icon}
                      </div>
                    ) : null;
                  })}
                  {selectedCount > 5 && (
                    <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm">
                      +{selectedCount - 5}
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-gray-500">
                  {t('selector.countPrograms', { count: selectedCount })}
                </span>
              </div>
              <span className="text-[11px] font-bold" style={{ color: accentColor }}>
                {t('selector.configure')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
