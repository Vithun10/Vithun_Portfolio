import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // --- Cinematic Stagger Entrance on Scroll ---
    gsap.fromTo(
      cardRefs.current,
      { y: 60, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // --- Optimized Magnetic Mouse Spotlight per Bento Card (Cached Rect) ---
    const cards = cardRefs.current;
    const cleanups = [];

    cards.forEach((card) => {
      if (!card) return;
      let cardRect = null;

      const onEnter = () => {
        cardRect = card.getBoundingClientRect();
      };

      const onMove = (e) => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      };

      card.addEventListener('mouseenter', onEnter, { passive: true });
      card.addEventListener('mousemove', onMove, { passive: true });

      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mousemove', onMove);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#3B211B] text-[#F7EEDB] py-28 px-6 md:px-12 flex flex-col justify-center select-none overflow-hidden"
    >
      {/* Background Ambient Warm Brown Glows */}
      <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-[#6B352A]/30 rounded-full blur-[70px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#824B3D]/25 rounded-full blur-[70px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#4A2922] border border-[#6B352A] text-xs font-mono uppercase tracking-widest text-[#FFF1A6] shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#FFF1A6] animate-ping"></span>
            <span>PROFESSIONAL PROFILE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#F7EEDB]">
            OPERATOR SYNOPSIS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1A6] via-[#F7EEDB] to-[#FFF1A6] drop-shadow-[0_0_30px_rgba(255,241,166,0.3)]">
              PRACTICAL EXPERIENCE & EVIDENCE.
            </span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Operations Ownership & Approach (Span 7) */}
          <div
            ref={addToRefs}
            className="md:col-span-7 p-8 md:p-12 bg-[#4A2922] border border-[#6B352A] rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-[#FFF1A6]/80 hover:shadow-[0_25px_60px_rgba(107,53,42,0.4)] transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(255,241,166,0.12), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-[#FFF1A6]/10 font-mono text-7xl font-black pointer-events-none">
              01
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                OPERATIONS OWNERSHIP & APPROACH
              </h3>
              <p className="text-lg md:text-xl font-medium text-[#F7EEDB] leading-relaxed">
                I connect hands-on business operations experience with structured analytical problem-solving to uncover inefficiencies and support better business decisions.
              </p>
              <p className="text-sm md:text-base text-[#C9B8A8] font-light leading-relaxed">
                Managing day-to-day operations across inventory, supplier negotiations, billing accuracy, and institutional client growth gave me a grounded understanding of how process friction impacts cash flow and margins. I complement that practical exposure with SQL, Excel decision modelling, and Power BI to diagnose bottlenecks and build actionable recommendations.
              </p>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-2 relative z-10">
              <span className="px-3.5 py-1.5 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono text-[#FFF1A6] hover:bg-[#824B3D] hover:border-[#FFF1A6]/60 transition-colors">Process Mapping</span>
              <span className="px-3.5 py-1.5 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono text-[#FFF1A6] hover:bg-[#824B3D] hover:border-[#FFF1A6]/60 transition-colors">Throughput & SLA Diagnostics</span>
              <span className="px-3.5 py-1.5 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono text-[#FFF1A6] hover:bg-[#824B3D] hover:border-[#FFF1A6]/60 transition-colors">Financial & Capacity Modelling</span>
              <span className="px-3.5 py-1.5 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono text-[#FFF1A6] hover:bg-[#824B3D] hover:border-[#FFF1A6]/60 transition-colors">Commercial Operations</span>
            </div>
          </div>

          {/* Card 2: Workplace Impact & Milestones (Span 5) */}
          <div
            ref={addToRefs}
            className="md:col-span-5 p-8 md:p-12 bg-[#4A2922] border border-[#6B352A] rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-[#FFF1A6]/80 hover:shadow-[0_25px_60px_rgba(107,53,42,0.4)] transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(255,241,166,0.12), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-[#FFF1A6]/10 font-mono text-7xl font-black pointer-events-none">
              02
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                VERIFIED WORKPLACE EVIDENCE
              </h3>
              <ul className="space-y-4 text-sm text-[#F7EEDB] font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFF1A6] font-bold">&#8250;</span>
                  <span><strong className="text-[#FFF1A6]">Commercial Cost Reduction:</strong> Renegotiated supplier contracts, reducing per-unit input costs by 17–20% and contributing over ₹3 lakh in annual profit improvement.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFF1A6] font-bold">&#8250;</span>
                  <span><strong className="text-[#FFF1A6]">Inventory Discipline:</strong> Owned a 10-day review cycle across 2,000–3,000 SKUs annually, reducing unsold inventory value from approximately ₹5–6 lakh to ₹1–2 lakh.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FFF1A6] font-bold">&#8250;</span>
                  <span><strong className="text-[#FFF1A6]">Revenue Recovery & Growth:</strong> Audited billing records to recover ₹35,000–₹40,000 in underbilled revenue; converted four new institutional accounts from a pipeline of 30+ prospects.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Academic Foundation (Span 12) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#4A2922] border border-[#6B352A] rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#FFF1A6]/80 hover:shadow-[0_25px_60px_rgba(107,53,42,0.4)] transition-all duration-500 overflow-hidden relative group"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,241,166,0.12), transparent 70%)'
              }}
            ></div>

            <div className="space-y-2 text-left relative z-10 max-w-xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                ACADEMIC FOUNDATION & CONTINUOUS LEARNING
              </h3>
              <p className="text-base md:text-lg font-semibold text-[#F7EEDB]">
                Master of Computer Applications (MCA) — CHRIST (Deemed to be University), Bengaluru <span className="text-[#C9B8A8] text-sm font-normal">• Expected May 2027</span>
              </p>
              <p className="text-sm md:text-base text-[#F7EEDB]/90 font-normal">
                Bachelor of Computer Applications (BCA) — JAIN (Deemed to be University), Bengaluru <span className="text-[#C9B8A8] text-sm font-normal">• Completed May 2025</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 relative z-10">
              {['MySQL', 'Advanced Excel', 'Power BI', 'Python', 'Jira'].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono uppercase tracking-wider text-[#FFF1A6] shadow-inner hover:bg-[#824B3D] hover:border-[#FFF1A6]/70 hover:scale-105 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
