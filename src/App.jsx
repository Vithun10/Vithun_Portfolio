import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NetflixPreloader from './components/NetflixPreloader';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-[#3B211B] min-h-screen text-[#F7EEDB] relative cursor-auto md:cursor-none selection:bg-[#6B352A] selection:text-[#FFF1A6]">
      {/* Vercel Web Analytics */}
      <Analytics />

      {/* Cinematic Preloader */}
      {loading && <NetflixPreloader onComplete={() => setLoading(false)} />}

      {/* Portfolio Sections */}
      <Hero />
      <About />
      <Expertise />
      <Skills />
      <Projects />
      <Contact />
      <Footer />

      {/* Global Mouse Hover Effects & Spotlight - Rendered after all sections to ensure topmost stacking */}
      <CustomCursor />
    </main>
  );
}

export default App;
