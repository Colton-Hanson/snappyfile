import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: 'rgba(10,10,15,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: '#4fffb0', letterSpacing: '-0.5px' }}>
          Snappy<span style={{ color: '#f0f0f8' }}>File</span>
        </span>
      </Link>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/tools/image-converter" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#7070a0', fontSize: '14px', fontWeight: 500, padding: '6px 12px', borderRadius: '8px' }}>Converter</span>
        </Link>
        <Link href="/tools/image-compressor" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#7070a0', fontSize: '14px', fontWeight: 500, padding: '6px 12px', borderRadius: '8px' }}>Compressor</span>
        </Link>
        <Link href="/tools/qr-generator" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#7070a0', fontSize: '14px', fontWeight: 500, padding: '6px 12px', borderRadius: '8px' }}>Link Tools</span>
        </Link>
        <Link href="/tools/url-shortener" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#7070a0', fontSize: '14px', fontWeight: 500, padding: '6px 12px', borderRadius: '8px' }}>URL Shortener</span>
        </Link>
      </div>
    </nav>
  );
}
