import './SoftPro.css';
import { heroPrimary, heroSecondary } from '@/brand';
import ShapeBlur from './ShapeBlur';
import GhostCursor from './GhostCursor';
import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' }
];

const Hero = () => {
  return (
    <>
      {/* Company Name Section */}
      <section className="softpro-hero relative min-h-screen pt-28 text-white">
        <div className="container mx-auto px-6">
          {/* Tag pills */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg:white/10 px-3 py-1 text-xs ring-1 ring-white/20">INNOVATIVE</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20">IT-SOLUTIONS</div>
            </div>
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20">PROGRAM</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20">PRODUCTS</div>
            </div>
          </div>

          {/* Main row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start softpro-grid">
            {/* Title across full width */}
            <div className="relative md:col-span-3">
              <div className="softpro-company-area relative">
                <div className="softpro-title-wrap relative">
                  <div className="softpro-title softpro-title--primary select-none">{heroPrimary}</div>
                  <div className="softpro-title softpro-title--secondary select-none">{heroSecondary}</div>
                  {/* Blur square on the right of the title */}
                  <div className="softpro-blur-right pointer-events-none">
                    <ShapeBlur
                      variation={0}
                      pixelRatioProp={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
                      shapeSize={0.7}
                      roundness={0.12}
                      borderSize={0.085}
                      circleSize={0.5}
                      circleEdge={1}
                      offsetX={0.08}
                      offsetY={0.0}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Left rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-red-400">✚</span>
                <span className="text-2xl font-semibold">4.9/5</span>
              </div>
              <p className="text-xs text-white/70 max-w-xs">
                The average rating of our quality and efficiency based on 1000+ completed projects
              </p>
            </div>

            {/* Right copy */}
            <div className="relative">
              <p className="text-sm text-white/80 max-w-sm">
                We create innovative software products that automate processes, optimize businesses, and enhance efficiency
              </p>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-24 flex items-center justify-center gap-4">
            <a href="#require-call" className="softpro-btn softpro-btn--primary">REQUIRE A CALL</a>
            <a href="#services" className="softpro-btn softpro-btn--secondary">SEE ALL SERVICES</a>
          </div>
        </div>
      </section>

      {/* Logo Loop Divider */}
      <div className="bg-black py-8">
        <div className="container mx-auto px-6">
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#0b0b0e"
            ariaLabel="Technology partners"
          />
        </div>
      </div>

      {/* Innovation Section - separate and black */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative rounded-xl ring-1 ring-white/10 overflow-hidden" style={{ height: 600 }}>
            <div className="absolute inset-0 z-10 flex items-center justify-center p-10">
              <div className="max-w-5xl text-center space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Innovation with Design, Modern UI Components & Complete Technology Solutions</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  We deliver refined, high-performance digital experiences across web, mobile, and AI-driven applications.
                  From intuitive interfaces to fully automated workflows, our team builds solutions that combine modern design,
                  accessible components, and thoughtful motion.
                </p>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  We undertake all kinds of projects — from small feature builds to large-scale enterprise systems — and ensure
                  reliable, on-time delivery every single time. Our expertise covers:
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-xs text-white/60">Web Applications</div>
                    <div className="text-sm text-white/90">React, Next.js, Vue, Angular, custom frameworks</div>
                  </div>
                  <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-xs text-white/60">Mobile Applications</div>
                    <div className="text-sm text-white/90">iOS, Android, cross-platform</div>
                  </div>
                  <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-xs text-white/60">AI Integrations & Automations</div>
                    <div className="text-sm text-white/90">Chatbots, ML models, process automation</div>
                  </div>
                  <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-xs text-white/60">Cloud & Backend Systems</div>
                    <div className="text-sm text-white/90">APIs, databases, scalable architecture</div>
                  </div>
                  <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-xs text-white/60">UI/UX Design Systems</div>
                    <div className="text-sm text-white/90">Modern components, micro-interactions, accessibility</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  With a focus on clarity, performance, and seamless user experiences, we help brands innovate faster and build
                  products that truly stand out.
                </p>
              </div>
            </div>
            {/* Cursor trail overlay */}
            <GhostCursor
              color="#B19EEF"
              brightness={0.35}
              edgeIntensity={0}
              trailLength={50}
              inertia={0.5}
              grainIntensity={0.05}
              bloomStrength={0.1}
              bloomRadius={1.0}
              bloomThreshold={0.025}
              fadeDelayMs={1000}
              fadeDurationMs={1500}
              zIndex={5}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;