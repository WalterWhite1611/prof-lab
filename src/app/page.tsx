"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// ---------- Minimal design tokens (tweak to match professor's brand) ----------
const brand = {
  primary: "#1e40af", // indigo-800
  primaryAccent: "#3b82f6", // blue-500
  bg: "#0b1020",
  card: "#121a2a",
  text: "#e5e7eb",
  subtle: "#9ca3af",
};

// Framer Motion helpers
const container = (stagger = 0.04) => ({
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: stagger } },
});
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

// ---------- Content data (replace with real content / JSON later) ----------
const RESEARCH_AREAS = [
  { title: "Condensed-Matter Physics", desc: "Structure–property relations in functional materials; defects, doping, interfaces.", icon: "🧪" },
  { title: "2D Materials & Nanostructures", desc: "Graphene-like systems; growth, characterization, transport & optics.", icon: "🧩" },
  { title: "Materials for Devices", desc: "Thin films, oxide semiconductors, optoelectronic & photonic applications.", icon: "💡" },
  { title: "Theory–Experiment Bridge", desc: "Data-driven modeling, DFT-assisted insights, and experimental validation.", icon: "🔗" },
];

const PEOPLE = [
  {
    name: "Prof. Debnarayan Jana",
    role: "PI",
    field: "Condensed-Matter Physics & Materials Science",
    email: "email@example.edu", // put the public email you wish to show
    img: "",                    // e.g. "/img/jana.jpg" after adding to public/img
    links: {
      scholar: "https://scholar.google.com/citations?user=43SR0GsAAAAJ&hl=en",
      orcid: "https://orcid.org/", // replace if you want to show ORCID
    }
  },
  { name: "Dr. B. Senior", role: "Postdoc", field: "Oxide thin films", email: "b@example.edu", img: "", links: { github: "#" } },
  { name: "C. Student", role: "PhD", field: "2D materials growth", email: "c@example.edu", img: "", links: { linkedin: "#" } },
  { name: "D. Alum", role: "Alumni", field: "Device physics", email: "d@example.com", img: "", links: { website: "#" }, year: 2024 },
];

const COURSES = [
  { code: "PHYS 6xx", title: "Advanced Condensed-Matter", term: "Spring 2025", syllabus: "#" },
  { code: "PHYS 7xx", title: "Functional Materials", term: "Fall 2024", syllabus: "#" },
];

// Publications demo data (keep this for GitHub Pages; swap to API later)
const DEMO_PUBS = [
  { id: "1", title: "Role of Defects in Tailoring Structural, Electrical and Optical Properties of ZnO", authors: ["S. Dutta","S. Chattopadhyay","A. Sarkar","M. Chakrabarti","D. Sanyal","Debnarayan Jana"], venue: "Progress in Materials Science", year: 2009, doi: "10.1016/j.pmatsci.2008.07.002", url: "#" },
  { id: "2", title: "Optical/electrical behavior in oxide thin films", authors: ["A. Researcher","Debnarayan Jana"], venue: "Journal Example", year: 2014, doi: "10.xxxx/xxxxx" },
  { id: "3", title: "2D materials growth and transport", authors: ["Debnarayan Jana"], venue: "Conference Example", year: 2018, url: "#" },
];

// ---------- Utility components ----------
type SectionProps = { id: string; title: string; subtitle?: string; children: React.ReactNode };
const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => (
  <section id={id} style={{ padding: "80px 0", scrollMarginTop: 90 }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
      <motion.h2 variants={item} style={{ fontSize: 32, fontWeight: 800, color: brand.text }}>
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={item} style={{ color: brand.subtle, marginTop: 6, fontSize: 16 }}>{subtitle}</motion.p>
      )}
      <motion.div variants={container(0.06)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} style={{ marginTop: 24 }}>
        {children}
      </motion.div>
    </div>
  </section>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${brand.card}, rgba(18,26,42,0.6))`,
      border: `1px solid rgba(255,255,255,0.06)`,
      borderRadius: 16,
      padding: 18,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      backdropFilter: "blur(6px)",
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: "inline-block", padding: "4px 10px", borderRadius: 999,
    background: "rgba(59,130,246,0.12)", color: brand.primaryAccent, fontSize: 12, fontWeight: 600,
  }}>{children}</span>
);

// ---------- Navbar with progress indicator ----------
function Navbar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.3 });

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", backdropFilter: "blur(10px)",
        background: "rgba(11,16,32,0.75)", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <a href="#home" style={{ fontWeight: 800, letterSpacing: 0.5, color: brand.text }}>Prof. Debnarayan Jana Lab</a>
        <nav style={{ display: "flex", gap: 18 }}>
          {[
            ["About", "about"],
            ["Research", "research"],
            ["Group", "group"],
            ["Teaching", "teaching"],
            ["Publications", "publications"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{ color: brand.subtle, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </div>
      <motion.div style={{ height: 3, background: brand.primaryAccent, scaleX: width, transformOrigin: "0% 50%" }} />
    </div>
  );
}

// ---------- Hero ----------
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <header id="home" style={{ position: "relative", overflow: "hidden", background: brand.bg }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(1000px 500px at 10% -10%, rgba(59,130,246,0.12), transparent),
                     radial-gradient(800px 500px at 90% 0%, rgba(16,185,129,0.10), transparent)`,
        filter: "blur(2px)",
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 20px 80px" }}>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 900, color: brand.text }}>
          Discover. Compute. <span style={{ color: brand.primaryAccent }}>Translate</span> Physics.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ marginTop: 14, color: brand.subtle, maxWidth: 720, fontSize: 18 }}>
          We explore materials and devices across growth, characterization, transport, and theory—linking fundamentals to applications.
        </motion.p>
        <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
          <a href="#publications" style={{
            background: brand.primaryAccent, color: "#0b1020", fontWeight: 800,
            padding: "12px 16px", borderRadius: 12, textDecoration: "none",
          }}>View Publications</a>
          <a href="#contact" style={{
            background: "transparent", color: brand.text, border: `1px solid ${brand.subtle}`,
            padding: "12px 16px", borderRadius: 12, textDecoration: "none",
          }}>Contact</a>
        </div>
      </div>
      <motion.div style={{ position: "absolute", bottom: -80, left: "50%", width: 800, height: 160, translateX: "-50%", y, opacity: 0.8,
        background: `radial-gradient(closest-side, rgba(59,130,246,0.2), transparent)` }} />
    </header>
  );
}

// ---------- Research Areas ----------
function Research() {
  return (
    <Section id="research" title="Research Areas" subtitle="Current interests and directions.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {RESEARCH_AREAS.map((r) => (
          <motion.div key={r.title} variants={item}>
            <Card>
              <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
                <div style={{ fontSize: 24 }}>{r.icon}</div>
                <div>
                  <h3 style={{ margin: 0, color: brand.text, fontWeight: 700 }}>{r.title}</h3>
                  <p style={{ marginTop: 6, color: brand.subtle }}>{r.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Group ----------
function Group() {
  const [filter, setFilter] = useState("All");
  const roles = ["All", "PI", "Postdoc", "PhD", "Masters", "Alumni"];
  const people = useMemo(() => PEOPLE.filter(p => filter === "All" || p.role === filter), [filter]);

  return (
    <Section id="group" title="Group" subtitle="People make the lab.">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {roles.map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{
            padding: "8px 12px", borderRadius: 999, border: `1px solid ${brand.subtle}`,
            background: filter === r ? "rgba(59,130,246,0.18)" : "transparent",
            color: filter === r ? brand.primaryAccent : brand.text,
          }}>{r}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {people.map(p => (
          <motion.div key={p.name} variants={item}>
            <Card>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: "#1f2937" }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ margin: 0, color: brand.text }}>{p.name}</h3>
                    <Tag>{p.role}</Tag>
                  </div>
                  <p style={{ margin: "6px 0 0", color: brand.subtle }}>{p.field}</p>
                  {(p as any).year && <p style={{ margin: "6px 0 0", color: brand.subtle }}>Alumni • {(p as any).year}</p>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Teaching ----------
function Teaching() {
  return (
    <Section id="teaching" title="Teaching" subtitle="Courses recently taught or upcoming.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16 }}>
        {COURSES.map(c => (
          <motion.div key={c.code} variants={item}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: 0, color: brand.text }}>{c.code}: {c.title}</h3>
                  <p style={{ margin: "6px 0 0", color: brand.subtle }}>{c.term}</p>
                </div>
                <a href={c.syllabus} style={{ color: brand.primaryAccent, textDecoration: "none", fontWeight: 700 }}>Syllabus →</a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Publications (static for GitHub Pages; enable API fetch later) ----------
function Publications() {
  const [pubs, setPubs] = useState(DEMO_PUBS);
  const [q, setQ] = useState("");
  const [year, setYear] = useState("All");
  const [source] = useState("Google Scholar (mirrored manually)");

  // When you deploy on Vercel with Semantic Scholar API:
  // useEffect(() => {
  //   fetch("/api/publications").then(r => r.json()).then(d => setPubs(d.items));
  // }, []);

  const years = useMemo(() => ["All", ...Array.from(new Set(pubs.map(p => p.year))).sort((a, b) => Number(b) - Number(a))], [pubs]);
  const filtered = useMemo(() => pubs.filter(p => {
    const matchYear = year === "All" || String(p.year) === String(year);
    const hay = `${p.title} ${(p as any).authors?.join(" ") ?? ""} ${(p as any).venue ?? ""}`.toLowerCase();
    return matchYear && hay.includes(q.toLowerCase());
  }), [pubs, q, year]);

  return (
    <Section id="publications" title="Publications" subtitle={`Synced from ${source}.`}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search title/author/venue"
          style={{ flex: 1, minWidth: 240, background: brand.card, color: brand.text, border: `1px solid ${brand.subtle}`,
            borderRadius: 10, padding: "10px 12px" }} />
        <select value={year} onChange={e => setYear(e.target.value)}
          style={{ background: brand.card, color: brand.text, border: `1px solid ${brand.subtle}`,
            borderRadius: 10, padding: "10px 12px" }}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {filtered.map(p => (
          <motion.div key={p.id} variants={item}>
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Tag>{p.year}</Tag>
                    {(p as any).venue && <span style={{ color: brand.subtle, fontSize: 12 }}>{(p as any).venue}</span>}
                  </div>
                  <h3 style={{ margin: "6px 0 4px", color: brand.text }}>{p.title}</h3>
                  <p style={{ margin: 0, color: brand.subtle }}>{(p as any).authors?.join(", ")}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {(p as any).pdf && <a href={(p as any).pdf} style={linkBtnStyle as React.CSSProperties}>PDF</a>}
                  {(p as any).doi && <a href={`https://doi.org/${(p as any).doi}`} style={linkBtnStyle as React.CSSProperties}>DOI</a>}
                  {(p as any).url && <a href={(p as any).url} style={linkBtnStyle as React.CSSProperties}>Link</a>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <Card>
            <p style={{ margin: 0, color: brand.subtle }}>No publications match your filter.</p>
          </Card>
        )}
      </div>
    </Section>
  );
}

const linkBtnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: `1px solid ${brand.subtle}`,
  color: brand.text,
  textDecoration: "none",
};

// ---------- About ----------
function About() {
  return (
    <Section id="about" title="About the Professor" subtitle="Short bio and focus.">
      <Card>
        <p style={{ color: brand.text, margin: 0 }}>
          Prof. Debnarayan Jana’s group explores condensed-matter physics and materials science,
          spanning thin films, nanostructures, 2D materials, and structure–property relationships
          with applications in devices and photonics.
        </p>
      </Card>
    </Section>
  );
}

// ---------- Contact / Footer ----------
function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Get in touch.">
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h3 style={{ marginTop: 0, color: brand.text }}>Address</h3>
            <p style={{ marginTop: 6, color: brand.subtle }}>
              Department of Physics, University of Calcutta<br />
              Kolkata, India
            </p>
            <h3 style={{ marginBottom: 6, color: brand.text }}>Email</h3>
            <a href="mailto:email@example.edu" style={{ color: brand.primaryAccent, textDecoration: "none" }}>
              email@example.edu
            </a>
          </div>
          <div>
            <h3 style={{ marginTop: 0, color: brand.text }}>Links</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", color: brand.subtle }}>
              <li><a href="https://scholar.google.com/citations?user=43SR0GsAAAAJ&hl=en" style={{ color: brand.primaryAccent, textDecoration: "none" }}>Google Scholar</a></li>
              <li><a href="#" style={{ color: brand.primaryAccent, textDecoration: "none" }}>ORCID</a></li>
              <li><a href="#" style={{ color: brand.primaryAccent, textDecoration: "none" }}>GitHub</a></li>
            </ul>
          </div>
        </div>
      </Card>
      <p style={{ textAlign: "center", color: brand.subtle, marginTop: 18, fontSize: 12 }}>
        © {new Date().getFullYear()} Prof. Debnarayan Jana Lab • Built with Next.js + Framer Motion
      </p>
    </Section>
  );
}

// ---------- Root component ----------
function ProfessorLabSite() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = brand.bg;
    document.body.style.fontFamily =
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'";
    return () => {
      document.body.style.margin = "";
      document.body.style.background = "";
      document.body.style.fontFamily = "";
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Research />
      <Group />
      <Teaching />
      <Publications />
      <Contact />
    </div>
  );
}

// Next.js App Router expects a default export page component
export default function Page() {
  return <ProfessorLabSite />;
}
