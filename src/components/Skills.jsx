import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  { 
    title: 'SQL & Relational Databases', 
    desc: 'Writing structured queries, window functions, and staging transformations to validate data quality, track multi-stage funnel pipelines, and calculate operational KPIs.', 
    tag: 'DATA EXTRACTION & ANALYSIS',
    skills: ['MySQL', 'Window Functions', 'Multi-Table Joins', 'Data Profiling', 'Data Validation'] 
  },
  { 
    title: 'Advanced Excel Modelling', 
    desc: 'Designing multi-tab financial and operational decision models with explicit assumptions, sensitivity analyses, capacity constraints, and scenario comparisons.', 
    tag: 'QUANTITATIVE MODELLING',
    skills: ['Scenario Modelling', 'Sensitivity Analysis', 'Capacity Planning', 'PivotTables', 'Cost Build-Ups'] 
  },
  { 
    title: 'Power BI & Dashboarding', 
    desc: 'Transforming operational datasets into executive reports. Writing DAX measures to calculate SLA attainment, cycle-time percentiles, funnel performance, and bottleneck indicators.', 
    tag: 'EXECUTIVE REPORTING',
    skills: ['Power BI', 'DAX Measures', 'Executive Reporting', 'Funnel Visualisation', 'Backlog Tracking'] 
  },
  { 
    title: 'Process Mapping & Inefficiency Analysis', 
    desc: 'Analysing workflows to identify handoff friction, queue accumulation, rework patterns, and process delays. Documenting current-state and proposed future-state workflows.', 
    tag: 'PROCESS IMPROVEMENT',
    skills: ['Swimlane Mapping', 'Queue Time Analysis', 'Rework Diagnostics', 'Workflow Analysis', 'Process Documentation'] 
  },
  { 
    title: 'Risk-Based Triage & Funnel Analysis', 
    desc: 'Analysing tiered onboarding workflows to understand customer friction and verification risk. Evaluating precision and recall trade-offs to understand the effect of escalation thresholds on manual review workloads.', 
    tag: 'RISK & WORKFLOW CONTROLS',
    skills: ['Risk Tiering', 'Threshold Evaluation', 'Funnel Friction', 'PEP Controls', 'Precision vs Recall'] 
  },
  { 
    title: 'Operations Tools & Execution', 
    desc: 'Using operational tools and analytical workflows to support cross-functional communication, issue tracking, reporting, and continuous improvement.', 
    tag: 'EXECUTION & TOOLS',
    skills: ['Jira', 'Python (pandas)', 'Git & GitHub', 'Cross-Functional Reviews', 'Operational Reporting'] 
  },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const tickingRef = useRef(false);
  const lastActiveRef = useRef(-1);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const showSwipeHintRef = useRef(true);

  const handleScroll = (e) => {
    if (window.innerWidth >= 769) return;

    // Position-dependent swipe hint: visible only near carousel start (tolerance ~15px)
    const scrollLeft = e.target?.scrollLeft ?? 0;
    const isAtStart = scrollLeft <= 15;

    if (showSwipeHintRef.current !== isAtStart) {
      showSwipeHintRef.current = isAtStart;
      setShowSwipeHint(isAtStart);
    }

    if (tickingRef.current) return;
    tickingRef.current = true;
    const container = e.target;

    requestAnimationFrame(() => {
      tickingRef.current = false;
      if (!container) return;
      const center = container.scrollLeft + container.offsetWidth / 2;
      
      let activeIdx = 0;
      let minDiff = Infinity;
      
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const diff = Math.abs(cardCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = i;
        }
      });

      if (activeIdx !== lastActiveRef.current) {
        lastActiveRef.current = activeIdx;
        cardsRef.current.forEach((card, i) => {
          if (card) {
            gsap.to(card, { scale: i === activeIdx ? 1 : 0.92, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          }
        });
      }
    });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        // Pre-allocate quickSetters to eliminate GSAP object allocation on every scroll tick
        const cardSetters = cardsRef.current.map(card => {
          if (!card) return null;
          return {
            x: gsap.quickSetter(card, "x", "px"),
            y: gsap.quickSetter(card, "y", "px"),
            z: gsap.quickSetter(card, "z", "px"),
            scale: gsap.quickSetter(card, "scale"),
            rotationZ: gsap.quickSetter(card, "rotationZ", "deg"),
            opacity: gsap.quickSetter(card, "opacity"),
            zIndex: gsap.quickSetter(card, "zIndex")
          };
        });

        const updateCards = (p) => {
          const radius = 1800; 
          const angleSpread = 18;

          for (let i = 0; i < cardsRef.current.length; i++) {
            const setter = cardSetters[i];
            const card = cardsRef.current[i];
            if (!setter || !card) continue;
            const offset = i - p;
            
            // Culling offscreen cards saves compositor blending cycles
            if (Math.abs(offset) > 2.6) {
              setter.opacity(0);
              card.style.visibility = 'hidden';
              continue;
            }

            card.style.visibility = 'visible';
            const angle = offset * angleSpread;
            const rad = angle * Math.PI / 180;
            
            const x = Math.sin(rad) * radius;
            const y = radius - (Math.cos(rad) * radius); 
            const z = -Math.abs(offset) * 50; 
            
            const scale = Math.max(0.4, 1 - Math.abs(offset) * 0.15);
            const rotateZ = angle; 
            
            const opacity = Math.max(0.1, 1 - Math.abs(offset) * 0.3);
            const zIndex = Math.round(100 - Math.abs(offset) * 10);

            setter.x(x);
            setter.y(y);
            setter.z(z);
            setter.scale(scale);
            setter.rotationZ(rotateZ);
            setter.opacity(opacity);
            setter.zIndex(zIndex);
          }
        };

        updateCards(0);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%", 
          pin: true,
          scrub: 0.35, // Responsive immediate scrub without sluggish catch-up lag
          onUpdate: (self) => {
            const p = self.progress * (skillCategories.length - 1);
            updateCards(p);
          }
        });
      });

      mm.add("(max-width: 768px)", () => {
        cardsRef.current.forEach((card, i) => {
          if (card) {
            gsap.set(card, { clearProps: "x,y,z,rotation,scale,opacity,position" });
            gsap.set(card, { scale: i === 0 ? 1 : 0.92 });
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="skills"
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#3B211B] text-[#F7EEDB] overflow-hidden flex items-center justify-center md:[perspective:1000px] select-none"
    >
      {/* Ambient Warm Brown Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-tr from-[#3B211B] via-[#4A2922]/60 to-[#3B211B]" />

      {/* Persistent Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
        <h1 
          className="text-[20vw] md:text-[15vw] font-black uppercase text-transparent leading-none tracking-tighter"
          style={{ 
            WebkitTextStroke: '2px rgba(255,241,166,0.12)',
            opacity: 0.8
          }}
        >
          CAPABILITIES
        </h1>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full h-full flex md:items-center md:justify-center z-10 md:[transform-style:preserve-3d] overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center px-[10vw] md:px-0 gap-4 md:gap-0"
        onScroll={handleScroll}
      >
        {skillCategories.map((category, i) => (
          <div 
            key={i}
            ref={el => cardsRef.current[i] = el}
            className="md:absolute relative shrink-0 snap-center w-[82vw] sm:w-[360px] md:w-[440px] h-[460px] md:h-[540px] rounded-[32px] p-8 md:p-10 bg-gradient-to-b from-[#4A2922] via-[#40231D] to-[#351C17] border border-[#6B352A] flex flex-col justify-between overflow-hidden group shadow-[0_16px_36px_rgba(30,15,12,0.6)] hover:border-[#FFF1A6] hover:shadow-[0_25px_50px_rgba(130,75,61,0.5)] transition-[border-color,box-shadow] duration-300 will-change-transform"
          >
            {/* Inner Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#824B3D]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
            
            {/* Top Card Metadata */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FFF1A6] bg-[#6B352A] px-3 py-1 rounded border border-[#FFF1A6]/30">
                {category.tag}
              </span>
              <span className="text-xs font-mono text-[#C9B8A8]">
                [ 0{i + 1} / 06 ]
              </span>
            </div>

            {/* Middle Title & Description */}
            <div className="space-y-4 relative z-10 my-auto">
              <h3 className="text-2xl md:text-3xl font-black text-[#F7EEDB] tracking-tight group-hover:text-[#FFF1A6] transition-colors duration-300">
                {category.title}
              </h3>
              <p className="text-sm md:text-base text-[#F7EEDB]/90 font-light leading-relaxed">
                {category.desc}
              </p>
            </div>

            {/* Bottom Skill Badges */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#6B352A]/60 relative z-10">
              {category.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="text-xs font-mono text-[#FFF1A6] bg-[#3B211B] border border-[#6B352A] px-3 py-1 rounded group-hover:border-[#FFF1A6]/60 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom Glow Accent */}
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#FFF1A6] group-hover:shadow-[0_0_15px_#FFF1A6] transition-all" />
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Indicator (Swipe Hint) */}
      <div 
        className={`md:hidden absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-20 flex flex-col items-end justify-center pr-3 bg-gradient-to-l from-[#3B211B] via-[#3B211B]/60 to-transparent transition-opacity duration-500 ease-out ${
          showSwipeHint ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[#4A2922] border border-[#6B352A] shadow-[0_4px_16px_rgba(30,15,12,0.8)] flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-[#FFF1A6] stroke-current stroke-2 fill-none ml-0.5" 
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <span className="text-[7.5px] font-mono tracking-widest uppercase text-[#FFF1A6] font-bold [writing-mode:vertical-rl]">
            SWIPE TO EXPLORE
          </span>
        </div>
      </div>

    </section>
  );
};

export default Skills;
