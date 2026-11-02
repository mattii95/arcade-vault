"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (name: "biblioteca" | "salon" | "login") =>
    name === "biblioteca"
      ? pathname === "/" || pathname.startsWith("/juegos")
      : pathname === `/${name}`;
  const cls = (name: "biblioteca" | "salon" | "login") => (active(name) ? "active" : "");
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo">
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          <Link href="/" className={cls("biblioteca")}>Biblioteca</Link>
          <Link href="/salon" className={cls("salon")}>Salón de la Fama</Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>
        <Link href="/login" className="btn auth-btn">Iniciar Sesión</Link>
        <button className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menú">≡</button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close}></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan mb-4 text-[11px]">MENÚ</div>
        <Link href="/" className={cls("biblioteca")} onClick={close}>Biblioteca</Link>
        <Link href="/salon" className={cls("salon")} onClick={close}>Salón de la Fama</Link>
        <Link href="/login" className={cls("login")} onClick={close}>Iniciar Sesión</Link>
        <div className="flex-1"></div>
        <div className="pixel text-[9px] tracking-[0.16em] text-(--ink-faint)">CRÉDITOS · 03</div>
      </aside>
    </>
  );
}
