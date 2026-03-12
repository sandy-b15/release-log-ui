import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/release-log-logo-2.png";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
      borderBottom: scrolled ? "1px solid var(--land-border)" : "1px solid transparent",
      transition: "all .35s ease",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate('/')}>
          <img src={logo} alt="Releasly" style={{ height: 50 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Features", "Pricing", "Docs"].map((t) => {
            const isPage = t === "Pricing" || t === "Docs";
            const href = isPage ? `/${t.toLowerCase()}` : `#${t.toLowerCase()}`;
            return (
              <a key={t}
                href={href}
                onClick={isPage ? (e) => { e.preventDefault(); navigate(href); } : undefined}
                style={{ fontSize: 14, color: "var(--land-muted)", fontWeight: 500, transition: "color .2s" }}
                onMouseEnter={(e) => e.target.style.color = "var(--land-text)"}
                onMouseLeave={(e) => e.target.style.color = "var(--land-muted)"}
              >{t}</a>
            );
          })}
          <button onClick={() => navigate('/login')} className="land-btn land-btn-p" style={{ padding: "8px 20px", fontSize: 13 }}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}
