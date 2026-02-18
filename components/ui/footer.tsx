export default function Footer() {
  return (
    <footer className="border-t border-gray-200" style={{ marginTop: "5vh" }}>
      <div
        className="mx-auto flex flex-col sm:flex-row items-center justify-between"
        style={{ width: "92vw", maxWidth: 860, padding: "2.5vh 2vw", gap: "1.5vh" }}
      >
        <span className="text-gray-400 text-center sm:text-left" style={{ fontSize: "clamp(9px,0.8vw,11px)" }}>
          © 2026 Public Grievance Portal. All rights reserved.
        </span>

        <div className="flex items-center flex-wrap justify-center" style={{ gap: "2vw" }}>
          {["Privacy Policy", "Terms of Service", "Contact Support"].map((link) => (
            <a key={link} href="#" className="text-gray-500 hover:text-gray-700" style={{ fontSize: "clamp(9px,0.8vw,11px)" }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
