import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #0c0b09; color: #e8e4dc; -webkit-font-smoothing: antialiased; }

:root {
  --gold: #c9a96e;
  --gold-light: #e8d5b0;
  --gold-dim: #8a6e45;
  --cream: #f5f0e8;
  --warm-black: #0c0b09;
  --warm-dark: #161410;
  --warm-mid: #2a2520;
  --warm-gray: #5a5248;
  --text-dim: #7a7268;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'DM Sans', sans-serif;
}

::selection { background: var(--gold); color: var(--warm-black); }

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--warm-black); }
::-webkit-scrollbar-thumb { background: var(--gold-dim); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideRight {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes grain {
  0%, 100% { transform: translate(0,0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
}

.grain-overlay::after {
  content: '';
  position: fixed;
  inset: -200%;
  width: 400%;
  height: 400%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
  animation: grain 0.5s steps(1) infinite;
}
`;

// ── Stat Counter ──────────────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onEnquire }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Story", "Gallery", "Amenities", "Pricing", "Location"];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        background: scrolled ? 'rgba(12,11,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
        padding: scrolled ? '0' : '0',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 2rem',
          height: scrolled ? '64px' : '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'height 0.4s ease',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
              <div style={{ width: '12px', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
            </div>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 400,
              color: 'var(--gold-light)', letterSpacing: '0.05em'
            }}>Horizon Heights</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 300,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(232,212,176,0.5)', textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--gold-light)'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,212,176,0.5)'}
              >{item}</a>
            ))}
          </div>

          {/* CTA */}
          <button onClick={onEnquire} style={{
            background: 'transparent', border: '1px solid var(--gold-dim)',
            color: 'var(--gold-light)', fontFamily: 'var(--sans)',
            fontSize: '0.65rem', fontWeight: 400, letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '10px 24px', cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--gold)'; e.target.style.borderColor = 'var(--gold)'; e.target.style.color = 'var(--warm-black)'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--gold-dim)'; e.target.style.color = 'var(--gold-light)'; }}
          >Register</button>
        </div>
      </nav>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [slide, setSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80",
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--warm-black)' }}>
      {slides.map((src, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          transition: 'opacity 1.5s cubic-bezier(0.4,0,0.2,1)',
          opacity: i === slide ? 1 : 0,
        }}>
          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: i === slide ? 'scale(1.03)' : 'scale(1)', transition: 'transform 6s ease-out' }} alt="" />
        </div>
      ))}

      {/* Multi-layer overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,11,9,0.3) 0%, rgba(12,11,9,0.1) 40%, rgba(12,11,9,0.85) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,11,9,0.6) 0%, transparent 60%)' }} />

      {/* Vertical text accent */}
      <div style={{
        position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
        fontFamily: 'var(--sans)', fontSize: '0.58rem', letterSpacing: '0.4em',
        textTransform: 'uppercase', color: 'rgba(201,169,110,0.4)',
        transformOrigin: 'center',
        animation: 'fadeIn 2s 1s both',
      }}>Bangalore · Whitefield · 2025</div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', right: '2rem', bottom: '160px',
        fontFamily: 'var(--sans)', fontSize: '0.65rem', color: 'rgba(201,169,110,0.5)',
        letterSpacing: '0.1em',
      }}>
        <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{String(slide + 1).padStart(2, '0')}</span>
        <span style={{ margin: '0 4px' }}>/</span>
        {String(slides.length).padStart(2, '0')}
      </div>

      {/* Slide dots */}
      <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            width: i === slide ? '2px' : '2px',
            height: i === slide ? '24px' : '10px',
            background: i === slide ? 'var(--gold)' : 'rgba(201,169,110,0.25)',
            border: 'none', cursor: 'pointer', borderRadius: '1px',
            transition: 'all 0.4s ease', padding: 0,
          }} />
        ))}
      </div>

      {/* Main Content */}
      <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1400px', padding: '0 2rem' }}>
        <div style={{ animation: 'fadeUp 1.2s 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.6 }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)' }}>Bangalore's Finest Address</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(4rem, 10vw, 9rem)',
            fontWeight: 300, color: 'var(--cream)', lineHeight: 0.9,
            letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--gold-light)' }}>Horizon</span>
            <span style={{ display: 'block' }}>Heights</span>
          </h1>

          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', fontWeight: 300, color: 'rgba(232,228,220,0.55)', maxWidth: '360px', lineHeight: 1.8, letterSpacing: '0.02em', marginBottom: '2.5rem' }}>
            3 & 4 BHK Sky Residences — where architecture meets artistry, in the heart of Whitefield.
          </p>
        </div>

        {/* Enquiry Bar */}
        <div style={{ animation: 'fadeUp 1.2s 0.6s both' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 0, background: 'rgba(22,20,16,0.9)',
            backdropFilter: 'blur(20px)', border: '1px solid rgba(201,169,110,0.15)',
            maxWidth: '720px',
          }}>
            {[{ label: 'Your Name', placeholder: 'Full Name' }, { label: 'Phone', placeholder: '+91 00000 00000' }, { label: 'Email', placeholder: 'you@email.com' }].map((field, i) => (
              <div key={i} style={{ padding: '16px 20px', borderRight: '1px solid rgba(201,169,110,0.1)' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '4px' }}>{field.label}</div>
                <input placeholder={field.placeholder} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: '0.8rem', width: '100%' }} />
              </div>
            ))}
            <button style={{
              background: 'var(--gold)', border: 'none', color: 'var(--warm-black)',
              fontFamily: 'var(--sans)', fontSize: '0.65rem', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 28px',
              cursor: 'pointer', transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
            onMouseLeave={e => e.target.style.background = 'var(--gold)'}
            >Enquire</button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'float 3s ease-in-out infinite' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.35)' }}>Scroll</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold-dim), transparent)' }} />
      </div>
    </section>
  );
}

// ── Section Wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)` }}>
      {children}
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionEyebrow({ label, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem' }}>
      <div style={{ width: '30px', height: '1px', background: 'var(--gold)', opacity: 0.7 }} />
      <span style={{
        fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.3em',
        textTransform: 'uppercase', color: light ? 'rgba(201,169,110,0.5)' : 'var(--gold-dim)'
      }}>{label}</span>
    </div>
  );
}

// ── Story Section ─────────────────────────────────────────────────────────────
function StorySection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const units = useCountUp(382, 1800, started);
  const acres = useCountUp(5, 1200, started);
  const floors = useCountUp(14, 1500, started);

  return (
    <section id="story" style={{ padding: '120px 0', background: 'var(--warm-black)' }} ref={ref}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-20px', left: '-20px',
                width: '200px', height: '200px',
                border: '1px solid rgba(201,169,110,0.1)',
                zIndex: 0,
              }} />
              <div style={{ position: 'relative', zIndex: 1, aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease', display: 'block' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  alt="Story" />
                {/* Gold corner accent */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60px', height: '60px', borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.4 }} />
              </div>

              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: '40px', right: '-30px', zIndex: 2,
                background: 'var(--warm-dark)', border: '1px solid rgba(201,169,110,0.2)',
                padding: '16px 24px', backdropFilter: 'blur(20px)',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>RERA</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '4px' }}>Registered</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <SectionEyebrow label="The Story" />
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '2rem' }}>
              Designed for those<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>who seek perfection</em>
            </h2>

            <div style={{ width: '60px', height: '1px', background: 'var(--gold)', opacity: 0.4, marginBottom: '2rem', animation: 'slideRight 1s 0.5s both', transformOrigin: 'left' }} />

            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', fontWeight: 300, color: 'rgba(232,228,220,0.55)', lineHeight: 2, marginBottom: '1.5rem' }}>
              Every great story has a setting. At Horizon Heights, we've created a setting that elevates your life's story to a new level of luxury, comfort, and tranquility — across 5 pristine acres.
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', fontWeight: 300, color: 'rgba(232,228,220,0.4)', lineHeight: 2, marginBottom: '3rem' }}>
              Designed by award-winning architects, the towers rise with quiet authority over the Bangalore skyline, offering views that stretch to the horizon.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '2rem' }}>
              {[
                { val: units, suffix: '', label: 'Residences' },
                { val: acres, suffix: '', label: 'Acres' },
                { val: `G+${floors}`, suffix: '', label: 'Floors', raw: true },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(201,169,110,0.1)' : 'none', padding: '0 1rem' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '3.5rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>
                    {stat.raw ? stat.val : stat.val}{stat.suffix}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Full-Bleed Quote Banner ───────────────────────────────────────────────────
function QuoteBanner() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--warm-dark)', padding: '100px 0', borderTop: '1px solid rgba(201,169,110,0.08)', borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} alt="" />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--warm-dark) 0%, rgba(22,20,16,0.7) 50%, var(--warm-dark) 100%)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '4rem', color: 'var(--gold)', opacity: 0.2, lineHeight: 1, marginBottom: '-1rem' }}>"</div>
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1,
            fontStyle: 'italic', maxWidth: '900px', margin: '0 auto 1.5rem',
          }}>
            Luxury is found in every detail,<br />every silence, every view.
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.4 }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-dim)' }}>Crafted for the discerning few</span>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.4 }} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function GallerySection() {
  const [hovered, setHovered] = useState(null);
  const images = [
    { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80", label: "Living Spaces", cols: '1 / 3', rows: '1 / 3' },
    { src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80", label: "Master Suite", cols: '3 / 4', rows: '1 / 2' },
    { src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80", label: "Kitchen", cols: '3 / 4', rows: '2 / 3' },
    { src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=900&q=80", label: "Clubhouse", cols: '1 / 3', rows: '3 / 4' },
    { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80", label: "Pool Deck", cols: '3 / 4', rows: '3 / 4' },
  ];

  return (
    <section id="gallery" style={{ padding: '120px 0', background: 'var(--warm-black)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <SectionEyebrow label="Gallery" />
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: '3rem', lineHeight: 1.1 }}>
            A glimpse of<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>elegance</em>
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 220px)', gap: '6px' }}>
          {images.map((img, i) => (
            <div key={i} style={{ gridColumn: img.cols, gridRow: img.rows, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)', transform: hovered === i ? 'scale(1.06)' : 'scale(1)' }} alt={img.label} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,11,9,0.5)', opacity: hovered === i ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--cream)' }}>{img.label}</span>
              </div>
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', border: '1px solid rgba(201,169,110,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered === i ? 1 : 0, transition: 'opacity 0.4s ease', color: 'var(--gold-light)', fontSize: '16px' }}>+</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Amenities ─────────────────────────────────────────────────────────────────
function AmenitiesSection() {
  const amenities = [
    { icon: "◈", title: "Infinity Pool", desc: "25m temperature-controlled pool with city views", highlight: true },
    { icon: "◉", title: "Fitness Center", desc: "Technogym equipment & personal trainers" },
    { icon: "◌", title: "Zen Garden", desc: "Landscaped meditation & reflection zones" },
    { icon: "◈", title: "Private Theatre", desc: "40-seat Dolby Atmos screening room" },
    { icon: "◉", title: "Smart Homes", desc: "Full Crestron home automation system" },
    { icon: "◌", title: "IGBC Platinum", desc: "Sustainability certified green building" },
    { icon: "◈", title: "Co-Working Hub", desc: "Private cabins with high-speed connectivity" },
    { icon: "◉", title: "Concierge", desc: "24/7 dedicated lifestyle management" },
  ];

  return (
    <section id="amenities" style={{ padding: '120px 0', background: 'var(--warm-dark)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
          <Reveal>
            <div style={{ position: 'sticky', top: '100px' }}>
              <SectionEyebrow label="Amenities" />
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
                Curated for an<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>exceptional life</em>
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 300, color: 'rgba(232,228,220,0.4)', lineHeight: 2 }}>
                Over 20,000 sq.ft of world-class amenities, designed to fulfil every facet of the modern luxury lifestyle.
              </p>

              <div style={{ position: 'relative', marginTop: '3rem', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} alt="Pool" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--warm-dark) 0%, transparent 60%)' }} />
              </div>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            {amenities.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{
                  padding: '2rem', background: 'rgba(22,20,16,0.5)',
                  border: '1px solid rgba(201,169,110,0.06)',
                  transition: 'all 0.4s ease', cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.04)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,20,16,0.5)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.06)'; }}
                >
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '1rem', opacity: 0.7 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--cream)', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(232,228,220,0.35)', lineHeight: 1.7 }}>{item.desc}</p>
                  <div style={{ marginTop: '1rem', width: '20px', height: '1px', background: 'var(--gold)', opacity: 0.3 }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function PricingSection({ onEnquire }) {
  const [active, setActive] = useState(1);
  const units = [
    { type: "3 BHK Classic", size: "1,850 sq.ft", price: "₹4.5 Cr", tag: null },
    { type: "3 BHK Premium", size: "2,100 sq.ft", price: "₹5.2 Cr", tag: "Popular" },
    { type: "4 BHK Penthouse", size: "3,500 sq.ft", price: "₹8.5 Cr", tag: "Exclusive" },
  ];

  return (
    <section id="pricing" style={{ padding: '120px 0', background: 'var(--warm-black)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <SectionEyebrow label="Pricing" />
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05 }}>
                Transparent<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>pricing</em>
              </h2>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '220px', textAlign: 'right', lineHeight: 1.8, fontWeight: 300 }}>
              All prices include GST and registration charges. Flexible payment plans available.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {units.map((unit, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                onClick={() => setActive(i)}
                style={{
                  padding: '2.5rem', cursor: 'pointer',
                  background: active === i ? 'rgba(201,169,110,0.06)' : 'rgba(22,20,16,0.5)',
                  border: active === i ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(201,169,110,0.05)',
                  transition: 'all 0.4s ease', position: 'relative',
                }}>
                {unit.tag && (
                  <div style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                    fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'var(--warm-black)',
                    background: 'var(--gold)', padding: '3px 10px',
                  }}>{unit.tag}</div>
                )}
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>{unit.size}</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--cream)', marginBottom: '1.5rem' }}>{unit.type}</h3>
                <div style={{ height: '1px', background: 'rgba(201,169,110,0.1)', marginBottom: '1.5rem' }} />
                <div style={{ fontFamily: 'var(--serif)', fontSize: '2.8rem', fontWeight: 300, color: active === i ? 'var(--gold)' : 'var(--cream)', lineHeight: 1, marginBottom: '2rem' }}>{unit.price}</div>
                <button onClick={(e) => { e.stopPropagation(); onEnquire(); }} style={{
                  width: '100%', padding: '12px', fontFamily: 'var(--sans)',
                  fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  background: active === i ? 'var(--gold)' : 'transparent',
                  color: active === i ? 'var(--warm-black)' : 'var(--gold-dim)',
                  border: active === i ? '1px solid var(--gold)' : '1px solid rgba(201,169,110,0.2)',
                  cursor: 'pointer', transition: 'all 0.3s',
                  fontWeight: active === i ? 500 : 300,
                }}>
                  Request Details
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Floor Plans ───────────────────────────────────────────────────────────────
function FloorPlanSection({ onEnquire }) {
  const [active, setActive] = useState(0);
  const plans = [
    { title: "3 BHK Classic", area: "1,850 sq.ft", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80" },
    { title: "3 BHK Premium", area: "2,100 sq.ft", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80" },
    { title: "4 BHK Penthouse", area: "3,500 sq.ft", img: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=700&q=80" },
  ];

  return (
    <section id="floor-plans" style={{ padding: '120px 0', background: 'var(--warm-dark)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <SectionEyebrow label="Floor Plans" />
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: '3rem', lineHeight: 1.05 }}>
            Layouts that<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>inspire</em>
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4px' }}>
          {/* Left: Tab selectors */}
          <div>
            {plans.map((plan, i) => (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '2rem 2.5rem',
                background: active === i ? 'rgba(201,169,110,0.05)' : 'transparent',
                borderLeft: active === i ? '2px solid var(--gold)' : '2px solid rgba(201,169,110,0.1)',
                cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '2px',
              }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: active === i ? 'var(--cream)' : 'rgba(232,228,220,0.4)', transition: 'color 0.3s' }}>{plan.title}</h4>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: active === i ? 'var(--gold-dim)' : 'rgba(90,82,72,0.5)', marginTop: '4px', fontWeight: 300 }}>{plan.area}</p>
              </div>
            ))}

            <button onClick={onEnquire} style={{
              marginTop: '2rem', padding: '14px 32px',
              background: 'transparent', border: '1px solid rgba(201,169,110,0.25)',
              color: 'var(--gold-light)', fontFamily: 'var(--sans)',
              fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', fontWeight: 300, transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--warm-black)'; e.target.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold-light)'; e.target.style.borderColor = 'rgba(201,169,110,0.25)'; }}
            >
              Download Floor Plans
            </button>
          </div>

          {/* Right: Image */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: active === i ? 1 : 0 }}>
                <img src={plan.img} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} alt={plan.title} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,11,9,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--cream)', fontWeight: 300 }}>{plan.title}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: 'var(--gold)', marginTop: '4px', letterSpacing: '0.1em' }}>{plan.area}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Location ──────────────────────────────────────────────────────────────────
function LocationSection() {
  const landmarks = [
    { name: "Manyata Tech Park", dist: "8 km" },
    { name: "ITPL", dist: "4 km" },
    { name: "Phoenix Marketcity", dist: "6 km" },
    { name: "International Airport", dist: "35 km" },
    { name: "Indiranagar", dist: "14 km" },
  ];

  return (
    <section id="location" style={{ padding: '120px 0', background: 'var(--warm-black)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          <Reveal>
            <SectionEyebrow label="Location" />
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: '2rem', lineHeight: 1.05 }}>
              Strategic<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>connectivity</em>
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 300, color: 'rgba(232,228,220,0.4)', lineHeight: 2, marginBottom: '3rem' }}>
              Located on Whitefield Main Road — at the intersection of Bangalore's most vibrant tech, retail, and lifestyle corridors.
            </p>

            {landmarks.map((lm, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.5 }} />
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(232,228,220,0.6)' }}>{lm.name}</span>
                </div>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--gold)', fontStyle: 'italic' }}>{lm.dist}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15552.3!2d77.748!3d12.971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1329f12c7541%3A0x8d02e2e8d4d3e82!2sWhitefield%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="480"
                style={{ display: 'block', filter: 'grayscale(100%) invert(100%) contrast(80%) brightness(60%)', border: 'none', borderTop: '1px solid rgba(201,169,110,0.15)' }}
                loading="lazy" title="Location" />
              {/* Pin */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-ring 2s ease-out infinite', width: '20px', height: '20px' }} />
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold)', border: '3px solid var(--warm-black)', position: 'relative' }} />
              </div>

              {/* Address overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem', background: 'linear-gradient(to top, rgba(12,11,9,0.95) 0%, transparent 100%)' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '4px' }}>Site Address</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'rgba(232,228,220,0.7)', fontWeight: 300 }}>Whitefield Main Road, Bangalore — 560066</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactSection({ onEnquire }) {
  return (
    <section style={{ padding: '120px 0', background: 'var(--warm-dark)', borderTop: '1px solid rgba(201,169,110,0.08)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <Reveal>
            <SectionEyebrow label="Visit Us" />
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: '3rem', lineHeight: 1.05 }}>
              The experience<br /><em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>awaits you</em>
            </h2>

            {[
              { icon: '◈', title: 'Site Address', lines: ['Whitefield Main Road', 'Bangalore — 560066, Karnataka'] },
              { icon: '◉', title: 'Sales', lines: ['+91 98765 43210', '+91 91234 56789'] },
              { icon: '◌', title: 'Email', lines: ['info@horizonheights.com'] },
            ].map((contact, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '1rem', marginTop: '2px', opacity: 0.6 }}>{contact.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>{contact.title}</div>
                  {contact.lines.map((line, j) => (
                    <div key={j} style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 300, color: 'rgba(232,228,220,0.6)', lineHeight: 1.8 }}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ background: 'var(--warm-black)', border: '1px solid rgba(201,169,110,0.12)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
              {/* Corner accent */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderBottom: '1px solid rgba(201,169,110,0.15)', borderLeft: '1px solid rgba(201,169,110,0.15)' }} />

              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.5rem' }}>Schedule a Visit</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '2.5rem', fontWeight: 300 }}>Experience the grandeur of a private viewing.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {['Full Name', 'Phone Number', 'Email Address'].map(ph => (
                  <div key={ph} style={{ borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '0.75rem', position: 'relative' }}>
                    <input placeholder={ph} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 300, width: '100%' }} />
                  </div>
                ))}

                <button onClick={onEnquire} style={{
                  width: '100%', padding: '14px', marginTop: '0.5rem',
                  background: 'var(--gold)', border: 'none',
                  color: 'var(--warm-black)', fontFamily: 'var(--sans)',
                  fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em',
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.3s',
                }}
                onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
                onMouseLeave={e => e.target.style.background = 'var(--gold)'}
                >
                  Book Appointment
                </button>
                <p style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>We respect your privacy.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <div style={{ position: 'sticky', top: '80px', padding: '2.5rem', background: 'var(--warm-dark)', borderLeft: '1px solid rgba(201,169,110,0.08)', height: 'calc(100vh - 80px)', overflow: 'auto' }}>
      <div style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Starting From</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>₹4.5 Cr</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {['Full Name', 'Email', 'Phone'].map(ph => (
          <div key={ph} style={{ borderBottom: '1px solid rgba(201,169,110,0.12)', paddingBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>{ph}</div>
            <input placeholder={`Enter ${ph}`} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: '0.78rem', fontWeight: 300, width: '100%' }} />
          </div>
        ))}
      </div>

      <button style={{
        width: '100%', padding: '13px',
        background: 'var(--gold)', border: 'none',
        color: 'var(--warm-black)', fontFamily: 'var(--sans)',
        fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.22em',
        textTransform: 'uppercase', cursor: 'pointer', marginBottom: '2rem',
      }}>Request Brochure</button>

      <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '2rem' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>Speak to an Expert</div>
        <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--cream)' }}>
          <div style={{ width: '36px', height: '36px', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📞</div>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', fontWeight: 300, color: 'rgba(232,228,220,0.7)' }}>+91 98765 43210</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '2px' }}>Available 9am – 8pm</div>
          </div>
        </a>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    "Project": ["Overview", "Pricing", "Floor Plans", "Gallery"],
    "Company": ["About", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };

  return (
    <footer style={{ background: '#080706', borderTop: '1px solid rgba(201,169,110,0.08)', padding: '80px 0 40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ width: '18px', height: '1px', background: 'var(--gold)' }} />
                <div style={{ width: '10px', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
              </div>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--gold-light)' }}>Horizon Heights</span>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--text-dim)', lineHeight: 1.9, marginBottom: '1.5rem', maxWidth: '260px' }}>
              Redefining luxury living in the heart of Bangalore's tech corridor, Whitefield.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Fb', 'Tw', 'In', 'Li'].map(s => (
                <a key={s} href="#" style={{
                  width: '32px', height: '32px', border: '1px solid rgba(201,169,110,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--sans)', fontSize: '0.6rem', color: 'var(--text-dim)',
                  textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                >{s}</a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1.5rem' }}>{group}</div>
              <ul style={{ listStyle: 'none' }}>
                {items.map(item => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <a href="#" style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold-light)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(201,169,110,0.06)', paddingTop: '2rem' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', color: 'rgba(90,82,72,0.5)', fontWeight: 300 }}>© 2025 Horizon Heights. All Rights Reserved.</p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', color: 'rgba(90,82,72,0.35)', fontWeight: 300 }}>RERA Reg. No. PRM/KA/RERA/1251/308/PR/021</p>
        </div>
      </div>
    </footer>
  );
}

// ── Enquiry Modal ─────────────────────────────────────────────────────────────
function Modal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,7,6,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.3s ease' }} onClick={onClose}>
      <div style={{ background: 'var(--warm-dark)', width: '100%', maxWidth: '520px', position: 'relative', border: '1px solid rgba(201,169,110,0.15)' }} onClick={e => e.stopPropagation()}>
        {/* Top bar */}
        <div style={{ height: '2px', background: 'linear-gradient(to right, var(--gold-dim), var(--gold), var(--gold-dim))' }} />

        <div style={{ padding: '3rem' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>

          <SectionEyebrow label="Enquire Now" />
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.5rem' }}>Register Interest</h3>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '2.5rem', fontWeight: 300 }}>Our team will reach out within 24 hours.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {['Full Name', 'Phone Number', 'Email Address'].map(ph => (
              <div key={ph} style={{ borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '0.75rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>{ph}</div>
                <input placeholder={`Enter your ${ph.toLowerCase()}`} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: '0.85rem', fontWeight: 300, width: '100%' }} />
              </div>
            ))}

            <button style={{
              width: '100%', padding: '15px',
              background: 'var(--gold)', border: 'none',
              color: 'var(--warm-black)', fontFamily: 'var(--sans)',
              fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>Submit Enquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Auto Popup ────────────────────────────────────────────────────────────────
function AutoPopup({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,7,6,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.5s ease' }} onClick={onClose}>
      <div style={{ background: 'var(--warm-dark)', width: '100%', maxWidth: '780px', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid rgba(201,169,110,0.12)', position: 'relative' }} onClick={e => e.stopPropagation()}>
        {/* Left: image */}
        <div style={{ position: 'relative', minHeight: '400px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,11,9,0.9) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)', marginBottom: '8px' }}>Limited Preview</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05 }}>Exclusive<br /><em style={{ color: 'var(--gold-light)' }}>Access</em></h3>
          </div>
        </div>

        {/* Right: form */}
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--warm-black)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>

          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 300, color: 'var(--text-dim)', marginBottom: '2rem', lineHeight: 1.8 }}>
            Be first to receive floor plans, pricing, and preview invitations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {['Full Name', 'Phone Number'].map(ph => (
              <div key={ph} style={{ borderBottom: '1px solid rgba(201,169,110,0.12)', paddingBottom: '0.75rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>{ph}</div>
                <input placeholder={`Enter ${ph.toLowerCase()}`} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 300, width: '100%' }} />
              </div>
            ))}
          </div>

          <button style={{
            width: '100%', padding: '13px',
            background: 'var(--gold)', border: 'none',
            color: 'var(--warm-black)', fontFamily: 'var(--sans)',
            fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.22em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Get Early Access</button>
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [modal, setModal] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAutoPopup(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grain-overlay">
      <style>{FONTS}</style>

      <Navbar onEnquire={() => setModal(true)} />
      <Hero />

      {/* Layout with sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', maxWidth: '100%' }}>
        <div>
          <StorySection />
          <QuoteBanner />
          <GallerySection />
          <AmenitiesSection />
          <PricingSection onEnquire={() => setModal(true)} />
          <FloorPlanSection onEnquire={() => setModal(true)} />
          <LocationSection />
          <ContactSection onEnquire={() => setModal(true)} />
        </div>
        <div style={{ display: 'none' }} className="sidebar-container">
          <Sidebar />
        </div>
      </div>

      <Footer />

      <Modal open={modal} onClose={() => setModal(false)} />
      <AutoPopup open={autoPopup} onClose={() => setAutoPopup(false)} />

      {/* Floating mobile CTA */}
      <button onClick={() => setModal(true)} style={{
        position: 'fixed', bottom: '1.5rem', left: '1rem', right: '1rem',
        padding: '15px', background: 'var(--gold)', border: 'none',
        color: 'var(--warm-black)', fontFamily: 'var(--sans)',
        fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.22em',
        textTransform: 'uppercase', cursor: 'pointer', zIndex: 50,
        display: 'none',
      }} id="mobile-cta">Enquire Now</button>

      <style>{`
        @media (max-width: 768px) {
          #mobile-cta { display: block !important; }
        }
        @media (min-width: 1024px) {
          .sidebar-container { display: block !important; }
        }
      `}</style>
    </div>
  );
}