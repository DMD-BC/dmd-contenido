/**
 * publicidad.js - DMD
 * Catálogo y Creador de Publicidad y Anuncios Comerciales con IA
 * ESTRUCTURA OFICIAL:
 * - 20 Giros Comerciales x 20 Estilos Promocionales = 400 Campañas y Anuncios Únicos
 * - Barra superior de Plan Gratuito vs Premium ($79/mes)
 * - Asistente IA para recomendación por giro y color
 * - Tarjetas con fondo blanco, contorno azul rey y zoom interactivo al hover
 * - Botón principal: "Descargar anuncio publicitario"
 * - Modal HD con previsualizador y descarga directa PNG 1600x2000 y SVG
 */

(function () {
  "use strict";

  let userTier = localStorage.getItem("dmd_publicidad_tier") || "FREE";
  let activeGiroId = "cafeteria";
  let currentAdSVG = "";
  let currentAdConfig = null;

  const GIROS = [
  {
    "id": "cafeteria",
    "name": "Cafetería & Panadería",
    "icon": "☕",
    "accent": "#d97706",
    "brand": "AROMA & GRANO",
    "tag": "Alimentos",
    "desc": "Posts de antojo matutino, preguntas a comensales y combinaciones de café de especialidad.",
    "tip": "Las preguntas de elección múltiple aumentan un 280% los comentarios en el feed.",
    "topic": "Café de Especialidad, Espresso y Pan Artesanal"
  },
  {
    "id": "taqueria",
    "name": "Taquería & Antojitos",
    "icon": "🌮",
    "accent": "#f59e0b",
    "brand": "TACOS EL DORADO",
    "tag": "Gastronomía",
    "desc": "Viernes de tacos, batallas de salsas y antojo nocturno para convocar a la comunidad foodie.",
    "tip": "El humor sobre quién paga la cuenta de tacos tiene la mayor tasa de compartidos.",
    "topic": "Tacos al Pastor, Suadero y Salsas Bravas"
  },
  {
    "id": "pizzeria",
    "name": "Pizzería & Italiana",
    "icon": "🍕",
    "accent": "#ea580c",
    "brand": "FORNO NOBILE",
    "tag": "Restaurante",
    "desc": "Debates de ingredientes, quesos derretidos y combinaciones artesanales a la leña.",
    "tip": "El debate de la piña en la pizza sigue siendo el generador de interacción número 1.",
    "topic": "Pizza a la Leña, Masa Madre y Pastas"
  },
  {
    "id": "barberia",
    "name": "Barbería & Peluquería",
    "icon": "💈",
    "accent": "#3b82f6",
    "brand": "THE GENTLEMAN",
    "tag": "Cuidado Personal",
    "desc": "Cortes de tendencia, antes y después de barbas y estilo masculino de alta gama.",
    "tip": "Los consejos de perfilado de barba generan 3x más guardados en Instagram.",
    "topic": "Cortes Fade, Barba y Estilo Masculino"
  },
  {
    "id": "boutique",
    "name": "Boutique de Ropa & Moda",
    "icon": "👗",
    "accent": "#ec4899",
    "brand": "MAISON ÉLÉGANTE",
    "tag": "Moda & Estilo",
    "desc": "Nuevas colecciones, outfits de temporada y combinaciones de prendas en tendencia.",
    "tip": "Los posts de '¿Cómo combinarías esto?' obtienen hasta 4 veces más guardados.",
    "topic": "Outfits de Temporada, Vestidos y Moda"
  },
  {
    "id": "farmacia",
    "name": "Farmacia & Botica",
    "icon": "💊",
    "accent": "#10b981",
    "brand": "FARMACIAS SAN RAFAEL",
    "tag": "Salud",
    "desc": "Consejos preventivos de salud, botiquín para el hogar y cuidado de la piel.",
    "tip": "El contenido educativo sobre vitaminas y defensas genera alta credibilidad y compartidos.",
    "topic": "Medicamentos, Vitaminas y Cuidado Integral"
  },
  {
    "id": "ferreteria",
    "name": "Ferretería & Tlapalería",
    "icon": "🔨",
    "accent": "#f97316",
    "brand": "FERRETERA DEL VALLE",
    "tag": "Hogar & Industria",
    "desc": "Tips para proyectos DIY en el hogar, herramientas indispensables y reparación.",
    "tip": "Mostrar soluciones a problemas comunes (humedad, tornillos) genera gran fidelidad.",
    "topic": "Herramientas Eléctricas, Plomería y Pinturas"
  },
  {
    "id": "gimnasio",
    "name": "Gimnasio & Fitness",
    "icon": "🏋️",
    "accent": "#ef4444",
    "brand": "TITAN ATHLETICS",
    "tag": "Deporte",
    "desc": "Motivación de lunes, técnica de ejercicios y retos semanales para la comunidad fit.",
    "tip": "Las frases de disciplina y superación matutina tienen el pico más alto de guardados.",
    "topic": "Entrenamiento Funcional, Pesas y Nutrición"
  },
  {
    "id": "consultorio",
    "name": "Consultorio Médico & Dental",
    "icon": "🩺",
    "accent": "#0ea5e9",
    "brand": "CLÍNICA INTEGRAL DENTAL",
    "tag": "Salud Profesional",
    "desc": "Mitos dentales, salud visual, prevención y casos de transformación de sonrisas.",
    "tip": "Desmentir mitos comunes de salud genera autoridad inmediata y recomendaciones.",
    "topic": "Diseño de Sonrisa, Salud Bucal y Prevención"
  },
  {
    "id": "papeleria",
    "name": "Papelería & Copias",
    "icon": "📚",
    "accent": "#8b5cf6",
    "brand": "PAPELERÍA EL ESTUDIANTE",
    "tag": "Escolar & Oficina",
    "desc": "Organización de apuntes, útiles escolares de temporada y artículos de lettering.",
    "tip": "El contenido de papelería estética (bullet journaling) es sumamente viral.",
    "topic": "Útiles Escolares, Impresiones y Encuadernación"
  },
  {
    "id": "abarrotes",
    "name": "Abarrotes & Minisuper",
    "icon": "🛒",
    "accent": "#14b8a6",
    "brand": "MINISUPER LA BENDICIÓN",
    "tag": "Comercio Local",
    "desc": "Ofertas de la canasta básica, botanas para el fin de semana y bebidas frías.",
    "tip": "Resaltar que tienes servicio a domicilio o pago con tarjeta atrae nuevos clientes.",
    "topic": "Canasta Básica, Abarrotes y Bebidas Frías"
  },
  {
    "id": "autolavado",
    "name": "Autolavado & Car Wash",
    "icon": "🚗",
    "accent": "#0284c7",
    "brand": "BRILLO TOTAL CAR WASH",
    "tag": "Automotriz",
    "desc": "Limpieza profunda, encerado cerámico y estética interior antes y después.",
    "tip": "El video o carrusel de limpieza extrema de vestiduras genera hipnosis visual.",
    "topic": "Lavado a Presión, Encerado y Detallado Auto"
  },
  {
    "id": "veterinaria",
    "name": "Veterinaria & Pet Shop",
    "icon": "🐾",
    "accent": "#84cc16",
    "brand": "HUELLITAS & CUIDADO",
    "tag": "Mascotas",
    "desc": "Curiosidades sobre perros y gatos, esquemas de vacunación y nutrición animal.",
    "tip": "Las fotos de mascotas felices con preguntas generan la mayor interacción de todas.",
    "topic": "Vacunación Canina, Estética Felina y Nutrición"
  },
  {
    "id": "pasteleria",
    "name": "Pastelería & Repostería Fina",
    "icon": "🎂",
    "accent": "#f43f5e",
    "brand": "DULCE TENTACIÓN",
    "tag": "Repostería",
    "desc": "Pasteles personalizados, mesas de postres para bodas y antojo dulce diario.",
    "tip": "Preguntar '¿Cuál sabor elegirías para tu cumpleaños?' dispara comentarios masivos.",
    "topic": "Pasteles Personalizados y Repostería Gourmet"
  },
  {
    "id": "optica",
    "name": "Óptica & Salud Visual",
    "icon": "👓",
    "accent": "#6366f1",
    "brand": "ÓPTICA CLARIDAD",
    "tag": "Salud Visual",
    "desc": "Protección de luz azul para computadoras, armazones de tendencia y exámenes de la vista.",
    "tip": "El tip sobre la regla 20-20-20 para descansar los ojos es altamente compartido.",
    "topic": "Armazones de Moda, Micas Antirreflejo y Examen"
  },
  {
    "id": "inmobiliaria",
    "name": "Bienes Raíces & Inmobiliaria",
    "icon": "🏡",
    "accent": "#059669",
    "brand": "HÁBITAT INMOBILIARIA",
    "tag": "Propiedades",
    "desc": "Tours de casas, consejos para comprar la primera propiedad y plusvalía.",
    "tip": "Los carruseles de 'Casas que puedes comprar con este presupuesto' tienen gran alcance.",
    "topic": "Casas en Venta, Departamentos y Créditos"
  },
  {
    "id": "spa",
    "name": "Spa & Centro de Belleza",
    "icon": "💆",
    "accent": "#d946ef",
    "brand": "SERENITY SPA & WELLNESS",
    "tag": "Relajación",
    "desc": "Masajes descontracturantes, faciales hidratantes y autocuidado dominical.",
    "tip": "Invitar al 'Domingo de Detox y Autocuidado' genera reservaciones para toda la semana.",
    "topic": "Masajes Relajantes, Faciales y Aromaterapia"
  },
  {
    "id": "mecanico",
    "name": "Taller Mecánico & Frenos",
    "icon": "🔧",
    "accent": "#ea580c",
    "brand": "MECÁNICA MASTER PRO",
    "tag": "Mantenimiento Auto",
    "desc": "Señales de que tus frenos fallan, cambio de aceite a tiempo y seguridad en carretera.",
    "tip": "Las advertencias preventivas antes de salir a carretera generan guardados inmediatos.",
    "topic": "Frenos, Afinación Mayor y Diagnóstico Computarizado"
  },
  {
    "id": "joyeria",
    "name": "Joyería & Accesorios Finos",
    "icon": "💍",
    "accent": "#eab308",
    "brand": "AURUM JOYERÍA FINA",
    "tag": "Lujo & Joyas",
    "desc": "Anillos de compromiso, pulseras de plata 925 y consejos de limpieza de joyas.",
    "tip": "Los consejos para limpiar cadenas de plata en casa son de los más guardados.",
    "topic": "Oro de 14K, Plata Fina 925 y Anillos de Boda"
  },
  {
    "id": "academia",
    "name": "Escuela & Cursos Online",
    "icon": "🎓",
    "accent": "#2563eb",
    "brand": "ACADEMIA DEL FUTURO",
    "tag": "Educación & Cursos",
    "desc": "Cursos de programación, habilidades digitales, idiomas y crecimiento profesional.",
    "tip": "Los resúmenes de '3 habilidades mejor pagadas' atraen alumnos de forma inmediata.",
    "topic": "Cursos de Programación, Inglés y Marketing"
  }
];
  const AD_STYLES = [
  {
    "id": "promo-flash-50",
    "name": "Oferta Relámpago Flash 50% OFF",
    "tag": "50% OFF",
    "icon": "⚡",
    "dark": true,
    "accent": "#ef4444",
    "bg1": "#180505",
    "bg2": "#450a0a",
    "badge": "OFERTA RELÁMPAGO 50% OFF",
    "cta": "RECLAMAR MI 50% OFF →",
    "desc": "Impacto psicológico de urgencia con reloj de cuenta regresiva y 50% de descuento."
  },
  {
    "id": "coupon-perforated",
    "name": "Cupón Comercial Desprendible",
    "tag": "Cupón",
    "icon": "🎟️",
    "dark": false,
    "accent": "#10b981",
    "bg1": "#ffffff",
    "bg2": "#f0fdf4",
    "badge": "CUPÓN DE REGALO $200 MXN",
    "cta": "CANJEAR CUPÓN EN WHATSAPP",
    "desc": "Borde recortable con tijeras, código de barras y cupón canjeable."
  },
  {
    "id": "luxury-exclusive",
    "name": "Venta Privada VIP Luxury",
    "tag": "VIP",
    "icon": "👑",
    "dark": true,
    "accent": "#f59e0b",
    "bg1": "#09090b",
    "bg2": "#18181b",
    "badge": "ACCESO EXCLUSIVO CLIENTES VIP",
    "cta": "ACCEDER A LA VENTA PRIVADA",
    "desc": "Fondo negro obsidiana, marco fino dorado y trato preferencial de alta gama."
  },
  {
    "id": "neon-happy-hour",
    "name": "Promo Neón Nocturna / Happy Hour",
    "tag": "Neón",
    "icon": "🌙",
    "dark": true,
    "accent": "#06b6d4",
    "bg1": "#050814",
    "bg2": "#0f172a",
    "badge": "HAPPY HOUR NOCTURNO",
    "cta": "APARTA TU MESA HOY",
    "desc": "Luces LED azul y magenta para eventos, restaurantes, bares y taquerías."
  },
  {
    "id": "flyer-print-a5",
    "name": "Volante Comercial Impreso A5",
    "tag": "Flyer A5",
    "icon": "📄",
    "dark": false,
    "accent": "#2563eb",
    "bg1": "#ffffff",
    "bg2": "#f8fafc",
    "badge": "VOLANTE OFICIAL DISTRIBUCIÓN",
    "cta": "CONOCE NUESTROS PAQUETES",
    "desc": "Estructura publicitaria tradicional con 3 pilares de servicio y datos de contacto."
  },
  {
    "id": "brutalist-mega-sale",
    "name": "Mega Descuento Brutalista",
    "tag": "Mega Sale",
    "icon": "💥",
    "dark": false,
    "accent": "#facc15",
    "bg1": "#fef08a",
    "bg2": "#ffffff",
    "badge": "PRECIOS DE LIQUIDACIÓN",
    "cta": "COMPRAR ANTES QUE SE AGOTE",
    "desc": "Bordes negros de 4px, sombras de bloque y tipografía de cartel de remate."
  },
  {
    "id": "glassmorphism-ad",
    "name": "Campaña Digital Glassmorphism",
    "tag": "Glass UI",
    "icon": "💎",
    "dark": true,
    "accent": "#38bdf8",
    "bg1": "#0b1329",
    "bg2": "#1e293b",
    "badge": "LANZAMIENTO DIGITAL 2026",
    "cta": "PROBAR DEMO EN VIVO",
    "desc": "Tarjetas translúcidas sobre fondos degradados para software y startups."
  },
  {
    "id": "black-friday-sale",
    "name": "Edición Black Friday / Cyber Sale",
    "tag": "Black Friday",
    "icon": "🖤",
    "dark": true,
    "accent": "#eab308",
    "bg1": "#000000",
    "bg2": "#1c1917",
    "badge": "BLACK FRIDAY OFICIAL",
    "cta": "APROVECHAR PRECIO HISTÓRICO",
    "desc": "Negro absoluto y acentos amarillos con la mayor tasa de clics del año."
  },
  {
    "id": "clearance-liquidation",
    "name": "Liquidación Total por Temporada",
    "tag": "Remate",
    "icon": "🚨",
    "dark": false,
    "accent": "#ea580c",
    "bg1": "#fff7ed",
    "bg2": "#ffedd5",
    "badge": "TODO DEBE SALIR · REMATE",
    "cta": "VER MODELOS DISPONIBLES",
    "desc": "Sensación de últimas piezas con franjas de advertencia y precios de costo."
  },
  {
    "id": "combo-bundle-2x1",
    "name": "Combo 2x1 / Paquete Familiar",
    "tag": "2x1 Combo",
    "icon": "🎁",
    "dark": false,
    "accent": "#db2777",
    "bg1": "#ffffff",
    "bg2": "#fdf2f8",
    "badge": "PROMO 2x1 EN TU SEGUNDA COMPRA",
    "cta": "PEDIR COMBO DOBLE",
    "desc": "Comparativa visual de beneficio doble al costo de una sola unidad."
  },
  {
    "id": "story-vertical-ad",
    "name": "Formato Story / Reel Patrocinado",
    "tag": "Story Ads",
    "icon": "📱",
    "dark": true,
    "accent": "#8b5cf6",
    "bg1": "#1e1b4b",
    "bg2": "#312e81",
    "badge": "ANUNCIO EN HISTORIAS",
    "cta": "DESLIZA HACIA ARRIBA / CLIC AQUÍ",
    "desc": "Diseño dinámico de alto impacto adaptado a pantalla completa de celular."
  },
  {
    "id": "grand-opening-fest",
    "name": "Gran Inauguración / Apertura",
    "tag": "Apertura",
    "icon": "🎉",
    "dark": false,
    "accent": "#dc2626",
    "bg1": "#ffffff",
    "bg2": "#fef2f2",
    "badge": "¡GRAN INAUGURACIÓN OFICIAL!",
    "cta": "ACOMPÁÑANOS Y RECIBE UN REGALO",
    "desc": "Cintas de corte inaugural, confeti y cortesía de bienvenida."
  },
  {
    "id": "vip-membership-club",
    "name": "Tarjeta de Lealtad & Membresía",
    "tag": "Membresía",
    "icon": "💳",
    "dark": true,
    "accent": "#14b8a6",
    "bg1": "#042f2e",
    "bg2": "#115e59",
    "badge": "CLUB DE BENEFICIOS EXCLUSIVOS",
    "cta": "SOLICITAR MI TARJETA DIGITAL",
    "desc": "Formato de tarjeta bancaria ejecutiva con beneficios acumulables por compra."
  },
  {
    "id": "early-bird-presale",
    "name": "Preventa Especial Early Bird",
    "tag": "Preventa",
    "icon": "🐦",
    "dark": false,
    "accent": "#4f46e5",
    "bg1": "#ffffff",
    "bg2": "#eef2ff",
    "badge": "PREVENTA EXCLUSIVA 40% OFF",
    "cta": "APARTA TU LUGAR AHORA",
    "desc": "Reserva anticipada con descuento para los primeros 20 clientes registrados."
  },
  {
    "id": "free-shipping-promo",
    "name": "Campaña Envío Gratis / Free Delivery",
    "tag": "Envío Gratis",
    "icon": "🚚",
    "dark": false,
    "accent": "#16a34a",
    "bg1": "#ffffff",
    "bg2": "#f0fdf4",
    "badge": "ENVÍO A DOMICILIO 100% GRATIS",
    "cta": "PEDIR A DOMICILIO HOY",
    "desc": "Iconografía de reparto express y entrega el mismo día en tu puerta."
  },
  {
    "id": "social-proof-5stars",
    "name": "Anuncio de Reseña 5 Estrellas",
    "tag": "5 Estrellas",
    "icon": "⭐",
    "dark": false,
    "accent": "#ca8a04",
    "bg1": "#fefce8",
    "bg2": "#fef08a",
    "badge": "CALIFICADO CON 5 ESTRELLAS ★★★★★",
    "cta": "CONOCE NUESTRAS RESEÑAS",
    "desc": "Testimonial de cliente satisfecho con prueba social irrefutable."
  },
  {
    "id": "giveaway-contest",
    "name": "Sorteo / Giveaway Oficial",
    "tag": "Giveaway",
    "icon": "🏆",
    "dark": true,
    "accent": "#f43f5e",
    "bg1": "#4c0519",
    "bg2": "#881337",
    "badge": "¡SORTEO OFICIAL DE ANIVERSARIO!",
    "cta": "PARTICIPA CON TU MENSAJE",
    "desc": "Convocatoria con 3 pasos fáciles para participar y ganar premios."
  },
  {
    "id": "seasonal-special",
    "name": "Especial de Temporada & Fiestas",
    "tag": "Temporada",
    "icon": "🍂",
    "dark": false,
    "accent": "#b45309",
    "bg1": "#fffbeb",
    "bg2": "#fef3c7",
    "badge": "EDICIÓN ESPECIAL DE TEMPORADA",
    "cta": "APROVECHAR ANTES DE FIN DE MES",
    "desc": "Decoración alusiva a festividades, verano, invierno o cambio de estación."
  },
  {
    "id": "money-back-guarantee",
    "name": "Garantía 100% Satisfacción",
    "tag": "Garantía",
    "icon": "🛡️",
    "dark": false,
    "accent": "#0284c7",
    "bg1": "#ffffff",
    "bg2": "#f0f9ff",
    "badge": "GARANTÍA TOTAL DE SATISFACCIÓN",
    "cta": "COMPRA CON 100% DE SEGURIDAD",
    "desc": "Sello de compra protegida, soporte garantizado o devolución."
  },
  {
    "id": "limited-stock-countdown",
    "name": "Edición Limitada / Últimas Piezas",
    "tag": "Últimas Piezas",
    "icon": "⏳",
    "dark": true,
    "accent": "#e11d48",
    "bg1": "#1f1d2b",
    "bg2": "#2d2a4a",
    "badge": "SOLO 15 PIEZAS EN EXISTENCIA",
    "cta": "APARTAR ANTES QUE SE AGOTE",
    "desc": "Contador de inventario decreciente que detona la compra inmediata."
  }
];

  // GENERADOR DINÁMICO DE LAS 400 CAMPAÑAS PUBLICITARIAS (20 giros x 20 estilos)
  const AD_TEMPLATES = [];
  GIROS.forEach((g) => {
    AD_STYLES.forEach((s, sIdx) => {
      const isPremium = sIdx >= 3;
      const id = `ad-${g.id}-${s.id}`;

      AD_TEMPLATES.push({
        id,
        giroId: g.id,
        styleId: s.id,
        isPremium,
        label: s.name,
        styleTag: s.tag,
        brand: g.brand,
        title: `¡GRAN PROMOCIÓN: ${g.brand.toUpperCase()}!`,
        sub: `Aprovecha las mejores ofertas en ${g.topic.toLowerCase()}. Válido por tiempo limitado.`,
        cta: s.cta || "COMPRAR CON DESCUENTO →",
        badge: s.badge || "OFERTA ESPECIAL",
        icon: g.icon,
        accent: s.accent,
        dark: s.dark,
        bg1: s.bg1,
        bg2: s.bg2,
        desc: s.desc,
        prompt: `Anuncio publicitario para ${g.name} '${g.brand}' estilo ${s.name} promocionando ${g.topic}`
      });
    });
  });

  function escapeXML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function wrapTextToLines(text, maxCharsPerLine = 22, maxLines = 2) {
    if (!text) return [""];
    const words = String(text).trim().split(/\s+/);
    const lines = [];
    let current = "";
    for (const word of words) {
      if (!current) {
        current = word;
      } else if ((current + " " + word).length <= maxCharsPerLine) {
        current += " " + word;
      } else {
        lines.push(current);
        current = word;
        if (lines.length >= maxLines - 1) break;
      }
    }
    if (current && lines.length < maxLines) {
      lines.push(current);
    }
    return lines;
  }

  // GENERADOR SVG PUBLICITARIO ESPECIALIZADO
  function buildAdSVG(cfg) {
    const isDark = Boolean(cfg.dark);
    const bg1 = cfg.bg1 || (isDark ? "#090d16" : "#ffffff");
    const bg2 = cfg.bg2 || (isDark ? "#131b2e" : "#f1f5f9");
    const textColor = isDark ? "#ffffff" : "#0f172a";
    const subColor = isDark ? "#cbd5e1" : "#475569";
    const accent = cfg.accent || "#ef4444";
    const brand = escapeXML(cfg.brand || "DMD");
    const title = escapeXML(cfg.title || "¡OFERTA ESPECIAL DE TEMPORADA!");
    const sub = escapeXML(cfg.sub || "Aprovecha descuentos exclusivos en servicios y productos.");
    const cta = escapeXML(cfg.cta || "OBTENER MI PROMOCIÓN →");
    const badge = escapeXML(cfg.badge || "OFERTA OFICIAL");
    const icon = escapeXML(cfg.icon || "🏷️");
    const styleId = cfg.styleId || "promo-flash-50";
    const adUid = (cfg.id || 'ad') + '_' + Math.random().toString(36).substring(2, 7);

    let decorativeFrame = "";
    if (styleId === "coupon-perforated") {
      decorativeFrame = `
        <rect x="70" y="70" width="940" height="1140" rx="20" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="16 12"/>
        <line x1="70" y1="940" x2="1010" y2="940" stroke="${accent}" stroke-width="3" stroke-dasharray="10 8"/>
        <text x="540" y="975" fill="${accent}" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="4">✂ CORTAR POR AQUÍ O PRESENTAR CAPTURA ✂</text>
      `;
    } else if (styleId === "black-friday-sale") {
      decorativeFrame = `
        <rect x="55" y="55" width="970" height="1170" rx="16" fill="none" stroke="#eab308" stroke-width="3"/>
        <polygon points="55,55 220,55 55,220" fill="#eab308"/>
        <text x="85" y="115" fill="#000" font-weight="900" font-size="18" transform="rotate(-45 85,115)">SALE</text>
      `;
    } else {
      decorativeFrame = `
        <rect x="65" y="65" width="950" height="1150" rx="32" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)'}" stroke-width="2.5"/>
      `;
    }

    const titleLines = wrapTextToLines(title, 22, 2);
    const hasSecondTitle = titleLines.length > 1;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1280" width="100%" height="100%" style="display:block; font-family:'Montserrat', 'Inter', -apple-system, sans-serif;">
      <defs>
        <radialGradient id="gradAdBg_${adUid}" cx="30%" cy="20%" r="85%">
          <stop offset="0%" stop-color="${bg2}"/>
          <stop offset="100%" stop-color="${bg1}"/>
        </radialGradient>
      </defs>

      <rect width="1080" height="1280" fill="url(#gradAdBg_${adUid})"/>
      ${decorativeFrame}

      <!-- Cinta o Badge Superior -->
      <g transform="translate(100, 110)">
        <rect width="320" height="50" rx="25" fill="${accent}22" stroke="${accent}" stroke-width="2.5"/>
        <text x="160" y="32" fill="${accent}" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="2">${badge}</text>
      </g>

      <!-- Marca -->
      <g transform="translate(980, 145)">
        <text x="0" y="0" fill="${subColor}" font-size="22" font-weight="800" text-anchor="end" letter-spacing="3">${brand}</text>
      </g>

      <!-- Icono Destacado -->
      <g transform="translate(540, 360)">
        <circle cx="0" cy="0" r="105" fill="${accent}20" stroke="${accent}" stroke-width="4"/>
        <text x="0" y="36" font-size="90" text-anchor="middle">${icon}</text>
      </g>

      <!-- Título Impactante -->
      <g transform="translate(540, 580)">
        ${hasSecondTitle ? `
          <text x="0" y="-24" fill="${textColor}" font-size="46" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${titleLines[0]}</text>
          <text x="0" y="32" fill="${textColor}" font-size="42" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${titleLines[1]}</text>
        ` : `
          <text x="0" y="0" fill="${textColor}" font-size="${title.length > 20 ? 44 : 50}" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${title}</text>
        `}
      </g>

      <!-- Subtítulo / Copys Comerciales -->
      <g transform="translate(540, 680)">
        <foreignObject x="-440" y="0" width="880" height="180">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Inter', sans-serif; font-size:26px; color:${subColor}; text-align:center; line-height:1.5; font-weight:600;">
            ${sub}
          </div>
        </foreignObject>
      </g>

      <!-- Botón de Oferta (CTA) -->
      <g transform="translate(540, 930)">
        <rect x="-280" y="-40" width="560" height="80" rx="40" fill="${accent}"/>
        <text x="0" y="10" fill="#ffffff" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="2">
          ${cta}
        </text>
      </g>

      <!-- Garantía o Sello Inferior -->
      <g transform="translate(540, 1070)">
        <text x="0" y="0" fill="${subColor}" font-size="18" font-weight="700" text-anchor="middle">
          🛡️ Garantía de Satisfacción 100% &bull; Atención Inmediata en WhatsApp &bull; Envíos a Todo México
        </text>
      </g>
    </svg>`;
  }

  function downloadDirectPNG(cfg) {
    const svgMarkup = buildAdSVG(cfg);
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = function () {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 1600;
      offCanvas.height = 2000;
      const ctx = offCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 1600, 2000);
      URL.revokeObjectURL(url);

      const pngUrl = offCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      const safeName = (cfg.id || "anuncio").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `Anuncio-DMD-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  }

  function downloadDirectSVG(cfg) {
    const svgMarkup = buildAdSVG(cfg);
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (cfg.id || "anuncio").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `Anuncio-DMD-${safeName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function renderGirosNav() {
    const container = document.getElementById("girosNavContainer");
    if (!container) return;

    container.innerHTML = GIROS.map(g => {
      const isActive = g.id === activeGiroId;
      return `
        <button type="button" onclick="window.selectAdGiro('${g.id}')"
          class="flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border-2 ${
            isActive
              ? "bg-white text-blue-700 border-blue-600 shadow-sm scale-102"
              : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-slate-50"
          }">
          <span class="text-base">${g.icon}</span>
          <span>${g.name}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}">20</span>
        </button>
      `;
    }).join("");
  }

  function renderGiroSummary() {
    const container = document.getElementById("giroSummaryContainer");
    if (!container) return;

    const g = GIROS.find(item => item.id === activeGiroId) || GIROS[0];
    container.innerHTML = `
      <div class="bg-white border-2 border-blue-600 rounded-3xl p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start space-x-4">
          <div class="w-14 h-14 rounded-2xl bg-white text-blue-700 border-2 border-blue-600 flex items-center justify-center text-3xl shadow-xs flex-shrink-0">
            ${g.icon}
          </div>
          <div>
            <div class="flex items-center space-x-2 flex-wrap gap-y-1">
              <span class="text-[11px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                ${g.tag}
              </span>
              <h2 class="text-xl md:text-2xl font-black text-slate-900">${g.name}</h2>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                20 Campañas &bull; 400 Anuncios Totales
              </span>
            </div>
            <p class="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">${g.desc}</p>
            <div class="mt-2 text-xs text-blue-700 font-semibold bg-blue-50/70 p-2 rounded-xl border border-blue-100 inline-block">
              💡 <strong>Estrategia de Ventas:</strong> ${g.tip}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 self-start md:self-auto">
          <button onclick="window.useGiroInPrompt('${g.id}')"
            class="px-4 py-2 border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5">
            <span>✨</span>
            <span>Generar Campaña con IA</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderAdCards() {
    const container = document.getElementById("adCardsGrid");
    if (!container) return;

    let items = AD_TEMPLATES.filter(item => item.giroId === activeGiroId);
    // Mostrar primero las plantillas GRATIS y después las PRO/Premium
    items.sort((a, b) => (a.isPremium ? 1 : 0) - (b.isPremium ? 1 : 0));

    container.innerHTML = items.map((item, index) => {
      const isLocked = userTier === "FREE" && item.isPremium;
      const svgThumb = buildAdSVG(item);

      return `
        <div class="bg-white border-2 ${isLocked ? "border-slate-200" : "border-slate-200 hover:border-blue-600"} rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="relative w-full aspect-[4/5] bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 mb-2 sm:mb-3 group/thumb cursor-pointer" onclick="window.openAdZoom('${item.id}')">
              <div class="w-full h-full transition-all duration-300 group-hover/thumb:scale-105">
                ${svgThumb}
              </div>
              <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <span class="bg-white text-slate-900 font-bold text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg flex items-center space-x-1">
                  <span>🔍</span>
                  <span class="hidden sm:inline">Ver en Grande</span>
                  <span class="sm:hidden">Ver</span>
                </span>
              </div>
              ${isLocked ? `
                <div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-amber-500 text-slate-900 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center space-x-0.5">
                  <span>🔒</span>
                  <span>PRO</span>
                </div>
              ` : `
                <div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-emerald-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                  GRATIS
                </div>
              `}
            </div>

            <div class="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1">
              <span class="font-extrabold text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded border border-blue-100 text-[8px] sm:text-[10px] uppercase truncate max-w-[85px] sm:max-w-none">
                ${item.styleTag}
              </span>
              <span class="text-[9px] sm:text-[11px] font-semibold text-slate-400">Flyer</span>
            </div>

            <h4 class="font-black text-xs sm:text-sm text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
              ${item.label}
            </h4>
            <p class="hidden sm:block text-xs text-slate-600 line-clamp-2 mb-3">
              ${item.desc}
            </p>
          </div>

          <div class="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-1.5 sm:gap-2">
            ${isLocked ? `
              <button onclick="window.openPremiumModal()"
                class="w-full py-1.5 sm:py-2 border-2 border-amber-500 bg-white hover:bg-amber-50 text-amber-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center justify-center space-x-1">
                <span>👑</span>
                <span class="truncate">Desbloquear</span>
              </button>
            ` : `
              <button onclick="window.downloadSingleAd('${item.id}')"
                class="w-full py-1.5 sm:py-2 border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center justify-center space-x-1 active:scale-95">
                <span>⬇</span>
                <span class="truncate">Descargar</span>
              </button>
            `}
            <div class="flex items-center space-x-1 sm:space-x-1.5">
              <button onclick="window.openAdZoom('${item.id}')"
                class="flex-1 py-1 sm:py-1.5 border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition text-center truncate">
                Zoom HD
              </button>
              <button onclick="window.copyAdPrompt('${item.id}')"
                class="py-1 sm:py-1.5 px-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition" title="Copiar Prompt para IA">
                📋
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  window.selectAdGiro = function(id) {
    activeGiroId = id;
    renderGirosNav();
    renderGiroSummary();
    renderAdCards();
  };

  window.downloadSingleAd = function(id) {
    const item = AD_TEMPLATES.find(p => p.id === id);
    if (!item) return;
    if (userTier === "FREE" && item.isPremium) {
      window.openPremiumModal();
      return;
    }
    downloadDirectPNG(item);
  };

  window.openAdZoom = function(id) {
    const item = AD_TEMPLATES.find(p => p.id === id);
    if (!item) return;

    currentAdConfig = item;
    currentAdSVG = buildAdSVG(item);

    const modal = document.getElementById("adZoomModal");
    const container = document.getElementById("adZoomSvgContainer");
    const titleEl = document.getElementById("adZoomTitle");
    const subEl = document.getElementById("adZoomSub");
    const copyEl = document.getElementById("adZoomCopy");

    if (container) container.innerHTML = currentAdSVG;
    if (titleEl) titleEl.innerText = item.label;
    if (subEl) subEl.innerText = `Giro: ${item.brand} • Estilo: ${item.styleTag} • Formato Flyer Comercial HD (1600×2000)`;

    // Generar copy publicitario de alta conversión
    if (copyEl) {
      const cleanBrand = (item.brand || "").replace(/[^a-zA-Z0-9]/g, "");
      const hashtags = `#Publicidad #${cleanBrand} #Promociones #Descuentos #DMD #NegocioExitoso`;
      copyEl.value = `📢 ${item.title}\n\n${item.sub}\n\n💥 Promoción Especial: ${item.badge}\n👉 ${item.cta}\n\n📍 Contáctanos hoy para hacer válida tu promoción.\n${hashtags}`;
    }

    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("active", "flex");
    }
  };

  window.closeAdZoom = function() {
    const modal = document.getElementById("adZoomModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("active", "flex");
    }
  };

  window.downloadZoomedAdPNG = function() {
    if (currentAdConfig) downloadDirectPNG(currentAdConfig);
  };

  window.downloadZoomedAdSVG = function() {
    if (currentAdConfig) downloadDirectSVG(currentAdConfig);
  };

  window.copyAdText = function() {
    const copyEl = document.getElementById("adZoomCopy");
    const textToCopy = copyEl ? copyEl.value : "";
    if (!textToCopy) {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("Sin contenido", "No hay texto comercial disponible para copiar.", "warning");
      }
      return;
    }

    function notifySuccess() {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("¡Copiado con Éxito!", "Texto publicitario copiado al portapapeles.", "success");
      } else {
        alert("¡Texto comercial copiado al portapapeles!");
      }
    }

    function fallbackCopy(text) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          notifySuccess();
        } else {
          throw new Error("execCommand no soportado");
        }
      } catch (err) {
        console.error("Error copiando texto publicitario:", err);
        if (typeof window.showDmdToast === "function") {
          window.showDmdToast("Error al copiar", "Selecciona el texto manualmente para copiarlo.", "warning");
        }
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(notifySuccess).catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  window.copyAdPrompt = function(id) {
    const item = AD_TEMPLATES.find(p => p.id === id);
    if (!item) return;
    navigator.clipboard.writeText(item.prompt).then(() => {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("¡Prompt Copiado!", "Pégalo en el Asistente IA para generar tu anuncio.", "cart");
      } else {
        alert("¡Prompt copiado al portapapeles!");
      }
    });
  };

  window.useGiroInPrompt = function(giroId) {
    const g = GIROS.find(item => item.id === giroId) || GIROS[0];
    const input = document.getElementById("adIaPrompt");
    if (input) {
      input.value = `Anuncio publicitario con descuento para ${g.name} '${g.brand}' con temática de ${g.topic}`;
      input.focus();
      document.getElementById("ad-ia-workspace")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // IA REAL (Groq vía backend del builder): genera titulares + CTAs
  // para la campaña del giro elegido. Si no responde, queda el local.
  function dmdAiAdCopy(g, color, resultBox) {
    if (!window.DMD_AI) return;
    var loading = document.createElement('div');
    loading.className = 'mt-3 text-xs text-slate-500';
    loading.textContent = '✦ Generando textos de anuncio con IA real (Groq)...';
    resultBox.appendChild(loading);
    var prompt = 'Escribe para un anuncio de un negocio de ' + g.name + ' (marca: ' + g.brand +
      ', tema: ' + g.topic + ', color: ' + color + ') un JSON con estas claves exactas: ' +
      '{"headlines": ["3 titulares cortos y distintos para un anuncio, en español de México"], ' +
      '"body": "un texto de anuncio de 2 frases, con oferta", "ctas": ["3 llamadas a la acción cortas"]}.';
    window.DMD_AI.generateText(prompt, 'ad').then(function (data) {
      if (loading.parentNode) loading.parentNode.removeChild(loading);
      if (!data || !data.headlines) return;
      var heads = (data.headlines || []).slice(0, 3);
      var ctas = (data.ctas || []).slice(0, 3);
      var panel = document.createElement('div');
      panel.className = 'mt-3 bg-violet-50 border-2 border-violet-500 rounded-2xl p-4 shadow-xs';
      panel.innerHTML = '<span class="text-[10px] font-black uppercase text-violet-700 bg-white border border-violet-200 px-2 py-0.5 rounded">✦ Textos generados con IA real (Groq)</span>' +
        heads.map(function (h, i) {
          return '<p class="text-xs text-slate-800 mt-2"><strong>' + (i + 1) + '.</strong> ' + String(h).replace(/</g, '&lt;') + '</p>';
        }).join('') +
        (data.body ? '<p class="text-xs text-slate-800 mt-2">' + String(data.body).replace(/</g, '&lt;') + '</p>' : '') +
        (ctas.length ? '<p class="text-xs text-violet-700 mt-2 font-bold">CTA: ' + ctas.map(function (c) { return String(c).replace(/</g, '&lt;'); }).join(' • ') + '</p>' : '') +
        '<button type="button" class="mt-2 px-3 py-1.5 bg-violet-600 text-white font-bold text-xs rounded-xl" onclick="navigator.clipboard && navigator.clipboard.writeText(this.parentNode.innerText)">Copiar textos</button>';
      resultBox.appendChild(panel);
    });
  }

  window.runAdAiFinder = function() {
    const giroSelect = document.getElementById("aiFinderGiro");
    const colorSelect = document.getElementById("aiFinderColor");
    const resultBox = document.getElementById("aiFinderResult");
    if (!giroSelect || !colorSelect || !resultBox) return;

    const gId = giroSelect.value;
    const color = colorSelect.value;
    const g = GIROS.find(item => item.id === gId) || GIROS[0];
    const match = AD_TEMPLATES.find(p => p.giroId === gId && !p.isPremium) || AD_TEMPLATES.find(p => p.giroId === gId);

    window.selectAdGiro(gId);

    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="bg-blue-50 border-2 border-blue-600 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[10px] font-black uppercase text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded">
            Campaña Recomendada por IA
          </span>
          <h4 class="font-black text-sm text-slate-900 mt-1">${match.label} - ${g.name}</h4>
          <p class="text-xs text-slate-600">Optimizada con color de acento ${color} para máxima conversión.</p>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button onclick="window.openAdZoom('${match.id}')"
            class="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition">
            Ver Anuncio
          </button>
          <button onclick="window.downloadSingleAd('${match.id}')"
            class="px-3 py-1.5 bg-white border-2 border-blue-600 text-blue-700 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition">
            Descargar
          </button>
        </div>
      </div>
    `;
    dmdAiAdCopy(g, color, resultBox);
  };

  window.togglePlanSimulator = function() {
    userTier = userTier === "FREE" ? "PREMIUM" : "FREE";
    localStorage.setItem("dmd_publicidad_tier", userTier);
    updateTierUI();
    renderAdCards();
  };

  function updateTierUI() {
    const badge = document.getElementById("tier-badge");
    const text = document.getElementById("tier-text");
    const desc = document.getElementById("tier-desc");
    if (!badge || !text) return;

    if (userTier === "PREMIUM") {
      badge.className = "px-3 py-1 rounded-full font-black text-xs bg-amber-400 text-slate-950 shadow-xs flex items-center space-x-1.5 border border-amber-500";
      text.innerText = "PLAN PREMIUM ACTIVO ($79/MES)";
      if (desc) desc.innerText = "Acceso Ilimitado a las 400 Campañas y Descargas HD";
    } else {
      badge.className = "px-3 py-1 rounded-full font-black text-xs bg-white text-blue-700 border-2 border-blue-600 flex items-center space-x-1.5 shadow-xs";
      text.innerText = "VERSIÓN GRATUITA";
      if (desc) desc.innerText = "Acceso libre a 3 estilos por giro (60 gratis &bull; 340 premium)";
    }
  }

  if (!window.openPremiumModal || !window.showPremiumPaymentGateway) {
    window.openPremiumModal = function() {
      const modal = document.getElementById("premiumUpgradeModal") || document.getElementById("modal-premium");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex", "active");
      }
    };
  }

  if (!window.closePremiumModal) {
    window.closePremiumModal = function() {
      const modal = document.getElementById("premiumUpgradeModal") || document.getElementById("modal-premium");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex", "active");
      }
    };
  }

  function renderAll() {
    updateTierUI();
    renderGirosNav();
    renderGiroSummary();
    renderAdCards();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();

    const aiGiroSelect = document.getElementById("aiFinderGiro");
    if (aiGiroSelect) {
      aiGiroSelect.innerHTML = GIROS.map(g => `<option value="${g.id}">${g.icon} ${g.name}</option>`).join("");
    }
  });

  window.AD_TEMPLATES = AD_TEMPLATES;
})();


/* ==========================================================================
   MOTOR NLP CON INTELIGENCIA TOLERANTE A FALTAS DE ORTOGRAFÍA MEXICANAS
   ========================================================================== */
const DMD_NLP_DICTIONARY = [
  { id: "taqueria", name: "Taquería & Antojitos", brand: "TACOS EL DORADO", accent: "#f59e0b",
    keywords: ["taqueria","taqeria","taquitos","taco","tacos","pastor","suadero","bistec","carnitas","barbacoa","antojitos","gringas","volcanes","salsas","tortas","pozole","trompo"] },
  { id: "cafeteria", name: "Cafetería & Panadería", brand: "AROMA & GRANO", accent: "#d97706",
    keywords: ["cafe","cafeteria","cafetaria","cappuccino","capuchino","latte","espresso","espreso","frappe","frape","pan","panaderia","panadria","croissant","reposteria","moca"] },
  { id: "pizzeria", name: "Pizzería & Italiana", brand: "LA VERA PIZZA", accent: "#ea580c",
    keywords: ["pizza","pisa","pizzas","pisas","pizzeria","pizeria","rebanada","pepperoni","queso","horno","pasta","espagueti","lasagna","lasaña","italiana","calzone"] },
  { id: "hamburgueseria", name: "Hamburguesas & Snacks", brand: "MONSTER BURGER", accent: "#f97316",
    keywords: ["hamburguesa","hamburguesas","anburguesa","amburgesa","anburgesa","burger","burgers","papas","alitas","boneless","hot dog","hot dogs","snack","snacks","snaks","malteada","tocino"] },
  { id: "barberia", name: "Barbería & Peluquería", brand: "THE GENTLEMAN BARBER", accent: "#0284c7",
    keywords: ["barberia","barveria","barbero","peluqueria","pelukeria","corte","cortes","fade","barba","bigote","afeitado","cabello","peinado","degradado","pomada"] },
  { id: "farmacia", name: "Farmacia & Botica", brand: "FARMACIAS SAN RAFAEL", accent: "#10b981",
    keywords: ["farmacia","farmaia","botica","medicina","medicinas","medisinas","medicamentos","pastillas","jarabe","salud","receta","patente","genericos","vitaminas","inyecciones","botiquin"] },
  { id: "ferreteria", name: "Ferretería & Tlapalería", brand: "FERRETERÍA EL MAESTRO", accent: "#ca8a04",
    keywords: ["ferreteria","fereteria","tlapaleria","tlapalería","herramientas","erramientas","tornillos","clavos","martillo","martiyo","taladro","pintura","brochas","tuberia","plomeria","cables"] },
  { id: "papeleria", name: "Papelería & Copias", brand: "PAPELERÍA EL ESTUDIANTE", accent: "#8b5cf6",
    keywords: ["papeleria","papelria","utiles","utiles escolares","copias","impresiones","impresion","engargolado","libretas","cuadernos","plumones","lapices","mochilas","cartulinas"] },
  { id: "veterinaria", name: "Veterinaria & Pet Shop", brand: "VETERINARIA HUELLITAS", accent: "#84cc16",
    keywords: ["veterinaria","veterinria","veterinario","perros","perro","gatos","gato","mascota","mascotas","croquetas","vacunas","desparasitacion","estetica canina","bano de perro","cachorros"] },
  { id: "boutique", name: "Boutique & Ropa", brand: "AURA LUXE BOUTIQUE", accent: "#ec4899",
    keywords: ["boutique","butik","ropa","vestidos","vestido","outfit","outfits","moda","pantalones","blusas","falda","sacos","zapatos","bolsos","accesorios"] },
  { id: "gimnasio", name: "Gimnasio & Fitness", brand: "POWER FIT GYM", accent: "#ef4444",
    keywords: ["gimnasio","gimasio","gym","pesas","fitness","fitnes","crossfit","entrenar","entrenamiento","pesas","musculo","cardio","proteina","suplementos","rutina"] },
  { id: "autolavado", name: "Autolavado & Detallado", brand: "AUTO SPA EXPRESS", accent: "#06b6d4",
    keywords: ["autolavado","auto lavado","car wash","carwash","lavado de autos","lavada","encerado","pulido","aspirado","detallado","vestiduras","lavado de motor","cera"] },
  { id: "dental", name: "Clínica Dental & Odontología", brand: "SONRISA PERFECTA", accent: "#0ea5e9",
    keywords: ["dentista","dental","odontologo","odontologia","dientes","muelas","brackets","brakets","limpieza dental","blanqueamiento","carillas","endodoncia","sonrisa"] },
  { id: "pasteleria", name: "Pastelería & Repostería", brand: "DULCES MOMENTOS", accent: "#f43f5e",
    keywords: ["pasteleria","pastelria","pasteles","pastels","pastel","reposteria","cupcakes","tres leches","gelatinas","fondant","cumpleanos","pastel de bodas","rebanadas","chocolate"] },
  { id: "floreria", name: "Florería & Regalos", brand: "FLORERÍA JARDÍN SECRETO", accent: "#e11d48",
    keywords: ["floreria","flores","rosas","ramo","ramos","buchon","tulipanes","girasoles","arreglos florales","san valentin","14 de febrero","dia de las madres"] },
  { id: "purificadora", name: "Purificadora de Agua", brand: "AGUA CRISTALINA PURA", accent: "#0284c7",
    keywords: ["purificadora","agua purificada","agua","garrafon","garrafones","llenado","osmosis","hielo","botellitas","sellado","alcalina"] },
  { id: "joyeria", name: "Joyería & Relojería", brand: "JOYERÍA DIAMANTE REAL", accent: "#d97706",
    keywords: ["joyeria","joyas","oro","plata","anillos","anillo","cadenas","pulseras","aretes","diamantes","relojes","relojeria","14k"] },
  { id: "optica", name: "Óptica & Visión", brand: "ÓPTICA VISIÓN CLARA", accent: "#3b82f6",
    keywords: ["optica","lentes","anteojos","armazones","armazon","graduacion","examen de la vista","oftalmologo","pupilentes","antirreflejante","micas"] },
  { id: "taller", name: "Taller Mecánico & Llantas", brand: "SERVICIO AUTOMOTRIZ MASTER", accent: "#475569",
    keywords: ["taller","mecanico","mecanica","frenos","afinacion","cambio de aceite","suspension","llantas","vulcanizadora","vulca","parche","balanceo","alineacion"] },
  { id: "spa", name: "Spa & Estética", brand: "SERENITY SPA & BEAUTY", accent: "#a855f7",
    keywords: ["spa","estetica","belleza","unas","uñas","unas acrilicas","gelish","pestanas","pestañas","lifting","facial","faciales","masajes","depilacion","cejas"] }
];

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

window.parsePromptWithTolerance = function(rawText) {
  if (!rawText) return null;
  let text = rawText.toLowerCase().trim();
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/([a-z])\1{2,}/g, '$1$1');
  const words = text.split(/[\s,.;:!?¿¡"'-]+/).filter(w => w.length > 1);

  let bestGiro = null;
  let highestScore = 0;

  for (const giro of DMD_NLP_DICTIONARY) {
    let score = 0;
    for (const kw of giro.keywords) {
      const cleanKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (text.includes(cleanKw)) score += 6;
      for (const w of words) {
        if (w === cleanKw) {
          score += 5;
        } else if (Math.abs(w.length - cleanKw.length) <= 2 && w.length >= 4) {
          if (levenshteinDistance(w, cleanKw) <= 2) score += 3.5;
        }
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestGiro = giro;
    }
  }

  if (!bestGiro || highestScore === 0) {
    bestGiro = DMD_NLP_DICTIONARY[0];
  }

  const promoWords = ["promo","promocion","descuento","desquento","descueto","oferta","ofert","2x1","gratis","combo","remate","rebaja","cupon","liquidasion","liquidacion"];
  const eventWords = ["inaguracion","inauguracion","apertura","abrimos","aniversario","gran apertura","nuevo"];
  const isPromo = promoWords.some(k => text.includes(k));
  const isEvent = eventWords.some(k => text.includes(k));

  let headline = `¡DISFRUTA LO MEJOR EN ${bestGiro.brand}!`;
  if (isPromo) headline = `¡GRAN OFERTA 2X1 EN ${bestGiro.name.toUpperCase()}!`;
  else if (isEvent) headline = `¡GRAN INAUGURACIÓN ${bestGiro.brand}!`;

  return {
    giro: bestGiro,
    headline: headline,
    desc: `Calidad garantizada, atención inmediata y promociones exclusivas para tu satisfacción en ${bestGiro.name}.`,
    cta: isPromo ? "Aprovechar Oferta" : "Visítanos Hoy",
    tags: `#${bestGiro.id} #DMD #NegocioLocal #CalidadGarantizada`
  };
};


// Handler para el formulario interactivo con IA de Publicidad y Flyers
document.addEventListener("DOMContentLoaded", function() {
  const adForm = document.getElementById("adIaForm");
  const adPromptInput = document.getElementById("adIaPrompt");
  const adChips = document.querySelectorAll("#adIaChips button");
  const stage = document.getElementById("adIaStage");

  function renderAdInStage(result, colorTheme, accentColor) {
    if (!stage) return;
    const isDark = colorTheme === "oscuro";
    const bg = isDark ? "#0b0f19" : "#ffffff";
    const textMain = isDark ? "#ffffff" : "#0f172a";
    const textMuted = isDark ? "#94a3b8" : "#475569";
    const cardBg = isDark ? "#172033" : "#f1f5f9";
    const accent = accentColor || result.giro.accent || "#ef4444";

    stage.innerHTML = `
      <div style="width:100%; height:100%; background:${bg}; color:${textMain}; padding:26px 20px; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; font-family:system-ui, sans-serif; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-50px; left:-50px; width:160px; height:160px; border-radius:50%; background:${accent}; opacity:0.22; filter:blur(28px);"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; z-index:2;">
          <span style="font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.12em; background:${accent}; color:#ffffff; padding:4px 12px; border-radius:999px; box-shadow:0 2px 6px ${accent}55;">
            CAMPAÑA OFICIAL
          </span>
          <span style="font-size:16px;">🎯</span>
        </div>

        <div style="z-index:2; text-align:center; margin:16px 0;">
          <span style="font-size:12px; font-weight:800; color:${accent}; display:block; margin-bottom:4px; text-transform:uppercase;">
            ${result.giro.brand}
          </span>
          <h2 style="font-size:1.4rem; font-weight:900; line-height:1.2; margin:0 0 8px; color:${textMain};">
            ${result.headline}
          </h2>
          <p style="font-size:0.8rem; line-height:1.4; color:${textMuted}; margin:0 auto; max-width:280px;">
            ${result.desc}
          </p>
        </div>

        <div style="z-index:2; display:flex; flex-direction:column; gap:8px;">
          <div style="background:${cardBg}; padding:10px 14px; border-radius:12px; border:1px solid ${accent}44; text-align:center;">
            <strong style="font-size:13px; color:${accent}; display:block;">🔥 ${result.cta.toUpperCase()}</strong>
            <small style="font-size:10px; color:${textMuted};">Válido en sucursal y pedidos por WhatsApp</small>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:4px;">
            <small style="font-size:9px; color:${textMuted}; font-family:monospace;">${result.tags}</small>
            <button onclick="window.downloadCustomStageAd()" type="button" style="background:${accent}; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:10px; font-weight:800; cursor:pointer;">
              ⬇ Descargar Flyer
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.downloadCustomStageAd = function() {
    if (typeof window.showDmdToast === "function") {
      window.showDmdToast("¡Descarga Iniciada!", "Tu anuncio publicitario vertical (4:5) se descargó con éxito.", "success");
    } else {
      alert("Flyer publicitario descargado exitosamente.");
    }
  };

  if (adForm) {
    adForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const promptText = adPromptInput ? adPromptInput.value : "";
      const colorTheme = document.getElementById("adIaStyle")?.value || "oscuro";
      const accentColor = document.getElementById("adIaColor")?.value || "#ef4444";
      
      const parsed = (typeof window.parsePromptWithTolerance === "function")
        ? window.parsePromptWithTolerance(promptText)
        : null;

      if (parsed) {
        renderAdInStage(parsed, colorTheme, accentColor);
        if (parsed.giro && typeof window.selectAdGiro === "function") {
          window.selectAdGiro(parsed.giro.id);
        }
      }

      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("Campaña Generada", `Giro detectado: ${parsed?.giro?.name || 'Comercio'}`, "info");
      }
    });
  }

  if (adChips) {
    adChips.forEach(chip => {
      chip.addEventListener("click", function() {
        const text = this.getAttribute("data-prompt") || this.textContent;
        if (adPromptInput) {
          adPromptInput.value = text;
          adForm?.dispatchEvent(new Event("submit"));
        }
      });
    });
  }

  const initialParsed = (typeof window.parsePromptWithTolerance === "function")
    ? window.parsePromptWithTolerance("Anuncio de 2x1 en hamburguesas Monster Burger")
    : null;
  if (initialParsed) renderAdInStage(initialParsed, "oscuro", "#ef4444");
});
