import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Shruti Bhujbal",
    role: "Parent - Pune",
    rating: 5,
    image: "/images/site-assets/testimonial_parent.png",
    quote: "WombTo18 has been incredibly structured and practical, covering everything from health to learning in one place.Their simple tools and reminders have made life easier for both parents and teachers.",
  },
  {
    name: "Dhanashree Wagh",
    role: "School Principal, Maharashtra",
    rating: 5,
    image: "/images/site-assets/testimonial_principal.png",
    quote: "WombTo18 has completely changed the way we look at student well-being.WombTo18 is the partner you need. This is not a program; this is a mission. Highly recommended.",
  },
  {
    name: "anand anasane",
    role: "CSR Head, Pune",
    rating: 5,
    image: "/images/site-assets/testimonial_csr.png",
    quote: "Best parenting support system. Reminders + milestones + easy guides = peace of mind.Very accurate immunization reminders. Never missed a vaccine after joining.",
  },

  {
    name: "Diksha Kadam",
    role: "School Leader",
    rating: 5,
    image: "/images/site-assets/testimonial_diksha_kadam.jpg",
    quote: "WombTo18 helped our school create a culture of health, empathy, sustainability, and early habit formation. The modules are beautifully crafted, age-appropriate, and easy to integrate into daily routines. Their team handled everything - training, monitoring, implementation, and parent orientation. Most importantly, our children love the activities. From green cohort pledges to emotional well-being exercises to nutrition awareness, it feels like an upgraded version of schooling. Any school that wants long-term, measurable impact must adopt this.",
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [overflowingCards, setOverflowingCards] = useState<Record<number, boolean>>({});
  const quoteRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const scrollContainerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const touchStartYRefs = useRef<Record<number, number | null>>({});

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const measureOverflow = () => {
      const nextOverflowState: Record<number, boolean> = {};

      quoteRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        const clone = element.cloneNode(true) as HTMLParagraphElement;
        clone.style.position = "fixed";
        clone.style.top = "0";
        clone.style.left = "0";
        clone.style.visibility = "hidden";
        clone.style.pointerEvents = "none";
        clone.style.zIndex = "-1";
        clone.style.height = "auto";
        clone.style.maxHeight = "none";
        clone.style.overflow = "visible";
        clone.style.display = "block";
        clone.style.width = `${element.clientWidth}px`;
        clone.style.webkitLineClamp = "unset";
        clone.style.webkitBoxOrient = "initial";

        document.body.appendChild(clone);
        nextOverflowState[index] = clone.scrollHeight > element.clientHeight + 1;
        document.body.removeChild(clone);
      });

      setOverflowingCards(nextOverflowState);
    };

    measureOverflow();

    const resizeObserver = new ResizeObserver(() => {
      measureOverflow();
    });

    quoteRefs.current.forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    window.addEventListener("resize", measureOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, []);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const toggleExpanded = (index: number) => {
    setExpandedCards((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  const canConsumeInnerScroll = (index: number, deltaY: number) => {
    const wrapper = scrollContainerRefs.current[index];

    if (!wrapper || !expandedCards[index]) {
      return false;
    }

    const maxScrollTop = wrapper.scrollHeight - wrapper.clientHeight;
    if (maxScrollTop <= 0) {
      return false;
    }

    const atTop = wrapper.scrollTop <= 1;
    const atBottom = wrapper.scrollTop >= maxScrollTop - 1;

    if (deltaY < 0 && !atTop) {
      return true;
    }

    if (deltaY > 0 && !atBottom) {
      return true;
    }

    return false;
  };

  const handOffScrollToPage = (deltaY: number) => {
    if (deltaY === 0) {
      return;
    }

    window.scrollBy({
      top: deltaY,
      left: 0,
      behavior: "auto",
    });
  };

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
              <div key={idx} className="flex-[0_0_100%] min-w-0 pl-3 py-4 sm:pl-4">
                <div className="flex h-full min-h-[430px] sm:min-h-[380px] flex-col gap-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-xl transition-all sm:flex-row sm:gap-8 sm:p-12">
                  <div className="shrink-0 relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-16 w-16 rounded-full border-4 border-[var(--womb-forest)]/20 object-cover shadow-md sm:h-32 sm:w-32"
                    />
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 bg-white p-1.5 sm:p-2 rounded-full shadow-lg text-[var(--womb-forest)]">
                      <Quote className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col text-left self-stretch">
                    <div className="flex justify-start gap-1 mb-3 sm:mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="mb-4 flex-1 min-h-0 sm:mb-6">
                      <div
                        ref={(element) => {
                          scrollContainerRefs.current[idx] = element;
                        }}
                        onWheelCapture={(event) => {
                          if (!expandedCards[idx]) {
                            return;
                          }

                          if (canConsumeInnerScroll(idx, event.deltaY)) {
                            event.stopPropagation();
                            return;
                          }

                          event.preventDefault();
                          event.stopPropagation();
                          handOffScrollToPage(event.deltaY);
                        }}
                        onTouchStart={(event) => {
                          touchStartYRefs.current[idx] = event.touches[0]?.clientY ?? null;
                        }}
                        onTouchMoveCapture={(event) => {
                          if (!expandedCards[idx]) {
                            return;
                          }

                          const currentY = event.touches[0]?.clientY;
                          const previousY = touchStartYRefs.current[idx];

                          if (currentY == null || previousY == null) {
                            return;
                          }

                          const deltaY = previousY - currentY;

                          if (canConsumeInnerScroll(idx, deltaY)) {
                            event.stopPropagation();
                          } else {
                            event.preventDefault();
                            event.stopPropagation();
                            handOffScrollToPage(deltaY);
                          }

                          touchStartYRefs.current[idx] = currentY;
                        }}
                        onTouchEnd={() => {
                          touchStartYRefs.current[idx] = null;
                        }}
                        className={`h-full min-h-0 ${
                          expandedCards[idx]
                            ? "max-h-[185px] overflow-y-auto pr-2 sm:max-h-[170px]"
                            : "overflow-hidden"
                        }`}
                        style={{
                          scrollbarWidth: expandedCards[idx] ? "thin" : "none",
                          overscrollBehavior: expandedCards[idx] ? "auto" : "contain",
                        }}
                      >
                        <p
                          ref={(element) => {
                            quoteRefs.current[idx] = element;
                          }}
                          className={`font-serif text-lg leading-relaxed text-gray-700 italic sm:text-2xl ${
                            expandedCards[idx] ? "" : "line-clamp-6 sm:line-clamp-4"
                          }`}
                        >
                          "{t.quote}"
                        </p>
                      </div>
                    </div>

                    {overflowingCards[idx] && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(idx)}
                        className="mb-4 w-fit text-sm font-semibold text-[var(--womb-forest)] transition-colors hover:text-[#155e33]"
                      >
                        {expandedCards[idx] ? "Read less" : "Read more"}
                      </button>
                    )}

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
