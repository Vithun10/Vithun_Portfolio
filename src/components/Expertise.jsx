import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const expertiseData = [
  {
    number: "01",
    title: "Bottleneck & Throughput Diagnostics",
    text: "Mapping end-to-end workflows to separate elapsed duration from active queue time. Investigating accumulation points, handoff friction, and rework loops to diagnose root causes behind SLA breaches and cycle-time degradation.",
    tag: "PROCESS OPTIMISATION",
    gradient: "from-[#5A3229] via-[#4A2922] to-[#3B211B]"
  },
  {
    number: "02",
    title: "Operational Performance & KPI Reporting",
    text: "Designing metrics frameworks that reflect operating reality. Using SQL to analyse pipeline flow, backlog aging, rework frequency, and capacity utilisation, supported by Power BI reporting.",
    tag: "PERFORMANCE ANALYTICS",
    gradient: "from-[#532E26] via-[#452620] to-[#371E18]"
  },
  {
    number: "03",
    title: "Commercial & Cost Optimization",
    text: "Auditing operational cost drivers, supplier unit pricing, and billing records to identify margin leakage. Applying structured review cycles to improve inventory discipline and recover underbilled revenue.",
    tag: "COMMERCIAL OPERATIONS",
    gradient: "from-[#5C342B] via-[#4C2B24] to-[#3D221C]"
  },
  {
    number: "04",
    title: "Decision Support & Scenario Modelling",
    text: "Building multi-scenario Excel financial and capacity models to evaluate operational interventions. Simulating staffing adjustments, process redesigns, and workload trade-offs under explicit assumptions before allocating resources.",
    tag: "DECISION MODELLING",
    gradient: "from-[#4F2B23] via-[#42241E] to-[#351D18]"
  }
];

const Expertise = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const cards = cardRefs.current;
    if (!cards.length) return;

    // High-Performance Stacking Cards without Expensive Filter Blurs
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return; // Keep top-most card focused

      gsap.to(card, {
        scale: 0.92 - index * 0.025,
        y: -15 - index * 8,
        opacity: 0.5,
        scrollTrigger: {
          trigger: card,
          start: `top ${90 + index * 20}px`,
          end: "bottom top",
          scrub: true,
        }
      });
    });

    // High performance mouse highlight per card - cached geometry to eliminate reflow
    const cleanups = [];
    cards.forEach((card) => {
      if (!card) return;
      let cardRect = null;
      const onEnter = () => { cardRect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      };
      const onLeave = () => { cardRect = null; };

      card.addEventListener('mouseenter', onEnter, { passive: true });
      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });

      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section
      id="expertise"
      ref={containerRef}
      className="relative w-full bg-[#3B211B] text-[#F7EEDB] py-20 px-6 md:px-12 select-none overflow-hidden"
    >
      {/* Cinematic Ambient Glow - warm brown */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[#6B352A]/30 rounded-full blur-[70px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12">
        
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#4A2922] border border-[#6B352A] text-[11px] font-mono uppercase tracking-widest text-[#FFF1A6] shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFF1A6] animate-ping"></span>
              <span className="text-[#FFF1A6] font-bold">CORE COMPETENCIES</span>
              <span className="text-[#824B3D]">|</span>
              <span className="text-[#F7EEDB]/85">OPERATIONAL PLAYBOOK</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#F7EEDB] tracking-tight leading-tight">
              OPERATIONAL PLAYBOOK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1A6] via-[#F7EEDB] to-[#FFF1A6] drop-shadow-[0_0_25px_rgba(255,241,166,0.3)]">
                PROBLEM AREAS & METHODS.
              </span>
            </h2>
          </div>
          <p className="text-[#C9B8A8] text-xs md:text-sm font-light leading-relaxed max-w-xs">
            Bridging commercial operations, process analysis, and data-driven decision models to remove bottlenecks and improve margin.
          </p>
        </div>

        {/* Compact 1-on-1 Gradient Stacking Container */}
        <div className="relative flex flex-col gap-8 pb-20">
          {expertiseData.map((item, index) => (
            <div
              key={index}
              ref={addToRefs}
              className={`sticky w-full p-6 md:p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border border-[#6B352A] shadow-[0_20px_45px_rgba(40,20,16,0.7)] flex flex-col justify-between min-h-[230px] md:min-h-[250px] transform-gpu transition-all overflow-hidden group hover:border-[#FFF1A6] hover:shadow-[0_25px_55px_rgba(130,75,61,0.5)]`}
              style={{
                zIndex: index + 1,
                top: `${95 + index * 16}px`
              }}
            >
              {/* Dynamic Mouse Spotlight Highlight */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                  background: 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(255,241,166,0.15), transparent 70%)'
                }}
              ></div>

              {/* Pale Yellow Accent Stripe */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-[#FFF1A6]/60 to-transparent z-10"></div>

              {/* Card Header Top */}
              <div className="flex items-center justify-between w-full mb-4 relative z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFF1A6] px-2.5 py-0.5 rounded bg-[#6B352A] border border-[#FFF1A6]/30">
                  {item.tag}
                </span>
                <span className="text-2xl md:text-3xl font-mono font-black text-[#FFF1A6]/30">
                  {item.number}
                </span>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-auto relative z-10">
                <div className="lg:col-span-5">
                  <h3 className="text-2xl md:text-3xl font-black text-[#F7EEDB] tracking-tight leading-snug group-hover:text-[#FFF1A6] transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-xs md:text-sm text-[#C9B8A8] font-light leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Subtle Corner Dot */}
              <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-[#FFF1A6] group-hover:shadow-[0_0_12px_#FFF1A6] z-10 transition-all"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Expertise;
