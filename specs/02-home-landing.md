# SPEC 02 — Home (landing page)

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-01
> **Objetivo:** Implementar en `/`, solo en su parte visual, la landing del template `references/templates/home-about/home.jsx`, moviendo la Biblioteca a `/juegos`.

---

## Alcance

**Dentro:**

- Nueva ruta `/` con las secciones del template, en este orden:
  - Hero: siluetas pixel flotantes, eyebrow "▸ INSERTA UNA MONEDA\_", título en 3 líneas, subtítulo, CTAs "EXPLORAR JUEGOS" y "CREAR CUENTA", indicador "DESLIZA ▼".
  - `// 01` ¿POR QUÉ ARCADE VAULT? — 4 feature cards con íconos pixel SVG.
  - `// 02` JUEGOS DISPONIBLES AHORA — 6 mini cards (`GAMES.slice(0, 6)`) + botón "VER TODOS LOS JUEGOS →".
  - Stats — 3 bloques (12+ / MILES / GLOBAL).
  - `// 03` ACTIVIDAD EN VIVO — "ÚLTIMAS PUNTUACIONES" (7 filas) y "TOP JUGADORES · HOY" (5 filas, link "VER SALÓN →").
  - `// 04` PRECIOS — tarjeta "JUGADOR VAULT" con sello "FREE PLAY" + 3 FAQ.
  - CTA final "¿LISTO PARA JUGAR?" / "INSERTAR MONEDA →".
- Animación `.reveal` al hacer scroll (IntersectionObserver, como en el template).
- La Biblioteca se mueve de `/` a `/juegos` (mismo componente `Library`, sin cambios de comportamiento).
- Nav: se agrega el link "Inicio" (desktop y panel móvil); "Biblioteca" apunta a `/juegos`.
- Actualizar los links que hoy van a `/` y significan "biblioteca" para que vayan a `/juegos`.
- Portar a `app/globals.css` los bloques CSS de la home desde `references/templates/home-about/styles.css`.
- Responsive según los breakpoints que ya trae ese CSS.

**Fuera de alcance (para otros specs):**

- Página "Acerca de" (`about.jsx`) y su link en el nav.
- Datos reales en "Actividad en vivo", "Top jugadores" y stats: son mock fijos.
- Sesión de usuario: "CREAR CUENTA" y "EMPEZAR GRATIS" solo navegan a `/login`.
- Gamepad, temas, floaters de puntaje y demás bloques de `home-about/styles.css` que no use la home.
- Cambios al resto de pantallas del SPEC 01 más allá de sus links.
- Tests automatizados.

## Modelo de datos

No se introduce modelo nuevo ni persistencia.

- "Juegos disponibles" reutiliza `GAMES` de `lib/data.ts`.
- Features, stats, ticker de puntuaciones, top jugadores y FAQ son constantes locales dentro del componente de la home, con los textos y valores exactos del template.
- Números formateados con `toLocaleString("es-ES")`.

## Plan de implementación

1. **Mover la Biblioteca.** Crear `app/juegos/page.tsx` que renderiza `<Library />` (contenido actual de `app/page.tsx`). Cambiar a `/juegos` los links "VOLVER AL VAULT" (`app/juegos/[id]/page.tsx`) y "VOLVER A LA BIBLIOTECA" (`components/hall-of-fame.tsx`). El redirect de `components/auth-form.tsx` sigue yendo a `/` (ahora la home). Verificación: `/juegos` muestra las 8 tarjetas y los filtros funcionan; `/juegos/caida` sigue funcionando.
2. **Nav.** En `components/nav.tsx` agregar "Inicio" (`/`, activo solo con `pathname === "/"`) antes de "Biblioteca" en desktop y en el panel móvil. "Biblioteca" pasa a `href="/juegos"`, activo cuando `pathname.startsWith("/juegos")`. El logo sigue yendo a `/`. Verificación: el link activo es correcto en `/`, `/juegos`, `/juegos/caida`, `/juegos/caida/jugar` y `/salon`.
3. **Estilos.** Copiar al final de `app/globals.css` los bloques `/* ===== HOME PAGE ===== */` (líneas ~930–1070) y `/* ===== ACTIVITY ... ===== */` + `/* ===== PRICING ===== */` (líneas ~1621–1730) de `references/templates/home-about/styles.css`. Revisar que toda clase y `@keyframes` usada por `home.jsx` exista (p. ej. `float`, `bounce`) y portar las que falten sin duplicar las ya presentes. Verificación: `npm run build` pasa.
4. **Home.** Reemplazar `app/page.tsx` por la landing (server component). Arte pixel (`FloatingSilhouettes`, `FeatureIcon`) en `components/home-art.tsx`. La animación de scroll en un client component mínimo `components/reveal.tsx` (efecto con IntersectionObserver que agrega `.in` a `.reveal`, sin renderizar nada). Navegación con `<Link>`:
   - "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS", "INSERTAR MONEDA" → `/juegos`
   - "CREAR CUENTA", "EMPEZAR GRATIS" → `/login`
   - "VER SALÓN" → `/salon`
   - Cada mini card → `/juegos/<id>`
     Estilos inline estáticos del template a Tailwind (`text-center mt-6`, `w-full`); los valores calculados por índice (`transitionDelay`, `animationDelay`, ancho de `tp-fill`) se mantienen en `style`. Verificación: `/` muestra todas las secciones y las secciones aparecen al hacer scroll.
5. **Cierre.** Verificación: `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan; revisar a 375 px y en desktop.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] `/` muestra el hero con el título "EL ARCADE / CLÁSICO ESTÁ / DE VUELTA" y las 8 siluetas flotando.
- [ ] `/` contiene, en orden, las secciones `// 01` a `// 04`, el bloque de stats y el CTA final, con los textos del template.
- [ ] La sección `// 02` muestra 6 mini cards; clic en una navega a `/juegos/<id>` de ese juego.
- [ ] "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS" e "INSERTAR MONEDA" llevan a `/juegos`; "CREAR CUENTA" y "EMPEZAR GRATIS" a `/login`; "VER SALÓN" a `/salon`.
- [ ] "ÚLTIMAS PUNTUACIONES" tiene 7 filas y "TOP JUGADORES · HOY" 5 filas con barras decrecientes y top 1-3 resaltados.
- [ ] Las secciones con `.reveal` empiezan ocultas y reciben la clase `in` al entrar en pantalla.
- [ ] `/juegos` muestra la Biblioteca con 8 tarjetas y sus filtros funcionan igual que en el SPEC 01.
- [ ] "VOLVER AL VAULT" (detalle) y "VOLVER A LA BIBLIOTECA" (salón) llevan a `/juegos`.
- [ ] El nav muestra "Inicio" activo en `/`, "Biblioteca" activo en `/juegos`, `/juegos/*` y `/juegos/*/jugar`, y "Salón de la Fama" en `/salon`; "Inicio" también aparece en el panel móvil.
- [ ] No hay errores ni warnings de hidratación en la consola del navegador en `/` y `/juegos`.
- [ ] A 375 px de ancho no hay scroll horizontal en `/` y las grillas pasan a 1–2 columnas.
- [ ] No se usa `localStorage`, `sessionStorage` ni cookies en el código nuevo.
- [ ] El código nuevo no tiene `style={{...}}` con valores estáticos que tengan utilidad de Tailwind equivalente.

## Decisiones tomadas y descartadas

- **Sí:** home en `/` y Biblioteca en `/juegos`. Encaja con las rutas existentes `/juegos/[id]` y con el template (Inicio y Biblioteca separados).
- **No:** home en `/inicio` ni Biblioteca en `/biblioteca`.
- **Sí:** solo se agrega "Inicio" al nav. "Acerca de" tendrá su propio spec; no se agrega un link sin página.
- **Sí:** copiar los bloques CSS del template a `globals.css`, igual que el SPEC 01. Tailwind solo para los `style={{}}` estáticos.
- **No:** reescribir el CSS de la home con Tailwind ni portar el `styles.css` completo de `home-about` (incluye gamepad, about y temas que no se usan).
- **Sí:** datos mock de la home como constantes locales; solo `GAMES` se comparte desde `lib/data.ts`.
- **No:** agregar esos mocks a `lib/data.ts`; nadie más los usa.
- **Sí:** la home es server component; solo `reveal.tsx` es client. Botones del template (`onClick` + `navigate`) pasan a `<Link>`.
- **Sí:** tras login/invitado se sigue redirigiendo a `/` (que ahora es la home). Decisión de redacción del spec; confirmar al revisar.
- **Sí:** `CLAUDE.md` exige usar `/frontend-design` para la interfaz; se aplica solo para respetar el template, sin reinterpretar el diseño.

## Riesgos identificados

| Riesgo                                                                                                      | Mitigación                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `.reveal` arranca con `opacity: 0`: si el JS no carga o el observer falla, las secciones quedan invisibles. | Mantener el comportamiento del template; verificar en el navegador que todas las secciones reciben `in` al hacer scroll hasta el final. |
| El CSS portado puede redefinir clases ya existentes en `globals.css` (`.btn.xl`, `.pulse`, `.fade-in`...).  | Copiar solo los bloques indicados y comprobar que no duplican reglas ya presentes.                                                      |
| Links o `push("/")` que asumían que `/` era la Biblioteca quedan apuntando a la home.                       | Paso 1 lista los afectados (detalle, salón, nav); `grep 'href="/"'` al cerrar.                                                          |
| `cacheComponents` activo.                                                                                   | La home no usa request APIs ni fetch; queda estática. Leer `node_modules/next/dist/docs/01-app` si aparece algún error de prerender.    |

## Qué **no** está en este spec

- Página "Acerca de".
- Datos reales de actividad, ranking o estadísticas.
- Sesión o registro reales.
- Gamepad, temas o floaters del template `home-about`.
- Tests automatizados.

Cada uno, si se aborda, va en su propio spec.
