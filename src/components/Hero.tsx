import './SoftPro.css';
import { heroPrimary, heroSecondary } from '@/brand';
import ShapeBlur from './ShapeBlur';
import GhostCursor from './GhostCursor';

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
                      borderSize={0.06}
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

      {/* Innovation Section - separate and black */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative rounded-xl ring-1 ring-white/10 overflow-hidden" style={{ height: 600 }}>
            <div className="absolute inset-0 p-8 z-10">
              <h3 className="text-2xl font-semibold mb-3">Innovation with Design & Modern UI Components</h3>
              <p className="text-sm text-white/80 max-w-2xl">
                We deliver refined, modern interfaces built with thoughtful motion and accessible components — always on time.
                Our design system emphasizes clarity, performance, and delightful micro-interactions that elevate your brand.
              </p>
            </div>
            {/* Cursor trail overlay */}
            <GhostCursor
              color="#B19EEF"
              brightness={1}
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