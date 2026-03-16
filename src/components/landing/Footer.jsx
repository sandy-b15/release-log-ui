import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/releaslyy-logo-main.png";

const FOOTER_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Changelog", href: "#", comingSoon: true },
  { label: "Support", href: "/support" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleClick = (e, link) => {
    if (link.href.startsWith("/")) {
      e.preventDefault();
      navigate(link.href);
    }
  };

  return (
    <footer style={{ borderTop: "1px solid var(--land-border)", padding: "48px 24px" }}>
      <div className="land-con">
        <div className="land-footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={logo} alt="Releaslyy" style={{ height: 50 }} />
            <span style={{ fontSize: 13, color: "var(--land-muted)", marginLeft: 8 }}>&copy; 2026</span>
          </div>
          <div className="land-footer-links" style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {FOOTER_LINKS.map((l) =>
              l.comingSoon ? (
                <span key={l.label} style={{ fontSize: 13, color: "var(--land-muted)", cursor: "default", display: "inline-flex", alignItems: "center" }}>
                  {l.label}
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: "var(--land-border)", color: "var(--land-muted)", marginLeft: 6 }}>Coming Soon</span>
                </span>
              ) : (
                <a key={l.label} href={l.href}
                  onClick={(e) => handleClick(e, l)}
                  style={{ fontSize: 13, color: "var(--land-muted)", transition: "color .2s" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--land-text)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--land-muted)"}
                >{l.label}</a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
