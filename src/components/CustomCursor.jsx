import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices to conserve resources and avoid scroll interference
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;

    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let spotX = -100;
    let spotY = -100;

    let isWindowActive = false;
    let isOverPortrait = false;
    let rafId = null;
    let isMoving = false;
    let stopMovingTimer = null;

    // Direct RAF render loop - 0ms immediate hardware tracking on dot, silky lerp on ring & spotlight
    const render = () => {
      // 1. Cursor Dot: Immediate 0ms latency tracking hardware cursor
      dot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;

      // 2. Cursor Ring: Fast, responsive spring lerp (no GSAP tween overhead)
      ringX += (mouseX - 24 - ringX) * 0.45;
      ringY += (mouseY - 24 - ringY) * 0.45;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      // 3. Spotlight Beam: Smooth ambient follower
      if (spotlight) {
        spotX += (mouseX - 275 - spotX) * 0.25;
        spotY += (mouseY - 275 - spotY) * 0.25;
        spotlight.style.transform = `translate3d(${spotX}px, ${spotY}px, 0)`;
      }

      // Keep RAF alive while moving or settling to destination
      const ringDiff = Math.abs(mouseX - 24 - ringX) + Math.abs(mouseY - 24 - ringY);
      if (isMoving || ringDiff > 0.1) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const startRaf = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;

      if (!isWindowActive) {
        isWindowActive = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        if (spotlight && !isOverPortrait) spotlight.style.opacity = '1';
        ringX = mouseX - 24;
        ringY = mouseY - 24;
        spotX = mouseX - 275;
        spotY = mouseY - 275;
      }

      // Check if cursor is over portrait photograph to keep photo completely natural and untinted
      const target = e.target;
      const isTargetPhoto = Boolean(
        target && (
          target.id === 'portrait-photo' ||
          target.closest?.('#portrait-photo') ||
          target.getAttribute?.('data-no-spotlight')
        )
      );

      if (isTargetPhoto && !isOverPortrait) {
        isOverPortrait = true;
        if (spotlight) spotlight.style.opacity = '0';
      } else if (!isTargetPhoto && isOverPortrait) {
        isOverPortrait = false;
        if (spotlight && isWindowActive) spotlight.style.opacity = '1';
      }

      startRaf();

      if (stopMovingTimer) clearTimeout(stopMovingTimer);
      stopMovingTimer = setTimeout(() => {
        isMoving = false;
      }, 60);
    };

    const handleMouseEnter = () => {
      isWindowActive = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      if (spotlight && !isOverPortrait) spotlight.style.opacity = '1';
      startRaf();
    };

    const handleMouseLeave = () => {
      isWindowActive = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      if (spotlight) spotlight.style.opacity = '0';
    };

    const onSpotlightDisable = () => {
      isOverPortrait = true;
      if (spotlight) spotlight.style.opacity = '0';
    };

    const onSpotlightEnable = () => {
      isOverPortrait = false;
      if (spotlight && isWindowActive) spotlight.style.opacity = '1';
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("spotlight-disable", onSpotlightDisable);
    window.addEventListener("spotlight-enable", onSpotlightEnable);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stopMovingTimer) clearTimeout(stopMovingTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("spotlight-disable", onSpotlightDisable);
      window.removeEventListener("spotlight-enable", onSpotlightEnable);
    };
  }, []);

  return (
    <>
      {/* Global Mouse Follower Spotlight Beam - Pure CSS smooth radial gradient */}
      <div
        id="cursor-spotlight"
        ref={spotlightRef}
        className="hidden md:block fixed top-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none z-[99998] opacity-0 transition-opacity duration-200 ease-out will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(130,75,61,0.25) 0%, rgba(255,241,166,0.08) 25%, rgba(107,53,42,0.03) 50%, transparent 70%)'
        }}
      ></div>

      {/* Global Custom Cursor Dot - 0ms immediate hardware tracking */}
      <div
        id="cursor-dot"
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 z-[100000] pointer-events-none w-3 h-3 bg-[#FFF1A6] rounded-full shadow-[0_0_12px_#FFF1A6] opacity-0 transition-opacity duration-150 ease-out will-change-transform"
      ></div>

      {/* Global Custom Cursor Ring - Silky smooth RAF trailing ring */}
      <div
        id="cursor-ring"
        ref={ringRef}
        className="hidden md:block fixed top-0 left-0 z-[100000] pointer-events-none w-12 h-12 border border-[#FFF1A6]/80 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-150 ease-out will-change-transform"
      ></div>
    </>
  );
};

export default CustomCursor;
