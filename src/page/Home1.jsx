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

function useLeadForm(source = "unknown") {
  const [fields, setFields] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle");

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!fields.name || !fields.phone) return;
    setStatus("loading");
    try {
      await fetch("https://anantraj.deboxtechnology.com/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source, timestamp: new Date().toISOString() }),
      });
      setStatus("success");
      setFields({ name: "", phone: "", email: "" });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => { setStatus("idle"); setFields({ name: "", phone: "", email: "" }); };

  return { fields, set, submit, status, reset };
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

/* ─── Tap / Touch fixes ─── */
@media (max-width: 639px) {
  input, button, a { -webkit-tap-highlight-color: transparent; }
  button { touch-action: manipulation; }
  * { -webkit-text-size-adjust: 100%; }
}
@supports (padding: max(0px)) {
  .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
}

/* ─── Amenity hover ─── */
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

/* ─── Nav logo responsive ─── */
@media (max-width: 374px)                      { .nav-logo { width: 56px !important; height: 56px !important; } }
@media (min-width: 375px) and (max-width: 479px) { .nav-logo { width: 60px !important; height: 60px !important; } }
@media (min-width: 480px) and (max-width: 639px) { .nav-logo { width: 72px !important; height: 72px !important; } }
@media (min-width: 640px) and (max-width: 899px) { .nav-logo { width: 80px !important; height: 80px !important; } }
@media (min-width: 900px) and (max-width: 1199px){ .nav-logo { width: 80px !important; height: 80px !important; } }
@media (min-width: 1200px)                     { .nav-logo { width: 100px !important; height: 80px !important; } }

/* ─── Prevent horizontal overflow globally ─── */
section, footer, div { max-width: 100%; }
table { width: 100%; table-layout: fixed; }

/* ─── Payment schedule table fix ─── */
.payment-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap; gap: 8px; }
.payment-milestone { flex: 1; min-width: 0; font-family: var(--sans); font-weight: 300; color: var(--text-mid); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.payment-percent { flex-shrink: 0; font-family: var(--sans); font-weight: 600; color: var(--primary); }

/* ─── Contact CTA strip responsive ─── */
@media (min-width: 640px) and (max-width: 899px) {
  .contact-cta-grid { flex-direction: column !important; }
  .contact-form-col { width: 100% !important; }
}

/* ─── Footer columns responsive ─── */
@media (max-width: 374px) {
  .footer-brand { grid-column: 1 / -1 !important; }
}

/* ─── Overflow-safe hero form ─── */
.hero-form-grid { display: grid; width: 100%; overflow: hidden; }

/* ─── Price list table xs ─── */
@media (max-width: 479px) {
  .price-table-header, .price-row-inner { grid-template-columns: 1fr auto !important; }
}

/* ─── Sidebar safe ─── */
@media (max-width: 899px) {
  .sidebar-wrapper { display: none !important; }
}
`;

function vPad(bp) {
  if (bp.isXs) return "48px";
  if (bp.isMobile) return "64px";
  if (bp.isTablet) return "80px";
  return "110px";
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

function LeadField({ label, placeholder, value, onChange, borderRight, borderBottom, dark = false, compact = false }) {
  return (
    <div style={{
      padding: compact ? "11px 14px" : "14px 18px",
      borderRight: borderRight ? `1px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(46,61,114,.12)"}` : "none",
      borderBottom: borderBottom ? `1px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(46,61,114,.12)"}` : "none",
      minWidth: 0,
    }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,.5)" : "var(--primary-dim)", marginBottom: 3, fontWeight: 500 }}>{label}</div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ background: "transparent", border: "none", outline: "none", color: dark ? "#fff" : "var(--text-dark)", fontFamily: "var(--sans)", width: "100%", fontSize: compact ? ".72rem" : ".8rem", minWidth: 0 }}
      />
    </div>
  );
}

function SuccessMsg({ dark = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "1.5rem", textAlign: "center" }}>
      <div style={{ width: 36, height: 36, border: `2px solid ${dark ? "#fff" : "var(--primary)"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#fff" : "var(--primary)", fontSize: "1.1rem" }}>✓</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: dark ? "#fff" : "var(--primary)" }}>Thank You!</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: ".68rem", fontWeight: 300, color: dark ? "rgba(255,255,255,.65)" : "var(--text-dim)", lineHeight: 1.7 }}>We'll reach out within 24 hours with exclusive details.</div>
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

  const navHeight = scrolled ? 68 : bp.isXs ? 76 : bp.isMobile ? 82 : 96;

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
          padding: bp.isXs ? "0 .75rem" : bp.isMobile ? "0 1.25rem 0 .75rem" : "0 4rem 0 .95rem",
          height: navHeight, display: "flex", alignItems: "center",
          justifyContent: "space-between", transition: "height .4s ease",
          overflow: "hidden",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", zIndex: 110, flexShrink: 0 }}>
            <img
              src="/logo.svg"
              alt="Anant Raj Limited"
              className="nav-logo"
              style={{ objectFit: "contain", transition: "width .4s ease, height .4s ease", filter: "drop-shadow(0 2px 8px rgba(46,61,114,.18))", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {/* Desktop Nav Links */}
          {bp.isDesktop && (
            <div style={{ display: "flex", gap: bp.isLg ? "1.5rem" : "2.25rem", alignItems: "center", flexWrap: "nowrap", overflow: "hidden" }}>
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
                      fontSize: bp.isLg ? ".58rem" : ".62rem",
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: isActive ? activeLinkColor : linkColor,
                      whiteSpace: "nowrap",
                    }}
                  >{l}</a>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 110, flexShrink: 0 }}>
            {bp.isDesktop && (
              <button onClick={onEnquire}
                style={{
                  background: scrolled ? "var(--primary)" : "rgba(255,255,255,0.15)",
                  border: scrolled ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.6)",
                  color: "#fff",
                  fontFamily: "var(--sans)",
                  fontSize: bp.isLg ? ".58rem" : ".61rem",
                  fontWeight: 500,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  padding: bp.isLg ? "8px 16px" : "9px 20px",
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
            {/* Mobile: show Call link on sm+ only */}
            {bp.isMobile && !open && !bp.isXs && (
              <a href="tel:+919205974843"
                style={{ fontFamily: "var(--sans)", fontSize: ".62rem", letterSpacing: ".06em", color: scrolled ? "var(--secondary)" : "rgba(255,255,255,0.9)", textDecoration: "none", marginRight: 2, display: "flex", alignItems: "center", gap: 4 }}>
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

      {/* Mobile menu overlay */}
      {!bp.isDesktop && open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 105, background: "rgba(255,255,255,.98)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.75rem", animation: "fadeIn .25s ease", paddingBottom: "env(safe-area-inset-bottom, 2rem)", overflowY: "auto" }}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute", top: "1.25rem", right: "1rem",
              background: "rgba(46,61,114,.08)", border: "1px solid rgba(46,61,114,.25)",
              color: "var(--primary)", width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "1.35rem", lineHeight: 1,
              borderRadius: 2, zIndex: 115, fontFamily: "var(--sans)", fontWeight: 300,
              transition: "all .2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(46,61,114,.08)"; e.currentTarget.style.color = "var(--primary)"; }}
          >×</button>

          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : bp.isTablet ? "2rem" : "1.7rem", color: "var(--primary)", textDecoration: "none", letterSpacing: ".02em" }}>{l}</a>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(46,61,114,.2)", margin: "0.25rem 0" }} />
          <button onClick={() => { setOpen(false); onEnquire(); }}
            style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: "14px 40px", cursor: "pointer", marginTop: "0.5rem" }}>
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
  const slides = [
    "https://images.pexels.com/photos/36134239/pexels-photo-36134239.jpeg",
    "https://images.pexels.com/photos/5075082/pexels-photo-5075082.jpeg",
    "https://images.pexels.com/photos/10518326/pexels-photo-10518326.jpeg",
  ];

  const heroDesktopForm = useLeadForm("hero-desktop");
  const heroMobileForm = useLeadForm("hero-mobile");

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % 3), 5500);
    return () => clearInterval(t);
  }, []);

  const headingSize = bp.isXs ? "1.7rem" : bp.isMobile ? "2.1rem" : bp.isTablet ? "2.9rem" : "clamp(3.2rem,5.5vw,5.8rem)";
  const subSize = bp.isXs ? ".7rem" : bp.isMobile ? ".75rem" : bp.isTablet ? ".82rem" : ".88rem";

  const navClearancePx = bp.isXs ? 82 : bp.isMobile ? 88 : bp.isTablet ? 100 : 110;

  const FormSmall = ({ form }) => (
    form.status === "success" ? (
      <SuccessMsg />
    ) : (
      <div style={{ background: "rgba(255,255,255,.95)", backdropFilter: "blur(80px)", border: "1px solid rgba(46,61,114,.18)", maxWidth: bp.isTablet ? 520 : "100%", margin: "0 auto", width: "100%", boxShadow: "0 8px 40px rgba(46,61,114,.15)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr" : "1fr 1fr" }}>
          <LeadField label="Your Name" placeholder="Full Name" value={form.fields.name} onChange={form.set("name")} borderRight={!bp.isXs} borderBottom compact />
          <LeadField label="Phone" placeholder="+91 00000 00000" value={form.fields.phone} onChange={form.set("phone")} borderBottom compact />
        </div>
        <LeadField label="Email" placeholder="you@email.com" value={form.fields.email} onChange={form.set("email")} borderBottom compact />
        <button
          onClick={form.submit}
          disabled={form.status === "loading"}
          style={{ width: "100%", padding: bp.isTablet ? "14px" : "12px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s", opacity: form.status === "loading" ? .7 : 1 }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
          {form.status === "loading" ? "Registering…" : "Register Your Interest Now"}
        </button>
      </div>
    )
  );

  return (
    <section style={{ position: "relative", height: "100svh", minHeight: bp.isXs ? 660 : bp.isMobile ? 700 : 560, overflow: "hidden", background: "var(--primary)" }}>
      {slides.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 1.5s ease" }}>
          <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: i === slide ? "scale(1.03)" : "scale(1)", transition: "transform 6s ease-out" }} alt="" />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.35) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,.5) 75%, rgba(0,0,0,.65) 100%)" }} />

      {/* Slide dots — desktop only */}
      {bp.isDesktop && (
        <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: 2, height: i === slide ? 24 : 10, background: i === slide ? "#fff" : "rgba(255,255,255,.45)", border: "none", cursor: "pointer", borderRadius: 1, padding: 0, transition: "all .4s" }} />
          ))}
        </div>
      )}

      {/* ── Mobile / Tablet layout ── */}
      {(bp.isMobile || bp.isTablet) ? (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start", textAlign: "center",
          paddingTop: navClearancePx + (bp.isXs ? 16 : 24),
          paddingLeft: bp.isXs ? "1rem" : bp.isTablet ? "2rem" : "1.25rem",
          paddingRight: bp.isXs ? "1rem" : bp.isTablet ? "2rem" : "1.25rem",
          paddingBottom: bp.isMobile ? "72px" : "1.5rem",
          overflowY: "auto", zIndex: 5,
        }}>
          <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", maxWidth: bp.isTablet ? 600 : "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: bp.isXs ? 8 : 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 14, height: 1, background: "#fff", opacity: .9 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".46rem" : ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#fff", fontWeight: 300, textShadow: "0 1px 8px rgba(0,0,0,.4)", textAlign: "center" }}>
                Part of 220-acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 14, height: 1, background: "#fff", opacity: .9 }} />
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: bp.isXs ? 8 : 12, textShadow: "0 2px 24px rgba(0,0,0,.4)" }}>
              Anant Raj Limited –
            </h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.9)", maxWidth: bp.isXs ? "100%" : 420, lineHeight: 1.65, marginBottom: bp.isXs ? 10 : 14 }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 220-acre Township in Sector 63A, Gurugram.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(157,50,63,.85)", border: "1px solid rgba(255,255,255,.3)", padding: "5px 14px", marginBottom: bp.isXs ? 14 : 20 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "white", animation: "primaryPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".48rem" : ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>
          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%", maxWidth: bp.isTablet ? 560 : "100%" }}>
            <FormSmall form={heroMobileForm} />
          </div>
        </div>
      ) : (
        /* ── Desktop layout ── */
        <div style={{
          position: "absolute", top: "46%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%", maxWidth: 1400,
          padding: "0 2.5rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          paddingTop: "120px",
        }}>
          <div style={{ animation: "fadeUp 1.2s .3s both", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center" }}>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 300 }}>
                Part of 220-acre Integrated Township · Sector 63A, Gurugram
              </span>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .9 }} />
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 20, textShadow: "0 2px 24px rgba(0,0,0,.35)" }}>
              Anant Raj Limited –
            </h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: subSize, fontWeight: 300, color: "rgba(255,255,255,.9)", maxWidth: 520, lineHeight: 1.8, marginBottom: 20 }}>
              3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising across 5 pristine acres within a 220-acre Township in Sector 63A, Gurugram.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(157,50,63,.85)", border: "1px solid rgba(255,255,255,.3)", padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "primaryPulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "white", fontWeight: 400 }}>Coming Soon — Pre-Launch Phase</span>
            </div>
          </div>

          <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>
            {heroDesktopForm.status === "success" ? (
              <div style={{ maxWidth: bp.isLg ? 660 : 720, margin: "0 auto", background: "rgba(255,255,255,.96)", border: "1px solid rgba(0,0,0,.15)", padding: "1rem 2rem" }}>
                <SuccessMsg />
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: bp.isLg ? "1fr 1fr 1fr auto" : "1fr 1fr 1fr auto",
                gap: 0,
                background: "rgba(255,255,255,.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,0,0,.15)",
                maxWidth: bp.isLg ? 660 : 720,
                margin: "0 auto",
                boxShadow: "0 8px 40px rgba(0,0,0,.18)",
                overflow: "hidden",
              }}>
                <LeadField label="Your Name" placeholder="Full Name" value={heroDesktopForm.fields.name} onChange={heroDesktopForm.set("name")} borderRight compact />
                <LeadField label="Phone" placeholder="+91 00000" value={heroDesktopForm.fields.phone} onChange={heroDesktopForm.set("phone")} borderRight compact />
                <LeadField label="Email" placeholder="you@email.com" value={heroDesktopForm.fields.email} onChange={heroDesktopForm.set("email")} borderRight compact />
                <button
                  onClick={heroDesktopForm.submit}
                  disabled={heroDesktopForm.status === "loading"}
                  style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .25s", opacity: heroDesktopForm.status === "loading" ? .7 : 1, minWidth: 110 }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                  {heroDesktopForm.status === "loading" ? "…" : "Register"}
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
  const headingSize = bp.isXs ? "1.7rem" : bp.isMobile ? "1.9rem" : bp.isTablet ? "2.6rem" : "clamp(2.2rem,3.5vw,4rem)";

  return (
    <section id="story" ref={ref} style={{ background: "var(--white)", padding: `${vPad(bp)} 0` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isXs ? 28 : bp.isMobile ? 32 : bp.isTablet ? 40 : 64, alignItems: "center" }}>
          {bp.isDesktop && (
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -18, left: -18, width: 160, height: 160, border: "1px solid rgba(46,61,114,.12)", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1, aspectRatio: "4/5", overflow: "hidden", width: "100%" }}>
                  <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="Interior" />
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
            <h2 style={{ fontFamily: "var(--serif)", fontSize: headingSize, fontWeight: 400, color: "var(--primary)", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Designed for those<br /><span style={{ color: "var(--secondary)" }}>who seek perfection</span>
            </h2>
            <div style={{ width: 48, height: 2, background: "var(--secondary)", opacity: .5, marginBottom: "1.25rem" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".76rem" : ".86rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 2, marginBottom: "1rem" }}>
              An exclusive upcoming residential development by Anant Raj Limited, located in the prime area of Sector 63A, Gurugram. Part of a large 220-acre integrated township, this premium project is spread across 5 acres and features 2 luxury residential towers designed by international architects.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".76rem" : ".86rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 2, marginBottom: "2rem" }}>
              Premium low-density living in the vicinity of Golf Course Extension Road — a rare collaboration between global design vision and Indian craftsmanship, delivering modern luxury residences of unparalleled distinction.
            </p>
            {/* Mobile image */}
            {!bp.isDesktop && (
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: "1.5rem" }}>
                <img src="https://images.pexels.com/photos/12955837/pexels-photo-12955837.jpeg" alt="Luxury Interior" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 14, right: 14, background: "var(--primary)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.2)", padding: "8px 14px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 400, color: "#fff", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginTop: 3, fontWeight: 400 }}>Registered</div>
                </div>
              </div>
            )}
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: "1px solid rgba(46,61,114,.1)", paddingTop: "1.5rem" }}>
              {[{ val: units, label: "Residences" }, { val: acres, label: "Acres" }, { val: towers, label: "Towers" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(46,61,114,.1)" : "none", padding: bp.isXs ? "0 .4rem" : "0 .875rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2.1rem" : "3rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 5, fontWeight: 400 }}>{s.label}</div>
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
  const fontSize = bp.isXs ? "1.3rem" : bp.isMobile ? "1.55rem" : "clamp(1.6rem,3.5vw,3.5rem)";
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--primary)", padding: bp.isXs ? "44px 1rem" : bp.isMobile ? "56px 1.25rem" : bp.isTablet ? "72px 2rem" : "90px 2rem" }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .08 }} alt="" />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--serif)", fontSize, fontWeight: 400, color: "#fff", lineHeight: 1.2, maxWidth: 800, margin: "0 auto 1.25rem" }}>
            Where world-class design meets<br />the soul of Sector 63A, Gurugram.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 24, height: 1, background: "#fff", opacity: .6 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".5rem" : ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", fontWeight: 400 }}>Exclusive pre-launch pricing available now</span>
            <div style={{ width: 24, height: 1, background: "#fff", opacity: .6 }} />
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
  ];

  // Responsive grid configurations
  let gridItems, cols, rowDef;
  if (bp.isXs) {
    // Single column stack
    gridItems = imgs.map((img, i) => ({ ...img, col: "1/2", row: `${i + 1}/${i + 2}` }));
    cols = "1fr"; rowDef = "200px 200px 200px";
  } else if (bp.isMobile) {
    gridItems = [{ ...imgs[0], col: "1/3", row: "1/2" }, { ...imgs[1], col: "1/2", row: "2/3" }, { ...imgs[2], col: "2/3", row: "2/3" }];
    cols = "1fr 1fr"; rowDef = "210px 190px";
  } else if (bp.isTablet) {
    gridItems = [{ ...imgs[0], col: "1/3", row: "1/2" }, { ...imgs[1], col: "1/2", row: "2/3" }, { ...imgs[2], col: "2/3", row: "2/3" }];
    cols = "1fr 1fr"; rowDef = "240px 220px";
  } else if (bp.isLg) {
    gridItems = [{ ...imgs[0], col: "1/2", row: "1/3" }, { ...imgs[1], col: "2/3", row: "1/2" }, { ...imgs[2], col: "2/3", row: "2/3" }];
    cols = "1.35fr 1fr"; rowDef = "280px 280px";
  } else {
    gridItems = [{ ...imgs[0], col: "1/2", row: "1/3" }, { ...imgs[1], col: "2/3", row: "1/2" }, { ...imgs[2], col: "2/3", row: "2/3" }];
    cols = "1.4fr 1fr"; rowDef = "310px 310px";
  }

  return (
    <section id="gallery" style={{ padding: `${vPad(bp)} 0`, background: "var(--off-white)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <Eyebrow label="Gallery" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.7rem" : bp.isMobile ? "1.9rem" : "clamp(1.9rem,3.5vw,3.5rem)", fontWeight: 400, color: "var(--primary)", marginBottom: "2rem", lineHeight: 1.1 }}>
            A glimpse of <span style={{ color: "var(--secondary)" }}>elegance</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rowDef, gap: bp.isXs ? 4 : 5 }}>
          {gridItems.map((img, i) => {
            const isHovered = hov === i;
            return (
              <div key={i} style={{ gridColumn: img.col, gridRow: img.row, position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => setClicked(clicked === i ? null : i)}>
                <img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .8s cubic-bezier(.16,1,.3,1)", transform: isHovered ? "scale(1.06)" : "scale(1)", display: "block" }} alt={img.label} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(46,61,114,.7) 0%, rgba(46,61,114,.1) 40%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: bp.isXs ? "10px 12px" : "14px 18px", pointerEvents: "none", display: "flex", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 1, background: "#fff", opacity: isHovered ? 1 : 0.6, transition: "opacity .3s" }} />
                    <span style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".85rem" : "1.05rem", color: isHovered ? "#fff" : "rgba(255,255,255,.8)", transition: "color .3s" }}>{img.label}</span>
                  </div>
                </div>
                {clicked === i && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, animation: "fadeIn .25s ease", width: "100%", display: "flex", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "rgba(255,255,255,.92)", border: "1px solid var(--primary)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: bp.isXs ? ".56rem" : ".6rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", padding: bp.isXs ? "9px 18px" : "11px 26px", cursor: "pointer", backdropFilter: "blur(12px)", whiteSpace: "nowrap" }}>
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
  // Responsive grid: 2 cols on mobile/xs, 3 on tablet, 4 on desktop
  const gridCols = bp.isXs ? "1fr 1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)";

  return (
    <section id="amenities" style={{ padding: `${vPad(bp)} 0`, background: "var(--white)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "80vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,61,114,.03) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ marginBottom: bp.isXs ? "2rem" : "3.5rem" }}>
            <Eyebrow label="Amenities" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.7rem" : bp.isMobile ? "1.9rem" : "clamp(1.9rem,3.5vw,3.5rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1.05 }}>
              Curated for an<br /><span style={{ color: "var(--secondary)" }}>exceptional life</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 2 : 3 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="amenity-card" style={{ position: "relative", padding: bp.isXs ? "1.1rem .9rem" : bp.isMobile ? "1.35rem 1.1rem" : "1.75rem 1.5rem", background: "var(--off-white)", border: "1px solid rgba(46,61,114,.08)", cursor: "default", transition: "all .4s ease", minHeight: bp.isXs ? 120 : bp.isMobile ? 150 : 190, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                  <div className="amenity-num" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1rem" : "1.3rem", color: "var(--primary)", fontWeight: 400, opacity: 0.2, transition: "opacity .4s ease", lineHeight: 1 }}>{item.num}</div>
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".85rem" : "1.05rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".3rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".56rem" : ".65rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: ".65rem" }}>{item.desc}</p>
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
    { icon: "◈", title: "Italian Marble Flooring", desc: "Imported Statuario & Calacatta marble in living areas, master bedroom and bathrooms — each slab hand-selected for grain and tone.", tag: "Finishes" },
    { icon: "◉", title: "Floor-to-Ceiling Glazing", desc: "Double-glazed, thermally broken aluminium frames with UV-filtered glass offering unobstructed skyline views from every room.", tag: "Architecture" },
    { icon: "◌", title: "Crestron Smart Home", desc: "Fully integrated home automation — lighting scenes, climate, security, AV and blinds — controlled from a single touchpad or smartphone.", tag: "Technology" },
    { icon: "◈", title: "Private Sky Decks", desc: "Select residences feature private outdoor terraces with landscaped planters, creating an extension of interior living into the open sky.", tag: "Lifestyle" },
    { icon: "◉", title: "Modular German Kitchen", desc: "Fully fitted kitchens with Häcker cabinetry, quartz countertops, Siemens appliances and concealed MEP services.", tag: "Kitchen" },
    { icon: "◌", title: "3-Tier Security", desc: "Biometric access, AI-powered CCTV surveillance, 24/7 concierge and dedicated security staff at every entry point.", tag: "Security" },
  ];
  const gridCols = bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <section id="premium-features" style={{ padding: `${vPad(bp)} 0`, background: "var(--primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(157,50,63,.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,.04) 0%, transparent 40%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}`, position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ marginBottom: bp.isXs ? "2rem" : "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: "#fff", opacity: .8 }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#fff", fontWeight: 500 }}>Premium Features</span>
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.7rem" : bp.isMobile ? "1.9rem" : "clamp(1.9rem,3.5vw,3.5rem)", fontWeight: 400, color: "#fff", lineHeight: 1.05 }}>
              Crafted to the<br /><span style={{ color: "#fff" }}>finest detail</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 2 : 3 }}>
          {features.map((feat, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="feature-card" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", padding: bp.isXs ? "1.25rem 1rem" : "1.75rem 1.5rem", position: "relative", overflow: "hidden", cursor: "default", height: "100%", display: "flex", flexDirection: "column", gap: ".875rem", boxShadow: "0 4px 24px rgba(0,0,0,.12)" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 24, height: 24, borderBottom: "1px solid rgba(255,255,255,.3)", borderLeft: "1px solid rgba(255,255,255,.3)" }} />
                <div>
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", fontWeight: 500, opacity: .8 }}>{feat.tag}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ color: "#fff", fontSize: "1rem", opacity: .7, flexShrink: 0, marginTop: 2 }}>{feat.icon}</div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".95rem" : "1.1rem", fontWeight: 400, color: "#fff", lineHeight: 1.2 }}>{feat.title}</h4>
                </div>
                <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".66rem" : ".72rem", fontWeight: 300, color: "rgba(255,255,255,.55)", lineHeight: 1.8 }}>{feat.desc}</p>
                <div style={{ marginTop: "auto", height: 1, background: "linear-gradient(to right, rgba(255,255,255,.3), transparent)" }} />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          {/* Bottom badge strip - 2x2 on xs, 4-col otherwise */}
          <div style={{ marginTop: bp.isXs ? "1.75rem" : "2.5rem", display: "grid", gridTemplateColumns: bp.isXs ? "1fr 1fr" : "repeat(4,1fr)", gap: 0, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)" }}>
            {[{ val: "RERA", sub: "Registered Project" }, { val: "IGBC", sub: "Platinum Green Certified" }, { val: "BMS", sub: "Building Mgmt System" }, { val: "EV", sub: "Charging Points" }].map((item, i) => (
              <div key={i} style={{ padding: bp.isXs ? "1rem .875rem" : "1.25rem 1.75rem", borderRight: bp.isXs ? (i % 2 === 0 ? "1px solid rgba(255,255,255,.08)" : "none") : (i < 3 ? "1px solid rgba(255,255,255,.08)" : "none"), borderBottom: bp.isXs && i < 2 ? "1px solid rgba(255,255,255,.08)" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.2rem" : "1.5rem", fontWeight: 400, color: "#fff", lineHeight: 1 }}>{item.val}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginTop: 5, fontWeight: 300 }}>{item.sub}</div>
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
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "2rem" : "3rem" }}>
            <Eyebrow label="Pricing" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "2rem" : bp.isMobile ? "2.5rem" : "clamp(2.2rem,4.5vw,4rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1, marginBottom: ".5rem" }}>Price List</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 28 : 20, alignItems: "stretch" }}>
          <Reveal>
            <div style={{ background: "var(--white)", border: "1px solid rgba(46,61,114,.12)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 4px 24px rgba(46,61,114,.06)" }}>
              <div style={{ padding: bp.isXs ? "1.1rem 1.25rem" : "1.5rem 2rem", borderBottom: "1px solid rgba(46,61,114,.1)", background: "var(--primary)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.2rem" : "1.55rem", fontWeight: 400, color: "#fff" }}>Property Investment Plans</h3>
              </div>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr auto" : "1fr 1.2fr 1fr auto", gap: 0, borderBottom: "1px solid rgba(46,61,114,.08)", padding: bp.isXs ? "9px 1.25rem" : "11px 2rem", background: "rgba(46,61,114,.04)" }}>
                {(bp.isXs ? ["TYPE", "PRICE"] : ["TYPE", "AREA", "PRICE", ""]).map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600 }}>{h}</div>
                ))}
              </div>
              {units.map((u, i) => (
                <div key={i} className="price-row"
                  style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr auto" : "1fr 1.2fr 1fr auto", gap: 0, alignItems: "center", padding: bp.isXs ? ".9rem 1.25rem" : "1.1rem 2rem", borderBottom: i < units.length - 1 ? "1px solid rgba(46,61,114,.06)" : "none", transition: "background .2s", cursor: "pointer", background: "transparent" }}
                  onClick={onEnquire}>
                  <div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".95rem" : "1.1rem", fontWeight: 400, color: "var(--primary)" }}>{u.type}</div>
                    {bp.isXs && <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 300 }}>{u.area}</div>}
                  </div>
                  {!bp.isXs && <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, color: "var(--text-mid)" }}>{u.area}</div>}
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".7rem" : ".8rem", fontWeight: 500, color: "var(--secondary)" }}>{u.price}</div>
                  {!bp.isXs && (
                    <button className="details-btn" onClick={e => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "transparent", border: "1px solid rgba(46,61,114,.3)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: ".54rem", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
                      Details
                    </button>
                  )}
                </div>
              ))}
              <div style={{ padding: bp.isXs ? ".875rem 1.25rem 1.25rem" : "1rem 2rem 1.75rem", borderTop: "1px solid rgba(46,61,114,.08)", marginTop: "auto" }}>
                <button onClick={onEnquire}
                  style={{ width: "100%", padding: bp.isXs ? "12px" : "15px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                  Complete Costing Details
                </button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ position: "relative", overflow: "hidden", height: bp.isDesktop ? "100%" : (bp.isXs ? 200 : 260), minHeight: bp.isDesktop ? 320 : "auto" }}>
              <img src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }} alt="Price List" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(46,61,114,.55) 0%, rgba(46,61,114,.8) 100%)" }} />
              <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "1px solid rgba(255,255,255,.5)", padding: "6px 14px" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, color: "white", letterSpacing: ".1em", textTransform: "uppercase" }}>Price List</span>
              </div>
              <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.1rem" : "1.4rem", fontWeight: 400, color: "#fff" }}>Pre-launch pricing<br />available on request</div>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div style={{ marginTop: "1.25rem", fontFamily: "var(--sans)", fontSize: ".58rem", color: "var(--text-dim)", letterSpacing: ".04em", fontWeight: 300 }}>
            * Prices are indicative and subject to floor rise & GST. Subject to RERA guidelines.
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
  const features = ["Flexible Construction Linked Payment Plan", "Attractive Early Buyer Benefits", "Limited Inventory Available"];

  return (
    <section id="price-configuration" style={{ padding: `${vPad(bp)} 0`, background: "var(--white)", borderTop: "1px solid rgba(46,61,114,.1)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ textAlign: "left", marginBottom: bp.isXs ? "1.75rem" : "2.5rem" }}>
            <Eyebrow label="Configuration" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.8rem" : bp.isMobile ? "2.4rem" : "clamp(2.2rem,4vw,4rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1 }}>Price & Configuration</h2>
          </div>
        </Reveal>

        {/* Unit type tabs — desktop only */}
        {bp.isDesktop && (
          <Reveal>
            <div style={{ display: "flex", gap: 8, marginBottom: "1.75rem", flexWrap: "wrap" }}>
              {unitTypes.map((u, i) => (
                <button key={i} className={`price-config-tab${activeUnit === i ? " active" : ""}`}
                  onClick={() => setActiveUnit(i)}
                  style={{ background: activeUnit === i ? "var(--primary)" : "transparent", border: activeUnit === i ? "1px solid var(--primary)" : "1px solid rgba(46,61,114,.2)", color: activeUnit === i ? "#fff" : "var(--text-mid)", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: activeUnit === i ? 500 : 300, letterSpacing: ".07em", padding: "9px 20px", cursor: "pointer", transition: "all .2s" }}>
                  {u.type}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1fr" : "1fr", gap: bp.isDesktop ? 24 : 18 }}>
          {/* Unit details card */}
          <Reveal>
            <div style={{ background: "var(--off-white)", border: "1px solid rgba(46,61,114,.1)", padding: bp.isXs ? "1.25rem" : "2rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* Mobile unit type tabs */}
                {!bp.isDesktop && (
                  <div style={{ marginBottom: "1.25rem", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {unitTypes.map((u, i) => (
                      <button key={i} onClick={() => setActiveUnit(i)}
                        style={{ background: activeUnit === i ? "var(--primary)" : "transparent", border: "1px solid rgba(46,61,114,.25)", color: activeUnit === i ? "#fff" : "var(--text-mid)", fontFamily: "var(--sans)", fontSize: ".58rem", fontWeight: 400, padding: "6px 14px", cursor: "pointer", borderRadius: 20, transition: "all .2s" }}>
                        {u.type}
                      </button>
                    ))}
                  </div>
                )}
                <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : "2rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.1, marginBottom: ".35rem" }}>{unitTypes[activeUnit].type}</h3>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 400, color: "var(--secondary)", marginBottom: "1.5rem", letterSpacing: ".03em" }}>{unitTypes[activeUnit].subLabel}</div>
                <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(46,61,114,.08)" }}>
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Super Area</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", fontWeight: 400, color: "var(--primary)" }}>{unitTypes[activeUnit].area}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 400, marginBottom: 4 }}>Price</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".95rem", fontWeight: 500, color: "var(--secondary)" }}>On Request</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.75rem" }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 15, height: 15, border: `1.5px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 5, height: 4, borderLeft: `2px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, borderBottom: `2px solid ${i === 2 ? "rgba(46,61,114,.3)" : "var(--primary)"}`, transform: "rotate(-45deg) translate(1px,-1px)" }} />
                      </div>
                      <span style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".7rem" : ".76rem", fontWeight: 300, color: i === 2 ? "var(--text-dim)" : "var(--text-mid)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={onEnquire}
                style={{ width: "100%", padding: bp.isXs ? "12px" : "15px", background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                Get Pricing Details <span style={{ fontSize: ".95rem" }}>↓</span>
              </button>
            </div>
          </Reveal>

          {/* Payment schedule card */}
          <Reveal delay={bp.isDesktop ? .15 : 0}>
            <div style={{ background: "var(--off-white)", border: "1px solid rgba(46,61,114,.1)", padding: bp.isXs ? "1.25rem" : "2rem", height: "100%" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.3rem" : "1.65rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.15, marginBottom: "1.5rem" }}>Construction Linked Payment</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {visibleSchedule.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: bp.isXs ? "10px 0" : "13px 0",
                    borderBottom: i < visibleSchedule.length - 1 ? "1px solid rgba(46,61,114,.07)" : "none",
                    gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 3, height: 18, background: "var(--secondary)", opacity: .4, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".76rem", fontWeight: 300, color: "var(--text-mid)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.milestone}</div>
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".78rem" : ".88rem", fontWeight: 600, color: "var(--primary)", letterSpacing: ".02em", flexShrink: 0, marginLeft: 10 }}>{item.percent}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowFullSchedule(v => !v)}
                style={{ marginTop: "1rem", background: "none", border: "none", fontFamily: "var(--sans)", fontSize: ".68rem", fontWeight: 500, color: "var(--secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0, letterSpacing: ".02em" }}>
                {showFullSchedule ? "Hide Schedule" : "View Full Schedule"}
                <span style={{ fontSize: ".85rem", transition: "transform .3s", transform: showFullSchedule ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</span>
              </button>
              <div style={{ marginTop: "1.25rem", padding: ".875rem 1rem", background: "rgba(46,61,114,.04)", border: "1px solid rgba(46,61,114,.1)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.7 }}>
                  Subvention & flexi payment plans also available. GST, stamp duty & registration charges extra.
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
  const mapHeight = bp.isXs ? 240 : bp.isMobile ? 280 : bp.isTablet ? 340 : "100%";

  return (
    <section id="location" style={{ padding: `${vPad(bp)} 0`, background: "var(--off-white)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: bp.isXs ? "1.75rem" : "3rem", gap: "1rem" }}>
            <div>
              <Eyebrow label="Location" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.7rem" : "clamp(1.9rem,3.5vw,3.5rem)", fontWeight: 400, color: "var(--primary)", lineHeight: 1.05 }}>
                Strategic <span style={{ color: "var(--secondary)" }}>connectivity</span>
              </h2>
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "var(--text-dim)", maxWidth: 300, lineHeight: 1.9 }}>
              Sector 63A, Gurugram — prime vicinity of Golf Course Extension Road.
            </div>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: bp.isDesktop ? "1fr 1.15fr" : "1fr", gap: bp.isDesktop ? 4 : 24 }}>
          {/* Distances table */}
          <Reveal>
            <div style={{ background: "var(--white)", border: "1px solid rgba(46,61,114,.1)", overflow: "hidden", boxShadow: "0 4px 24px rgba(46,61,114,.06)" }}>
              <div style={{ padding: bp.isXs ? ".9rem 1.1rem" : "1.1rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, background: "var(--primary)" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", fontWeight: 400 }}>Distances from Site</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "primaryPulse 2s infinite" }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", fontWeight: 300 }}>Sector 63A</span>
                </div>
              </div>
              {landmarks.map((lm, i) => (
                <div key={i} className="landmark-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: bp.isXs ? ".8rem 1.1rem" : ".9rem 1.75rem", borderBottom: i < landmarks.length - 1 ? "1px solid rgba(46,61,114,.06)" : "none", transition: "background .25s ease" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".68rem" : ".76rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lm.name}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".48rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 2, fontWeight: 400 }}>{lm.category}</div>
                  </div>
                  <div className="landmark-dist" style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".95rem" : "1.05rem", color: "var(--primary)", flexShrink: 0, textAlign: "right", fontWeight: 700 }}>{lm.dist}</div>
                </div>
              ))}
              <div style={{ padding: bp.isXs ? ".875rem 1.1rem" : "1.1rem 1.75rem", background: "rgba(46,61,114,.04)", borderTop: "1px solid rgba(46,61,114,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 2, fontWeight: 500 }}>Site Address</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".65rem" : ".72rem", fontWeight: 300, color: "var(--text-mid)" }}>Sector 63A, Gurugram, Haryana — 122101</div>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                  style={{ fontFamily: "var(--sans)", fontSize: ".56rem", letterSpacing: ".13em", textTransform: "uppercase", color: "var(--secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", fontWeight: 500 }}>
                  Get Directions <span style={{ fontSize: ".78rem" }}>→</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={bp.isDesktop ? 0.15 : 0}>
            <div style={{ position: "relative", overflow: "hidden", height: bp.isDesktop ? "100%" : mapHeight, minHeight: bp.isDesktop ? 440 : mapHeight }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14026!2d77.0856!3d28.4089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e4b8f4c6b1%3A0x6b04d8b6e5c7c4a0!2sSector%2063A%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="100%"
                style={{ display: "block", filter: "grayscale(100%) contrast(85%) brightness(90%)", border: "none", position: "absolute", inset: 0 }}
                loading="lazy" title="Location" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(46,61,114,.25) 0%, transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--secondary)", animation: "pulse-ring 2s ease-out infinite", width: 20, height: 20 }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--secondary)", border: "3px solid #fff", position: "relative", zIndex: 1, boxShadow: "0 0 0 2px rgba(157,50,63,.3)" }} />
              </div>
              <div style={{ position: "absolute", top: bp.isXs ? ".75rem" : "1rem", left: bp.isXs ? ".75rem" : "1rem", zIndex: 3, background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(46,61,114,.15)", padding: bp.isXs ? "7px 10px" : "9px 14px", boxShadow: "0 4px 16px rgba(46,61,114,.1)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".48rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--primary-dim)", marginBottom: 2, fontWeight: 400 }}>Project Location</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".82rem" : ".95rem", color: "var(--primary)", fontWeight: 400 }}>Sector 63A, Gurugram</div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, background: "rgba(46,61,114,.92)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,.1)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[{ label: "IGI Airport", val: "22 km" }, { label: "Golf Course Ext", val: "2 km" }, { label: "NH-48", val: "5 km" }].map((s, i) => (
                  <div key={i} style={{ padding: bp.isXs ? ".65rem .75rem" : ".9rem 1.1rem", borderRight: i < 2 ? "1px solid rgba(255,255,255,.1)" : "none", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? ".88rem" : "1rem", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".42rem" : ".48rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", marginTop: 3, fontWeight: 300 }}>{s.label}</div>
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
  const contactForm = useLeadForm("contact-section");

  return (
    <section style={{ background: "var(--white)", borderTop: "1px solid rgba(46,61,114,.08)" }}>
      {/* Contact info row */}
      <div style={{ padding: `${vPad(bp)} 0`, paddingBottom: bp.isXs ? "1.75rem" : "2.5rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hPad(bp)}` }}>
          <Reveal>
            <Eyebrow label="Visit Us" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.7rem" : "clamp(1.9rem,3.5vw,3.5rem)", fontWeight: 400, color: "var(--primary)", marginBottom: "2rem", lineHeight: 1.05 }}>
              The experience <span style={{ color: "var(--secondary)" }}>awaits you</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr" : bp.isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: bp.isXs ? "1.5rem" : "1.75rem" }}>
              {[
                { icon: "◈", title: "Site Address", lines: ["Sector 63A, Gurugram", "Haryana — 122101"] },
                { icon: "◉", title: "Sales", lines: ["+91 92059 74843"] },
                { icon: "◌", title: "Email", lines: ["info@anantrajsector63a.com"] },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start" }}>
                  <div style={{ color: "var(--secondary)", fontSize: "1rem", marginTop: 2, opacity: .7, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".56rem", letterSpacing: ".23em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 7, fontWeight: 400 }}>{c.title}</div>
                    {c.lines.map((line, j) => <div key={j} style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".76rem" : ".8rem", fontWeight: 300, color: "var(--text-mid)", lineHeight: 1.8, wordBreak: "break-word" }}>{line}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA strip */}
      <Reveal>
        <div style={{ background: "white" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: bp.isXs ? "2rem 1rem 2.5rem" : bp.isMobile ? "2.5rem 1.25rem 3rem" : bp.isTablet ? "3rem 1.75rem" : "3.5rem 2.5rem", display: "flex", flexDirection: (bp.isMobile || bp.isTablet) ? "column" : "row", alignItems: (bp.isMobile || bp.isTablet) ? "flex-start" : "center", justifyContent: "space-between", gap: "2rem" }}>
            {/* Copy */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 22, height: 1, background: "#9D323F", opacity: .8 }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: ".53rem", letterSpacing: ".26em", textTransform: "uppercase", color: "#9D323F", fontWeight: 500 }}>Pre-Launch · Limited Units</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.4rem" : bp.isMobile ? "1.65rem" : "clamp(1.6rem,2.6vw,2.5rem)", fontWeight: 400, color: "#2E3D72", lineHeight: 1.12, marginBottom: ".65rem" }}>
                Register now for exclusive<br />pre-launch pricing & floor plans.
              </h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".72rem", fontWeight: 300, color: "#4167A7", lineHeight: 1.8, maxWidth: 400 }}>
                Our team will reach out within 24 hours with complete pricing, availability and site visit details.
              </p>
            </div>

            {/* Divider — desktop only */}
            {!(bp.isMobile || bp.isTablet) && <div style={{ width: 1, height: 100, background: "rgba(0,0,0,.1)", flexShrink: 0, margin: "0 1rem" }} />}

            {/* Form */}
            <div style={{ flexShrink: 0, width: bp.isXs ? "100%" : bp.isMobile ? "100%" : bp.isTablet ? "100%" : 420 }}>
              {contactForm.status === "success" ? (
                <SuccessMsg />
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: bp.isXs ? "1fr" : "1fr 1fr", gap: 2, marginBottom: 2 }}>
                    <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(0,0,0,.12)", padding: "11px 14px" }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 4, fontWeight: 500 }}>Full Name</div>
                      <input value={contactForm.fields.name} onChange={contactForm.set("name")} placeholder="Your Name" style={{ background: "transparent", border: "none", outline: "none", color: "#000", fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, width: "100%" }} />
                    </div>
                    <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(0,0,0,.12)", padding: "11px 14px" }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 4, fontWeight: 500 }}>Phone</div>
                      <input value={contactForm.fields.phone} onChange={contactForm.set("phone")} placeholder="+91 00000 00000" style={{ background: "transparent", border: "none", outline: "none", color: "#000", fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, width: "100%" }} />
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(0,0,0,.12)", padding: "11px 14px", marginBottom: 2 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".44rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 4, fontWeight: 500 }}>Email</div>
                    <input value={contactForm.fields.email} onChange={contactForm.set("email")} placeholder="you@email.com" style={{ background: "transparent", border: "none", outline: "none", color: "#000", fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, width: "100%" }} />
                  </div>
                  <button
                    onClick={contactForm.submit}
                    disabled={contactForm.status === "loading"}
                    style={{ width: "100%", padding: "13px 24px", background: "var(--secondary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".61rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: contactForm.status === "loading" ? .7 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#b83848"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--secondary)"}>
                    {contactForm.status === "loading" ? "Registering…" : <> Register Your Interest Now <span style={{ fontSize: ".85rem" }}>→</span> </>}
                  </button>
                  <p style={{ fontFamily: "var(--sans)", fontSize: ".52rem", color: "rgba(0,0,0,.45)", letterSpacing: ".07em", fontWeight: 300, marginTop: 8, textAlign: "center" }}>We respect your privacy. No spam, ever.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ SIDEBAR ═══ */
function Sidebar() {
  const sidebarForm = useLeadForm("sidebar");
  const bp = useBreakpoint();

  return (
    <div style={{ position: "sticky", top: 80, alignSelf: "start", padding: "2rem 1.5rem", background: "var(--off-white)", borderLeft: "1px solid rgba(46,61,114,.08)", maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}>
      <div style={{ borderBottom: "1px solid rgba(46,61,114,.1)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".23em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: ".35rem", fontWeight: 400 }}>Configuration</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--primary)", lineHeight: 1.2 }}>3 BHK & 3 BHK + Study</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", color: "var(--text-dim)", marginTop: 5, letterSpacing: ".04em", fontWeight: 300 }}>2,300 – 2,600 sq.ft</div>
        <div style={{ marginTop: 9, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(157,50,63,.1)", padding: "4px 10px", border: "1px solid rgba(157,50,63,.2)" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--secondary)", animation: "primaryPulse 2s infinite" }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: ".46rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--secondary)", fontWeight: 500 }}>Coming Soon</span>
        </div>
      </div>

      {sidebarForm.status === "success" ? (
        <SuccessMsg />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem", marginBottom: "1.75rem" }}>
            {[
              { key: "name", label: "Full Name", ph: "Enter Full Name" },
              { key: "phone", label: "Phone", ph: "Enter Phone" },
              { key: "email", label: "Email", ph: "Enter Email" },
            ].map(f => (
              <div key={f.key} style={{ borderBottom: "1px solid rgba(46,61,114,.12)", paddingBottom: ".65rem" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 5, fontWeight: 400 }}>{f.label}</div>
                <input
                  value={sidebarForm.fields[f.key]}
                  onChange={sidebarForm.set(f.key)}
                  placeholder={f.ph}
                  style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, width: "100%" }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={sidebarForm.submit}
            disabled={sidebarForm.status === "loading"}
            style={{ width: "100%", padding: 11, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".58rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1.75rem", transition: "background .25s", opacity: sidebarForm.status === "loading" ? .7 : 1 }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
            {sidebarForm.status === "loading" ? "Registering…" : "Register Interest"}
          </button>
        </>
      )}

      <div style={{ borderTop: "1px solid rgba(46,61,114,.08)", paddingTop: "1.5rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: ".875rem", fontWeight: 400 }}>Speak to an Expert</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(46,61,114,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".85rem", background: "rgba(46,61,114,.04)" }}>📞</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".74rem", fontWeight: 400, color: "var(--text-mid)" }}>+91 92059 74843</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".56rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 300 }}>Available 9am – 8pm</div>
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
    "Company": ["About Anant Raj", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };
  // Responsive footer grid
  const gridCols = bp.isXs ? "1fr 1fr" : bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr";

  return (
    <footer style={{ background: "var(--primary)", padding: bp.isXs ? "40px 1rem 24px" : bp.isMobile ? "48px 1.25rem 28px" : "64px 2rem 36px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: bp.isXs ? 24 : bp.isMobile ? 20 : 40, marginBottom: 40 }}>
          {/* Brand column — full width on xs */}
          <div style={{ gridColumn: bp.isXs ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 18, height: 1, background: "#fff" }} />
                <div style={{ width: 10, height: 1, background: "#fff", opacity: .5 }} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 400, color: "#fff" }}>Anant Raj Limited</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.55)", lineHeight: 1.9, marginBottom: "1.1rem", maxWidth: 260 }}>
              An exclusive luxury residential development in Sector 63A, Gurugram — part of a 220-acre integrated township.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fb", "Tw", "In", "Li"].map(s => (
                <a key={s} href="#" style={{ width: 28, height: 28, border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: ".56rem", color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 400 }}>{s}</a>
              ))}
            </div>
          </div>

          {/* On xs: show only 2 link groups inline; on tablet+ show all 3 */}
          {Object.entries(links).map(([group, items], idx) => {
            // On xs, skip 3rd group to avoid overflow (legal links shown in disclaimer)
            if (bp.isXs && idx === 2) return null;
            return (
              <div key={group}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".23em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: "1rem", fontWeight: 500 }}>{group}</div>
                <ul style={{ listStyle: "none" }}>
                  {items.map(item => (<li key={item} style={{ marginBottom: ".55rem" }}><a href="#" style={{ fontFamily: "var(--sans)", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.55)", textDecoration: "none" }}>{item}</a></li>))}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: bp.isXs ? "column" : "row", justifyContent: "space-between", alignItems: bp.isXs ? "flex-start" : "center", borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: "1.25rem", gap: ".5rem" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".58rem", color: "rgba(255,255,255,.5)", fontWeight: 300 }}>© 2026 Anant Raj Limited. All Rights Reserved.</p>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".56rem", color: "rgba(255,255,255,.22)", fontWeight: 300 }}>RERA Reg. No. HRERA/GGM/2024/63A/001</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══ DISCLAIMER ═══ */
function Disclaimer() {
  const bp = useBreakpoint();
  return (
    <div style={{ background: "#2E3D72", borderTop: "1px solid rgba(255,255,255,.08)", padding: bp.isXs ? "1.5rem 1rem" : bp.isMobile ? "1.75rem 1.25rem" : "2.25rem 2rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: ".875rem" }}>
          <div style={{ width: 1, background: "white", opacity: .8, alignSelf: "stretch", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".26em", textTransform: "uppercase", color: "white", opacity: .8, marginBottom: ".5rem", fontWeight: 500 }}>Legal Disclaimer</div>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".62rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9, marginBottom: ".5rem" }}>
              This website has been prepared solely for informational purposes and does not constitute an offer, invitation, or inducement to invest in or purchase any property.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: bp.isXs ? ".58rem" : ".62rem", fontWeight: 300, color: "var(--text-dim)", lineHeight: 1.9 }}>
              Prospective buyers are advised to independently verify all details with the relevant government authorities before making any purchase decision.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(46,61,114,.08)", paddingTop: ".65rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(link => (
            <a key={link} href="#" style={{ fontFamily: "var(--sans)", fontSize: ".56rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: ".07em", fontWeight: 300 }}>{link}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ MODAL ═══ */
function Modal({ open, onClose }) {
  const bp = useBreakpoint();
  const modalForm = useLeadForm("modal");
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(46,61,114,.4)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: bp.isXs ? ".75rem" : "1rem", animation: "fadeIn .3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", width: "100%", maxWidth: 480, border: "1px solid rgba(46,61,114,.15)", position: "relative", maxHeight: "92svh", overflowY: "auto", boxShadow: "0 24px 80px rgba(46,61,114,.2)" }}>
        <div style={{ height: 3, background: "linear-gradient(to right, var(--primary), var(--secondary))" }} />
        <div style={{ padding: bp.isXs ? "1.4rem 1.1rem" : bp.isMobile ? "1.6rem" : "2.5rem" }}>
          <button onClick={onClose} style={{ position: "absolute", top: ".875rem", right: ".875rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px" }}>×</button>
          <Eyebrow label="Register Interest" />
          <h3 style={{ fontFamily: "var(--serif)", fontSize: bp.isXs ? "1.5rem" : "2.1rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".35rem" }}>Get Pre-Launch Access</h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--text-dim)", marginBottom: "1.75rem", fontWeight: 300 }}>Exclusive pre-launch pricing, floor plans & booking details.</p>

          {modalForm.status === "success" ? (
            <SuccessMsg />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { key: "name", label: "Full Name", ph: "Enter your full name" },
                { key: "phone", label: "Phone Number", ph: "Enter your phone number" },
                { key: "email", label: "Email Address", ph: "Enter your email address" },
              ].map(f => (
                <div key={f.key} style={{ borderBottom: "1px solid rgba(46,61,114,.15)", paddingBottom: ".65rem" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 7, fontWeight: 400 }}>{f.label}</div>
                  <input
                    value={modalForm.fields[f.key]}
                    onChange={modalForm.set(f.key)}
                    placeholder={f.ph}
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, width: "100%" }}
                  />
                </div>
              ))}
              <button
                onClick={modalForm.submit}
                disabled={modalForm.status === "loading"}
                style={{ width: "100%", padding: 13, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".61rem", fontWeight: 500, letterSpacing: ".23em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s", opacity: modalForm.status === "loading" ? .7 : 1 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                {modalForm.status === "loading" ? "Registering…" : "Register Your Interest Now"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ AUTO POPUP ═══ */
function AutoPopup({ open, onClose }) {
  const bp = useBreakpoint();
  const popupForm = useLeadForm("auto-popup");
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(46,61,114,.35)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: bp.isXs ? ".75rem" : "1rem", animation: "fadeIn .5s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", width: "100%", maxWidth: bp.isMobile ? 360 : 760, border: "1px solid rgba(46,61,114,.12)", position: "relative", display: "grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", maxHeight: "90svh", overflowY: "auto", boxShadow: "0 24px 80px rgba(46,61,114,.2)", overflow: "hidden" }}>
        {!bp.isMobile && (
          <div style={{ position: "relative", minHeight: 340, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} alt="" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(46,61,114,.9) 0%, rgba(46,61,114,.3) 60%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 7, fontWeight: 400 }}>Coming Soon · Pre-Launch</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 400, color: "#fff", lineHeight: 1.05 }}>Register<br />Early Access</h3>
            </div>
          </div>
        )}
        <div style={{ padding: bp.isXs ? "1.6rem 1.3rem" : "2.5rem", background: "var(--off-white)", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
          <button onClick={onClose} style={{ position: "absolute", top: ".875rem", right: ".875rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem", padding: "4px 8px", zIndex: 1 }}>×</button>
          {bp.isMobile && <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.65rem", fontWeight: 400, color: "var(--primary)", marginBottom: ".5rem" }}>Pre-Launch Access</h3>}
          <p style={{ fontFamily: "var(--sans)", fontSize: ".68rem", fontWeight: 300, color: "var(--text-dim)", marginBottom: "1.5rem", lineHeight: 1.8 }}>
            Be first to receive exclusive pre-launch pricing, floor plans & preview invitations.
          </p>

          {popupForm.status === "success" ? (
            <SuccessMsg />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem", marginBottom: "1.5rem" }}>
                {[
                  { key: "name", label: "Full Name", ph: "Enter full name" },
                  { key: "phone", label: "Phone Number", ph: "Enter phone number" },
                  { key: "email", label: "Email Address", ph: "Enter email address" },
                ].map(f => (
                  <div key={f.key} style={{ borderBottom: "1px solid rgba(46,61,114,.12)", paddingBottom: ".65rem" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 5, fontWeight: 400 }}>{f.label}</div>
                    <input
                      value={popupForm.fields[f.key]}
                      onChange={popupForm.set(f.key)}
                      placeholder={f.ph}
                      style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-dark)", fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, width: "100%" }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={popupForm.submit}
                disabled={popupForm.status === "loading"}
                style={{ width: "100%", padding: 12, background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s", opacity: popupForm.status === "loading" ? .7 : 1 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
                {popupForm.status === "loading" ? "Registering…" : "Register Your Interest Now"}
              </button>
            </>
          )}
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
      <a href="tel:+919205974843" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 10px", textDecoration: "none", borderRight: "1px solid rgba(46,61,114,.1)", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".09em", textTransform: "uppercase", fontWeight: 500 }}>
        <span style={{ color: "var(--secondary)", fontSize: ".85rem" }}>📞</span> Call Now
      </a>
      <button onClick={onEnquire} style={{ background: "var(--primary)", border: "none", color: "#fff", fontFamily: "var(--sans)", fontSize: ".6rem", fontWeight: 500, letterSpacing: ".13em", textTransform: "uppercase", padding: "14px 10px", cursor: "pointer", transition: "background .25s" }}
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
    /* 
      CRITICAL: Do NOT put overflow:hidden on this root element — it breaks position:sticky.
      Instead we clip overflow on a non-scrolling wrapper only around sections that need it.
    */
    <div>
      <style>{GLOBAL_CSS}</style>
      <Navbar onEnquire={() => setModal(true)} />
      <Hero />
      {/* 
        The grid must have align-items: start so the sidebar column does NOT stretch 
        to match the main content height — that would prevent sticky from working.
        The sidebar column needs its own natural height so the sticky element 
        can scroll within it.
      */}
      <div style={{
        display: "grid",
        gridTemplateColumns: bp.isDesktop ? "1fr 260px" : "1fr",
        alignItems: "start",   /* ← essential: stops column stretch that kills sticky */
      }}>
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <StorySection />
          <QuoteBanner />
          <GallerySection onEnquire={() => setModal(true)} />
          <AmenitiesSection />
          <PriceListSection onEnquire={() => setModal(true)} />
          <PriceConfigSection onEnquire={() => setModal(true)} />
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
      {bp.isMobile && <div style={{ height: 58 }} />}
    </div>
  );
}