import { useState, useEffect, useRef } from "react";

/* ─── Window Size Hook ─────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200 });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

/* ─── Global CSS ─────────────────────────────────────────────── */
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
@keyframes grain {
  0%,100% { transform:translate(0,0); } 25% { transform:translate(-1px,1px); }
  50% { transform:translate(1px,-1px); } 75% { transform:translate(-1px,-1px); }
}
@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.grain::after {
  content:''; position:fixed; inset:-200%; width:400%; height:400%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:0.03; pointer-events:none; z-index:9999; animation:grain 0.5s steps(1) infinite;
}
`;

/* ─── Count-Up Hook ─────────────────────────────────────────── */
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

/* ─── Reveal on scroll ──────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity .9s ${delay}s cubic-bezier(.16,1,.3,1), transform .9s ${delay}s cubic-bezier(.16,1,.3,1)`
    }}>{children}</div>
  );
}

/* ─── Eyebrow label ─────────────────────────────────────────── */
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
  const { w } = useWindowSize();
  const isMobile = w < 900;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  const links = ["Story", "Gallery", "Amenities", "Floor Plans", "Location"];

  const logoSize = w < 900 ? 100 : w < 1000 ? 120 : scrolled ? 120 : 134;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,11,9,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,.1)" : "none",
        transition: "all .5s ease",
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: isMobile ? "0 1rem" : "0 2rem",
          height: scrolled ? 72 : 88,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "height .4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 110 }}>
            <img
              src="/logo1.png"
              alt="Anant Raj Limited"
              style={{
                width: logoSize,
                height: logoSize,
                objectFit: "contain",
                transition: "width .4s ease, height .4s ease",
                filter: "drop-shadow(0 2px 8px rgba(201,169,110,.25))",
              }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {!isMobile && (
            <div style={{ display: "flex", gap: "3.5rem", alignItems: "center" }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
                  fontFamily: "var(--sans)", fontSize: ".66rem", fontWeight: 300,
                  letterSpacing: ".18em", textTransform: "uppercase",
                  color: "#fff", textDecoration: "none"
                }}>{l}</a>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 110 }}>
            {!isMobile && (
              <button onClick={onEnquire} style={{
                background: "transparent", border: "1px solid var(--gold-dim)",
                color: "#fff", fontFamily: "var(--sans)", fontSize: ".63rem",
                fontWeight: 400, letterSpacing: ".2em", textTransform: "uppercase",
                padding: "9px 22px", cursor: "pointer"
              }}>
                Broucher
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  background: "none", border: "none", padding: 6,
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  gap: 5, zIndex: 110
                }}
              >
                <div style={{
                  width: 22, height: 1.5,
                  background: open ? "var(--gold)" : "#fff",
                  transition: "all .3s",
                  transform: open ? "rotate(45deg) translate(4px,4px)" : "none"
                }} />
                <div style={{
                  width: 15, height: 1.5, background: "#fff",
                  opacity: open ? 0 : 1, transition: "opacity .3s"
                }} />
                <div style={{
                  width: 22, height: 1.5,
                  background: open ? "var(--gold)" : "#fff",
                  transition: "all .3s",
                  transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none"
                }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {isMobile && open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 105,
          background: "rgba(12,11,9,.98)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "2rem",
          animation: "fadeIn .25s ease", paddingBottom: "2rem",
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--serif)", fontSize: "1.8rem", fontStyle: "italic",
                color: "var(--cream)", textDecoration: "none", letterSpacing: ".02em"
              }}>
              {l}
            </a>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,.25)", margin: "0.25rem 0" }} />
          <button
            onClick={() => { setOpen(false); onEnquire(); }}
            style={{
              background: "var(--gold)", border: "none", color: "var(--warm-black)",
              fontFamily: "var(--sans)", fontSize: ".65rem", fontWeight: 500,
              letterSpacing: ".22em", textTransform: "uppercase",
              padding: "16px 48px", cursor: "pointer", marginTop: "0.5rem"
            }}>
          Download Broucher
          </button>
          <a href="tel:+919876543210" onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
              color: "var(--text-dim)", fontFamily: "var(--sans)",
              fontSize: ".65rem", letterSpacing: ".1em"
            }}>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet768 = w >= 640 && w < 900;
  const isDesktop = w >= 900;
  const [slide, setSlide] = useState(0);
  const slides = [
    "/banner/7.png",
    "/banner/8.png",
    "/banner/9.png",
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % 3), 5500);
    return () => clearInterval(t);
  }, []);

  /* Shared form used by both mobile and tablet — same two-column layout */
  const SharedForm = ({ compact }) => (
    <div style={{
      background: "rgba(22,20,16,.92)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(201,169,110,.15)",
      maxWidth: compact ? 360 : 560,
      margin: "0 auto",
      width: "100%",
    }}>
      {/* Row 1: Name + Phone side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[
          { label: "Your Name", ph: "Full Name" },
          { label: "Phone", ph: "+91 00000 00000" },
        ].map((f, i) => (
          <div key={i} style={{
            padding: compact ? "11px 14px" : "14px 18px",
            borderRight: i === 0 ? "1px solid rgba(201,169,110,.12)" : "none",
            borderBottom: "1px solid rgba(201,169,110,.12)",
          }}>
            <div style={{
              fontFamily: "var(--sans)",
              fontSize: compact ? ".48rem" : ".52rem",
              letterSpacing: ".2em", textTransform: "uppercase",
              color: "var(--gold-dim)", marginBottom: compact ? 2 : 4
            }}>{f.label}</div>
            <input
              placeholder={f.ph}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "var(--cream)", fontFamily: "var(--sans)",
                fontSize: compact ? ".72rem" : ".8rem", width: "100%"
              }}
            />
          </div>
        ))}
      </div>

      {/* Row 2: Email full width */}
      <div style={{
        padding: compact ? "11px 14px" : "14px 18px",
        borderBottom: "1px solid rgba(201,169,110,.12)",
      }}>
        <div style={{
          fontFamily: "var(--sans)",
          fontSize: compact ? ".48rem" : ".52rem",
          letterSpacing: ".2em", textTransform: "uppercase",
          color: "var(--gold-dim)", marginBottom: compact ? 2 : 4
        }}>Email</div>
        <input
          placeholder="you@email.com"
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "var(--cream)", fontFamily: "var(--sans)",
            fontSize: compact ? ".72rem" : ".8rem", width: "100%"
          }}
        />
      </div>

      {/* CTA Button */}
      <button style={{
        width: "100%", padding: compact ? "11px" : "13px",
        background: "var(--gold)", border: "none",
        color: "var(--warm-black)", fontFamily: "var(--sans)",
        fontSize: compact ? ".6rem" : ".65rem", fontWeight: 500,
        letterSpacing: ".18em", textTransform: "uppercase",
        cursor: "pointer"
      }}>
        Enquire Now
      </button>
    </div>
  );

  return (
    <section style={{
      position: "relative",
      height: "100svh",
      minHeight: 560,
      overflow: "hidden",
      background: "var(--warm-black)"
    }}>
      {slides.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          opacity: i === slide ? 1 : 0,
          transition: "opacity 1.5s ease"
        }}>
          <img
            src={src}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: i === slide ? "scale(1.03)" : "scale(1)",
              transition: "transform 6s ease-out"
            }}
            alt=""
          />
        </div>
      ))}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(8,7,6,.55) 0%, rgba(8,7,6,.2) 35%, rgba(8,7,6,.85) 75%, rgba(8,7,6,.97) 100%)"
      }} />
      {isMobile && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,6,.45)" }} />
      )}
      {isTablet768 && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(8,7,6,.5) 0%, rgba(8,7,6,.3) 50%, rgba(8,7,6,.88) 100%)"
        }} />
      )}
      {isDesktop && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(8,7,6,0) 20%, rgba(8,7,6,.6) 100%)"
        }} />
      )}

      {!isMobile && (
        <div style={{
          position: "absolute", right: "1.5rem", top: "50%",
          transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 8
        }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: 2,
              height: i === slide ? 24 : 10,
              background: i === slide ? "var(--gold)" : "rgba(201,169,110,.25)",
              border: "none", cursor: "pointer", borderRadius: 1,
              padding: 0, transition: "all .4s"
            }} />
          ))}
        </div>
      )}

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: 1400,
        padding: isMobile ? "0 1.25rem" : isTablet768 ? "0 2rem" : "0 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>

        <div style={{
          animation: "fadeUp 1.2s .3s both",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: isMobile ? 8 : isTablet768 ? 14 : 20,
            justifyContent: "center",
          }}>
            <div style={{ width: isMobile ? 18 : 28, height: 1, background: "#fff", opacity: .9 }} />
            <span style={{
              fontFamily: "var(--sans)", fontSize: isMobile ? ".52rem" : ".6rem",
              letterSpacing: ".25em", textTransform: "uppercase",
              color: "#fff", fontWeight: 400,
              textShadow: "0 1px 8px rgba(0,0,0,.8)"
            }}>Gurugram's Premier Address</span>
            <div style={{ width: isMobile ? 18 : 28, height: 1, background: "#fff", opacity: .9 }} />
          </div>

          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: isMobile ? "2.6rem" : isTablet768 ? "4.2rem" : "clamp(5rem,10vw,9rem)",
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: .9,
            letterSpacing: "-.02em",
            marginBottom: isMobile ? 10 : isTablet768 ? 14 : 20,
            textAlign: "center",
            textShadow: "0 2px 24px rgba(0,0,0,.9), 0 4px 48px rgba(0,0,0,.7)",
          }}>
            <span style={{
              display: "block", fontStyle: "italic",
              color: "var(--gold-light)",
              textShadow: "0 2px 24px rgba(0,0,0,.9), 0 0 60px rgba(201,169,110,.3)"
            }}>Anant Raj</span>
            <span style={{ display: "block" }}>Sector 63A</span>
          </h1>

          <p style={{
            fontFamily: "var(--sans)",
            fontSize: isMobile ? ".75rem" : isTablet768 ? ".82rem" : ".9rem",
            fontWeight: 400,
            color: "rgba(255,255,255,.85)",
            maxWidth: isMobile ? 260 : isTablet768 ? 360 : 420,
            lineHeight: isMobile ? 1.6 : 1.8,
            marginBottom: isMobile ? 16 : isTablet768 ? 22 : 32,
            textAlign: "center",
            textShadow: "0 1px 12px rgba(0,0,0,.8)",
          }}>
            3 BHK & 3 BHK + Study Sky Residences — crafted by International Architects, rising over 5 pristine acres in Gurugram.
          </p>
        </div>

        <div style={{ animation: "fadeUp 1.2s .6s both", width: "100%" }}>

          {/* ── Mobile: same two-column layout as tablet, slightly compact ── */}
          {isMobile && <SharedForm compact={true} />}

          {/* ── Tablet ── */}
          {isTablet768 && <SharedForm compact={false} />}

          {/* ── Desktop ── */}
          {isDesktop && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 0,
              background: "rgba(22,20,16,.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,169,110,.15)",
              maxWidth: 720,
              margin: "0 auto",
            }}>
              {[
                { label: "Your Name", ph: "Full Name" },
                { label: "Phone", ph: "+91 00000 00000" },
                { label: "Email", ph: "you@email.com" }
              ].map((f, i) => (
                <div key={i} style={{
                  padding: "14px 18px",
                  borderRight: "1px solid rgba(201,169,110,.1)"
                }}>
                  <div style={{
                    fontFamily: "var(--sans)", fontSize: ".52rem",
                    letterSpacing: ".2em", textTransform: "uppercase",
                    color: "var(--gold-dim)", marginBottom: 3
                  }}>{f.label}</div>
                  <input
                    placeholder={f.ph}
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      color: "var(--cream)", fontFamily: "var(--sans)",
                      fontSize: ".8rem", width: "100%"
                    }}
                  />
                </div>
              ))}
              <button style={{
                background: "var(--gold)", border: "none",
                color: "var(--warm-black)", fontFamily: "var(--sans)",
                fontSize: ".63rem", fontWeight: 500,
                letterSpacing: ".15em", textTransform: "uppercase",
                padding: "0 26px", cursor: "pointer"
              }}>
                Enquire
              </button>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";

  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: .2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const units = useCountUp(350, 1800, started);
  const acres = useCountUp(5, 1200, started);
  const towers = useCountUp(2, 1500, started);

  return (
    <section id="story" ref={ref} style={{ background: "var(--warm-black)", padding: `${vpad} 0` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 40 : 80, alignItems: "center" }}>
          {!isMobile && (
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -18, left: -18, width: 160, height: 160, border: "1px solid rgba(201,169,110,.1)", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1, aspectRatio: "3/4", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="Interior" />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 56, height: 56, borderTop: "1px solid var(--gold)", borderLeft: "1px solid var(--gold)", opacity: .4 }} />
                </div>
                <div style={{ position: "absolute", bottom: 36, right: -28, zIndex: 2, background: "var(--warm-dark)", border: "1px solid rgba(201,169,110,.2)", padding: "12px 20px" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>RERA</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 4 }}>Registered</div>
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={isTablet ? 0 : .15}>
            <Eyebrow label="The Story" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : isTablet ? "2.8rem" : "clamp(2.5rem,4vw,4.5rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              Designed for those<br /><em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>who seek perfection</em>
            </h2>
            <div style={{ width: 48, height: 1, background: "var(--gold)", opacity: .4, marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: isMobile ? ".82rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.55)", lineHeight: 2, marginBottom: "1.25rem" }}>
              Every great story has a setting. At Anant Raj Sector 63A, we've crafted a setting that elevates every chapter of your life — across 5 pristine acres of landscaped luxury in the heart of Gurugram.
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: isMobile ? ".82rem" : ".88rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2, marginBottom: "2.5rem" }}>
              Conceived by International Architects, twin towers rise with quiet authority over the Gurugram skyline — a rare collaboration between global design vision and Indian craftsmanship.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? "1.25rem" : 0, borderTop: "1px solid rgba(201,169,110,.1)", paddingTop: "1.75rem" }}>
              {[
                { val: units, label: "Residences" },
                { val: acres, label: "Acres" },
                { val: towers, label: "Towers" }
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", borderRight: !isMobile && i < 2 ? "1px solid rgba(201,169,110,.1)" : "none", borderBottom: isMobile && i < 2 ? "1px solid rgba(201,169,110,.08)" : "none", padding: isMobile ? "0 0 1.25rem" : "0 1rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "3rem" : "3.5rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>{s.val}</div>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--warm-dark)", padding: isMobile ? "64px 1rem" : "100px 2rem", borderTop: "1px solid rgba(201,169,110,.08)", borderBottom: "1px solid rgba(201,169,110,.08)" }}>
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .12 }} alt="" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--warm-dark), rgba(22,20,16,.7) 50%, var(--warm-dark))" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "var(--serif)", fontSize: "3.5rem", color: "var(--gold)", opacity: .2, lineHeight: 1, marginBottom: "-0.5rem" }}>"</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "1.65rem" : "clamp(1.8rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.15, fontStyle: "italic", maxWidth: 860, margin: "0 auto 1.5rem" }}>
            Where world-class design meets<br />the soul of Gurugram.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-dim)" }}>Crafted for the discerning few</span>
            <div style={{ width: 28, height: 1, background: "var(--gold)", opacity: .4 }} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════════ */
function GallerySection({ onEnquire }) {
  const { w } = useWindowSize();
  const isMobile = w < 500;
  const isTablet = w < 900;
  const [hov, setHov] = useState(null);
  const [clicked, setClicked] = useState(null);

  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";

  const imgs = [
    { src: "https://i.pinimg.com/1200x/e3/59/c5/e359c5ab551953ba3042ca76cd8fe43d.jpg", label: "Living Spaces" },
    { src: "https://i.pinimg.com/1200x/7a/b0/d6/7ab0d627b61c9e61c9ba4bf393f0a43e.jpg", label: "Master Suite" },
    { src: "https://i.pinimg.com/1200x/e6/6e/78/e66e78086b77ad918568e2a8fe9bc4cb.jpg", label: "Kitchen" },
    { src: "https://i.pinimg.com/736x/7f/04/1d/7f041dcb7c855330a5f05e05725da695.jpg", label: "Clubhouse" },
    { src: "https://i.pinimg.com/1200x/c8/a8/c0/c8a8c03a010d086093db9410ccb89ae0.jpg", label: "Pool Deck" },
  ];

  let gridItems, cols, rowDef;
  if (isMobile) {
    gridItems = imgs.map((img, i) => ({ ...img, col: "1/2", row: `${i+1}/${i+2}` }));
    cols = "1fr"; rowDef = "repeat(5,200px)";
  } else if (isTablet) {
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/2" }, { ...imgs[1], col: "1/2", row: "2/3" },
      { ...imgs[2], col: "2/3", row: "2/3" }, { ...imgs[3], col: "1/2", row: "3/4" },
      { ...imgs[4], col: "2/3", row: "3/4" },
    ];
    cols = "1fr 1fr"; rowDef = "repeat(3,200px)";
  } else {
    gridItems = [
      { ...imgs[0], col: "1/3", row: "1/3" }, { ...imgs[1], col: "3/4", row: "1/2" },
      { ...imgs[2], col: "3/4", row: "2/3" }, { ...imgs[3], col: "1/3", row: "3/4" },
      { ...imgs[4], col: "3/4", row: "3/4" },
    ];
    cols = "repeat(3,1fr)"; rowDef = "repeat(3,220px)";
  }

  const handlePhotoClick = (i) => {
    if (clicked === i) { setClicked(null); } else { setClicked(i); }
  };

  return (
    <section id="gallery" style={{ padding: `${vpad} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <Reveal>
          <Eyebrow label="Gallery" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.1 }}>
            A glimpse of <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>elegance</em>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rowDef, gap: 5 }}>
          {gridItems.map((img, i) => {
            const isClicked = clicked === i;
            return (
              <div key={i} style={{ gridColumn: img.col, gridRow: img.row, position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onClick={() => handlePhotoClick(i)}>
                <img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .8s cubic-bezier(.16,1,.3,1)", transform: hov === i ? "scale(1.06)" : "scale(1)" }} alt={img.label} />
                <div style={{ position: "absolute", inset: 0, background: isClicked ? "rgba(12,11,9,.55)" : "rgba(12,11,9,.5)", opacity: hov === i || isClicked ? 1 : 0, transition: "opacity .4s", display: "flex", alignItems: "flex-end", padding: 16, pointerEvents: "none" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--cream)" }}>{img.label}</span>
                </div>
                {isClicked && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, animation: "fadeIn .25s ease" }} onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onEnquire(); }}
                      style={{ background: "rgba(12,11,9,.85)", border: "1px solid var(--gold)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", padding: "11px 28px", cursor: "pointer", backdropFilter: "blur(12px)", transition: "background .2s, color .2s", whiteSpace: "nowrap" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--warm-black)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(12,11,9,.85)"; e.currentTarget.style.color = "var(--gold-light)"; }}>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 1023;
  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";

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

  return (
    <section id="amenities" style={{ padding: `${vpad} 0`, background: "var(--warm-dark)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 2fr", gap: isTablet ? 40 : 80, alignItems: "start" }}>
          <Reveal>
            <div style={{ position: isTablet ? "relative" : "sticky", top: isTablet ? "auto" : 100 }}>
              <Eyebrow label="Amenities" />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1rem" }}>
                Curated for an<br /><em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>exceptional life</em>
              </h2>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2 }}>
                Over 20,000 sq.ft of world-class amenities designed to fulfil every facet of the modern luxury lifestyle.
              </p>
              {!isTablet && (
                <div style={{ position: "relative", marginTop: "2.5rem", aspectRatio: "4/5", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .7 }} alt="" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--warm-dark) 0%, transparent 60%)" }} />
                </div>
              )}
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 2 }}>
            {items.map((item, i) => (
              <Reveal key={i} delay={i * .04}>
                <div style={{ padding: isMobile ? "1.5rem" : "1.75rem", background: "rgba(22,20,16,.5)", border: "1px solid rgba(201,169,110,.06)", transition: "all .4s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,110,.04)"; e.currentTarget.style.borderColor = "rgba(201,169,110,.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(22,20,16,.5)"; e.currentTarget.style.borderColor = "rgba(201,169,110,.06)"; }}>
                  <div style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: ".75rem", opacity: .7 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400, color: "var(--cream)", marginBottom: ".4rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "var(--sans)", fontSize: ".73rem", fontWeight: 300, color: "rgba(232,228,220,.35)", lineHeight: 1.7 }}>{item.desc}</p>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";
  const [active, setActive] = useState(0);

  const plans = [
    { title: "3 BHK", area: "2,300 sq.ft", desc: "Spacious three-bedroom homes with panoramic views and premium finishes throughout.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80" },
    { title: "3 BHK + Study", area: "2,600 sq.ft", desc: "Expansive layouts with a dedicated study, ideal for the modern work-from-home lifestyle.", img: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=700&q=80" },
  ];

  return (
    <section id="floor-plans" style={{ padding: `${vpad} 0`, background: "var(--warm-dark)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <Reveal>
          <Eyebrow label="Floor Plans" />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2.5rem", lineHeight: 1.05 }}>
            Layouts that <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>inspire</em>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1.5fr", gap: 4 }}>
          <div>
            {plans.map((p, i) => (
              <div key={i} onClick={() => setActive(i)} style={{ padding: isMobile ? "1.25rem 1.5rem" : "2rem 2.25rem", background: active === i ? "rgba(201,169,110,.05)" : "transparent", borderLeft: active === i ? "2px solid var(--gold)" : "2px solid rgba(201,169,110,.1)", cursor: "pointer", marginBottom: 2, transition: "all .3s" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 4 }}>{String(i + 1).padStart(2, "0")}</div>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "1.4rem" : "1.7rem", fontWeight: 400, color: active === i ? "var(--cream)" : "rgba(232,228,220,.4)", transition: "color .3s", marginBottom: ".35rem" }}>{p.title}</h4>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: active === i ? "var(--gold-dim)" : "rgba(90,82,72,.5)", fontWeight: 300, marginBottom: active === i ? ".75rem" : 0, transition: "all .3s" }}>{p.area}</p>
                {active === i && (
                  <p style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 300, color: "rgba(232,228,220,.45)", lineHeight: 1.8, animation: "fadeIn .4s ease" }}>{p.desc}</p>
                )}
              </div>
            ))}
            <button onClick={onEnquire} style={{ marginTop: "1.75rem", padding: "12px 26px", background: "transparent", border: "1px solid rgba(201,169,110,.25)", color: "var(--gold-light)", fontFamily: "var(--sans)", fontSize: ".63rem", letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", fontWeight: 300 }}>
              Download Floor Plans
            </button>
          </div>
          {!isMobile && (
            <div style={{ position: "relative", overflow: "hidden", minHeight: isTablet ? 280 : 480 }}>
              {plans.map((p, i) => (
                <div key={i} style={{ position: "absolute", inset: 0, opacity: active === i ? 1 : 0, transition: "opacity .6s" }}>
                  <img src={p.img} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.7)" }} alt={p.title} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", color: "var(--cream)", fontWeight: 300 }}>{p.title}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gold)", marginTop: 4, letterSpacing: ".1em" }}>{p.area}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOCATION
═══════════════════════════════════════════════════════════════ */
function LocationSection() {
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";

  const landmarks = [
    { name: "Cyber City / DLF Cyber Hub", dist: "12 km" },
    { name: "Golf Course Extension Road", dist: "3 km" },
    { name: "Ambience Mall", dist: "8 km" },
    { name: "Indira Gandhi International Airport", dist: "22 km" },
    { name: "NH-48 (Delhi–Jaipur Highway)", dist: "5 km" },
  ];

  return (
    <section id="location" style={{ padding: `${vpad} 0`, background: "var(--warm-black)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 40 : 60, alignItems: "start" }}>
          <Reveal>
            <Eyebrow label="Location" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "1.5rem", lineHeight: 1.05 }}>
              Strategic <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>connectivity</em>
            </h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".82rem", fontWeight: 300, color: "rgba(232,228,220,.4)", lineHeight: 2, marginBottom: "2rem" }}>
              Situated on Sector 63A, Gurugram — seamlessly connected to the city's premier business, retail, and lifestyle destinations.
            </p>
            {landmarks.map((lm, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 0", borderBottom: "1px solid rgba(201,169,110,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", opacity: .5 }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, color: "rgba(232,228,220,.6)" }}>{lm.name}</span>
                </div>
                <span style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--gold)", fontStyle: "italic" }}>{lm.dist}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={isTablet ? 0 : .15}>
            <div style={{ position: "relative", overflow: "hidden", marginTop: isTablet ? "2rem" : 0 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14026!2d77.0856!3d28.4089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e4b8f4c6b1%3A0x6b04d8b6e5c7c4a0!2sSector%2063A%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
                width="100%" height={isMobile ? 260 : 400}
                style={{ display: "block", filter: "grayscale(100%) invert(100%) contrast(80%) brightness(60%)", border: "none", borderTop: "1px solid rgba(201,169,110,.15)" }}
                loading="lazy" title="Location" />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
                <div style={{ position: "absolute", borderRadius: "50%", background: "var(--gold)", animation: "pulse-ring 2s ease-out infinite", width: 18, height: 18 }} />
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--gold)", border: "3px solid var(--warm-black)", position: "relative" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 1.5rem", background: "linear-gradient(to top, rgba(12,11,9,.95) 0%, transparent 100%)" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".6rem", letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>Site Address</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", color: "rgba(232,228,220,.7)", fontWeight: 300 }}>Sector 63A, Gurugram, Haryana — 122101</div>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const vpad = isMobile ? "72px" : isTablet ? "90px" : "120px";
  const hpad = isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem";

  return (
    <section style={{ padding: `${vpad} 0`, background: "var(--warm-dark)", borderTop: "1px solid rgba(201,169,110,.08)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 ${hpad}` }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 40 : 80, alignItems: "center" }}>
          <Reveal>
            <Eyebrow label="Visit Us" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)", fontWeight: 300, color: "var(--cream)", marginBottom: "2.5rem", lineHeight: 1.05 }}>
              The experience <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>awaits you</em>
            </h2>
            {[
              { icon: "◈", title: "Site Address", lines: ["Sector 63A, Gurugram", "Haryana — 122101"] },
              { icon: "◉", title: "Sales", lines: ["+91 98765 43210", "+91 91234 56789"] },
              { icon: "◌", title: "Email", lines: ["info@anantrajsector63a.com"] },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "1.25rem", marginBottom: "1.75rem" }}>
                <div style={{ color: "var(--gold)", fontSize: "1rem", marginTop: 2, opacity: .6 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>{c.title}</div>
                  {c.lines.map((line, j) => <div key={j} style={{ fontFamily: "var(--sans)", fontSize: ".8rem", fontWeight: 300, color: "rgba(232,228,220,.6)", lineHeight: 1.8 }}>{line}</div>)}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={isTablet ? 0 : .15}>
            <div style={{ background: "var(--warm-black)", border: "1px solid rgba(201,169,110,.12)", padding: isMobile ? "1.75rem" : "3rem", position: "relative", overflow: "hidden", marginTop: isTablet ? "1rem" : 0 }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, borderBottom: "1px solid rgba(201,169,110,.15)", borderLeft: "1px solid rgba(201,169,110,.15)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".4rem" }}>Schedule a Visit</h3>
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
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
function Sidebar() {
  return (
    <div style={{ position: "sticky", top: 80, padding: "2rem", background: "var(--warm-dark)", borderLeft: "1px solid rgba(201,169,110,.08)", height: "calc(100vh - 80px)", overflow: "auto" }}>
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
        Request Brochure
      </button>
      <div style={{ borderTop: "1px solid rgba(201,169,110,.08)", paddingTop: "1.75rem" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem" }}>Speak to an Expert</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, border: "1px solid rgba(201,169,110,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📞</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".76rem", fontWeight: 300, color: "rgba(232,228,220,.7)" }}>+91 98765 43210</div>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const links = {
    "Project": ["Overview", "Floor Plans", "Gallery", "Amenities"],
    "Company": ["About Anant Raj", "Careers", "Press", "Blog"],
    "Legal": ["Privacy Policy", "Terms", "RERA Info"],
  };

  return (
    <footer style={{ background: "#080706", borderTop: "1px solid rgba(201,169,110,.08)", padding: isMobile ? "56px 1rem 32px" : "72px 2rem 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 32 : isTablet ? 40 : 60, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 18, height: 1, background: "var(--gold)" }} />
                <div style={{ width: 10, height: 1, background: "var(--gold)", opacity: .5 }} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400, color: "var(--gold-light)" }}>Anant Raj </span>
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
   MODAL
═══════════════════════════════════════════════════════════════ */
function Modal({ open, onClose }) {
  const { w } = useWindowSize();
  const isMobile = w < 640;
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.88)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn .3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--warm-dark)", width: "100%", maxWidth: 500, border: "1px solid rgba(201,169,110,.15)", position: "relative", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ height: 2, background: "linear-gradient(to right, var(--gold-dim), var(--gold), var(--gold-dim))" }} />
        <div style={{ padding: isMobile ? "1.75rem" : "3rem" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem" }}>×</button>
          <Eyebrow label="Enquire Now" />
          <h3 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "1.8rem" : "2.4rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".4rem" }}>Register Interest</h3>
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
  const { w } = useWindowSize();
  const isMobile = w < 640;
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,7,6,.82)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn .5s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--warm-dark)", width: "100%", maxWidth: isMobile ? 400 : 780, border: "1px solid rgba(201,169,110,.12)", position: "relative", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", maxHeight: "90vh", overflowY: "auto" }}>
        {!isMobile && (
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .6 }} alt="" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,.9) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".52rem", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(201,169,110,.6)", marginBottom: 8 }}>Limited Preview</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.4rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.05 }}>Exclusive<br /><em style={{ color: "var(--gold-light)" }}>Access</em></h3>
            </div>
          </div>
        )}
        <div style={{ padding: isMobile ? "2rem" : "3rem", background: "var(--warm-black)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.4rem" }}>×</button>
          {isMobile && <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--cream)", marginBottom: ".5rem", fontStyle: "italic" }}>Exclusive Access</h3>}
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
   APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const { w } = useWindowSize();
  const showSidebar = w >= 1200;

  const [modal, setModal] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAutoPopup(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grain">
      <style>{GLOBAL_CSS}</style>
      <Navbar onEnquire={() => setModal(true)} />
      <Hero />
      <div style={{ display: "grid", gridTemplateColumns: showSidebar ? "1fr 300px" : "1fr" }}>
        <div>
          <StorySection />
          <QuoteBanner />
          <GallerySection onEnquire={() => setModal(true)} />
          <AmenitiesSection />
          <FloorPlanSection onEnquire={() => setModal(true)} />
          <LocationSection />
          <ContactSection onEnquire={() => setModal(true)} />
        </div>
        {showSidebar && <Sidebar />}
      </div>
      <Footer />
      <Modal open={modal} onClose={() => setModal(false)} />
      <AutoPopup open={autoPopup} onClose={() => setAutoPopup(false)} />
    </div>
  );
}