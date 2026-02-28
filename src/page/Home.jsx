import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Poppins:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Poppins', sans-serif; background: #fff; color: #0a1628; overflow-x: hidden; }
img { max-width: 100%; display: block; }
a { text-decoration: none; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #004E7A; border-radius: 2px; }

:root {
  --navy: #004E7A;
  --navy-dark: #002f4d;
  --navy-deep: #001a2d;
  --gold: #C9A84C;
  --gold-light: #e8c96e;
  --off-white: #F8F6F1;
  --text: #0a1628;
  --text-muted: #5a6b7e;
  --text-light: #9aaab8;
  --border: rgba(0,78,122,0.10);
  --px: clamp(16px, 5vw, 80px);
}

/* ─── NAV ─────────────────────────────────────────── */
.nav { position:fixed;top:0;left:0;right:0;z-index:999;  }
.nav-inner {
  display:flex;align-items:center;justify-content:space-between;
  padding:0 var(--px);height:72px;
  background:rgba(255,255,255,0);
  border-bottom:1px solid rgba(255,255,255,0);
  transition:all 0.4s ease;
}
.nav.scrolled .nav-inner {
  background:rgba(255,255,255,0.97);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
  box-shadow:0 4px 30px rgba(0,0,0,0.06);
  height:60px;
}

/* ─── LOGO (always visible) ───────────────────────── */
.nav-logo {
  display:flex;
  align-items:center;
  gap:10px;
  flex-shrink:0;
  text-decoration:none;
  margin-left: -30px;
}
.nav-logo-img {
  height: 186px;
  width: auto;
  max-width: 200px;
  display: block;
  object-fit: contain;
  transition: height 0.4s ease;
}
.nav.scrolled .nav-logo-img {
  height: 190px;
}
.nav-logo-fallback {
  display: none;
  align-items: center;
  gap: 8px;
}
.nav-logo-hex {
  width:106px; height:106px; background:var(--gold);
  display:flex; align-items:center; justify-content:center;
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  flex-shrink:0;
}
.nav-logo-name {
  font-family:'Playfair Display',serif;
  font-size:clamp(0.85rem, 2vw, 1.1rem);
  font-weight:700;
  color:white;
  letter-spacing:0.05em;
  transition:color 0.4s;
  white-space:nowrap;
}
.nav.scrolled .nav-logo-name { color:var(--navy-dark); }

@media (max-width:1024px) {
  .nav-logo-img { height: 140px; }
  .nav.scrolled .nav-logo-img { height: 140px; }
}
@media (max-width:767px) {
  .nav-logo-img { height: 94px; }
  .nav.scrolled .nav-logo-img { height: 96px; }
}
@media (max-width:479px) {
  .nav-logo-img { height: 96px; }
  .nav.scrolled .nav-logo-img { height: 90px; }
  .nav-logo-hex { width:60px; height:60px; }
  .nav-logo-name { font-size:0.8rem; }
}

.nav-logo-hex {
  width:34px;height:34px;background:var(--gold);
  display:flex;align-items:center;justify-content:center;
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  transition:transform 0.4s;
}
.nav-logo-hex:hover { transform:rotate(30deg); }
.nav-logo-name {
  font-family:'Playfair Display',serif;
  font-size:1.05rem;font-weight:700;color:white;
  letter-spacing:0.05em;transition:color 0.4s;
}
.nav.scrolled .nav-logo-name { color:var(--navy-dark); }

@media (max-width:479px) {
  .nav-logo-hex { width:60px; height:80px; }
  .nav-logo-name { font-size:0.8rem; }
}
.nav-links { display:flex;align-items:center; }
.nav-link {
  padding:8px 14px;font-size:0.68rem;font-weight:600;
  letter-spacing:0.12em;text-transform:uppercase;
  color:rgba(255,255,255,0.8);
  transition:color 0.3s;position:relative;white-space:nowrap;
}
.nav-link::after {
  content:'';position:absolute;bottom:2px;left:14px;right:14px;
  height:1px;background:var(--gold);
  transform:scaleX(0);transform-origin:left;
  transition:transform 0.3s;
}
.nav-link:hover::after { transform:scaleX(1); }
.nav-link:hover { color:#fff; }
.nav.scrolled .nav-link { color:var(--text-muted); }
.nav.scrolled .nav-link:hover { color:var(--navy); }
.nav-cta-btn {
  margin-left:8px;padding:9px 18px;
  background:var(--gold);color:var(--navy-deep) !important;
  font-size:0.68rem;font-weight:700;letter-spacing:0.1em;
  text-transform:uppercase;border-radius:2px;
  transition:all 0.3s !important;
}
.nav-cta-btn::after { display:none !important; }
.nav-cta-btn:hover { background:var(--gold-light);transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,0.4); }
.ham-btn {
  display:none;background:none;border:none;cursor:pointer;
  flex-direction:column;gap:5px;padding:8px;z-index:10;
}
.ham-btn span { display:block;width:24px;height:2px;background:white;border-radius:2px;transition:all 0.3s; }
.nav.scrolled .ham-btn span { background:var(--navy-dark); }

/* ─── MOBILE MENU ─────────────────────────────────── */
.mob-overlay {
  position:fixed;inset:0;z-index:1000;
  background:var(--navy-deep);
  transform:translateX(100%);
  transition:transform 0.4s cubic-bezier(0.77,0,0.175,1);
  display:flex;flex-direction:column;
  padding:80px clamp(24px,8vw,48px) 40px;
  overflow-y:auto;
}
.mob-overlay.open { transform:translateX(0); }
.mob-close-btn {
  position:absolute;top:16px;right:16px;
  background:rgba(255,255,255,0.08);border:none;cursor:pointer;
  width:42px;height:42px;border-radius:50%;
  color:white;font-size:1.2rem;
  display:flex;align-items:center;justify-content:center;
}
.mob-nav-link {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.6rem,6vw,2.4rem);font-weight:700;
  color:rgba(255,255,255,0.55);
  padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);
  transition:color 0.3s;
  display:flex;align-items:center;justify-content:space-between;
}
.mob-nav-link:hover { color:var(--gold); }
.mob-cta { margin-top:auto;padding-top:28px; }

/* ─── HERO ────────────────────────────────────────── */
.hero {
  position:relative;min-height:100svh;
  display:grid;place-items:center;overflow:hidden;
}
.hero-bg {
  position:absolute;inset:0;
  width:100%;height:100%;object-fit:cover;
  animation:heroZoom 8s ease forwards;
}
@keyframes heroZoom { from{transform:scale(1.08)} to{transform:scale(1)} }
.hero-overlay {
  position:absolute;inset:0;
  background:linear-gradient(150deg,rgba(0,15,35,0.92) 0%,rgba(0,40,70,0.72) 45%,rgba(0,10,25,0.62) 100%);
}
.hero-grid {
  position:relative;z-index:2;
  width:100%;max-width:1300px;margin:0 auto;
  padding:clamp(100px,14vh,130px) var(--px) clamp(60px,8vh,90px);
  display:grid;grid-template-columns:1fr 400px;
  gap:clamp(24px,4vw,60px);align-items:center;
}
.hero-eyebrow {
  display:flex;align-items:center;gap:12px;margin-bottom:10px;
  animation:fadeUp 0.8s ease 0.1s both;flex-wrap:wrap;
}
.eyebrow-line { width:36px;height:2px;background:var(--gold);flex-shrink:0; }
.eyebrow-txt {
  font-size:0.6rem;font-weight:700;letter-spacing:0.22em;
  text-transform:uppercase;color:var(--gold);
}
.hero-h1 {
  font-family:'Playfair Display',serif;
  font-size:clamp(2.6rem,7vw,5.8rem);font-weight:900;
  line-height:0.95;color:white;letter-spacing:-0.02em;
  margin-bottom:24px;
  animation:fadeUp 0.8s ease 0.25s both;
}
.hero-h1 em { color:var(--gold);font-style:italic; }
.hero-p {
  font-size:clamp(0.84rem,1.6vw,1rem);
  color:rgba(255,255,255,0.52);line-height:1.9;
  font-weight:300;max-width:460px;margin-bottom:34px;
  animation:fadeUp 0.8s ease 0.4s both;
}
.hero-btns {
  display:flex;gap:10px;flex-wrap:wrap;
  animation:fadeUp 0.8s ease 0.55s both;
}
.btn-gold {
  padding:12px 24px;background:var(--gold);color:var(--navy-deep);
  font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:none;cursor:pointer;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;white-space:nowrap;
}
.btn-gold:hover { background:var(--gold-light);transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,168,76,0.4); }
.btn-ghost-w {
  padding:10px 22px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.75);
  font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:1px solid rgba(255,255,255,0.22);cursor:pointer;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;white-space:nowrap;
}
.btn-ghost-w:hover { background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.5); }
.hero-minis {
  display:flex;gap:clamp(16px,3vw,28px);margin-top:40px;padding-top:32px;
  border-top:1px solid rgba(255,255,255,0.1);
  animation:fadeUp 0.8s ease 0.7s both;
  flex-wrap:wrap;
}
.hero-mini-n {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.25rem,2.5vw,1.9rem);font-weight:700;color:white;line-height:1;
}
.hero-mini-l {
  font-size:0.58rem;font-weight:600;letter-spacing:0.14em;
  text-transform:uppercase;color:rgba(255,255,255,0.35);margin-top:4px;
}

/* ─── PRICE CARD ──────────────────────────────────── */
.pcard {
  background:rgba(255,255,255,0.07);
  backdrop-filter:blur(28px);
  border:1px solid rgba(255,255,255,0.14);
  border-radius:3px;padding:clamp(20px,3.5vw,34px);
  animation:fadeUp 0.8s ease 0.3s both;
}
.pcard-badge {
  display:inline-flex;align-items:center;gap:6px;
  background:var(--gold);color:var(--navy-deep);
  font-size:0.57rem;font-weight:700;letter-spacing:0.18em;
  text-transform:uppercase;padding:5px 12px;border-radius:20px;margin-bottom:14px;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
.blink { animation:blink 1.5s infinite; }
.pcard-lbl { font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:5px; }
.pcard-price {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.7rem,3.8vw,2.6rem);font-weight:900;color:white;line-height:1;margin-bottom:4px;
}
.pcard-sub { font-size:0.68rem;color:rgba(255,255,255,0.35);margin-bottom:18px; }
.pcard-chips { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:18px; }
.pcard-chip {
  display:flex;align-items:center;gap:7px;padding:8px 10px;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  border-radius:2px;font-size:0.68rem;font-weight:500;color:rgba(255,255,255,0.7);
}
.pcard-div { height:1px;background:rgba(255,255,255,0.09);margin:14px 0; }
.pcard-row { display:flex;justify-content:space-between;margin-bottom:7px; }
.pcard-rl { font-size:0.68rem;color:rgba(255,255,255,0.35); }
.pcard-rr { font-size:0.68rem;font-weight:600;color:rgba(255,255,255,0.75); }
.pcard-btns { display:flex;flex-direction:column;gap:7px;margin-top:16px; }
.btn-gold-w {
  padding:12px;background:var(--gold);color:var(--navy-deep);
  font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;
}
.btn-gold-w:hover { background:var(--gold-light); }
.btn-ghost-w2 {
  padding:10px;background:transparent;color:rgba(255,255,255,0.55);
  font-size:0.68rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:1px solid rgba(255,255,255,0.16);cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;
}
.btn-ghost-w2:hover { background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.3); }

.scroll-hint {
  position:absolute;bottom:24px;left:50%;transform:translateX(-50%);
  z-index:3;display:flex;flex-direction:column;align-items:center;gap:6px;
  animation:bob 2.8s ease-in-out infinite;
}
.scroll-hint-line { width:1px;height:40px;background:linear-gradient(to bottom,rgba(255,255,255,0.3),transparent); }
.scroll-hint-txt { font-size:0.5rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.28); }
@keyframes bob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(7px)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

/* ─── MARQUEE ─────────────────────────────────────── */
.marquee { background:var(--navy);overflow:hidden;padding:13px 0;border-top:1px solid rgba(255,255,255,0.04); }
.marquee-track {
  display:flex;white-space:nowrap;
  animation:marqueeScroll 30s linear infinite;
}
@keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.marquee-item {
  display:inline-flex;align-items:center;gap:12px;
  padding:0 24px;
  font-size:0.58rem;font-weight:600;letter-spacing:0.18em;
  text-transform:uppercase;color:rgba(255,255,255,0.3);
  border-right:1px solid rgba(255,255,255,0.08);flex-shrink:0;
}
.m-dot { width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0; }

/* ─── STATS ───────────────────────────────────────── */
.stats-bar { display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--border); }
.stat-cell {
  padding:clamp(20px,3vw,34px) clamp(16px,2.5vw,28px);border-right:1px solid var(--border);
  display:flex;align-items:center;gap:clamp(10px,2vw,18px);
  transition:background 0.3s;
}
.stat-cell:last-child { border-right:none; }
.stat-cell:hover { background:var(--off-white); }
.stat-ico {
  width:46px;height:46px;border-radius:50%;
  background:linear-gradient(135deg,rgba(0,78,122,0.07),rgba(0,78,122,0.14));
  display:flex;align-items:center;justify-content:center;
  font-size:1.15rem;flex-shrink:0;
}
.stat-num {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.4rem,2.8vw,2.4rem);font-weight:900;color:var(--navy);line-height:1;
}
.stat-label {
  font-size:clamp(0.55rem,1vw,0.66rem);font-weight:600;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--text-light);margin-top:4px;
}

/* ─── ABOUT ───────────────────────────────────────── */
.about-wrap { display:grid;grid-template-columns:1fr 1fr;min-height:640px; }
.about-img { position:relative;overflow:hidden; }
.about-img img { width:100%;height:100%;object-fit:cover;transition:transform 0.8s; }
.about-img:hover img { transform:scale(1.03); }
.about-img-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,20,40,0.65) 0%,transparent 55%); }
.about-year-badge {
  position:absolute;bottom:24px;left:24px;
  background:var(--gold);padding:12px 20px;
}
.about-year-n { font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--navy-deep);line-height:1; }
.about-year-l { font-size:0.58rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--navy-deep); }
.about-body {
  padding:clamp(40px,6vw,88px) clamp(28px,5vw,70px);
  background:var(--off-white);
  display:flex;flex-direction:column;justify-content:center;
}
.sec-tag { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
.sec-tag-line { width:26px;height:2px;background:var(--gold);flex-shrink:0; }
.sec-tag-txt { font-size:0.6rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--navy); }
.sec-h2 {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.6rem,3.2vw,2.8rem);font-weight:900;
  color:var(--navy-dark);line-height:1.1;letter-spacing:-0.02em;margin-bottom:16px;
}
.sec-h2 em { color:var(--gold);font-style:italic; }
.sec-p { font-size:clamp(0.82rem,1.5vw,0.9rem);line-height:1.9;color:var(--text-muted);font-weight:300;margin-bottom:28px; }
.why-list { margin-bottom:28px; }
.why-item {
  display:flex;align-items:center;gap:12px;
  padding:10px 0;border-bottom:1px solid var(--border);
  transition:padding-left 0.2s;
}
.why-item:hover { padding-left:5px; }
.why-item:last-child { border-bottom:none; }
.why-n { font-size:0.54rem;font-weight:800;letter-spacing:0.15em;color:var(--gold);min-width:20px; }
.why-t { font-size:clamp(0.78rem,1.4vw,0.84rem);color:var(--text);font-weight:500; }
.btn-navy {
  padding:12px 24px;background:var(--navy);color:white;
  font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:none;cursor:pointer;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;white-space:nowrap;
}
.btn-navy:hover { background:var(--navy-dark);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,78,122,0.3); }
.btn-outline-n {
  padding:10px 22px;background:transparent;color:var(--navy);
  font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  border-radius:2px;border:2px solid var(--navy);cursor:pointer;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 0.3s;font-family:'Poppins',sans-serif;white-space:nowrap;
}
.btn-outline-n:hover { background:var(--navy);color:white; }

/* ─── SHOWCASE ────────────────────────────────────── */
.showcase {
  position:relative;min-height:95vh;
  display:flex;align-items:flex-end;overflow:hidden;
}
.showcase-bg { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
.showcase-overlay {
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,10,25,0.97) 0%,rgba(0,20,45,0.6) 45%,rgba(0,10,25,0.15) 100%);
}
.showcase-content {
  position:relative;z-index:2;width:100%;
  padding:clamp(36px,5vw,80px) var(--px);
  display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,60px);align-items:end;
}
.showcase-pill {
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);
  padding:6px 14px;border-radius:20px;margin-bottom:20px;
}
.sc-pill-dot { width:5px;height:5px;border-radius:50%;background:var(--gold);animation:blink 1.5s infinite; }
.sc-pill-txt { font-size:0.58rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold); }
.showcase-h2 {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.9rem,5vw,4rem);font-weight:900;
  color:white;line-height:0.97;letter-spacing:-0.02em;margin-bottom:20px;
}
.showcase-h2 em { color:var(--gold);font-style:italic; }
.showcase-p { font-size:clamp(0.82rem,1.4vw,0.88rem);color:rgba(255,255,255,0.45);line-height:1.9;font-weight:300;margin-bottom:24px; }
.feat-chips { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:26px; }
.feat-chip {
  display:flex;align-items:center;gap:6px;padding:7px 13px;
  border:1px solid rgba(255,255,255,0.11);
  font-size:0.68rem;font-weight:500;color:rgba(255,255,255,0.65);
  background:rgba(255,255,255,0.04);border-radius:2px;transition:all 0.3s;
}
.feat-chip:hover { background:rgba(201,168,76,0.12);border-color:rgba(201,168,76,0.3);color:var(--gold); }
.hl-cards { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
.hl-card {
  padding:clamp(16px,2.5vw,22px) clamp(14px,2vw,18px);
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
  border-radius:3px;cursor:pointer;transition:all 0.3s;
}
.hl-card:hover { background:rgba(201,168,76,0.09);border-color:rgba(201,168,76,0.28);transform:translateY(-3px); }
.hl-n { font-family:'Playfair Display',serif;font-size:clamp(1.3rem,2.5vw,1.6rem);font-weight:900;color:var(--gold);line-height:1;margin-bottom:5px; }
.hl-l { font-size:clamp(0.6rem,1.2vw,0.68rem);color:rgba(255,255,255,0.38);font-weight:400; }

/* ─── PRICING ─────────────────────────────────────── */
.price-section {
  display:grid;grid-template-columns:1fr 1fr;
  background:var(--navy-deep);position:relative;overflow:hidden;
}
.price-section::before {
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 70% 50%,rgba(201,168,76,0.06) 0%,transparent 60%);
  pointer-events:none;
}
.price-l, .price-r {
  padding:clamp(44px,6vw,90px) clamp(28px,5vw,70px);
  position:relative;z-index:1;
}
.price-l { border-right:1px solid rgba(255,255,255,0.06); }
.price-big {
  font-family:'Playfair Display',serif;
  font-size:clamp(3rem,8vw,6rem);font-weight:900;
  color:white;line-height:0.9;letter-spacing:-0.03em;margin-bottom:6px;
}
.price-big span { color:var(--gold); }
.price-unit { font-size:0.72rem;color:rgba(255,255,255,0.3);margin-bottom:28px;letter-spacing:0.1em; }
.cfg-pills { display:flex;flex-wrap:wrap;gap:7px;margin-bottom:28px; }
.cfg-pill {
  padding:6px 14px;border:1px solid rgba(255,255,255,0.11);
  font-size:0.65rem;font-weight:600;letter-spacing:0.08em;
  color:rgba(255,255,255,0.55);border-radius:30px;transition:all 0.3s;cursor:pointer;
}
.cfg-pill:hover,.cfg-pill.active { background:var(--gold);color:var(--navy-deep);border-color:var(--gold); }
.pay-table { border:1px solid rgba(255,255,255,0.07);border-radius:3px;overflow:hidden; }
.pay-row {
  display:flex;align-items:center;gap:13px;padding:11px 15px;
  border-bottom:1px solid rgba(255,255,255,0.04);
  transition:background 0.2s;cursor:pointer;
}
.pay-row:last-child { border-bottom:none; }
.pay-row:hover { background:rgba(255,255,255,0.03); }
.pay-num { font-size:0.56rem;font-weight:700;color:var(--gold);min-width:22px; }
.pay-lbl { flex:1;font-size:0.77rem;color:rgba(255,255,255,0.45); }
.pay-pct { font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:white; }
.show-more {
  background:none;border:none;cursor:pointer;font-family:'Poppins',sans-serif;
  font-size:0.63rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--gold);display:flex;align-items:center;gap:5px;margin-top:10px;padding:0;
}

/* ─── SPECS ───────────────────────────────────────── */
.specs-wrap { display:grid;grid-template-columns:1fr 1fr;min-height:540px; }
.specs-visual { position:relative;overflow:hidden; }
.specs-visual img { width:100%;height:100%;object-fit:cover; }
.specs-visual-ov { position:absolute;inset:0;background:linear-gradient(to right,rgba(0,20,40,0.45) 0%,transparent 55%); }
.specs-content {
  padding:clamp(40px,6vw,86px) clamp(28px,5vw,66px);
  background:var(--off-white);display:flex;flex-direction:column;justify-content:center;
}
.spec-list { display:flex;flex-direction:column; }
.spec-row {
  display:flex;align-items:center;gap:12px;
  padding:12px 0;border-bottom:1px solid var(--border);
  cursor:pointer;transition:padding-left 0.2s;
}
.spec-row:hover { padding-left:7px; }
.spec-row:last-child { border-bottom:none; }
.spec-dot {
  width:8px;height:8px;border-radius:50%;
  border:2px solid var(--navy);flex-shrink:0;transition:all 0.2s;
}
.spec-row:hover .spec-dot { background:var(--gold);border-color:var(--gold); }
.spec-txt { font-size:clamp(0.78rem,1.4vw,0.84rem);color:var(--text);font-weight:500; }

/* ─── AMENITIES ───────────────────────────────────── */
.amenities-sec {
  background:var(--navy-deep);
  padding:clamp(48px,7vw,96px) var(--px);
}
.amenities-hdr { max-width:1200px;margin:0 auto;text-align:center;margin-bottom:44px; }
.amenities-grid {
  max-width:1200px;margin:0 auto;
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1px;background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.05);
}
.amenity-card {
  background:var(--navy-deep);padding:clamp(18px,3vw,26px) clamp(14px,2vw,22px);
  cursor:pointer;transition:all 0.3s;
  display:flex;flex-direction:column;gap:10px;
}
.amenity-card:hover { background:rgba(201,168,76,0.07); }
.amenity-ico {
  font-size:1.2rem;width:44px;height:44px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,0.04);border-radius:4px;transition:background 0.3s;
}
.amenity-card:hover .amenity-ico { background:rgba(201,168,76,0.14); }
.amenity-nm { font-size:clamp(0.72rem,1.3vw,0.8rem);font-weight:600;color:rgba(255,255,255,0.7);line-height:1.4; }

/* ─── LOCATION ────────────────────────────────────── */
.location-wrap { display:grid;grid-template-columns:1fr 1fr; }
.location-content {
  padding:clamp(40px,6vw,86px) clamp(28px,5vw,66px);
  display:flex;flex-direction:column;justify-content:center;
}
.loc-pts { display:grid;grid-template-columns:1fr 1fr;gap:0;margin:22px 0; }
.loc-pt {
  display:flex;align-items:flex-start;gap:8px;
  padding:11px 0;border-bottom:1px solid var(--border);
  border-right:1px solid var(--border);padding-right:12px;
}
.loc-pt:nth-child(even) { border-right:none;padding-left:12px;padding-right:0; }
.loc-pt-ico { font-size:10px;color:var(--gold);margin-top:2px;flex-shrink:0; }
.loc-pt-txt { font-size:clamp(0.72rem,1.3vw,0.77rem);color:var(--text);font-weight:500;line-height:1.4; }
.location-map { position:relative;min-height:380px; }
.location-map iframe { width:100%;height:100%;border:none;display:block;min-height:380px; }
.map-footer {
  position:absolute;bottom:0;left:0;right:0;
  background:var(--navy);padding:10px 16px;
  display:flex;align-items:center;gap:8px;
}
.map-footer span { font-size:0.68rem;color:rgba(255,255,255,0.4); }

/* ─── SERVICES ────────────────────────────────────── */
.services-sec { background:var(--off-white);padding:clamp(48px,7vw,96px) 0 0;overflow:hidden; }
.services-hdr {
  padding:0 var(--px) clamp(32px,5vw,52px);
  display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;
}
.services-grid {
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1px;background:var(--border);
}
.srv-card {
  background:white;padding:clamp(24px,4vw,34px) clamp(20px,3vw,28px);cursor:pointer;
  transition:all 0.35s;display:flex;flex-direction:column;gap:12px;
  position:relative;overflow:hidden;
}
.srv-card::before {
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:3px;background:var(--gold);
  transform:scaleX(0);transform-origin:left;transition:transform 0.35s;
}
.srv-card:hover::before { transform:scaleX(1); }
.srv-card:hover { background:var(--off-white);transform:translateY(-4px);box-shadow:0 18px 48px rgba(0,0,0,0.08); }
.srv-ico {
  width:48px;height:48px;border-radius:8px;
  background:linear-gradient(135deg,rgba(0,78,122,0.07),rgba(0,78,122,0.13));
  display:flex;align-items:center;justify-content:center;
  font-size:1.2rem;transition:all 0.3s;
}
.srv-card:hover .srv-ico { background:linear-gradient(135deg,rgba(201,168,76,0.14),rgba(201,168,76,0.24)); }
.srv-name { font-family:'Playfair Display',serif;font-size:clamp(0.9rem,1.6vw,1rem);font-weight:700;color:var(--navy-dark); }
.srv-desc { font-size:clamp(0.76rem,1.3vw,0.8rem);color:var(--text-muted);line-height:1.75; }
.srv-link {
  margin-top:auto;padding-top:12px;
  font-size:0.64rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--navy);display:flex;align-items:center;gap:6px;transition:all 0.3s;
}
.srv-card:hover .srv-link { color:var(--gold);gap:10px; }

/* ─── TESTIMONIALS ────────────────────────────────── */
.testi-sec {
  background:var(--navy-deep);
  padding:clamp(48px,7vw,96px) var(--px);
  position:relative;overflow:hidden;
}
.testi-sec::before {
  content:'❝';position:absolute;top:-20px;right:clamp(10px,6vw,100px);
  font-size:clamp(120px,18vw,260px);color:rgba(201,168,76,0.04);
  font-family:Georgia,serif;line-height:1;pointer-events:none;
}
.testi-grid {
  display:grid;grid-template-columns:260px 1fr;gap:clamp(24px,5vw,80px);
  align-items:start;max-width:1050px;margin:0 auto;position:relative;z-index:1;
}
.testi-nav-list { display:flex;flex-direction:column; }
.testi-nav-btn {
  padding:14px 16px;cursor:pointer;
  border-left:2px solid transparent;
  transition:all 0.3s;background:none;border-top:none;border-right:none;border-bottom:none;
  text-align:left;font-family:'Poppins',sans-serif;
}
.testi-nav-btn.active { border-left-color:var(--gold);background:rgba(201,168,76,0.05); }
.testi-nav-nm { font-weight:600;color:rgba(255,255,255,0.65);font-size:0.86rem;transition:color 0.3s; }
.testi-nav-btn.active .testi-nav-nm,.testi-nav-btn:hover .testi-nav-nm { color:white; }
.testi-nav-rl { font-size:0.67rem;color:rgba(255,255,255,0.28);margin-top:2px; }
.testi-quote-txt {
  font-family:'Playfair Display',serif;
  font-size:clamp(1rem,2.3vw,1.48rem);
  color:rgba(255,255,255,0.82);line-height:1.8;font-style:italic;margin-bottom:28px;
}
.testi-author-row { display:flex;align-items:center;gap:14px; }
.testi-author-bar { width:28px;height:2px;background:var(--gold);flex-shrink:0; }
.testi-author-nm { font-weight:700;color:white;font-size:0.88rem; }
.testi-author-rl { font-size:0.67rem;color:rgba(255,255,255,0.3);margin-top:2px; }

/* ─── BLOG ────────────────────────────────────────── */
.blog-sec { background:white;padding:clamp(48px,7vw,96px) 0 0;overflow:hidden; }
.blog-hdr {
  padding:0 var(--px) clamp(32px,5vw,52px);
  display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;
}
.blog-grid {
  display:grid;grid-template-columns:1.4fr 1fr 1fr;
  grid-template-rows:auto auto;gap:1px;background:var(--border);
}
.blog-card { background:white;overflow:hidden;cursor:pointer; }
.blog-card:nth-child(1) { grid-column:1;grid-row:1/3; }
.blog-card:nth-child(4) { grid-column:2/4;grid-row:2/3; }
.blog-img-wr { overflow:hidden; }
.blog-img-wr img { transition:transform 0.7s;width:100%;object-fit:cover;display:block; }
.blog-card:hover .blog-img-wr img { transform:scale(1.06); }
.blog-bdy { padding:clamp(14px,2.5vw,20px) clamp(16px,3vw,24px); }
.blog-meta { display:flex;align-items:center;gap:9px;margin-bottom:8px; }
.blog-tag-lbl {
  font-size:0.56rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--navy);background:rgba(0,78,122,0.07);padding:3px 9px;border-radius:2px;
}
.blog-dt { font-size:0.63rem;color:var(--text-light); }
.blog-ttl { font-family:'Playfair Display',serif;font-weight:700;color:var(--navy-dark);line-height:1.35;margin-bottom:7px; }
.blog-dsc { font-size:0.77rem;color:var(--text-muted);line-height:1.75; }
.blog-more {
  display:inline-flex;align-items:center;gap:5px;margin-top:10px;
  font-size:0.63rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--navy);transition:all 0.3s;
}
.blog-card:hover .blog-more { color:var(--gold);gap:9px; }

/* ─── CONTACT ─────────────────────────────────────── */
.contact-wrap { display:grid;grid-template-columns:1fr 1fr; }
.contact-l {
  background:var(--navy-dark);
  padding:clamp(40px,6vw,88px) clamp(28px,5vw,66px);
  display:flex;flex-direction:column;justify-content:center;
  position:sticky;top:0;align-self:start;
}
.contact-info {
  display:flex;align-items:center;gap:14px;
  padding:15px 0;border-bottom:1px solid rgba(255,255,255,0.06);
}
.c-ico {
  width:36px;height:36px;border-radius:50%;
  background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.22);
  display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;
}
.c-txt { font-size:clamp(0.78rem,1.4vw,0.86rem);color:rgba(255,255,255,0.55); }
.contact-r {
  background:var(--off-white);
  padding:clamp(40px,6vw,88px) clamp(28px,5vw,66px);
}
.form-2col { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
.f-group { margin-bottom:22px; }
.f-lbl {
  display:block;font-size:0.58rem;font-weight:700;
  letter-spacing:0.16em;text-transform:uppercase;
  color:var(--text-muted);margin-bottom:8px;
}
.f-inp {
  width:100%;padding:11px 0;
  border:none;border-bottom:1.5px solid rgba(0,78,122,0.16);
  background:transparent;font-family:'Poppins',sans-serif;
  font-size:0.88rem;color:var(--text);outline:none;transition:border-color 0.25s;
}
.f-inp:focus { border-bottom-color:var(--navy); }
.f-inp::placeholder { color:var(--text-light); }
.f-sel { appearance:none;cursor:pointer;background:transparent; }
.f-ta { min-height:80px;resize:none; }
.btn-submit {
  width:100%;padding:14px;background:var(--navy);color:white;
  font-family:'Poppins',sans-serif;
  font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
  border:none;cursor:pointer;border-radius:2px;
  display:flex;align-items:center;justify-content:center;gap:9px;transition:all 0.3s;
}
.btn-submit:hover { background:var(--navy-dark);transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,78,122,0.3); }

/* ─── FOOTER ──────────────────────────────────────── */
.footer { background:var(--navy-dark); }
.footer-top {
  display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;
  padding:clamp(40px,6vw,76px) var(--px);
  gap:clamp(24px,4vw,56px);
  border-bottom:1px solid rgba(255,255,255,0.05);
}
.foot-brand-p { font-size:clamp(0.72rem,1.3vw,0.79rem);color:rgba(255,255,255,0.27);line-height:1.9;margin:12px 0 20px;font-weight:300;max-width:230px; }
.socials { display:flex;gap:7px;flex-wrap:wrap; }
.social-ic {
  width:32px;height:32px;border-radius:50%;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);
  display:flex;align-items:center;justify-content:center;
  font-size:0.75rem;color:rgba(255,255,255,0.32);cursor:pointer;transition:all 0.3s;
}
.social-ic:hover { background:var(--gold);color:var(--navy-deep);border-color:var(--gold); }
.foot-col-ttl { font-size:0.6rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:14px; }
.foot-lnk { display:block;font-size:clamp(0.72rem,1.3vw,0.8rem);color:rgba(255,255,255,0.28);padding:3px 0;transition:color 0.2s;font-weight:400; }
.foot-lnk:hover { color:var(--gold); }
.footer-bottom {
  padding:14px var(--px);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;
  background:rgba(0,0,0,0.18);
}
.foot-copy { font-size:0.65rem;color:rgba(255,255,255,0.16); }
.foot-legal { display:flex;gap:16px;flex-wrap:wrap; }
.foot-legal a { font-size:0.65rem;color:rgba(255,255,255,0.16);transition:color 0.2s; }
.foot-legal a:hover { color:var(--gold); }

/* ─── FLOAT BUTTON ────────────────────────────────── */
.float-enq {
  position:fixed;bottom:clamp(16px,3vw,26px);right:clamp(16px,3vw,26px);z-index:800;
  background:var(--gold);color:var(--navy-deep);border:none;cursor:pointer;
  border-radius:3px;padding:12px 18px;
  display:flex;align-items:center;gap:8px;
  font-family:'Poppins',sans-serif;font-size:0.67rem;font-weight:700;
  letter-spacing:0.09em;text-transform:uppercase;
  box-shadow:0 8px 30px rgba(201,168,76,0.38);
  transition:all 0.3s;text-decoration:none;
  animation:floatPulse 3s ease-in-out infinite;
}
.float-enq:hover { background:var(--gold-light);transform:translateY(-3px);box-shadow:0 16px 44px rgba(201,168,76,0.52); }
@keyframes floatPulse { 0%,100%{box-shadow:0 8px 30px rgba(201,168,76,0.38)} 50%{box-shadow:0 8px 44px rgba(201,168,76,0.58)} }

/* ═══════════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ═══════════════════════════════════════════════════ */
@media (min-width:1440px) {
  .hero-grid { max-width:1400px; }
  .amenities-grid { max-width:1400px; }
  .testi-grid { max-width:1150px; }
}
@media (max-width:1279px) and (min-width:1025px) {
  .hero-grid { grid-template-columns:1fr 360px; }
  .pcard { padding:22px 20px; }
  .footer-top { grid-template-columns:1.3fr 1fr 1fr 1fr; }
  .blog-grid { grid-template-columns:1.2fr 1fr; }
  .blog-card:nth-child(1) { grid-column:1;grid-row:1; }
  .blog-card:nth-child(4) { grid-column:1/3; }
}
@media (max-width:1024px) {
  .nav-links,.nav-cta-btn { display:none !important; }
  .ham-btn { display:flex !important; }
  .hero-grid { grid-template-columns:1fr; }
  .pcard { max-width:520px;width:100%; }
  .pcard-chips { grid-template-columns:1fr 1fr; }
  .about-wrap { grid-template-columns:1fr; }
  .about-img { min-height:320px; }
  .showcase-content { grid-template-columns:1fr; }
  .hl-cards { grid-template-columns:repeat(4,1fr); }
  .price-section { grid-template-columns:1fr; }
  .price-l { border-right:none;border-bottom:1px solid rgba(255,255,255,0.06); }
  .specs-wrap { grid-template-columns:1fr; }
  .specs-visual { min-height:260px; }
  .amenities-grid { grid-template-columns:repeat(3,1fr); }
  .location-wrap { grid-template-columns:1fr; }
  .services-grid { grid-template-columns:1fr 1fr; }
  .testi-grid { grid-template-columns:1fr; }
  .testi-nav-list { flex-direction:row;flex-wrap:wrap;gap:8px;margin-bottom:32px; }
  .testi-nav-btn { border-left:none;border-bottom:2px solid transparent;padding:8px 13px; }
  .testi-nav-btn.active { border-bottom-color:var(--gold);border-left:none; }
  .blog-grid { grid-template-columns:1fr 1fr; }
  .blog-card:nth-child(1) { grid-column:1/3;grid-row:auto; }
  .blog-card:nth-child(4) { grid-column:1/3; }
  .contact-wrap { grid-template-columns:1fr; }
  .contact-l { position:static; }
  .footer-top { grid-template-columns:1fr 1fr; }
  .stats-bar { grid-template-columns:1fr 1fr; }
  .stat-cell:nth-child(2) { border-right:none; }
  .stat-cell:nth-child(3) { border-right:1px solid var(--border); }
  .stat-cell:nth-child(4) { border-right:none; }
}
@media (max-width:1024px) and (min-width:768px) {
  .hero-grid { gap:32px; }
  .showcase-content { gap:40px; }
  .hl-cards { grid-template-columns:repeat(2,1fr); }
  .feat-chips { max-width:100%; }
  .blog-card:nth-child(1) .blog-img-wr img { height:280px; }
  .blog-card:nth-child(4) .blog-img-wr img { height:180px; }
}
@media (max-width:767px) {
  :root { --px: clamp(16px, 5vw, 24px); }
  .hero-grid { padding-top:90px;padding-bottom:50px;grid-template-columns:1fr;gap:28px; }
  .hero-h1 { font-size:clamp(2.2rem,9vw,3rem); }
  .hero-p { font-size:0.85rem; }
  .hero-btns { gap:8px; }
  .hero-minis { gap:14px;margin-top:28px;padding-top:22px; }
  .pcard { max-width:100%;width:100%; }
  .about-img { min-height:280px; }
  .showcase { min-height:85vh; }
  .showcase-content { grid-template-columns:1fr; }
  .hl-cards { grid-template-columns:1fr 1fr; }
  .services-grid { grid-template-columns:1fr; }
  .blog-grid { grid-template-columns:1fr; }
  .blog-card:nth-child(1),.blog-card:nth-child(4) { grid-column:1;grid-row:auto; }
  .form-2col { grid-template-columns:1fr; }
  .footer-top { grid-template-columns:1fr 1fr; }
  .footer-top > div:first-child { grid-column:1/3; }
  .amenities-grid { grid-template-columns:1fr 1fr; }
  .stats-bar { grid-template-columns:1fr 1fr; }
  .stat-cell:nth-child(2) { border-right:none; }
  .stat-cell:nth-child(3) { border-right:1px solid var(--border); }
  .stat-cell:nth-child(4) { border-right:none; }
  .loc-pts { grid-template-columns:1fr; }
  .loc-pt,.loc-pt:nth-child(even) { border-right:none;padding-left:0;padding-right:0; }
  .testi-nav-list { flex-direction:row;flex-wrap:wrap;gap:6px; }
  .testi-nav-btn { padding:7px 11px; }
  .testi-nav-nm { font-size:0.78rem; }
  .testi-nav-rl { display:none; }
  .float-enq { padding:10px 14px;font-size:0.62rem; }
}
@media (max-width:639px) {
  .hero-h1 { font-size:clamp(2rem,10vw,2.6rem); }
  .btn-gold,.btn-ghost-w,.btn-navy,.btn-outline-n { padding:11px 18px;font-size:0.67rem; }
  .services-grid { grid-template-columns:1fr; }
  .specs-visual { min-height:220px; }
  .price-big { font-size:clamp(2.6rem,10vw,3.8rem); }
  .showcase-h2 { font-size:clamp(1.7rem,8vw,2.5rem); }
  .footer-top { grid-template-columns:1fr; }
  .footer-top > div:first-child { grid-column:1; }
  .amenities-grid { grid-template-columns:1fr 1fr; }
}
@media (max-width:479px) {
  :root { --px: 16px; }
  .nav-inner { padding:0 16px;height:60px; }
  .nav.scrolled .nav-inner { height:56px; }
  .hero-grid { padding-top:76px;padding-bottom:44px; }
  .hero-h1 { font-size:clamp(1.9rem,9vw,2.4rem);margin-bottom:18px; }
  .hero-btns { flex-direction:column;gap:8px; }
  .btn-gold,.btn-ghost-w { width:100%;justify-content:center; }
  .hero-minis { gap:12px; }
  .hero-mini-n { font-size:1.25rem; }
  .pcard-chips { grid-template-columns:1fr 1fr; }
  .pcard-chip { font-size:0.63rem;padding:7px 8px;gap:5px; }
  .stat-ico { width:38px;height:38px;font-size:1rem; }
  .about-year-badge { bottom:16px;left:16px;padding:10px 16px; }
  .about-year-n { font-size:1.5rem; }
  .hl-cards { grid-template-columns:1fr 1fr;gap:8px; }
  .hl-n { font-size:1.2rem; }
  .amenities-grid { grid-template-columns:1fr 1fr; }
  .amenity-ico { width:36px;height:36px;font-size:1rem; }
  .blog-card:nth-child(1) .blog-img-wr img { height:200px; }
  .form-2col { grid-template-columns:1fr; }
  .footer-top { grid-template-columns:1fr; }
  .foot-legal { gap:10px; }
  .scroll-hint { display:none; }
  .mob-overlay { padding-top:68px; }
}
@media (hover:none) {
  .why-item:hover,.spec-row:hover,.pay-row:hover,
  .srv-card:hover,.blog-card:hover,.hl-card:hover,
  .amenity-card:hover,.stat-cell:hover { transform:none; }
  .srv-card:hover { box-shadow:none; }
  .btn-gold:hover,.btn-navy:hover,.btn-outline-n:hover,
  .btn-ghost-w:hover,.btn-ghost-w2:hover,.btn-submit:hover { transform:none;box-shadow:none; }
}
@media (prefers-reduced-motion:reduce) {
  *,*::before,*::after { animation-duration:0.01ms !important;transition-duration:0.01ms !important; }
  .hero-bg { animation:none; }
  .marquee-track { animation:none; }
}
@media print {
  .nav,.float-enq,.ham-btn,.mob-overlay,.scroll-hint { display:none !important; }
  .hero { min-height:auto;page-break-after:always; }
  * { color:#000 !important;background:#fff !important; }
}
`;

const NAV_LINKS = ["About","Project","Amenities","Services","Blog","Contact"];

const STATS = [
  {icon:"🏆",n:"500+",l:"Homes Delivered"},
  {icon:"👨‍👩‍👧‍👦",n:"30K+",l:"Satisfied Residents"},
  {icon:"📅",n:"12+",l:"Years of Excellence"},
  {icon:"🥇",n:"22",l:"National Awards"},
];

const AMENITIES = [
  {icon:"🏊",name:"Olympic-Length Swimming Pool"},
  {icon:"🏃",name:"Elevated Jogging Track"},
  {icon:"🎾",name:"Floodlit Tennis Courts"},
  {icon:"🏀",name:"Full-Size Basketball Court"},
  {icon:"🧘",name:"Yoga & Meditation Pavilion"},
  {icon:"🎮",name:"Esports & Gaming Lounge"},
  {icon:"📚",name:"Grand Library & Co-Working"},
  {icon:"🎪",name:"Open-Air Amphitheatre"},
  {icon:"🧒",name:"Premium Kids' Adventure Zone"},
  {icon:"🐾",name:"Dedicated Pet Walking Park"},
  {icon:"🏏",name:"Box Cricket & Turf Arena"},
  {icon:"🎉",name:"Grand Banquet & Event Lawn"},
];

const SPECS = [
  "Corner & Dual-Aspect Open Layouts","Unobstructed 270° Panoramic Views",
  "Soaring 12 Ft Floor-to-Ceiling Heights","Extra-Wide Private Wraparound Balconies",
  "Private Study with Acoustic Insulation","Corner Balcony off Every Master Bedroom",
  "Imported Italian Marble Throughout","Wide-Plank Engineered Wood in Bedrooms",
  "Designer Modular Kitchen, Stone Countertop","Triple-Sealed UPVC Windows & Fittings",
];

const PAYMENT_PLAN = [
  {pct:"10%",label:"On Booking / Agreement"},{pct:"5%",label:"Within 45 Days of Booking"},
  {pct:"5%",label:"Within 90 Days of Booking"},{pct:"10%",label:"On Excavation Completion"},
  {pct:"7.5%",label:"On 5th Floor Slab Cast"},{pct:"7.5%",label:"On 10th Floor Slab Cast"},
  {pct:"7.5%",label:"On 15th Floor Slab Cast"},{pct:"7.5%",label:"On 20th Floor Slab Cast"},
  {pct:"7.5%",label:"On 25th Floor Slab Cast"},{pct:"7.5%",label:"On 30th Floor Slab Cast"},
  {pct:"7.5%",label:"On Superstructure Completion"},{pct:"7.5%",label:"On Finishing & MEP Works"},
  {pct:"5%",label:"On External Façade Completion"},{pct:"5%",label:"On Possession Offer Letter"},
];

const SERVICES = [
  {icon:"🏛️",title:"Iconic Architecture",desc:"Landmark designs that command skylines and stand as testaments to bold, timeless vision."},
  {icon:"🏢",title:"Commercial Excellence",desc:"Bespoke commercial towers and workspaces built to maximise productivity and brand prestige."},
  {icon:"🏠",title:"Signature Residences",desc:"Ultra-luxury high-rise homes crafted for discerning buyers seeking the pinnacle of urban living."},
  {icon:"🎨",title:"Bespoke Interiors",desc:"Handcrafted interiors curated by internationally acclaimed designers and master craftspeople."},
  {icon:"🌿",title:"Green Architecture",desc:"IGBC Gold-rated, sustainably engineered buildings that tread lightly without compromising luxury."},
  {icon:"🔑",title:"Concierge Management",desc:"White-glove property management services that protect your investment and elevate your lifestyle."},
];

const BLOGS = [
  {img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85",tag:"Design",date:"Feb 20, 2026",title:"Why Greater Noida West Is NCR's New Luxury Frontier",desc:"As infrastructure matures and expressways expand, Greater Noida West has quietly emerged as the most coveted address for premium high-rise living in the entire NCR corridor."},
  {img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",tag:"Investment",date:"Feb 12, 2026",title:"High-Rise vs Plotted: Where Smart Capital Flows in 2026"},
  {img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",tag:"Sustainability",date:"Jan 30, 2026",title:"Net-Zero Homes: Luxury Living With a Lighter Footprint"},
  {img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",tag:"Architecture",date:"Jan 18, 2026",title:"The Rise of the Supertall: NCR's Vertical Revolution",desc:"How 40-plus-storey residential towers are rewriting the rules of urban density, community design, and architectural ambition across India's fastest-growing cities."},
];

const TESTIMONIALS = [
  {name:"Rahul Bhatia",role:"Managing Director, Bhatia Industries",text:"No developer has matched the precision and passion Iconic Tower brings to every single project. Our penthouse exceeded every benchmark we set — in finish, in view, and in pure living experience."},
  {name:"Sunita Kapoor",role:"Homeowner, Tower B — Floor 38",text:"From the moment we walked into the sample flat, we knew this was different. The ceiling height alone transforms how you breathe and think inside these spaces. Absolutely world-class."},
  {name:"Deepak Sharma",role:"CTO, Horizon Digital",text:"The payment flexibility and transparency throughout our purchase journey made this feel genuinely stress-free. Iconic Tower operates at a level of integrity that is rare in Indian real estate."},
  {name:"Ananya Mehrotra",role:"Principal Architect, Studio AM",text:"I evaluate buildings professionally — structure, materiality, proportion. Iconic Tower's latest residential project stands comparison with the finest global luxury developments I have seen."},
];

const WHY = [
  "12+ Years of Landmark Real Estate Delivery","Architecture Recognised by National Awards",
  "IGBC Gold-Rated Sustainable Construction","Fully Transparent, Zero-Hidden-Cost Pricing",
  "Dedicated White-Glove Handover Support","Premium Locations with Proven Appreciation",
];

const LOC_PTS = [
  "2 KM from Gaur City Mall","Direct NH-24 Access",
  "Noida–GN Expressway Connectivity","Proposed Metro Station Nearby",
  "Top CBSE Schools Within 3 KM","Hospital & Clinic Hub Nearby",
  "5-Star Hotels Within 4 KM","Highest Capital Appreciation Zone",
];

export default function IconicTower() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [testiIdx, setTestiIdx] = useState(0);
  const [payOpen, setPayOpen] = useState(false);
  const [form, setForm] = useState({name:"",email:"",phone:"",interest:"",msg:""});

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestiIdx(p => (p+1)%TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobOpen]);

  const fv = f => ({
    className:"f-inp",value:form[f],
    onChange:e=>setForm({...form,[f]:e.target.value})
  });

  return (
    <div>
      <style>{css}</style>

      <a href="#contact" className="float-enq">📞 Free Consultation</a>

      {/* NAV */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <img
              src="/logo1.png"
              alt="Iconic Tower"
              className="nav-logo-img"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="nav-logo-fallback">
              <div className="nav-logo-hex">
                <span style={{fontFamily:"'Playfair Display',serif",color:"var(--navy-deep)",fontWeight:900,fontSize:"0.82rem"}}>IT</span>
              </div>
              <span className="nav-logo-name">Iconic Tower</span>
            </div>
          </a>
          <div className="nav-links">
            {NAV_LINKS.map(l=><a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>)}
            <a href="#contact" className="nav-link nav-cta-btn">Book Now →</a>
          </div>
          <button className="ham-btn" onClick={()=>setMobOpen(true)} aria-label="Open menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mob-overlay${mobOpen?" open":""}`} role="dialog" aria-modal="true">
        <button className="mob-close-btn" onClick={()=>setMobOpen(false)} aria-label="Close menu">✕</button>
        {["Home",...NAV_LINKS].map(l=>(
          <a key={l} href={`#${l.toLowerCase()}`} className="mob-nav-link" onClick={()=>setMobOpen(false)}>
            {l}<span style={{opacity:0.28,fontSize:"0.9rem"}}>→</span>
          </a>
        ))}
        <div className="mob-cta">
          <a href="#contact" className="btn-gold" style={{width:"100%",justifyContent:"center"}} onClick={()=>setMobOpen(false)}>
            Book a Consultation →
          </a>
        </div>
      </div>

      {/* HERO */}
      <section id="home" className="hero">
        <img className="hero-bg" src="/6.png" alt="Iconic Tower Aerial View"/>
        <div className="hero-overlay"/>
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <div className="eyebrow-line"/>
              <span className="eyebrow-txt">Exclusive Pre-Launch · 4 BHK Ultra-Luxury · Greater Noida West</span>
            </div>
            <h1 className="hero-h1">
              Where <em>Elevation</em><br/>
              Becomes<br/>
              a Lifestyle
            </h1>
            <p className="hero-p">
              Soaring 45 storeys above Greater Noida West, Iconic Tower sets a new standard for luxury vertical living — where every detail is crafted for those who refuse to compromise.
            </p>
            <div className="hero-btns">
              <a href="#project" className="btn-gold">Discover the Project →</a>
              <a href="#contact" className="btn-ghost-w">Request a Callback</a>
            </div>
            <div className="hero-minis">
              {[{n:"45",l:"Floors High"},{n:"4 BHK",l:"+ Private Study"},{n:"24 Ac",l:"Master Township"},{n:"270°",l:"Unobstructed Views"}].map(({n,l},i)=>(
                <div key={i}>
                  <div className="hero-mini-n">{n}</div>
                  <div className="hero-mini-l">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pcard">
            <div className="pcard-badge"><span className="blink">●</span>Exclusive Pre-Launch</div>
            <div className="pcard-lbl">Pre-Launch Price From</div>
            <div className="pcard-price">₹X.XX Cr</div>
            <div className="pcard-sub">All-Inclusive · No Hidden Charges</div>
            <div className="pcard-chips">
              {[["🛏","4 King Bedrooms"],["🚿","4 Bathrooms"],["📐","Private Study"],["🌅","Panoramic Views"]].map(([ic,l],i)=>(
                <div key={i} className="pcard-chip"><span>{ic}</span>{l}</div>
              ))}
            </div>
            <div className="pcard-div"/>
            {[["RERA Registered","✓ Compliant"],["Possession Date","Dec 2028"],["Configuration","4 BHK + Study + 4T"]].map(([l,r],i)=>(
              <div key={i} className="pcard-row">
                <span className="pcard-rl">{l}</span>
                <span className="pcard-rr">{r}</span>
              </div>
            ))}
            <div className="pcard-btns">
              <button className="btn-gold-w" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Claim Best Price →</button>
              <button className="btn-ghost-w2" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>📍 Book a Private Site Tour</button>
            </div>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-hint-line"/>
          <span className="scroll-hint-txt">Discover More</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {Array(8).fill(["Exclusive Pre-Launch","Greater Noida West","45-Storey Landmark","4 BHK + Study Room","24 Acre Integrated Township","Very Limited Inventory","Award-Winning Developer","RERA Compliant"]).flat().map((t,i)=>(
            <span key={i} className="marquee-item"><span className="m-dot"/>{t}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        {STATS.map(({icon,n,l},i)=>(
          <div key={i} className="stat-cell">
            <div className="stat-ico">{icon}</div>
            <div>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about" className="about-wrap">
        <div className="about-img">
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85" alt="Iconic Tower Heritage"/>
          <div className="about-img-overlay"/>
          <div className="about-year-badge">
            <div className="about-year-n">2014</div>
            <div className="about-year-l">Founded</div>
          </div>
        </div>
        <div className="about-body">
          <div className="sec-tag"><div className="sec-tag-line"/><span className="sec-tag-txt">Our Story</span></div>
          <h2 className="sec-h2">A Legacy of<br/><em>Iconic Landmarks</em></h2>
          <p className="sec-p">For over twelve years, Iconic Tower has shaped skylines with bold vision and precision craftsmanship. We don't build properties — we create enduring landmarks that define communities, elevate neighbourhoods, and reward every family who calls them home.</p>
          <div className="why-list">
            {WHY.map((w,i)=>(
              <div key={i} className="why-item">
                <span className="why-n">{String(i+1).padStart(2,"0")}</span>
                <span className="why-t">{w}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a href="#project" className="btn-navy">Explore the Project →</a>
            <a href="#contact" className="btn-outline-n">Talk to an Expert</a>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="project" className="showcase">
        <img className="showcase-bg" src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=90" alt="Project Tower View"/>
        <div className="showcase-overlay"/>
        <div className="showcase-content">
          <div>
            <div className="showcase-pill"><span className="sc-pill-dot"/><span className="sc-pill-txt">Bisrakh Road · Greater Noida West, UP</span></div>
            <h2 className="showcase-h2">A Tower That<br/><em>Commands</em><br/>Every Horizon</h2>
            <p className="showcase-p">Standing 45 floors tall in the most connected growth corridor of the NCR, Iconic Tower delivers an extraordinary residential experience — where architectural ambition meets thoughtful luxury at every level.</p>
            <div className="feat-chips">
              {["🛏 4 BHK + Study","🚿 4 Full Bathrooms","📐 12 Ft Ceilings","🌅 270° Open Views","🏛 45 Storeys","🌳 24 Acre Township"].map((f,i)=>(
                <div key={i} className="feat-chip">{f}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <a href="#contact" className="btn-gold">Get Exclusive Pricing →</a>
              <a href="#contact" className="btn-ghost-w">Arrange a Site Visit</a>
            </div>
          </div>
          <div className="hl-cards">
            {[{n:"45",l:"Storey Residential Tower"},{n:"4 BHK",l:"+ Study · 4 Full Baths"},{n:"12 Ft",l:"Soaring Ceiling Height"},{n:"24 Ac",l:"Fully Integrated Township"}].map(({n,l},i)=>(
              <div key={i} className="hl-card">
                <div className="hl-n">{n}</div>
                <div className="hl-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="price-section">
        <div className="price-l">
          <div className="sec-tag" style={{marginBottom:16}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt" style={{color:"rgba(255,255,255,0.4)"}}>Pricing & Investment</span>
          </div>
          <div className="price-big">₹X.XX<br/><span>Crore</span></div>
          <div className="price-unit">ONWARDS · EXCLUSIVE PRE-LAUNCH RATE</div>
          <div className="cfg-pills">
            {["4 BHK","Study Room","4 Baths","24 Acres","45 Floors"].map((p,i)=>(
              <span key={i} className={`cfg-pill${i===0?" active":""}`}>{p}</span>
            ))}
          </div>
          <p style={{fontSize:"clamp(0.8rem,1.5vw,0.84rem)",color:"rgba(255,255,255,0.36)",lineHeight:1.85,marginBottom:28,fontWeight:300}}>Secure your home in Greater Noida West's most ambitious 45-storey landmark at pre-launch advantage pricing. Flexible construction-linked plan available with attractive early-bird benefits.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a href="#contact" className="btn-gold">Claim Pre-Launch Price →</a>
            <a href="#contact" className="btn-ghost-w">Schedule a Visit</a>
          </div>
        </div>
        <div className="price-r">
          <div className="sec-tag" style={{marginBottom:16}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt" style={{color:"rgba(255,255,255,0.4)"}}>Payment Structure</span>
          </div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,2.5vw,2rem)",fontWeight:700,color:"white",marginBottom:20}}>
            Built for <em style={{color:"var(--gold)"}}>Peace of Mind</em>
          </h3>
          <div className="pay-table">
            {(payOpen?PAYMENT_PLAN:PAYMENT_PLAN.slice(0,7)).map(({pct,label},i)=>(
              <div key={i} className="pay-row">
                <span className="pay-num">{String(i+1).padStart(2,"0")}</span>
                <span className="pay-lbl">{label}</span>
                <span className="pay-pct">{pct}</span>
              </div>
            ))}
          </div>
          <button className="show-more" onClick={()=>setPayOpen(p=>!p)}>
            {payOpen?"▲ Collapse Plan":`▼ View All ${PAYMENT_PLAN.length} Milestones`}
          </button>
        </div>
      </section>

      {/* SPECS */}
      <section className="specs-wrap">
        <div className="specs-visual">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=85" alt="Interior Specifications"/>
          <div className="specs-visual-ov"/>
        </div>
        <div className="specs-content">
          <div className="sec-tag" style={{marginBottom:10}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt">Home Specifications</span>
          </div>
          <h2 className="sec-h2" style={{marginBottom:24}}>Every Detail,<br/><em>Perfected</em></h2>
          <div className="spec-list">
            {SPECS.map((s,i)=>(
              <div key={i} className="spec-row">
                <div className="spec-dot"/>
                <span className="spec-txt">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" className="amenities-sec">
        <div className="amenities-hdr">
          <div className="sec-tag" style={{justifyContent:"center",marginBottom:10}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt" style={{color:"rgba(255,255,255,0.4)"}}>World-Class Lifestyle</span>
            <div className="sec-tag-line"/>
          </div>
          <h2 className="sec-h2" style={{color:"white"}}>Amenities That <em style={{color:"var(--gold)"}}>Inspire</em></h2>
        </div>
        <div className="amenities-grid">
          {AMENITIES.map(({icon,name},i)=>(
            <div key={i} className="amenity-card">
              <div className="amenity-ico">{icon}</div>
              <div className="amenity-nm">{name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="location-wrap">
        <div className="location-content">
          <div className="sec-tag" style={{marginBottom:10}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt">Location & Connectivity</span>
          </div>
          <h2 className="sec-h2">Connected to <em>Everything</em></h2>
          <p className="sec-p" style={{marginBottom:4}}>Strategically located on Bisrakh Road, Greater Noida West — at the intersection of seamless connectivity, rapid infrastructure growth, and outstanding long-term appreciation.</p>
          <div className="loc-pts">
            {LOC_PTS.map((l,i)=>(
              <div key={i} className="loc-pt">
                <span className="loc-pt-ico">📍</span>
                <span className="loc-pt-txt">{l}</span>
              </div>
            ))}
          </div>
          <a href="#contact" className="btn-navy" style={{alignSelf:"flex-start"}}>Arrange a Site Visit →</a>
        </div>
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3414880842183!2d77.43110949999999!3d28.589530600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceff6ef2459c5%3A0x4cdf16a9ad1bd4ef!2sAU!5e0!3m2!1sen!2sin!4v1772027669158!5m2!1sen!2sin"
            title="Project Location" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-footer"><span>📍</span><span>Bisrakh Road · Greater Noida West, Uttar Pradesh</span></div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-sec">
        <div className="services-hdr">
          <div>
            <div className="sec-tag" style={{marginBottom:8}}><div className="sec-tag-line"/><span className="sec-tag-txt">What We Deliver</span></div>
            <h2 className="sec-h2">Our Signature <em>Expertise</em></h2>
          </div>
          <a href="#contact" className="btn-outline-n">View All Services →</a>
        </div>
        <div className="services-grid">
          {SERVICES.map(({icon,title,desc},i)=>(
            <div key={i} className="srv-card">
              <div className="srv-ico">{icon}</div>
              <div className="srv-name">{title}</div>
              <div className="srv-desc">{desc}</div>
              <div className="srv-link">Find Out More <span>→</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi-sec">
        <div style={{maxWidth:"1050px",margin:"0 auto"}}>
          <div className="sec-tag" style={{marginBottom:12}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt" style={{color:"rgba(255,255,255,0.38)"}}>Resident Voices</span>
          </div>
          <h2 className="sec-h2" style={{color:"white",marginBottom:40}}>Stories From <em style={{color:"var(--gold)"}}>Our Community</em></h2>
          <div className="testi-grid">
            <div className="testi-nav-list">
              {TESTIMONIALS.map((t,i)=>(
                <button key={i} className={`testi-nav-btn${i===testiIdx?" active":""}`} onClick={()=>setTestiIdx(i)}>
                  <div className="testi-nav-nm">{t.name}</div>
                  <div className="testi-nav-rl">{t.role}</div>
                </button>
              ))}
            </div>
            <div>
              <p className="testi-quote-txt">"{TESTIMONIALS[testiIdx].text}"</p>
              <div className="testi-author-row">
                <div className="testi-author-bar"/>
                <div>
                  <div className="testi-author-nm">{TESTIMONIALS[testiIdx].name}</div>
                  <div className="testi-author-rl">{TESTIMONIALS[testiIdx].role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="blog-sec">
        <div className="blog-hdr">
          <div>
            <div className="sec-tag" style={{marginBottom:8}}><div className="sec-tag-line"/><span className="sec-tag-txt">Market Intelligence</span></div>
            <h2 className="sec-h2">Ideas & <em>Insights</em></h2>
          </div>
          <a href="#" className="btn-outline-n">Browse All Articles →</a>
        </div>
        <div className="blog-grid">
          {BLOGS.map((b,i)=>(
            <div key={i} className="blog-card">
              <div className="blog-img-wr">
                <img src={b.img} alt={b.title} style={{height:i===0?"clamp(240px,36vw,460px)":"clamp(140px,20vw,220px)"}}/>
              </div>
              <div className="blog-bdy">
                <div className="blog-meta">
                  <span className="blog-tag-lbl">{b.tag}</span>
                  <span className="blog-dt">{b.date}</span>
                </div>
                <h3 className="blog-ttl" style={{fontSize:i===0?"clamp(0.95rem,1.9vw,1.3rem)":"0.9rem"}}>{b.title}</h3>
                {b.desc&&<p className="blog-dsc">{b.desc}</p>}
                <span className="blog-more">Read Full Article <span>→</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-wrap">
        <div className="contact-l">
          <div className="sec-tag" style={{marginBottom:12}}>
            <div className="sec-tag-line"/>
            <span className="sec-tag-txt" style={{color:"rgba(255,255,255,0.38)"}}>Begin Your Journey</span>
          </div>
          <h2 className="sec-h2" style={{color:"white",marginBottom:14}}>Your Dream Home<br/><em>Awaits You</em></h2>
          <p style={{fontSize:"clamp(0.82rem,1.5vw,0.88rem)",color:"rgba(255,255,255,0.35)",lineHeight:1.9,marginBottom:30,fontWeight:300}}>Connect with our luxury real estate advisors for a personalised consultation — from your first question to your moving-in day, we are with you every step.</p>
          {[["📞","+91 9999 999 999"],["✉️","hello@iconictower.in"],["📍","Bisrakh Road, Greater Noida West, UP 201306"]].map(([ic,t],i)=>(
            <div key={i} className="contact-info">
              <div className="c-ico">{ic}</div>
              <span className="c-txt">{t}</span>
            </div>
          ))}
          <div style={{marginTop:24,border:"1px solid rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3414880842183!2d77.43110949999999!3d28.589530600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceff6ef2459c5%3A0x4cdf16a9ad1bd4ef!2sAU!5e0!3m2!1sen!2sin!4v1772027669158!5m2!1sen!2sin"
              width="100%" height="180" style={{border:0,display:"block"}} allowFullScreen loading="lazy" title="Office Location"
            />
          </div>
        </div>
        <div className="contact-r">
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.2rem,2.5vw,1.9rem)",fontWeight:700,color:"var(--navy-dark)",marginBottom:6}}>Request a Callback</h3>
          <p style={{fontSize:"0.74rem",color:"var(--text-light)",marginBottom:30}}>Our advisors respond within 2 hours during business hours.</p>
          <div className="form-2col">
            {[["name","Full Name","Your full name"],["email","Email Address","your@email.com"]].map(([f,l,p])=>(
              <div key={f} className="f-group">
                <label className="f-lbl">{l}</label>
                <input {...fv(f)} placeholder={p}/>
              </div>
            ))}
          </div>
          <div className="f-group">
            <label className="f-lbl">Mobile Number</label>
            <input {...fv("phone")} placeholder="+91 98765 43210"/>
          </div>
          <div className="f-group">
            <label className="f-lbl">I Am Interested In</label>
            <select className="f-inp f-sel" value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}>
              {["","Iconic Tower – 4 BHK Residence","Penthouse Enquiry","Investment Purchase","Commercial Space","Interior Design Package","General Information"].map(o=><option key={o} value={o}>{o||"Please select…"}</option>)}
            </select>
          </div>
          <div className="f-group">
            <label className="f-lbl">Your Message</label>
            <textarea {...fv("msg")} className="f-inp f-ta" placeholder="Share your requirements or any questions you have…"/>
          </div>
          <button className="btn-submit" onClick={()=>alert("Thank you! One of our luxury advisors will contact you within 2 hours.")}>
            Submit Enquiry ✈
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
              <div style={{width:102,height:52,display:"flex",alignItems:"center",justifyContent:"center",clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",flexShrink:0, marginLeft:-10}}>
                <img src="/logo1.png" alt="" className=""/>
              </div>
              {/* <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:"0.8rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"white"}}>Iconic Tower</span> */}
            </div>
            <p className="foot-brand-p">Shaping India's skylines with award-winning architecture, sustainable craftsmanship, and an unwavering commitment to extraordinary living since 2014.</p>
            <div className="socials">
              {["f","in","𝕏","▶"].map((s,i)=><a key={i} href="#" className="social-ic">{s}</a>)}
            </div>
          </div>
          {[
            {title:"Our Expertise",links:["Signature Architecture","Luxury Residences","Commercial Towers","Interior Design","Property Management"]},
            {title:"The Project",links:["4 BHK Configuration","Payment Milestones","World-Class Amenities","Location & Map","Download E-Brochure"]},
            {title:"Reach Us",links:["+91 9999 999 999","hello@iconictower.in","Greater Noida West, UP","Mon–Sat: 9:00 AM – 7:00 PM"]},
          ].map(({title,links},i)=>(
            <div key={i}>
              <div className="foot-col-ttl">{title}</div>
              {links.map((l,j)=><a key={j} href="#" className="foot-lnk">{l}</a>)}
            </div>
          ))}
        </div>
     
      </footer>
    </div>
  );
}