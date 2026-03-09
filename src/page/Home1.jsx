import { useState, useEffect, useRef } from "react";

/* ─── Breakpoints ───────────────────────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

function useBreakpoint() {
  const { w } = useWindowSize();
  return {
    w,
    isXs: w < 480,
    isSm: w >= 480 && w < 640,
    isMd: w >= 640 && w < 900,
    isLg: w >= 900 && w < 1200,
    isXl: w >= 1200,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 900,
    isDesktop: w >= 900,
    isWide: w >= 1200,
  };
}

/* ─── Active Section Hook ─────────────────────────────────────────────── */
function useActiveSection(sections) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return active;
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Poppins:wght@200;300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #ffffff; color: #1a1a2e; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
:root {
  --primary: #2E3D72;
  --primary-light: #4a5a9e;
  --primary-dim: #8892be;
  --secondary: #9D323F;
  --secondary-light: #c45060;
  --secondary-dim: #c47880;
  --white: #ffffff;
  --off-white: #f7f8fc;
  --light-bg: #eef0f7;
  --text-dark: #1a1a2e;
  --text-mid: #4a4a6a;
  --text-dim: #9090b0;
  --serif: 'Libre Baskerville', 'Baskerville', 'Georgia', serif;
  --sans: 'Poppins', sans-serif;
  --nav-h: 80px;
}
::selection { background: var(--primary); color: var(--white); }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--off-white); }
::-webkit-scrollbar-thumb { background: var(--primary-dim); }
input::placeholder { color: rgba(46,61,114,0.3); }
input { caret-color: var(--primary); }

@keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes pulse-ring { 0% { transform:scale(0.8); opacity:1; } 100% { transform:scale(2.5); opacity:0; } }
@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes primaryPulse { 0%,100% { opacity:.3; } 50% { opacity:.7; } }
@keyframes amenityLine { from { width: 0; } to { width: 100%; } }
@keyframes navUnderlineIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes navDotPop { 0% { transform: scale(0); opacity:0; } 60% { transform: scale(1.4); opacity:1; } 100% { transform: scale(1); opacity:1; } }
@keyframes featureFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }

.container { max-width: 1400px; margin: 0 auto; width: 100%; }

@media (max-width: 639px) {
  input, button, a { -webkit-tap-highlight-color: transparent; }
  button { touch-action: manipulation; }
  * { -webkit-text-size-adjust: 100%; }
}
@supports (padding: max(0px)) {
  .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
}

.amenity-card:hover .amenity-line { animation: amenityLine 0.5s ease forwards; }
.amenity-card .amenity-line { width: 0; height: 1px; background: var(--primary); transition: width 0.5s ease; }
.amenity-card:hover { background: rgba(46,61,114,.06) !important; border-color: rgba(46,61,114,.25) !important; }
.amenity-card:hover .amenity-num { opacity: 1 !important; }
.amenity-card:hover .amenity-icon-bg { transform: scale(1.1); background: rgba(46,61,114,.12) !important; }

.landmark-row:hover { background: rgba(46,61,114,.04) !important; }
.landmark-row:hover .landmark-dist { color: var(--primary) !important; transform: translateX(4px); }
.landmark-row .landmark-dist { transition: color .3s, transform .3s; }

.price-row:hover { background: rgba(46,61,114,.04) !important; }
.details-btn:hover { background: var(--primary) !important; color: var(--white) !important; }
.price-config-tab:hover { background: rgba(46,61,114,.08) !important; }
.price-config-tab.active { background: rgba(46,61,114,.12) !important; border-color: rgba(46,61,114,.4) !important; }

.feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(46,61,114,.14) !important; border-color: rgba(46,61,114,.25) !important; }
.feature-card { transition: all .4s cubic-bezier(.16,1,.3,1); }

/* ── Nav link animation styles ── */
.nav-link {
  position: relative;
  text-decoration: none;
  transition: color .25s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform .35s cubic-bezier(.16,1,.3,1);
  border-radius: 1px;
}
.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}
.nav-link.active::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  animation: navDotPop .4s cubic-bezier(.16,1,.3,1) forwards;
}

img { max-width: 100%; }

@media (max-width: 374px) { .nav-logo { width: 60px !important; height: 60px !important; } }
@media (min-width: 375px) and (max-width: 479px) { .nav-logo { width: 60px !important; height: 60px !important; } }
@media (min-width: 480px) and (max-width: 639px) { .nav-logo { width: 80px !important; height: 80px !important; } }
@media (min-width: 640px) and (max-width: 899px) { .nav-logo { width: 80px !important; height: 80px !important; } }
@media (min-width: 900px) and (max-width: 1199px) { .nav-logo { width: 80px !important; height: 80px !important; } }
@media (min-width: 1200px) { .nav-logo { width: 100px !important; height: 80px !important; } }
`;

function vPad(bp) {
  if (bp.isXs) return "56px";
  if (bp.isMobile) return "72px";
  if (bp.isTablet) return "90px";
  return "120px";
}
function hPad(bp) {
  if (bp.isXs) return "1rem";
  if (bp.isMobile) return "1.25rem";
  if (bp.isTablet) return "1.75rem";
  if (bp.isLg) return "2rem";
  return "2.5rem";
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const step = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .9s ${delay}s cubic-bezier(.16,1,.3,1), transform .9s ${delay}s cubic-bezier(.16,1,.3,1)`
    }}>{children}</div>
  );
}

function Eyebrow({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 28, height: 1, background: "var(--secondary)", opacity: .8 }} />
      <span style={{ fontFamily: "var(--sans)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--secondary)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ═══ NAVBAR ═══ */
function Navbar({ onEnquire }) {
  const bp = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const sectionIds = ["story", "gallery", "amenities", "floor-plans", "price-list", "location"];
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (!bp.isDesktop) document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, bp.isDesktop]);

  useEffect(() => { if (bp.isDesktop && open) setOpen(false); }, [bp.isDesktop]);

  const links = ["Story", "Gallery", "Amenities", "Price List", "Location"];

  const linkColor = scrolled ? "var(--primary)" : "rgba(255,255,255,0.92)";
  const activeLinkColor = scrolled ? "var(--secondary)" : "#ffffff";

  const logoSize = bp.isXs ? 100 : bp.isMobile ? 110 : bp.isTablet ? 125 : scrolled ? 130 : 140;
  const navHeight = scrolled ? 72 : bp.isXs ? 82 : bp.isMobile ? 88 : 100;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(46,61,114,.12)" : "none",
        transition: "all .5s ease",
        boxShadow: scrolled ? "0 2px 24px rgba(46,61,114,.08)" : "none",
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: bp.isXs ? "0 .5rem" : bp.isMobile ? "0 1.25rem 0 .5rem" : "0 5rem 0 .95rem",
          height: navHeight, display: "flex", alignItems: "center",
          justifyContent: "space-between", transition: "height .4s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", zIndex: 110, marginLeft: 0, flexShrink: 0 }}>
            <img
              src="/logo.svg"
              alt="Anant Raj Limited"
              className="nav-logo"
              style={{
                width: logoSize, height: logoSize,
                objectFit: "contain",
                transition: "width .4s ease, height .4s ease",
                filter: "drop-shadow(0 2px 8px rgba(46,61,114,.18))",
                display: "block",
              }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {bp.isDesktop && (
            <div style={{ display: "flex", gap: bp.isLg ? "1.75rem" : "2.5rem", alignItems: "center" }}>
              {links.map(l => {
                const id = l.toLowerCase().replace(" ", "-");
                const isActive = activeSection === id;
                return (
                  <a
                    key={l}
                    href={`#${id}`}
                    className={`nav-link${isActive ? " active" : ""}`}
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: bp.isLg ? ".6rem" : ".64rem",
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      color: isActive ? activeLinkColor : linkColor,
                      whiteSpace: "nowrap",
                    }}
                  >{l}</a>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 110 }}>
            {bp.isDesktop && (
              <button onClick={onEnquire}
                style={{
                  background: scrolled ? "var(--primary)" : "rgba(255,255,255,0.15)",
                  border: scrolled ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.6)",
                  color: "#fff",
                  fontFamily: "var(--sans)",
                  fontSize: bp.isLg ? ".6rem" : ".63rem",
                  fontWeight: 500,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  padding: bp.isLg ? "8px 18px" : "9px 22px",
                  cursor: "pointer",
                  transition: "all .25s",
                  whiteSpace: "nowrap",
                  backdropFilter: scrolled ? "none" : "blur(8px)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--secondary)"; e.currentTarget.style.borderColor = "var(--secondary)"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = scrolled ? "var(--primary)" : "rgba(255,255,255,0.15)";
                  e.currentTarget.style.borderColor = scrolled ? "var(--primary)" : "rgba(255,255,255,0.6)";
                }}>
                Brochure
              </button>
            )}
            {bp.isMobile && !open && (
              <a href="tel:+919205974843"
                style={{ fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".06em", color: scrolled ? "var(--secondary)" : "rgba(255,255,255,0.9)", textDecoration: "none", marginRight: 4, display: bp.isXs ? "none" : "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: ".8rem" }}>📞</span><span>Call</span>
              </a>
            )}
            {!bp.isDesktop && (
              <button onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"}
                style={{ background: "none", border: "none", padding: "8px 4px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, zIndex: 110 }}>
                <div style={{ width: 24, height: 1.5, background: open ? "var(--secondary)" : (scrolled ? "var(--primary)" : "#fff"), transition: "all .3s", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                <div style={{ width: 16, height: 1.5, background: scrolled ? "var(--primary)" : "#fff", opacity: open ? 0 : 1, transition: "opacity .3s" }} />
                <div style={{ width: 24, height: 1.5, background: open ? "var(--secondary)" : (scrolled ? "var(--primary)" : "#fff"), transition: "all .3s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {!bp.isDesktop && open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 105, background: "rgba(255,255,255,.98)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.75rem", animation: "fadeIn .25s ease", paddingBottom: "env(safe-area-inset-bottom, 2rem)" }}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute", top: "1.25rem", right: "1rem",
              background: "rgba(46,61,114,.08)",
              border: "1px solid rgba(46,61,114,.25)",
              color: "var(--primary)",
              width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "1.35rem", lineHeight: 1,
              borderRadius: 2, zIndex: 115,
              fontFamily: "var(--sans)", fontWeight: 300,
              transition: "all .2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(46,61,114,.08)"; e.currentTarget.style.color = "var(--primary)"; }}
          >×</button>

          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : bp.isTablet ? "2.2rem" : "1.8rem", color: "var(--primary)", textDecoration: "none", letterSpacing: ".02em" }}>{l}</a>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(46,61,114,.2)", margin: "0.25rem 0" }} />
          <button onClick={() => { setOpen(false); onEnquire(); }}
            style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: "16px 48px", cursor: "pointer", marginTop: "0.5rem" }}>
            Brochure
          </button>
          <a href="tel:+919205974843" onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".1em" }}>
            <span style={{ color: "var(--secondary)", opacity: .7 }}>◉</span>+91 9205974843
          </a>
        </div>
      )}
    </>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const bp = useBreakpoint();
  const [slide, setSlide] = useState(0);
  const slides = ["https://images.pexels.com/photos/36134239/pexels-photo-36134239.jpeg", "https://images.pexels.com/photos/5075082/pexels-photo-5075082.jpeg", "https://images.pexels.com/photos/10518326/pexels-photo-10518326.jpeg"];

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % 3), 5500);
    return () => clearInterval(t);
  }, []);

  const headingSize = bp.isXs ? "1.85rem" : bp.isMobile ? "2.3rem" : bp.isTablet ? "3.2rem" : "clamp(3.8rem,6.5vw,6.5rem)";
  const subSize = bp.isXs ? ".72rem" : bp.isMobile ? ".78rem" : bp.isTablet ? ".84rem" : ".9rem";

  const FormSmall = () => (
    <div style={{ background: "rgba(255,255,255,.95)", backdropFilter: "blur(80px)", border: "1px solid rgba(46,61,114,.18)", maxWidth: bp.isTablet ? 560 : "100%", margin: "0 auto", width: "100%", boxShadow: "0 8px 40px rgba(46,61,114,.15)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }].map((f, i) => (
          <div key={i} style={{
            padding: bp.isTablet ? "14px 18px" : "12px 14px",
            borderRight: i === 0 ? "1px solid rgba(46,61,114,.12)" : "none",
            borderBottom: "1px solid rgba(46,61,114,.12)"
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-dim)", marginBottom: 3, fontWeight: 500 }}>{f.label}</div>
            <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", width: "100%", fontSize: bp.isTablet ? ".8rem" : ".72rem" }} />
          </div>
        ))}
      </div>
      <div style={{ padding: bp.isTablet ? "14px 18px" : "11px 14px", borderBottom: "1px solid rgba(46,61,114,.12)" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-dim)", marginBottom: 3, fontWeight: 500 }}>Email</div>
        <input placeholder="you@email.com" style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: bp.isTablet ? ".8rem" : ".72rem", width: "100%" }} />
      </div>
      <button style={{ width: "100%", padding: bp.isTablet ? "14px" : "12px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
        Register Your Interest Now
      </button>
    </div>
  );

  const heroHeight = "100svh";
  const mobileNavClearance = bp.isXs ? 150 : bp.isMobile ? 160 : 0;
  const desktopTopOffset = bp.isTablet ? "48%" : "47%";

  return (
    <section style={{ position: "relative", height: heroHeight, minHeight: bp.isXs ? 680 : bp.isMobile ? 720 : 560, overflow: "hidden", background: "var(--primary)" }}>
      {slides.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 1.5s ease" }}>
          <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: i === slide ? "scale(1.03)" : "scale(1)", transition: "transform 6s ease-out" }} alt="" />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.35) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,.5) 75%, rgba(0,0,0,.65) 100%)" }} />

      {!bp.isMobile && (
        <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: 2, height: i === slide ? 24 : 10, background: i === slide ? "#fff" : "rgba(255,255,255,.45)", border: "none", cursor: "pointer", borderRadius: 1, padding: 0, transition: "all .4s" }} />
          ))}
        </div>
      )}

      {bp.isMobile ? (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          textAlign: "center",
          paddingTop: mobileNavClearance,
          paddingLeft: bp.isXs ? "1rem" : "1.25rem",
          paddingRight: bp.isXs ? "1rem" : "1.25rem",
          paddingBottom: "1rem",
          overflowY: "auto",
          zIndex: 5,
        }}>
          <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: bp.isXs ? 6 : 10, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 16, height: 1, background: "#fff", opacity: .9 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".48rem" : ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 300, textShadow: "0 1px 8px rgba(0,0,0,.4)", textAlign: "center" }}>
                Part of 220-acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 16, height: 1, background: "#fff", opacity: .9 }} />
            </div>

            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: bp.isXs ? 8 : 12, textShadow: "0 2px 24px rgba(0,0,0,.4)" }}>
              <span style={{ display: "block" }}>Anant Raj Limited –</span>
            </h1>

            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.9)", maxWidth: bp.isXs ? 300 : 340, lineHeight: 1.65, marginBottom: bp.isXs ? 8 : 12 }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 220-acre Township in Sector 63A, Gurugram.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(157,50,63,.85)", border: "1px solid rgba(255,255,255,.3)", padding: "6px 16px", marginBottom: bp.isXs ? 14 : 18 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "primaryPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".5rem" : ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>

          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
            <FormSmall />
          </div>
        </div>
      ) : (
        <div style={{
          position: "absolute",
          top: desktopTopOffset,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%", maxWidth: 1400,
          padding: bp.isTablet ? "0 2rem" : "0 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          paddingTop: bp.isTablet ? "100px" : "120px",
        }}>
          <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 300 }}>
                Part of 220-acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
            </div>

            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 20, textShadow: "0 2px 24px rgba(0,0,0,.35)" }}>
              <span style={{ display: "block" }}>Anant Raj Limited –</span>
            </h1>

            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.9)", maxWidth: bp.isTablet ? 480 : 520, lineHeight: 1.8, marginBottom: 20 }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 220-acre Township in Sector 63A, Gurugram.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(157,50,63,.85)", border: "1px solid rgba(255,255,255,.3)", padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "primaryPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>

          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
            {bp.isTablet && <FormSmall />}
            {bp.isDesktop && (
              <div style={{ display: "grid", gridTemplateColumns: bp.isLg ? "1fr 1fr 1fr auto" : "1fr 1fr 1fr auto", gap: 0, background: "rgba(255,255,255,.96)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,0,0,.15)", maxWidth: bp.isLg ? 680 : 720, margin: "0 auto", boxShadow: "0 8px 40px rgba(0,0,0,.18)" }}>
                {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }, { label: "Email", ph: "you@email.com" }].map((f, i) => (
                  <div key={i} style={{ padding: bp.isLg ? "12px 14px" : "14px 18px", borderRight: "1px solid rgba(46,61,114,.1)" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-dim)", marginBottom: 3, fontWeight: 500 }}>{f.label}</div>
                    <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".8rem", width: "100%" }} />
                  </div>
                ))}
                <button style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "0 22px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══ STORY ═══ */
function StorySection() {
  const bp = useBreakpoint();
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: .15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const units = useCountUp(350, 1800, started);
  const acres = useCountUp(220, 1200, started);
  const towers = useCountUp(2, 1500, started);
  const headingSize = bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : bp.isTablet ? "2.8rem" : "clamp(2.5rem,4vw,4.5rem)";

  return (
    <section id="story" ref={ref} style={{ background: "var(--white)", padding: `${vPad(bp)} 0` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr",
          gap: bp.isXs ? 32 : bp.isMobile ? 36 : bp.isTablet ? 48 : 64,
          alignItems: "center",
        }}>
          {!bp.isMobile && (
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -18, left: -18, width: 160, height: 160, border: "1px solid rgba(46,61,114,.12)", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1, aspectRatio: "4/5", overflow: "hidden", width: "100%" }}>
                  <img
                    src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    alt="Interior"
                  />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 56, height: 56, borderTop: "1px solid var(--secondary)", borderLeft: "1px solid var(--secondary)", opacity: .5 }} />
                </div>
                <div style={{ position: "absolute", bottom: 36, right: -28, zIndex: 2, background: "var(--primary)", border: "1px solid rgba(255,255,255,.2)", padding: "12px 20px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, color: "#fff", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginTop: 4, fontWeight: 400 }}>Registered</div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <Eyebrow label="The Story" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 400, color: "var(--primary)", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              Designed for those<br /><span style={{ color: "var(--secondary)" }}>who seek perfection</span>
            </h2>
            <div style={{ width: 48, height: 2, background: "var(--secondary)", opacity: .5, marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 2, marginBottom: "1.25rem" }}>
              An exclusive upcoming residential development by Anant Raj Limited, located in the prime area of Sector 63A, Gurugram. Part of a large 220-acre integrated township, this premium project is spread across 5 acres and features 2 luxury residential towers designed by international architects.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 2, marginBottom: "2.5rem" }}>
              Premium low-density living in the vicinity of Golf Course Extension Road — a rare collaboration between global design vision and Indian craftsmanship, delivering modern luxury residences of unparalleled distinction.
            </p>

            {bp.isMobile && (
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: "1.5rem" }}>
                <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" alt="Luxury Interior" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 14, right: 14, background: "var(--primary)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.2)", padding: "8px 14px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 400, color: "#fff", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginTop: 3, fontWeight: 400 }}>Registered</div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: "1px solid rgba(46,61,114,.1)", paddingTop: "1.75rem" }}>
              {[{ val: units, label: "Residences" }, { val: acres, label: "Acres" }, { val: towers, label: "Towers" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(46,61,114,.1)" : "none", padding: bp.isXs ? "0 .5rem" : "0 1rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.5rem" : "3.5rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 6, fontWeight: 400 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══ QUOTE BANNER ═══ */
function QuoteBanner() {
  const bp = useBreakpoint();
  const fontSize = bp.isXs ? "1.4rem" : bp.isMobile ? "1.65rem" : "clamp(1.8rem,4vw,4rem)";
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--primary)", padding: bp.isXs ? "52px 1rem" : bp.isMobile ? "64px 1.25rem" : bp.isTablet ? "80px 2rem" : "100px 2rem", borderTop: "none", borderBottom: "none" }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .08 }} alt="" />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--serif)", fontSize, fontWeight: 400, color: "#fff", lineHeight: 1.15, maxWidth: 860, margin: "0 auto 1.5rem" }}>
            Where world-class design meets<br />the soul of Sector 63A, Gurugram.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 28, height: 1, background: "#ffffff", opacity: .6 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".54rem" : ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", fontWeight: 400 }}>Exclusive pre-launch pricing available now</span>
            <div style={{ width: 28, height: 1, background: "#ffffff", opacity: .6 }} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══ GALLERY ═══ */
function GallerySection({ onEnquire }) {
  const bp = useBreakpoint();
  const [hov, setHov] = useState(null);
  const [clicked, setClicked] = useState(null);

  // Always exactly 3 images
  const imgs = [
    { src: "https://i.pinimg.com/1200x/e3/59/c5/e359c5ab551953ba3042ca76cd8fe43d.jpg", label: "Living Spaces" },
    { src: "https://i.pinimg.com/1200x/7a/b0/d6/7ab0d627b61c9e61c9ba4bf393f0a43e.jpg", label: "Master Suite" },
    { src: "https://i.pinimg.com/1200x/e6/6e/78/e66e78086b77ad918568e2a8fe9bc4cb.jpg", label: "Kitchen" },
  ];

  // Grid layout for all breakpoints — always 3 images, no extra space
  let gridItems, cols, rowDef;
  if (bp.isXs) {
    // Mobile: stack vertically
    gridItems = imgs.map((img, i) => ({ ...img, col: "1/2", row: `${i + 1}/${i + 2}` }));
    cols = "1fr";
    rowDef = "repeat(3, 220px)";
  } else if (bp.isMobile) {
    // Larger mobile: first full width, then 2 below
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/2" },
      { ...imgs[1], col: "1/2", row: "2/3" },
      { ...imgs[2], col: "2/3", row: "2/3" },
    ];
    cols = "1fr 1fr";
    rowDef = "220px 200px";
  } else if (bp.isTablet) {
    // Tablet: first full width, then 2 below
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/2" },
      { ...imgs[1], col: "1/2", row: "2/3" },
      { ...imgs[2], col: "2/3", row: "2/3" },
    ];
    cols = "1fr 1fr";
    rowDef = "260px 240px";
  } else {
    // Desktop: 1 large left + 2 stacked right
    gridItems = [
      { ...imgs[0], col: "1/2", row: "1/3" },
      { ...imgs[1], col: "2/3", row: "1/2" },
      { ...imgs[2], col: "2/3", row: "2/3" },
    ];
    cols = "1.4fr 1fr";
    rowDef = "300px 300px";
  }

  return (
    <section id="gallery" style={{ padding: `${vPad(bp)} 0`, background: "var(--off-white)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <Eyebrow label="Gallery" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--primary)", marginBottom: "2rem", lineHeight: 1.1 }}>
            A glimpse of <span style={{ color: "var(--secondary)" }}>elegance</span>
          </h2>
        </Reveal>
        {/* Fixed height grid — no extra space below */}
        <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rowDef, gap: bp.isXs ? 4 : 5 }}>
          {gridItems.map((img, i) => {
            const isClicked = clicked === i;
            const isHovered = hov === i;
            return (
              <div key={i} style={{ gridColumn: img.col, gridRow: img.row, position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => setClicked(clicked === i ? null : i)}>
                <img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .8s cubic-bezier(.16,1,.3,1)", transform: isHovered ? "scale(1.06)" : "scale(1)", display: "block" }} alt={img.label} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(46,61,114,.7) 0%, rgba(46,61,114,.1) 40%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: bp.isXs ? "10px 12px" : "14px 18px", pointerEvents: "none", display: "flex", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 1, background: "#fff", opacity: isHovered ? 1 : 0.6, transition: "opacity .3s" }} />
                    <span style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1.1rem", color: isHovered ? "#fff" : "rgba(255,255,255,.8)", transition: "color .3s" }}>{img.label}</span>
                  </div>
                </div>
                {isClicked && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, animation: "fadeIn .25s ease", width: "100%", display: "flex", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "rgba(255,255,255,.92)", border: "1px solid var(--primary)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: bp.isXs ? "9px 20px" : "11px 28px", cursor: "pointer", backdropFilter: "blur(12px)", whiteSpace: "nowrap" }}>
                      Register Interest
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ AMENITIES ═══ */
function AmenitiesSection() {
  const bp = useBreakpoint();

  const items = [
    { icon: "🏊", num: "25m", title: "Infinity Pool", desc: "Temperature-controlled with panoramic city views" },
    { icon: "💪", num: "5K+", title: "Fitness Center", desc: "Technogym equipment & personal training studios" },
    { icon: "🌿", num: "∞", title: "Zen Garden", desc: "Landscaped meditation & reflection zones" },
    { icon: "🎬", num: "40", title: "Private Theatre", desc: "Dolby Atmos screening room for residents" },
    { icon: "🏠", num: "AI", title: "Smart Homes", desc: "Full Crestron home automation system" },
    { icon: "🌱", num: "★", title: "IGBC Platinum", desc: "Green building sustainability certified" },
    { icon: "💻", num: "24/7", title: "Co-Working Hub", desc: "Private cabins with high-speed connectivity" },
    { icon: "🛎", num: "⁰⁰", title: "Concierge", desc: "Dedicated lifestyle management around the clock" },
  ];

  const gridCols = bp.isXs ? "1fr 1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "repeat(4, 1fr)" : "repeat(4, 1fr)";

  return (
    <section id="amenities" style={{ padding: `${vPad(bp)} 0`, background: "var(--white)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "80vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,61,114,.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "2.5rem" : "4rem", gap: "1.5rem" }}>
            <div>
              <Eyebrow label="Amenities" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1.05 }}>
                Curated for an<br /><span style={{ color: "var(--secondary)" }}>exceptional life</span>
              </h2>
            </div>
         
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 2 : 3 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="amenity-card" style={{
                position: "relative", padding: bp.isXs ? "1.25rem 1rem" : bp.isMobile ? "1.5rem 1.25rem" : "2rem 1.75rem",
                background: "var(--off-white)", border: "1px solid rgba(46,61,114,.08)", cursor: "default",
                transition: "all .4s ease", minHeight: bp.isXs ? 130 : bp.isMobile ? 160 : 200,
                display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div className="amenity-num" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.1rem" : "1.4rem", color: "var(--primary)", fontWeight: 400, opacity: 0.2, transition: "opacity .4s ease", lineHeight: 1 }}>{item.num}</div>
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1.1rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".35rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".68rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.65, marginBottom: ".75rem" }}>{item.desc}</p>
                  <div className="amenity-line" />
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderBottom: "1px solid rgba(46,61,114,.15)", borderLeft: "1px solid rgba(46,61,114,.15)" }} />
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══ PREMIUM FEATURES ═══ */
function PremiumFeaturesSection() {
  const bp = useBreakpoint();

  const features = [
    {
      icon: "◈",
      title: "Italian Marble Flooring",
      desc: "Imported Statuario & Calacatta marble in living areas, master bedroom and bathrooms — each slab hand-selected for grain and tone.",
      tag: "Finishes"
    },
    {
      icon: "◉",
      title: "Floor-to-Ceiling Glazing",
      desc: "Double-glazed, thermally broken aluminium frames with UV-filtered glass offering unobstructed skyline views from every room.",
      tag: "Architecture"
    },
    {
      icon: "◌",
      title: "Crestron Smart Home",
      desc: "Fully integrated home automation — lighting scenes, climate, security, AV and blinds — controlled from a single touchpad or smartphone.",
      tag: "Technology"
    },
    {
      icon: "◈",
      title: "Private Sky Decks",
      desc: "Select residences feature private outdoor terraces with landscaped planters, creating an extension of interior living into the open sky.",
      tag: "Lifestyle"
    },
    {
      icon: "◉",
      title: "Modular German Kitchen",
      desc: "Fully fitted kitchens with Häcker cabinetry, quartz countertops, Siemens appliances and concealed MEP services.",
      tag: "Kitchen"
    },
    {
      icon: "◌",
      title: "3-Tier Security",
      desc: "Biometric access, AI-powered CCTV surveillance, 24/7 concierge and dedicated security staff at every entry point.",
      tag: "Security"
    },
  ];

  const gridCols = bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "repeat(3, 1fr)";

  return (
    <section id="premium-features" style={{ padding: `${vPad(bp)} 0`, background: "var(--primary)", position: "relative", overflow: "hidden" }}>
      {/* Background texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(157,50,63,.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,.04) 0%, transparent 40%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)" }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}`, position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "2.5rem" : "4rem", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 28, height: 1, background: "#ffffff", opacity: .8 }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#ffffff", fontWeight: 500 }}>Premium Features</span>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.05 }}>
                Crafted to the<br /><span style={{ color: "#ffffff" }}>finest detail</span>
              </h2>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 300, color: "rgba(255,255,255,.55)", maxWidth: 320, lineHeight: 1.9 }}>
              Every element of the residences has been specified with the world's most respected brands and materials — nothing is left to chance.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 2 : 3 }}>
          {features.map((feat, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="feature-card" style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                padding: bp.isXs ? "1.5rem 1.25rem" : "2rem 1.75rem",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 4px 24px rgba(0,0,0,.12)",
              }}>
                {/* Corner accent */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 24, height: 24, borderBottom: "1px solid rgba(255,255,255,.3)", borderLeft: "1px solid rgba(255,255,255,.3)" }} />

                {/* Tag */}
                <div style={{ display: "inline-flex", alignSelf: "flex-start" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#ffffff", fontWeight: 500, opacity: .8 }}>{feat.tag}</span>
                </div>

                {/* Icon + Title */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ color: "#ffffff", fontSize: "1.1rem", opacity: .7, flexShrink: 0, marginTop: 2 }}>{feat.icon}</div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.15rem", fontWeight: 400, color: "#fff", lineHeight: 1.2 }}>{feat.title}</h4>
                </div>

                {/* Description */}
                <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".74rem", fontWeight: 300, color: "rgba(255,255,255,.55)", lineHeight: 1.8 }}>{feat.desc}</p>

                {/* Bottom line */}
                <div style={{ marginTop: "auto", height: 1, background: "linear-gradient(to right, rgba(255,255,255,.3), transparent)" }} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom row highlight bar */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: bp.isXs ? "2rem" : "3rem", display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 0, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" }}>
            {[
              { val: "RERA", sub: "Registered Project" },
              { val: "IGBC", sub: "Platinum Green Certified" },
              { val: "BMS", sub: "Building Mgmt System" },
              { val: "EV", sub: "Charging Points" },
            ].map((item, i) => (
              <div key={i} style={{ padding: bp.isXs ? "1.25rem 1rem" : "1.5rem 2rem", borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.3rem" : "1.6rem", fontWeight: 400, color: "#ffffff", lineHeight: 1 }}>{item.val}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginTop: 6, fontWeight: 300 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ PRICE LIST ═══ */
function PriceListSection({ onEnquire }) {
  const bp = useBreakpoint();

  const units = [
    { type: "3 BHK", area: "2,300 sq.ft", carpet: "1,610 sq.ft", price: "On Request" },
    { type: "3 BHK + Study", area: "2,600 sq.ft", carpet: "1,820 sq.ft", price: "On Request" },
  ];

  return (
    <section id="price-list" style={{ padding: `${vPad(bp)} 0`, background: "var(--off-white)", borderTop: "1px solid rgba(46,61,114,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>

        <Reveal>
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "2.5rem" : "3.5rem" }}>
            <Eyebrow label="Pricing" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.2rem" : bp.isMobile ? "2.8rem" : "clamp(2.5rem,5vw,4.5rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1, marginBottom: ".5rem" }}>
              Price List
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 28 : 24, alignItems: "stretch" }}>

          <Reveal>
            <div style={{ background: "var(--white)", border: "1px solid rgba(46,61,114,.12)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 4px 24px rgba(46,61,114,.06)" }}>
              <div style={{ padding: bp.isXs ? "1.25rem 1.5rem" : "1.75rem 2.5rem", borderBottom: "1px solid rgba(46,61,114,.1)", background: "var(--primary)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.3rem" : "1.7rem", fontWeight: 400, color: "#fff", marginBottom: 0 }}>Property Investment Plans</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr 1fr" : "1fr 1.2fr 1fr auto", gap: 0, borderBottom: "1px solid rgba(46,61,114,.08)", padding: bp.isXs ? "10px 1.5rem" : "12px 2.5rem", background: "rgba(46,61,114,.04)" }}>
                {(bp.isXs ? ["TYPE", "PRICE"] : ["TYPE", "AREA", "PRICE", ""]).map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600 }}>{h}</div>
                ))}
              </div>

              {units.map((u, i) => (
                <div key={i} className="price-row"
                  style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr 1fr" : "1fr 1.2fr 1fr auto", gap: 0, alignItems: "center", padding: bp.isXs ? "1rem 1.5rem" : "1.25rem 2.5rem", borderBottom: i < units.length - 1 ? "1px solid rgba(46,61,114,.06)" : "none", transition: "background .2s", cursor: "pointer", background: "transparent" }}
                  onClick={onEnquire}>
                  <div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.15rem", fontWeight: 400, color: "var(--primary)" }}>{u.type}</div>
                    {bp.isXs && <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 300 }}>{u.area}</div>}
                  </div>
                  {!bp.isXs && (
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "var(--text-mid)" }}>{u.area}</div>
                  )}
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".82rem", fontWeight: 500, color: "var(--secondary)" }}>{u.price}</div>
                  {!bp.isXs && (
                    <button className="details-btn" onClick={e => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "transparent", border: "1px solid rgba(46,61,114,.3)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: ".56rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "9px 18px", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
                      Details
                    </button>
                  )}
                </div>
              ))}

              <div style={{ padding: bp.isXs ? "1rem 1.5rem 1.5rem" : "1.25rem 2.5rem 2rem", borderTop: "1px solid rgba(46,61,114,.08)", marginTop: "auto" }}>
                <button onClick={onEnquire}
                  style={{ width: "100%", padding: bp.isXs ? "13px" : "16px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                  Complete Costing Details
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ position: "relative", overflow: "hidden", height: "100%", minHeight: bp.isXs ? 200 : bp.isMobile ? 260 : 360 }}>
              <img
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
                alt="Price List"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(46,61,114,.55) 0%, rgba(46,61,114,.8) 100%)" }} />
              <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "1px solid rgba(255,255,255,.5)", padding: "7px 16px" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, color: "white", letterSpacing: ".12em", textTransform: "uppercase" }}>Price List</span>
              </div>
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.2rem" : "1.5rem", fontWeight: 400, color: "#fff" }}>Pre-launch pricing<br />available on request</div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div style={{ marginTop: "1.5rem", fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--text-dim)", letterSpacing: ".05em", fontWeight: 300 }}>
            * Prices are indicative and subject to floor rise & GST. Click any unit for detailed pricing. Subject to RERA guidelines.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ PRICE & CONFIGURATION ═══ */
function PriceConfigSection({ onEnquire }) {
  const bp = useBreakpoint();
  const [activeUnit, setActiveUnit] = useState(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const unitTypes = [
    { type: "3 BHK", subLabel: "Premium Sky Residences", area: "2,300 sq.ft" },
    { type: "3 BHK + Study", subLabel: "Super Spacious Luxury Layout", area: "2,600 sq.ft" },
  ];

  const paymentSchedule = [
    { milestone: "On Booking", percent: "10%" },
    { milestone: "Within 60 Days", percent: "5%" },
    { milestone: "Within 90 Days", percent: "5%" },
    { milestone: "Within 120 Days", percent: "10%" },
    { milestone: "On Completion of 5th Floor", percent: "7.5%" },
    { milestone: "On Completion of 10th Floor", percent: "7.5%" },
    { milestone: "On Completion of 15th Floor", percent: "7.5%" },
    { milestone: "On Completion of 20th Floor", percent: "7.5%" },
    { milestone: "On Offer of Possession", percent: "10%" },
    { milestone: "On Possession", percent: "30%" },
  ];

  const visibleSchedule = showFullSchedule ? paymentSchedule : paymentSchedule.slice(0, 5);

  const features = [
    "Flexible Construction Linked Payment Plan",
    "Attractive Early Buyer Benefits",
    "Limited Inventory Available",
  ];

  return (
    <section id="price-configuration" style={{ padding: `${vPad(bp)} 0`, background: "var(--white)", borderTop: "1px solid rgba(46,61,114,.1)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>

        <Reveal>
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "2rem" : "3rem" }}>
            <Eyebrow label="Configuration" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2rem" : bp.isMobile ? "2.8rem" : "clamp(2.5rem,5vw,4.5rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1 }}>
              Price & Configuration
            </h2>
          </div>
        </Reveal>

        {!bp.isMobile && (
          <Reveal>
            <div style={{ display: "flex", gap: 8, marginBottom: "2rem", flexWrap: "wrap" }}>
              {unitTypes.map((u, i) => (
                <button key={i} className={`price-config-tab${activeUnit === i ? " active" : ""}`}
                  onClick={() => setActiveUnit(i)}
                  style={{ background: activeUnit === i ? "var(--primary)" : "transparent", border: activeUnit === i ? "1px solid var(--primary)" : "1px solid rgba(46,61,114,.2)", color: activeUnit === i ? "#fff" : "var(--text-mid)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: activeUnit === i ? 500 : 300, letterSpacing: ".08em", padding: "9px 20px", cursor: "pointer", transition: "all .2s" }}>
                  {u.type}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 24 : 20 }}>

          <Reveal>
            <div style={{ background: "var(--off-white)", border: "1px solid rgba(46,61,114,.1)", padding: bp.isXs ? "1.5rem" : "2.5rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: bp.isDesktop ? 420 : "auto" }}>
              <div>
                {bp.isMobile && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {unitTypes.map((u, i) => (
                        <button key={i}
                          onClick={() => setActiveUnit(i)}
                          style={{ background: activeUnit === i ? "var(--primary)" : "transparent", border: "1px solid rgba(46,61,114,.25)", color: activeUnit === i ? "#fff" : "var(--text-mid)", fontFamily: "var(--sans)", fontSize: ".58rem", fontWeight: 400, padding: "6px 12px", cursor: "pointer", borderRadius: 20, transition: "all .2s" }}>
                          {u.type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.6rem" : "2.2rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.1, marginBottom: ".4rem" }}>{unitTypes[activeUnit].type}</h3>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 400, color: "var(--secondary)", marginBottom: "1.75rem", letterSpacing: ".04em" }}>{unitTypes[activeUnit].subLabel}</div>

                <div style={{ marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid rgba(46,61,114,.08)" }}>
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Super Area</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 400, color: "var(--primary)" }}>{unitTypes[activeUnit].area}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Price</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: "1rem", fontWeight: 500, color: "var(--secondary)" }}>On Request</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: ".85rem", marginBottom: "2rem" }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 16, height: 16, border: `1.5px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 6, height: 4, borderLeft: `2px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, borderBottom: `2px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, transform: "rotate(-45deg) translate(1px,-1px)" }} />
                      </div>
                      <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".78rem", fontWeight: 300, color: i === 2 ? "var(--text-dim)" : "var(--text-mid)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={onEnquire}
                style={{ width: "100%", padding: bp.isXs ? "13px" : "16px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                Get Pricing Details <span style={{ fontSize: "1rem" }}>↓</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ background: "var(--off-white)", border: "1px solid rgba(46,61,114,.1)", padding: bp.isXs ? "1.5rem" : "2.5rem", height: "100%", minHeight: bp.isDesktop ? 420 : "auto" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : "1.8rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.15, marginBottom: "1.75rem" }}>
                Construction Linked Payment
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {visibleSchedule.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: bp.isXs ? "12px 0" : "14px 0", borderBottom: i < visibleSchedule.length - 1 ? "1px solid rgba(46,61,114,.07)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 3, height: 20, background: "var(--secondary)", opacity: .4, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".8rem", fontWeight: 300, color: "var(--text-mid)" }}>{item.milestone}</div>
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".82rem" : ".9rem", fontWeight: 600, color: "var(--primary)", letterSpacing: ".03em", flexShrink: 0, marginLeft: 12 }}>{item.percent}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowFullSchedule(v => !v)}
                style={{ marginTop: "1.25rem", background: "none", border: "none", fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 500, color: "var(--secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0, letterSpacing: ".03em" }}>
                {showFullSchedule ? "Hide Schedule" : "View Full Schedule"}
                <span style={{ fontSize: ".9rem", transition: "transform .3s", transform: showFullSchedule ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
              </button>

              <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(46,61,114,.04)", border: "1px solid rgba(46,61,114,.1)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.7 }}>
                  Subvention & flexi payment plans also available. Speak to our team for customized options. GST, stamp duty & registration charges extra.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══ LOCATION ═══ */
function LocationSection() {
  const bp = useBreakpoint();

  const landmarks = [
    { name: "Golf Course Extension Road", dist: "2 km", icon: "⛳", category: "Connectivity" },
    { name: "Southern Peripheral Road (SPR)", dist: "1 km", icon: "🛣", category: "Connectivity" },
    { name: "Cyber City / DLF Cyber Hub", dist: "12 km", icon: "🏢", category: "Business" },
    { name: "Ambience Mall", dist: "8 km", icon: "🛍", category: "Lifestyle" },
    { name: "Indira Gandhi International Airport", dist: "22 km", icon: "✈️", category: "Travel" },
    { name: "NH-48 (Delhi–Jaipur Highway)", dist: "5 km", icon: "🚗", category: "Connectivity" },
  ];

  const mapHeight = bp.isXs ? 260 : bp.isMobile ? 300 : bp.isTablet ? 360 : "100%";

  return (
    <section id="location" style={{ padding: `${vPad(bp)} 0`, background: "var(--off-white)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "2rem" : "3.5rem", gap: "1rem" }}>
            <div>
              <Eyebrow label="Location" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1.05 }}>
                Strategic <span style={{ color: "var(--secondary)" }}>connectivity</span>
              </h2>
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 300, color: "var(--text-dim)", maxWidth: 320, lineHeight: 1.9 }}>
              Sector 63A, Gurugram — prime vicinity of Golf Course Extension Road, connected to the city's best.
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1.2fr" : "1fr", gap: bp.isDesktop ? 4 : 32 }}>
          <Reveal>
            <div style={{ background: "var(--white)", border: "1px solid rgba(46,61,114,.1)", overflow: "hidden", boxShadow: "0 4px 24px rgba(46,61,114,.06)" }}>
              <div style={{ padding: bp.isXs ? "1rem 1.25rem" : "1.25rem 2rem", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, background: "var(--primary)" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", fontWeight: 400 }}>Distances from Site</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "primaryPulse 2s infinite" }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", fontWeight: 300 }}>Sector 63A</span>
                </div>
              </div>

              {landmarks.map((lm, i) => (
                <div key={i} className="landmark-row" style={{
                  display: "grid",
                  gridTemplateColumns: bp.isXs ? "1fr auto" : "1fr auto auto",
                  alignItems: "center",
                  gap: bp.isXs ? "8px 12px" : "12px 16px",
                  padding: bp.isXs ? ".9rem 1.25rem" : "1rem 2rem",
                  borderBottom: i < landmarks.length - 1 ? "1px solid rgba(46,61,114,.06)" : "none",
                  transition: "background .25s ease",
                  cursor: "default",
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".7rem" : ".78rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 1.3 }}>{lm.name}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 2, fontWeight: 400 }}>{lm.category}</div>
                  </div>
                  {!bp.isXs && (
                    <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".15em", textTransform: "uppercase", padding: "3px 8px", background: "rgba(46,61,114,.06)", color: "var(--text-dim)", whiteSpace: "nowrap", fontWeight: 400 }}>{lm.category}</span>
                  )}
                  <div className="landmark-dist" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.1rem", color: "var(--primary)", flexShrink: 0, textAlign: "right", fontWeight: 700 }}>{lm.dist}</div>
                </div>
              ))}

              <div style={{ padding: bp.isXs ? "1rem 1.25rem" : "1.25rem 2rem", background: "rgba(46,61,114,.04)", borderTop: "1px solid rgba(46,61,114,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 2, fontWeight: 500 }}>Site Address</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".75rem", fontWeight: 300, color: "var(--text-mid)" }}>Sector 63A, Gurugram, Haryana — 122101</div>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                  style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontWeight: 500 }}>
                  Get Directions <span style={{ fontSize: ".8rem" }}>→</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={bp.isDesktop ? 0.15 : 0}>
            <div style={{ position: "relative", overflow: "hidden", height: bp.isDesktop ? "100%" : mapHeight, minHeight: bp.isDesktop ? 460 : mapHeight }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14026!2d77.0856!3d28.4089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e4b8f4c6b1%3A0x6b04d8b6e5c7c4a0!2sSector%2063A%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="100%"
                style={{ display: "block", filter: "grayscale(100%) contrast(85%) brightness(90%)", border: "none", position: "absolute", inset: 0 }}
                loading="lazy" title="Location"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(46,61,114,.25) 0%, transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--secondary)", animation: "pulse-ring 2s ease-out infinite", width: 20, height: 20 }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--secondary)", border: "3px solid #fff", position: "relative", zIndex: 1, boxShadow: "0 0 0 2px rgba(157,50,63,.3)" }} />
              </div>
              <div style={{ position: "absolute", top: bp.isXs ? "0.75rem" : "1rem", left: bp.isXs ? "0.75rem" : "1rem", zIndex: 3, background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(46,61,114,.15)", padding: bp.isXs ? "8px 12px" : "10px 16px", boxShadow: "0 4px 16px rgba(46,61,114,.1)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--primary-dim)", marginBottom: 3, fontWeight: 400 }}>Project Location</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1rem", color: "var(--primary)", fontWeight: 400 }}>Sector 63A, Gurugram</div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, background: "rgba(46,61,114,.92)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,.1)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[{ label: "IGI Airport", val: "22 km" }, { label: "Golf Course Ext Rd", val: "2 km" }, { label: "NH-48", val: "5 km" }].map((s, i) => (
                  <div key={i} style={{ padding: bp.isXs ? ".75rem .875rem" : "1rem 1.25rem", borderRight: i < 2 ? "1px solid rgba(255,255,255,.1)" : "none", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".95rem" : "1.1rem", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".44rem" : ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", marginTop: 3, fontWeight: 300 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══ CONTACT — Horizontal CTA (form removed, replaced with horizontal strip) ═══ */
function ContactSection({ onEnquire }) {
  const bp = useBreakpoint();

  return (
    <section style={{ background: "var(--white)", borderTop: "1px solid rgba(46,61,114,.08)" }}>

      {/* ── Contact Info Block ── */}
      <div style={{ padding: `${vPad(bp)} 0`, paddingBottom: bp.isXs ? "2rem" : "3rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
          <Reveal>
            <Eyebrow label="Visit Us" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--primary)", marginBottom: "2.5rem", lineHeight: 1.05 }}>
              The experience <span style={{ color: "var(--secondary)" }}>awaits you</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{
              display: "grid",
              gridTemplateColumns: bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
              gap: bp.isXs ? "1.75rem" : "2rem",
            }}>
              {[
                { icon: "◈", title: "Site Address", lines: ["Sector 63A, Gurugram", "Haryana — 122101"] },
                { icon: "◉", title: "Sales", lines: ["+91 92059 74843"] },
                { icon: "◌", title: "Email", lines: ["info@anantrajsector63a.com"] },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ color: "var(--secondary)", fontSize: "1rem", marginTop: 2, opacity: .7, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 8, fontWeight: 400 }}>{c.title}</div>
                    {c.lines.map((line, j) => <div key={j} style={{ fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 1.8 }}>{line}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Horizontal CTA Strip ── */}
      <Reveal>
        <div style={{
          background: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle texture */}
          {/* <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 90% 50%, rgba(157,50,63,.2) 0%, transparent 55%), radial-gradient(circle at 10% 50%, rgba(255,255,255,.03) 0%, transparent 40%)", pointerEvents: "none" }} /> */}
          {/* <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)" }} /> */}

          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: bp.isXs ? "2.5rem 1rem" : bp.isMobile ? "3rem 1.25rem" : bp.isTablet ? "3.5rem 1.75rem" : "4rem 2.5rem",
            display: "flex",
            flexDirection: bp.isMobile ? "column" : "row",
            alignItems: bp.isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: bp.isXs ? "1.75rem" : "2rem",
            position: "relative",
            zIndex: 1,
          }}>
            {/* Left: text */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 1, background: "#9D323F", opacity: .8 }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".28em", textTransform: "uppercase", color: "#9D323F", fontWeight: 500 }}>Pre-Launch · Limited Units</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : bp.isMobile ? "1.8rem" : "clamp(1.8rem,3vw,2.8rem)", fontWeight: 400, color: "#2E3D72", lineHeight: 1.1, marginBottom: ".75rem" }}>
                Register now for exclusive<br />pre-launch pricing & floor plans.
              </h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".74rem", fontWeight: 300, color: "#4167A7", lineHeight: 1.8, maxWidth: 420 }}>
                Our team will reach out within 24 hours with complete pricing, availability and site visit details.
              </p>
            </div>

            {/* Divider (desktop) */}
            {!bp.isMobile && (
              <div style={{ width: 1, height: 100, background: "rgba(0,0,0,.12)", flexShrink: 0, margin: "0 1rem" }} />
            )}

            {/* Right: inline mini-form */}
            <div style={{ flexShrink: 0, width: bp.isXs ? "100%" : bp.isMobile ? "100%" : bp.isTablet ? "100%" : 420 }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: bp.isXs ? "1fr" : "1fr 1fr",
                gap: 2,
                marginBottom: 2,
              }}>
                {[
                  { label: "Full Name", ph: "Your Name" },
                  { label: "Phone", ph: "+91 00000 00000" },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,.08)",
                    border: "1px solid rgba(0,0,0,.12)",
                    padding: "12px 16px",
                  }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 4, fontWeight: 500 }}>{f.label}</div>
                    <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "#000", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, width: "100%" }} />
                  </div>
                ))}
              </div>
              <button onClick={onEnquire}
                style={{ width: "100%", padding: "14px 24px", background: "var(--secondary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = "#b83848"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--secondary)"}>
                Register Your Interest Now <span style={{ fontSize: ".9rem" }}>→</span>
              </button>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".54rem", color: "rgba(0,0,0,.5)", letterSpacing: ".08em", fontWeight: 300, marginTop: 10, textAlign: "center" }}>We respect your privacy. No spam, ever.</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ SIDEBAR ═══ */
function Sidebar() {
  return (
    <div style={{ position: "sticky", top: 80, padding: "2rem 1.5rem", background: "var(--off-white)", borderLeft: "1px solid rgba(46,61,114,.08)", height: "calc(100vh - 80px)", overflowY: "auto" }}>
      <div style={{ borderBottom: "1px solid rgba(46,61,114,.1)", paddingBottom: "1.75rem", marginBottom: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: ".4rem", fontWeight: 400 }}>Configuration</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.2 }}>3 BHK & 3 BHK + Study</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", color: "var(--text-dim)", marginTop: 6, letterSpacing: ".05em", fontWeight: 300 }}>2,300 – 2,600 sq.ft</div>
        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(157,50,63,.1)", padding: "4px 10px", border: "1px solid rgba(157,50,63,.2)" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--secondary)", animation: "primaryPulse 2s infinite" }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: ".48rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--secondary)", fontWeight: 500 }}>Coming Soon</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
        {["Full Name", "Email", "Phone"].map(ph => (
          <div key={ph} style={{ borderBottom: "1px solid rgba(46,61,114,.12)", paddingBottom: ".75rem" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6, fontWeight: 400 }}>{ph}</div>
            <input placeholder={`Enter ${ph}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, width: "100%" }} />
          </div>
        ))}
      </div>
      <button style={{ width: "100%", padding: 12, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer", marginBottom: "2rem", transition: "background .25s" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
        Register Interest
      </button>
      <div style={{ borderTop: "1px solid rgba(46,61,114,.08)", paddingTop: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem", fontWeight: 400 }}>Speak to an Expert</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, border: "1px solid rgba(46,61,114,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".9rem", background: "rgba(46,61,114,.04)" }}>📞</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 400, color: "var(--text-mid)" }}>+91 92059 74843</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 300 }}>Available 9am – 8pm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ FOOTER ═══ */
function Footer() {
  const bp = useBreakpoint();
  const links = {
    "Project": ["Overview", "Price List", "Gallery", "Amenities"],
    "Company": ["About Anant Raj Limited", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };
  const gridCols = bp.isXs ? "1fr 1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr";
  return (
    <footer style={{ background: "var(--primary)", borderTop: "none", padding: bp.isXs ? "48px 1rem 28px" : bp.isMobile ? "56px 1.25rem 32px" : "72px 2rem 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 28 : bp.isMobile ? 24 : 48, marginBottom: 48 }}>
          <div style={{ gridColumn: bp.isXs ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 18, height: 1, background: "#ffffff" }} />
                <div style={{ width: 10, height: 1, background: "#ffffff", opacity: .5 }} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400, color: "#fff" }}>Anant Raj Limited</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "rgba(255,255,255,.55)", lineHeight: 1.9, marginBottom: "1.25rem", maxWidth: 260 }}>
              An exclusive luxury residential development in Sector 63A, Gurugram — part of a 220-acre integrated township by Anant Raj Limited.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fb", "Tw", "In", "Li"].map(s => (
                <a key={s} href="#" style={{ width: 30, height: 30, border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: ".58rem", color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 400 }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: "1.2rem", fontWeight: 500 }}>{group}</div>
              <ul style={{ listStyle: "none" }}>
                {items.map(item => (<li key={item} style={{ marginBottom: ".65rem" }}><a href="#" style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "rgba(255,255,255,.55)", textDecoration: "none" }}>{item}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "rgba(255,255,255,.5)", fontWeight: 300 }}>© 2026 Anant Raj Limited. All Rights Reserved.</p>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "rgba(255,255,255,.25)", fontWeight: 300 }}>RERA Reg. No. HRERA/GGM/2024/63A/001</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══ DISCLAIMER ═══ */
function Disclaimer() {
  const bp = useBreakpoint();
  return (
    <div style={{ background: "#2E3D72", borderTop: "1px solid rgba(255,255,255,.08)", padding: bp.isXs ? "1.75rem 1rem" : bp.isMobile ? "2rem 1.25rem" : "2.5rem 2rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: "1rem" }}>
          <div style={{ width: 1, background: "white", opacity: .8, alignSelf: "stretch", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "white", opacity: .8, marginBottom: ".6rem", fontWeight: 500 }}>Legal Disclaimer</div>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9, marginBottom: ".6rem" }}>
              This website has been prepared solely for informational purposes and does not constitute an offer, invitation, or inducement to invest in or purchase any property. The content, images, floor plans, specifications, amenities, pricing, and other details mentioned herein are tentative and indicative only.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9 }}>
              Prospective buyers are advised to independently verify all details with the relevant government authorities and consult their legal and financial advisors before making any purchase decision. Anant Raj Limited shall not be liable for any claims arising out of reliance on the information provided.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(46,61,114,.08)", paddingTop: ".75rem", display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
          {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(link => (
            <a key={link} href="#" style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: ".08em", fontWeight: 300 }}>{link}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ MODAL ═══ */
function Modal({ open, onClose }) {
  const bp = useBreakpoint();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(46,61,114,.4)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn .3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", width: "100%", maxWidth: 500, border: "1px solid rgba(46,61,114,.15)", position: "relative", maxHeight: "92svh", overflowY: "auto", boxShadow: "0 24px 80px rgba(46,61,114,.2)" }}>
        <div style={{ height: 3, background: "linear-gradient(to right, var(--primary), var(--secondary))" }} />
        <div style={{ padding: bp.isXs ? "1.5rem 1.25rem" : bp.isMobile ? "1.75rem" : "3rem" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          <Eyebrow label="Register Interest" />
          <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.6rem" : "2.4rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".4rem" }}>Get Pre-Launch Access</h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", color: "var(--text-dim)", marginBottom: "2rem", fontWeight: 300 }}>Exclusive pre-launch pricing, floor plans & booking details. Our team will reach out within 24 hours.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {["Full Name", "Phone Number", "Email Address"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(46,61,114,.15)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 8, fontWeight: 400 }}>{ph}</div>
                <input placeholder={`Enter your ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".85rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
            <button style={{ width: "100%", padding: 14, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
              Register Your Interest Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ AUTO POPUP ═══ */
function AutoPopup({ open, onClose }) {
  const bp = useBreakpoint();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(46,61,114,.35)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: bp.isXs ? ".75rem" : "1rem", animation: "fadeIn .5s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", width: "100%", maxWidth: bp.isMobile ? 380 : 780, border: "1px solid rgba(46,61,114,.12)", position: "relative", display: "grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", maxHeight: "90svh", overflowY: "auto", boxShadow: "0 24px 80px rgba(46,61,114,.2)" }}>
        {!bp.isMobile && (
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} alt="" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(46,61,114,.9) 0%, rgba(46,61,114,.3) 60%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 8, fontWeight: 400 }}>Coming Soon · Pre-Launch</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.4rem", fontWeight: 400, color: "#fff", lineHeight: 1.05 }}>Register<br /><span style={{ color: "#ffffff" }}>Early Access</span></h3>
            </div>
          </div>
        )}
        <div style={{ padding: bp.isXs ? "1.75rem 1.5rem" : "3rem", background: "var(--off-white)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          {bp.isMobile && <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".5rem" }}>Pre-Launch Access</h3>}
          <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "var(--text-dim)", marginBottom: "1.75rem", lineHeight: 1.8 }}>
            Be first to receive exclusive pre-launch pricing, floor plans, unit availability, and preview invitations for Anant Raj Limited Sector 63A — part of a 220-acre integrated township in Gurugram.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "1.75rem" }}>
            {["Full Name", "Phone Number"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(46,61,114,.12)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6, fontWeight: 400 }}>{ph}</div>
                <input placeholder={`Enter ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: 13, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
            Register Your Interest Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ STICKY BOTTOM CTA (mobile) ═══ */
function StickyBottomCTA({ onEnquire }) {
  const bp = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!bp.isMobile || !scrolled) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, display: "grid", gridTemplateColumns: "1fr 1fr", background: "rgba(255,255,255,.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(46,61,114,.15)", paddingBottom: "env(safe-area-inset-bottom, 0px)", animation: "fadeUp .4s ease", boxShadow: "0 -4px 20px rgba(46,61,114,.1)" }}>
      <a href="tel:+919205974843" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 12px", textDecoration: "none", borderRight: "1px solid rgba(46,61,114,.1)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>
        <span style={{ color: "var(--secondary)", fontSize: ".9rem" }}>📞</span> Call Now
      </a>
      <button onClick={onEnquire} style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "15px 12px", cursor: "pointer", transition: "background .25s" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
        Register Now
      </button>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const bp = useBreakpoint();
  const [modal, setModal] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAutoPopup(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <style>{GLOBAL_CSS}</style>
      <Navbar onEnquire={() => setModal(true)} />
      <Hero />
      <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 260px" : "1fr" }}>
        <div>
          <StorySection />
          <QuoteBanner />
          <GallerySection onEnquire={() => setModal(true)} />
          <AmenitiesSection />
          
          <PriceListSection onEnquire={() => setModal(true)} />
            <PremiumFeaturesSection />
          <LocationSection />
          <ContactSection onEnquire={() => setModal(true)} />
        </div>
        {bp.isDesktop && <Sidebar />}
      </div>
      <Footer />
      <Disclaimer />
      <StickyBottomCTA onEnquire={() => setModal(true)} />
      <Modal open={modal} onClose={() => setModal(false)} />
      <AutoPopup open={autoPopup} onClose={() => setAutoPopup(false)} />
      {bp.isMobile && <div style={{ height: 60 }} />}
    </div>
  );
}