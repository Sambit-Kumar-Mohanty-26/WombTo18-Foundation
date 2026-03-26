export function CertificationsStrip() {
  return (
    <div className="bg-white py-10 sm:py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 sm:mb-8">
          Verified & Certified By
        </p>

        <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6 sm:gap-x-6 md:flex md:flex-wrap md:justify-center md:items-center md:gap-12 lg:gap-24">
          <div className="flex flex-col items-center justify-center gap-3 text-center grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-[3px] sm:border-4 border-[var(--womb-forest)] font-black text-lg sm:text-xl text-[var(--womb-forest)]">
              80G
            </div>
            <div className="text-center">
              <p className="font-bold text-[11px] leading-tight text-gray-900 md:text-base">Income Tax Dept.</p>
              <p className="text-[10px] font-semibold text-gray-500 md:text-xs">Government of India</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-center grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-[3px] sm:border-4 border-[var(--journey-saffron)] font-black text-lg sm:text-xl text-[var(--journey-saffron)]">
              12A
            </div>
            <div className="text-center">
              <p className="font-bold text-[11px] leading-tight text-gray-900 md:text-base">Section 12A</p>
              <p className="text-[10px] font-semibold text-gray-500 md:text-xs">Registered Non-Profit</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-center grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100">
            <div className="font-black text-[1.7rem] sm:text-3xl tracking-tighter text-[#f26522]">
              tech<span className="text-gray-800">soup</span><span className="ml-1 align-top text-[10px]">&reg;</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-[11px] leading-tight text-gray-900 md:text-base">Validated NGO</p>
              <p className="text-[10px] font-semibold text-gray-500 md:text-xs">Global Tech Partner</p>
            </div>
          </div>

          <div className="flex items-center justify-center grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 min-h-[56px]">
            <div className="border-l-[3px] sm:border-l-4 border-orange-500 py-1 pl-3 text-left font-bold text-xs sm:text-sm">
              <p className="text-gray-900 leading-tight">Startup India</p>
              <p className="text-xs text-gray-500">#DIPP162172</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
