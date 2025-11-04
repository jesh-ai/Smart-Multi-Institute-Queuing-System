"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navbar() {
  const pathname = usePathname() || "/";

  const links = [
    {
      href: "/",
      label: (
        <>
          <img src="/icons/dashboard.svg" alt="Dashboard" className="nav-link-icon" />
          Dashboard
        </>
      ),
    },
    {
      href: "/system",
      label: (
        <>
          <img src="/icons/system.svg" alt="System" className="nav-link-icon" />
          System Management
        </>
      ),
    },
    {
      href: "/queue",
      label: (
        <>
          <img src="/icons/queue.svg" alt="Queue" className="nav-link-icon" />
          Queue Management
        </>
      ),
    },
    {
      href: "/settings",
      label: (
        <>
          <img src="/icons/settings.svg" alt="Settings" className="nav-link-icon" />
          Settings
        </>
      ),
    },
  ];

  return (
    <nav className="navbar">
      <h1 className="nav-title">
        <img src="/icons/monitor.svg" alt="Server Icon" className="nav-icon" />
        Server Admin
      </h1>

      <div className="nav-links" role="navigation" aria-label="Main">
        {links.map((l) => {
          const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
          const cls = isActive ? "nav-link active" : "nav-link";

          return (
            <Link
              key={l.href}
              href={l.href}
              className={cls}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();       // Prevent Next.js SPA navigation
                  window.location.href = l.href; // Force full page reload
                }
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
