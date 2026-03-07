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

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Poppins:wght@200;300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #0c0b09; color: #e8e4dc; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
:root {
  --gold: #c9a96e; --gold-light: #e8d5b0; --gold-dim: #8a6e45;
  --cream: #f5f0e8; --warm-black: #0c0b09; --warm-dark: #161410;
  --text-dim: #7a7268;
  --serif: 'Libre Baskerville', 'Baskerville', 'Georgia', serif;
  --sans: 'Poppins', sans-serif;
  --nav-h: 80px;
}
::selection { background: var(--gold); color: var(--warm-black); }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--warm-black); }
::-webkit-scrollbar-thumb { background: var(--gold-dim); }
input::placeholder { color: rgba(232,228,220,0.3); }
input { caret-color: var(--gold); }

@keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes pulse-ring { 0% { transform:scale(0.8); opacity:1; } 100% { transform:scale(2.5); opacity:0; } }
@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes goldPulse { 0%,100% { opacity:.3; } 50% { opacity:.7; } }
@keyframes amenityLine { from { width: 0; } to { width: 100%; } }

.container { max-width: 1400px; margin: 0 auto; width: 100%; }

/* Touch devices */
@media (max-width: 639px) {
  input, button, a { -webkit-tap-highlight-color: transparent; }
  button { touch-action: manipulation; }
  * { -webkit-text-size-adjust: 100%; }
}
@supports (padding: max(0px)) {
  .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
}

/* Amenity cards */
.amenity-card:hover .amenity-line { animation: amenityLine 0.5s ease forwards; }
.amenity-card .amenity-line { width: 0; height: 1px; background: var(--gold); transition: width 0.5s ease; }
.amenity-card:hover { background: rgba(201,169,110,.06) !important; border-color: rgba(201,169,110,.25) !important; }
.amenity-card:hover .amenity-num { opacity: 1 !important; }
.amenity-card:hover .amenity-icon-bg { transform: scale(1.1); background: rgba(201,169,110,.15) !important; }

.landmark-row:hover { background: rgba(201,169,110,.04) !important; }
.landmark-row:hover .landmark-dist { color: var(--gold-light) !important; transform: translateX(4px); }
.landmark-row .landmark-dist { transition: color .3s, transform .3s; }

/* Price list styles */
.price-row:hover { background: rgba(201,169,110,.04) !important; }
.details-btn:hover { background: var(--gold) !important; color: var(--warm-black) !important; }
.price-config-tab:hover { background: rgba(201,169,110,.08) !important; }
.price-config-tab.active { background: rgba(201,169,110,.12) !important; border-color: rgba(201,169,110,.4) !important; }

/* Responsive image fixes */
img { max-width: 100%; }

/* Nav logo responsive sizes */
@media (max-width: 374px) { .nav-logo { width: 130px !important; height: 130px !important; } }
@media (min-width: 375px) and (max-width: 479px) { .nav-logo { width: 145px !important; height: 145px !important; } }
@media (min-width: 480px) and (max-width: 639px) { .nav-logo { width: 155px !important; height: 155px !important; } }
@media (min-width: 640px) and (max-width: 899px) { .nav-logo { width: 165px !important; height: 165px !important; } }
@media (min-width: 900px) and (max-width: 1199px) { .nav-logo { width: 170px !important; height: 170px !important; } }
@media (min-width: 1200px) { .nav-logo { width: 185px !important; height: 185px !important; } }
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
      <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .7 }} />
      <span style={{ fontFamily: "var(--sans)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-dim)", fontWeight: 400 }}>{label}</span>
    </div>
  );
}

/* ═══ NAVBAR ═══ */
function Navbar({ onEnquire }) {
  const bp = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  const links = ["Story", "Gallery", "Amenities", "Floor Plans", "Price List", "Location"];

  const logoSize = bp.isXs ? 130 : bp.isMobile ? 145 : bp.isTablet ? 165 : scrolled ? 170 : 185;
  const navHeight = scrolled ? 80 : bp.isXs ? 90 : bp.isMobile ? 96 : 110;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,11,9,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,.1)" : "none",
        transition: "all .5s ease"
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          /* ── CHANGE 1: reduce left padding so logo sits flush left ── */
          padding: bp.isXs ? "0 .5rem 0 .5rem" : bp.isMobile ? "0 1.25rem 0 .5rem" : "0 2rem 0 .75rem",
          height: navHeight, display: "flex", alignItems: "center",
          justifyContent: "space-between", transition: "height .4s ease"
        }}>
          {/* Logo — pushed to far left */}
          <div style={{ display: "flex", alignItems: "center", zIndex: 110, marginLeft: 0, flexShrink: 0 }}>
            <img
              src="/logo1.png"
              alt="Anant Raj Limited"
              className="nav-logo"
              style={{
                width: logoSize,
                height: logoSize,
                objectFit: "contain",
                transition: "width .4s ease, height .4s ease",
                filter: "drop-shadow(0 2px 8px rgba(201,169,110,.25))",
                display: "block",
              }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {/* Desktop nav links */}
          {bp.isDesktop && (
            <div style={{ display: "flex", gap: bp.isLg ? "1.75rem" : "2.5rem", alignItems: "center" }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
                  style={{ fontFamily: "var(--sans)", fontSize: bp.isLg ? ".6rem" : ".64rem", fontWeight: 300, letterSpacing: ".18em", textTransform: "uppercase", color: "#fff", textDecoration: "none", transition: "color .2s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.color = "#fff"}>{l}</a>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 110 }}>
            {bp.isDesktop && (
              <button onClick={onEnquire}
                style={{ background: "transparent", border: "1px solid var(--gold-dim)", color: "#fff", fontFamily: "var(--sans)", fontSize: bp.isLg ? ".6rem" : ".63rem", fontWeight: 400, letterSpacing: ".2em", textTransform: "uppercase", padding: bp.isLg ? "8px 18px" : "9px 22px", cursor: "pointer", transition: "all .25s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--warm-black)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--gold-dim)"; }}>
                Brochure
              </button>
            )}
            {bp.isMobile && !open && (
              <a href="tel:+919205974843"
                style={{ fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".06em", color: "var(--gold)", textDecoration: "none", marginRight: 4, display: bp.isXs ? "none" : "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: ".8rem" }}>📞</span><span>Call</span>
              </a>
            )}
            {!bp.isDesktop && (
              <button onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"}
                style={{ background: "none", border: "none", padding: "8px 4px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, zIndex: 110 }}>
                <div style={{ width: 24, height: 1.5, background: open ? "var(--gold)" : "#fff", transition: "all .3s", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                <div style={{ width: 16, height: 1.5, background: "#fff", opacity: open ? 0 : 1, transition: "opacity .3s" }} />
                <div style={{ width: 24, height: 1.5, background: open ? "var(--gold)" : "#fff", transition: "all .3s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {!bp.isDesktop && open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 105, background: "rgba(12,11,9,.98)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.75rem", animation: "fadeIn .25s ease", paddingBottom: "env(safe-area-inset-bottom, 2rem)" }}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute", top: "1.25rem", right: "1rem",
              background: "rgba(201,169,110,.08)",
              border: "1px solid rgba(201,169,110,.25)",
              color: "var(--gold)",
              width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "1.35rem", lineHeight: 1,
              borderRadius: 2, zIndex: 115,
              fontFamily: "var(--sans)", fontWeight: 300,
              transition: "all .2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--warm-black)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,169,110,.08)"; e.currentTarget.style.color = "var(--gold)"; }}
          >
            ×
          </button>

          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : bp.isTablet ? "2.2rem" : "1.8rem", color: "var(--cream)", textDecoration: "none", letterSpacing: ".02em" }}>{l}</a>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,.25)", margin: "0.25rem 0" }} />
          <button onClick={() => { setOpen(false); onEnquire(); }}
            style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: "16px 48px", cursor: "pointer", marginTop: "0.5rem" }}>
            Brochure
          </button>
          <a href="tel:+919205974843" onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".1em" }}>
            <span style={{ color: "var(--gold)", opacity: .6 }}>◉</span>+91 9205974843
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
  const slides = ["/banner/7.png", "/banner/8.png", "/banner/9.png"];

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % 3), 5500);
    return () => clearInterval(t);
  }, []);

  const headingSize = bp.isXs ? "1.85rem" : bp.isMobile ? "2.3rem" : bp.isTablet ? "3.2rem" : "clamp(3.8rem,6.5vw,6.5rem)";
  const subSize = bp.isXs ? ".72rem" : bp.isMobile ? ".78rem" : bp.isTablet ? ".84rem" : ".9rem";

  const FormSmall = () => (
    <div style={{ background: "rgba(22,20,16,.92)", backdropFilter: "blur(40px)", border: "1px solid rgba(201,169,110,.15)", maxWidth: bp.isTablet ? 560 : "100%", margin: "0 auto", width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }].map((f, i) => (
          <div key={i} style={{
            padding: bp.isTablet ? "14px 18px" : "12px 14px",
            borderRight: i === 0 ? "1px solid rgba(201,169,110,.12)" : "none",
            borderBottom: "1px solid rgba(201,169,110,.12)"
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3, fontWeight: 400 }}>{f.label}</div>
            <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", width: "100%", fontSize: bp.isTablet ? ".8rem" : ".72rem" }} />
          </div>
        ))}
      </div>
      <div style={{ padding: bp.isTablet ? "14px 18px" : "11px 14px", borderBottom: "1px solid rgba(201,169,110,.12)" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3, fontWeight: 400 }}>Email</div>
        <input placeholder="you@email.com" style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: bp.isTablet ? ".8rem" : ".72rem", width: "100%" }} />
      </div>
      <button style={{ width: "100%", padding: bp.isTablet ? "14px" : "12px", background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer" }}>
        Register Your Interest Now
      </button>
    </div>
  );

  const heroHeight = "100svh";

  /* ── CHANGE 2: Increased mobile nav clearance for more top padding ── */
  const mobileNavClearance = bp.isXs ? 150 : bp.isMobile ? 160 : 0;

  /* ── CHANGE 2b: Desktop top offset — push content slightly toward top ── */
  const desktopTopOffset = bp.isTablet ? "48%" : "47%";

  return (
    <section style={{ position: "relative", height: heroHeight, minHeight: bp.isXs ? 680 : bp.isMobile ? 720 : 560, overflow: "hidden", background: "var(--warm-black)" }}>
      {slides.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 1.5s ease" }}>
          <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: i === slide ? "scale(1.03)" : "scale(1)", transition: "transform 6s ease-out" }} alt="" />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,7,6,.35) 10%, rgba(8,7,6,.5) 35%, rgba(8,7,6,.58) 75%, rgba(8,7,6,.68) 100%)" }} />
      {bp.isMobile && <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,6,.3)" }} />}

      {!bp.isMobile && (
        <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: 2, height: i === slide ? 24 : 10, background: i === slide ? "var(--gold)" : "rgba(201,169,110,.55)", border: "none", cursor: "pointer", borderRadius: 1, padding: 0, transition: "all .4s" }} />
          ))}
        </div>
      )}

      {/* Hero content */}
      {bp.isMobile ? (
        /* ── MOBILE: more top padding to clear navbar properly ── */
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
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".48rem" : ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 300, textShadow: "0 1px 8px rgba(0,0,0,.8)", textAlign: "center" }}>
                Part of 200-Acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 16, height: 1, background: "#fff", opacity: .9 }} />
            </div>

            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: bp.isXs ? 8 : 12, textShadow: "0 2px 24px rgba(0,0,0,.9), 0 4px 48px rgba(0,0,0,.7)" }}>
              <span style={{ display: "block" }}>Anant Raj –</span>
              <span style={{ display: "block", color: "var(--gold-light)" }}>Luxury Residences</span>
            </h1>

            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.85)", maxWidth: bp.isXs ? 300 : 340, lineHeight: 1.65, marginBottom: bp.isXs ? 8 : 12, textShadow: "0 1px 12px rgba(0,0,0,.8)" }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 200-Acre Township in Sector 63A, Gurugram.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.3)", padding: "6px 16px", marginBottom: bp.isXs ? 14 : 18 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "goldPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".5rem" : ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>

          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
            <FormSmall />
          </div>
        </div>
      ) : (
        /* ── TABLET / DESKTOP: shifted upward with paddingTop for nav clearance ── */
        <div style={{
          position: "absolute",
          top: desktopTopOffset,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%", maxWidth: 1400,
          padding: bp.isTablet ? "0 2rem" : "0 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          /* ── paddingTop ensures content never goes behind the navbar ── */
          paddingTop: bp.isTablet ? "100px" : "120px",
        }}>
          <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 300, textShadow: "0 1px 8px rgba(0,0,0,.8)", textAlign: "center" }}>
                Part of 200-Acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
            </div>

            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 20, textShadow: "0 2px 24px rgba(0,0,0,.9), 0 4px 48px rgba(0,0,0,.7)" }}>
              <span style={{ display: "block" }}>Anant Raj –</span>
              <span style={{ display: "block", color: "var(--gold-light)" }}>Luxury Residences</span>
            </h1>

            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.85)", maxWidth: bp.isTablet ? 480 : 520, lineHeight: 1.8, marginBottom: 20, textShadow: "0 1px 12px rgba(0,0,0,.8)" }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 200-Acre Township in Sector 63A, Gurugram.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.3)", padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "goldPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>

          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
            {bp.isTablet && <FormSmall />}
            {bp.isDesktop && (
              <div style={{ display: "grid", gridTemplateColumns: bp.isLg ? "1fr 1fr 1fr auto" : "1fr 1fr 1fr auto", gap: 0, background: "rgba(22,20,16,.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(201,169,110,.15)", maxWidth: bp.isLg ? 680 : 720, margin: "0 auto" }}>
                {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }, { label: "Email", ph: "you@email.com" }].map((f, i) => (
                  <div key={i} style={{ padding: bp.isLg ? "12px 14px" : "14px 18px", borderRight: "1px solid rgba(201,169,110,.1)" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3, fontWeight: 400 }}>{f.label}</div>
                    <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".8rem", width: "100%" }} />
                  </div>
                ))}
                <button style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "0 22px", cursor: "pointer", whiteSpace: "nowrap" }}>Register Now</button>
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
  const acres = useCountUp(5, 1200, started);
  const towers = useCountUp(2, 1500, started);
  const headingSize = bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : bp.isTablet ? "2.8rem" : "clamp(2.5rem,4vw,4.5rem)";

  return (
    <section id="story" ref={ref} style={{ background: "var(--warm-black)", padding: `${vPad(bp)} 0` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        {/* ── CHANGE 4: equal 1fr 1fr columns, same gap, vertically centered ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr",
          gap: bp.isXs ? 32 : bp.isMobile ? 36 : bp.isTablet ? 48 : 64,
          alignItems: "center",
        }}>
          {!bp.isMobile && (
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -18, left: -18, width: 160, height: 160, border: "1px solid rgba(201,169,110,.1)", zIndex: 0 }} />
                {/* ── image fills equal column width, fixed aspect ratio ── */}
                <div style={{ position: "relative", zIndex: 1, aspectRatio: "4/5", overflow: "hidden", width: "100%" }}>
                  <img
                    src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    alt="Interior"
                  />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 56, height: 56, borderTop: "1px solid var(--gold)", borderLeft: "1px solid var(--gold)", opacity: .4 }} />
                </div>
                <div style={{ position: "absolute", bottom: 36, right: -28, zIndex: 2, background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.2)", padding: "12px 20px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4, fontWeight: 400 }}>Registered</div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <Eyebrow label="The Story" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 400, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              Designed for those<br /><span style={{ color: "var(--gold-light)" }}>who seek perfection</span>
            </h2>
            <div style={{ width: 48, height: 1, background: "var(--gold)", opacity: .4, marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.55)", lineHeight: 2, marginBottom: "1.25rem" }}>
              An exclusive upcoming residential development by Anant Raj Limited, located in the prime area of Sector 63A, Gurugram. Part of a large 200-acre integrated township, this premium project is spread across 5 acres and features 2 luxury residential towers designed by international architects.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2, marginBottom: "2.5rem" }}>
              Premium low-density living in the vicinity of Golf Course Extension Road — a rare collaboration between global design vision and Indian craftsmanship, delivering modern luxury residences of unparalleled distinction.
            </p>

            {bp.isMobile && (
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: "1.5rem" }}>
                <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" alt="Luxury Interior" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(22,20,16,.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(201,169,110,.25)", padding: "8px 14px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 3, fontWeight: 400 }}>Registered</div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: "1px solid rgba(201,169,110,.1)", paddingTop: "1.75rem" }}>
              {[{ val: units, label: "Residences" }, { val: acres, label: "Acres" }, { val: towers, label: "Towers" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(201,169,110,.1)" : "none", padding: bp.isXs ? "0 .5rem" : "0 1rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.5rem" : "3.5rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>{s.val}</div>
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
    <div style={{ position: "relative", overflow: "hidden", background: "var(--warm-dark)", padding: bp.isXs ? "52px 1rem" : bp.isMobile ? "64px 1.25rem" : bp.isTablet ? "80px 2rem" : "100px 2rem", borderTop: "1px solid rgba(201,169,110,.08)", borderBottom: "1px solid rgba(201,169,110,.08)" }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .12 }} alt="" />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--serif)", fontSize, fontWeight: 400, color: "var(--cream)", lineHeight: 1.15, maxWidth: 860, margin: "0 auto 1.5rem" }}>
            Where world-class design meets<br />the soul of Sector 63A, Gurugram.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".54rem" : ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-dim)", fontWeight: 400 }}>Exclusive pre-launch pricing available now</span>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
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
  const imgs = [
    { src: "https://i.pinimg.com/1200x/e3/59/c5/e359c5ab551953ba3042ca76cd8fe43d.jpg", label: "Living Spaces" },
    { src: "https://i.pinimg.com/1200x/7a/b0/d6/7ab0d627b61c9e61c9ba4bf393f0a43e.jpg", label: "Master Suite" },
    { src: "https://i.pinimg.com/1200x/e6/6e/78/e66e78086b77ad918568e2a8fe9bc4cb.jpg", label: "Kitchen" },
    { src: "https://i.pinimg.com/736x/7f/04/1d/7f041dcb7c855330a5f05e05725da695.jpg", label: "Clubhouse" },
    { src: "https://i.pinimg.com/1200x/c8/a8/c0/c8a8c03a010d086093db9410ccb89ae0.jpg", label: "Pool Deck" },
  ];

  let gridItems, cols, rowDef;
  if (bp.isXs) {
    gridItems = imgs.map((img, i) => ({ ...img, col: "1/2", row: `${i + 1}/${i + 2}` }));
    cols = "1fr"; rowDef = "repeat(5,180px)";
  } else if (bp.isMobile) {
    gridItems = [{ ...imgs[0], col: "1/3", row: "1/2" }, { ...imgs[1], col: "1/2", row: "2/3" }, { ...imgs[2], col: "2/3", row: "2/3" }, { ...imgs[3], col: "1/2", row: "3/4" }, { ...imgs[4], col: "2/3", row: "3/4" }];
    cols = "1fr 1fr"; rowDef = "repeat(3,190px)";
  } else if (bp.isTablet) {
    gridItems = [{ ...imgs[0], col: "1/3", row: "1/2" }, { ...imgs[1], col: "1/2", row: "2/3" }, { ...imgs[2], col: "2/3", row: "2/3" }, { ...imgs[3], col: "1/2", row: "3/4" }, { ...imgs[4], col: "2/3", row: "3/4" }];
    cols = "1fr 1fr"; rowDef = "repeat(3,210px)";
  } else {
    gridItems = [{ ...imgs[0], col: "1/3", row: "1/3" }, { ...imgs[1], col: "3/4", row: "1/2" }, { ...imgs[2], col: "3/4", row: "2/3" }, { ...imgs[3], col: "1/3", row: "3/4" }, { ...imgs[4], col: "3/4", row: "3/4" }];
    cols = "repeat(3,1fr)"; rowDef = "repeat(3,220px)";
  }

  return (
    <section id="gallery" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <Eyebrow label="Gallery" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.1 }}>
            A glimpse of <span style={{ color: "var(--gold-light)" }}>elegance</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rowDef, gap: bp.isXs ? 4 : 5 }}>
          {gridItems.map((img, i) => {
            const isClicked = clicked === i; const isHovered = hov === i;
            return (
              <div key={i} style={{ gridColumn: img.col, gridRow: img.row, position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => setClicked(clicked === i ? null : i)}>
                <img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .8s cubic-bezier(.16,1,.3,1)", transform: isHovered ? "scale(1.06)" : "scale(1)" }} alt={img.label} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.75) 0%, rgba(12,11,9,.2) 40%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: bp.isXs ? "10px 12px" : "14px 18px", pointerEvents: "none", display: "flex", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 1, background: "var(--gold)", opacity: isHovered ? 1 : 0.5, transition: "opacity .3s" }} />
                    <span style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1.1rem", color: isHovered ? "#fff" : "rgba(245,240,232,.7)", transition: "color .3s" }}>{img.label}</span>
                  </div>
                </div>
                {isClicked && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, animation: "fadeIn .25s ease", width: "100%", display: "flex", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "rgba(12,11,9,.85)", border: "1px solid var(--gold)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: bp.isXs ? "9px 20px" : "11px 28px", cursor: "pointer", backdropFilter: "blur(12px)", whiteSpace: "nowrap" }}>
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
    <section id="amenities" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "80vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "2.5rem" : "4rem", gap: "1.5rem" }}>
            <div>
              <Eyebrow label="Amenities" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--cream)", lineHeight: 1.05 }}>
                Curated for an<br /><span style={{ color: "var(--gold-light)" }}>exceptional life</span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: bp.isMobile ? "flex-start" : "flex-end" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.4rem" : "3.2rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>20,000</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400 }}>sq.ft of World-Class Amenities</div>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 2 : 3 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="amenity-card" style={{
                position: "relative", padding: bp.isXs ? "1.25rem 1rem" : bp.isMobile ? "1.5rem 1.25rem" : "2rem 1.75rem",
                background: "rgba(12,11,9,.6)", border: "1px solid rgba(201,169,110,.07)", cursor: "default",
                transition: "all .4s ease", minHeight: bp.isXs ? 130 : bp.isMobile ? 160 : 200,
                display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div className="amenity-num" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.1rem" : "1.4rem", color: "var(--gold)", fontWeight: 400, opacity: 0.25, transition: "opacity .4s ease", lineHeight: 1 }}>{item.num}</div>
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1.1rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".35rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".68rem", fontWeight: 300, color: "rgba(232,228,220,.35)", lineHeight: 1.65, marginBottom: ".75rem" }}>{item.desc}</p>
                  <div className="amenity-line" />
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderBottom: "1px solid rgba(201,169,110,.15)", borderLeft: "1px solid rgba(201,169,110,.15)" }} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 0, marginTop: bp.isXs ? "2rem" : "3rem", borderTop: "1px solid rgba(201,169,110,.1)", borderBottom: "1px solid rgba(201,169,110,.1)" }}>
            {[
              { val: "2", unit: "Towers", sub: "Luxury Residential" },
              { val: "5", unit: "Acres", sub: "Landscaped Grounds" },
              { val: "3", unit: "Levels", sub: "Podium Amenities" },
              { val: "100%", unit: "Backup", sub: "Power & Water" },
            ].map((stat, i) => (
              <div key={i} style={{ padding: bp.isXs ? "1.25rem .75rem" : "1.75rem 2rem", borderRight: i < 3 ? "1px solid rgba(201,169,110,.08)" : "none", textAlign: "center", background: i % 2 === 0 ? "rgba(201,169,110,.02)" : "transparent" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "2.5rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1 }}>{stat.val}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--cream)", opacity: .7, marginTop: 4, fontWeight: 400 }}>{stat.unit}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 3, fontWeight: 300 }}>{stat.sub}</div>
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
    <section id="price-list" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)", borderTop: "1px solid rgba(201,169,110,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>

        <Reveal>
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "2.5rem" : "3.5rem" }}>
            <Eyebrow label="Pricing" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.2rem" : bp.isMobile ? "2.8rem" : "clamp(2.5rem,5vw,4.5rem)", fontWeight: 400, color: "var(--cream)", lineHeight: 1, marginBottom: ".5rem" }}>
              Price List
            </h2>
          </div>
        </Reveal>

        {/* ── CHANGE 3: equal 1fr 1fr columns ── */}
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 28 : 24, alignItems: "stretch" }}>

          <Reveal>
            <div style={{ background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.12)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: bp.isXs ? "1.25rem 1.5rem" : "1.75rem 2.5rem", borderBottom: "1px solid rgba(201,169,110,.1)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.3rem" : "1.7rem", fontWeight: 400, color: "var(--cream)", marginBottom: 0 }}>Property Investment Plans</h3>
              </div>

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr 1fr" : "1fr 1.2fr 1fr auto", gap: 0, borderBottom: "1px solid rgba(201,169,110,.08)", padding: bp.isXs ? "10px 1.5rem" : "12px 2.5rem", background: "rgba(201,169,110,.03)" }}>
                {(bp.isXs ? ["TYPE", "PRICE"] : ["TYPE", "AREA", "PRICE", ""]).map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", fontWeight: 500 }}>{h}</div>
                ))}
              </div>

              {units.map((u, i) => (
                <div key={i} className="price-row"
                  style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr 1fr" : "1fr 1.2fr 1fr auto", gap: 0, alignItems: "center", padding: bp.isXs ? "1rem 1.5rem" : "1.25rem 2.5rem", borderBottom: i < units.length - 1 ? "1px solid rgba(201,169,110,.06)" : "none", transition: "background .2s", cursor: "pointer", background: "transparent" }}
                  onClick={onEnquire}>
                  <div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.15rem", fontWeight: 400, color: "var(--cream)" }}>{u.type}</div>
                    {bp.isXs && <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 300 }}>{u.area}</div>}
                  </div>
                  {!bp.isXs && (
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "rgba(232,228,220,.45)" }}>{u.area}</div>
                  )}
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".82rem", fontWeight: 400, color: "var(--gold)" }}>{u.price}</div>
                  {!bp.isXs && (
                    <button className="details-btn" onClick={e => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "transparent", border: "1px solid rgba(201,169,110,.3)", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: ".56rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "9px 18px", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
                      Details
                    </button>
                  )}
                </div>
              ))}

              <div style={{ padding: bp.isXs ? "1rem 1.5rem 1.5rem" : "1.25rem 2.5rem 2rem", borderTop: "1px solid rgba(201,169,110,.08)", marginTop: "auto" }}>
                <button onClick={onEnquire}
                  style={{ width: "100%", padding: bp.isXs ? "13px" : "16px", background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  Complete Costing Details
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            {/* ── right column: equal height, image fills full column ── */}
            <div style={{ position: "relative", overflow: "hidden", height: "100%", minHeight: bp.isXs ? 200 : bp.isMobile ? 260 : 360 }}>
              <img
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(80%)", display: "block", position: "absolute", inset: 0 }}
                alt="Price List"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.3) 0%, rgba(0,0,0,.65) 100%)" }} />
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
    <section id="price-configuration" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)", borderTop: "1px solid rgba(201,169,110,.1)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>

        <Reveal>
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "2rem" : "3rem" }}>
            <Eyebrow label="Configuration" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2rem" : bp.isMobile ? "2.8rem" : "clamp(2.5rem,5vw,4.5rem)", fontWeight: 400, color: "var(--cream)", lineHeight: 1 }}>
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
                  style={{ background: activeUnit === i ? "rgba(201,169,110,.12)" : "transparent", border: activeUnit === i ? "1px solid rgba(201,169,110,.4)" : "1px solid rgba(201,169,110,.1)", color: activeUnit === i ? "var(--cream)" : "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: activeUnit === i ? 500 : 300, letterSpacing: ".08em", padding: "9px 20px", cursor: "pointer", transition: "all .2s" }}>
                  {u.type}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 24 : 20 }}>

          <Reveal>
            <div style={{ background: "var(--warm-black)", border: "1px solid rgba(201,169,110,.12)", padding: bp.isXs ? "1.5rem" : "2.5rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: bp.isDesktop ? 420 : "auto" }}>
              <div>
                {bp.isMobile && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {unitTypes.map((u, i) => (
                        <button key={i}
                          onClick={() => setActiveUnit(i)}
                          style={{ background: activeUnit === i ? "var(--gold)" : "transparent", border: "1px solid rgba(201,169,110,.25)", color: activeUnit === i ? "var(--warm-black)" : "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".58rem", fontWeight: 400, padding: "6px 12px", cursor: "pointer", borderRadius: 20, transition: "all .2s" }}>
                          {u.type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.6rem" : "2.2rem", fontWeight: 400, color: "var(--cream)", lineHeight: 1.1, marginBottom: ".4rem" }}>{unitTypes[activeUnit].type}</h3>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 300, color: "var(--gold)", marginBottom: "1.75rem", letterSpacing: ".04em" }}>{unitTypes[activeUnit].subLabel}</div>

                <div style={{ marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid rgba(201,169,110,.08)" }}>
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Super Area</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 400, color: "var(--cream)" }}>{unitTypes[activeUnit].area}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Price</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: "1rem", fontWeight: 500, color: "var(--gold)" }}>On Request</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: ".85rem", marginBottom: "2rem" }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 16, height: 16, border: `1.5px solid ${i === 2 ? "rgba(201,169,110,.4)" : "var(--gold)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 6, height: 4, borderLeft: `2px solid ${i === 2 ? "rgba(201,169,110,.4)" : "var(--gold)"}`, borderBottom: `2px solid ${i === 2 ? "rgba(201,169,110,.4)" : "var(--gold)"}`, transform: "rotate(-45deg) translate(1px,-1px)" }} />
                      </div>
                      <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".78rem", fontWeight: 300, color: i === 2 ? "var(--text-dim)" : "rgba(232,228,220,.7)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={onEnquire}
                style={{ width: "100%", padding: bp.isXs ? "13px" : "16px", background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Get Pricing Details <span style={{ fontSize: "1rem" }}>↓</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ background: "var(--warm-black)", border: "1px solid rgba(201,169,110,.12)", padding: bp.isXs ? "1.5rem" : "2.5rem", height: "100%", minHeight: bp.isDesktop ? 420 : "auto" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : "1.8rem", fontWeight: 400, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1.75rem" }}>
                Construction Linked Payment
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {visibleSchedule.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: bp.isXs ? "12px 0" : "14px 0", borderBottom: i < visibleSchedule.length - 1 ? "1px solid rgba(201,169,110,.07)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 3, height: 20, background: "rgba(201,169,110,.25)", borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".8rem", fontWeight: 300, color: "rgba(232,228,220,.55)" }}>{item.milestone}</div>
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".82rem" : ".9rem", fontWeight: 500, color: "var(--gold)", letterSpacing: ".03em", flexShrink: 0, marginLeft: 12 }}>{item.percent}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowFullSchedule(v => !v)}
                style={{ marginTop: "1.25rem", background: "none", border: "none", fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 400, color: "var(--gold)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0, letterSpacing: ".03em" }}>
                {showFullSchedule ? "Hide Schedule" : "View Full Schedule"}
                <span style={{ fontSize: ".9rem", transition: "transform .3s", transform: showFullSchedule ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
              </button>

              <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.1)" }}>
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
    <section id="location" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "2rem" : "3.5rem", gap: "1rem" }}>
            <div>
              <Eyebrow label="Location" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--cream)", lineHeight: 1.05 }}>
                Strategic <span style={{ color: "var(--gold-light)" }}>connectivity</span>
              </h2>
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 300, color: "rgba(232,228,220,.4)", maxWidth: 320, lineHeight: 1.9 }}>
              Sector 63A, Gurugram — prime vicinity of Golf Course Extension Road, connected to the city's best.
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1.2fr" : "1fr", gap: bp.isDesktop ? 4 : 32 }}>
          <Reveal>
            <div style={{ background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.1)", overflow: "hidden" }}>
              <div style={{ padding: bp.isXs ? "1rem 1.25rem" : "1.25rem 2rem", borderBottom: "1px solid rgba(201,169,110,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--gold-dim)", fontWeight: 400 }}>Distances from Site</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animation: "goldPulse 2s infinite" }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 300 }}>Sector 63A</span>
                </div>
              </div>

              {landmarks.map((lm, i) => (
                <div key={i} className="landmark-row" style={{
                  display: "grid",
                  gridTemplateColumns: bp.isXs ? "1fr auto" : "1fr auto auto",
                  alignItems: "center",
                  gap: bp.isXs ? "8px 12px" : "12px 16px",
                  padding: bp.isXs ? ".9rem 1.25rem" : "1rem 2rem",
                  borderBottom: i < landmarks.length - 1 ? "1px solid rgba(201,169,110,.06)" : "none",
                  transition: "background .25s ease",
                  cursor: "default",
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".7rem" : ".78rem", fontWeight: 300, color: "rgba(232,228,220,.7)", lineHeight: 1.3 }}>{lm.name}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 2, fontWeight: 400 }}>{lm.category}</div>
                  </div>
                  {!bp.isXs && (
                    <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".15em", textTransform: "uppercase", padding: "3px 8px", background: "rgba(201,169,110,.06)", color: "var(--text-dim)", whiteSpace: "nowrap", fontWeight: 400 }}>{lm.category}</span>
                  )}
                  <div className="landmark-dist" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.1rem", color: "var(--gold)", flexShrink: 0, textAlign: "right" }}>{lm.dist}</div>
                </div>
              ))}

              <div style={{ padding: bp.isXs ? "1rem 1.25rem" : "1.25rem 2rem", background: "rgba(201,169,110,.04)", borderTop: "1px solid rgba(201,169,110,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 2, fontWeight: 400 }}>Site Address</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".75rem", fontWeight: 300, color: "rgba(232,228,220,.6)" }}>Sector 63A, Gurugram, Haryana — 122101</div>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                  style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontWeight: 400 }}>
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
                style={{ display: "block", filter: "grayscale(100%) invert(92%) contrast(85%) brightness(55%)", border: "none", position: "absolute", inset: 0 }}
                loading="lazy" title="Location"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(12,11,9,.4) 0%, transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--gold)", animation: "pulse-ring 2s ease-out infinite", width: 20, height: 20 }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--gold)", border: "3px solid var(--warm-black)", position: "relative", zIndex: 1, boxShadow: "0 0 0 2px rgba(201,169,110,.4)" }} />
              </div>
              <div style={{ position: "absolute", top: bp.isXs ? "0.75rem" : "1rem", left: bp.isXs ? "0.75rem" : "1rem", zIndex: 3, background: "rgba(12,11,9,.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(201,169,110,.2)", padding: bp.isXs ? "8px 12px" : "10px 16px" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3, fontWeight: 400 }}>Project Location</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".9rem" : "1rem", color: "var(--cream)", fontWeight: 400 }}>Sector 63A, Gurugram</div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, background: "rgba(12,11,9,.92)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(201,169,110,.12)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[{ label: "IGI Airport", val: "22 km" }, { label: "Golf Course Ext Rd", val: "2 km" }, { label: "NH-48", val: "5 km" }].map((s, i) => (
                  <div key={i} style={{ padding: bp.isXs ? ".75rem .875rem" : "1rem 1.25rem", borderRight: i < 2 ? "1px solid rgba(201,169,110,.08)" : "none", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".95rem" : "1.1rem", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".44rem" : ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 3, fontWeight: 300 }}>{s.label}</div>
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

/* ═══ CONTACT ═══ */
function ContactSection({ onEnquire }) {
  const bp = useBreakpoint();
  return (
    <section style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)", borderTop: "1px solid rgba(201,169,110,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 80 : 40, alignItems: "center" }}>
          <Reveal>
            <Eyebrow label="Visit Us" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 400, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.05 }}>
              The experience <span style={{ color: "var(--gold-light)" }}>awaits you</span>
            </h2>
            {[
              { icon: "◈", title: "Site Address", lines: ["Sector 63A, Gurugram", "Haryana — 122101"] },
              { icon: "◉", title: "Sales", lines: ["+91 92059 74843"] },
              { icon: "◌", title: "Email", lines: ["info@anantrajsector63a.com"] },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "var(--gold)", fontSize: "1rem", marginTop: 2, opacity: .6, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6, fontWeight: 400 }}>{c.title}</div>
                  {c.lines.map((line, j) => <div key={j} style={{ fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, color: "rgba(232,228,220,.6)", lineHeight: 1.8 }}>{line}</div>)}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ background: "var(--warm-black)", border: "1px solid rgba(201,169,110,.12)", padding: bp.isXs ? "1.5rem 1.25rem" : bp.isMobile ? "1.75rem" : "3rem", position: "relative", overflow: "hidden", marginTop: bp.isDesktop ? 0 : "1rem" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, borderBottom: "1px solid rgba(201,169,110,.15)", borderLeft: "1px solid rgba(201,169,110,.15)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : "2rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".4rem" }}>Register Your Interest</h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", color: "var(--text-dim)", marginBottom: "2rem", fontWeight: 300 }}>Get exclusive pre-launch pricing, floor plans & booking details.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {["Full Name", "Phone Number", "Email Address"].map(ph => (
                  <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.15)", paddingBottom: ".75rem" }}>
                    <input placeholder={ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }} />
                  </div>
                ))}
                <button onClick={onEnquire} style={{ width: "100%", padding: 14, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer" }}>
                  Register Your Interest Now
                </button>
                <p style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", letterSpacing: ".1em", fontWeight: 300 }}>We respect your privacy.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══ SIDEBAR ═══ */
function Sidebar() {
  return (
    <div style={{ position: "sticky", top: 80, padding: "2rem 1.5rem", background: "var(--warm-dark)", borderLeft: "1px solid rgba(201,169,110,.08)", height: "calc(100vh - 80px)", overflowY: "auto" }}>
      <div style={{ borderBottom: "1px solid rgba(201,169,110,.1)", paddingBottom: "1.75rem", marginBottom: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: ".4rem", fontWeight: 400 }}>Configuration</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--gold)", lineHeight: 1.2 }}>3 BHK & 3 BHK + Study</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", color: "var(--text-dim)", marginTop: 6, letterSpacing: ".05em", fontWeight: 300 }}>2,300 – 2,600 sq.ft</div>
        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,169,110,.1)", padding: "4px 10px" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", animation: "goldPulse 2s infinite" }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: ".48rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 400 }}>Coming Soon</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
        {["Full Name", "Email", "Phone"].map(ph => (
          <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.12)", paddingBottom: ".75rem" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6, fontWeight: 400 }}>{ph}</div>
            <input placeholder={`Enter ${ph}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, width: "100%" }} />
          </div>
        ))}
      </div>
      <button style={{ width: "100%", padding: 12, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer", marginBottom: "2rem" }}>
        Register Interest
      </button>
      <div style={{ borderTop: "1px solid rgba(201,169,110,.08)", paddingTop: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem", fontWeight: 400 }}>Speak to an Expert</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, border: "1px solid rgba(201,169,110,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".9rem" }}>📞</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, color: "rgba(232,228,220,.7)" }}>+91 92059 74843</div>
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
    "Project": ["Overview", "Floor Plans", "Price List", "Gallery", "Amenities"],
    "Company": ["About Anant Raj", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };
  const gridCols = bp.isXs ? "1fr 1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr";
  return (
    <footer style={{ background: "#080706", borderTop: "1px solid rgba(201,169,110,.08)", padding: bp.isXs ? "48px 1rem 28px" : bp.isMobile ? "56px 1.25rem 32px" : "72px 2rem 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 28 : bp.isMobile ? 24 : 48, marginBottom: 48 }}>
          <div style={{ gridColumn: bp.isXs ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 18, height: 1, background: "var(--gold)" }} />
                <div style={{ width: 10, height: 1, background: "var(--gold)", opacity: .5 }} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400, color: "var(--gold-light)" }}>Anant Raj Limited</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9, marginBottom: "1.25rem", maxWidth: 260 }}>
              An exclusive luxury residential development in Sector 63A, Gurugram — part of a 200-acre integrated township by Anant Raj Limited.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fb", "Tw", "In", "Li"].map(s => (
                <a key={s} href="#" style={{ width: 30, height: 30, border: "1px solid rgba(201,169,110,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", textDecoration: "none", fontWeight: 400 }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: "1.2rem", fontWeight: 500 }}>{group}</div>
              <ul style={{ listStyle: "none" }}>
                {items.map(item => (<li key={item} style={{ marginBottom: ".65rem" }}><a href="#" style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "var(--text-dim)", textDecoration: "none" }}>{item}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(201,169,110,.06)", paddingTop: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--gold)", fontWeight: 300 }}>© 2026 Anant Raj Limited. All Rights Reserved.</p>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "rgba(90,82,72,.35)", fontWeight: 300 }}>RERA Reg. No. HRERA/GGM/2024/63A/001</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══ DISCLAIMER ═══ */
function Disclaimer() {
  const bp = useBreakpoint();
  return (
    <div style={{ background: "#060504", borderTop: "1px solid rgba(201,169,110,.06)", padding: bp.isXs ? "1.75rem 1rem" : bp.isMobile ? "2rem 1.25rem" : "2.5rem 2rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: "1rem" }}>
          <div style={{ width: 1, background: "var(--gold-dim)", opacity: .3, alignSelf: "stretch", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--gold)", opacity: .6, marginBottom: ".6rem", fontWeight: 400 }}>Legal Disclaimer</div>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "rgba(122,114,104,.95)", lineHeight: 1.9, marginBottom: ".6rem" }}>
              This website has been prepared solely for informational purposes and does not constitute an offer, invitation, or inducement to invest in or purchase any property. The content, images, floor plans, specifications, amenities, pricing, and other details mentioned herein are tentative and indicative only.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "rgba(122,114,104,.95)", lineHeight: 1.9 }}>
              Prospective buyers are advised to independently verify all details with the relevant government authorities and consult their legal and financial advisors before making any purchase decision. Anant Raj Limited shall not be liable for any claims arising out of reliance on the information provided.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(201,169,110,.04)", paddingTop: ".75rem", display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
          {["Privacy Policy", "Terms of Use", "Cookie Policy", "RERA Details"].map(link => (
            <a key={link} href="#" style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "rgba(122,114,104,.35)", textDecoration: "none", letterSpacing: ".08em", fontWeight: 300 }}>{link}</a>
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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.88)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn .3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--warm-dark)", width: "100%", maxWidth: 500, border: "1px solid rgba(201,169,110,.15)", position: "relative", maxHeight: "92svh", overflowY: "auto" }}>
        <div style={{ height: 2, background: "linear-gradient(to right, var(--gold-dim), var(--gold), var(--gold-dim))" }} />
        <div style={{ padding: bp.isXs ? "1.5rem 1.25rem" : bp.isMobile ? "1.75rem" : "3rem" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          <Eyebrow label="Register Interest" />
          <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.6rem" : "2.4rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".4rem" }}>Get Pre-Launch Access</h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", color: "var(--text-dim)", marginBottom: "2rem", fontWeight: 300 }}>Exclusive pre-launch pricing, floor plans & booking details. Our team will reach out within 24 hours.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {["Full Name", "Phone Number", "Email Address"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.15)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 8, fontWeight: 400 }}>{ph}</div>
                <input placeholder={`Enter your ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".85rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
            <button style={{ width: "100%", padding: 14, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer" }}>Register Your Interest Now</button>
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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.82)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: bp.isXs ? ".75rem" : "1rem", animation: "fadeIn .5s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--warm-dark)", width: "100%", maxWidth: bp.isMobile ? 380 : 780, border: "1px solid rgba(201,169,110,.12)", position: "relative", display: "grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", maxHeight: "90svh", overflowY: "auto" }}>
        {!bp.isMobile && (
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .6 }} alt="" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.9) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(201,169,110,.6)", marginBottom: 8, fontWeight: 400 }}>Coming Soon · Pre-Launch</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.4rem", fontWeight: 400, color: "var(--cream)", lineHeight: 1.05 }}>Register<br /><span style={{ color: "var(--gold-light)" }}>Early Access</span></h3>
            </div>
          </div>
        )}
        <div style={{ padding: bp.isXs ? "1.75rem 1.5rem" : "3rem", background: "var(--warm-black)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          {bp.isMobile && <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".5rem" }}>Pre-Launch Access</h3>}
          <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "var(--text-dim)", marginBottom: "1.75rem", lineHeight: 1.8 }}>
            Be first to receive exclusive pre-launch pricing, floor plans, unit availability, and preview invitations for Anant Raj Sector 63A — part of a 200-acre integrated township in Gurugram.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "1.75rem" }}>
            {["Full Name", "Phone Number"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.12)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6, fontWeight: 400 }}>{ph}</div>
                <input placeholder={`Enter ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: 13, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer" }}>
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
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, display: "grid", gridTemplateColumns: "1fr 1fr", background: "rgba(12,11,9,.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(201,169,110,.15)", paddingBottom: "env(safe-area-inset-bottom, 0px)", animation: "fadeUp .4s ease" }}>
      <a href="tel:+919205974843" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 12px", textDecoration: "none", borderRight: "1px solid rgba(201,169,110,.1)", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 400 }}>
        <span style={{ color: "var(--gold)", fontSize: ".9rem" }}>📞</span> Call Now
      </a>
      <button onClick={onEnquire} style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "15px 12px", cursor: "pointer" }}>
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
          <PriceConfigSection onEnquire={() => setModal(true)} />
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