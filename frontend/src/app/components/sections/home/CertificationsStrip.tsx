export function CertificationsStrip() {
  return (
    <div className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
          Verified & Certified By
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-24">
          
          {/* 80G Certificate Logo */}
          <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--womb-forest)] flex items-center justify-center font-black text-xl text-[var(--womb-forest)]">
              80G
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-gray-900 leading-tight">Income Tax Dept.</p>
              <p className="text-xs font-semibold text-gray-500">Government of India</p>
            </div>
          </div>

          {/* 12A Certificate Logo */}
          <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--journey-saffron)] flex items-center justify-center font-black text-xl text-[var(--journey-saffron)]">
              12A
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-gray-900 leading-tight">Section 12A</p>
              <p className="text-xs font-semibold text-gray-500">Registered Non-Profit</p>
            </div>
          </div>

          {/* TechSoup */}
          <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="font-black text-3xl tracking-tighter text-[#f26522]">
              tech<span className="text-gray-800">soup</span><span className="text-[10px] align-top ml-1">®</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-gray-900 leading-tight">Validated NGO</p>
              <p className="text-xs font-semibold text-gray-500">Global Tech Partner</p>
            </div>
          </div>

          {/* Startup India / DPIIT */}
          <div className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="font-bold text-sm border-l-4 border-orange-500 pl-3 py-1">
              <p className="text-gray-900 leading-tight">Startup India</p>
              <p className="text-xs text-gray-500">#DIPP162172</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
