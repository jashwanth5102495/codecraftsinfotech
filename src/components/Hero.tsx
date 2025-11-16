import { useRef } from 'react';
import { motion } from 'framer-motion';
// import RotatingBackgrounds from './backgrounds/RotatingBackgrounds';
import VariableProximity from './VariableProximity';
import RotatingText from './RotatingText';
import ColorBends from './ColorBends';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero-section" className="bg-black min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* New Background: ColorBends */}
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={30}
        speed={0.3}
        scale={1.2}
        frequency={1.4}
        warpStrength={1.2}
        mouseInfluence={0.8}
        parallax={0.6}
        noise={0.08}
        transparent
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 hero-overlay"></div>

      <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main heading with Company Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <VariableProximity
            label="CodeCrafts Infotech"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 800, 'opsz' 40"
            containerRef={containerRef as unknown as React.RefObject<HTMLElement>}
            radius={80}
            falloff="gaussian"
            style={{ color: 'white' }}
          />
        </h1>

        {/* Creative Text with Rotating Words */}
        <div className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight flex items-center justify-center gap-3">
          <span>Creative</span>
          <RotatingText
            texts={['thinking', 'design', 'development', 'solutions', 'innovation']}
          />
        </div>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Building reliable, modern experiences with clean design and performance-first engineering.
        </p>
      </div>
    </section>
  );
};

export default Hero;