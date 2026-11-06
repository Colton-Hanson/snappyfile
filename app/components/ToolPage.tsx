import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import styles from "./ToolPage.module.css";

export default function ToolPage({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div className={styles.page}>
        <Link className={styles.back} href="/#tools">← All tools</Link>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={`card ${styles.panel}`}>{children}</div>
      </div>
    </main>
  );
}
