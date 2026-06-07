"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [color, setColor] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!url.trim()) return;
    setGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(url, {
        width: size,
        color: { dark: color, light: bg },
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      setQrDataUrl(dataUrl);
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  useEffect(() => {
    if (url) {
      const timer = setTimeout(generate, 600);
      return () => clearTimeout(timer);
    }
  }, [url, size, color, bg]);

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 500, height: 500, background: 'rgba(124,107,255,0.05)', top: -100, left: -100 }} />
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7070a0' }}>
          <Link href="/" style={{ color: '#7070a0', textDecoration: 'none' }}>Home</Link>
          <span>→</span>
          <span style={{ color: '#7c6bff' }}>QR Code Generator</span>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
          QR Code Generator
        </h1>
        <p style={{ color: '#7070a0', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          Generate a QR code for any URL, text, or link — free and instant.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left: inputs */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#7070a0', fontWeight: 500, display: 'block', marginBottom: '8px' }}>URL OR TEXT</label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://snappyfile.com"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '10px',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: '#f0f0f8', fontSize: '15px', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,255,176,0.4)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#7070a0', fontWeight: 500, display: 'block', marginBottom: '8px' }}>SIZE: {size}px</label>
              <input type="range" min="128" max="512" step="32" value={size}
                onChange={e => setSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4fffb0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#7070a0', fontWeight: 500, display: 'block', marginBottom: '8px' }}>QR COLOR</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '28px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
                  <span style={{ fontSize: '13px', color: '#f0f0f8' }}>{color}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#7070a0', fontWeight: 500, display: 'block', marginBottom: '8px' }}>BACKGROUND</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                  <input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: '28px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
                  <span style={{ fontSize: '13px', color: '#f0f0f8' }}>{bg}</span>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={generate} disabled={!url.trim() || generating} style={{ width: '100%', opacity: !url.trim() ? 0.5 : 1 }}>
              {generating ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>

          {/* Right: preview */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px',
              padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: '280px'
            }}>
              {qrDataUrl ? (
                <div>
                  <img src={qrDataUrl} alt="QR Code" style={{ borderRadius: '8px', maxWidth: '100%' }} />
                  <a href={qrDataUrl} download="snappyfile-qr.png" style={{ display: 'block', marginTop: '16px' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>Download PNG</button>
                  </a>
                </div>
              ) : (
                <div style={{ color: '#7070a0', fontSize: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>⬜</div>
                  Enter a URL to generate your QR code
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
