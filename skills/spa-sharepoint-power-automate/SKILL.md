---
name: spa-sharepoint-power-automate
description: >-
  Use when building, extending or troubleshooting public no-login web apps (React/Vite SPA or static HTML/PWA on
  GitHub Pages) that send data to SharePoint through a Power Automate HTTP-trigger flow (inspection /
  field-operations apps), and for any Power Automate + SharePoint pipeline problem: 'Who can trigger the flow'
  default breaking a public SPA (401/403, empty run history), Premium licensing
  (DirectApiAuthorizationRequired), 120 s / 100 MB limits and 502/504, auto-suspended flows, Get items 100/5,000
  thresholds and pagination, 429 throttling and Retry-After, try/catch/Terminate and silent failures after an
  early Response, idempotent retries, solutions + connection references + environment variables, flows-as-code
  (import package, admin API, run history), SharePoint REST column setup, PWA/service worker/Wake Lock/Web Push,
  GitHub Pages deploy, and the unified error catalog. This file is an index: open the referenced file for the
  section you need.
---

# SPA → Power Automate → SharePoint pipeline

End-to-end reference for building **public, no-login** web apps that let visitors submit structured data + attachments to a SharePoint list. The owner's identity (and Microsoft 365 tenant) is provided by the Power Automate flow; visitors never authenticate.

## Architecture

```
[Public visitor]
   │  HTTPS POST (JSON)
   ▼
[GitHub Pages SPA]  ──VITE_POWER_AUTOMATE_URL──▶  [Power Automate HTTP trigger]
                                                          │
                                                          ├─▶ Create item (SharePoint Inspecciones)
                                                          ├─▶ Add attachment × N (SP Inspecciones)
                                                          ├─▶ Create item (SP ChecklistItems, lookup parent)
                                                          └─▶ Send email V2 (Outlook)
```

**Why this shape**: visitors can't be given SP credentials, but the flow runs as a real M365 user (the flow owner) and creates items on their behalf. The HTTP trigger is the only public surface.

## Project layout

```
repo/
├── web-app/                      # React + Vite SPA
│   ├── src/
│   │   ├── components/InspectionForm.tsx
│   │   ├── components/SignaturePad.tsx
│   │   ├── lib/pdfGenerator.ts
│   │   ├── lib/imageUtils.ts
│   │   ├── lib/draftStorage.ts
│   │   ├── lib/inspectorProfile.ts
│   │   ├── services/uploadInspeccion.ts
│   │   └── App.tsx
│   ├── public/
│   │   ├── app-logo.png
│   │   ├── manifest.json
│   │   └── sw.js
│   └── vite.config.ts            # base: VITE_BASE
├── sharepoint/
│   └── Setup-AllColumns-*.ps1    # Idempotent column creation (device code auth)
├── power-automate/
│   └── Flow-*.md                 # Flow design as docs (Power Automate has no source format)
└── .github/workflows/deploy-pages.yml
```

---

# Cómo usar esta skill

Esta skill se dividió (2026-09-24) en un índice liviano y `references/` con el detalle. **No leas todo:** buscá tu caso, abrí el archivo y andá a la sección. Los números `§N` de todo el texto siguen siendo válidos y se resuelven con la tabla de más abajo.

## Router: del problema al archivo

| Estoy… / me pasa… | Ir a |
|---|---|
| Arrancando un proyecto nuevo | `06` §16 (orden de construcción) → `03` §9 (plantilla del flow) → `04` §10 (columnas) |
| La SPA no llega al flow: **401/403**, Run history vacío, flow nuevo que no recibe nada | `09` §21.1 (quién puede disparar el trigger) |
| `DirectApiAuthorizationRequired` / "service plan adequate" / licencias | `09` §21.2 |
| El flow "dejó de andar" solo / aparece apagado | `09` §21.3 |
| **502/504**, "NoResponse", flow lento, límite de tamaño | `09` §21.4 y `03` §9 (`Respuesta` antes de los loops) |
| Se guardó el ítem pero faltan adjuntos/hijos/correo, o la corrida está verde y algo falló | `10` §22 (Try/Catch, `Terminate`, `Foreach`) |
| Duplicados de folio, reintentos, concurrencia | `10` §22.3–22.4 |
| Un error concreto (texto del mensaje) | `06` §17 (catálogo) y `10` §22.8 (filas nuevas) |
| Listas grandes, `Get items` trae 100, filtro que devuelve vacío, umbral 5.000 | `11` §23 |
| Scripts/REST a SharePoint: 429/503, `Retry-After`, escritura masiva | `11` §23.4–23.6 y `04` §18 |
| Crear listas/columnas por REST, lookups, codificación UTF-8 | `04` §10 |
| Flow como código: paquete `.zip`, API de administración, historial de corridas | `08` §20 |
| Entornos dev/prod, conexiones que se caen, variables de entorno, soluciones | `12` §24 |
| Documentar/auditar un flow ("qué lee y qué escribe", "qué se rompe si cambio la columna") | `12` §24.5 (skill `power-automate-documentation`) |
| Seguridad de un endpoint público sin login | `01` §1 y `07` §19.4 |
| Formularios, React, imágenes, GPS, firma, PDF, Service Worker | `02` §2–§7 |
| Contrato del payload SPA ↔ flow | `03` §8 |
| GitHub Pages: deploy, despliegue trabado, verificar que está en vivo | `05` §11 |
| PWA operativa en el celular (Wake Lock, push, máquina de estados) | `07` §19 |
| "¿Instalamos esta skill/herramienta/servicio de terceros?" | `13` §25 |

## Índice: número de sección → archivo

| § | Tema | Archivo (en `references/`) |
|---|---|---|
| 1 | Modelo de seguridad | `01-seguridad.md` |
| 2–7 | SPA: Vite/Pages, React, formularios, imágenes/GPS/firma/PDF, persistencia, Service Worker | `02-spa-cliente.md` |
| 8–9 | Contrato SPA↔flow · Power Automate (plantilla del flow, trampas del diseñador) | `03-contrato-y-flow.md` |
| 10, 18 | SharePoint: listas y columnas por REST · sincronización masiva Excel→SP | `04-sharepoint.md` |
| 11–12 | GitHub Pages · credenciales / device code | `05-deploy-y-credenciales.md` |
| 13–17 | Monitoreo, testing, diagnóstico, orden de construcción, **catálogo de errores** | `06-operacion-y-errores.md` |
| 19 | PWA operativa | `07-pwa-operativa.md` |
| 20 | Flows como código | `08-flows-como-codigo.md` |
| **21** | **Trigger HTTP, licencias, límites, apagado automático** *(nuevo)* | `09-licencias-limites-trigger.md` |
| **22** | **Resiliencia: Try/Catch, reintentos, concurrencia, datos sensibles** *(nuevo)* | `10-resiliencia-y-errores-flow.md` |
| **23** | **SharePoint a escala: umbrales, paginación, throttling** *(nuevo)* | `11-lecturas-sharepoint-a-escala.md` |
| **24** | **Soluciones, connection references, variables de entorno, auditoría** *(nuevo)* | `12-alm-soluciones-y-auditoria.md` |
| **25** | **Herramientas de terceros evaluadas** *(nuevo)* | `13-decisiones-de-herramientas.md` |

## Reglas que no se negocian

Las que más cuestan cuando se olvidan. Cada una remite a la sección con el porqué.

1. **El trigger va en `Anyone`** para una SPA sin login. El default de un flow nuevo es "Any user in my tenant" y devuelve 401 al navegador (§21.1).
2. **`Content-Type: application/json`** en el POST, **schema del trigger vacío**, y **siempre pestaña `fx Expression`**, nunca chips (§9).
3. **`Respuesta` (200) antes de los loops**, y **toda rama termina en `Response`**; si no, 502 por los 120 s o un `202` silencioso (§9, §20.4, §21.4).
4. **Lo que falla después de responder no se entera el usuario:** `Catch` con aviso + `Terminate → Failed`, o la corrida queda verde (§22.1).
5. **El correo va en la raíz del flow**, no dentro del loop (§9). **Adjuntos con concurrencia 1** (§9, §22.3).
6. **Nada sensible en `VITE_*`:** todo lo que va en el bundle es público (§1). La URL del trigger y `x-app-key` **no son secretos**.
7. **Toda regla con consecuencia legal o económica se valida en el flow**, con `utcNow()` del servidor; el botón deshabilitado del HTML es comodidad, no control (§19.4).
8. **Los reintentos duplican:** folio único (idempotencia) antes de reintentar un `Create item` (§22.4).
9. **Listas que van a crecer:** columnas de filtro **indexadas**, `Pagination` activa, filtro en el servidor (§23.2).
10. **En scripts, respetar `Retry-After`** ante 429/503; nunca reintentar en caliente (§23.4).
11. **Cuerpos hacia SharePoint en UTF-8 (bytes)**, `InternalName` ASCII distinto de los nombres ocultos por defecto (§10, §17).
12. **`clearDraft()` solo después de una respuesta OK** (§6). El usuario no pierde lo que cargó.
13. **Verificar que el deploy está en vivo** (bundle con la cadena nueva) antes de decir "ya está" (§11, §15).
14. **Exportar y commitear el paquete del flow** tras cada cambio relevante (§9). Anotar dueño y licencia que lo cubre (§21.6).
15. **No decir "probado" sin decir qué se probó:** `tsc` verde no es prueba de que el formulario funcione (§14).

## Mantener esta skill

- Un aprendizaje nuevo va **en el archivo de su tema**, con su fila en el catálogo de errores (§17 o §22.8) y, si cambia una regla, en la lista de arriba. Este archivo se mantiene **corto** (índice + reglas + router).
- Los datos de plataforma que cambian (cuotas, defaults del diseñador) llevan **fuente** y fecha. Revalidar contra Microsoft Learn antes de citarlos en un documento formal.
- La versión anterior era un único archivo de 144 KB; la división en `references/` se verificó por reconstrucción exacta (sin pérdida de contenido).

## Historial

- **2026-09-24** — Se divide el monolito de 2.654 líneas en índice + 8 archivos de referencia (contenido idéntico; `§1–§20` intactos). Descripción acortada (de ~2.000 a ~1.000 caracteres). Nuevos: §21 trigger/licencias/límites, §22 resiliencia, §23 SharePoint a escala, §24 ALM y auditoría, §25 registro de herramientas evaluadas. Datos verificados contra Microsoft Learn el mismo día.
