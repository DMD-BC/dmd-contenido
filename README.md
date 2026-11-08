# DMD Contenido IA (proyecto aparte: Posts + Publicidad)

Proyecto standalone de los creadores de contenido con IA de DMD, extraído
del sitio oficial (www.dmdmx.dev) con el mismo patrón que el creador
de páginas (dmd-paginas-web-ia), el login (dmd-login), Canva (dmd-canva)
y Punto de Venta (dmd-pos): código aparte, despliegue propio en Vercel
y enlace desde el menú oficial.

- Producción: https://dmd-contenido.vercel.app
- Entrada principal: `index.html` (hub con enlaces a los dos creadores)

## Archivos

- `index.html` — Hub "Contenido IA" con tarjetas a los dos creadores.
- `posts.html` + `posts.js` — Creador de Posts para Redes Sociales con IA
  (20 giros comerciales × 20 estilos visuales = 400 plantillas).
- `publicidad.html` + `publicidad.js` — Creador de Anuncios y Publicidad
  con IA (20 giros × 20 estilos = 400 plantillas de anuncios).
- `dmd-ai-registry.js` — Registro de herramientas IA de DMD (datos locales).
- `dmd-patch.js` — Reescribe los enlaces del menú móvil y la barra inferior
  que genera el script oficial para que apunten a www.dmdmx.dev,
  salvo las páginas de Contenido IA, que viven aquí.
- `assets/logo-dmd.svg`, `assets/favicon-16x16.png`,
  `assets/favicon-32x32.png`, `favicon.ico`, `apple-touch-icon.png` —
  copias locales de los favicons y el logo.

## Cómo funciona

Todo corre en el navegador, sin servidor, sin API y sin claves. No hay
ningún `fetch`, ni llamadas a `api/`, ni claves de Groq/OpenAI:

- Las 400 plantillas de cada creador se generan localmente desde los
  datos embebidos en `posts.js` / `publicidad.js` (arrays GIROS y
  STYLES/AD_STYLES) y se dibujan como SVG en el navegador
  (`buildPostSVG` / `buildAdSVG`).
- El "análisis con IA" del texto es un diccionario NLP local
  (`DMD_NLP_DICTIONARY`) que detecta promociones, eventos y giros
  para sugerir el diseño; no llama a ningún modelo externo.
- La membresía (FREE/PRO) se guarda en `localStorage`
  (`dmd_posts_tier`, `dmd_publicidad_tier`); las plantillas Premium
  se desbloquean con la membresía DMD.
- Tailwind y Lucide se cargan desde sus CDN públicos; las fuentes,
  desde Google Fonts.

## Límites conocidos

- `style.css` (172 KB) y `script.js` (244 KB) se cargan desde
  `https://www.dmdmx.dev`, no están copiados aquí: no caben en una
  sola subida y `script.js` es un solo bloque que no se puede partir
  sin romper su lógica (ahí viven `openPremiumModal`, `showDmdToast`,
  el menú móvil y la barra inferior que usan estas páginas).
  Si algún día se quiere un paquete 100% autocontenido, habría que
  refactorizar `script.js` en módulos.
- La membresía Premium usa `localStorage` del navegador (igual que en
  la oficial); no hay autenticación real de servidor.
- No está conectado a Git (la GitHub App no tiene permiso para crear
  repositorios, 403). Las actualizaciones requieren repetir la subida
  de archivos a Vercel o crear el repo a mano.
- No se probó el flujo completo en un navegador real (generar
  plantilla, editar texto, descargar); solo se verificó HTTP, títulos
  y presencia de los scripts y datos.

## Pendientes

- Enlazarlo desde el menú de la oficial (lo hace otro PR, cuando Axel
  lo pida).
- Probar el flujo real en el navegador: generar una plantilla de post
  y una de anuncio, y descargarlas.
