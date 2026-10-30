import { trackEvent } from '../utils/analytics';

const Footer = () => {
  return (
    <footer className="bg-[#3B211B] text-[#F7EEDB] py-16 px-6 md:px-12 border-t border-[#6B352A] select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* Top Section: Brand & Quick Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-[#6B352A]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/vithun-logo.png" 
                alt="Vithun TR Logo" 
                className="h-10 w-auto object-contain drop-shadow-[0_2px_15px_rgba(255,241,166,0.25)]" 
              />
              <span className="text-2xl font-black text-[#FFF1A6] tracking-tighter drop-shadow-[0_2px_15px_rgba(255,241,166,0.4)]">
                VITHUN TR
              </span>
            </div>
            <p className="text-xs font-mono text-[#C9B8A8] tracking-widest uppercase">
              // BUSINESS OPERATIONS & ANALYTICS &bull; BENGALURU, INDIA
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex flex-wrap gap-6 md:gap-8 text-xs font-mono uppercase tracking-widest text-[#F7EEDB]/85">
            <a href="#home" className="hover:text-[#FFF1A6] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#FFF1A6] transition-colors">About</a>
            <a href="#expertise" className="hover:text-[#FFF1A6] transition-colors">Expertise</a>
            <a href="#skills" className="hover:text-[#FFF1A6] transition-colors">Skills</a>
            <a href="#projects" className="hover:text-[#FFF1A6] transition-colors">Projects</a>
            <a href="#contact" className="hover:text-[#FFF1A6] transition-colors">Contact</a>
          </nav>
        </div>

        {/* Middle Section: Socials, Email & Location */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs font-mono text-[#C9B8A8]">
          <div className="flex flex-wrap items-center gap-6">
            <a 
              href="https://www.linkedin.com/in/vithun-r" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('linkedin_click')}
              className="text-[#FFF1A6] hover:text-white transition-colors uppercase tracking-wider"
            >
              LinkedIn //
            </a>
            <a 
              href="https://github.com/Vithun10" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('github_click')}
              className="text-[#FFF1A6] hover:text-white transition-colors uppercase tracking-wider"
            >
              GitHub //
            </a>
            <a 
              href="https://github.com/Vithun10/BizOps_Projects" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('github_click')}
              className="text-[#FFF1A6] hover:text-white transition-colors uppercase tracking-wider"
            >
              BizOps Projects //
            </a>
            <a 
              href="mailto:vithun2701@gmail.com" 
              onClick={() => trackEvent('email_click')}
              className="hover:text-white transition-colors tracking-wider lowercase text-[#FFF1A6] font-semibold"
            >
              vithun2701@gmail.com
            </a>
          </div>

          <div className="text-[#C9B8A8] tracking-widest uppercase">
            LOCATION: BENGALURU, KARNATAKA, IN
          </div>
        </div>

        {/* Bottom Copyright & Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[#6B352A]/60 text-[11px] font-mono text-[#C9B8A8] uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Vithun TR. All Rights Reserved.</p>
          <p className="text-[#FFF1A6] font-bold">THE OPERATOR WHO CONNECTS BUSINESS REALITY WITH ANALYTICAL EVIDENCE.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
