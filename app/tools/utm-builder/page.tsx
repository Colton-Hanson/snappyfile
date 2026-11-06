"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import ToolPage from "../../components/ToolPage";
import styles from "../../components/ToolPage.module.css";

const fields = [
  { key: "utm_source", label: "Source", example: "newsletter", required: true },
  { key: "utm_medium", label: "Medium", example: "email", required: true },
  { key: "utm_campaign", label: "Campaign", example: "spring-launch", required: true },
  { key: "utm_term", label: "Term", example: "running shoes", required: false },
  { key: "utm_content", label: "Content", example: "header-link", required: false },
];

export default function UtmBuilder() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  function buildUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let url: URL;
    try {
      url = new URL(String(form.get("url")).trim());
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch {
      setError("Enter a full website URL starting with https:// or http://.");
      return;
    }

    for (const field of fields) {
      const value = String(form.get(field.key)).trim();
      if (field.required && !value) {
        setError(`Enter a value for ${field.label.toLowerCase()}.`);
        return;
      }
      if (value) url.searchParams.set(field.key, value);
    }
    setError("");
    setResult(url.href);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopyMessage("Copied.");
    } catch {
      setCopyMessage("Select the campaign URL and copy it manually.");
    }
  }

  return (
    <ToolPage title="UTM Builder" description="Add campaign tracking to a link. Existing query parameters and anchors are preserved.">
      <form className={styles.form} onSubmit={buildUrl} onChange={() => {
        setResult("");
        setError("");
        setCopyMessage("");
      }}>
        <label>Website URL
          <input name="url" type="url" required placeholder="https://example.com/page" />
        </label>
        {fields.map(field => (
          <label key={field.key}>{field.label}{field.required ? "" : " (optional)"}
            <input name={field.key} required={field.required} placeholder={field.example} />
          </label>
        ))}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div><button className="btn-primary">Build URL</button></div>
        {result && <>
          <label>Campaign URL
            <input readOnly value={result} onFocus={event => event.currentTarget.select()} />
          </label>
          <div><button type="button" className="btn-secondary" onClick={copy}>Copy URL</button></div>
          <p role="status">{copyMessage}</p>
        </>}
      </form>
    </ToolPage>
  );
}
