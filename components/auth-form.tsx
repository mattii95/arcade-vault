"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm() {
  const [tab, setTab] = useState<"in" | "up">("in");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="av-auth-wrap fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="mark"></div>
          <h2 className="neon-cyan">ARCADE VAULT</h2>
          <div className="mono mt-1.5 text-[11px] tracking-[0.16em] text-(--ink-faint)">
            ACCESO AL SISTEMA · v2.6
          </div>
        </div>

        <div className="auth-tabs">
          <button className={tab === "in" ? "on" : ""} onClick={() => setTab("in")}>
            INICIAR SESIÓN
          </button>
          <button className={tab === "up" ? "on" : ""} onClick={() => setTab("up")}>
            CREAR CUENTA
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Usuario</label>
            <input placeholder="px_kai" />
          </div>
          {tab === "up" && (
            <div className="field slide-in">
              <label>Correo electrónico</label>
              <input type="email" placeholder="jugador@vault.gg" />
            </div>
          )}
          <div className="field">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button className="btn lg mt-2 w-full" type="submit">
            {tab === "in" ? "ENTRAR AL VAULT" : "CREAR Y JUGAR"}
          </button>
        </form>

        <button className="btn ghost mt-2.5 w-full" type="button" onClick={() => router.push("/")}>
          JUGAR COMO INVITADO
        </button>

        <div className="auth-divider">O CONTINÚA CON</div>
        <div className="social">
          <button className="btn ghost" type="button">◆&nbsp; GOOGLE</button>
          <button className="btn ghost" type="button">▣&nbsp; GITHUB</button>
        </div>

        <div className="mt-[18px] text-center text-[11px] tracking-widest text-(--ink-faint)">
          AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
        </div>
      </div>
    </div>
  );
}
