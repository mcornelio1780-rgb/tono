# Tono · web (landing + estudio)

Sitio estático de Tono, de Limly LLC. No necesita compilarse.

| Archivo | Qué es |
|---|---|
| `index.html` | Landing ES/EN/PT/FR: ingreso, compra, contacto, lista |
| `app.html` | Estudio (MVP): cuenta, análisis, Voice Pack, licencia Polar, packs guardados |
| `legal.html` | Términos, Privacidad, Uso de IA y regulación (4 idiomas) |
| `admin.html` | Panel privado: contactos, lista, pedidos Pro, exportar CSV |
| `config.js` | **Único archivo a editar** (Firebase, Polar, empresa, admins) |
| `tono-core.js` | Cuentas (Firebase), base de datos, licencias y checkout |
| `api/license.js` | Validación de licencias en Vercel |
| `functions/api/license.js` | Validación de licencias en Cloudflare Pages |
| `firestore.rules` | Reglas de seguridad para pegar en Firebase |
| `vercel.json`, `_headers` | Ajustes de hosting |

## Cómo funciona según lo que conectes en config.js
| Conectado | Qué pasa |
|---|---|
| Nada (así se publica hoy) | Estudio abierto sin cuenta. Formularios llegan a `notifyEmail`. "Comprar" invita a dejar el correo. Sin aviso amarillo. |
| Links de Polar | "Comprar" va a Polar. La licencia desbloquea el pack y queda guardada en el navegador del cliente. |
| Firebase | Aparece "Ingresar": cuentas con correo (con verificación) y Google, packs en la nube, panel admin con datos. |

`demo: true` solo para probar en tu computadora (claves `TONO-DEMO-PACK`, `TONO-DEMO-PRO`, `TONO-DEMO-AGENCY`).

## Publicar
Sube el contenido de esta carpeta (con `index.html` en la raíz) a un repositorio de GitHub y conéctalo a
Cloudflare Pages (preset None, sin build, salida `/`) o a Vercel (Other, sin build).
El plan gratis de Vercel no permite uso comercial; Cloudflare Pages sí.

Pasos detallados: guía "Tono · Guía de lanzamiento: Polar, Firebase y publicación".
