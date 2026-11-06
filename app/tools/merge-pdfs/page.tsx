"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import ToolPage from "../../components/ToolPage";
import styles from "../../components/ToolPage.module.css";
import { downloadFile } from "../../../lib/download-file";

export default function MergePdfs() {
  const nextId = useRef(0);
  const [files, setFiles] = useState<{ id: number; file: File }[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");

  function move(index: number, offset: number) {
    setFiles(current => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }

  async function merge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (merging || files.length < 2) return;
    setMerging(true);
    setError("");
    let currentFile = "";
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        currentFile = file.name;
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        for (const page of pages) merged.addPage(page);
      }
      currentFile = "";
      const bytes = await merged.save();
      downloadFile(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "merged.pdf");
    } catch {
      setError(currentFile
        ? `Could not read “${currentFile}”. Check that it opens and is free of password protection.`
        : "Could not save the merged PDF. Try fewer or smaller files.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <ToolPage title="Merge PDFs" description="Choose at least two PDFs, put them in order, and download a single file. Your PDFs stay in your browser.">
      <form className={styles.form} onSubmit={merge}>
        <label>Add PDF files
          <input type="file" multiple accept=".pdf,application/pdf" disabled={merging} onChange={event => {
            const selected = Array.from(event.currentTarget.files ?? [], file => ({ id: nextId.current++, file }));
            setFiles(current => [...current, ...selected]);
            setError("");
            event.currentTarget.value = "";
          }} />
        </label>
        {files.length > 0 && <ol className={styles.files}>
          {files.map(({ id, file }, index) => (
            <li key={id}>
              {file.name}
              <div className={styles.row}>
                <button type="button" className="btn-secondary" disabled={merging || index === 0}
                  aria-label={`Move ${file.name} up`} onClick={() => move(index, -1)}>↑ Up</button>
                <button type="button" className="btn-secondary" disabled={merging || index === files.length - 1}
                  aria-label={`Move ${file.name} down`} onClick={() => move(index, 1)}>↓ Down</button>
                <button type="button" className="btn-secondary" disabled={merging}
                  aria-label={`Remove ${file.name}`} onClick={() => {
                    setFiles(current => current.filter(entry => entry.id !== id));
                    setError("");
                  }}>Remove</button>
              </div>
            </li>
          ))}
        </ol>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div><button className="btn-primary" disabled={merging || files.length < 2}>
          {merging ? "Merging…" : "Merge and download"}
        </button></div>
      </form>
    </ToolPage>
  );
}
