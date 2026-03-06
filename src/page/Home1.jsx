import { useState, useEffect, useRef } from "react";

/* ─── Breakpoints ───────────────────────────────────────────────────────── */
// xs: 0–479  |  sm: 480–639  |  md: 640–899  |  lg: 900–1199  |  xl: 1200+

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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #0c0b09; color: #e8e4dc; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
:root {
  --gold: #c9a96e; --gold-light: #e8d5b0; --gold-dim: #8a6e45;
  --cream: #f5f0e8; --warm-black: #0c0b09; --warm-dark: #161410;
  --text-dim: #7a7268;
  --serif: 'Cormorant Garamond', serif; --sans: 'DM Sans', sans-serif;
  --nav-h: 72px;
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

/* Responsive utility classes */
.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Touch improvements */
@media (max-width: 639px) {
  input, button, a { -webkit-tap-highlight-color: transparent; }
  button { touch-action: manipulation; }
}

/* Safe area for notched phones */
@supports (padding: max(0px)) {
  .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
}
`;

/* ─── Responsive padding helper ─────────────────────────────────────────── */
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

/* ─── Count-Up Hook ─────────────────────────────────────────────────────── */
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

/* ─── Reveal on scroll ──────────────────────────────────────────────────── */
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

/* ─── Eyebrow label ─────────────────────────────────────────────────────── */
function Eyebrow({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .7 }} />
      <span style={{ fontFamily: "var(--sans)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-dim)" }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
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
    if (!bp.isDesktop) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, bp.isDesktop]);

  useEffect(() => {
    if (bp.isDesktop && open) setOpen(false);
  }, [bp.isDesktop]);

  const links = ["Story", "Gallery", "Amenities", "Floor Plans", "Price List", "Location"];

  const logoSize = bp.isXs ? 80 : bp.isMobile ? 90 : bp.isTablet ? 100 : scrolled ? 110 : 124;
  const navHeight = scrolled ? 64 : bp.isXs ? 70 : 80;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,11,9,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,.1)" : "none",
        transition: "all .5s ease",
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: bp.isXs ? "0 .875rem" : bp.isMobile ? "0 1.25rem" : "0 2rem",
          height: navHeight,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "height .4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 110 }}>
            <img
              src="/logo1.png"
              alt="Anant Raj Limited"
              style={{
                width: logoSize, height: logoSize, objectFit: "contain",
                transition: "width .4s ease, height .4s ease",
                filter: "drop-shadow(0 2px 8px rgba(201,169,110,.25))",
              }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {bp.isDesktop && (
            <div style={{
              display: "flex",
              gap: bp.isLg ? "2rem" : "3rem",
              alignItems: "center",
            }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
                  fontFamily: "var(--sans)",
                  fontSize: bp.isLg ? ".6rem" : ".64rem",
                  fontWeight: 300,
                  letterSpacing: ".18em", textTransform: "uppercase",
                  color: "#fff", textDecoration: "none",
                  transition: "color .2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.color = "#fff"}
                >{l}</a>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 110 }}>
            {bp.isDesktop && (
              <button onClick={onEnquire} style={{
                background: "transparent", border: "1px solid var(--gold-dim)",
                color: "#fff", fontFamily: "var(--sans)",
                fontSize: bp.isLg ? ".6rem" : ".63rem",
                fontWeight: 400, letterSpacing: ".2em", textTransform: "uppercase",
                padding: bp.isLg ? "8px 18px" : "9px 22px", cursor: "pointer",
                transition: "all .25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--warm-black)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--gold-dim)"; }}
              >
                Broucher
              </button>
            )}

            {bp.isMobile && !open && (
              <a href="tel:+919205974843" style={{
                fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".06em",
                color: "var(--gold)", textDecoration: "none", marginRight: 4,
                display: bp.isXs ? "none" : "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: ".8rem" }}>📞</span>
                <span>Call</span>
              </a>
            )}

            {!bp.isDesktop && (
              <button
                onClick={() => setOpen(v => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                style={{ background: "none", border: "none", padding: "6px 4px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, zIndex: 110 }}
              >
                <div style={{ width: 22, height: 1.5, background: open ? "var(--gold)" : "#fff", transition: "all .3s", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                <div style={{ width: 15, height: 1.5, background: "#fff", opacity: open ? 0 : 1, transition: "opacity .3s" }} />
                <div style={{ width: 22, height: 1.5, background: open ? "var(--gold)" : "#fff", transition: "all .3s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {!bp.isDesktop && open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 105,
          background: "rgba(12,11,9,.98)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "1.75rem",
          animation: "fadeIn .25s ease", paddingBottom: "env(safe-area-inset-bottom, 2rem)",
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--serif)",
                fontSize: bp.isXs ? "1.5rem" : bp.isTablet ? "2.2rem" : "1.8rem",
                fontStyle: "italic", color: "var(--cream)", textDecoration: "none", letterSpacing: ".02em",
              }}>
              {l}
            </a>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,.25)", margin: "0.25rem 0" }} />
          <button onClick={() => { setOpen(false); onEnquire(); }} style={{
            background: "var(--gold)", border: "none", color: "var(--warm-black)",
            fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500,
            letterSpacing: ".22em", textTransform: "uppercase",
            padding: "16px 48px", cursor: "pointer", marginTop: "0.5rem",
          }}>Broucher</button>
          <a href="tel:+919205974843" onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".1em" }}>
            <span style={{ color: "var(--gold)", opacity: .6 }}>◉</span>
            +91 9205974843
          </a>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const bp = useBreakpoint();
  const [slide, setSlide] = useState(0);
  const slides = ["/banner/7.png", "/banner/8.png", "/banner/9.png"];

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % 3), 5500);
    return () => clearInterval(t);
  }, []);

  const headingSize = bp.isXs
    ? "2.2rem" : bp.isMobile
      ? "2.8rem" : bp.isTablet
        ? "4rem" : "clamp(5rem,9vw,9rem)";

  const subSize = bp.isXs ? ".72rem" : bp.isMobile ? ".78rem" : bp.isTablet ? ".84rem" : ".9rem";

  const FormMobileTablet = () => (
    <div style={{
      background: "rgba(22,20,16,.92)", backdropFilter: "blur(40px)",
      border: "1px solid rgba(201,169,110,.15)",
      maxWidth: bp.isTablet ? 560 : 360,
      margin: "0 auto", width: "100%",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }].map((f, i) => (
          <div key={i} style={{
            padding: bp.isTablet ? "14px 18px" : "11px 14px",
            borderRight: i === 0 ? "1px solid rgba(201,169,110,.12)" : "none",
            borderBottom: "1px solid rgba(201,169,110,.12)",
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3 }}>{f.label}</div>
            <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".8rem", width: "100%", fontSize: bp.isTablet ? ".8rem" : ".72rem" }} />
          </div>
        ))}
      </div>
      <div style={{ padding: bp.isTablet ? "14px 18px" : "11px 14px", borderBottom: "1px solid rgba(201,169,110,.12)" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3 }}>Email</div>
        <input placeholder="you@email.com" style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: bp.isTablet ? ".8rem" : ".72rem", width: "100%" }} />
      </div>
      <button style={{ width: "100%", padding: bp.isTablet ? "13px" : "11px", background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer" }}>
        Enquire Now
      </button>
    </div>
  );

  return (
    <section style={{ position: "relative", height: "100svh", minHeight: 560, overflow: "hidden", background: "var(--warm-black)" }}>
      {slides.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 1.5s ease" }}>
          <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: i === slide ? "scale(1.03)" : "scale(1)", transition: "transform 6s ease-out" }} alt="" />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,7,6,.55) 10%, rgba(8,7,6,.2) 35%, rgba(8,7,6,.88) 75%, rgba(8,7,6,.98) 100%)" }} />
      {bp.isMobile && <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,6,.35)" }} />}

      {!bp.isMobile && (
        <div style={{ position: "absolute", right: bp.isTablet ? "1rem" : "1.5rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: 2, height: i === slide ? 24 : 10, background: i === slide ? "var(--gold)" : "rgba(201,169,110,.55)", border: "none", cursor: "pointer", borderRadius: 1, padding: 0, transition: "all .4s" }} />
          ))}
        </div>
      )}

      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "100%", maxWidth: 1400,
        padding: bp.isXs ? "0 1rem" : bp.isMobile ? "0 1.25rem" : bp.isTablet ? "0 2rem" : "0 2rem",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      }}>
        <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: bp.isXs ? 6 : bp.isMobile ? 10 : 20, justifyContent: "center" }}>
            <div style={{ width: bp.isMobile ? 16 : 28, height: 1, background: "#fff", opacity: .9 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".5rem" : ".6rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#fff", fontWeight: 400, textShadow: "0 1px 8px rgba(0,0,0,.8)" }}>Gurugram's Premier Address</span>
            <div style={{ width: bp.isMobile ? 16 : 28, height: 1, background: "#fff", opacity: .9 }} />
          </div>

          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: headingSize,
            fontWeight: 600, color: "#ffffff", lineHeight: .92,
            letterSpacing: "-.02em",
            marginBottom: bp.isXs ? 8 : bp.isMobile ? 12 : 20,
            textShadow: "0 2px 24px rgba(0,0,0,.9), 0 4px 48px rgba(0,0,0,.7)",
          }}>
            <span style={{ display: "block", textShadow: "0 2px 24px rgba(0,0,0,2.1), 0 0 60px rgba(201,169,110,.3)" }}>Secure Land.</span>
            <span style={{ display: "block" }}>Secure future.</span>
          </h1>

          <p style={{
            fontFamily: "var(--sans)", fontSize: subSize,
            fontWeight: 400, color: "rgba(255,255,255,.85)",
            maxWidth: bp.isXs ? 240 : bp.isMobile ? 300 : bp.isTablet ? 450 : 460,
            lineHeight: bp.isMobile ? 1.65 : 1.8,
            marginBottom: bp.isXs ? 14 : bp.isMobile ? 18 : 32,
            textShadow: "0 1px 12px rgba(0,0,0,.8)",
          }}>
            3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising over 5 pristine acres in Gurugram.
          </p>
        </div>

        <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
          {bp.isMobile && <FormMobileTablet />}
          {bp.isTablet && <FormMobileTablet />}
          {bp.isDesktop && (
            <div style={{
              display: "grid",
              gridTemplateColumns: bp.isLg ? "1fr 1fr 1fr auto" : "1fr 1fr 1fr auto",
              gap: 0,
              background: "rgba(22,20,16,.92)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,169,110,.15)",
              maxWidth: bp.isLg ? 680 : 720, margin: "0 auto",
            }}>
              {[{ label: "Your Name", ph: "Full Name" }, { label: "Phone", ph: "+91 00000 00000" }, { label: "Email", ph: "you@email.com" }].map((f, i) => (
                <div key={i} style={{ padding: bp.isLg ? "12px 14px" : "14px 18px", borderRight: "1px solid rgba(201,169,110,.1)" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: 3 }}>{f.label}</div>
                  <input placeholder={f.ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".8rem", width: "100%" }} />
                </div>
              ))}
              <button style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "0 22px", cursor: "pointer", whiteSpace: "nowrap" }}>Enquire</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STORY
═══════════════════════════════════════════════════════════════ */
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
        <div style={{
          display: "grid",
          gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr",
          gap: bp.isXs ? 32 : bp.isMobile ? 36 : bp.isTablet ? 48 : bp.isLg ? 60 : 80,
          alignItems: "center",
        }}>
          {!bp.isMobile && (
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -18, left: -18, width: 160, height: 160, border: "1px solid rgba(201,169,110,.1)", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1, aspectRatio: bp.isTablet ? "16/9" : "3/4", overflow: "hidden" }}>
                  <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="Interior" />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 56, height: 56, borderTop: "1px solid var(--gold)", borderLeft: "1px solid var(--gold)", opacity: .4 }} />
                </div>
                <div style={{ position: "absolute", bottom: 36, right: bp.isTablet ? 0 : -28, zIndex: 2, background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.2)", padding: "12px 20px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>Registered</div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <Eyebrow label="The Story" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 300, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              Designed for those<br /><em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>who seek perfection</em>
            </h2>
            <div style={{ width: 48, height: 1, background: "var(--gold)", opacity: .4, marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.55)", lineHeight: 2, marginBottom: "1.25rem" }}>
              Every great story has a setting. At Anant Raj Sector 63A, we've crafted a setting that elevates every chapter of your life — across 5 pristine acres of landscaped luxury in the heart of Gurugram.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2, marginBottom: "2.5rem" }}>
              Conceived by International Architects, twin towers rise with quiet authority over the Gurugram skyline — a rare collaboration between global design vision and Indian craftsmanship.
            </p>

            {bp.isMobile && (
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: "1.5rem" }}>
                <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" alt="Luxury Interior" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(22,20,16,.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(201,169,110,.25)", padding: "8px 14px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 3 }}>Registered</div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: "1px solid rgba(201,169,110,.1)", paddingTop: "1.75rem" }}>
              {[{ val: units, label: "Residences" }, { val: acres, label: "Acres" }, { val: towers, label: "Towers" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(201,169,110,.1)" : "none", padding: bp.isXs ? "0 .5rem" : "0 1rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.5rem" : "3.5rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUOTE BANNER
═══════════════════════════════════════════════════════════════ */
function QuoteBanner() {
  const bp = useBreakpoint();
  const fontSize = bp.isXs ? "1.4rem" : bp.isMobile ? "1.65rem" : "clamp(1.8rem,4vw,4rem)";

  return (
    <div style={{
      position: "relative", overflow: "hidden", background: "var(--warm-dark)",
      padding: bp.isXs ? "52px 1rem" : bp.isMobile ? "64px 1.25rem" : bp.isTablet ? "80px 2rem" : "100px 2rem",
      borderTop: "1px solid rgba(201,169,110,.08)", borderBottom: "1px solid rgba(201,169,110,.08)",
    }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .12 }} alt="" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,  rgba(22,20,16,.7) 50%" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--serif)", fontSize: "3.5rem", color: "var(--gold)", opacity: .2, lineHeight: 1, marginBottom: "-0.5rem" }}>"</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize, fontWeight: 300, color: "var(--cream)", lineHeight: 1.15, fontStyle: "italic", maxWidth: 860, margin: "0 auto 1.5rem" }}>
            Where world-class design meets<br />the soul of Gurugram.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".54rem" : ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-dim)" }}>Crafted for the discerning few</span>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY — label always visible at bottom, brightens on hover
═══════════════════════════════════════════════════════════════ */
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
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/2" },
      { ...imgs[1], col: "1/2", row: "2/3" },
      { ...imgs[2], col: "2/3", row: "2/3" },
      { ...imgs[3], col: "1/2", row: "3/4" },
      { ...imgs[4], col: "2/3", row: "3/4" },
    ];
    cols = "1fr 1fr"; rowDef = "repeat(3,190px)";
  } else if (bp.isTablet) {
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/2" },
      { ...imgs[1], col: "1/2", row: "2/3" },
      { ...imgs[2], col: "2/3", row: "2/3" },
      { ...imgs[3], col: "1/2", row: "3/4" },
      { ...imgs[4], col: "2/3", row: "3/4" },
    ];
    cols = "1fr 1fr"; rowDef = "repeat(3,210px)";
  } else {
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/3" },
      { ...imgs[1], col: "3/4", row: "1/2" },
      { ...imgs[2], col: "3/4", row: "2/3" },
      { ...imgs[3], col: "1/3", row: "3/4" },
      { ...imgs[4], col: "3/4", row: "3/4" },
    ];
    cols = "repeat(3,1fr)"; rowDef = "repeat(3,220px)";
  }

  return (
    <section id="gallery" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <Eyebrow label="Gallery" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.1 }}>
            A glimpse of <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>elegance</em>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rowDef, gap: bp.isXs ? 4 : 5 }}>
          {gridItems.map((img, i) => {
            const isClicked = clicked === i;
            const isHovered = hov === i;
            return (
              <div key={i} style={{ gridColumn: img.col, gridRow: img.row, position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                onClick={() => setClicked(clicked === i ? null : i)}>
                <img
                  src={img.src}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform .8s cubic-bezier(.16,1,.3,1)",
                    transform: isHovered ? "scale(1.06)" : "scale(1)"
                  }}
                  alt={img.label}
                />

                {/* Always-visible bottom gradient + label */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(12,11,9,.75) 0%, rgba(12,11,9,.2) 40%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: bp.isXs ? "10px 12px" : "14px 18px",
                  pointerEvents: "none",
                  display: "flex", alignItems: "flex-end",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 14, height: 1,
                      background: "var(--gold)",
                      opacity: isHovered ? 1 : 0.5,
                      transition: "opacity .3s",
                    }} />
                    <span style={{
                      fontFamily: "var(--serif)",
                      fontSize: bp.isXs ? ".9rem" : "1.1rem",
                      fontStyle: "italic",
                      color: isHovered ? "#fff" : "rgba(245,240,232,.7)",
                      transition: "color .3s",
                    }}>{img.label}</span>
                  </div>
                </div>

                {/* Click overlay with Enquire button */}
                {isClicked && (
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5, animation: "fadeIn .25s ease",
                    width: "100%", display: "flex", justifyContent: "center"
                  }} onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onEnquire(); }}
                      style={{
                        background: "rgba(12,11,9,.85)", border: "1px solid var(--gold)",
                        color: "var(--gold-light)", fontFamily: "var(--sans)",
                        fontSize: bp.isXs ? ".58rem" : ".62rem", fontWeight: 500,
                        letterSpacing: ".22em", textTransform: "uppercase",
                        padding: bp.isXs ? "9px 20px" : "11px 28px", cursor: "pointer",
                        backdropFilter: "blur(12px)", whiteSpace: "nowrap"
                      }}>
                      Enquire Now
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

/* ═══════════════════════════════════════════════════════════════
   AMENITIES
═══════════════════════════════════════════════════════════════ */
function AmenitiesSection() {
  const bp = useBreakpoint();

  const items = [
    { icon: "◈", title: "Infinity Pool", desc: "25m temperature-controlled pool with panoramic city views" },
    { icon: "◉", title: "Fitness Center", desc: "Technogym equipment & personal training facilities" },
    { icon: "◌", title: "Zen Garden", desc: "Landscaped meditation & reflection zones" },
    { icon: "◈", title: "Private Theatre", desc: "40-seat Dolby Atmos screening room" },
    { icon: "◉", title: "Smart Homes", desc: "Full Crestron home automation system" },
    { icon: "◌", title: "IGBC Platinum", desc: "Sustainability certified green building" },
    { icon: "◈", title: "Co-Working Hub", desc: "Private cabins with high-speed connectivity" },
    { icon: "◉", title: "Concierge", desc: "24/7 dedicated lifestyle management" },
  ];

  const gridCols = bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr" : "1fr 1fr";
  const layoutCols = bp.isDesktop ? "1fr 2fr" : "1fr";

  return (
    <section id="amenities" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{ display: "grid", gridTemplateColumns: layoutCols, gap: bp.isDesktop ? 80 : 40, alignItems: "start" }}>
          <Reveal>
            <div style={{ position: bp.isDesktop ? "sticky" : "relative", top: bp.isDesktop ? 100 : "auto" }}>
              <Eyebrow label="Amenities" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1rem" }}>
                Curated for an<br /><em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>exceptional life</em>
              </h2>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2 }}>
                Over 20,000 sq.ft of world-class amenities designed to fulfil every facet of the modern luxury lifestyle.
              </p>
              {bp.isDesktop && (
                <div style={{ position: "relative", marginTop: "2.5rem", aspectRatio: "4/5", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} alt="" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--warm-dark) 0%, transparent 60%)" }} />
                </div>
              )}
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 2 }}>
            {items.map((item, i) => (
              <Reveal key={i} delay={i * .04}>
                <div style={{ padding: bp.isXs ? "1.25rem" : "1.75rem", background: "rgba(22,20,16,.5)", border: "1px solid rgba(201,169,110,.06)", transition: "all .4s", cursor: "default", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,110,.04)"; e.currentTarget.style.borderColor = "rgba(201,169,110,.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(22,20,16,.5)"; e.currentTarget.style.borderColor = "rgba(201,169,110,.06)"; }}>
                  <div style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: ".75rem", opacity: .7 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.15rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".4rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".73rem", fontWeight: 300, color: "rgba(232,228,220,.35)", lineHeight: 1.7 }}>{item.desc}</p>
                  <div style={{ marginTop: ".75rem", width: 18, height: 1, background: "var(--gold)", opacity: .3 }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOOR PLANS
═══════════════════════════════════════════════════════════════ */
function FloorPlanSection({ onEnquire }) {
  const bp = useBreakpoint();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);

  const plans = [
    { title: "3 BHK", area: "2,300 sq.ft", desc: "Spacious three-bedroom homes with panoramic views and premium finishes throughout.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80", beds: 3, baths: 3, balconies: 2 },
    { title: "3 BHK + Study", area: "2,600 sq.ft", desc: "Expansive layouts with a dedicated study, ideal for the modern work-from-home lifestyle.", img: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=700&q=80", beds: 3, baths: 4, balconies: 3 },
  ];

  const PlanTabs = () => (
    <div>
      {plans.map((p, i) => (
        <div key={i} onClick={() => setActive(i)} style={{
          padding: bp.isXs ? "1rem 1.25rem" : bp.isDesktop ? "2rem 2.25rem" : "1.25rem 1.5rem",
          background: active === i ? "rgba(201,169,110,.05)" : "transparent",
          borderLeft: active === i ? "2px solid var(--gold)" : "2px solid rgba(201,169,110,.1)",
          cursor: "pointer", marginBottom: 2, transition: "all .3s",
        }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 4 }}>{String(i + 1).padStart(2, "0")}</div>
          <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.2rem" : bp.isDesktop ? "1.7rem" : "1.4rem", fontWeight: 400, color: active === i ? "var(--cream)" : "rgba(232,228,220,.4)", transition: "color .3s", marginBottom: ".35rem" }}>{p.title}</h4>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: active === i ? "var(--gold-dim)" : "rgba(90,82,72,.5)", fontWeight: 300, marginBottom: active === i ? ".75rem" : 0, transition: "all .3s" }}>{p.area}</p>
          {active === i && <p style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 300, color: "rgba(232,228,220,.45)", lineHeight: 1.8, animation: "fadeIn .4s ease" }}>{p.desc}</p>}
        </div>
      ))}
    </div>
  );

  const PlanImage = ({ minH }) => (
    <div style={{ position: "relative", overflow: "hidden", minHeight: minH || 280 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => bp.isMobile && onEnquire()}>
      {plans.map((p, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: active === i ? 1 : 0, transition: "opacity .6s" }}>
          <img src={p.img} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(.65) blur(${hovered ? 8 : 0}px)`, transition: "filter .5s ease" }} alt={p.title} />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.85) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: bp.isXs ? 10 : 18, left: bp.isXs ? 10 : 18, background: "rgba(12,11,9,.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(201,169,110,.25)", padding: bp.isXs ? "4px 10px" : "6px 16px", zIndex: 2 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--gold-dim)" }}>Architect Design</span>
      </div>
      {!bp.isMobile && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, opacity: hovered ? 1 : 0, transition: "opacity .35s ease" }}>
          <button onClick={() => onEnquire()} style={{ background: "rgba(12,11,9,.88)", border: "1px solid var(--gold)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", padding: "14px 36px", cursor: "pointer", backdropFilter: "blur(14px)", transition: "background .25s, color .25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--warm-black)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(12,11,9,.88)"; e.currentTarget.style.color = "var(--gold-light)"; }}>
            Enquire Now
          </button>
        </div>
      )}
      {bp.isMobile && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, opacity: 1 }}>
          <button onClick={e => { e.stopPropagation(); onEnquire(); }} style={{ background: "rgba(12,11,9,.85)", border: "1px solid var(--gold)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", padding: "10px 24px", cursor: "pointer", backdropFilter: "blur(12px)" }}>
            Enquire Now
          </button>
        </div>
      )}
      <div style={{ position: "absolute", bottom: bp.isXs ? "1rem" : "1.5rem", left: bp.isXs ? "1rem" : "1.5rem", zIndex: 2 }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.2rem" : "1.6rem", color: "var(--cream)", fontWeight: 300 }}>{plans[active].title}</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".65rem", color: "var(--gold)", marginTop: 3, letterSpacing: ".1em" }}>{plans[active].area}</div>
      </div>
    </div>
  );

  return (
    <section id="floor-plans" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <Eyebrow label="Floor Plans" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2.5rem", lineHeight: 1.05 }}>
            Layouts that <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>inspire</em>
          </h2>
        </Reveal>

        {bp.isMobile ? (
          <div>
            <PlanTabs />
            <div style={{ marginTop: 4 }}>
              <PlanImage minH={bp.isXs ? 240 : 280} />
            </div>
          </div>
        ) : bp.isTablet ? (
          <div>
            <PlanTabs />
            <div style={{ marginTop: 4 }}>
              <PlanImage minH={280} />
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: bp.isLg ? "1fr 1.3fr" : "1fr 1.5fr", gap: 4 }}>
            <PlanTabs />
            <PlanImage minH={380} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICE LIST SECTION — unit rows clickable → open enquiry modal
═══════════════════════════════════════════════════════════════ */
function PriceListSection({ onEnquire }) {
  const bp = useBreakpoint();
  const [hovRow, setHovRow] = useState(null);

  const units = [
    { type: "3 BHK", area: "2,300 sq.ft", carpet: "1,610 sq.ft", floor: "4th – 18th", config: "3 Bed · 3 Bath · 2 Balcony", price: "₹4.20 Cr", tag: "Popular" },
    { type: "3 BHK + Study", area: "2,600 sq.ft", carpet: "1,820 sq.ft", floor: "4th – 22nd", config: "3 Bed · 4 Bath · 3 Balcony", price: "₹4.95 Cr", tag: "Premium" },
    { type: "3 BHK Sky Suite", area: "2,600 sq.ft", carpet: "1,820 sq.ft", floor: "23rd – 28th", config: "3 Bed · 4 Bath · 3 Balcony", price: "₹5.60 Cr", tag: "Sky Level" },
    { type: "3 BHK + Study Sky Suite", area: "2,600 sq.ft", carpet: "1,820 sq.ft", floor: "29th – 32nd (Top)", config: "3 Bed · 4 Bath · 3 Balcony", price: "₹6.20 Cr", tag: "Ultra Premium" },
  ];

  const includes = [
    { icon: "◈", text: "Modular Kitchen with Premium Fittings" },
    { icon: "◉", text: "Imported Marble Flooring in Living Areas" },
    { icon: "◌", text: "Crestron Home Automation System" },
    { icon: "◈", text: "VRF Air-Conditioning in All Rooms" },
    { icon: "◉", text: "Two Covered Car Parks Per Unit" },
    { icon: "◌", text: "100% Power Backup" },
  ];

  const tagColors = {
    "Popular": { bg: "rgba(201,169,110,.12)", color: "var(--gold)" },
    "Premium": { bg: "rgba(201,169,110,.08)", color: "var(--gold-dim)" },
    "Sky Level": { bg: "rgba(120,160,201,.1)", color: "#7ab0d6" },
    "Ultra Premium": { bg: "rgba(201,169,110,.15)", color: "var(--gold-light)" },
  };

  // Mobile: card layout — each card clickable
  const MobileCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "2rem" }}>
      {units.map((u, i) => (
        <div
          key={i}
          onClick={() => onEnquire()}
          style={{
            background: hovRow === i ? "rgba(201,169,110,.06)" : "rgba(22,20,16,.6)",
            border: hovRow === i ? "1px solid rgba(201,169,110,.3)" : "1px solid rgba(201,169,110,.1)",
            padding: "1.25rem 1.5rem",
            cursor: "pointer",
            transition: "all .25s",
            position: "relative",
          }}
          onMouseEnter={() => setHovRow(i)}
          onMouseLeave={() => setHovRow(null)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--cream)", marginBottom: 4 }}>{u.type}</div>
              <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".18em", textTransform: "uppercase", padding: "3px 8px", background: tagColors[u.tag]?.bg, color: tagColors[u.tag]?.color }}>{u.tag}</span>
            </div>
            {/* Enquire hint */}
            <span style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", opacity: hovRow === i ? 1 : 0, transition: "opacity .2s", whiteSpace: "nowrap" }}>Enquire →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            {[["Super Area", u.area], ["Carpet Area", u.carpet], ["Floors", u.floor], ["Config", u.config]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 300, color: "rgba(232,228,220,.6)" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="price-list" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)", borderTop: "1px solid rgba(201,169,110,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isMobile ? "2.5rem" : "3.5rem", gap: "1rem" }}>
            <div>
              <Eyebrow label="Price List" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05 }}>
                Transparent <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>pricing</em>
              </h2>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, color: "rgba(232,228,220,.35)", lineHeight: 1.9, maxWidth: 480, marginTop: ".75rem" }}>
                All-inclusive pricing with no hidden charges. Click any unit to enquire. Prices are indicative and subject to floor rise & GST.
              </p>
            </div>
            <button onClick={onEnquire} style={{ background: "transparent", border: "1px solid rgba(201,169,110,.3)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 400, letterSpacing: ".2em", textTransform: "uppercase", padding: "10px 24px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              Get Exact Pricing
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {bp.isMobile ? (
            <MobileCards />
          ) : (
            <div style={{ overflowX: "auto", marginBottom: bp.isMobile ? "2.5rem" : "4rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(201,169,110,.2)" }}>
                    {["Unit Type", "Super Area", "Carpet Area", "Floor", "Configuration"].map((h, i) => (
                      <th key={i} style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-dim)", fontWeight: 400, padding: "0 1.25rem 1rem", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {units.map((u, i) => (
                    <tr
                      key={i}
                      onMouseEnter={() => setHovRow(i)}
                      onMouseLeave={() => setHovRow(null)}
                      onClick={() => onEnquire()}
                      style={{
                        borderBottom: "1px solid rgba(201,169,110,.06)",
                        background: hovRow === i ? "rgba(201,169,110,.06)" : "transparent",
                        transition: "background .2s",
                        cursor: "pointer",
                      }}
                    >
                      <td style={{ padding: "1.5rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", fontWeight: 400, color: "var(--cream)", whiteSpace: "nowrap" }}>{u.type}</div>
                          <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".18em", textTransform: "uppercase", padding: "3px 8px", background: tagColors[u.tag]?.bg, color: tagColors[u.tag]?.color, whiteSpace: "nowrap" }}>{u.tag}</span>
                        </div>
                      </td>
                      <td style={{ padding: "1.5rem 1.25rem", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "rgba(232,228,220,.6)", whiteSpace: "nowrap" }}>{u.area}</td>
                      <td style={{ padding: "1.5rem 1.25rem", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "rgba(232,228,220,.6)", whiteSpace: "nowrap" }}>{u.carpet}</td>
                      <td style={{ padding: "1.5rem 1.25rem", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "rgba(232,228,220,.45)", whiteSpace: "nowrap" }}>{u.floor}</td>
                      <td style={{ padding: "1.5rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 300, color: "rgba(232,228,220,.4)" }}>{u.config}</span>
                          <span style={{
                            fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".12em",
                            textTransform: "uppercase", color: "var(--gold)",
                            opacity: hovRow === i ? 1 : 0, transition: "opacity .2s",
                            whiteSpace: "nowrap", flexShrink: 0,
                          }}>Enquire →</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "1rem", fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--text-dim)", letterSpacing: ".05em" }}>
                * Click any unit to enquire. Prices are indicative. Subject to change. GST, stamp duty & registration extra.
              </div>
            </div>
          )}
        </Reveal>

        {/* Includes + Payment CTA */}
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1.4fr 1fr" : "1fr", gap: bp.isDesktop ? 60 : 32, alignItems: "center" }}>
          <Reveal>
            <div style={{ background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.1)", padding: bp.isXs ? "1.25rem" : "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".54rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: "1.25rem" }}>What's Included in the Price</div>
              <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                {includes.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "var(--gold)", fontSize: ".75rem", opacity: .55, marginTop: 2, flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 300, color: "rgba(232,228,220,.5)", lineHeight: 1.6 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ textAlign: bp.isMobile ? "left" : "center", padding: bp.isMobile ? "0" : "1rem" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : "2.2rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.1, marginBottom: ".75rem" }}>
                Flexible<br /><em style={{ color: "var(--gold-light)" }}>Payment Plans</em>
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 1.9, marginBottom: "1.75rem", maxWidth: 280, margin: bp.isMobile ? "0 0 1.75rem" : "0 auto 1.75rem" }}>
                Construction-linked, subvention, and flexi plans available. Speak to our team to find the plan that works for you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: bp.isMobile ? "flex-start" : "center" }}>
                <button onClick={onEnquire} style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", padding: "13px 32px", cursor: "pointer" }}>
                  Request Price Sheet
                </button>
                <a href="tel:+919205974843" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text-dim)", fontFamily: "var(--sans)", fontSize: ".65rem", letterSpacing: ".08em" }}>
                  <span style={{ color: "var(--gold)", opacity: .5 }}>◉</span> +91 9205974843
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOCATION
═══════════════════════════════════════════════════════════════ */
function LocationSection() {
  const bp = useBreakpoint();

  const landmarks = [
    { name: "Cyber City / DLF Cyber Hub", dist: "12 km" },
    { name: "Golf Course Extension Road", dist: "3 km" },
    { name: "Ambience Mall", dist: "8 km" },
    { name: "Indira Gandhi International Airport", dist: "22 km" },
    { name: "NH-48 (Delhi–Jaipur Highway)", dist: "5 km" },
  ];

  const mapHeight = bp.isXs ? 220 : bp.isMobile ? 260 : bp.isTablet ? 320 : 420;

  return (
    <section id="location" style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 60 : 40, alignItems: "start" }}>
          <Reveal>
            <Eyebrow label="Location" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "1.5rem", lineHeight: 1.05 }}>
              Strategic <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>connectivity</em>
            </h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2, marginBottom: "2rem" }}>
              Situated on Sector 63A, Gurugram — seamlessly connected to the city's premier business, retail, and lifestyle destinations.
            </p>
            {landmarks.map((lm, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 0", borderBottom: "1px solid rgba(201,169,110,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: .5, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".72rem" : ".8rem", fontWeight: 300, color: "rgba(232,228,220,.6)" }}>{lm.name}</span>
                </div>
                <span style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--gold)", fontStyle: "italic", flexShrink: 0, marginLeft: 8 }}>{lm.dist}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ position: "relative", overflow: "hidden", marginTop: bp.isDesktop ? 0 : "2rem" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14026!2d77.0856!3d28.4089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e4b8f4c6b1%3A0x6b04d8b6e5c7c4a0!2sSector%2063A%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
                width="100%" height={mapHeight}
                style={{ display: "block", filter: "grayscale(100%) invert(100%) contrast(80%) brightness(60%)", border: "none", borderTop: "1px solid rgba(201,169,110,.15)" }}
                loading="lazy" title="Location" />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
                <div style={{ position: "absolute", borderRadius: "50%", background: "var(--gold)", animation: "pulse-ring 2s ease-out infinite", width: 18, height: 18 }} />
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--gold)", border: "3px solid var(--warm-black)", position: "relative" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: bp.isXs ? ".75rem 1rem" : "1rem 1.5rem", background: "linear-gradient(to top, rgba(12,11,9,.95) 0%, transparent 100%)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>Site Address</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".76rem", color: "rgba(232,228,220,.7)", fontWeight: 300 }}>Sector 63A, Gurugram, Haryana — 122101</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════ */
function ContactSection({ onEnquire }) {
  const bp = useBreakpoint();

  return (
    <section style={{ padding: `${vPad(bp)} 0`, background: "var(--warm-dark)", borderTop: "1px solid rgba(201,169,110,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 80 : 40, alignItems: "center" }}>
          <Reveal>
            <Eyebrow label="Visit Us" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.05 }}>
              The experience <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>awaits you</em>
            </h2>
            {[
              { icon: "◈", title: "Site Address", lines: ["Sector 63A, Gurugram", "Haryana — 122101"] },
              { icon: "◉", title: "Sales", lines: ["+91 92059 74843"] },
              { icon: "◌", title: "Email", lines: ["info@anantrajsector63a.com"] },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ color: "var(--gold)", fontSize: "1rem", marginTop: 2, opacity: .6, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>{c.title}</div>
                  {c.lines.map((line, j) => <div key={j} style={{ fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, color: "rgba(232,228,220,.6)", lineHeight: 1.8 }}>{line}</div>)}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ background: "var(--warm-black)", border: "1px solid rgba(201,169,110,.12)", padding: bp.isXs ? "1.5rem" : bp.isMobile ? "1.75rem" : "3rem", position: "relative", overflow: "hidden", marginTop: bp.isDesktop ? 0 : "1rem" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, borderBottom: "1px solid rgba(201,169,110,.15)", borderLeft: "1px solid rgba(201,169,110,.15)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : "2rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".4rem" }}>Schedule a Visit</h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", color: "var(--text-dim)", marginBottom: "2rem", fontWeight: 300 }}>Experience the grandeur of a private viewing.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {["Full Name", "Phone Number", "Email Address"].map(ph => (
                  <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.15)", paddingBottom: ".75rem" }}>
                    <input placeholder={ph} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }} />
                  </div>
                ))}
                <button onClick={onEnquire} style={{ width: "100%", padding: 14, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer" }}>
                  Book Appointment
                </button>
                <p style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", letterSpacing: ".1em" }}>We respect your privacy.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR — only on xl+
═══════════════════════════════════════════════════════════════ */
function Sidebar() {
  return (
    <div style={{ position: "sticky", top: 72, padding: "2rem 1.75rem", background: "var(--warm-dark)", borderLeft: "1px solid rgba(201,169,110,.08)", height: "calc(100vh - 72px)", overflowY: "auto" }}>
      <div style={{ borderBottom: "1px solid rgba(201,169,110,.1)", paddingBottom: "1.75rem", marginBottom: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: ".4rem" }}>Configuration</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1.2 }}>3 BHK & 3 BHK + Study</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".62rem", color: "var(--text-dim)", marginTop: 6, letterSpacing: ".05em" }}>2,300 – 2,600 sq.ft</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
        {["Full Name", "Email", "Phone"].map(ph => (
          <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.12)", paddingBottom: ".75rem" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>{ph}</div>
            <input placeholder={`Enter ${ph}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 300, width: "100%" }} />
          </div>
        ))}
      </div>
      <button style={{ width: "100%", padding: 12, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer", marginBottom: "2rem" }}>
        Request Callback
      </button>
      <div style={{ borderTop: "1px solid rgba(201,169,110,.08)", paddingTop: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem" }}>Speak to an Expert</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, border: "1px solid rgba(201,169,110,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".9rem" }}>📞</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, color: "rgba(232,228,220,.7)" }}>+91 92059 74843</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", marginTop: 2 }}>Available 9am – 8pm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  const bp = useBreakpoint();
  const links = {
    "Project": ["Overview", "Floor Plans", "Price List", "Gallery", "Amenities"],
    "Company": ["About Anant Raj", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };

  const gridCols = bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr";

  return (
    <footer style={{
      background: "#080706", borderTop: "1px solid rgba(201,169,110,.08)",
      padding: bp.isXs ? "48px 1rem 28px" : bp.isMobile ? "56px 1.25rem 32px" : "72px 2rem 40px",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 28 : bp.isMobile ? 32 : 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 18, height: 1, background: "var(--gold)" }} />
                <div style={{ width: 10, height: 1, background: "var(--gold)", opacity: .5 }} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400, color: "var(--gold-light)" }}>Anant Raj</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9, marginBottom: "1.25rem", maxWidth: 240 }}>
              Redefining luxury living in Gurugram's most coveted address, developed by Anant Raj Limited.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fb", "Tw", "In", "Li"].map(s => (
                <a key={s} href="#" style={{ width: 30, height: 30, border: "1px solid rgba(201,169,110,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: "1.2rem" }}>{group}</div>
              <ul style={{ listStyle: "none" }}>
                {items.map(item => (
                  <li key={item} style={{ marginBottom: ".65rem" }}>
                    <a href="#" style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "var(--text-dim)", textDecoration: "none" }}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(201,169,110,.06)", paddingTop: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "rgba(90,82,72,.5)", fontWeight: 300 }}>© 2025 Anant Raj Limited. All Rights Reserved.</p>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "rgba(90,82,72,.35)", fontWeight: 300 }}>RERA Reg. No. HRERA/GGM/2024/63A/001</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DISCLAIMER
═══════════════════════════════════════════════════════════════ */
function Disclaimer() {
  const bp = useBreakpoint();
  return (
    <div style={{ background: "#060504", borderTop: "1px solid rgba(201,169,110,.06)", padding: bp.isXs ? "1.75rem 1rem" : bp.isMobile ? "2rem 1.25rem" : "2.5rem 2rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: "1rem" }}>
          <div style={{ width: 1, background: "var(--gold-dim)", opacity: .3, alignSelf: "stretch", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--gold-dim)", opacity: .6, marginBottom: ".6rem" }}>Legal Disclaimer</div>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "rgba(122,114,104,.55)", lineHeight: 1.9, marginBottom: ".6rem" }}>
              This website has been prepared solely for informational purposes and does not constitute an offer, invitation, or inducement to invest in or purchase any property. The content, images, floor plans, specifications, amenities, pricing, and other details mentioned herein are tentative and indicative only.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".6rem" : ".65rem", fontWeight: 300, color: "rgba(122,114,104,.4)", lineHeight: 1.9 }}>
              Prospective buyers are advised to independently verify all details with the relevant government authorities and consult their legal and financial advisors before making any purchase decision. Anant Raj Limited shall not be liable for any claims arising out of reliance on the information provided.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(201,169,110,.04)", paddingTop: ".75rem", display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
          {["Privacy Policy", "Terms of Use", "Cookie Policy", "RERA Details"].map(link => (
            <a key={link} href="#" style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "rgba(122,114,104,.35)", textDecoration: "none", letterSpacing: ".08em" }}>{link}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════ */
function Modal({ open, onClose }) {
  const bp = useBreakpoint();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.88)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn .3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--warm-dark)", width: "100%", maxWidth: 500, border: "1px solid rgba(201,169,110,.15)", position: "relative", maxHeight: "92svh", overflowY: "auto" }}>
        <div style={{ height: 2, background: "linear-gradient(to right, var(--gold-dim), var(--gold), var(--gold-dim))" }} />
        <div style={{ padding: bp.isXs ? "1.5rem 1.25rem" : bp.isMobile ? "1.75rem" : "3rem" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          <Eyebrow label="Enquire Now" />
          <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.6rem" : "2.4rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".4rem" }}>Register Interest</h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", color: "var(--text-dim)", marginBottom: "2rem", fontWeight: 300 }}>Our team will reach out within 24 hours.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {["Full Name", "Phone Number", "Email Address"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.15)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 8 }}>{ph}</div>
                <input placeholder={`Enter your ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".85rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
            <button style={{ width: "100%", padding: 14, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".25em", textTransform: "uppercase", cursor: "pointer" }}>Submit Enquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUTO POPUP
═══════════════════════════════════════════════════════════════ */
function AutoPopup({ open, onClose }) {
  const bp = useBreakpoint();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.82)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: bp.isXs ? ".75rem" : "1rem", animation: "fadeIn .5s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--warm-dark)", width: "100%",
        maxWidth: bp.isMobile ? 380 : 780,
        border: "1px solid rgba(201,169,110,.12)", position: "relative",
        display: "grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr",
        maxHeight: "90svh", overflowY: "auto",
      }}>
        {!bp.isMobile && (
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .6 }} alt="" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.9) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(201,169,110,.6)", marginBottom: 8 }}>Limited Preview</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.4rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05 }}>Exclusive<br /><em style={{ color: "var(--gold-light)" }}>Access</em></h3>
            </div>
          </div>
        )}
        <div style={{ padding: bp.isXs ? "1.75rem 1.5rem" : "3rem", background: "var(--warm-black)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          {bp.isMobile && <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".5rem", fontStyle: "italic" }}>Exclusive Access</h3>}
          <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "var(--text-dim)", marginBottom: "1.75rem", lineHeight: 1.8 }}>
            Be first to receive floor plans, unit availability, and preview invitations for Anant Raj Sector 63A.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "1.75rem" }}>
            {["Full Name", "Phone Number"].map(ph => (
              <div key={ph} style={{ borderBottom: "1px solid rgba(201,169,110,.12)", paddingBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>{ph}</div>
                <input placeholder={`Enter ${ph.toLowerCase()}`} style={{ background: "transparent", border: "none", outline: "none", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }} />
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: 13, background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer" }}>
            Get Early Access
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STICKY BOTTOM CTA — mobile only
═══════════════════════════════════════════════════════════════ */
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
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
      display: "grid", gridTemplateColumns: "1fr 1fr",
      background: "rgba(12,11,9,.97)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(201,169,110,.15)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      animation: "fadeUp .4s ease",
    }}>
      <a href="tel:+919205974843" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 12px", textDecoration: "none", borderRight: "1px solid rgba(201,169,110,.1)", color: "var(--cream)", fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase" }}>
        <span style={{ color: "var(--gold)", fontSize: ".9rem" }}>📞</span> Call Now
      </a>
      <button onClick={onEnquire} style={{ background: "var(--gold)", border: "none", color: "var(--warm-black)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", padding: "14px 12px", cursor: "pointer" }}>
        Enquire Now
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
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

      <div style={{ display: "grid", gridTemplateColumns: bp.isWide ? "1fr 280px" : "1fr" }}>
        <div>
          <StorySection />
          <QuoteBanner />
          <GallerySection onEnquire={() => setModal(true)} />
          <AmenitiesSection />
          <FloorPlanSection onEnquire={() => setModal(true)} />
          <PriceListSection onEnquire={() => setModal(true)} />
          <LocationSection />
          <ContactSection onEnquire={() => setModal(true)} />
        </div>
        {bp.isWide && <Sidebar />}
      </div>

      <Footer />
      <Disclaimer />

      <StickyBottomCTA onEnquire={() => setModal(true)} />

      <Modal open={modal} onClose={() => setModal(false)} />
      <AutoPopup open={autoPopup} onClose={() => setAutoPopup(false)} />

      {bp.isMobile && <div style={{ height: 56 }} />}
    </div>
  );
}