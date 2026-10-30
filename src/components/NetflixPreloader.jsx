import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MinimalPreloader = ({ onComplete }) => {
  const preloaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    tl.set(preloaderRef.current, { autoAlpha: 1 })
      .fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0, filter: "blur(8px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
      )
      .to(contentRef.current, {
        scale: 1.05,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.4,
        ease: "power2.in",
        delay: 0.6
      })
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-[#3B211B] flex items-center justify-center select-none overflow-hidden"
    >
      <div ref={contentRef} className="flex flex-col items-center gap-4">
        {/* Custom Logo in Preloader */}
        <img 
          src="/vithun-logo.png" 
          alt="Vithun TR Logo" 
          className="w-16 h-16 object-contain drop-shadow-[0_4px_25px_rgba(255,241,166,0.3)]" 
        />

        {/* Minimal Typography */}
        <h1 
          className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] text-[#FFF1A6]"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          VITHUN TR
        </h1>
      </div>
    </div>
  );
};

export default MinimalPreloader;
