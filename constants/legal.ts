// Páginas legales — /legales/[slug].
export type LegalPage = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string }[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacidad",
    title: "Política de privacidad",
    updated: "2026-06-21",
    intro:
      "En Bartez Tecnología respetamos tu privacidad. Esta política explica qué datos personales recolectamos a través de este sitio, con qué finalidad y cómo los protegemos, en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina.",
    sections: [
      { h: "1. Responsable del tratamiento", p: "Bartez Tecnología es un nombre comercial de Benítez, Andrés (Responsable Inscripto, CUIT 20-21774424-6), con domicilio en 9 de Julio 3418, Rosario, Santa Fe, Argentina. Benítez, Andrés es responsable del tratamiento de los datos recolectados en este sitio. Ante cualquier consulta podés escribirnos a ventas@bartez.com.ar." },
      { h: "2. Qué datos recolectamos", p: "Recolectamos los datos que completás voluntariamente en nuestros formularios de contacto, cotización y descargas: razón social, nombre, email corporativo, teléfono, tipo de consulta y el mensaje o detalle del pedido. También recopilamos datos de navegación de forma anónima mediante herramientas de analítica." },
      { h: "3. Finalidad", p: "Usamos tus datos exclusivamente para responder tu consulta, elaborar cotizaciones, gestionar tu cuenta corporativa y mejorar nuestros servicios. No vendemos ni cedemos tus datos a terceros con fines comerciales ajenos a Bartez." },
      { h: "4. Terceros y encargados", p: "Para operar el sitio y gestionar las consultas utilizamos proveedores que actúan como encargados del tratamiento: plataformas de CRM (Apollo, monday.com), envío de correo (Resend), hosting (Vercel) y analítica (Google Analytics, Microsoft Clarity). Estos proveedores tratan los datos únicamente para prestarnos el servicio." },
      { h: "5. Cookies", p: "Utilizamos cookies propias y de terceros para recordar tus preferencias y medir el tráfico del sitio de forma agregada. Podés aceptarlas o rechazarlas desde el aviso de cookies, y configurar tu navegador para bloquearlas." },
      { h: "6. Conservación", p: "Conservamos tus datos durante el tiempo necesario para gestionar tu consulta y la relación comercial, y luego durante los plazos legales aplicables." },
      { h: "7. Tus derechos", p: "Podés ejercer en cualquier momento tus derechos de acceso, rectificación, actualización y supresión de tus datos escribiendo a ventas@bartez.com.ar. La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326, atiende denuncias relacionadas con el incumplimiento de las normas sobre protección de datos personales." },
      { h: "8. Cambios", p: "Podemos actualizar esta política. Publicaremos cualquier cambio en esta misma página con su fecha de actualización." },
    ],
  },
  {
    slug: "terminos",
    title: "Términos de uso",
    updated: "2026-06-21",
    intro:
      "Estos términos regulan el uso del sitio web de Bartez Tecnología. Al navegar y utilizar este sitio, aceptás las condiciones que se describen a continuación.",
    sections: [
      { h: "1. Titular del sitio", p: "El sitio web bartez.com.ar es operado bajo el nombre comercial 'Bartez Tecnología' por Benítez, Andrés (Responsable Inscripto, CUIT 20-21774424-6), con domicilio fiscal en 9 de Julio 3418, Rosario, Santa Fe, Argentina. Toda referencia a 'Bartez', 'Bartez Tecnología' o 'nosotros' en estos términos se refiere a Benítez, Andrés." },
      { h: "2. Objeto del sitio", p: "Este sitio presenta las capacidades, servicios y áreas de trabajo de Bartez Tecnología. No es una tienda online ni publica ofertas vinculantes." },
      { h: "3. Propuestas comerciales", p: "Las propuestas se preparan a pedido y sus condiciones se informan en cada documento comercial. Ninguna información del sitio constituye una oferta vinculante." },
      { h: "4. Uso permitido", p: "Podés usar este sitio con fines informativos y para contactarnos. No está permitido utilizarlo para fines ilícitos, ni intentar dañar, sobrecargar o vulnerar la seguridad del sitio o de sus sistemas." },
      { h: "5. Propiedad intelectual", p: "Los contenidos, marcas, logos y diseños del sitio pertenecen a Benítez, Andrés (Bartez Tecnología) o a sus respectivos titulares. Las marcas de los fabricantes (Dell, Lenovo, HP, Cisco, etc.) pertenecen a sus dueños y se muestran a título informativo de los productos que distribuimos." },
      { h: "6. Limitación de responsabilidad", p: "Procuramos que la información del sitio sea correcta y esté actualizada, pero no garantizamos que esté libre de errores. Bartez no será responsable por daños derivados del uso del sitio o de la imposibilidad de acceder a él." },
      { h: "7. Enlaces y servicios de terceros", p: "El sitio puede integrar servicios de terceros (mapas, formularios, analítica). El uso de esos servicios se rige por sus propias condiciones y políticas." },
      { h: "8. Ley aplicable y jurisdicción", p: "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a los tribunales ordinarios de la ciudad de Rosario, Santa Fe." },
      { h: "9. Contacto", p: "Por cualquier consulta sobre estos términos, escribinos a ventas@bartez.com.ar." },
    ],
  },
];
