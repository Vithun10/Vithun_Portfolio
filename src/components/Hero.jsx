import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import pictureImg from '../assets/Portfolio/picture.png';
import { trackEvent } from '../utils/analytics';

const Hero = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const marqueeRef = useRef(null);

  const developerRoles = [
    'BUSINESS OPERATIONS',
    'PROCESS IMPROVEMENT',
    'OPERATIONAL BOTTLENECK ANALYSIS',
    'DECISION MODELLING',
    'REVOPS & SLA DIAGNOSTICS',
    'DATA-DRIVEN DECISION SUPPORT'
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    if (!section || !card || !content) return;

    let hasCompleted = false;
    let fallbackTimer = null;

    // Fail-safe visibility guarantee: ensures Hero content is never left at opacity 0
    const makeHeroVisible = () => {
      if (hasCompleted) return;
      hasCompleted = true;

      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }

      const header = section.querySelector('header');
      const animItems = content.querySelectorAll('.hero-anim-item');

      if (header) gsap.set(header, { opacity: 1, y: 0 });
      if (animItems && animItems.length) gsap.set(animItems, { opacity: 1, y: 0, clearProps: 'filter' });
      if (card) gsap.set(card, { opacity: 1, scale: 1, rotationY: 0, rotationX: 0 });
    };

    // --- GSAP CINEMATIC ENTRANCE ANIMATION ---
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      onComplete: () => {
        hasCompleted = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
      }
    });

    tl.fromTo(
      section.querySelector('header'),
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo(
      content.querySelectorAll('.hero-anim-item'),
      { y: 40, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.1 },
      "-=0.7"
    )
    .fromTo(
      card,
      { scale: 0.8, opacity: 0, rotationY: 25, rotationX: -10 },
      { scale: 1, opacity: 1, rotationY: 0, rotationX: 0, duration: 1.2, ease: "back.out(1.2)" },
      "-=0.8"
    );

    // Defensive fallback: guarantees hero content becomes visible even if WebKit drops animation ticks
    fallbackTimer = setTimeout(makeHeroVisible, 2500);

    // --- OPTIMIZED 3D TILT WITH CACHED GEOMETRY (NO LAYOUT REFLOW) ---
    const xTilt = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3.out" });
    const yTilt = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3.out" });

    let rect = null;
    let cardRect = null;
    let cardCenterX = 0;
    let cardCenterY = 0;
    let cardHalfW = 1;
    let cardHalfH = 1;

    const updateGeometry = () => {
      if (!section || !card) return;
      rect = section.getBoundingClientRect();
      cardRect = card.getBoundingClientRect();
      cardHalfW = cardRect.width / 2 || 1;
      cardHalfH = cardRect.height / 2 || 1;
      cardCenterX = cardRect.left + cardHalfW - rect.left;
      cardCenterY = cardRect.top + cardHalfH - rect.top;
    };

    updateGeometry();

    const handleMouseMove = (e) => {
      if (!rect || !cardRect) updateGeometry();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = -((y - cardCenterY) / cardHalfH) * 14;
      const rotateY = ((x - cardCenterX) / cardHalfW) * 14;

      xTilt(rotateY);
      yTilt(rotateX);
    };

    const handleMouseEnter = () => {
      updateGeometry();
    };

    const handleMouseLeave = () => {
      xTilt(0);
      yTilt(0);
    };

    // Pause marquee animation when section is offscreen to save CPU & GPU cycles
    let observer = null;
    if (marqueeRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (marqueeRef.current) {
          marqueeRef.current.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        }
      }, { threshold: 0.05 });
      observer.observe(section);
    }

    window.addEventListener("resize", updateGeometry, { passive: true });
    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      tl.kill();
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateGeometry);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#3B211B] text-[#F7EEDB] flex flex-col justify-between select-none cursor-none overflow-x-clip"
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
      `}</style>

      {/* 1. Subtle Marquee Background Ribbon in Rich Brown */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#3B211B] via-[#4A2922]/70 to-[#3B211B] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.08]">
          <div ref={marqueeRef} className="flex whitespace-nowrap animate-marquee will-change-transform">
            {[...developerRoles, ...developerRoles].map((role, idx) => (
              <span key={idx} className="text-[14vw] font-black text-[#FFF1A6] mx-8 uppercase tracking-tighter">
                {role} &bull;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Content Layer */}
      <div ref={contentRef} className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center pt-28 pb-10">

        {/* Main Center Stage Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 my-auto">
          
          {/* Left Side: Professional Positioning & Story */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-5 text-left">
            
            <div className="hero-anim-item flex items-center gap-3">
              <span className="px-3 py-1 bg-[#6B352A] text-[#FFF1A6] font-mono font-bold text-xs rounded tracking-widest border border-[#FFF1A6]/40 shadow-[0_0_15px_rgba(107,53,42,0.6)]">
                OPERATIONS ANALYST
              </span>
              <span className="text-[#C9B8A8] text-xs font-mono tracking-widest uppercase">
                Business Operations · Process Improvement
              </span>
            </div>

            <h1 className="hero-anim-item text-5xl md:text-7xl font-black tracking-tighter text-[#F7EEDB] leading-[0.95] drop-shadow-[0_15px_30px_rgba(59,33,27,0.7)]">
              VITHUN TR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1A6] via-[#F7EEDB] to-[#FFF1A6] drop-shadow-[0_0_30px_rgba(255,241,166,0.35)]">
                OPERATIONS & ANALYTICS.
              </span>
            </h1>

            <div className="hero-anim-item flex flex-wrap items-center gap-2.5 text-xs font-mono font-bold">
              <span className="px-2.5 py-0.5 bg-[#4A2922] border border-[#6B352A] rounded text-[#FFF1A6]">
                17–20% Cost Reduction
              </span>
              <span className="text-[#824B3D]">•</span>
              <span className="px-2.5 py-0.5 bg-[#4A2922] border border-[#6B352A] rounded text-[#F7EEDB]">
                ~70% Unsold Stock Reduction
              </span>
              <span className="text-[#824B3D]">•</span>
              <span className="px-2.5 py-0.5 bg-[#4A2922] border border-[#6B352A] rounded text-[#FFF1A6]">
                B2B Funnel Analysis
              </span>
            </div>

            <p className="hero-anim-item text-sm md:text-base text-[#F7EEDB]/90 font-light leading-relaxed max-w-md drop-shadow">
              Better operations start with better questions. I investigate operational inefficiencies, diagnose process bottlenecks, and translate data into practical business decisions.
            </p>

            {/* Action Button Set */}
            <div className="hero-anim-item flex items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-8 py-3.5 bg-[#6B352A] text-[#FFF1A6] border border-[#FFF1A6]/40 font-bold text-xs uppercase tracking-widest rounded hover:bg-[#824B3D] hover:scale-105 transition-all duration-300 shadow-[0_10px_35px_rgba(107,53,42,0.6)] flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Explore My Work
              </a>
              <a
                href="#contact"
                onClick={() => trackEvent('contact_click')}
                className="px-8 py-3.5 bg-[#4A2922] text-[#FFF1A6] border border-[#6B352A] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#824B3D] hover:border-[#FFF1A6]/50 transition-all duration-300 shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Contact Me
              </a>
            </div>
          </div>

          {/* Center: 3D Holographic Tilt Portrait Poster Frame */}
          <div className="lg:col-span-4 flex justify-center perspective-[1200px]">
            <div 
              ref={cardRef}
              className="relative group transform-gpu will-change-transform"
            >
              {/* Rich Warm Brown & Amber Back Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-[#6B352A]/90 via-[#824B3D]/70 to-[#FFF1A6]/30 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Poster Card */}
              <div className="relative w-[280px] md:w-[320px] p-3.5 bg-gradient-to-b from-[#4A2922] via-[#3B211B] to-[#2E1813] rounded-2xl border border-[#6B352A] shadow-[0_30px_70px_rgba(59,33,27,0.7)] overflow-hidden">
                <img
                  id="portrait-photo"
                  data-no-spotlight="true"
                  src={pictureImg}
                  alt="Vithun TR Portrait"
                  loading="eager"
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent('spotlight-disable'))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent('spotlight-enable'))}
                  className="w-full h-[330px] md:h-[390px] object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-500 relative z-30"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Focus & Toolkit */}
          <div className="hero-anim-item lg:col-span-3 flex flex-col items-start lg:items-end space-y-4 text-left lg:text-right">
            <div className="p-5 bg-[#4A2922] border border-[#6B352A] rounded-xl shadow-2xl max-w-xs">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold mb-2">
                CORE FOCUS & TOOLKIT
              </h3>
              <p className="text-xs text-[#F7EEDB]/90 leading-relaxed font-light mb-2">
                Process Mapping, Throughput Diagnostics, Capacity & Cost Modelling, Funnel Drop-off Analysis.
              </p>
              <p className="text-xs font-mono text-[#C9B8A8] leading-relaxed">
                Stack: MySQL, Advanced Excel (Scenario Models), Power BI (DAX), Python (pandas).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="absolute top-0 left-0 z-50 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between pointer-events-auto">
        <a href="#home" className="flex items-center gap-3 group" aria-label="Vithun TR Home">
          <img 
            src="/vithun-logo.png" 
            alt="Vithun TR Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_15px_rgba(255,241,166,0.25)]" 
          />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[#F7EEDB]/85">
          <a href="#home" className="hover:text-[#FFF1A6] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#FFF1A6] transition-colors">About</a>
          <a href="#expertise" className="hover:text-[#FFF1A6] transition-colors">Expertise</a>
          <a href="#skills" className="hover:text-[#FFF1A6] transition-colors">Skills</a>
          <a href="#projects" className="hover:text-[#FFF1A6] transition-colors">Projects</a>
          <a href="#contact" className="hover:text-[#FFF1A6] transition-colors">Contact</a>
        </nav>
        <a
          href="/Vithun_Tr_Resume_BizOps.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('resume_download')}
          className="px-5 py-2 rounded bg-[#6B352A] hover:bg-[#824B3D] text-[#FFF1A6] border border-[#FFF1A6]/40 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(107,53,42,0.6)] hover:scale-105 active:scale-95"
        >
          View Resume
        </a>
      </header>
    </section>
  );
};

export default Hero;
