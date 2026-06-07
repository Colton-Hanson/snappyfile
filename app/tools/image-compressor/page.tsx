"use client";
import { useState, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

interface ImageResult {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
}

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(82);
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "webp">("jpeg");
  const [dragging, setDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [results, setResults] = useState<ImageResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
    setResults([]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const compressFiles = async () => {
    setCompressing(true);
    const out: ImageResult[] = [];

    for (const file of files) {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), `image/${outputFormat}`, quality / 100)
      );

      const ext = outputFormat === "jpeg" ? "jpg" : "webp";
      const baseName = file.name.replace(/\.[^.]+$/, "");

      out.push({
        name: `${baseName}-compressed.${ext}`,
        originalSize: file.size,
        compressedSize: blob.size,
        url: URL.createObjectURL(blob),
      });

      URL.revokeObjectURL(objectUrl);
    }

    setResults(out);
    setCompressing(false);
  };

  const totalOriginal = results.reduce((a, r) => a + r.originalSize, 0);
  const totalCompressed = results.reduce((a, r) => a + r.compressedSize, 0);
  const overallSavings = totalOriginal > 0
    ? Math.round((1 - totalCompressed / totalOriginal) * 100)
    : 0;

  const qualityColor =
    quality >= 75 ? "#4fffb0" : quality >= 45 ? "#f0f0f8" : "#ff6b9d";

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <div
        className="gradient-orb"
        style={{
          width: 500,
          height: 500,
          background: "rgba(79,255,176,0.05)",
          top: -100,
          right: -100,
        }}
      />
      <Navbar />

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "100px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#7070a0",
          }}
        >
          <Link href="/" style={{ color: "#7070a0", textDecoration: "none" }}>
            Home
          </Link>
          <span>→</span>
          <span style={{ color: "#4fffb0" }}>Image Compressor</span>
        </div>

        <div className="fade-up">
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              marginBottom: "12px",
            }}
          >
            Image Compressor
          </h1>
          <p
            style={{
              color: "#7070a0",
              fontSize: "16px",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Compress images instantly in your browser. Reduce file sizes without
            uploading anything to a server.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone ${dragging ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{ padding: "56px 24px", textAlign: "center", marginBottom: "24px" }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗜️</div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "6px",
              fontFamily: "Syne, sans-serif",
            }}
          >
            Drop images here
          </div>
          <div style={{ fontSize: "13px", color: "#7070a0" }}>
            or click to browse — PNG, JPG, WEBP supported
          </div>
        </div>

        {/* Controls + file list */}
        {files.length > 0 && (
          <div className="fade-up">
            {/* Output format */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  color: "#7070a0",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "10px",
                  letterSpacing: "0.05em",
                }}
              >
                OUTPUT FORMAT
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["jpeg", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setOutputFormat(fmt);
                      setResults([]);
                    }}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: "13px",
                      background:
                        outputFormat === fmt ? "#4fffb0" : "var(--bg2)",
                      color:
                        outputFormat === fmt ? "#0a0a0f" : "#7070a0",
                      outline:
                        outputFormat === fmt
                          ? "none"
                          : "1px solid var(--border)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    color: "#7070a0",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  QUALITY
                </label>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "Syne, sans-serif",
                    color: qualityColor,
                    transition: "color 0.2s ease",
                  }}
                >
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  setResults([]);
                }}
                style={{
                  width: "100%",
                  accentColor: "#4fffb0",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#7070a0",
                  marginTop: "6px",
                }}
              >
                <span>Smallest file</span>
                <span>Best quality</span>
              </div>
            </div>

            {/* File list */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "#7070a0",
                  marginBottom: "10px",
                }}
              >
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </div>
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--bg2)",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#f0f0f8",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: "12px",
                    }}
                  >
                    {f.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#7070a0" }}>
                      {formatSize(f.size)}
                    </span>
                    <button
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, j) => j !== i));
                        setResults([]);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7070a0",
                        cursor: "pointer",
                        fontSize: "18px",
                        lineHeight: 1,
                        padding: "0 2px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={compressFiles}
              disabled={compressing}
              style={{ width: "100%", opacity: compressing ? 0.7 : 1 }}
            >
              {compressing
                ? "Compressing..."
                : `Compress ${files.length > 1 ? `${files.length} Images` : "Image"}`}
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ marginTop: "32px" }} className="fade-up">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#4fffb0",
                  fontWeight: 600,
                }}
              >
                ✓ Compression complete!
              </div>
              {overallSavings > 0 && (
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "Syne, sans-serif",
                    background: "rgba(79,255,176,0.1)",
                    color: "#4fffb0",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    border: "1px solid rgba(79,255,176,0.2)",
                  }}
                >
                  {overallSavings}% smaller overall
                </div>
              )}
            </div>

            {results.map((r, i) => {
              const reduction = Math.round(
                (1 - r.compressedSize / r.originalSize) * 100
              );
              return (
                <div
                  key={i}
                  style={{
                    padding: "16px",
                    background: "rgba(79,255,176,0.04)",
                    border: "1px solid rgba(79,255,176,0.15)",
                    borderRadius: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#f0f0f8",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginRight: "12px",
                      }}
                    >
                      {r.name}
                    </span>
                    <a href={r.url} download={r.name}>
                      <button
                        className="btn-primary"
                        style={{ padding: "8px 20px", fontSize: "13px" }}
                      >
                        Download
                      </button>
                    </a>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#7070a0" }}>Original </span>
                      <span style={{ color: "#f0f0f8" }}>
                        {formatSize(r.originalSize)}
                      </span>
                    </div>
                    <span style={{ color: "#7070a0" }}>→</span>
                    <div>
                      <span style={{ color: "#7070a0" }}>Compressed </span>
                      <span style={{ color: "#4fffb0", fontWeight: 600 }}>
                        {formatSize(r.compressedSize)}
                      </span>
                    </div>
                    {reduction !== 0 && (
                      <div style={{ marginLeft: "auto" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontFamily: "Syne, sans-serif",
                            color: reduction > 0 ? "#4fffb0" : "#ff6b9d",
                          }}
                        >
                          {reduction > 0 ? `−${reduction}%` : `+${Math.abs(reduction)}%`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div
          style={{
            marginTop: "48px",
            padding: "24px",
            background: "var(--bg2)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
            🔒 Your files never leave your device
          </h3>
          <p style={{ fontSize: "14px", color: "#7070a0", lineHeight: 1.6 }}>
            All compression happens directly in your browser using the Canvas API.
            No files are uploaded to any server, ever. Fast, private, and completely
            secure.
          </p>
        </div>
      </div>
    </main>
  );
}
