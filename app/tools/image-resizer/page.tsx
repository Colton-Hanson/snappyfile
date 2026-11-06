"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import ToolPage from "../../components/ToolPage";
import styles from "../../components/ToolPage.module.css";
import { downloadFile } from "../../../lib/download-file";

const maxSide = 8192;
const maxPixels = 16_777_216;

export default function ImageResizer() {
  const image = useRef<HTMLImageElement | null>(null);
  const selection = useRef(0);
  const [filename, setFilename] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [error, setError] = useState("");

  async function selectImage(file?: File) {
    const id = ++selection.current;
    image.current = null;
    setFilename("");
    setWidth("");
    setHeight("");
    setError("");
    setLoading(Boolean(file));
    if (!file) return;

    const url = URL.createObjectURL(file);
    try {
      const decoded = new Image();
      decoded.src = url;
      await decoded.decode();
      if (id !== selection.current) return;
      image.current = decoded;
      setFilename(file.name);
      setWidth(String(decoded.naturalWidth));
      setHeight(String(decoded.naturalHeight));
    } catch {
      if (id === selection.current) setError("Could not open that image. Try a PNG, JPEG, or WebP.");
    } finally {
      URL.revokeObjectURL(url);
      if (id === selection.current) setLoading(false);
    }
  }

  async function resize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const source = image.current;
    if (!source || resizing) return;
    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (
      ![targetWidth, targetHeight].every(side => Number.isInteger(side) && side >= 1 && side <= maxSide) ||
      targetWidth * targetHeight > maxPixels
    ) {
      setError("Use dimensions between 1 and 8,192 pixels and stay under 16.8 megapixels total.");
      return;
    }

    setError("");
    setResizing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.imageSmoothingQuality = "high";
      context.drawImage(source, 0, 0, targetWidth, targetHeight);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Image encoding failed");
      downloadFile(blob, `${filename.replace(/\.[^.]+$/, "")}-${targetWidth}x${targetHeight}.png`);
    } catch {
      setError("Could not resize this image. Try smaller dimensions.");
    } finally {
      setResizing(false);
    }
  }

  return (
    <ToolPage title="Image Resizer" description="Set the exact pixel dimensions and download a PNG. Your image stays in your browser.">
      <form className={styles.form} onSubmit={resize}>
        <label>
          Image
          <input type="file" accept="image/png,image/jpeg,image/webp" disabled={resizing}
            onChange={event => void selectImage(event.currentTarget.files?.[0])} />
        </label>
        <div className={styles.row}>
          <label>Width (px)
            <input type="number" required min={1} max={maxSide} value={width}
              onChange={event => setWidth(event.target.value)} />
          </label>
          <label>Height (px)
            <input type="number" required min={1} max={maxSide} value={height}
              onChange={event => setHeight(event.target.value)} />
          </label>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div><button className="btn-primary" disabled={!filename || loading || resizing}>
          {loading ? "Opening image…" : resizing ? "Resizing…" : "Resize and download"}
        </button></div>
      </form>
    </ToolPage>
  );
}
