import Link from "next/link";
import Navbar from "./components/Navbar";

const tools = [
  {
    category: "Image Tools",
    emoji: "🖼️",
    color: "#4fffb0",
    items: [
      { name: "Image Converter", desc: "PNG, JPG, WEBP, HEIC — any format", href: "/tools/image-converter", badge: "Popular", live: true },
      { name: "Image Compressor", desc: "Shrink file size without losing quality", href: "/tools/image-compressor", badge: "New", live: true },
      { name: "Image Resizer", desc: "Resize to exact dimensions instantly", href: null, badge: "Soon", live: false },
      { name: "Background Remover", desc: "Remove backgrounds in one click", href: null, badge: "Soon", live: false },
    ]
  },
  {
    category: "PDF Tools",
    emoji: "📄",
    color: "#7c6bff",
    items: [
      { name: "PDF to Word", desc: "Convert PDF to editable Word doc", href: null, badge: "Soon", live: false },
      { name: "Word to PDF", desc: "Convert Word documents to PDF", href: null, badge: "Soon", live: false },
      { name: "Merge PDFs", desc: "Combine multiple PDFs into one", href: null, badge: "Soon", live: false },
      { name: "Compress PDF", desc: "Reduce PDF file size fast", href: null, badge: "Soon", live: false },
    ]
  },
  {
    category: "Link Tools",
    emoji: "🔗",
    color: "#ff6b9d",
    items: [
      { name: "URL Shortener", desc: "Shorten any link instantly", href: "/tools/url-shortener", badge: "Popular", live: true },
      { name: "QR Code Generator", desc: "Generate QR codes for any URL", href: "/tools/qr-generator", badge: "Popular", live: true },
      { name: "Link Preview", desc: "See where a link goes before clicking", href: null, badge: "Soon", live: false },
      { name: "UTM Builder", desc: "Build tracking links for campaigns", href: null, badge: "Soon", live: false },
    ]
  }
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 600, height: 600, background: 'rgba(79,255,176,0.06)', top: -200, right: -200 }} />
      <div className="gradient-orb" style={{ width: 400, height: 400, background: 'rgba(124,107,255,0.06)', bottom: 200, left: -150 }} />
      <Navbar />

      <section style={{ padding: '160px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(79,255,176,0.08)', border: '1px solid rgba(79,255,176,0.2)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '28px'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fffb0', display: 'inline-block' }} />
          <span style={{ fontSize: '13px', color: '#4fffb0', fontWeight: 500 }}>Free. Fast. No signup required.</span>
        </div>

        <h1 className="fade-up-delay" style={{ fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, margin: '0 auto 24px', maxWidth: '800px' }}>
          The only file tool<br />
          <span style={{ color: '#4fffb0' }}>you'll ever need</span>
        </h1>

        <p className="fade-up-delay-2" style={{ fontSize: '18px', color: '#7070a0', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
          Convert images, compress PDFs, shorten links, generate QR codes — all in one place, all completely free.
        </p>

        <div className="fade-up-delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tools/image-converter">
            <button className="btn-primary">Start Converting</button>
          </Link>
          <Link href="#tools">
            <button className="btn-secondary">Browse All Tools</button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '64px', flexWrap: 'wrap' }}>
          {[['4', 'Live Tools'], ['0', 'Signup Required'], ['100%', 'Browser-Based']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f0f0f8' }}>{num}</div>
              <div style={{ fontSize: '13px', color: '#7070a0', fontWeight: 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" style={{ padding: '40px 24px 100px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {tools.map((group) => (
          <div key={group.category} style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px' }}>{group.emoji}</span>
              <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>{group.category}</h2>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {group.items.map((tool) => {
                const cardContent = (
                  <div className="card" style={{ padding: '24px', cursor: tool.live ? 'pointer' : 'default', position: 'relative', opacity: tool.live ? 1 : 0.5 }}>
                    <span style={{
                      position: 'absolute', top: '16px', right: '16px',
                      fontSize: '11px', fontWeight: 700, fontFamily: 'Syne, sans-serif',
                      color: tool.live ? group.color : '#7070a0',
                      background: tool.live ? `${group.color}15` : 'rgba(112,112,160,0.1)',
                      border: `1px solid ${tool.live ? `${group.color}30` : 'rgba(112,112,160,0.2)'}`,
                      borderRadius: '100px', padding: '2px 8px', letterSpacing: '0.5px'
                    }}>{tool.badge}</span>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px', fontFamily: 'Syne, sans-serif' }}>{tool.name}</div>
                    <div style={{ fontSize: '13px', color: '#7070a0', lineHeight: 1.5 }}>{tool.desc}</div>
                    <div style={{ marginTop: '16px', fontSize: '13px', color: tool.live ? group.color : '#7070a0', fontWeight: 600 }}>
                      {tool.live ? 'Use tool →' : 'Coming soon'}
                    </div>
                  </div>
                );
                return tool.href ? (
                  <Link key={tool.name} href={tool.href} style={{ textDecoration: 'none' }}>{cardContent}</Link>
                ) : (
                  <div key={tool.name}>{cardContent}</div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: '#7070a0', fontSize: '13px' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#4fffb0' }}>SnappyFile</span>
        {' '}— Free file & link tools for everyone. No signup. No nonsense.
      </footer>
    </main>
  );
}
