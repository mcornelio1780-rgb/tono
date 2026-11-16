/* =====================================================================
   TONO · CONFIGURACIÓN ÚNICA
   Es el ÚNICO archivo que tienes que editar para conectar la web.
   Todo lo de aquí es público por diseño (Firebase y Polar lo permiten):
   NO pongas aquí contraseñas, tokens de Polar ni claves secretas.
   Sin Firebase la web funciona igual: estudio abierto sin cuenta, formularios
   enviados a tu correo y compra con Polar (cuando pegues los links).
   Al pegar Firebase se activan las cuentas, Google y la base de datos.
   ===================================================================== */
window.TONO_CONFIG = {

  /* 1) EMPRESA (aparece en las páginas legales y el pie) */
  company: {
    legalName: "Limly LLC",
    brand: "Tono",
    address: "8 The Green, Suite B, Dover, DE 19901, United States",
    email: "manyosa@limly.io",       // correo de contacto público
    privacyEmail: "manyosa@limly.io", // correo para temas de datos e IA
    site: "https://tono.ink"          // ← tu dominio final (o el de Cloudflare/Vercel)
  },

  /* MODO DEMO: true solo para probar en tu computadora (claves TONO-DEMO-*, aviso amarillo).
     En la web publicada déjalo en false. */
  demo: false,

  /* 2) FIREBASE (cuentas, Google, verificación por correo y base de datos)
        Firebase > Configuración del proyecto > Tus apps > Web > copia el objeto */
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  firebaseVersion: "13.1.0",   // la versión que muestre el fragmento de la consola de Firebase

  /* 3) POLAR (cobros). Pega aquí lo que te pide la guía. */
  polar: {
    sandbox: false,               // true = modo pruebas de Polar (tarjetas de prueba)
    organizationId: "",           // Settings > Organization ID (formato uuid)
    portalUrl: "",                // ej. https://polar.sh/limly/portal
    checkout: {                   // Checkout Links (uno por producto)
      pack:   "",                 // ej. https://buy.polar.sh/polar_cl_xxxxxxxx
      pro:    "",
      agency: ""
    },
    benefits: {                   // ID del beneficio "License Key" de cada producto
      pack:   "",
      pro:    "",
      agency: ""
    }
  },

  /* 3b) ADMIN: correos que ven la pestaña "Pedidos" en el estudio */
  adminEmails: ["manyosa@limly.io"],

  /* 4) LÍMITES DE CADA PLAN (voces distintas que se pueden empaquetar) */
  planVoices: { pack: 1, pro: 1, agency: 5 },

  /* 5) AVISO POR CORREO (gratis, vía FormSubmit). Cada contacto, suscripción a la lista
        y pedido Pro te llega a este correo. Mientras Firebase no esté conectado, es el
        ÚNICO lugar donde se guardan, así que no lo dejes vacío.
        El primer envío trae un correo de FormSubmit para confirmar: ábrelo una vez. */
  notifyEmail: "manyosa@limly.io"
};
