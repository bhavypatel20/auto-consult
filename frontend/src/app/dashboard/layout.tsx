"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CarFront, LayoutDashboard, Users, Receipt, FileText } from "lucide-react";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand} style={{ gap: '12px', fontSize: '1.2rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Shakti Logo" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 800 }}>Shakti</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Auto Consult</div>
          </div>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navLink} ${pathname === "/dashboard" ? styles.active : ""}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/inventory" className={`${styles.navLink} ${pathname.includes("/inventory") ? styles.active : ""}`}>
            <CarFront size={20} /> Inventory
          </Link>
          <Link href="/dashboard/customers" className={`${styles.navLink} ${pathname.includes("/customers") ? styles.active : ""}`}>
            <Users size={20} /> Customers
          </Link>
          <Link href="/dashboard/deals" className={`${styles.navLink} ${pathname.includes("/deals") ? styles.active : ""}`}>
            <Receipt size={20} /> Deals & Expenses
          </Link>
          <Link href="/dashboard/analytics" className={`${styles.navLink} ${pathname.includes("/analytics") ? styles.active : ""}`}>
            <LayoutDashboard size={20} /> Advanced Analytics
          </Link>
          <Link href="/dashboard/documents" className={`${styles.navLink} ${pathname.includes("/documents") ? styles.active : ""}`}>
            <FileText size={20} /> Documents
          </Link>
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <div /> {/* Spacer */}
          <UserButton />
        </header>
        {children}
      </main>
    </div>
  );
}
