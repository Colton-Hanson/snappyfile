"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState(24);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shorten = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, expiry }),
      });
      const data = await res.json();
      if (data.short) setShortUrl(data.short);
      else setError("Something went wrong. Try again.");
    } catch {
      setError("Failed to shorten URL. Please try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 500, height: 500, background: 'rgba(255,107,157,0.05)', top: -100, right: -100 }} />
      <Navbar />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7070a0' }}>
          <Link href="/" style={{ color: '#7070a0', textDecoration: 'none' }}>Home</Link>
          <span>→</span>
          <span style={{ color: '#ff6b9d' }}>URL Shortener</span>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
          URL Shortener
        </h1>
        <p style={{ color: '#7070a0', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          Shorten any long URL into a clean, shareable link — free and instant.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && shorten()}
            placeholder="https://your-very-long-url.com/goes/here"
            style={{
              flex: 1, padding: '14px 16px', borderRadius: '10px',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              color: '#f0f0f8', fontSize: '15px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,157,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            className="btn-primary"
            onClick={shorten}
            disabled={!url.trim() || loading}
            style={{ whiteSpace: 'nowrap', background: '#ff6b9d', opacity: !url.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#7070a0' }}>Expires in:</span>
          {([24, 48, 72] as const).map(h => (
            <button
              key={h}
              onClick={() => setExpiry(h)}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                border: expiry === h ? '1px solid rgba(255,107,157,0.5)' : '1px solid var(--border)',
                background: expiry === h ? 'rgba(255,107,157,0.1)' : 'var(--bg2)',
                color: expiry === h ? '#ff6b9d' : '#7070a0',
                cursor: 'pointer',
              }}
            >
              {h}h
            </button>
          ))}
        </div>

        {error && <div style={{ color: '#ff6b9d', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

        {shortUrl && (
          <div style={{
            padding: '20px', background: 'rgba(255,107,157,0.05)',
            border: '1px solid rgba(255,107,157,0.2)', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#7070a0', marginBottom: '4px' }}>YOUR SHORT LINK</div>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b9d', fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none' }}>
                {shortUrl}
              </a>
            </div>
            <button className="btn-primary" onClick={copy} style={{ background: copied ? '#4fffb0' : '#ff6b9d', whiteSpace: 'nowrap' }}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        )}

        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[['⚡', 'Instant', 'Links shortened in milliseconds'], ['🔒', 'Safe', 'No tracking, no spam'], ['∞', 'Unlimited', 'Shorten as many as you want']].map(([icon, title, desc]) => (
            <div key={title} style={{ padding: '20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#7070a0' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
