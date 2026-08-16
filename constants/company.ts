// Company + contact + faq + cookie + seo — identidad y meta globales.
export const company = {
  name: "Bartez Tecnología",
  shortName: "Bartez",
  tagline: "Distribución IT para empresas y revendedores.",
  description:
    "Distribuimos equipamiento, infraestructura y soluciones tecnológicas para empresas, organismos y revendedores en toda Argentina. Dieciocho años de experiencia y atención comercial directa por WhatsApp.",
  legalName: "Bartez Tecnología",
  legalNotice: "Responsable Inscripto",
  cuit: "20-21774424-6",
  taxCondition: "Responsable Inscripto · Factura A",
  city: "Rosario",
  province: "Santa Fe",
  country: "Argentina",
  address: "9 de Julio 3418, Rosario, Santa Fe",
  geo: { lat: -32.9481114, lng: -60.6717758 }, // 9 de Julio 3418, Echesortu, Rosario (geocodificado)
  url: "https://bartez.com.ar",
  founded: "2008",
  experienceYears: "18",
  clients: "10.000+",
  channels: ["Empresas", "Revendedores", "Sector público", "Educación"],
};

export const contact = {
  // Reemplazar por datos reales en producción
  whatsappNumber: "5493416684350",
  whatsappMessage:
    "Hola, vengo de la web y necesito asesoramiento para mi empresa.",
  email: "ventas@bartez.com.ar",
  phoneDisplay: "+54 9 341 668-4350",
  hours: "Lunes a Viernes · 9 a 18 hs",
  social: {
    linkedin: "https://www.linkedin.com/company/bartez",
    instagram: "https://www.instagram.com/bartez",
  },
};

export const faq = {
  num: "08",
  eyebrow: "Preguntas frecuentes",
  title: "Lo que más nos consultan.",
  items: [
    { q: "¿Qué tipo de clientes atienden?", a: "Trabajamos con empresas, organismos públicos y privados, instituciones educativas y revendedores en diferentes puntos de Argentina. Dieciocho años en el rubro nos permiten adaptarnos a cada necesidad con asesoramiento personalizado." },
    { q: "¿Trabajan en todo el país?", a: "Sí. Distribuimos y coordinamos proyectos en distintas localidades de Argentina. Desde Rosario gestionamos operaciones a nivel nacional." },
    { q: "¿Emiten Factura A?", a: "Sí. Bartez es Responsable Inscripto y emite Factura A para empresas y organismos." },
    { q: "¿Cómo arman una solución?", a: "Primero relevamos el problema, la escala, la urgencia y el entorno actual. Con ese contexto, nuestro equipo propone el alcance y las alternativas tecnológicas que mejor se adaptan." },
    { q: "¿Puedo consultar sin saber exactamente qué necesito?", a: "Sí. No necesitás llegar con modelos ni cantidades definidas. El equipo puede ayudarte a traducir tu necesidad en una solución tecnológica concreta." },
    { q: "¿Trabajan con revendedores o distribuidores?", a: "Sí. Contamos con un canal de distribución activo. Si sos revendedor y querés sumar los productos Bartez a tu oferta, visitá nuestra sección de Revendedores o escribinos directamente." },
    { q: "¿Ofrecen financiación?", a: "Sí. Trabajamos con cuenta corriente y condiciones comerciales acordes a cada cliente. Factura A en todas las operaciones." },
  ],
};

export const cookie = {
  text: "Usamos cookies para mejorar tu experiencia y medir el tráfico del sitio.",
  accept: "Aceptar",
  reject: "Rechazar",
};

export const seo = {
  title: "Bartez Tecnología — Distribución IT para empresas y revendedores",
  description:
    "Equipamiento, infraestructura y soluciones IT para empresas, organismos y revendedores. Dieciocho años en el rubro, más de 10.000 clientes y cobertura nacional desde Rosario.",
  keywords: [
    "distribuidora IT Argentina",
    "soluciones IT para empresas",
    "distribuidor tecnología Rosario",
    "infraestructura tecnológica Rosario",
    "asesoramiento IT B2B",
    "servidores y redes empresariales",
    "servicios tecnológicos Argentina",
    "distribuidor notebooks corporativas",
    "revendedor tecnología Argentina",
    "punto de venta electrónico BarPOS",
  ],
  ogImage: "/opengraph-image",
};
