# SPEC 01 — Pantallas visuales del MVP

> **Estado:** Implementado
> **Depende de:** ninguna
> **Fecha:** 2026-10-27
> **Objetivo:** Implementar en Next.js, como rutas reales y solo en su parte visual, las 5 pantallas del template `references/templates/` (biblioteca, detalle, reproductor, login y salón de la fama).

---

## Alcance

**Dentro:**

- 5 rutas del App Router con el diseño del template, en español:
  - `/` — Biblioteca (hero, buscador, chips de categoría, grilla de tarjetas).
  - `/juegos/[id]` — Detalle del juego (portada, tags, stats, ranking top 10).
  - `/juegos/[id]/jugar` — Reproductor: marco estático (HUD + pantalla CRT decorativa).
  - `/login` — Iniciar sesión / Crear cuenta (pestañas), botón invitado, botones sociales.
  - `/salon` — Salón de la Fama (pestañas por juego, podio, tabla).
- Layout compartido: `Nav` (logo, links, contador de créditos, botón de sesión, menú móvil con backdrop) y footer.
- Datos mock tipados en `lib/data.ts` (8 juegos, categorías, generador de puntuaciones sembrado).
- Estilos: se reutilizan las clases ya portadas en `app/globals.css`; todo estilo nuevo o `style={{}}` inline del template se escribe con utilidades de Tailwind.
- Responsive (el CSS del template ya define breakpoints y el menú móvil).
- Reemplazar el scaffold de `app/page.tsx`.

**Fuera de alcance (para otros specs):**

- Implementación de cualquier juego (el reproductor es solo un marco).
- Sesión de usuario: sin estado, sin `localStorage`, sin cookies. El formulario de login no autentica.
- Persistencia de puntuaciones (`av_scores`), modal de "Fin del juego", puntaje simulado, pausa/fin.
- Backend, base de datos, OAuth real (Google/GitHub), validación de formularios.
- Fila "Tu mejor marca" del salón (depende de tener usuario).
- Rediseño de estilos o reescritura de `globals.css` a Tailwind.
- Tests automatizados (no hay runner configurado).

## Modelo de datos

Solo datos mock estáticos en `lib/data.ts`; no hay persistencia.

```ts
export type Cat = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type Color = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string; // slug de la URL: "bloque-buster", "caida", ...
  title: string;
  short: string;
  long: string;
  cat: Cat;
  cover: string; // clase CSS existente: "cover-bricks", "cover-tetro", ...
  color: Color;
  best: number;
  plays: string; // ya formateado: "12.4K"
};

export type ScoreRow = {
  rank: number;
  name: string;
  score: number;
  date: string;
};

export const GAMES: Game[]; // los 8 juegos de references/templates/data.jsx
export const CATS: ("TODOS" | Cat)[];
export function seededScores(seed: number, count?: number): ScoreRow[];
```

Convenciones:

- `seededScores` es determinista (misma semilla, mismo resultado) para evitar mismatch de hidratación.
- Números formateados con `toLocaleString("es-ES")`.
- Datos copiados del template sin cambiar textos ni valores.

## Plan de implementación

1. **Datos.** Crear `lib/data.ts` portando `data.jsx` a TypeScript. Verificación: `npm run lint` y `npx tsc --noEmit` pasan.
2. **Layout base.** Crear `components/nav.tsx` (client: menú móvil + `usePathname` para el link activo; "Biblioteca" activo también en `/juegos/*`) y el footer; montarlos en `app/layout.tsx` dentro de `#root`, con `<main className="av-main">`. Verificación: `npm run dev`, el nav y el footer se ven en `/`.
3. **Biblioteca.** Crear `components/game-card.tsx` (client: tilt 3D al mover el mouse; la tarjeta y el botón JUGAR son `<Link>` a `/juegos/[id]`) y `components/library.tsx` (client: buscador + chips + estado vacío). Reemplazar `app/page.tsx`. Verificación: filtrar por texto y categoría funciona; clic en tarjeta navega al detalle.
4. **Detalle.** Crear `app/juegos/[id]/page.tsx` (server; `params` es una Promise en Next 16; `notFound()` si el id no existe; `generateStaticParams` con `GAMES`). Botón "JUGAR AHORA" → `/juegos/[id]/jugar`; "VOLVER AL VAULT" → `/`. Verificación: `/juegos/caida` muestra datos y ranking de 10 filas con top 1-3 resaltados.
5. **Reproductor estático.** Crear `app/juegos/[id]/jugar/page.tsx`: HUD con valores fijos (Jugador `INVITADO`, Puntuación `0`, Vidas `♥ ♥ ♥`, Nivel `01`), botón SALIR → `/juegos/[id]`, marco CRT con arena decorativa y barra inferior. Sin pausa, fin ni modal. Verificación: se ve el marco CRT y SALIR vuelve al detalle.
6. **Login.** Crear `app/login/page.tsx` + `components/auth-form.tsx` (client: pestañas "in"/"up", el campo correo solo aparece en "Crear cuenta"). El submit y "JUGAR COMO INVITADO" navegan a `/` sin guardar nada (`useRouter().push`). Verificación: alternar pestañas y enviar redirige a `/`.
7. **Salón de la Fama.** Crear `app/salon/page.tsx` + `components/hall-of-fame.tsx` (client: pestañas por juego, podio 2-1-3, tabla de 12 filas con animación escalonada). Sin fila "tu mejor marca". Verificación: cambiar de pestaña actualiza podio y tabla.
8. **Limpieza.** Revisar que no queden restos del scaffold (imports de `next/image`, SVGs sin uso en `public/`). Verificación: `npm run lint` y `npm run build` pasan.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] Existen las rutas `/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/login` y `/salon`, y cada una renderiza sin errores en la consola del navegador.
- [ ] `/` muestra 8 tarjetas; escribir "caí" deja solo CAÍDA; el chip SHOOTER deja 2 tarjetas; una búsqueda sin coincidencias muestra "NO HAY RESULTADOS".
- [ ] Clic en una tarjeta o en su botón JUGAR navega a `/juegos/<id>` de ese juego.
- [ ] `/juegos/<id>` con un id inexistente devuelve la página 404.
- [ ] El detalle muestra título, descripción larga, tags, 3 stats y 10 filas de ranking; las 3 primeras tienen estilo top1/top2/top3.
- [ ] "JUGAR AHORA" lleva a `/juegos/<id>/jugar` y "VOLVER AL VAULT" a `/`.
- [ ] El reproductor muestra el HUD con valores fijos y el marco CRT; no hay temporizadores ni modal; SALIR vuelve al detalle.
- [ ] `/login` alterna entre "INICIAR SESIÓN" y "CREAR CUENTA"; el campo de correo existe solo en la segunda; enviar el formulario o pulsar "JUGAR COMO INVITADO" redirige a `/`.
- [ ] No se usa `localStorage`, `sessionStorage` ni cookies en todo el código nuevo.
- [ ] `/salon` muestra 8 pestañas, podio con 3 puestos y tabla de 12 filas; cambiar de pestaña cambia los datos; no existe la fila "TU MEJOR MARCA".
- [ ] El nav marca "Biblioteca" como activo en `/`, `/juegos/*` y `/juegos/*/jugar`, y "Salón de la Fama" en `/salon`.
- [ ] A 375 px de ancho aparece el botón hamburguesa, el panel móvil abre y cierra con el backdrop, y no hay scroll horizontal.
- [ ] El código nuevo no contiene atributos `style={{...}}` donde exista una utilidad de Tailwind equivalente.

## Decisiones tomadas y descartadas

- **Sí:** rutas reales de Next (App Router). Dan URLs compartibles, botón "atrás" nativo y encajan con el framework.
- **No:** réplica del SPA con hash y estado de ruta del template (`app.jsx`). Es una limitación del prototipo, no un requisito.
- **Sí:** reutilizar `app/globals.css` tal como está (ya es un port fiel del template, con fuentes vía `next/font`). Tailwind solo para lo nuevo.
- **No:** reescribir las ~950 líneas de CSS a utilidades. Riesgo alto de divergir del diseño sin aportar valor al MVP.
- **Sí:** login solo visual, sin sesión. El nav siempre muestra "Iniciar Sesión". La sesión llegará con auth real en otro spec.
- **No:** mock de sesión en `localStorage` como hacía el template. Se descartó para no construir algo que luego se reemplaza.
- **Sí:** reproductor como marco estático. El puntaje simulado y el modal no aportan sin un juego real.
- **No:** guardar puntuaciones en `localStorage` (`av_scores`).
- **Sí:** componentes `client` solo donde hay interacción (nav, tarjeta con tilt, biblioteca, formulario, salón); detalle y reproductor son server components.
- **Sí:** en el reproductor solo SALIR (se omiten PAUSA y FIN por no tener acción posible). Decisión de redacción del spec derivada de "solo marco estático"; confirmar al revisar.
- **Sí:** créditos "03" y versión "v2.6.0" quedan como texto fijo, igual que en el template.
- **Sí:** `CLAUDE.md` exige usar `/frontend-design` para la interfaz; se aplica solo para respetar el template, sin reinterpretar el diseño.

## Riesgos identificados

| Riesgo                                                                                              | Mitigación                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `cacheComponents` activo cambia las reglas de render dinámico (p. ej. `params` en rutas dinámicas). | Leer `node_modules/next/dist/docs/01-app` antes del paso 4 y usar `generateStaticParams` para que `/juegos/[id]` sea estático. |
| Mismatch de hidratación por datos aleatorios.                                                       | `seededScores` determinista; no usar `Math.random()` ni `Date.now()` en el render.                                             |
| Estilos de `globals.css` dependen de `#root` y `av-bg`/`av-noise` (ya presentes en `layout.tsx`).   | Mantener esos nodos al montar nav, main y footer en el layout.                                                                 |
| `RootLayout` usa `LayoutProps<"/">` del scaffold.                                                   | Conservar el tipo; verificar con `npx tsc --noEmit` tras el paso 2.                                                            |

## Qué **no** está en este spec

- Ningún juego jugable (ni lógica, ni canvas, ni controles).
- Autenticación, sesión o cuentas reales.
- Guardado o consulta real de puntuaciones; el ranking es mock.
- Backend, API, base de datos.
- Tests automatizados.
- Cambios al sistema de diseño o reescritura del CSS.

Cada uno, si se aborda, va en su propio spec.
