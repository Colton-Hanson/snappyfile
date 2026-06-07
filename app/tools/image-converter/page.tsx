"use client";
import { useState, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const formats = ["PNG", "JPG", "WEBP", "BMP", "GIF"];

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState("PNG");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState<{ name: string; url: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imgs = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...imgs]);
    setConverted([]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const convertFiles = async () => {
    setConverting(true);
    const results: { name: string; url: string }[] = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>(resolve => { img.onload = () => resolve(); img.src = url; });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      if (targetFormat === "JPG") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeMap: Record<string, string> = {
        PNG: "image/png", JPG: "image/jpeg",
        WEBP: "image/webp", BMP: "image/bmp", GIF: "image/gif"
      };

      const blob = await new Promise<Blob>(resolve =>
        canvas.toBlob(b => resolve(b!), mimeMap[targetFormat], 0.92)
      );

      const outUrl = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      results.push({ name: `${baseName}.${targetFormat.toLowerCase()}`, url: outUrl });
      URL.revokeObjectURL(url);
    }

    setConverted(results);
    setConverting(false);
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 500, height: 500, background: 'rgba(79,255,176,0.05)', top: -100, right: -100 }} />
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7070a0' }}>
          <Link href="/" style={{ color: '#7070a0', textDecoration: 'none' }}>Home</Link>
          <span>→</span>
          <span style={{ color: '#4fffb0' }}>Image Converter</span>
        </div>

        <div className="fade-up">
          <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
            Image Converter
          </h1>
          <p style={{ color: '#7070a0', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
            Convert images between PNG, JPG, WEBP, BMP and GIF — free, instant, right in your browser.
          </p>
        </div>

        {/* Format selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', color: '#7070a0', fontWeight: 500, display: 'block', marginBottom: '10px' }}>
            CONVERT TO
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {formats.map(f => (
              <button key={f} onClick={() => setTargetFormat(f)} style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
                background: targetFormat === f ? '#4fffb0' : 'var(--bg2)',
                color: targetFormat === f ? '#0a0a0f' : '#7070a0',
                outline: targetFormat === f ? "none" : "1px solid var(--border)",
                transition: 'all 0.15s ease'
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone ${dragging ? 'active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{ padding: '56px 24px', textAlign: 'center', marginBottom: '24px' }}
        >
          <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🖼️</div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', fontFamily: 'Syne, sans-serif' }}>
            Drop images here
          </div>
          <div style={{ fontSize: '13px', color: '#7070a0' }}>or click to browse — PNG, JPG, WEBP, HEIC supported</div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#7070a0', marginBottom: '10px' }}>{files.length} file{files.length > 1 ? 's' : ''} selected</div>
            {files.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'var(--bg2)', borderRadius: '10px',
                marginBottom: '8px', border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '14px', color: '#f0f0f8' }}>{f.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#7070a0' }}>{(f.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{
                    background: 'none', border: 'none', color: '#7070a0', cursor: 'pointer', fontSize: '16px', lineHeight: 1
                  }}>×</button>
                </div>
              </div>
            ))}

            <button
              className="btn-primary"
              onClick={convertFiles}
              disabled={converting}
              style={{ width: '100%', marginTop: '8px', opacity: converting ? 0.7 : 1 }}
            >
              {converting ? 'Converting...' : `Convert to ${targetFormat}`}
            </button>
          </div>
        )}

        {/* Results */}
        {converted.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '13px', color: '#4fffb0', marginBottom: '12px', fontWeight: 600 }}>
              ✓ Conversion complete!
            </div>
            {converted.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'rgba(79,255,176,0.05)',
                border: '1px solid rgba(79,255,176,0.2)', borderRadius: '10px', marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px' }}>{c.name}</span>
                <a href={c.url} download={c.name}>
                  <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>Download</button>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: '48px', padding: '24px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>🔒 Your files never leave your device</h3>
          <p style={{ fontSize: '14px', color: '#7070a0', lineHeight: 1.6 }}>
            All conversions happen directly in your browser. No files are uploaded to any server, ever. Fast, private, and secure.
          </p>
        </div>
      </div>
    </main>
  );
}
