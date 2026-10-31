import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trackEvent } from '../utils/analytics';

gsap.registerPlugin(ScrollTrigger);

// Authoritative Business Operations & Analytics Case Studies
const projectsData = [
  {
    id: "flow",
    title: "FLOW — Customer Onboarding Throughput Diagnostic",
    subtitle: "B2B SaaS Onboarding Throughput & Capacity Decision Model",
    category: "Operations Diagnostic & Decision Model",
    scenario: "Northstar Cloud Services — Fictional B2B SaaS Provider",
    disclosure: "SYNTHETIC DATA CASE STUDY",
    caseBadge: "CASE STUDY 01",
    match: "49.2% SLA Attainment",
    primaryImage: "/assets/projects/flow/01_executive_report.png",
    screenshots: [
      {
        name: "Executive Report",
        file: "/assets/projects/flow/01_executive_report.png",
        caption: "High-level overview tracking monthly application demand against completions and the 35-day SLA attainment trend."
      },
      {
        name: "Process Bottlenecks",
        file: "/assets/projects/flow/02_process_bottlenecks.png",
        caption: "Stage queue durations and accumulation metrics isolating Finance Approval as the primary internal congestion point."
      },
      {
        name: "Quality & Rework",
        file: "/assets/projects/flow/03_quality_rework.png",
        caption: "Detailed rework breakdown showing 19.9% rework rate, primary return loops, and 29,814 estimated effort minutes proxy."
      },
      {
        name: "Capacity & Workload",
        file: "/assets/projects/flow/04_capacity_workload.png",
        caption: "Team workload allocation, active owner queues, and monthly throughput load by operational role."
      }
    ],
    summary: "Diagnosed why only 49.2% of customer onboardings met the 35-day SLA. Identified Finance Approval queue accumulation and 19.9% rework; modelled intervention scenarios in a 7-tab Excel decision model.",
    problem: "Northstar Cloud Services had a 240-completion/month planning target and a 35-calendar-day customer onboarding SLA, but onboarding was experiencing severe throughput constraints, ballooning cycle times, and closing backlog accumulation.",
    approach: "Investigated a 7-stage workflow using 2,711 synthetic applications (Oct 2025 – Sep 2026). Ingested 18,332 stage history rows and 21,363 tasks into MySQL, validated 12 deliberately injected data quality issues, verified 12-month backlog continuity, built a 7-tab Excel capacity and cost decision model, and developed a 4-page Power BI report.",
    findings: [
      "SLA Attainment: Only 49.2% of completed applications met the 35-calendar-day SLA.",
      "Cycle Times: Mean cycle time was 40.8 calendar days; Median was 35.1 days; P90 reached 70.0 days, exposing severe long-tail delays.",
      "Bottleneck Identified: Finance Approval ranked #1 in composite bottleneck score (mean queue 1.43d, P90 queue 4.01d, 52 queued applications, +25 quarterly accumulation). Duration alone would have misidentified Legal/Implementation.",
      "Rework Impact: 19.9% application rework rate across 571 qualifying rework events (29,814 estimated effort minutes proxy).",
      "Decision Implication: Option D (Redesign + Targeted Staffing) increased throughput to 213.2 cases/month (demand-capped), but still left an ~17.4 case/month gap to the 240 target in the Base Case."
    ],
    decision: "Process redesign and targeted staffing substantially improve operational throughput, but cannot close the full planning gap alone without upstream intake quality controls and demand alignment.",
    limitations: "Dataset is synthetic; queue times and task intervals are simulation outputs; rework minutes represent proxy effort estimates rather than payroll timesheets; intervention scenarios are planning estimates rather than observed production outcomes.",
    tags: ["MySQL", "Advanced Excel", "Power BI", "DAX", "Process Mapping"],
    githubUrl: "https://github.com/Vithun10/BizOps_Projects"
  },
  {
    id: "triage",
    title: "TRIAGE — Risk-Based Onboarding & KYC Controls",
    subtitle: "Digital Banking KYC Workflow, Drop-off & Risk-Tier Triage",
    category: "Workflow Controls & Risk Triage",
    scenario: "Fictional Digital Banking Institution",
    disclosure: "SYNTHETIC DATA CASE STUDY",
    caseBadge: "CASE STUDY 02",
    match: "78.15% Activation Rate",
    primaryImage: "/assets/projects/triage/Onboarding_Funnel.png",
    screenshots: [
      {
        name: "Onboarding Funnel",
        file: "/assets/projects/triage/Onboarding_Funnel.png",
        caption: "Funnel drop-off across 6 stages from signup started through document upload to final customer activation."
      },
      {
        name: "TTO by Risk Tier",
        file: "/assets/projects/triage/TTO by Risk Tier.png",
        caption: "Time-to-onboard spread showing ~14x duration difference between Low Risk (4.04m), Medium (17.79m), and High (57.24m)."
      },
      {
        name: "Risk Tier Distribution",
        file: "/assets/projects/triage/Risk Tier Distribution.png",
        caption: "Distribution of 2,000 synthetic applicants across Low (81%), Medium (14%), and High (5%) risk categories."
      },
      {
        name: "Drop-off Table",
        file: "/assets/projects/triage/Drop-off Table.png",
        caption: "Granular stage exit counts and abandonment rates highlighting Document Upload as the primary friction point."
      }
    ],
    summary: "Designed a tiered KYC onboarding workflow to balance customer friction with compliance risk. Document upload was the primary bottleneck (165 lost); evaluated precision/recall trade-offs at threshold 50.",
    problem: "A digital bank applied uniform identity-verification effort to 100% of applicants. This created unnecessary friction and abandonment for legitimate users while overwhelming compliance analysts with manual reviews.",
    approach: "Analysed 2,000 synthetic applicant records across a 6-stage onboarding funnel. Formulated a 3-factor composite risk score (Country 40%, Velocity 30%, Inverted Match 30%). Documented complete business architecture (BRD, FRD with 14 requirements, RTM, 13 user stories, swimlane maps) and evaluated threshold sensitivity from 20 to 75 in Python.",
    findings: [
      "Funnel Conversion: 1,563 applicants activated (78.15% activation rate); 437 abandoned (21.85% drop-off).",
      "Friction Point: Document Upload was the single largest drop-off stage, accounting for 165 lost applicants (37.8% of all drop-offs; 8.25% of total applicants).",
      "Time-to-Onboard by Risk Tier: Low Risk averaged 4.04 minutes; Medium Risk averaged 17.79 minutes; High Risk averaged 57.24 minutes (~14x longer than Low tier).",
      "Threshold Trade-Off: In the separate threshold sensitivity analysis, Threshold 50 was selected as a workload-conscious operating choice (303 escalated applicants, 15.2% escalation rate, 0.436 precision, 0.324 recall) to prevent manual compliance queue overflow."
    ],
    criticalDistinction: "The dashboard's 3-tier distribution (98 High-risk applicants, including all 86 PEP overrides) is distinct from the separate threshold-50 binary escalation analysis (303 escalated applicants). They represent different analytical perspectives.",
    decision: "Implement instant straight-through processing (STP) for Low-risk applicants, route Medium-risk to stepped-up verification, escalate High-risk and PEP flags to Enhanced Due Diligence (EDD), and prioritize UX/OCR improvements at Document Upload.",
    limitations: "Dataset is synthetic; threshold 50 is an analytical workload trade-off rather than a proven production policy; sanctions matching is documented as a proposed control requirement, not a tested dataset feature or active vendor integration.",
    tags: ["Python", "pandas", "NumPy", "MySQL", "Power BI", "Requirements Analysis"],
    githubUrl: "https://github.com/Vithun10/BizOps_Projects"
  }
];

const Projects = () => {
  const containerRef = useRef(null);
  const folderBackRef = useRef(null);
  const folderFrontRef = useRef(null);
  const cardsRef = useRef([]);
  const mobileCardsRef = useRef([]);
  const mobileCarouselRef = useRef(null);

  const [activeProject, setActiveProject] = useState(null);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // DESKTOP FOLDER OPENING ANIMATION (Exact Two Projects)
      mm.add("(min-width: 768px)", () => {
        gsap.set([folderBackRef.current, folderFrontRef.current], {
          xPercent: -50,
          yPercent: -50
        });
        gsap.set(folderFrontRef.current, { transformOrigin: "bottom center", rotationX: 0 });
        
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scale: 0.85,
            opacity: 0,
            rotation: (i === 0 ? -4 : 4)
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
            end: "bottom 80%",
            toggleActions: "play none none reverse",
          }
        });

        tl.to(folderFrontRef.current, {
          rotationX: -130,
          duration: 0.9,
          ease: "power3.inOut"
        });

        tl.to(cardsRef.current, {
          y: -140,
          opacity: 1,
          scale: 0.95,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.4)"
        }, "-=0.5");

        // Two cards fanning out gracefully and symmetrically to left and right around the center
        const getOffset = () => (typeof window !== 'undefined' && window.innerWidth < 1100 ? 230 : 280);

        tl.to(cardsRef.current, {
          x: (i) => (i === 0 ? -getOffset() : getOffset()),
          y: -60,
          rotation: (i) => (i === 0 ? -6 : 6),
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out"
        }, "-=0.2");
      });

      // MOBILE VERTICAL STACK TIMELINE (FLOW then TRIAGE)
      mm.add("(max-width: 767px)", () => {
        const cards = mobileCardsRef.current.filter(Boolean);
        if (cards.length > 0) {
          gsap.set(cards, {
            clearProps: "transform,opacity",
            opacity: 0,
            y: 30
          });

          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.18,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpenDetail = (project) => {
    setActiveProject(project);
    setActiveScreenshotIdx(0);
    if (project?.id === 'flow') {
      trackEvent('flow_case_study_open');
    } else if (project?.id === 'triage') {
      trackEvent('triage_case_study_open');
    }
  };

  return (
    <section id="projects" ref={containerRef} className="bg-[#3B211B] min-h-screen md:min-h-[170vh] relative font-sans overflow-x-clip text-[#F7EEDB] w-full flex flex-col items-center justify-start py-16 md:py-32 select-none">
      
      {/* Background Watermark in Warm Brown */}
      <div className="absolute top-10 left-0 w-full flex items-start justify-center pointer-events-none z-0">
        <h1 className="text-[14vw] sm:text-[17vw] md:text-[20vw] font-black text-[#4A2922]/70 tracking-tighter leading-none whitespace-nowrap uppercase">
          EVIDENCE
        </h1>
      </div>

      {/* Ambient Warm Glow behind folder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] bg-[#6B352A]/30 rounded-full blur-[70px] pointer-events-none z-0" />

      {/* Centered Section Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 px-6 mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#4A2922] border border-[#6B352A] text-[11px] font-mono uppercase tracking-widest text-[#FFF1A6] shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFF1A6] animate-ping"></span>
          <span className="text-[#FFF1A6] font-bold">CASE EVIDENCE</span>
          <span className="text-[#824B3D]">|</span>
          <span className="text-[#F7EEDB]/85">VERIFIED PORTFOLIO ARTIFACTS</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[#F7EEDB] tracking-tight leading-tight">
          OPERATIONS & ANALYTICS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1A6] via-[#F7EEDB] to-[#FFF1A6] drop-shadow-[0_0_25px_rgba(255,241,166,0.3)]">
            FEATURED CASE STUDIES.
          </span>
        </h2>
        <p className="text-[#C9B8A8] text-xs md:text-sm font-light leading-relaxed max-w-xl mx-auto">
          Explore production-grade business operations models, SLA bottleneck diagnostics, and interactive Power BI report evidence.
        </p>
      </div>

      {/* Main Perspective Container - Centered Symmetrically (Desktop Only) */}
      <div className="hidden md:flex relative w-full max-w-7xl items-center justify-center perspective-[2000px] z-10 min-h-[580px]">
        
        {/* Origin Container */}
        <div className="relative w-0 h-0 transform-style-3d">
          
          {/* Folder Back */}
          <div 
            ref={folderBackRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video bg-[#4A2922] rounded-[24px] border border-[#6B352A] shadow-[0_20px_50px_rgba(59,33,27,0.6)] flex items-center justify-center"
            style={{ zIndex: 5 }}
          >
            <div className="absolute -top-6 left-6 w-32 h-8 bg-[#5A3229] rounded-t-xl border-t border-[#824B3D]" />
            <div className="relative z-10 text-[#FFF1A6] font-mono font-black text-2xl tracking-widest uppercase opacity-85">
              CASE_ARCHIVES
            </div>
          </div>

          {/* Desktop Project Cards (Exactly Two Case Studies) */}
          {projectsData.map((project, i) => (
            <div 
              key={project.id}
              id={`project-card-${project.id}`}
              ref={el => cardsRef.current[i] = el}
              onClick={() => handleOpenDetail(project)}
              className="hidden md:block absolute w-[84vw] md:w-[38vw] max-w-[490px] h-[520px] will-change-transform cursor-pointer"
              style={{ zIndex: 10 + i }}
            >
              <div className="w-full h-full rounded-[24px] overflow-hidden border border-[#6B352A] bg-gradient-to-br from-[#4A2922] via-[#3E221C] to-[#331B16] shadow-[0_20px_45px_rgba(30,15,12,0.75)] transition-[border-color,box-shadow,transform] duration-300 group hover:scale-[1.02] hover:border-[#FFF1A6] hover:shadow-[0_25px_60px_rgba(130,75,61,0.5)] hover:-translate-y-1 relative z-10 p-6 flex flex-col justify-between">
                
                {/* Top Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FFF1A6] bg-[#6B352A] px-2.5 py-1 rounded border border-[#FFF1A6]/30">
                      {project.caseBadge}
                    </span>
                    <span className="text-[9px] font-mono font-black tracking-wider uppercase text-[#3B211B] bg-[#FFF1A6] px-2 py-0.5 rounded border border-[#FFF1A6]">
                      {project.disclosure}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#FFF1A6] font-bold">{project.match}</span>
                    <span className="text-[10px] font-mono border border-[#6B352A] bg-[#3B211B] px-1.5 py-0.5 text-[#FFF1A6] rounded">PBI</span>
                  </div>
                </div>

                {/* Primary Screenshot Preview (Keeps original screenshots completely intact) */}
                <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-[#6B352A] group-hover:border-[#FFF1A6]/70 transition-colors my-2 bg-[#2E1813]">
                  <img
                    src={project.primaryImage}
                    alt={`${project.title} Dashboard Preview`}
                    className="w-full h-full object-cover filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#361E18]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#FFF1A6]">
                    <span className="truncate">{project.scenario}</span>
                    <span className="text-[#FFF1A6] font-bold shrink-0">Click to Inspect &rarr;</span>
                  </div>
                </div>

                {/* Middle Title & Description */}
                <div className="space-y-1.5 my-auto">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9B8A8]">
                    {project.subtitle}
                  </div>
                  <h3 className="text-xl font-black text-[#F7EEDB] tracking-tight group-hover:text-[#FFF1A6] transition-colors duration-300 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#F7EEDB]/90 font-light leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#6B352A]/60 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono text-[#FFF1A6] bg-[#3B211B] border border-[#6B352A] px-2 py-0.5 rounded group-hover:border-[#FFF1A6]/40 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#FFF1A6] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Explore Case &rarr;
                  </span>
                </div>

                {/* Glowing Corner Accent */}
                <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#FFF1A6] group-hover:shadow-[0_0_15px_#FFF1A6] transition-all" />
              </div>
            </div>
          ))}

          {/* Folder Front Flap */}
          <div 
            ref={folderFrontRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video pointer-events-none will-change-transform"
            style={{ zIndex: 60 }}
          >
            <div className="absolute bottom-0 w-full h-[85%] bg-[#361E18] rounded-b-[24px] rounded-t-md shadow-[0_-5px_20px_rgba(0,0,0,0.8)] flex flex-col justify-end p-6 border-t border-[#6B352A]">
              <div className="w-20 h-1.5 bg-[#FFF1A6]/30 rounded-full mx-auto mb-2" />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Vertical Stack (FLOW then TRIAGE in normal document flow) */}
      <div 
        ref={mobileCarouselRef}
        className="md:hidden relative w-full px-5 flex flex-col items-center gap-6 z-20"
      >
        {projectsData.map((project, i) => (
          <div 
            key={`mob-${project.id}`}
            id={`mob-project-card-${project.id}`}
            ref={el => mobileCardsRef.current[i] = el}
            onClick={() => handleOpenDetail(project)}
            className="w-full max-w-[420px] will-change-transform relative z-10 cursor-pointer"
          >
            <div className="w-full rounded-[24px] overflow-hidden border border-[#6B352A] bg-gradient-to-br from-[#4A2922] via-[#3E221C] to-[#331B16] p-5 flex flex-col justify-between shadow-[0_20px_40px_rgba(30,15,12,0.9)] hover:border-[#FFF1A6]/80 transition-all duration-300">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFF1A6] bg-[#6B352A] px-2 py-0.5 rounded border border-[#FFF1A6]/30">
                  {project.caseBadge}
                </span>
                <span className="text-[8px] font-mono font-black text-[#3B211B] bg-[#FFF1A6] px-1.5 py-0.5 rounded border border-[#FFF1A6]">
                  {project.disclosure}
                </span>
                <span className="text-xs font-mono text-[#FFF1A6] font-bold">{project.match}</span>
              </div>

              {/* Mobile Primary Image */}
              <div className="relative w-full h-[160px] sm:h-[180px] rounded-xl overflow-hidden border border-[#6B352A] my-3 bg-[#2E1813]">
                <img
                  src={project.primaryImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="text-[9px] font-mono uppercase text-[#C9B8A8]">{project.subtitle}</div>
                <h3 className="text-base sm:text-lg font-black text-[#F7EEDB] leading-tight">{project.title}</h3>
                <p className="text-xs text-[#F7EEDB]/90 font-light line-clamp-2">{project.summary}</p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2.5 border-t border-[#6B352A]/60 items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono text-[#FFF1A6] bg-[#3B211B] border border-[#6B352A] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#FFF1A6] font-bold uppercase tracking-wider">
                  Explore Case &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Detail Modal & Gallery */}
      {activeProject && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-[90000] flex items-center justify-center p-4 md:p-8 bg-[#200F0B]/92 animate-fadeIn select-text"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#3B211B] border border-[#6B352A] rounded-3xl shadow-[0_30px_90px_rgba(20,10,8,0.95)] overflow-hidden flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="px-6 py-4 md:px-8 md:py-5 border-b border-[#6B352A] flex items-center justify-between bg-[#4A2922]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase text-[#FFF1A6] bg-[#6B352A] px-3 py-1 rounded border border-[#FFF1A6]/30">
                  {activeProject.caseBadge}
                </span>
                <span className="text-xs font-mono font-black uppercase text-[#3B211B] bg-[#FFF1A6] px-3 py-1 rounded border border-[#FFF1A6]">
                  {activeProject.disclosure}
                </span>
              </div>
              <button 
                onClick={() => setActiveProject(null)}
                className="w-9 h-9 rounded-full bg-[#5A3229] hover:bg-[#6B352A] text-[#FFF1A6] border border-[#6B352A] flex items-center justify-center transition-colors text-sm font-bold"
                aria-label="Close Case Study"
              >
                &times;
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Project Title Block */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                  {activeProject.subtitle}
                </span>
                <h2 id="modal-project-title" className="text-2xl md:text-3xl font-black text-[#F7EEDB] tracking-tight">
                  {activeProject.title}
                </h2>
                <p className="text-xs font-mono text-[#C9B8A8]">
                  Scenario: {activeProject.scenario}
                </p>
              </div>

              {/* Interactive Dashboard Screenshot Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                    Power BI Dashboard Reports & Evidence
                  </h4>
                  <span className="text-xs font-mono text-[#C9B8A8]">
                    [ {activeScreenshotIdx + 1} of {activeProject.screenshots.length} ]
                  </span>
                </div>

                {/* Screenshot Display (Image itself untouched) */}
                <div className="relative w-full aspect-[16/9] bg-[#2E1813] rounded-2xl overflow-hidden border border-[#6B352A] shadow-2xl">
                  <img 
                    src={activeProject.screenshots[activeScreenshotIdx].file}
                    alt={activeProject.screenshots[activeScreenshotIdx].name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-xs font-light text-[#F7EEDB]/90 italic px-1">
                  &bull; {activeProject.screenshots[activeScreenshotIdx].caption}
                </p>

                {/* Thumbnail Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {activeProject.screenshots.map((shot, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveScreenshotIdx(sIdx)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                        activeScreenshotIdx === sIdx 
                          ? 'bg-[#6B352A] border-[#FFF1A6] text-[#FFF1A6] font-bold shadow-[0_0_15px_rgba(107,53,42,0.6)]' 
                          : 'bg-[#4A2922] border-[#6B352A] text-[#C9B8A8] hover:border-[#FFF1A6]/50'
                      }`}
                    >
                      <span className="block truncate">{shot.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Study Deep-Dive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Business Problem */}
                <div className="p-5 bg-[#4A2922] rounded-2xl border border-[#6B352A] space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                    The Business Problem
                  </h4>
                  <p className="text-xs md:text-sm text-[#F7EEDB] font-light leading-relaxed">
                    {activeProject.problem}
                  </p>
                </div>

                {/* Analytical Approach */}
                <div className="p-5 bg-[#4A2922] rounded-2xl border border-[#6B352A] space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                    Analytical Investigation
                  </h4>
                  <p className="text-xs md:text-sm text-[#F7EEDB] font-light leading-relaxed">
                    {activeProject.approach}
                  </p>
                </div>

              </div>

              {/* Key Findings */}
              <div className="p-6 bg-[#4A2922] rounded-2xl border border-[#6B352A] space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                  Verified Analytical Findings
                </h4>
                <ul className="space-y-2.5 text-xs md:text-sm text-[#F7EEDB] font-light">
                  {activeProject.findings.map((finding, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="text-[#FFF1A6] font-bold mt-0.5">&rsaquo;</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Distinction (TRIAGE Specific) */}
              {activeProject.criticalDistinction && (
                <div className="p-5 bg-[#532E26] rounded-2xl border border-[#FFF1A6]/50 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                    Analytical Model Distinction
                  </h4>
                  <p className="text-xs md:text-sm text-[#F7EEDB] font-light leading-relaxed">
                    {activeProject.criticalDistinction}
                  </p>
                </div>
              )}

              {/* Decision Implication */}
              <div className="p-5 bg-[#4A2922] rounded-2xl border border-[#6B352A] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFF1A6] font-bold">
                  Operational Decision Implication
                </h4>
                <p className="text-xs md:text-sm text-[#F7EEDB] font-light leading-relaxed">
                  {activeProject.decision}
                </p>
              </div>

              {/* Project Limitations */}
              <div className="p-5 bg-[#331B16] rounded-2xl border border-[#6B352A]/60 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C9B8A8] font-bold">
                  Documented Limitations & Scope
                </h4>
                <p className="text-xs text-[#C9B8A8] font-light leading-relaxed">
                  {activeProject.limitations}
                </p>
              </div>

              {/* Tools Used */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9B8A8] mr-2">Tools:</span>
                {activeProject.tags.map((tool, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono text-[#FFF1A6]">
                    {tool}
                  </span>
                ))}
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className="px-6 py-4 md:px-8 md:py-5 border-t border-[#6B352A] bg-[#4A2922] flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#6B352A] hover:bg-[#824B3D] text-[#FFF1A6] border border-[#FFF1A6]/40 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(107,53,42,0.7)] flex items-center justify-center gap-2"
              >
                <span>View BizOps Repository</span>
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <button
                onClick={() => setActiveProject(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#5A3229] hover:bg-[#6B352A] text-[#F7EEDB] border border-[#6B352A] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Close Case Study
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Projects;
