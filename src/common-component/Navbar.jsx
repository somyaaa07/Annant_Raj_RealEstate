import { useState } from "react";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const PriceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
  </svg>
);

const FloorPlanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z" />
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </svg>
);

const GalleryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const BRAND = "#004E7A";
const BRAND_LIGHT = "#e6f2f9";
const BRAND_DARK = "#003a5c";

const navItems = [
  { id: "home",      icon: <HomeIcon />,       label: ""                  },
  { id: "price",     icon: <PriceIcon />,      label: "Price"             },
  { id: "floor",     icon: <FloorPlanIcon />,  label: "Site & Floor Plan" },
  { id: "amenities", icon: <WifiIcon />,       label: "Amenities"         },
  { id: "gallery",   icon: <GalleryIcon />,    label: "Gallery"           },
  { id: "location",  icon: <LocationIcon />,   label: "Location"          },
  { id: "brochure",  icon: <DownloadIcon />,   label: "Download Brochure" },
];

export default function M3MNavbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className=" flex flex-col items-center justify-start pt-5 px-4"
      style={{  fontFamily: "'Segoe UI', sans-serif" }}
    >
      <nav
        className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(0,78,122,0.13), 0 2px 8px rgba(0,78,122,0.08)" }}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${BRAND}, #0072b1, #00a3cc)` }} />

        <div className="flex items-stretch" style={{ height: 68 }}>

          {/* ── M3M Logo ── */}
          <div
            className="flex flex-col justify-center items-start px-5 py-2 min-w-[120px] flex-shrink-0"
            style={{ background: `linear-gradient(145deg, ${BRAND} 0%, #0072b1 100%)` }}
          >
            <div className="flex items-baseline leading-none gap-[1px]">
              {/* <span className="font-black text-[26px] text-white tracking-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>M</span> */}
              {/* <span className="font-black text-[26px] text-red-400">3</span> */}
              <span className="font-black text-[26px] text-white tracking-tight">Annant Raj</span>
            </div>
            <p className="text-[7px] text-blue-200 font-semibold whitespace-nowrap mt-0.5 tracking-wide">Our Expertise. Your Joy.</p>
            <p className="text-[6px] text-blue-300 whitespace-nowrap tracking-wide">AUTHORISED CHANNEL PARTNER</p>
          </div>

          {/* ── Nav Items ── */}
          <div className="hidden md:flex items-stretch flex-1 overflow-x-auto ">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="relative flex flex-col items-center justify-center gap-[3px] px-3 h-full cursor-pointer transition-all duration-200 group flex-shrink-0"
                  style={{ minWidth: item.label ? "auto" : "52px" }}
                >
                  {/* Active / hover background */}
                  <span
                    className="absolute inset-x-1 inset-y-2 rounded-xl transition-all duration-200"
                    style={{ background: isActive ? BRAND_LIGHT : "transparent" }}
                  />
                  <span
                    className="absolute inset-x-1 inset-y-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ background: BRAND_LIGHT }}
                  />

                  {/* Bottom underline */}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-200"
                    style={{ background: BRAND, opacity: isActive ? 1 : 0, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />

                  <span
                    className="relative z-10 transition-colors duration-200"
                    style={{ color: isActive ? BRAND : "#94a3b8" }}
                  >
                    {item.icon}
                  </span>

                  {item.label && (
                    <span
                      className="relative z-10 text-[10.5px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-200"
                      style={{ color: isActive ? BRAND : "#64748b" }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Divider ── */}
          <div className="hidden md:block w-px my-4" style={{ background: "#e2eef6" }} />

          {/* ── Jacob & Co ── */}
          <div className="hidden md:flex flex-col items-center justify-center px-5 flex-shrink-0">
            <span
              className="text-[8px] font-black tracking-[0.2em] leading-none"
              style={{ color: BRAND }}
            >
              M3M
            </span>
            <span
              className="font-black text-[15px] leading-tight tracking-wider whitespace-nowrap"
              style={{ color: BRAND }}
            >
              JACOB &amp; CO
            </span>
            <span className="text-[6.5px] text-gray-400 whitespace-nowrap tracking-wide mt-0.5">
              AUTHORISED CHANNEL PARTNER
            </span>
          </div>

          {/* ── Divider ── */}
          <div className="hidden md:block w-px my-4" style={{ background: "#e2eef6" }} />

          {/* ── CTAs ── */}
          <div className="flex items-center gap-2 px-4 ml-auto md:ml-0 flex-shrink-0">
            {/* Pre Register */}
            <button
              className="hidden sm:flex items-center text-[11px] font-bold px-4 py-2 rounded-xl border-2 transition-all duration-200 hover:text-white hover:shadow-lg cursor-pointer"
              style={{ borderColor: BRAND, color: BRAND }}
              onMouseEnter={e => {
                e.currentTarget.style.background = BRAND;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = BRAND;
              }}
            >
              Pre Register
            </button>

            {/* Phone */}
            <a
              href="tel:+919599291285"
              className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${BRAND}, #0072b1)`,
                boxShadow: `0 4px 14px rgba(0,78,122,0.35)`,
              }}
            >
              <PhoneIcon />
              <span className="hidden lg:inline whitespace-nowrap">+91-9599291285</span>
              <span className="lg:hidden">Call</span>
            </a>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg transition-colors"
              style={{ color: BRAND }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="block w-5 h-[2px] rounded-full" style={{ background: BRAND }} />
              <span className="block w-5 h-[2px] rounded-full" style={{ background: BRAND }} />
              <span className="block w-5 h-[2px] rounded-full" style={{ background: BRAND }} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: "#e2eef6" }}>
            {navItems.filter((i) => i.label).map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-6 py-3.5 text-sm font-semibold transition-all duration-150"
                style={{
                  color: active === item.id ? BRAND : "#475569",
                  background: active === item.id ? BRAND_LIGHT : idx % 2 === 0 ? "#fafcff" : "#fff",
                  borderBottom: "1px solid #f0f7ff",
                }}
              >
                <span style={{ color: BRAND }}>{item.icon}</span>
                {item.label}
                {active === item.id && (
                  <span className="ml-auto w-2 h-2 rounded-full" style={{ background: BRAND }} />
                )}
              </button>
            ))}
            <div className="flex gap-3 p-4">
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                style={{ borderColor: BRAND, color: BRAND }}
              >
                Pre Register
              </button>
              <a
                href="tel:+919599291285"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND}, #0072b1)` }}
              >
                <PhoneIcon />
                Call Us
              </a>
            </div>
          </div>
        )}
      </nav>

   
    </div>
  );
}