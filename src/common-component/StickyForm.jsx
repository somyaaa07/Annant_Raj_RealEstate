import { useState } from "react";

const googleFontsLink = document.createElement("link");
googleFontsLink.rel = "stylesheet";
googleFontsLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@400;500;600&display=swap";
document.head.appendChild(googleFontsLink);

function StickyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    visitDate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: "24px",
        alignSelf: "flex-start",
        zIndex: 10,
      }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 8px 40px rgba(0,78,122,0.15)",
          fontFamily: "'Georgia', serif",
          width: "500px",
          maxWidth: "450px",
        }}
      >
        {/* Header */}
        <div className="px-6 py-5" style={{ background: "linear-gradient(135deg, #004e7a 0%, #006aa3 100%)" }}>
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill="white" fillOpacity="0.9" />
            </svg>
            <span className="text-white text-xs uppercase tracking-widest" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              Schedule a Visit
            </span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Enquire About This Property
          </h2>
          <p className="text-blue-200 text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our agent will get back to you within 2 hours
          </p>
        </div>

        {/* Price Badge */}
        <div className="mx-6 -mt-3 mb-4 px-4 py-2 rounded-lg flex items-center justify-between" style={{ background: "#f0f7fc", border: "1px solid #c8e0ef" }}>
          <span className="text-xs text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Starting from</span>
          <span className="font-bold text-lg" style={{ color: "#004e7a" }}>$1,250,000</span>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6 space-y-3">
          {[
            { label: "Full Name *", name: "name", type: "text", placeholder: "John Anderson" },
            { label: "Email Address *", name: "email", type: "email", placeholder: "john@example.com" },
            { label: "Phone Number", name: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
            { label: "Preferred Visit Date", name: "visitDate", type: "date", placeholder: "" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#004e7a", fontFamily: "'Poppins', sans-serif" }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                style={{ border: "1.5px solid #d1e8f5", fontFamily: "'Poppins', sans-serif", color: "#1a2e3b", background: "#fafcfe" }}
                onFocus={(e) => (e.target.style.borderColor = "#004e7a")}
                onBlur={(e) => (e.target.style.borderColor = "#d1e8f5")}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#004e7a", fontFamily: "'Poppins', sans-serif" }}>
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="I'm interested in this property and would like to..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
              style={{ border: "1.5px solid #d1e8f5", fontFamily: "'Poppins', sans-serif", color: "#1a2e3b", background: "#fafcfe" }}
              onFocus={(e) => (e.target.style.borderColor = "#004e7a")}
              onBlur={(e) => (e.target.style.borderColor = "#d1e8f5")}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 mt-1"
            style={{
              background: submitted ? "#28a745" : "linear-gradient(135deg, #004e7a 0%, #006aa3 100%)",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.12em",
              boxShadow: "0 4px 16px rgba(0,78,122,0.3)",
            }}
            onMouseEnter={(e) => { if (!submitted) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {submitted ? "✓ Request Sent!" : "Request a Viewing"}
          </button>

          <div className="flex items-center justify-center gap-4 pt-1">
            {[
              { icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z", label: "Secure & Private" },
              { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14l-4-4 1.41-1.41L11 13.17l6.59-6.59L19 8l-8 8z", label: "No Spam" },
              { icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z", label: "Top Rated" },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1 text-xs" style={{ color: "#7a9db5", fontFamily: "'Poppins', sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#7a9db5"><path d={icon} /></svg>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Agent Strip */}
        <div className="px-6 py-3 flex items-center gap-3" style={{ background: "#f0f7fc", borderTop: "1px solid #d1e8f5" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "#004e7a" }}>
            SA
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "#004e7a", fontFamily: "'Poppins', sans-serif" }}>Sarah Alderman</p>
            <p className="text-xs" style={{ color: "#7a9db5", fontFamily: "'Poppins', sans-serif" }}>Senior Property Consultant · 12 yrs exp.</p>
          </div>
          <a href="tel:+15550001234" className="ml-auto flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "#004e7a" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Demo layout to showcase the sticky behaviour
export default function App() {
  return (


    
      <StickyForm />
    
  );
}