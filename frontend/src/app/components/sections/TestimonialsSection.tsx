import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Parent - Pune",
    rating: 5,
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    quote: "My daughter almost missed her 9-month vaccination - we had shifted to a new locality and I simply forgot. WOMBTO18 sent three reminders. That one message changed everything.",
  },
  {
    name: "Dr. Ananya Joshi",
    role: "School Principal, Maharashtra",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxNHx8dGVhY2hlciUyMGluZGlhfGVufDB8fHx8MTc3MzE0MDMwNXww&ixlib=rb-4.1.0&q=80&w=150",
    quote: "We had never run a structured health screening for our students before WOMBTO18. Today our teachers are trained, our students are tracked, and parents trust us more than ever before.",
  },
  {
    name: "Suresh Menon",
    role: "CSR Head, Pune",
    rating: 5,
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW58ZW58MHx8fHwxNzczMTQwMzMyfDA&ixlib=rb-4.1.0&q=80&w=150",
    quote: "Our CSR team needed a partner with verifiable, measurable outcomes. WOMBTO18's donor dashboard and quarterly reports give us exactly that - without chasing anyone for data.",
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="py-24 bg-[var(--womb-forest)]/5 relative overflow-hidden flex flex-col items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center mb-12">
        <p className="inline-flex items-center gap-2 bg-white text-[var(--womb-forest)] px-4 py-1.5 rounded-full text-sm font-semibold border border-[var(--womb-forest)]/20 shadow-sm mb-4">
          Beneficiary Voices
        </p>
        <h2 className="text-3xl sm:text-4xl text-gray-900" style={{ fontWeight: 800 }}>
          The Stories Behind the Numbers
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto px-8 sm:px-16 w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {testimonials.map((t, idx) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0 pl-3 sm:pl-4 py-4">
                <div className="bg-white rounded-3xl p-5 sm:p-12 shadow-xl border border-gray-100 flex flex-row gap-4 sm:gap-8 items-start transition-all h-[400px] sm:h-auto sm:min-h-[340px]">
                  <div className="shrink-0 relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-16 h-16 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[var(--womb-forest)]/20 shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 bg-white p-1.5 sm:p-2 rounded-full shadow-lg text-[var(--womb-forest)]">
                      <Quote className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-left flex flex-col self-stretch">
                    <div className="flex justify-start gap-1 mb-3 sm:mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-base sm:text-2xl text-gray-700 leading-relaxed font-serif italic mb-4 sm:mb-6 flex-1 overflow-hidden">
                      "{t.quote}"
                    </p>

                    <div className="mt-auto">
                      <p className="text-base sm:text-lg font-bold text-gray-900">{t.name}</p>
                      <p className="text-[11px] sm:text-sm font-semibold text-[var(--womb-forest)] uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[var(--womb-forest)] hover:scale-110 transition-all z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[var(--womb-forest)] hover:scale-110 transition-all z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
