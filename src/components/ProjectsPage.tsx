import React, { useMemo, useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  BeakerIcon,
  CpuChipIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  CloudIcon,
  PaintBrushIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface ProjectItem {
  slug: string;
  title: string;
  price: number;
  includesCertificate: boolean;
  image: string;
  tech: string[];
  category: CategoryKey;
}

// Sidebar categories inspired by your screenshot
type CategoryKey =
  | 'popular'
  | 'ai_ml'
  | 'data_science'
  | 'gen_ai'
  | 'management'
  | 'software_tech'
  | 'doctorate'
  | 'microsoft'
  | 'ev_design'
  | 'cloud'
  | 'design';

const CATEGORIES: { key: CategoryKey; label: string; Icon: React.FC<any> }[] = [
  { key: 'popular', label: 'Popular Projects', Icon: StarIcon },
  { key: 'ai_ml', label: 'AI & Machine Learning', Icon: CpuChipIcon },
  { key: 'data_science', label: 'Data Science & Analytics', Icon: BeakerIcon },
  { key: 'gen_ai', label: 'Generative AI', Icon: CommandLineIcon },
  { key: 'management', label: 'Management', Icon: BuildingOffice2Icon },
  { key: 'software_tech', label: 'Software & Tech', Icon: RocketLaunchIcon },
  { key: 'doctorate', label: 'Doctorate', Icon: AcademicCapIcon },
  { key: 'microsoft', label: 'Microsoft Programs', Icon: BuildingOffice2Icon },
  { key: 'ev_design', label: 'EV Design', Icon: RocketLaunchIcon },
  { key: 'cloud', label: 'Cloud Computing', Icon: CloudIcon },
  { key: 'design', label: 'Design', Icon: PaintBrushIcon }
];

// Category-specific local images (last-resort)
const CATEGORY_IMAGES: Record<CategoryKey, string> = {
  popular: '/img/sample-product.svg',
  ai_ml: '/img/agents-practical.svg',
  data_science: '/img/agents-gallery-2.svg',
  gen_ai: '/img/claude-sonnet-4.svg',
  management: '/img/trading-setup.svg',
  software_tech: '/img/devops/devops-lifecycle.svg',
  doctorate: '/img/trading-ethics.svg',
  microsoft: '/img/claude-prompt-format.svg',
  ev_design: '/img/agents-gallery-1.svg',
  cloud: '/img/agents-workflow.svg',
  design: '/img/agents-gallery-1.svg'
};

// Build a keyword query from title/slug for external images
const toQuery = (s: string) => s
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ',');

// Project-specific keyword overrides for better relevance
const PROJECT_IMAGE_KEYWORDS: Record<string, string> = {
  'car-rental-booking': 'car,rental,booking,vehicle,road,travel',
  'clg-can': 'college,campus,university,students,education',
  'hostel-man': 'hostel,dormitory,rooms,student,accommodation',
  'resumeai': 'resume,curriculum,cv,document,ai',
  'ai-cs-chatbot': 'chatbot,conversation,assistant,terminal,ai',
  'ai-crop-suggestion': 'agriculture,farm,crops,soil,analysis',
  'url-shoter': 'link,shortener,url,web,address',
  'bmi-caliculator': 'fitness,health,body,scale,calculator',
  'qr-code': 'qr,barcode,scan,pattern',
  'qr-multi-generator': 'qr,code,generator,create',
  'research-paper-summirizer': 'research,paper,documents,science,summary',
  'habbit-tracker': 'habit,tracker,calendar,goals,journal',
  'pdf-text-extractor': 'pdf,document,text,extract,parser',
  'auto-newsletter': 'newsletter,email,marketing,template',
  'currency': 'currency,exchange,money,finance,rate',
  'smart-automated-time-table-generator': 'schedule,timetable,calendar,automation',
  'ai-quote-generator': 'quote,typography,inspiration,ai'
};

// Curated image URLs for precise relevance (stable CDNs)
const PROJECT_IMAGE_URLS: Record<string, string> = {
  'car-rental-booking': 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'clg-can': 'https://images.pexels.com/photos/1679825/pexels-photo-1679825.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'hostel-man': 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'resumeai': 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'ai-cs-chatbot': 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'ai-crop-suggestion': 'https://images.pexels.com/photos/2736135/pexels-photo-2736135.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'url-shoter': 'https://images.pexels.com/photos/267447/pexels-photo-267447.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'bmi-caliculator': 'https://images.pexels.com/photos/36756/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'qr-code': '/img/qr.png',
  'qr-multi-generator': '/img/qr.png',
  'research-paper-summirizer': 'https://images.pexels.com/photos/590544/pexels-photo-590544.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'habbit-tracker': 'https://images.pexels.com/photos/669986/pexels-photo-669986.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'pdf-text-extractor': 'https://images.pexels.com/photos/261621/pexels-photo-261621.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'auto-newsletter': 'https://images.pexels.com/photos/261628/pexels-photo-261628.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'currency': 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'smart-automated-time-table-generator': 'https://images.pexels.com/photos/395223/pexels-photo-395223.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'ai-quote-generator': 'https://images.pexels.com/photos/1409632/pexels-photo-1409632.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
};

// Resolve image: curated first, then API/fallbacks
const getImageForProject = (p: ProjectItem, imageMap: Record<string,string>) => {
  return PROJECT_IMAGE_URLS[p.slug] || imageMap[p.slug] || getFallbackImageForProject(p);
};

// Optional Unsplash API key (set VITE_UNSPLASH_ACCESS_KEY in .env)
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

// Deterministic seed helper
const hashToNumber = (s: string) => Array.from(s).reduce((acc, ch) => ((acc * 31) + ch.charCodeAt(0)) >>> 0, 0) % 1000;

// Build keywords for fetching images
const buildKeywords = (p: ProjectItem) => PROJECT_IMAGE_KEYWORDS[p.slug] || toQuery(p.title || p.slug);

// Fallback provider: targeted keywords via LoremFlickr
const getFallbackImageForProject = (p: ProjectItem) => {
  const sizePath = '800/500';
  const keywords = buildKeywords(p);
  return `https://loremflickr.com/${sizePath}/${keywords}`;
};

const currencyFormat = (n: number) => `${n.toLocaleString('en-IN')} rupees`;

// Catalog with category mapping (heuristic based on title)
const CATALOG: ProjectItem[] = [
  { slug: 'car-rental-booking', title: 'Car Rental Booking', price: 6000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['React', 'Node', 'MongoDB'], category: 'software_tech' },
  { slug: 'clg-can', title: 'clg-can', price: 6000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['React', 'Express', 'MySQL'], category: 'software_tech' },
  { slug: 'hostel-man', title: 'hostel_man', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['Vue', 'Firebase'], category: 'software_tech' },
  { slug: 'resumeai', title: 'resumeai', price: 5000, includesCertificate: true, image: CATEGORY_IMAGES['gen_ai'], tech: ['Next.js', 'OpenAI API'], category: 'gen_ai' },
  { slug: 'ai-cs-chatbot', title: 'ai-cs-chatbot', price: 4500, includesCertificate: true, image: CATEGORY_IMAGES['gen_ai'], tech: ['Python', 'FastAPI', 'LLM'], category: 'gen_ai' },
  { slug: 'ai-crop-suggestion', title: 'ai-crop-suggestion', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['ai_ml'], tech: ['Django', 'ML'], category: 'ai_ml' },
  { slug: 'url-shoter', title: 'url shoter', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['Node', 'Redis'], category: 'software_tech' },
  { slug: 'bmi-caliculator', title: 'BMI caliculator', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['React', 'Tailwind'], category: 'software_tech' },
  { slug: 'qr-code', title: 'qr code', price: 4000, includesCertificate: true, image: '/img/qr.png', tech: ['React', 'Canvas'], category: 'software_tech' },
  { slug: 'qr-multi-generator', title: 'qr-multi-generator', price: 4000, includesCertificate: true, image: '/img/qr.png', tech: ['Vue', 'Canvas'], category: 'software_tech' },
  { slug: 'research-paper-summirizer', title: 'research paper summirizer', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['data_science'], tech: ['Python', 'NLP'], category: 'data_science' },
  { slug: 'habbit-tracker', title: 'habbit tracker', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['design'], tech: ['React Native'], category: 'design' },
  { slug: 'pdf-text-extractor', title: 'pdf text extractor', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['Node', 'PDF.js'], category: 'software_tech' },
  { slug: 'auto-newsletter', title: 'auto_newsletter', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['Next.js', 'SendGrid'], category: 'software_tech' },
  { slug: 'currency', title: 'currency', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['software_tech'], tech: ['React', 'REST API'], category: 'software_tech' },
  { slug: 'smart-automated-time-table-generator', title: 'Smart Automated Time-Table Generator', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['management'], tech: ['Python', 'Algorithm'], category: 'management' },
  { slug: 'ai-quote-generator', title: 'ai_quote_generator', price: 4000, includesCertificate: true, image: CATEGORY_IMAGES['gen_ai'], tech: ['Next.js', 'LLM'], category: 'gen_ai' }
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [activeCat, setActiveCat] = useState<CategoryKey>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const base = activeCat === 'popular' ? CATALOG : CATALOG.filter(p => p.category === activeCat);
    if (!searchQuery) return base;
    return base.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeCat, searchQuery]);

  // Fetch relevant images from Unsplash if a key is configured
  useEffect(() => {
    if (!UNSPLASH_KEY) return;
    const controller = new AbortController();
    const fetchFor = async (p: ProjectItem) => {
      const q = buildKeywords(p);
      try {
        const resp = await fetch(
          `https://api.unsplash.com/photos/random?orientation=landscape&content_filter=high&query=${encodeURIComponent(q)}&client_id=${UNSPLASH_KEY}`,
          { signal: controller.signal }
        );
        if (!resp.ok) throw new Error('unsplash failed');
        const data = await resp.json();
        const raw = (data.urls && (data.urls.raw || data.urls.regular || data.urls.small)) || '';
        if (raw) {
          const url = `${raw}${raw.includes('?') ? '' : '?'}&w=800&h=500&fit=crop&q=80`;
          setImageMap(prev => ({ ...prev, [p.slug]: url }));
        }
      } catch (e) {
        // ignore and rely on fallback
      }
    };
    CATALOG.forEach(fetchFor);
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="w-full px-0">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-white/5">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-white/80">Categories</h2>
                </div>
                <nav className="p-2">
                  {CATEGORIES.map(({ key, label, Icon }) => {
                    const active = key === activeCat;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCat(key)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left mb-1 border transition ${
                          active ? 'bg-white/15 border-white/30' : 'bg-transparent border-transparent hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-white/70" />
                          <span className="text-sm">{label}</span>
                        </span>
                        {active && <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-400/30">Selected</span>}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <section className="col-span-12 lg:col-span-9">
            {/* Search Bar */}
            <div className="mb-4 flex gap-2">
              <input
                className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const imgSrc = imageMap[item.slug] || getFallbackImageForProject(item);
                return (
                  <div key={item.slug} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition">
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-64 object-cover border-b border-white/10"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const sig = hashToNumber(item.slug);
                        e.currentTarget.src = `https://picsum.photos/seed/${item.slug}-${sig}/800/500`;
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tech.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">{t}</span>
                        ))}
                      </div>
                      {item.includesCertificate && (
                        <div className="mt-3 text-xs px-2 py-1 rounded-full inline-block bg-green-600/20 text-green-300 border border-green-500/30">Internship certificate</div>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-white/80">{currencyFormat(item.price)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart({ slug: item.slug, title: item.title, image: imgSrc, tech: item.tech, price: item.price, certificate: 'with' })}
                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >Add to Cart</button>
                          <button
                            onClick={() => navigate(`/projects/${item.slug}`)}
                            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15"
                          >View Project</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-white/70 text-sm">No projects found for this category.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;