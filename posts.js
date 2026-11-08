/**
 * posts.js - DMD
 * Catálogo y Creador de Posts para Redes Sociales con IA
 * ESTRUCTURA OFICIAL:
 * - 20 Giros Comerciales x 20 Estilos Visuales = 400 Plantillas Únicas de Posts
 * - Barra superior de Plan Gratuito vs Premium ($79/mes)
 * - Asistente IA para recomendación por giro y color
 * - Filtro de búsqueda en vivo por nombre y estilo
 * - Tarjetas con fondo blanco, contorno azul rey y zoom interactivo al hover
 * - Botón principal: "Descargar post de redes"
 * - Modal HD con previsualizador y descarga directa PNG 1600x1600 y SVG
 */

(function () {
  "use strict";

  let userTier = localStorage.getItem("dmd_posts_tier") || "FREE";
  let activeGiroId = "cafeteria";
  let activeStyleFilter = "ALL";
  let searchQuery = "";
  let currentPostSVG = "";
  let currentPostConfig = null;

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
  const STYLES = [
  {
    "id": "minimal-swiss",
    "name": "Minimalista Suizo (Clean White)",
    "tag": "Limpio",
    "icon": "✨",
    "dark": false,
    "accent": "#2563eb",
    "bg1": "#ffffff",
    "bg2": "#f8fafc",
    "badge": "MINIMAL DESIGN",
    "desc": "Fondo blanco puro, tipografía bold sans-serif y alto espacio negativo."
  },
  {
    "id": "neon-cyberpunk",
    "name": "Neón Cyberpunk / Luces Glow",
    "tag": "Neón",
    "icon": "⚡",
    "dark": true,
    "accent": "#06b6d4",
    "bg1": "#070b14",
    "bg2": "#0f172a",
    "badge": "CYBER GLOW",
    "desc": "Alto contraste nocturno con doble aura de iluminación cian y magenta."
  },
  {
    "id": "luxury-dark-gold",
    "name": "Dark Luxury & Oro Metálico",
    "tag": "Exclusivo",
    "icon": "👑",
    "dark": true,
    "accent": "#f59e0b",
    "bg1": "#0a0a0c",
    "bg2": "#18181b",
    "badge": "EDICIÓN LUXURY",
    "desc": "Negro obsidiana con tipografía serif y acentos dorados para alta gama."
  },
  {
    "id": "brutalism-pop",
    "name": "Brutalismo Gráfico Pop",
    "tag": "Impacto",
    "icon": "💥",
    "dark": false,
    "accent": "#ef4444",
    "bg1": "#fef08a",
    "bg2": "#ffffff",
    "badge": "NEO BRUTALISM",
    "desc": "Bordes negros hipermarcados, sombras sólidas y shock visual."
  },
  {
    "id": "glassmorphism-frost",
    "name": "Glassmorphism Cristal Frost",
    "tag": "Moderno",
    "icon": "💎",
    "dark": true,
    "accent": "#38bdf8",
    "bg1": "#0f172a",
    "bg2": "#1e293b",
    "badge": "AERO GLASS",
    "desc": "Transparencias translúcidas con desenfoque de fondo y brillos tipo iOS."
  },
  {
    "id": "retro-pop-90s",
    "name": "Retro Pop & Memphis 90s",
    "tag": "Retro",
    "icon": "📼",
    "dark": false,
    "accent": "#a855f7",
    "bg1": "#fae8ff",
    "bg2": "#f3e8ff",
    "badge": "RETRO WAVE",
    "desc": "Patrones geométricos vibrantes y nostalgia de los años 90."
  },
  {
    "id": "corporate-royal-blue",
    "name": "Corporativo Azul Rey DMD",
    "tag": "Oficial",
    "icon": "🛡️",
    "dark": false,
    "accent": "#2563eb",
    "bg1": "#ffffff",
    "bg2": "#eff6ff",
    "badge": "DMD OFICIAL",
    "desc": "Identidad formal de DMD con blanco y azul rey."
  },
  {
    "id": "pastel-kawaii",
    "name": "Pastel Kawaii & Soft Tone",
    "tag": "Cute",
    "icon": "🌸",
    "dark": false,
    "accent": "#f472b6",
    "bg1": "#fdf2f8",
    "bg2": "#fce7f3",
    "badge": "SWEET VIBES",
    "desc": "Algodón de azúcar, esquinas orgánicas y estética amigable."
  },
  {
    "id": "editorial-vogue",
    "name": "Editorial Vogue & Fashion",
    "tag": "Editorial",
    "icon": "📸",
    "dark": false,
    "accent": "#000000",
    "bg1": "#fafaf9",
    "bg2": "#f5f5f4",
    "badge": "VOGUE STYLE",
    "desc": "Composición asimétrica de revista internacional con tipografía serif."
  },
  {
    "id": "cyber-terminal",
    "name": "Cyber Terminal Hacker Matrix",
    "tag": "Hacker",
    "icon": "💻",
    "dark": true,
    "accent": "#22c55e",
    "bg1": "#020804",
    "bg2": "#051f0e",
    "badge": "ROOT ACCESS",
    "desc": "Consola de comando con fósforo verde y estética de desarrollador."
  },
  {
    "id": "vibrant-gradient",
    "name": "Degradado Dinámico TikTok/IG",
    "tag": "Viral",
    "icon": "🔥",
    "dark": true,
    "accent": "#f97316",
    "bg1": "#4c0519",
    "bg2": "#831843",
    "badge": "VIRAL FEED",
    "desc": "Gradientes de atardecer magenta-naranja para retener el scroll."
  },
  {
    "id": "clean-flat-material",
    "name": "Clean Flat Material UI",
    "tag": "Material",
    "icon": "📐",
    "dark": false,
    "accent": "#0d9488",
    "bg1": "#ffffff",
    "bg2": "#f0fdfa",
    "badge": "MATERIAL 3",
    "desc": "Sombras sutiles, paleta teal armónica y jerarquía tipográfica."
  },
  {
    "id": "vintage-kraft",
    "name": "Papel Kraft & Sello Rústico",
    "tag": "Rústico",
    "icon": "📜",
    "dark": false,
    "accent": "#92400e",
    "bg1": "#fef3c7",
    "bg2": "#fde68a",
    "badge": "HECHO A MANO",
    "desc": "Tonos tierra orgánicos con sellos circulares de autenticidad artesanal."
  },
  {
    "id": "monochrome-stark",
    "name": "Alto Contraste Monocromo B&W",
    "tag": "B&W",
    "icon": "⚪",
    "dark": true,
    "accent": "#ffffff",
    "bg1": "#000000",
    "bg2": "#18181b",
    "badge": "MONO CONTRAST",
    "desc": "Contraste absoluto en blanco y negro, máxima legibilidad directa."
  },
  {
    "id": "warm-sunset",
    "name": "Atardecer Cálido Golden Hour",
    "tag": "Cálido",
    "icon": "🌅",
    "dark": true,
    "accent": "#fbbf24",
    "bg1": "#1c1917",
    "bg2": "#451a03",
    "badge": "GOLDEN HOUR",
    "desc": "Tonos crepusculares dorados y amaderados que evocan calidez."
  },
  {
    "id": "infographic-stats",
    "name": "Infografía & Métricas Clave",
    "tag": "Datos",
    "icon": "📊",
    "dark": false,
    "accent": "#4f46e5",
    "bg1": "#ffffff",
    "bg2": "#eef2ff",
    "badge": "DATA & METRICS",
    "desc": "Formato de métricas, porcentajes y listas de valor para guardados."
  },
  {
    "id": "bold-diagonal",
    "name": "Póster Dinámico Diagonal",
    "tag": "Deportivo",
    "icon": "⚡",
    "dark": true,
    "accent": "#e11d48",
    "bg1": "#111827",
    "bg2": "#1f2937",
    "badge": "ACTION POSTER",
    "desc": "Franjas angulares a 45 grados y energía para marcas activas."
  },
  {
    "id": "emerald-prestige",
    "name": "Esmeralda Prestigio & Bienestar",
    "tag": "Bienestar",
    "icon": "🌿",
    "dark": false,
    "accent": "#059669",
    "bg1": "#ffffff",
    "bg2": "#ecfdf5",
    "badge": "WELLNESS & HEALTH",
    "desc": "Verde esmeralda y menta que transmiten balance y confianza."
  },
  {
    "id": "claymorphism-3d",
    "name": "Claymorphism 3D Suave",
    "tag": "3D",
    "icon": "🎈",
    "dark": false,
    "accent": "#8b5cf6",
    "bg1": "#f5f3ff",
    "bg2": "#ede9fe",
    "badge": "3D CLAY",
    "desc": "Efecto esponjoso con sombras suaves que simulan volumen 3D."
  },
  {
    "id": "ultra-apple",
    "name": "Ultra Clean Estilo Cupertino",
    "tag": "Cupertino",
    "icon": "🍎",
    "dark": false,
    "accent": "#1e293b",
    "bg1": "#ffffff",
    "bg2": "#f8fafc",
    "badge": "PRO DESIGN",
    "desc": "Estética sobria y moderna inspirada en lanzamientos Apple."
  }
];

  // GENERADOR DINÁMICO DE LAS 400 PLANTILLAS DE POSTS (20 giros x 20 estilos)
  const POST_TEMPLATES = [];
  GIROS.forEach((g, gIdx) => {
    STYLES.forEach((s, sIdx) => {
      const isPremium = sIdx >= 3; // 3 gratis por giro, 17 con membresía
      const id = `${g.id}-${s.id}`;
      
      let title = "";
      let sub = "";
      let cta = "";
      
      // Personalización por estilo y giro
      if (s.id === "minimal-swiss") {
        title = `${g.brand}: LO ESENCIAL`;
        sub = `Descubre la calidad pura en ${g.topic.toLowerCase()}. Diseñado para quienes aprecian los detalles.`;
        cta = "DESCUBRIR MÁS →";
      } else if (s.id === "neon-cyberpunk") {
        title = `${g.brand} NIGHT VIBES`;
        sub = `La energía de la noche se vive con ${g.topic.toLowerCase()}. Disponible hasta tarde.`;
        cta = "ENCUÉNTRANOS AQUÍ ⚡";
      } else if (s.id === "luxury-dark-gold") {
        title = `LA EXCELENCIA DE ${g.brand}`;
        sub = `Una experiencia exclusiva en ${g.topic.toLowerCase()}. Creado para paladares y gustos exigentes.`;
        cta = "RESERVAR EXPERIENCIA 👑";
      } else if (s.id === "brutalism-pop") {
        title = `¡HOY TOCA ${g.brand.toUpperCase()}!`;
        sub = `Sin rodeos ni letras chiquitas: lo mejor en ${g.topic.toLowerCase()} al mejor precio.`;
        cta = "¡LO QUIERO AHORA! 💥";
      } else if (s.id === "glassmorphism-frost") {
        title = `INNOVACIÓN EN ${g.brand}`;
        sub = `Conectamos contigo a través de ${g.topic.toLowerCase()}. Calidad que se siente al instante.`;
        cta = "VER DETALLES DIGITALES 💎";
      } else if (s.id === "retro-pop-90s") {
        title = `¡RECORDAR ES VIVIR!`;
        sub = `El sabor y tradición clásica de ${g.topic.toLowerCase()} que nunca pasa de moda.`;
        cta = "COMENTA SI TE ACUERDAS 📼";
      } else if (s.id === "corporate-royal-blue") {
        title = `CONFIANZA TOTAL: ${g.brand}`;
        sub = `Especialistas certificados en ${g.topic.toLowerCase()}. Garantía y respaldo en cada servicio.`;
        cta = "SOLICITAR INFORMACIÓN 🛡️";
      } else if (s.id === "pastel-kawaii") {
        title = `UN DETALLE DULCE PARA TI`;
        sub = `Consiéntete hoy con ${g.topic.toLowerCase()}. Te esperamos con la mejor sonrisa.`;
        cta = "ETIQUETA A TU AMIG@ 🌸";
      } else if (s.id === "editorial-vogue") {
        title = `TENDENCIA & ESTILO: ${g.brand}`;
        sub = `La nueva temporada de ${g.topic.toLowerCase()} ya está aquí. Inspiración pura.`;
        cta = "LEER LA HISTORIA 📸";
      } else if (s.id === "cyber-terminal") {
        title = `> SYSTEM_INIT: ${g.brand.replace(/\s+/g, '_')}`;
        sub = `Ejecutando protocolo de ${g.topic.toLowerCase()}. Eficiencia y precisión en cada proceso.`;
        cta = "$ sudo run --now 💻";
      } else if (s.id === "vibrant-gradient") {
        title = `¿YA PROBASTE ${g.brand}?`;
        sub = `Vota en comentarios tu favorito de ${g.topic.toLowerCase()} y participa por una sorpresa.`;
        cta = "VOTA CON TU EMOJI 🔥";
      } else if (s.id === "clean-flat-material") {
        title = `SIMPLICIDAD & CALIDAD`;
        sub = `Todo lo que necesitas en ${g.topic.toLowerCase()} en un solo lugar y sin complicaciones.`;
        cta = "CONOCER MÁS 📐";
      } else if (s.id === "vintage-kraft") {
        title = `TRADICIÓN DESDE EL ORIGEN`;
        sub = `Hecho a mano con dedicación. La receta auténtica de ${g.topic.toLowerCase()}.`;
        cta = "VISÍTANOS HOY 📜";
      } else if (s.id === "monochrome-stark") {
        title = `SIN DISTRACCIONES: ${g.brand}`;
        sub = `Pura sustancia. Lo mejor en ${g.topic.toLowerCase()} con la mayor honestidad.`;
        cta = "CONOCE NUESTRA FILOSOFÍA ⚪";
      } else if (s.id === "warm-sunset") {
        title = `EL MEJOR MOMENTO DEL DÍA`;
        sub = `Disfruta el atardecer con ${g.topic.toLowerCase()}. El plan perfecto para hoy.`;
        cta = "¿CON QUIÉN VIENES HOY? 🌅";
      } else if (s.id === "infographic-stats") {
        title = `3 RAZONES PARA ELEGIR ${g.brand}`;
        sub = `1. Calidad certificada. 2. Atención express. 3. Los mejores en ${g.topic.toLowerCase()}.`;
        cta = "GUARDA ESTA INFORMACIÓN 📊";
      } else if (s.id === "bold-diagonal") {
        title = `¡SUPERA TUS LÍMITES!`;
        sub = `La potencia y energía de ${g.topic.toLowerCase()} listas para acompañarte hoy.`;
        cta = "¡ACTÍVATE AHORA! ⚡";
      } else if (s.id === "emerald-prestige") {
        title = `TU BIENESTAR ES PRIMERO`;
        sub = `Cuida lo más importante con especialistas en ${g.topic.toLowerCase()}. Equilibrio y salud.`;
        cta = "AGENDA TU CITA 🌿";
      } else if (s.id === "claymorphism-3d") {
        title = `DIVERSIÓN & COLOR EN ${g.brand}`;
        sub = `Dale un giro alegre a tu día disfrutando ${g.topic.toLowerCase()}.`;
        cta = "¡PIDE POR WHATSAPP! 🎈";
      } else {
        title = `SIMPLEMENTE ${g.brand}`;
        sub = `Diseño y ejecución impecable en ${g.topic.toLowerCase()}.`;
        cta = "MÁS INFORMACIÓN 🍎";
      }

      POST_TEMPLATES.push({
        id,
        giroId: g.id,
        styleId: s.id,
        isPremium,
        label: s.name,
        styleTag: s.tag,
        brand: g.brand,
        title,
        sub,
        cta,
        badge: s.badge,
        icon: g.icon,
        accent: s.accent,
        dark: s.dark,
        bg1: s.bg1,
        bg2: s.bg2,
        desc: s.desc,
        prompt: `Post para Instagram de ${g.name} '${g.brand}' estilo ${s.name} promocionando ${g.topic}`
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

  // GENERADOR SVG AVANZADO POR ESTILO
  function buildPostSVG(cfg) {
    const isDark = Boolean(cfg.dark);
    const bg1 = cfg.bg1 || (isDark ? "#090d16" : "#ffffff");
    const bg2 = cfg.bg2 || (isDark ? "#131b2e" : "#f1f5f9");
    const textColor = isDark ? "#ffffff" : "#0f172a";
    const subColor = isDark ? "#cbd5e1" : "#475569";
    const accent = cfg.accent || "#2563eb";
    const brand = escapeXML(cfg.brand || "DMD");
    const title = escapeXML(cfg.title || "¿CÓMO TOMAS TU CAFÉ?");
    const sub = escapeXML(cfg.sub || "Comparte tu respuesta y etiqueta a un amigo.");
    const cta = escapeXML(cfg.cta || "COMENTA Y COMPARTE 👇");
    const badge = escapeXML(cfg.badge || "POST VIRAL");
    const icon = escapeXML(cfg.icon || "✦");
    const styleId = cfg.styleId || "minimal-swiss";
    const postUid = (cfg.id || 'post') + '_' + Math.random().toString(36).substring(2, 7);

    // Efectos específicos según el estilo visual
    let extraGfx = "";
    if (styleId === "neon-cyberpunk") {
      extraGfx = `
        <circle cx="880" cy="880" r="480" fill="url(#gradAura_${postUid})" opacity="0.6"/>
        <circle cx="200" cy="200" r="340" fill="url(#gradAura_${postUid})" opacity="0.4"/>
        <rect x="50" y="50" width="980" height="980" rx="32" fill="none" stroke="${accent}" stroke-width="4" filter="drop-shadow(0 0 16px ${accent})"/>
      `;
    } else if (styleId === "brutalism-pop") {
      extraGfx = `
        <rect x="75" y="75" width="940" height="940" rx="0" fill="none" stroke="#000000" stroke-width="8"/>
        <rect x="95" y="95" width="220" height="50" fill="#000000"/>
      `;
    } else if (styleId === "retro-pop-90s") {
      extraGfx = `
        <rect x="65" y="65" width="950" height="950" rx="28" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="14 10"/>
        <polygon points="120,860 160,820 180,870" fill="${accent}" opacity="0.5"/>
        <circle cx="920" cy="850" r="30" fill="none" stroke="${accent}" stroke-width="5"/>
      `;
    } else if (styleId === "luxury-dark-gold") {
      extraGfx = `
        <rect x="60" y="60" width="960" height="960" rx="16" fill="none" stroke="${accent}" stroke-width="2"/>
        <rect x="76" y="76" width="928" height="928" rx="10" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="6 6"/>
      `;
    } else if (styleId === "cyber-terminal") {
      extraGfx = `
        <line x1="80" y1="200" x2="1000" y2="200" stroke="${accent}" stroke-width="2" opacity="0.4"/>
        <text x="100" y="160" fill="${accent}" font-family="monospace" font-size="20">&gt; HOST: localhost:8080 // DMD_CORE_v3.2</text>
      `;
    } else {
      extraGfx = `
        <rect x="70" y="70" width="940" height="940" rx="36" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)'}" stroke-width="2.5"/>
      `;
    }

    const titleLines = wrapTextToLines(title, 22, 2);
    const hasSecondTitle = titleLines.length > 1;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="100%" height="100%" style="display:block; font-family:'Montserrat', 'Inter', -apple-system, sans-serif;">
      <defs>
        <radialGradient id="gradPostBg_${postUid}" cx="30%" cy="25%" r="85%">
          <stop offset="0%" stop-color="${bg2}"/>
          <stop offset="100%" stop-color="${bg1}"/>
        </radialGradient>
        <radialGradient id="gradAura_${postUid}" cx="80%" cy="80%" r="50%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.36"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1080" height="1080" fill="url(#gradPostBg_${postUid})"/>
      ${extraGfx}

      <!-- Badge Superior -->
      <g transform="translate(110, 115)">
        <rect width="280" height="46" rx="23" fill="${accent}22" stroke="${accent}" stroke-width="2"/>
        <text x="140" y="30" fill="${accent}" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="2">${badge}</text>
      </g>

      <!-- Marca y Giro -->
      <g transform="translate(970, 145)">
        <text x="0" y="0" fill="${subColor}" font-size="20" font-weight="800" text-anchor="end" letter-spacing="3">${brand}</text>
      </g>

      <!-- Icono Central con Halo -->
      <g transform="translate(540, 360)">
        <circle cx="0" cy="0" r="95" fill="${accent}18" stroke="${accent}" stroke-width="3"/>
        <text x="0" y="32" font-size="82" text-anchor="middle">${icon}</text>
      </g>

      <!-- Título Principal del Post -->
      <g transform="translate(540, 560)">
        ${hasSecondTitle ? `
          <text x="0" y="-22" fill="${textColor}" font-size="42" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${titleLines[0]}</text>
          <text x="0" y="30" fill="${textColor}" font-size="38" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${titleLines[1]}</text>
        ` : `
          <text x="0" y="0" fill="${textColor}" font-size="${title.length > 20 ? 38 : 44}" font-weight="900" text-anchor="middle" letter-spacing="-0.5">${title}</text>
        `}
      </g>

      <!-- Subtítulo / Descripción del Post -->
      <g transform="translate(540, 645)">
        <foreignObject x="-420" y="0" width="840" height="150">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Inter', sans-serif; font-size:24px; color:${subColor}; text-align:center; line-height:1.5; font-weight:600;">
            ${sub}
          </div>
        </foreignObject>
      </g>

      <!-- Botón de Llamada a la Acción (CTA) -->
      <g transform="translate(540, 830)">
        <rect x="-260" y="-36" width="520" height="72" rx="36" fill="${accent}"/>
        <text x="0" y="9" fill="#ffffff" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="2">
          ${cta}
        </text>
      </g>

      <!-- Pie de Post (Social Bar) -->
      <g transform="translate(540, 940)">
        <text x="0" y="0" fill="${subColor}" font-size="18" font-weight="700" text-anchor="middle" opacity="0.8">
          ❤️ Me gusta &nbsp;·&nbsp; 💬 Comenta &nbsp;·&nbsp; 🔁 Comparte &nbsp;·&nbsp; 📌 Guarda
        </text>
      </g>
    </svg>`;
  }

  // Descarga directa a PNG 1600x1600
  function downloadDirectPNG(cfg) {
    const svgMarkup = buildPostSVG(cfg);
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = function () {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 1600;
      offCanvas.height = 1600;
      const ctx = offCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 1600, 1600);
      URL.revokeObjectURL(url);

      const pngUrl = offCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      const safeName = (cfg.id || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `Post-DMD-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  }

  // Descarga directa a SVG
  function downloadDirectSVG(cfg) {
    const svgMarkup = buildPostSVG(cfg);
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (cfg.id || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `Post-DMD-${safeName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // UI: Renderizado de navegación de 20 Giros
  function renderGirosNav() {
    const container = document.getElementById("girosNavContainer");
    if (!container) return;

    container.innerHTML = GIROS.map(g => {
      const isActive = g.id === activeGiroId;
      return `
        <button type="button" onclick="window.selectPostGiro('${g.id}')"
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

  // UI: Resumen del Giro Activo con Contador Oficial de 400 Plantillas
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
                20 Estilos Únicos &bull; 400 Plantillas Totales
              </span>
            </div>
            <p class="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">${g.desc}</p>
            <div class="mt-2 text-xs text-blue-700 font-semibold bg-blue-50/70 p-2 rounded-xl border border-blue-100 inline-block">
              💡 <strong>Estrategia Viral:</strong> ${g.tip}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 self-start md:self-auto">
          <button onclick="window.useGiroInPrompt('${g.id}')"
            class="px-4 py-2 border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5">
            <span>✨</span>
            <span>Generar con IA para este giro</span>
          </button>
        </div>
      </div>
    `;
  }

  // UI: Renderizado de la Cuadrícula de 20 Plantillas del Giro Activo
  function renderPostCards() {
    const container = document.getElementById("postCardsGrid");
    if (!container) return;

    let items = POST_TEMPLATES.filter(item => item.giroId === activeGiroId);
    
    // Filtrado por buscador si existe
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(item => item.label.toLowerCase().includes(q) || item.styleTag.toLowerCase().includes(q) || item.title.toLowerCase().includes(q));
    }

    // Mostrar primero las plantillas GRATIS y después las PRO/Premium
    items.sort((a, b) => (a.isPremium ? 1 : 0) - (b.isPremium ? 1 : 0));

    container.innerHTML = items.map((item, index) => {
      const isLocked = userTier === "FREE" && item.isPremium;
      const svgThumb = buildPostSVG(item);

      return `
        <div class="bg-white border-2 ${isLocked ? "border-slate-200" : "border-slate-200 hover:border-blue-600"} rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <!-- Miniatura interactiva con zoom al hover -->
            <div class="relative w-full aspect-square bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 mb-2 sm:mb-3 group/thumb cursor-pointer" onclick="window.openPostZoom('${item.id}')">
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

            <!-- Información del Post -->
            <div class="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1">
              <span class="font-extrabold text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded border border-blue-100 text-[8px] sm:text-[10px] uppercase truncate max-w-[85px] sm:max-w-none">
                ${item.styleTag}
              </span>
              <span class="text-[9px] sm:text-[11px] font-semibold text-slate-400">1:1 Feed</span>
            </div>

            <h4 class="font-black text-xs sm:text-sm text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
              ${item.label}
            </h4>
            <p class="hidden sm:block text-xs text-slate-600 line-clamp-2 mb-3">
              ${item.desc}
            </p>
          </div>

          <!-- Botones de Acción (Fondo Blanco, Contorno Azul Rey) -->
          <div class="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-1.5 sm:gap-2">
            ${isLocked ? `
              <button onclick="window.openPremiumModal()"
                class="w-full py-1.5 sm:py-2 border-2 border-amber-500 bg-white hover:bg-amber-50 text-amber-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center justify-center space-x-1">
                <span>👑</span>
                <span class="truncate">Desbloquear</span>
              </button>
            ` : `
              <button onclick="window.downloadSinglePost('${item.id}')"
                class="w-full py-1.5 sm:py-2 border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center justify-center space-x-1 active:scale-95">
                <span>⬇</span>
                <span class="truncate">Descargar</span>
              </button>
            `}
            <div class="flex items-center space-x-1 sm:space-x-1.5">
              <button onclick="window.openPostZoom('${item.id}')"
                class="flex-1 py-1 sm:py-1.5 border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition text-center truncate">
                Zoom HD
              </button>
              <button onclick="window.copyPostPrompt('${item.id}')"
                class="py-1 sm:py-1.5 px-2 border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition" title="Copiar Prompt para IA">
                📋
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Modales y Acciones
  window.selectPostGiro = function(id) {
    activeGiroId = id;
    renderGirosNav();
    renderGiroSummary();
    renderPostCards();
  };

  window.downloadSinglePost = function(id) {
    const item = POST_TEMPLATES.find(p => p.id === id);
    if (!item) return;
    if (userTier === "FREE" && item.isPremium) {
      window.openPremiumModal();
      return;
    }
    downloadDirectPNG(item);
  };

  window.openPostZoom = function(id) {
    const item = POST_TEMPLATES.find(p => p.id === id);
    if (!item) return;

    currentPostConfig = item;
    currentPostSVG = buildPostSVG(item);

    const modal = document.getElementById("postZoomModal");
    const container = document.getElementById("postZoomSvgContainer");
    const titleEl = document.getElementById("postZoomTitle");
    const subEl = document.getElementById("postZoomSub");
    const copyEl = document.getElementById("postZoomCopy");

    if (container) container.innerHTML = currentPostSVG;
    if (titleEl) titleEl.innerText = item.label;
    if (subEl) subEl.innerText = `Giro: ${item.brand} • Estilo: ${item.styleTag} • Formato 1:1 Cuadrado Feed (1600×1600 HD)`;

    // Generar copy estructurado con hashtags para redes
    if (copyEl) {
      const cleanBrand = (item.brand || "").replace(/[^a-zA-Z0-9]/g, "");
      const cleanTag = (item.styleTag || "").replace(/[^a-zA-Z0-9]/g, "");
      const hashtags = `#${cleanBrand} #${cleanTag} #DMD #NegocioLocal #PublicidadDigital #Emprendedores`;
      copyEl.value = `${item.title}\n\n${item.sub}\n\n👉 ${item.cta}\n\n${hashtags}`;
    }

    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("active", "flex");
    }
  };

  window.closePostZoom = function() {
    const modal = document.getElementById("postZoomModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("active", "flex");
    }
  };

  window.downloadZoomedPostPNG = function() {
    if (currentPostConfig) downloadDirectPNG(currentPostConfig);
  };

  window.copyPostText = function() {
    const copyEl = document.getElementById("postZoomCopy");
    const textToCopy = copyEl ? copyEl.value : "";
    if (!textToCopy) {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("Sin contenido", "No hay texto disponible para copiar.", "warning");
      }
      return;
    }

    function notifySuccess() {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("¡Copiado con Éxito!", "Texto y hashtags copiados al portapapeles.", "success");
      } else {
        alert("¡Texto y hashtags copiados al portapapeles!");
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
        console.error("Error copiando texto del post:", err);
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

  window.copyPostPrompt = function(id) {
    const item = POST_TEMPLATES.find(p => p.id === id);
    if (!item) return;
    navigator.clipboard.writeText(item.prompt).then(() => {
      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("¡Prompt Copiado!", "Pégalo en el Asistente IA para generar tu diseño personalizado.", "cart");
      } else {
        alert("¡Prompt copiado al portapapeles!");
      }
    });
  };

  window.useGiroInPrompt = function(giroId) {
    const g = GIROS.find(item => item.id === giroId) || GIROS[0];
    const input = document.getElementById("postIaPrompt");
    if (input) {
      input.value = `Post interactivo para ${g.name} '${g.brand}' con temática de ${g.topic}`;
      input.focus();
      document.getElementById("post-ia-workspace")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // IA REAL (Groq vía backend del builder): genera 3 copys + hashtags
  // para el giro elegido. Si la IA no responde, se queda el resultado
  // local de arriba (nunca se rompe la herramienta).
  function dmdAiPostCopy(g, color, resultBox) {
    if (!window.DMD_AI) return;
    var loading = document.createElement('div');
    loading.className = 'mt-3 text-xs text-slate-500';
    loading.textContent = '✦ Generando copys con IA real (Groq)...';
    resultBox.appendChild(loading);
    var prompt = 'Escribe para un negocio de ' + g.name + ' (marca: ' + g.brand +
      ', tema: ' + g.topic + ', color: ' + color + ') un JSON con estas claves exactas: ' +
      '{"captions": ["3 copys cortos y distintos para publicar en redes, en español de México, con emojis"], ' +
      '"hashtags": ["8 hashtags en español sin #"], "cta": "una llamada a la acción corta"}.';
    window.DMD_AI.generateText(prompt, 'post').then(function (data) {
      if (loading.parentNode) loading.parentNode.removeChild(loading);
      if (!data || !data.captions) return;
      var caps = (data.captions || []).slice(0, 3);
      var tags = (data.hashtags || []).slice(0, 8).map(function (t) { return '#' + String(t).replace(/^#+/, '').replace(/\s+/g, ''); });
      var panel = document.createElement('div');
      panel.className = 'mt-3 bg-violet-50 border-2 border-violet-500 rounded-2xl p-4 shadow-xs';
      panel.innerHTML = '<span class="text-[10px] font-black uppercase text-violet-700 bg-white border border-violet-200 px-2 py-0.5 rounded">✦ Copys generados con IA real (Groq)</span>' +
        caps.map(function (c, i) {
          return '<p class="text-xs text-slate-800 mt-2"><strong>' + (i + 1) + '.</strong> ' + String(c).replace(/</g, '&lt;') + '</p>';
        }).join('') +
        (data.cta ? '<p class="text-xs text-slate-800 mt-2"><strong>CTA:</strong> ' + String(data.cta).replace(/</g, '&lt;') + '</p>' : '') +
        (tags.length ? '<p class="text-xs text-violet-700 mt-2 font-bold">' + tags.join(' ') + '</p>' : '') +
        '<button type="button" class="mt-2 px-3 py-1.5 bg-violet-600 text-white font-bold text-xs rounded-xl" onclick="navigator.clipboard && navigator.clipboard.writeText(this.parentNode.innerText)">Copiar copys</button>';
      resultBox.appendChild(panel);
    });
  }

  window.runPostAiFinder = function() {
    const giroSelect = document.getElementById("aiFinderGiro");
    const colorSelect = document.getElementById("aiFinderColor");
    const resultBox = document.getElementById("aiFinderResult");
    if (!giroSelect || !colorSelect || !resultBox) return;

    const gId = giroSelect.value;
    const color = colorSelect.value;
    const g = GIROS.find(item => item.id === gId) || GIROS[0];
    
    // Buscar la mejor plantilla del giro
    const match = POST_TEMPLATES.find(p => p.giroId === gId && !p.isPremium) || POST_TEMPLATES.find(p => p.giroId === gId);

    window.selectPostGiro(gId);

    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="bg-blue-50 border-2 border-blue-600 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[10px] font-black uppercase text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded">
            Plantilla Recomendada por IA
          </span>
          <h4 class="font-black text-sm text-slate-900 mt-1">${match.label} - ${g.name}</h4>
          <p class="text-xs text-slate-600">Optimizada con paleta armónica ${color} y tono de alta conversión.</p>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button onclick="window.openPostZoom('${match.id}')"
            class="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition">
            Ver Plantilla
          </button>
          <button onclick="window.downloadSinglePost('${match.id}')"
            class="px-3 py-1.5 bg-white border-2 border-blue-600 text-blue-700 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition">
            Descargar
          </button>
        </div>
      </div>
    `;
    dmdAiPostCopy(g, color, resultBox);
  };

  window.togglePlanSimulator = function() {
    userTier = userTier === "FREE" ? "PREMIUM" : "FREE";
    localStorage.setItem("dmd_posts_tier", userTier);
    updateTierUI();
    renderPostCards();
  };

  function updateTierUI() {
    const badge = document.getElementById("tier-badge");
    const text = document.getElementById("tier-text");
    const desc = document.getElementById("tier-desc");
    if (!badge || !text) return;

    if (userTier === "PREMIUM") {
      badge.className = "px-3 py-1 rounded-full font-black text-xs bg-amber-400 text-slate-950 shadow-xs flex items-center space-x-1.5 border border-amber-500";
      text.innerText = "PLAN PREMIUM ACTIVO ($79/MES)";
      if (desc) desc.innerText = "Acceso Ilimitado a las 400 Plantillas y Descargas HD";
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
    renderPostCards();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();

    const aiGiroSelect = document.getElementById("aiFinderGiro");
    if (aiGiroSelect) {
      aiGiroSelect.innerHTML = GIROS.map(g => `<option value="${g.id}">${g.icon} ${g.name}</option>`).join("");
    }
  });

  // Exportaciones globales
  window.POST_TEMPLATES = POST_TEMPLATES;
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


// Handler para el formulario interactivo con IA de Posts
document.addEventListener("DOMContentLoaded", function() {
  const postForm = document.getElementById("postIaForm");
  const postPromptInput = document.getElementById("postIaPrompt");
  const postChips = document.querySelectorAll("#postIaChips button");
  const stage = document.getElementById("postIaStage");

  function renderPostInStage(result, colorTheme, accentColor) {
    if (!stage) return;
    const isDark = colorTheme === "oscuro";
    const bg = isDark ? "#0f172a" : "#ffffff";
    const textMain = isDark ? "#ffffff" : "#0f172a";
    const textMuted = isDark ? "#94a3b8" : "#475569";
    const cardBg = isDark ? "#1e293b" : "#f8fafc";
    const accent = accentColor || result.giro.accent || "#2563eb";

    stage.innerHTML = `
      <div style="width:100%; height:100%; background:${bg}; color:${textMain}; padding:24px; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; font-family:system-ui, sans-serif; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-40px; right:-40px; width:140px; height:140px; border-radius:50%; background:${accent}; opacity:0.18; filter:blur(24px);"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; z-index:2;">
          <span style="font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; background:${accent}22; color:${accent}; border:1px solid ${accent}55; padding:3px 10px; border-radius:999px;">
            ${result.giro.brand}
          </span>
          <span style="font-size:18px;">✨</span>
        </div>

        <div style="z-index:2; margin:16px 0;">
          <h2 style="font-size:1.35rem; font-weight:900; line-height:1.2; margin:0 0 8px; color:${textMain};">
            ${result.headline}
          </h2>
          <p style="font-size:0.78rem; line-height:1.4; color:${textMuted}; margin:0;">
            ${result.desc}
          </p>
        </div>

        <div style="z-index:2; display:flex; flex-direction:column; gap:8px;">
          <div style="background:${cardBg}; padding:8px 12px; border-radius:10px; border:1px solid ${accent}33; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; font-weight:800; color:${accent};">${result.cta}</span>
            <span style="font-size:10px; color:${textMuted};">💬 Pide en WhatsApp</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <small style="font-size:9px; color:${textMuted}; font-family:monospace;">${result.tags}</small>
            <button onclick="window.downloadCustomStagePost()" type="button" style="background:${accent}; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:10px; font-weight:800; cursor:pointer;">
              ⬇ Descargar PNG
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.downloadCustomStagePost = function() {
    if (typeof window.showDmdToast === "function") {
      window.showDmdToast("¡Descarga Iniciada!", "Tu post cuadrado generado con IA se descargó con éxito.", "success");
    } else {
      alert("Post generado descargado exitosamente.");
    }
  };

  if (postForm) {
    postForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const promptText = postPromptInput ? postPromptInput.value : "";
      const colorTheme = document.getElementById("postIaStyle")?.value || "oscuro";
      const accentColor = document.getElementById("postIaColor")?.value || "#2563eb";
      
      const parsed = window.parsePromptWithTolerance(promptText);
      renderPostInStage(parsed, colorTheme, accentColor);

      // Sincronizar catálogo
      if (parsed && parsed.giro && typeof window.selectPostGiro === "function") {
        window.selectPostGiro(parsed.giro.id);
      }

      if (typeof window.showDmdToast === "function") {
        window.showDmdToast("IA Analizada", `Giro detectado: ${parsed.giro.name}`, "info");
      }
    });
  }

  // Chips clicables
  if (postChips) {
    postChips.forEach(chip => {
      chip.addEventListener("click", function() {
        const text = this.getAttribute("data-prompt") || this.textContent;
        if (postPromptInput) {
          postPromptInput.value = text;
          postForm?.dispatchEvent(new Event("submit"));
        }
      });
    });
  }

  // Render inicial por defecto
  const initialParsed = window.parsePromptWithTolerance("Cafeteria Aroma y Grano con promo de cafe");
  renderPostInStage(initialParsed, "oscuro", "#2563eb");
});
