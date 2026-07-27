"use client";
import { useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCENT = "#ffb84f";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | null) => {
    setError("");
    setDownloadUrl("");
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setError("File exceeds 100MB limit");
      setFile(null);
      return;
    }
    setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.downloadUrl) setDownloadUrl(data.downloadUrl);
      else setError(data.error || "Something went wrong. Try again.");
    } catch {
      setError("Failed to upload file. Please try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 500, height: 500, background: 'rgba(255,184,79,0.05)', top: -100, right: -100 }} />
      <Navbar />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7070a0' }}>
          <Link href="/" style={{ color: '#7070a0', textDecoration: 'none' }}>Home</Link>
          <span>→</span>
          <span style={{ color: ACCENT }}>File Upload</span>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
          File Upload
        </h1>
        <p style={{ color: '#7070a0', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          Upload any file and get a shareable link — expires in 24 hours, max 100MB.
        </p>

        <div
          className={`drop-zone${dragActive ? ' active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => {
            e.preventDefault();
            setDragActive(false);
            pickFile(e.dataTransfer.files[0] ?? null);
          }}
          style={{ padding: '48px 24px', textAlign: 'center', marginBottom: '16px' }}
        >
          <input
            ref={inputRef}
            type="file"
            onChange={e => pickFile(e.target.files?.[0] ?? null)}
            style={{ display: 'none' }}
          />
          {file ? (
            <>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{file.name}</div>
              <div style={{ fontSize: '13px', color: '#7070a0' }}>{formatSize(file.size)}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Drop a file here or click to browse</div>
              <div style={{ fontSize: '13px', color: '#7070a0' }}>Any file type, up to 100MB</div>
            </>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={upload}
          disabled={!file || loading}
          style={{ width: '100%', background: ACCENT, opacity: !file ? 0.5 : 1, marginBottom: '16px' }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {error && <div style={{ color: '#ff6b9d', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

        {downloadUrl && (
          <div style={{
            padding: '20px', background: 'rgba(255,184,79,0.05)',
            border: '1px solid rgba(255,184,79,0.2)', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', color: '#7070a0', marginBottom: '4px' }}>YOUR DOWNLOAD LINK</div>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none', wordBreak: 'break-all' }}>
                {downloadUrl}
              </a>
            </div>
            <button className="btn-primary" onClick={copy} style={{ background: copied ? '#4fffb0' : ACCENT, whiteSpace: 'nowrap' }}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        )}

        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[['⚡', 'Instant', 'Links ready in seconds'], ['🔒', 'Private', 'Only people with the link can access it'], ['⏱️', '24 Hours', 'Files auto-expire after a day']].map(([icon, title, desc]) => (
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
