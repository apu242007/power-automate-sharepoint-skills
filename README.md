# power-automate-sharepoint-skills

Skill para agentes de código (Claude Code, Codex, Copilot, Gemini CLI, Cline y otros) con la experiencia acumulada de construir **aplicaciones web públicas sin login que envían datos a SharePoint mediante un flow de Power Automate**, y de operar ese pipeline en producción.

> **English summary:** an agent skill covering the full *SPA → Power Automate HTTP trigger → SharePoint* pipeline (React/Vite or static PWA on GitHub Pages): trigger auth defaults, Premium licensing, request limits, silent failures after an early `Response`, idempotent retries, `Get items` thresholds and pagination, 429/`Retry-After` handling, flows-as-code (import package + admin API + run history), SharePoint REST setup, solutions/connection references/environment variables, and a unified error catalog. Content is in Spanish (with English in parts).

## Instalar

```bash
npx skills add https://github.com/apu242007/power-automate-sharepoint-skills --skill spa-sharepoint-power-automate
```

Abrí una sesión nueva del agente para que la cargue. Revisá siempre el contenido de una skill antes de instalarla: corre con los permisos de tu agente.

## Qué hay adentro

`SKILL.md` es un **índice liviano** (router "problema → archivo" y 15 reglas que no se negocian). El detalle está en `references/` y el agente abre solo lo que necesita.

| § | Tema | Archivo |
|---|---|---|
| 1 | Modelo de seguridad de un endpoint público | `01-seguridad.md` |
| 2–7 | SPA: Vite/GitHub Pages, React, formularios, imágenes/GPS/firma/PDF, persistencia, Service Worker | `02-spa-cliente.md` |
| 8–9 | Contrato SPA↔flow y armado del flow | `03-contrato-y-flow.md` |
| 10, 18 | SharePoint por REST y sincronización masiva Excel → SP | `04-sharepoint.md` |
| 11–12 | GitHub Pages y credenciales / device code | `05-deploy-y-credenciales.md` |
| 13–17 | Operación, diagnóstico, orden de construcción y **catálogo de errores** | `06-operacion-y-errores.md` |
| 19 | PWA operativa para uso en la calle | `07-pwa-operativa.md` |
| 20 | Flows como código: paquete, API de administración, trampas de runtime | `08-flows-como-codigo.md` |
| 21 | Trigger HTTP, licencias, límites, apagado automático | `09-licencias-limites-trigger.md` |
| 22 | Resiliencia: Try/Catch, reintentos, concurrencia, datos sensibles | `10-resiliencia-y-errores-flow.md` |
| 23 | SharePoint a escala: umbrales, paginación, throttling | `11-lecturas-sharepoint-a-escala.md` |
| 24 | Soluciones, connection references, variables de entorno, auditoría | `12-alm-soluciones-y-auditoria.md` |
| 25 | Registro de herramientas de terceros evaluadas | `13-decisiones-de-herramientas.md` |

### Lo que la distingue

- **Trampas que solo aparecen en runtime**, con su síntoma exacto: `PatchItem` que exige todas las columnas obligatorias, `Choice`/`Hyperlink` que llegan como objeto **o** cadena y tiran el `Select` entero con 502, `Initialize variable` solo en la raíz, ramas sin `Response` que devuelven un `202` silencioso, flow con nombre duplicado que hace que un *Update* aterrice en el flow equivocado.
- **Flows como código**: generar el paquete de importación, aplicar la definición por la API de administración y leer el error por acción del historial de corridas, sin abrir el diseñador.
- **Datos de plataforma verificados** contra Microsoft Learn (§21–§24), con fuente y fecha. Por ejemplo, que el default de "Who can trigger the flow" en flows nuevos es *Any user in my tenant* y por eso una SPA pública recibe 401 hasta que se cambia a *Anyone*.
- **Autenticación sin app propia para scripts de desarrollo** (§18.1, §20.2): ver el aviso de uso responsable más abajo.

## Uso responsable de la autenticación con cliente de Microsoft (§18.1 y §20.2)

Esas secciones documentan una técnica de token **delegado** con un cliente público de Microsoft ya consentido y flujo de código de dispositivo. Está pensada para quien desarrolla automatización con **su propio acceso** y se traba en el consentimiento por app. Tené en cuenta:

- El token solo puede hacer lo que la persona que inicia sesión ya puede hacer. No otorga permisos extra.
- No reemplaza la vía correcta para producción: una app registrada con permisos aprobados (idealmente `Sites.Selected`).
- Es **visible** en los logs de inicio de sesión de Entra, puede bloquearse por acceso condicional o deshabilitando el código de dispositivo, y Microsoft puede cambiar la preautorización del cliente cuando quiera.
- Confirmá que la política de tu organización lo permite. Tratá el refresh token como una contraseña.

## Alcance y límites

- Es experiencia de campo más lectura de documentación, **no documentación oficial** ni producto de Microsoft; no tiene relación con Microsoft ni con ninguna de las herramientas mencionadas.
- Las cuotas, límites y valores por defecto de la plataforma **cambian**. Cada dato de §21–§24 lleva su fuente: revalidá antes de citarlo en un documento formal.
- Ejemplos y textos están en español rioplatense; hay elementos propios de Argentina (formato de patente, feriados).
- Los datos de empresa fueron reemplazados por marcadores genéricos (`tenant-a`, `usuario@empresa.com`, `x-app-key`).

## Contribuir

Issues y pull requests bienvenidos, sobre todo:

- Nuevas trampas de runtime con **síntoma exacto**, causa y arreglo verificado.
- Correcciones de datos que hayan cambiado en la plataforma (con enlace a la fuente).
- Traducciones de secciones al inglés.

No incluyas datos de tu organización (tenants, correos, URLs de trigger con firma `sig=`, identificadores internos).

## Licencia

[MIT](LICENSE)
